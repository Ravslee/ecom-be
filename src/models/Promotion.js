const mongoose = require('mongoose');
const { Schema } = mongoose;
const promotion = new Schema({
  name: String,
  description: String,
  discount_rate: Number,
  start_date: Date,
  end_date: Date
});
module.exports = mongoose.model('Promotion', promotion);
