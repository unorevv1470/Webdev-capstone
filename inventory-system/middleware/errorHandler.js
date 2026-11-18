// Centralized error handling - every error ends up here

// Runs when no route matches
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  // Mongoose validation error (e.g. price is negative)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Validation failed", errors: messages });
  }

  // Invalid MongoDB id format
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid product id" });
  }

  // Duplicate key error (SKU already exists)
  if (err.code === 11000) {
    return res.status(400).json({ message: "SKU already exists" });
  }

  console.log(err);
  res.status(500).json({ message: "Server error", error: err.message });
};

module.exports = { notFound, errorHandler };
