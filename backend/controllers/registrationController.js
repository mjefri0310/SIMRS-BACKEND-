const Registration = require("../models/Registration");
// const generateNumber =
require("../utils/generateRegistrationNumber");
const generateRegistrationNumber =
require("../utils/generateRegistrationNumber");
const generateQueueNumber = require("../utils/generateQueueNumber");
const response = require("../utils/response");
const EntityVersion = require("../models/EntityVersion");
const { createBlockchainLog } = require("../utils/blockchain");
exports.index = async (req, res) => {
try {
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const keyword = req.query.keyword || "";
const clinic_id = req.query.poli || "";
const tgl = req.query.tgl || "";
const skip = (page - 1) * limit;
const filter = {
is_deleted: false,
};
if (clinic_id) {
filter.clinic_id = clinic_id;
}
if (tgl) {
const selectedDate = new Date(tgl);
const startDate = new Date(selectedDate);
startDate.setHours(0, 0, 0, 0);
const endDate = new Date(selectedDate);
endDate.setHours(23, 59, 59, 999);
filter.registration_date = {
$gte: startDate,
$lte: endDate,
};
}
if (keyword) {
filter.$or = [
{
registration_number: {
$regex: keyword,
$options: "i",
},
},
{
queue_code: {
$regex: keyword,
$options: "i",
},
},
];
}
console.log(filter);
const total = await Registration.countDocuments(filter);
const registrations = await Registration.find(filter)
.sort({ createdAt: -1 })
.skip(skip)
.limit(limit)
.populate(
"patient_id",
"name medical_record_number nik gender phone addressbirth_date"
)
.populate("service_type_id", "name")
.populate("insurance_id", "name")
.populate("clinic_id", "name")
.populate("doctor_id", "name");
return response.success(res, {
message: "Data registrasi berhasil diambil ok",
data: registrations,
pagination: {
filter,
page,
limit,
total,
total_pages: Math.ceil(total / limit),
},
});
} catch (err) {
return response.error(res, {
message: err.message,
err,
});
}
};
exports.store = async (req, res) => {
try {
const registrationNumber = await generateRegistrationNumber();
const queueNumber = await generateQueueNumber(req.body.clinic_id);const queueCode = `A${String(queueNumber).padStart(3, "0")}`;
const registration = await Registration.create({
...req.body,
registration_number: registrationNumber,
queue_number: queueNumber,
queue_code: queueCode,
});
// save version
await EntityVersion.create({
entity: "REGISTRATION",
entity_id: registration._id,
module: "REGISTRATION",
version: 1,
snapshot: registration.toObject(),
change_type: "CREATE",
changed_by: "admin",
});
// Create lockchain
await createBlockchainLog({
module: "REGISTRATION",
entity: "REGISTRATION",
entity_id: registration._id.toString(),
action: "CREATE",
payload: registration.toObject(),
snapshot_data: registration.toObject(),
});
return response.success(res, {
code: 201,
message: "Registrasi berhasil",
data: registration,
});
} catch (err) {
return response.error(res, {
message: err.message,
});
}
};
exports.show = async (req, res) => {
try {
const registration = await Registration.findById(req.params.id)
.populate(
"patient_id",
"name medical_record_number nik gender phone addressbirth_date",
)
.populate("service_type_id", "name")
.populate("insurance_id", "name")
.populate("clinic_id", "name")
.populate("doctor_id", "name");
if (!registration) {
return response.error(res, {
code: 404,
message: "Data registrasi tidak ditemukan",
});
}
return response.success(res, {
message: "Data registrasi berhasil diambil",
data: registration,
});
} catch (err) {
return response.error(res, {
message: err.message,
});
}
};
exports.update = async (req, res) => {
try {
const registration = await Registration.findOneAndUpdate(
{ _id: req.params.id, is_deleted: false },
req.body,
{ new: true },
);
if (!registration) {
return response.error(res, {
code: 404,
message: "Data registrasi tidak ditemukan",
});
}
return response.success(res, {
message: "Data registrasi berhasil diupdate",
data: registration,
});
} catch (err) {
return response.error(res, {
message: err.message,
});
}
};
exports.destroy = async (req, res) => {
try {
const registration = await Registration.findOneAndUpdate(
{ _id: req.params.id, is_deleted: false },
{ is_deleted: true, deleted_at: new Date() },
{ new: true },
);
if (!registration) {
return response.error(res, {
code: 404,
message: "Data registrasi tidak ditemukan",
});
}
return response.success(res, {
message: "Data registrasi berhasil dihapus",
});
} catch (err) {
return response.error(res, {
message: err.message,
});
}
};
exports.lastRegistrationBYPatient = async (req, res) => {
try {
const registration = await Registration.findOne({
patient_id: req.params.id,
})
.sort({ createdAt: -1 })
.populate("patient_id", "name medical_record_number nik")
.populate("service_type_id", "name")
.populate("insurance_id", "name")
.populate("clinic_id", "name")
.populate("doctor_id", "name");
if (!registration) {
return response.error(res, {
code: 404,
message: "Data registrasi tidak ditemukan",
});
}
return response.success(res, {
message: "Berhasil mengambil data registrasi terakhir",
data: registration,
});
} catch (err) {
return response.error(res, {
message: err.message,
});
}
};