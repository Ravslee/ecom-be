const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not defined");
  try {
    await mongoose.connect(uri, { dbName: undefined });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1);

    //ravi_rr
    // We@new68#
  }
};
