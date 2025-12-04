const mongoose = require('mongoose');
const { Schema } = mongoose;
const shopOrder = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  order_date: { type: Date, default: Date.now },
  payment_method: { type: Schema.Types.ObjectId, ref: 'PaymentMethod' },
  shipping_address: { type: Schema.Types.ObjectId, ref: 'Address' },
  shipping_method: { type: Schema.Types.ObjectId, ref: 'ShippingMethod' },
  order_total: Number,
  order_status: { type: Schema.Types.ObjectId, ref: 'OrderStatus' }
}, { timestamps: true });
module.exports = mongoose.model('ShopOrder', shopOrder);
