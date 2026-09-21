const ShopOrder = require("../models/ShopOrder");
const OrderLine = require("../models/OrderLine");
const OrderStatus = require("../models/OrderStatus");

exports.listAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.order_status = status;

    const orders = await ShopOrder.find(filter)
      .populate("user", "name email_address email")
      .populate("order_status")
      .populate("shipping_address")
      .populate("shipping_method")
      .populate("payment_method")
      .sort("-createdAt");

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await ShopOrder.findById(req.params.id)
      .populate("user", "name email_address email phone_number")
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

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    if (!status_id) {
      return res.status(400).json({ message: "status_id is required" });
    }

    const targetStatus = await OrderStatus.findById(status_id);
    if (!targetStatus) {
      return res.status(404).json({ message: "Order status not found" });
    }

    const order = await ShopOrder.findByIdAndUpdate(
      id,
      { order_status: targetStatus._id },
      { new: true }
    )
      .populate("user", "name email_address email")
      .populate("order_status")
      .populate("shipping_address")
      .populate("shipping_method");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.listOrderStatuses = async (req, res, next) => {
  try {
    let statuses = await OrderStatus.find({});
    if (!statuses.length) {
      statuses = await OrderStatus.create([
        { status: "Pending" },
        { status: "Processing" },
        { status: "Shipped" },
        { status: "Delivered" },
        { status: "Cancelled" },
      ]);
    }
    res.json(statuses);
  } catch (err) {
    next(err);
  }
};
