# Inventory and Data Management System
Node.js + Express + MongoDB (Mongoose) + dotenv

## Setup
1. Install MongoDB and make sure it is running (or use a MongoDB Atlas URL).
2. `npm install`
3. Check `.env` (PORT and MONGO_URI)
4. (Optional) `npm run seed` to add 12 sample products
5. `npm start`  -> http://localhost:5000

## API Endpoints
| Method | URL | What it does |
|--------|-----|--------------|
| POST   | /api/products | Create product |
| GET    | /api/products | List products (filter, sort, paginate) |
| GET    | /api/products/:id | Get one product |
| PUT    | /api/products/:id | Update product details |
| PATCH  | /api/products/:id/stock | Restock / sale (`{"change": 10}` or `{"change": -3}`) |
| DELETE | /api/products/:id | Delete product |
| GET    | /api/products/low-stock | Products with quantity <= reorderLevel |
| GET    | /api/products/summary | Category-wise summary (aggregation) |

## Query examples
- `/api/products?category=Electronics`
- `/api/products?minPrice=500&maxPrice=5000`
- `/api/products?search=pen`
- `/api/products?sort=-price` (high to low) or `sort=price`
- `/api/products?page=2&limit=5`

## Sample POST body
```json
{ "name": "Gel Pen Pack of 15", "sku": "STNY-PN-713", "category": "Stationery",
  "price": 120, "quantity": 40, "reorderLevel": 20, "supplier": "Cello Pens" }
```
