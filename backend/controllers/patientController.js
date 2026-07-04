const Patient = require("../models/Patient");
const crudFactory = require("../utils/crudFactory");
module.exports = crudFactory({
Model: Patient,
entity: "PATIENT",
module: "REGISTRATION",
searchFields: ["medical_record_number", "nik",
"name","gender","birth_date","phone","address"],
});