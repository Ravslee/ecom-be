const express = require("express");
const router = express.Router();
const productConfigurationController = require("../controllers/productConfigurationController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", productConfigurationController.listConfigurations);
router.post(
  "/",
  protect,
  requireRole("admin"),
  productConfigurationController.setProductItemConfigurations
);

module.exports = router;
