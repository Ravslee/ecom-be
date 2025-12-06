const express = require("express");
const router = express.Router();
const productCategoryController = require("../controllers/productCategoryController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", productCategoryController.getCategories);
router.get("/:id", productCategoryController.getCategoryById);
router.post(
  "/",
  protect,
  requireRole("admin"),
  productCategoryController.createCategory
);
router.put(
  "/:id",
  protect,
  requireRole("admin"),
  productCategoryController.updateCategory
);
router.delete(
  "/:id",
  protect,
  requireRole("admin"),
  productCategoryController.deleteCategory
);

module.exports = router;
