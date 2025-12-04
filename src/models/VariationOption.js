const mongoose = require('mongoose');
const { Schema } = mongoose;
const variationOption = new Schema({
  variation: { type: Schema.Types.ObjectId, ref: 'Variation' },
  value: String
});
module.exports = mongoose.model('VariationOption', variationOption);
