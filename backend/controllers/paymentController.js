const Payment = require("../models/Payment");
const Registration = require("../models/Registration");
const MedicalRecord = require("../models/RME");
const response = require("../utils/response");
const crudFactory = require("../utils/crudFactory");
const crud = crudFactory({
Model: Payment,
entity: "PAYMENT",
module: "PAYMENT",
searchFields: ["registration_id","patient_id","items","total_amount"],populate: [
{
path: "registration_id",
select: "pengunaan_obat tindakan"
},
{
path: "patient_id",
select: "medical_record_number nik name phone address birth_date"}
],
});
const generateBill = async (req, res) => {
try {
const registration = await
Registration.findById(req.params.registration_id)
.populate("patient_id")
.populate("doctor_id")
.populate("clinic_id");
if (!registration) {
return response.error(res, {
code: 404,
message: "Registrasi tidak ditemukan",
});
}
const rme = await MedicalRecord.findOne({
registration_id: registration._id,
});
if (!rme) {
return response.error(res, {
code: 404,
message: "Rekam medis belum tersedia",
});
}
const items = [];
let total = 0;
if (rme.penggunaan_obat && rme.penggunaan_obat.length > 0) {
rme.penggunaan_obat.forEach((item) => {
items.push({
item_type: "OBAT",
reference_id: item.medicine_id,
name: item.medicine_name,
quantity: item.quantity,
unit_price: item.unit_price,
subtotal: item.subtotal,
});
total += Number(item.subtotal) || 0;
});
}
if (rme.tindakan && rme.tindakan.length > 0) {
rme.tindakan.forEach((item) => {
items.push({
item_type: "TINDAKAN",
reference_id: item.tariff_id,
name: item.tariff_name,
quantity: item.quantity,
unit_price: item.unit_price,
subtotal: item.subtotal,
});
total += Number(item.subtotal) || 0;
});
}
const payment = await Payment.findOneAndUpdate(
{
registration_id: registration._id,
},
{
registration_id: registration._id,
patient_id: registration.patient_id,
items,
total_amount: total,
status: "UNPAID",
},
{
new: true,
upsert: true,
},
);
return response.success(res, {
message: "Tagihan berhasil dibuat",
data: payment,
});
} catch (err) {
return response.error(res, {
message: err.message,
err,
});
}
};
const pay = async (req, res) => {
try {
const payment = await Payment.findById(req.params.id);
if (!payment) {
return response.error(res, {
code: 404,
message: "Tagihan tidak ditemukan",
});
}
const paidAmount = Number(req.body.paid_amount);
if (paidAmount < payment.total_amount) {
return response.error(res, {
message: "Jumlah pembayaran kurang",
});
}
payment.payment_method = req.body.payment_method;
payment.paid_amount = paidAmount;
payment.change_amount = paidAmount - payment.total_amount;
payment.status = "PAID";
payment.payment_date = new Date();
await payment.save();
return response.success(res, {
message: "Pembayaran berhasil",
data: payment,
});
} catch (err) {
return response.error(res, {
message: err.message,
err,
});
}
};
const getByRegistration = async (req, res) => {
try {
const data = await Payment.findOne({
registration_id: req.params.registration_id,
})
.populate("patient_id")
.populate("registration_id");
return response.success(res, {
data,
});
} catch (err) {
return response.error(res, {
message: err.message,
});
}
};
module.exports = {
...crud,
generateBill,
pay,
getByRegistration,
};