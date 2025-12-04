const mongoose = require('mongoose');
const { Schema } = mongoose;
const cfg = new Schema({
  product_item: { type: Schema.Types.ObjectId, ref: 'ProductItem' },
  variation_option: { type: Schema.Types.ObjectId, ref: 'VariationOption' }
});
module.exports = mongoose.model('ProductConfiguration', cfg);
