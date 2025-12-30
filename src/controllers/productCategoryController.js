const { default: mongoose, Types } = require("mongoose");
const ProductCategory = require("../models/ProductCategory");

/**
 * Create a new product category
 * POST /api/categories
 */
exports.createCategory = async (req, res) => {
  try {
    const { category_name, parent_category } = req.body;

    if (
      !category_name ||
      typeof category_name !== "string" ||
      !category_name.trim()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    // avoid duplicate names (case-insensitive)
    // const exists = await ProductCategory.findOne({
    //   category_name: { $regex: `^${category_name}$`, $options: "i" },
    // });
    // if (exists) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "Category with this name already exists",
    //   });
    // }

    const category = new ProductCategory({
      category_name: category_name.trim(),
      parent_category: parent_category || null,
    });

    await category.save();

    return res.status(201).json({ success: true, data: category });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * Get all categories with optional pagination and search
 * GET /api/categories
 * Query: ?page=1&limit=20&search=term
 */
exports.getCategories = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 25);
    const search = (req.query.search || "").trim();

    const filter = {};
    if (search) {
      filter.$or = [{ category_name: { $regex: search, $options: "i" } }];
    }

    const total = await ProductCategory.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const categories = await ProductCategory.find(filter)
      .sort({ category_name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      meta: { total, page, pages, limit },
      data: categories,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

exports.getCategoriesWithHierarchy = async (req, res) => {
  try {
    const categories = await ProductCategory.aggregate([
      {
        $graphLookup: {
          from: "productcategories",
          startWith: "$parent_category",
          connectFromField: "parent_category",
          connectToField: "_id",
          as: "parents",
          depthField: "level",
        },
      },
      {
        $addFields: {
          parents: {
            $sortArray: {
              input: "$parents",
              sortBy: { level: -1 },
            },
          },
        },
      },
    ]);

    return res.json({ success: true, data: categories });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * Get single category by id
 * GET /api/categories/:id
 */
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // const category = await ProductCategory.findById(id).lean();

    const result = await ProductCategory.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $graphLookup: {
          from: "productcategories",
          startWith: "$parent_category",
          connectFromField: "parent_category",
          connectToField: "_id",
          as: "parents",
          depthField: "level",
        },
      },
      {
        $addFields: {
          parents: {
            $sortArray: {
              input: "$parents",
              sortBy: { level: -1 },
            },
          },
        },
      },
      {
        $addFields: {
          breadcrumb: {
            $concatArrays: [
              {
                $map: {
                  input: "$parents",
                  as: "p",
                  in: {
                    _id: "$$p._id",
                    name: "$$p.category_name",
                  },
                },
              },
              [{ _id: "$_id", name: "$category_name" }],
            ],
          },
        },
      },
      {
        $project: { parents: 0 },
      },
    ]);

    if (!result.length) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.json({ success: true, data: result[0] });
  } catch (err) {
    // handle invalid ObjectId or other errors
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * Update a category
 * PUT /api/categories/:id
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, parent_category } = req.body;

    const update = {};
    if (typeof category_name === "string")
      update.category_name = category_name.trim();
    if (typeof parent_category !== "undefined")
      update.parent_category = parent_category;
    // if updating name, check duplicates
    // if (update.category_name) {
    //   const dup = await ProductCategory.findOne({
    //     _id: { $ne: id },
    //     category_name: { $regex: `^${update.category_name}$`, $options: "i" },
    //   });
    //   if (dup) {
    //     return res.status(409).json({
    //       success: false,
    //       message: "Another category with this name exists",
    //     });
    //   }
    // }

    const category = await ProductCategory.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.json({ success: true, data: category });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * Delete a category
 * DELETE /api/categories/:id
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findByIdAndDelete(id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};
