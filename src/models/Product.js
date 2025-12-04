const mongoose = require('mongoose');
const { Schema } = mongoose;
const product = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
  name: { type: String, required: true },
  description: String,
  product_image: String
}, { timestamps: true });
module.exports = mongoose.model('Product', product);
