const express = require("express");
const variationOptionController = require("../controllers/variationOptionController");
const { protect, authorize } = require("../middleware/auth"); // optional auth middlewares

const router = express.Router();

// Define routes
router.post("/", protect, variationOptionController.create);
router.get("/", variationOptionController.findAll);
router.get("/:id", variationOptionController.findById);
router.put("/:id", protect, variationOptionController.update);
router.delete("/:id", protect, variationOptionController.delete);

router.get(
  "/variation/:variationId",
  variationOptionController.findAllByVariationId
);
router.delete(
  "/variation/:variationId",
  variationOptionController.deleteByVariationId
);
module.exports = router;
