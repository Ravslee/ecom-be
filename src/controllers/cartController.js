const ShoppingCart = require('../models/ShoppingCart');
const ShoppingCartItem = require('../models/ShoppingCartItem');
const ProductItem = require('../models/ProductItem');

async function getOrCreateCart(userId) {
  let cart = await ShoppingCart.findOne({ user: userId });
  if (!cart) cart = await ShoppingCart.create({ user: userId });
  return cart;
}

exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const items = await ShoppingCartItem.find({ cart: cart._id }).populate({ path: 'product_item', populate: { path: 'product' } });
    res.json({ cart, items });
  } catch (err) { next(err); }
};

exports.addItem = async (req, res, next) => {
  try {
    const { product_item_id, qty=1 } = req.body;
    if (!product_item_id) return res.status(400).json({ message: 'product_item_id required' });
    const productItem = await ProductItem.findById(product_item_id);
    if (!productItem) return res.status(404).json({ message: 'Product item not found' });
    if (productItem.qty_in_stock < qty) return res.status(400).json({ message: 'Not enough stock' });
    const cart = await getOrCreateCart(req.user._id);
    let item = await ShoppingCartItem.findOne({ cart: cart._id, product_item: productItem._id });
    if (item) {
      item.qty += Number(qty);
      await item.save();
    } else {
      item = await ShoppingCartItem.create({ cart: cart._id, product_item: productItem._id, qty });
    }
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;
    const item = await ShoppingCartItem.findById(id).populate('product_item');
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    if (qty <= 0) { await item.remove(); return res.json({}); }
    if (item.product_item.qty_in_stock < qty) return res.status(400).json({ message: 'Not enough stock' });
    item.qty = qty;
    await item.save();
    res.json(item);
  } catch (err) { next(err); }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await ShoppingCartItem.findById(id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    await item.remove();
    res.json({ ok: true });
  } catch (err) { next(err); }
};
