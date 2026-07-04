const mongoose = require("mongoose");

const entityVersionSchema = new mongoose.Schema(
{
  module: {
    type: String,
    required: true,
  },
  entity: {
    type: String,
    required: true,
  },
  entity_id: {
    type: String,
    required: true,
  },
  version: {
    type: Number,
    required: true,
  },
  snapshot: {
    type: Object,
    required: true,
  },
  change_type: {
    type: String,
    enum: ["CREATE", "UPDATE", "DELETE", "RECOVERY"],
  },
  changed_by: String,
  changed_at: Date,
},
{
  timestamps: true,
}
);

module.exports = mongoose.model(
  "EntityVersion",
  entityVersionSchema
);