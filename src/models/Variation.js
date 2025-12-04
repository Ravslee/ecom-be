const mongoose = require('mongoose');
const { Schema } = mongoose;
const variation = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
  name: String
});
module.exports = mongoose.model('Variation', variation);
