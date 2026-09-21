const ShippingMethod = require("../models/ShippingMethod");

exports.listShippingMethods = async (req, res, next) => {
  try {
    const methods = await ShippingMethod.find({}).sort("price");
    res.json(methods);
  } catch (err) {
    next(err);
  }
};

exports.createShippingMethod = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price required" });
    }
    const sm = await ShippingMethod.create({ name, price });
    res.status(201).json(sm);
  } catch (err) {
    next(err);
  }
};

exports.updateShippingMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const sm = await ShippingMethod.findByIdAndUpdate(
      id,
      { name, price },
      { new: true, runValidators: true }
    );
    if (!sm) return res.status(404).json({ message: "Shipping method not found" });
    res.json(sm);
  } catch (err) {
    next(err);
  }
};

exports.deleteShippingMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sm = await ShippingMethod.findByIdAndDelete(id);
    if (!sm) return res.status(404).json({ message: "Shipping method not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
