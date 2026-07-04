const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, doctorController.index);
router.post("/", protect, doctorController.store);
router.get("/:id", protect, doctorController.show);
router.put("/:id", protect, doctorController.update);
router.delete("/:id", protect, doctorController.destroy);
router.get("/:id/versions", protect, doctorController.versions);

module.exports = router;