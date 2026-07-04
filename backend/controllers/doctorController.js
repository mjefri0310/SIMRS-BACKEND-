const Doctor = require("../models/Doctor");
const crudFactory = require("../utils/crudFactory");

module.exports = crudFactory({
    Model: Doctor,
    entity: "DOCTOR",
    module: "MASTER",
    searchFields: [
        "code",
        "name",
        "specialization",
        "sip_number",
        "phone",
    ],
});