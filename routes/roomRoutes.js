const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, roomController.index);
router.post("/", protect, roomController.store);
router.get("/:id", protect, roomController.show);
router.put("/:id", protect, roomController.update);
router.delete("/:id", protect, roomController.destroy);
router.get("/:id/versions", protect, roomController.versions);

module.exports = router;