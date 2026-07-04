const express = require("express");
const router = express.Router();

const controller = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, controller.index);
router.post("/", protect, controller.store);
router.get("/:id", protect, controller.show);
router.put("/:id", protect, controller.update);
router.delete("/:id", protect, controller.destroy);

module.exports = router;