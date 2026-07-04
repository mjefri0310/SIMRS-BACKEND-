const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");const { protect } = require("../middleware/authMiddleware");
router.get("/", protect, patientController.index);
router.post("/", protect, patientController.store);
router.get("/:id", protect, patientController.show);
router.put("/:id", protect, patientController.update);
router.delete("/:id", protect, patientController.destroy);
module.exports = router;