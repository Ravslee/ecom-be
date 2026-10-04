const ProductConfiguration = require("../models/ProductConfiguration");
const ProductItem = require("../models/ProductItem");
const VariationOption = require("../models/VariationOption");

exports.listConfigurations = async (req, res, next) => {
  try {
    const { product_item_id } = req.query;
    const filter = {};
    if (product_item_id) filter.product_item = product_item_id;

    const configs = await ProductConfiguration.find(filter)
      .populate("product_item")
      .populate({
        path: "variation_option",
        populate: { path: "variation" },
      });
    res.json(configs);
  } catch (err) {
    next(err);
  }
};

exports.setProductItemConfigurations = async (req, res, next) => {
  try {
    const { product_item_id, variation_option_ids } = req.body;

    if (!product_item_id || !Array.isArray(variation_option_ids)) {
      return res.status(400).json({
        message: "product_item_id and variation_option_ids array are required",
      });
    }

    // Delete existing configurations for this product item
    await ProductConfiguration.deleteMany({ product_item: product_item_id });

    // Insert new configurations
    if (variation_option_ids.length > 0) {
      const docs = variation_option_ids.map((optId) => ({
        product_item: product_item_id,
        variation_option: optId,
      }));
      await ProductConfiguration.insertMany(docs);
    }

    const updated = await ProductConfiguration.find({
      product_item: product_item_id,
    }).populate({
      path: "variation_option",
      populate: { path: "variation" },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
