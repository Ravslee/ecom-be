const mongoose = require('mongoose');
const { Schema } = mongoose;
const productItem = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  SKU: String,
  qty_in_stock: { type: Number, default: 0 },
  product_image: String,
  price: { type: Number, required: true }
}, { timestamps: true });
module.exports = mongoose.model('ProductItem', productItem);
