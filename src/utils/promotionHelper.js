const PromotionCategory = require("../models/PromotionCategory");
const Promotion = require("../models/Promotion");

exports.getActivePromotionForCategory = async (categoryId) => {
  if (!categoryId) return null;

  const pCats = await PromotionCategory.find({ category: categoryId }).lean();
  if (!pCats.length) return null;

  const promoIds = pCats.map((pc) => pc.promotion);
  const now = new Date();

  const activePromos = await Promotion.find({
    _id: { $in: promoIds },
    $or: [{ start_date: { $lte: now } }, { start_date: null }],
    $or: [{ end_date: { $gte: now } }, { end_date: null }],
  }).sort("-discount_rate");

  if (!activePromos.length) return null;
  return activePromos[0]; // Returns promotion with highest discount rate
};
