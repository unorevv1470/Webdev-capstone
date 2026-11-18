// Run with:  npm run seed
// Adds 12 sample products so you can test filtering, pagination and reports
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const sampleProducts = [
  { name: "Study Table", sku: "FURN-TB-812", category: "Furniture", price: 3999, quantity: 2, reorderLevel: 4, supplier: "IKEA India" },
  { name: "Office Chair", sku: "FURN-CH-101", category: "Furniture", price: 5499, quantity: 15, reorderLevel: 5, supplier: "IKEA India" },
  { name: "Bookshelf", sku: "FURN-BS-205", category: "Furniture", price: 2999, quantity: 3, reorderLevel: 5, supplier: "Urban Ladder" },
  { name: "Wireless Mouse", sku: "ELEC-MS-301", category: "Electronics", price: 799, quantity: 40, reorderLevel: 10, supplier: "Logitech" },
  { name: "Mechanical Keyboard", sku: "ELEC-KB-302", category: "Electronics", price: 3499, quantity: 25, reorderLevel: 8, supplier: "Logitech" },
  { name: "Laptop", sku: "ELEC-LP-303", category: "Electronics", price: 55000, quantity: 6, reorderLevel: 5, supplier: "Dell" },
  { name: "Bluetooth Speaker", sku: "ELEC-SP-304", category: "Electronics", price: 1999, quantity: 3, reorderLevel: 6, supplier: "boAt" },
  { name: "Cotton T-Shirt", sku: "APRL-TS-401", category: "Apparel", price: 499, quantity: 60, reorderLevel: 15, supplier: "Allen Solly" },
  { name: "Denim Jeans", sku: "APRL-JN-402", category: "Apparel", price: 2299, quantity: 18, reorderLevel: 10, supplier: "Levis" },
  { name: "Gel Pen Pack of 10", sku: "STNY-PN-501", category: "Stationery", price: 100, quantity: 8, reorderLevel: 20, supplier: "Cello Pens" },
  { name: "A4 Notebook", sku: "STNY-NB-502", category: "Stationery", price: 60, quantity: 120, reorderLevel: 30, supplier: "Classmate" },
  { name: "Rice 5kg Bag", sku: "GROC-RC-601", category: "Grocery", price: 450, quantity: 4, reorderLevel: 10, supplier: "India Gate" },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({}); // clear old data
    await Product.insertMany(sampleProducts);
    console.log("Sample products added!");
    process.exit(0);
  } catch (error) {
    console.log("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
