const PaymentMethod = require("../models/PaymentMethod");
const PaymentType = require("../models/PaymentType");

exports.list = async (req, res, next) => {
  try {
    const methods = await PaymentMethod.find({ user: req.user._id })
      .populate("payment_type")
      .sort("-is_default -createdAt");
    res.json(methods);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { provider, account_number, expiry_date, is_default, payment_type } = req.body;
    if (!provider || !account_number) {
      return res.status(400).json({ message: "provider and account_number required" });
    }

    if (is_default) {
      await PaymentMethod.updateMany(
        { user: req.user._id },
        { is_default: false }
      );
    }

    const count = await PaymentMethod.countDocuments({ user: req.user._id });
    const pm = await PaymentMethod.create({
      user: req.user._id,
      payment_type,
      provider,
      account_number,
      expiry_date,
      is_default: is_default || count === 0,
    });

    const populated = await PaymentMethod.findById(pm._id).populate("payment_type");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.listTypes = async (req, res, next) => {
  try {
    let types = await PaymentType.find({});
    if (!types.length) {
      // Seed default types if empty
      types = await PaymentType.create([
        { value: "Credit Card" },
        { value: "Debit Card" },
        { value: "UPI / Net Banking" },
        { value: "Cash on Delivery" },
      ]);
    }
    res.json(types);
  } catch (err) {
    next(err);
  }
};
