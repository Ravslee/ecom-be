const ProductItem = require("../models/ProductItem");
const ProductConfiguration = require("../models/ProductConfiguration");

exports.listInventory = async (req, res, next) => {
  try {
    const items = await ProductItem.find({})
      .populate("product")
      .sort("product -createdAt")
      .lean();

    const enriched = await Promise.all(
      items.map(async (item) => {
        const configs = await ProductConfiguration.find({ product_item: item._id })
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

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { qty_in_stock, price } = req.body;

    const update = {};
    if (qty_in_stock !== undefined) update.qty_in_stock = Number(qty_in_stock);
    if (price !== undefined) update.price = Number(price);

    const updated = await ProductItem.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).populate("product");

    if (!updated) return res.status(404).json({ message: "Product item not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
