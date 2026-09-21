const ShippingMethod = require("../models/ShippingMethod");

exports.list = async (req, res, next) => {
  try {
    const methods = await ShippingMethod.find({});
    res.json(methods);
  } catch (err) {
    next(err);
  }
};
