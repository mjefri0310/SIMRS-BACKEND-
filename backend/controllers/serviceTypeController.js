const ServiceType = require("../models/ServiceType");
const crudFactory = require("../utils/crudFactory");

module.exports = crudFactory({
    Model: ServiceType,
    entity: "SERVICETYPE",
    module: "MASTER",
    searchFields: [
        "code",
        "name",
        "description",
    ],
});