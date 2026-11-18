require("dotenv").config(); // load variables from .env

const express = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to read JSON body
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Inventory API is running" });
});
app.use("/api/products", productRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
