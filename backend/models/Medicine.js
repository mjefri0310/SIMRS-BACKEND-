const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
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
    unit: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0,
    },
    purchase_price: {
        type: Number,
        default: 0,
    },
    selling_price: {
        type: Number,
        default: 0,
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

module.exports = mongoose.model("Medicine", medicineSchema);