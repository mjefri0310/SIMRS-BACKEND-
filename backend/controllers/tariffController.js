const Tariff = require("../models/Tariff");
const crudFactory = require("../utils/crudFactory");

module.exports = crudFactory({
    Model: Tariff,
    entity: "TARIFF",
    module: "MASTER",
    searchFields: [
        "code",
        "name",
    ],
    populate: [
        {
            path: "service_type_id",
            select: "code name",
        },
    ],
});