const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
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
    specialization: {
        type: String,
    },
    sip_number: {
        type: String,
    },
    phone: {
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

module.exports = mongoose.model("Doctor", doctorSchema);