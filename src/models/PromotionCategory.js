const mongoose = require('mongoose');
const { Schema } = mongoose;
const pcat = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
  promotion: { type: Schema.Types.ObjectId, ref: 'Promotion' }
});
module.exports = mongoose.model('PromotionCategory', pcat);
