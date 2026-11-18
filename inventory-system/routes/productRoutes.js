const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
  getLowStock,
  getCategorySummary,
} = require("../controllers/productController");

const {
  validateCreate,
  validateUpdate,
  validateStockChange,
} = require("../middleware/validateProduct");

// IMPORTANT: fixed routes (/low-stock, /summary) must come BEFORE "/:id",
// otherwise Express will treat "low-stock" as an id.
router.get("/low-stock", getLowStock);
router.get("/summary", getCategorySummary);

router.post("/", validateCreate, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", validateUpdate, updateProduct);
router.patch("/:id/stock", validateStockChange, adjustStock);
router.delete("/:id", deleteProduct);

module.exports = router;
