const Product = require("../models/Product");
const ProductItem = require("../models/ProductItem");

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const filter = {};
    if (q) filter.name = new RegExp(q, "i");
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("category")
      .lean();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id).populate("category").lean();
    if (!p) return res.status(404).json({ message: "Not found" });
    const items = await ProductItem.find({ product: p._id }).lean();
    res.json({ ...p, items });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, category, product_image } = req.body;
    if (!name) return res.status(400).json({ message: "name required" });
    const p = await Product.create({
      name,
      description,
      category,
      product_image,
    });
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, description, category, product_image } = req.body;
    const p = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, category, product_image },
      { new: true, runValidators: true }
    ).lean();
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (err) {
    next(err);
  }
};
