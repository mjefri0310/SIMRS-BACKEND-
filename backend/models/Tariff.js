const mongoose = require("mongoose");

const tariffSchema = new mongoose.Schema(
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
    service_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceType",
        required: true,
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

module.exports = mongoose.model("Tariff", tariffSchema);