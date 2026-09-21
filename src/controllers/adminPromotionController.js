const Promotion = require("../models/Promotion");
const PromotionCategory = require("../models/PromotionCategory");
const ProductCategory = require("../models/ProductCategory");

exports.listPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find({}).sort("-createdAt").lean();

    // Attach targeted categories to each promotion
    const enriched = await Promise.all(
      promotions.map(async (promo) => {
        const pCats = await PromotionCategory.find({ promotion: promo._id })
          .populate("category")
          .lean();
        return {
          ...promo,
          categories: pCats.map((pc) => pc.category).filter(Boolean),
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.createPromotion = async (req, res, next) => {
  try {
    const { name, description, discount_rate, start_date, end_date, category_ids } = req.body;

    if (!name || discount_rate === undefined) {
      return res.status(400).json({ message: "Name and discount_rate are required" });
    }

    const promo = await Promotion.create({
      name,
      description,
      discount_rate: Number(discount_rate),
      start_date: start_date ? new Date(start_date) : new Date(),
      end_date: end_date ? new Date(end_date) : null,
    });

    if (Array.isArray(category_ids) && category_ids.length > 0) {
      const docs = category_ids.map((catId) => ({
        promotion: promo._id,
        category: catId,
      }));
      await PromotionCategory.insertMany(docs);
    }

    const pCats = await PromotionCategory.find({ promotion: promo._id })
      .populate("category")
      .lean();

    res.status(201).json({
      ...promo.toObject(),
      categories: pCats.map((pc) => pc.category).filter(Boolean),
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, discount_rate, start_date, end_date, category_ids } = req.body;

    const promo = await Promotion.findByIdAndUpdate(
      id,
      {
        name,
        description,
        discount_rate: Number(discount_rate),
        start_date: start_date ? new Date(start_date) : undefined,
        end_date: end_date ? new Date(end_date) : null,
      },
      { new: true, runValidators: true }
    );

    if (!promo) return res.status(404).json({ message: "Promotion not found" });

    if (Array.isArray(category_ids)) {
      await PromotionCategory.deleteMany({ promotion: promo._id });
      if (category_ids.length > 0) {
        const docs = category_ids.map((catId) => ({
          promotion: promo._id,
          category: catId,
        }));
        await PromotionCategory.insertMany(docs);
      }
    }

    const pCats = await PromotionCategory.find({ promotion: promo._id })
      .populate("category")
      .lean();

    res.json({
      ...promo.toObject(),
      categories: pCats.map((pc) => pc.category).filter(Boolean),
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePromotion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const promo = await Promotion.findByIdAndDelete(id);
    if (!promo) return res.status(404).json({ message: "Promotion not found" });

    await PromotionCategory.deleteMany({ promotion: id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
