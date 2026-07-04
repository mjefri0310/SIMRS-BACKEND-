const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentCOntroller");
router.get("/", controller.index);
router.get("/all", controller.all);
router.get("/:id", controller.show);
router.post("/", controller.store);
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);
router.get("/versions/:id", controller.versions);
router.post("/generate/:registration_id", controller.generateBill);
router.post("/pay/:id", controller.pay);
router.get("/registration/:registration_id",
controller.getByRegistration);
module.exports = router;