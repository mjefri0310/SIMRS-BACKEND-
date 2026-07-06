const express = require("express");
const router = express.Router();
const controller = require("../controllers/rmeController");
router.post("/", controller.saveRME);
router.get("/:id", controller.getByRegistration);
module.exports = router;