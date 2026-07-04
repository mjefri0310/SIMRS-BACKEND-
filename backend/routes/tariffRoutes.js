const express = require("express");
const router = express.Router();

const tariffController = require("../controllers/tariffController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, tariffController.index);
router.post("/", protect, tariffController.store);
router.get("/:id", protect, tariffController.show);
router.put("/:id", protect, tariffController.update);
router.delete("/:id", protect, tariffController.destroy);
router.get("/:id/versions", protect, tariffController.versions);

module.exports = router;