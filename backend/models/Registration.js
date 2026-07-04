const mongoose = require("mongoose");
/**
* Mendefenisikan skema dokumen untuk data registrasi
*/
const RegistrationSchema = new mongoose.Schema(
{
registration_number: {
type: String,
required: true,
unique: true,
},
registration_date: {
type: Date,
default: Date.now,
},
patient_id: {
type: mongoose.Schema.Types.ObjectId,
ref: "Patient",
required: true,
},
service_type_id: {
type: mongoose.Schema.Types.ObjectId,
ref: "ServiceType",
required: true,
},
insurance_id: {
type: mongoose.Schema.Types.ObjectId,
ref: "Insurance",
},
clinic_id: {
type: mongoose.Schema.Types.ObjectId,
ref: "Clinic",
},
doctor_id: {
type: mongoose.Schema.Types.ObjectId,
ref: "Doctor",
},
room_id: {
type: mongoose.Schema.Types.ObjectId,
ref: "Room",
},
complaint: String,
queue_number: {
type: Number,
},
queue_code: {
type: String,
},
visit_type: {
type: String,
enum: ["NEW", "RETURNING"],
},
status: {
type: String,
enum: ["REGISTERED", "WAITING", "EXAMINATION","IN_PROGRESS",
"COMPLETED", "CANCELLED"],
default: "REGISTERED",
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
},
);
/**
* Untuk mendefenisikan relasi
*/
const Registration = mongoose.model("Registration", RegistrationSchema);Registration.relations = {
patient_id: {
path: "patient_id",
select: "medical_record_number name nik",
},
service_type_id: {
path: "service_type_id",
select: "name",
},
insurance_id: {
path: "insurance_id",
select: "name",
},
clinic_id: {
path: "clinic_id",
select: "name",
},
doctor_id: {
path: "doctor_id",
select: "name",
},
room_id: {
path: "room_id",
select: "name",
},
};
module.exports = Registration;