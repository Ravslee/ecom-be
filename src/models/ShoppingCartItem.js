const mongoose = require('mongoose');
const { Schema } = mongoose;
const itemSchema = new Schema({
  cart: { type: Schema.Types.ObjectId, ref: 'ShoppingCart' },
  product_item: { type: Schema.Types.ObjectId, ref: 'ProductItem' },
  qty: { type: Number, default: 1 }
}, { timestamps: true });
module.exports = mongoose.model('ShoppingCartItem', itemSchema);
