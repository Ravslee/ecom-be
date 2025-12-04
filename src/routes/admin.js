const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const Product = require('../models/Product');
const ProductItem = require('../models/ProductItem');

// simple admin endpoints to create product item
router.post('/product-item', protect, requireRole('admin'), async (req, res, next) => {
  try {
    const { product, SKU, qty_in_stock=0, price, product_image } = req.body;
    const pi = await ProductItem.create({ product, SKU, qty_in_stock, price, product_image });
    res.status(201).json(pi);
  } catch (err) { next(err); }
});

module.exports = router;
