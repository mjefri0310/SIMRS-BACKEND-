const express = require("express");
const router = express.Router();

const serviceTypeController = require("../controllers/serviceTypeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, serviceTypeController.index);
router.post("/", protect, serviceTypeController.store);
router.get("/all", protect, serviceTypeController.all);
router.get("/:id", protect, serviceTypeController.show);
router.put("/:id", protect, serviceTypeController.update);
router.delete("/:id", protect, serviceTypeController.destroy);
router.get("/:id/versions", protect, serviceTypeController.versions);

module.exports = router;