const ShoppingCart = require('../models/ShoppingCart');
const ShoppingCartItem = require('../models/ShoppingCartItem');
const ShopOrder = require('../models/ShopOrder');
const OrderLine = require('../models/OrderLine');
const ProductItem = require('../models/ProductItem');

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await ShoppingCart.findOne({ user: userId });
    if (!cart) return res.status(400).json({ message: 'Cart is empty' });
    const items = await ShoppingCartItem.find({ cart: cart._id }).populate('product_item');
    if (!items.length) return res.status(400).json({ message: 'Cart has no items' });

    // Basic order creation: uses provided payment_method, shipping_address, shipping_method
    const { payment_method, shipping_address, shipping_method } = req.body;

    // calculate total and check stock
    let total = 0;
    for (const it of items) {
      if (it.product_item.qty_in_stock < it.qty) return res.status(400).json({ message: `Insufficient stock for item ${it.product_item._id}` });
      total += (it.product_item.price * it.qty);
    }

    const order = await ShopOrder.create({
      user: userId,
      payment_method,
      shipping_address,
      shipping_method,
      order_total: total
    });

    // create order lines and reduce stock
    for (const it of items) {
      await OrderLine.create({
        product_item: it.product_item._id,
        order: order._id,
        qty: it.qty,
        price: it.product_item.price
      });
      it.product_item.qty_in_stock -= it.qty;
      await it.product_item.save();
    }

    // clear cart
    await ShoppingCartItem.deleteMany({ cart: cart._id });

    res.status(201).json({ order_id: order._id, total });
  } catch (err) { next(err); }
};

exports.listOrders = async (req, res, next) => {
  try {
    const orders = await ShopOrder.find({ user: req.user._id }).populate('order_status').sort('-createdAt');
    res.json(orders);
  } catch (err) { next(err); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await ShopOrder.findOne({ _id: req.params.id, user: req.user._id }).populate('order_status');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const lines = await OrderLine.find({ order: order._id }).populate({ path: 'product_item', populate: { path: 'product' }});
    res.json({ order, lines });
  } catch (err) { next(err); }
};
