const ShopOrder = require("../models/ShopOrder");
const PaymentMethod = require("../models/PaymentMethod");
const PaymentType = require("../models/PaymentType");

exports.listTransactions = async (req, res, next) => {
  try {
    const orders = await ShopOrder.find({})
      .populate("user", "name email_address email")
      .populate({
        path: "payment_method",
        populate: { path: "payment_type" },
      })
      .populate("order_status")
      .populate("shipping_method")
      .sort("-createdAt")
      .lean();

    // Summary metrics
    const totalRevenue = orders.reduce((sum, o) => sum + (o.order_total || 0), 0);
    const paidOrders = orders.filter((o) => o.payment_method);

    res.json({
      orders,
      summary: {
        totalOrders: orders.length,
        paidOrdersCount: paidOrders.length,
        totalRevenue: Number(totalRevenue.toFixed(2)),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.listPaymentTypes = async (req, res, next) => {
  try {
    let types = await PaymentType.find({}).lean();
    if (!types.length) {
      types = await PaymentType.create([
        { value: "Credit Card" },
        { value: "Debit Card" },
        { value: "UPI / Net Banking" },
        { value: "Cash on Delivery" },
      ]);
    }

    // Attach usage count for each type
    const enriched = await Promise.all(
      types.map(async (t) => {
        const count = await PaymentMethod.countDocuments({ payment_type: t._id });
        return {
          ...t,
          usageCount: count,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.createPaymentType = async (req, res, next) => {
  try {
    const { value } = req.body;
    if (!value || !value.trim()) {
      return res.status(400).json({ message: "Payment type value is required" });
    }

    const type = await PaymentType.create({ value: value.trim() });
    res.status(201).json(type);
  } catch (err) {
    next(err);
  }
};

exports.deletePaymentType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const type = await PaymentType.findByIdAndDelete(id);
    if (!type) return res.status(404).json({ message: "Payment type not found" });
    res.json({ success: true, message: "Payment type deleted" });
  } catch (err) {
    next(err);
  }
};
