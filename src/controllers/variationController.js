const Variation = require("../models/Variation");

/**
 * Create a new variation
 * POST /variations
 */
async function createVariation(req, res) {
  try {
    const payload = req.body;
    const variation = new Variation(payload);
    await variation.save();
    return res.status(201).json({ success: true, data: variation });
  } catch (err) {
    const message = err.message || "Failed to create variation";
    return res.status(400).json({ success: false, message });
  }
}

/**
 * Get list of variations (supports basic filtering, paging and sorting)
 * GET /variations
 */
async function getVariations(req, res) {
  try {
    const { page = 1, limit = 25, sort = "-createdAt", ...filters } = req.query;

    // Convert numeric query params
    const skip =
      (Math.max(parseInt(page, 10), 1) - 1) * Math.max(parseInt(limit, 10), 1);
    const parsedLimit = Math.max(parseInt(limit, 10), 1);

    // Basic filter parsing: allow exact matching for provided query fields
    // e.g. ?product=...&color=...
    const query = { ...filters };

    const [total, items] = await Promise.all([
      Variation.countDocuments({}),
      Variation.aggregate([
        { $match: query },
        {
          $sort: {
            ...Object.fromEntries(
              sort
                .split(" ")
                .map((s, i) => [
                  s.replace(/^-/, ""),
                  i === 0 && sort.startsWith("-") ? -1 : 1,
                ])
            ),
          },
        },
        { $skip: skip },
        { $limit: parsedLimit },
        {
          $lookup: {
            from: "variationoptions",
            localField: "_id",
            foreignField: "variation",
            as: "variationOptions",
          },
        },
        {
          $lookup: {
            from: "productcategories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
      ]),
      Variation.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: items,
      meta: { total, page: parseInt(page, 10), limit: parsedLimit },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch variations",
    });
  }
}

/**
 * Get a single variation by id
 * GET /variations/:id
 */
async function getVariationById(req, res) {
  try {
    const { id } = req.params;
    const variation = await Variation.findById(id);
    if (!variation)
      return res
        .status(404)
        .json({ success: false, message: "Variation not found" });
    return res.json({ success: true, data: variation });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch variation",
    });
  }
}

/**
 * Update a variation
 * PUT /variations/:id
 */
async function updateVariation(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const variation = await Variation.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!variation)
      return res
        .status(404)
        .json({ success: false, message: "Variation not found" });
    return res.json({ success: true, data: variation });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to update variation",
    });
  }
}

/**
 * Delete a variation
 * DELETE /variations/:id
 */
async function deleteVariation(req, res) {
  try {
    const { id } = req.params;
    const variation = await Variation.findByIdAndDelete(id);
    if (!variation)
      return res
        .status(404)
        .json({ success: false, message: "Variation not found" });
    return res.json({ success: true, data: variation });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete variation",
    });
  }
}

module.exports = {
  createVariation,
  getVariations,
  getVariationById,
  updateVariation,
  deleteVariation,
};
