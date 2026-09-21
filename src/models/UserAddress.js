const mongoose = require("mongoose");
const { Schema } = mongoose;

const userAddressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    is_default: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserAddress", userAddressSchema);
