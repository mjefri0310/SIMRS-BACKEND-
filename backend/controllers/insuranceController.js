const Insurance = require("../models/Insurance");
const crudFactory = require("../utils/crudFactory");

module.exports = crudFactory({
    Model: Insurance,
    entity: "INSURANCE",
    module: "MASTER",
    searchFields: [
        "code",
        "name",
        "address",
        "phone",
    ],
});