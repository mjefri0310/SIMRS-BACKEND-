const mongoose = require("mongoose");

const blockchainLogSchema = new mongoose.Schema(
{
  index: Number,
  module: String,
  entity: String,
  entity_id: String,
  action: String,
  payload: Object,
  snapshot_hash: String,
  previous_hash: String,
  hash: String,
  created_by: String,
  timestamp: Date,
},
{
  timestamps: true,
}
);

module.exports = mongoose.model(
  "BlockchainLog",
  blockchainLogSchema
);