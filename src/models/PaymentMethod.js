const mongoose = require('mongoose');
const { Schema } = mongoose;
const paymentMethodSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  payment_type: { type: Schema.Types.ObjectId, ref: 'PaymentType' },
  provider: String,
  account_number: String,
  expiry_date: Date,
  is_default: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
