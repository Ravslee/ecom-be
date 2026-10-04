const ShoppingCart = require("../models/ShoppingCart");
const ShoppingCartItem = require("../models/ShoppingCartItem");
const ShopOrder = require("../models/ShopOrder");
const OrderLine = require("../models/OrderLine");
const ProductItem = require("../models/ProductItem");
const ShippingMethod = require("../models/ShippingMethod");
const OrderStatus = require("../models/OrderStatus");
const { getActivePromotionForCategory } = require("../utils/promotionHelper");

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await ShoppingCart.findOne({ user: userId });
    if (!cart) return res.status(400).json({ message: "Cart is empty" });
    const items = await ShoppingCartItem.find({ cart: cart._id }).populate({
      path: "product_item",
      populate: { path: "product" },
    });
    if (!items.length) return res.status(400).json({ message: "Cart has no items" });

    const { payment_method, shipping_address, shipping_method } = req.body;

    if (!shipping_address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // calculate total item price and verify stock with promotion discounts
    let subtotal = 0;
    const itemPurchasedPrices = [];

    for (const it of items) {
      if (!it.product_item) {
        return res.status(400).json({ message: "Invalid product item in cart" });
      }
      if (it.product_item.qty_in_stock < it.qty) {
        return res.status(400).json({
          message: `Insufficient stock for item SKU ${it.product_item.SKU || it.product_item._id}`,
        });
      }

      let effectiveUnitPrice = it.product_item.price;
      const categoryId = it.product_item.product?.category;
      if (categoryId) {
        const promotion = await getActivePromotionForCategory(categoryId);
        if (promotion && promotion.discount_rate > 0) {
          effectiveUnitPrice = Number(
            (it.product_item.price * (1 - promotion.discount_rate / 100)).toFixed(2)
          );
        }
      }

      subtotal += effectiveUnitPrice * it.qty;
      itemPurchasedPrices.push({
        product_item: it.product_item,
        unit_price: effectiveUnitPrice,
        qty: it.qty,
      });
    }

    let shippingCost = 0;
    let selectedShipping = null;
    if (shipping_method) {
      selectedShipping = await ShippingMethod.findById(shipping_method);
      if (selectedShipping) {
        shippingCost = selectedShipping.price || 0;
      }
    }

    // find or fallback default order status 'Pending'
    let defaultStatus = await OrderStatus.findOne({ status: "Pending" });
    if (!defaultStatus) {
      defaultStatus = await OrderStatus.create({ status: "Pending" });
    }

    const order_total = Number((subtotal + shippingCost).toFixed(2));

    const order = await ShopOrder.create({
      user: userId,
      payment_method: payment_method || null,
      shipping_address,
      shipping_method: selectedShipping ? selectedShipping._id : null,
      order_total,
      order_status: defaultStatus._id,
    });

    // create order lines and reduce stock
    for (const entry of itemPurchasedPrices) {
      await OrderLine.create({
        product_item: entry.product_item._id,
        order: order._id,
        qty: entry.qty,
        price: entry.unit_price,
      });
      entry.product_item.qty_in_stock -= entry.qty;
      await entry.product_item.save();
    }

    // clear cart
    await ShoppingCartItem.deleteMany({ cart: cart._id });

    res.status(201).json({
      order_id: order._id,
      subtotal,
      shipping_cost: shippingCost,
      total: order_total,
    });
  } catch (err) {
    next(err);
  }
};

exports.listOrders = async (req, res, next) => {
  try {
    const orders = await ShopOrder.find({ user: req.user._id })
      .populate("order_status")
      .populate({
        path: "shipping_address",
        populate: { path: "country" },
      })
      .populate("shipping_method")
      .populate("payment_method")
      .sort("-createdAt")
      .lean();

    const enriched = await Promise.all(
      orders.map(async (order) => {
        const lines = await OrderLine.find({ order: order._id })
          .populate({
            path: "product_item",
            populate: { path: "product" },
          })
          .lean();
        return {
          ...order,
          lines,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await ShopOrder.findOne({ _id: req.params.id, user: req.user._id })
      .populate("order_status")
      .populate("shipping_address")
      .populate("shipping_method")
      .populate("payment_method");
    if (!order) return res.status(404).json({ message: "Order not found" });
    const lines = await OrderLine.find({ order: order._id }).populate({
      path: "product_item",
      populate: { path: "product" },
    });
    res.json({ order, lines });
  } catch (err) {
    next(err);
  }
};
