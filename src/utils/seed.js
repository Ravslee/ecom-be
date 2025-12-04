require('dotenv').config();
const connectDB = require('../config/db');
const ShippingMethod = require('../models/ShippingMethod');
const OrderStatus = require('../models/OrderStatus');
const User = require('../models/User');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const ProductItem = require('../models/ProductItem');
const bcrypt = require('bcryptjs');

(async function seed(){
  await connectDB();
  await ShippingMethod.deleteMany({});
  await OrderStatus.deleteMany({});
  await Product.deleteMany({});
  await ProductItem.deleteMany({});
  await ProductCategory.deleteMany({});
  await User.deleteMany({});

  await ShippingMethod.create([{ name: 'Standard', price: 20 }, { name: 'Express', price: 50 }]);
  await OrderStatus.create([{ status: 'Pending' }, { status: 'Processing' }, { status: 'Shipped' }, { status: 'Delivered' }]);

  const adminPw = await bcrypt.hash('admin123', 10);
  const userPw = await bcrypt.hash('user1234', 10);
  const admin = await User.create({ email_address: 'admin@local', passwordHash: adminPw, role: 'admin' });
  const user = await User.create({ email_address: 'user@local', passwordHash: userPw, role: 'user' });

  const cat = await ProductCategory.create({ category_name: 'Default' });
  const p = await Product.create({ name: 'Sample Product', description: 'A demo product', category: cat._id });
  await ProductItem.create({ product: p._id, SKU: 'SAMPLE-001', qty_in_stock: 100, price: 499 });

  console.log('Seed done. Admin credentials: admin@local/admin123  | User: user@local/user1234');
  process.exit(0);
})();
