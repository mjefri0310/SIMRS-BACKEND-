const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: String,
    name: String,
    address: String,
    phone: String,
    is_deleted: Boolean,
    current_version: Number,
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Insurance", schema);