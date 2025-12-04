const mongoose = require('mongoose');
const { Schema } = mongoose;
const paymentType = new Schema({ value: String });
module.exports = mongoose.model('PaymentType', paymentType);
