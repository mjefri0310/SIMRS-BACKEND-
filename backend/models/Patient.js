const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema(
{
medical_record_number: {
type: String,
required: true,
unique: true,
},
nik: {
type: String,
required: true,
},
name: {
type: String,
required: true,
},
gender: {
type: String,
enum: ["L", "P"],
required: true,
},
birth_date: {
type: Date,
},
phone: {
type: String,
},
address: {
type: String,
},
current_version: {
type: Number,
default: 1,
},
is_deleted: {
type: Boolean,
default: false,
},
deleted_at: Date,
deleted_by: String,
},
{
timestamps: true,
},
);
module.exports = mongoose.model("Patient", patientSchema);