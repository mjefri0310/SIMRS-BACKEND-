const mongoose = require("mongoose");

const serviceTypeSchema = new mongoose.Schema(
{
    code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    current_version: {
        type: Number,
        default: 1,
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("ServiceType", serviceTypeSchema);