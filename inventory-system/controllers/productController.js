const Product = require("../models/Product");

// 1. CREATE a product  ->  POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// 2. GET ALL products with filtering, sorting and pagination
//    GET /api/products?category=Furniture&minPrice=100&sort=-price&page=1&limit=10
const getAllProducts = async (req, res, next) => {
  try {
    // ----- Filtering -----
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.supplier) {
      filter.supplier = req.query.supplier;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.search) {
      // search by name (case-insensitive)
      const text = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: text, $options: "i" };
    }

    // ----- Sorting -----
    // sort=price (low to high)  or  sort=-price (high to low)
    let sortBy = "-createdAt";
    if (req.query.sort) {
      sortBy = req.query.sort.split(",").join(" ");
    }

    // ----- Pagination -----
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortBy).skip(skip).limit(limit);

    res.status(200).json({
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      count: products.length,
      products: products,
    });
  } catch (error) {
    next(error);
  }
};

// 3. GET ONE product  ->  GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// 4. UPDATE product details  ->  PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated product
      runValidators: true, // apply schema validation on update too
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// 5. STOCK ADJUSTMENT  ->  PATCH /api/products/:id/stock   body: { "change": 10 }
//    positive number = restock, negative number = sale
const adjustStock = async (req, res, next) => {
  try {
    const change = req.body.change;

    // For a sale, make sure there is enough stock.
    // The condition and the update happen in ONE database step,
    // so stock can never go below zero even with many requests at once.
    const filter = { _id: req.params.id };
    if (change < 0) {
      filter.quantity = { $gte: -change };
    }

    const product = await Product.findOneAndUpdate(
      filter,
      { $inc: { quantity: change } },
      { new: true }
    );

    if (!product) {
      // Either the product does not exist, or there is not enough stock
      const exists = await Product.findById(req.params.id);
      if (!exists) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(400).json({
        message: "Not enough stock for this sale",
        availableQuantity: exists.quantity,
      });
    }

    res.status(200).json({ message: "Stock updated", product: product });
  } catch (error) {
    next(error);
  }
};

// 6. DELETE product  ->  DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted", id: product._id });
  } catch (error) {
    next(error);
  }
};

// 7. LOW STOCK REPORT  ->  GET /api/products/low-stock
//    Products where quantity <= reorderLevel
const getLowStock = async (req, res, next) => {
  try {
    const lowStockItems = await Product.aggregate([
      { $match: { $expr: { $lte: ["$quantity", "$reorderLevel"] } } },
      { $sort: { quantity: 1 } }, // lowest stock first
    ]);

    res.status(200).json({
      count: lowStockItems.length,
      lowStockItems: lowStockItems,
    });
  } catch (error) {
    next(error);
  }
};

// 8. CATEGORY SUMMARY (aggregation)  ->  GET /api/products/summary
const getCategorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { totalStockValue: -1 } }, // highest value category first
    ]);

    res.status(200).json({
      categories: summary.length,
      summary: summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
  getLowStock,
  getCategorySummary,
};
