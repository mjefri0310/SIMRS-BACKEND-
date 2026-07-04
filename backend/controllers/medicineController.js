const Medicine = require("../models/Medicine");
const crudFactory = require("../utils/crudFactory");

module.exports = crudFactory({
    Model: Medicine,
    entity: "MEDICINE",
    module: "MASTER",
    searchFields: [
        "code",
        "name",
        "unit",
    ],
});