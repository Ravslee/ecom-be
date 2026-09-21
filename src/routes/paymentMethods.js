const express = require("express");
const router = express.Router();
const paymentMethodController = require("../controllers/paymentMethodController");
const { protect } = require("../middleware/auth");

router.get("/", protect, paymentMethodController.list);
router.post("/", protect, paymentMethodController.create);
router.get("/types", protect, paymentMethodController.listTypes);

module.exports = router;
