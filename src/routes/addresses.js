const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const { protect } = require("../middleware/auth");

router.get("/", protect, addressController.listAddresses);
router.post("/", protect, addressController.createAddress);
router.put("/:id", protect, addressController.updateAddress);
router.delete("/:id", protect, addressController.deleteAddress);
router.patch("/:id/default", protect, addressController.setDefault);

module.exports = router;
