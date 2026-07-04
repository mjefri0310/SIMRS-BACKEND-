const express = require("express");
const router = express.Router();

const clinicController = require("../controllers/clinicController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, clinicController.index);
router.post("/", protect, clinicController.store);
router.get("/:id", protect, clinicController.show);
router.put("/:id", protect, clinicController.update);
router.delete("/:id", protect, clinicController.destroy);
router.get("/:id/versions", protect, clinicController.versions);

module.exports = router;