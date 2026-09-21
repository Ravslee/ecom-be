const express = require("express");
const router = express.Router();
const shippingMethodController = require("../controllers/shippingMethodController");

router.get("/", shippingMethodController.list);

module.exports = router;
