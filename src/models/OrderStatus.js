const mongoose = require('mongoose');
const { Schema } = mongoose;
const orderStatus = new Schema({ status: String });
module.exports = mongoose.model('OrderStatus', orderStatus);
