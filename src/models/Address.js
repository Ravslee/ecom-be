const mongoose = require('mongoose');
const { Schema } = mongoose;
const addressSchema = new Schema({
  unit_number: String,
  street_number: String,
  address_line1: String,
  address_line2: String,
  city: String,
  region: String,
  postal_code: String,
  country: { type: Schema.Types.ObjectId, ref: 'Country' }
}, { timestamps: true });
module.exports = mongoose.model('Address', addressSchema);
