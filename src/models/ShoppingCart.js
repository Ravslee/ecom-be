const mongoose = require('mongoose');
const { Schema } = mongoose;
const cartSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', unique: true } }, { timestamps: true });
module.exports = mongoose.model('ShoppingCart', cartSchema);
