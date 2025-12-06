// src/models/index.js
// Require each model file so mongoose.model(...) runs and registers names.
// Add any other model files you have here.

require("./User");
require("./Address");
require("./Country");
require("./PaymentType");
require("./PaymentMethod");
require("./ShippingMethod");
require("./OrderStatus");
require("./ShopOrder");
require("./OrderLine");
require("./ShoppingCart");
require("./ShoppingCartItem");
require("./ProductCategory"); // <-- important
require("./Product");
require("./ProductItem");
require("./Variation");
require("./VariationOption");
require("./ProductConfiguration");
require("./Promotion");
require("./PromotionCategory");
require("./UserReview");

// Optionally export helpers:
module.exports = {
  User: require("./User"),
  ProductCategory: require("./ProductCategory"),
  Product: require("./Product"),
  ProductItem: require("./ProductItem"),
  // add other exports you find useful
};
