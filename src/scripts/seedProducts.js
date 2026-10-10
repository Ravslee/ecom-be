require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const Product = require("../models/Product");
const ProductItem = require("../models/ProductItem");
const ProductCategory = require("../models/ProductCategory");
const Variation = require("../models/Variation");
const VariationOption = require("../models/VariationOption");
const ProductConfiguration = require("../models/ProductConfiguration");

const DUMMY_CATEGORIES = [
  { category_name: "Woman Collection" },
  { category_name: "Man Collection" },
  { category_name: "Accessories & Bags" },
  { category_name: "Footwear & Sneakers" },
];

const DUMMY_PRODUCTS = [
  // Woman
  {
    name: "Blue Gown",
    categoryName: "Woman Collection",
    description: "Elegant floor-length evening gown crafted from premium silk blend.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/blue-gown.png",
    price: 45.0,
    SKU: "BG-W01",
    stock: 25,
  },
  {
    name: "Top Shirt",
    categoryName: "Woman Collection",
    description: "Minimalist relaxed fit button-up blouse for daily summer chic.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/4.png",
    price: 50.0,
    SKU: "TS-W02",
    stock: 18,
  },
  {
    name: "Red Strip Top",
    categoryName: "Woman Collection",
    description: "Casual striped cotton top with breathable weave and crew neckline.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/5.png",
    price: 40.0,
    SKU: "RS-W03",
    stock: 30,
  },
  {
    name: "Wool Jacket",
    categoryName: "Woman Collection",
    description: "Tailored wool blend jacket with double-breasted closure and silk lining.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/6.png",
    price: 55.0,
    SKU: "WJ-W04",
    stock: 12,
  },
  {
    name: "Crimson Jacket",
    categoryName: "Woman Collection",
    description: "Vibrant crimson lightweight autumn blazer with structured shoulders.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/8.png",
    price: 35.0,
    SKU: "CJ-W05",
    stock: 15,
  },
  {
    name: "Pink Shirt",
    categoryName: "Woman Collection",
    description: "Soft pastel pink linen shirt designed for casual everyday elegance.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/1.png",
    price: 30.0,
    SKU: "PS-W06",
    stock: 40,
  },
  {
    name: "Gray Tank Top",
    categoryName: "Woman Collection",
    description: "Essential ribbed gray stretch tank top crafted from organic cotton.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/3.png",
    price: 28.0,
    SKU: "GT-W07",
    stock: 50,
  },
  {
    name: "Pinky Tank Top",
    categoryName: "Woman Collection",
    description: "Lightweight pink sleeveless top with subtle ribbed texture.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/2.png",
    price: 25.0,
    SKU: "PT-W08",
    stock: 35,
  },

  // Man
  {
    name: "White Jacket",
    categoryName: "Man Collection",
    description: "Modern street style white zip outerwear jacket with utility pockets.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/11-alt-1.png",
    price: 50.0,
    SKU: "WJ-M01",
    stock: 20,
  },
  {
    name: "Blue Denim Jeans",
    categoryName: "Man Collection",
    description: "Classic slim-fit washed blue denim jeans with durable stretch fabric.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/9.png",
    price: 45.0,
    SKU: "BD-M02",
    stock: 32,
  },
  {
    name: "Gray Casual Shirt",
    categoryName: "Man Collection",
    description: "Versatile charcoal gray Oxford button-down shirt for work or weekend.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/10.png",
    price: 30.0,
    SKU: "GS-M03",
    stock: 28,
  },
  {
    name: "Stripe Hoody",
    categoryName: "Man Collection",
    description: "Cozy fleece hoodie with minimal stripe detailing and kangaroo pocket.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/12.png",
    price: 30.0,
    SKU: "SH-M04",
    stock: 14,
  },
  {
    name: "Blue Stripped Shirt",
    categoryName: "Man Collection",
    description: "Vertical pinstripe navy blue casual shirt with soft collar.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/13.png",
    price: 35.0,
    SKU: "BS-M05",
    stock: 22,
  },
  {
    name: "Red Stripped Shirt",
    categoryName: "Man Collection",
    description: "Tailored red pinstripe short-sleeve shirt in breathable cotton blend.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/14.png",
    price: 35.0,
    SKU: "RS-M06",
    stock: 19,
  },
  {
    name: "Classic Blue Shirt",
    categoryName: "Man Collection",
    description: "Timeless light blue dress shirt with button cuffs.",
    product_image: "https://demo.acracreative.com/fashable/wp-content/uploads/2022/10/15.png",
    price: 40.0,
    SKU: "CS-M07",
    stock: 26,
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ecom";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Create or find categories
    const catMap = {};
    for (const cData of DUMMY_CATEGORIES) {
      let cat = await ProductCategory.findOne({ category_name: cData.category_name });
      if (!cat) {
        cat = await ProductCategory.create(cData);
      }
      catMap[cData.category_name] = cat._id;
    }

    // Variations (Size & Color)
    let sizeVar = await Variation.findOne({ name: "Size" });
    if (!sizeVar) {
      const catId = catMap["Woman Collection"];
      sizeVar = await Variation.create({ name: "Size", category: catId });
    }

    let colorVar = await Variation.findOne({ name: "Color" });
    if (!colorVar) {
      const catId = catMap["Woman Collection"];
      colorVar = await Variation.create({ name: "Color", category: catId });
    }

    // Variation Options
    const SIZES = ["S", "M", "L", "XL"];
    const COLORS = ["Beige", "Black", "Navy Blue", "Crimson"];

    const sizeOptMap = {};
    for (const sVal of SIZES) {
      let opt = await VariationOption.findOne({ variation: sizeVar._id, value: sVal });
      if (!opt) {
        opt = await VariationOption.create({ variation: sizeVar._id, value: sVal });
      }
      sizeOptMap[sVal] = opt._id;
    }

    const colorOptMap = {};
    for (const cVal of COLORS) {
      let opt = await VariationOption.findOne({ variation: colorVar._id, value: cVal });
      if (!opt) {
        opt = await VariationOption.create({ variation: colorVar._id, value: cVal });
      }
      colorOptMap[cVal] = opt._id;
    }

    // Seed Products & ProductItems
    let seededCount = 0;
    for (const pData of DUMMY_PRODUCTS) {
      const categoryId = catMap[pData.categoryName];

      let product = await Product.findOne({ name: pData.name });
      if (!product) {
        product = await Product.create({
          name: pData.name,
          description: pData.description,
          category: categoryId,
          product_image: pData.product_image,
        });
      }

      // Check if item / SKU exists
      let item = await ProductItem.findOne({ product: product._id, SKU: pData.SKU });
      if (!item) {
        item = await ProductItem.create({
          product: product._id,
          SKU: pData.SKU,
          qty_in_stock: pData.stock,
          price: pData.price,
          product_image: pData.product_image,
        });

        // Add ProductConfiguration linkage (e.g. Size M, Color Black)
        await ProductConfiguration.create({
          product_item: item._id,
          variation_option: sizeOptMap["M"],
        });
        await ProductConfiguration.create({
          product_item: item._id,
          variation_option: colorOptMap["Black"],
        });

        seededCount++;
      }
    }

    console.log(`✅ Successfully seeded ${seededCount} dummy products & SKUs into MongoDB database!`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
