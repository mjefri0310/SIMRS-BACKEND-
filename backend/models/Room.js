const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
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
    room_class: {
        type: String,
    },
    capacity: {
        type: Number,
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

module.exports = mongoose.model("Room", roomSchema);