const mongoose = require("mongoose");
const { Schema } = mongoose;

const siteUserSchema = new Schema(
  {
    name: { type: String, required: true, unique: false, trim: true },
    email_address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone_number: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", siteUserSchema);
