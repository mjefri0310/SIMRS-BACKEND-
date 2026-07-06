const express = require("express");
const router = express.Router();

const insuranceController = require("../controllers/insuranceController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, insuranceController.index);
router.post("/", protect, insuranceController.store);
router.get("/:id", protect, insuranceController.show);
router.put("/:id", protect, insuranceController.update);
router.delete("/:id", protect, insuranceController.destroy);
router.get("/:id/versions", protect, insuranceController.versions);

module.exports = router;