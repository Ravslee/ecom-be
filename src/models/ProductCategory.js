const mongoose = require('mongoose');
const { Schema } = mongoose;
const productCategory = new Schema({
  parent_category: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
  category_name: String
});
module.exports = mongoose.model('ProductCategory', productCategory);
