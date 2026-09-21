const UserReview = require("../models/UserReview");
const Product = require("../models/Product");

exports.createReview = async (req, res, next) => {
  try {
    const { product_id, rating_value, comment } = req.body;

    if (!product_id || !rating_value) {
      return res.status(400).json({ message: "product_id and rating_value are required" });
    }

    const ratingNum = Number(rating_value);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: "rating_value must be a number between 1 and 5" });
    }

    const review = await UserReview.create({
      user: req.user._id,
      ordered_product: product_id,
      rating_value: ratingNum,
      comment: comment || "",
    });

    const populated = await UserReview.findById(review._id).populate("user", "name email_address email");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await UserReview.find({ ordered_product: productId })
      .populate("user", "name email_address email")
      .sort("-createdAt");

    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + (r.rating_value || 0), 0);
      averageRating = Number((sum / reviews.length).toFixed(1));
    }

    res.json({
      reviews,
      totalReviews: reviews.length,
      averageRating,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await UserReview.find({ user: req.user._id })
      .populate("ordered_product")
      .sort("-createdAt");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
