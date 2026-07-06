const Tariff = require("../models/Tariff");

const crudFactory = require("../utils/crudFactory");

module.exports = crudFactory({
  Model: Tariff,
  entity: "TARIFF",
  module: "MASTER",
  searchFields: ["code","name","service_type_id","amount"],
  populate: [
    {
      path: "service_type_id",
      select: "name code"
    }
  ],
});