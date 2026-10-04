const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middleware/auth");
const ProductItem = require("../models/ProductItem");

const adminOrderController = require("../controllers/adminOrderController");
const adminShippingController = require("../controllers/adminShippingController");
const adminPromotionController = require("../controllers/adminPromotionController");
const adminPaymentController = require("../controllers/adminPaymentController");
const adminInventoryController = require("../controllers/adminInventoryController");

// All admin routes require authentication + admin role
router.use(protect, requireRole("admin"));

// Product Items
router.post("/product-item", async (req, res, next) => {
  try {
    const { product, SKU, qty_in_stock = 0, price, product_image } = req.body;
    const pi = await ProductItem.create({ product, SKU, qty_in_stock, price, product_image });
    res.status(201).json(pi);
  } catch (err) {
    next(err);
  }
});

// Admin Order Management
router.get("/orders", adminOrderController.listAllOrders);
router.get("/orders/:id", adminOrderController.getOrderDetails);
router.patch("/orders/:id/status", adminOrderController.updateOrderStatus);
router.get("/order-statuses", adminOrderController.listOrderStatuses);

// Admin Shipping Methods
router.get("/shipping-methods", adminShippingController.listShippingMethods);
router.post("/shipping-methods", adminShippingController.createShippingMethod);
router.put("/shipping-methods/:id", adminShippingController.updateShippingMethod);
router.delete("/shipping-methods/:id", adminShippingController.deleteShippingMethod);

// Admin Promotions
router.get("/promotions", adminPromotionController.listPromotions);
router.post("/promotions", adminPromotionController.createPromotion);
router.put("/promotions/:id", adminPromotionController.updatePromotion);
router.delete("/promotions/:id", adminPromotionController.deletePromotion);

// Admin Payments & Transactions
router.get("/payments/transactions", adminPaymentController.listTransactions);
router.get("/payments/types", adminPaymentController.listPaymentTypes);
router.post("/payments/types", adminPaymentController.createPaymentType);
router.delete("/payments/types/:id", adminPaymentController.deletePaymentType);

// Admin Inventory
router.get("/inventory", adminInventoryController.listInventory);
router.patch("/inventory/:id", adminInventoryController.updateStock);

module.exports = router;
