const Clinic = require("../models/Clinic");
const crudFactory = require("../utils/crudFactory");

module.exports = crudFactory({
    Model: Clinic,
    entity: "CLINIC",
    module: "MASTER",
    searchFields: ["code", "name", "floor"],
});