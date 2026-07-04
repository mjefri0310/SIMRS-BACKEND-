const express = require("express");
const router = express.Router();

const medicineController = require("../controllers/medicineController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, medicineController.index);
router.post("/", protect, medicineController.store);
router.get("/:id", protect, medicineController.show);
router.put("/:id", protect, medicineController.update);
router.delete("/:id", protect, medicineController.destroy);
router.get("/:id/versions", protect, medicineController.versions);

module.exports = router;