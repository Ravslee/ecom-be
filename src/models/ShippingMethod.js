const mongoose = require('mongoose');
const { Schema } = mongoose;
const shippingMethod = new Schema({ name: String, price: Number });
module.exports = mongoose.model('ShippingMethod', shippingMethod);
