// Simple input validation before the data reaches the controller

// Used for POST (create): all main fields must be present
const validateCreate = (req, res, next) => {
  const { name, sku, category, price, quantity } = req.body;

  if (!name || !sku || !category) {
    return res
      .status(400)
      .json({ message: "name, sku and category are required" });
  }
  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ message: "price must be a number" });
  }
  if (quantity !== undefined && isNaN(quantity)) {
    return res.status(400).json({ message: "quantity must be a number" });
  }
  next();
};

// Used for PUT (update): only check the fields that are sent
const validateUpdate = (req, res, next) => {
  const { price, quantity, reorderLevel } = req.body;

  if (price !== undefined && isNaN(price)) {
    return res.status(400).json({ message: "price must be a number" });
  }
  if (quantity !== undefined && isNaN(quantity)) {
    return res.status(400).json({ message: "quantity must be a number" });
  }
  if (reorderLevel !== undefined && isNaN(reorderLevel)) {
    return res.status(400).json({ message: "reorderLevel must be a number" });
  }
  next();
};

// Used for PATCH /:id/stock
const validateStockChange = (req, res, next) => {
  const { change } = req.body;

  if (change === undefined || typeof change !== "number" || change === 0) {
    return res
      .status(400)
      .json({ message: "change must be a non-zero number (e.g. 10 or -5)" });
  }
  next();
};

module.exports = { validateCreate, validateUpdate, validateStockChange };
