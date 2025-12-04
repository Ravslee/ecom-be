const mongoose = require('mongoose');
const { Schema } = mongoose;
const userReview = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  ordered_product: { type: Schema.Types.ObjectId, ref: 'ProductItem' },
  rating_value: Number,
  comment: String
}, { timestamps: true });
module.exports = mongoose.model('UserReview', userReview);
