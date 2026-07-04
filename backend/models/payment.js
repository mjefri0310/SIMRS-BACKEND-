const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema(
{
registration_id: {
type: mongoose.Schema.Types.ObjectId,
ref: "Registration",
required: true,
unique: true,
},
patient_id: {
type: mongoose.Schema.Types.ObjectId,
ref: "Patient",
required: true,
},
items: [
{
item_type: {
type: String,
enum: ["OBAT", "TINDAKAN"],
},
reference_id: mongoose.Schema.Types.ObjectId,
name: String,
quantity: Number,
unit_price: Number,
subtotal: Number,
},
],
total_amount: {
type: Number,
default: 0,
},
payment_method: {
type: String,
enum: ["CASH", "TRANSFER", "QRIS", "INSURANCE"],
},
paid_amount: {
type: Number,
default: 0,
},
change_amount: {
type: Number,
default: 0,
},
status: {
type: String,
enum: ["UNPAID", "PAID", "CANCELLED"],
default: "UNPAID",
},
payment_date: Date,
current_version: {
type: Number,
default: 1,
},
is_deleted: {
type: Boolean,
default: false,
},
},
{
timestamps: true,
},
);
module.exports = mongoose.model("Payment", PaymentSchema);