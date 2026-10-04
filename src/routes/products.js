const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", productController.list);
router.get("/:id", productController.get);
router.post("/", protect, requireRole("admin"), productController.create);
router.put("/:id", protect, requireRole("admin"), productController.update);

module.exports = router;
