const express = require("express");
const { protect } = require("../middleware/auth"); // optional auth middlewares

const router = express.Router();

const {
  createVariation,
  getVariations,
  getVariationById,
  updateVariation,
  deleteVariation,
} = require("../controllers/variationController");

// GET /api/variations        -> list variations (public)
// POST /api/variations       -> create variation (protected, admin)
router.get("/", getVariations);
router.post("/", protect, createVariation);

// GET /api/variations/:id    -> get single variation (public)
// PUT /api/variations/:id    -> update variation (protected, admin)
// DELETE /api/variations/:id -> delete variation (protected, admin)
router.route("/:id").get(getVariationById);
router.route("/:id").put(protect, updateVariation);
router.route("/:id").delete(protect, deleteVariation);

module.exports = router;
