const express = require("express");
const router = express.Router();
const paymentMethodController = require("../controllers/paymentMethodController");
const { protect } = require("../middleware/auth");

router.get("/", protect, paymentMethodController.list);
router.post("/", protect, paymentMethodController.create);
router.delete("/:id", protect, paymentMethodController.deleteMethod);
router.patch("/:id/default", protect, paymentMethodController.setDefault);
router.get("/types", protect, paymentMethodController.listTypes);

module.exports = router;
