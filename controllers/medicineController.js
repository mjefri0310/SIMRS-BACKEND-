const Medicine = require("../models/Medicine");

const crudFactory = require("../utils/crudFactory");

module.exports = crudFactory({
  Model: Medicine,
  entity: "MEDICINE",
  module: "REGISTRATION",
  searchFields: ["code","name","unit","stok","purchase_price","selling_price"],
});