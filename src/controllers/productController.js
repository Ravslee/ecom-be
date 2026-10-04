const Product = require("../models/Product");
const ProductItem = require("../models/ProductItem");
const ProductCategory = require("../models/ProductCategory");
const ProductConfiguration = require("../models/ProductConfiguration");

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, q, category } = req.query;
    const filter = {};
    if (q) filter.name = new RegExp(q, "i");

    if (category) {
      const subCategories = await ProductCategory.find({ parent_category: category });
      const catIds = [category, ...subCategories.map((c) => c._id)];
      filter.category = { $in: catIds };
    }

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("category")
      .lean();

    const enriched = await Promise.all(
      products.map(async (prod) => {
        const items = await ProductItem.find({ product: prod._id }).lean();
        const prices = items.map((i) => i.price).filter((p) => p !== undefined && p !== null);
        const minPrice = prices.length ? Math.min(...prices) : null;
        const maxPrice = prices.length ? Math.max(...prices) : null;
        return {
          ...prod,
          items,
          minPrice,
          maxPrice,
          inStock: items.some((i) => i.qty_in_stock > 0),
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id)
      .populate({
        path: "category",
        populate: { path: "parent_category" },
      })
      .lean();
    if (!p) return res.status(404).json({ message: "Not found" });

    const items = await ProductItem.find({ product: p._id }).lean();

    // Populate configurations for each ProductItem
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const configs = await ProductConfiguration.find({
          product_item: item._id,
        })
          .populate({
            path: "variation_option",
            populate: { path: "variation" },
          })
          .lean();
        return {
          ...item,
          configurations: configs,
        };
      })
    );

    // Extract all distinct variations available for this product
    const variationsMap = {};
    enrichedItems.forEach((item) => {
      item.configurations.forEach((cfg) => {
        const opt = cfg.variation_option;
        if (opt && opt.variation) {
          const varName = opt.variation.name;
          if (!variationsMap[varName]) {
            variationsMap[varName] = {
              _id: opt.variation._id,
              name: varName,
              options: [],
            };
          }
          if (
            !variationsMap[varName].options.some(
              (o) => o._id.toString() === opt._id.toString()
            )
          ) {
            variationsMap[varName].options.push({
              _id: opt._id,
              value: opt.value,
            });
          }
        }
      });
    });

    res.json({
      ...p,
      items: enrichedItems,
      variations: Object.values(variationsMap),
    });
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
