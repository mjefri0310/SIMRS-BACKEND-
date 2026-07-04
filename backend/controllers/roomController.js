const Room = require("../models/Room");
const crudFactory = require("../utils/crudFactory");

module.exports = crudFactory({
    Model: Room,
    entity: "ROOM",
    module: "MASTER",
    searchFields: [
        "code",
        "name",
        "room_class",
    ],
});