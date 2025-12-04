const mongoose = require('mongoose');
const { Schema } = mongoose;
const orderLine = new Schema({
  product_item: { type: Schema.Types.ObjectId, ref: 'ProductItem' },
  order: { type: Schema.Types.ObjectId, ref: 'ShopOrder' },
  qty: Number,
  price: Number
}, { timestamps: true });
module.exports = mongoose.model('OrderLine', orderLine);
