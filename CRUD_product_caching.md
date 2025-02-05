# Caching Product Routes with Redis (CRUD Example)

## Introduction
This project demonstrates how to integrate Redis caching into a Node.js Express application for caching product-related CRUD operations. Caching reduces database queries and improves response time.

## Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- Redis

## Prerequisites
- Install Node.js and npm
- Install Redis and ensure it's running on `localhost:6379`
- Set up MongoDB

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Redis Server:
   ```bash
   redis-server
   ```
4. Run the application:
   ```bash
   npm start
   ```

## Project Structure
```
.
├── index.js
├── models
│   ├── product.js
├── routes
│   ├── productRoutes.js
├── config
│   ├── redis.js
├── package.json
```

## Implementation

### Setting Up Redis
Create a `config/redis.js` file to handle Redis connection.
```js
const redis = require("redis");
const client = redis.createClient();
client.connect();

client.on("error", (err) => {
  console.error("Redis error: ", err);
});

module.exports = client;
```

### Creating the Product Model
Create a `models/product.js` file to define the Mongoose schema.
```js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

module.exports = mongoose.model("Product", productSchema);
```

### Implementing Product Routes with Caching
Create a `routes/productRoutes.js` file.
```js
const express = require("express");
const Product = require("../models/product");
const client = require("../config/redis");

const router = express.Router();

// Get Product by ID with Redis Caching
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  const cachedProduct = await client.get(`product:${id}`);
  if (cachedProduct) {
    return res.json(JSON.parse(cachedProduct));
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await client.setEx(`product:${id}`, 3600, JSON.stringify(product));
  res.json(product);
});

// Create a Product
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Update a Product
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  await client.setEx(`product:${id}`, 3600, JSON.stringify(updatedProduct));
  res.json(updatedProduct);
});

// Delete a Product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  await client.del(`product:${id}`);
  res.json({ message: "Product deleted" });
});

module.exports = router;
```

### Integrating Routes in `index.js`
```js
const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(express.json());
app.use("/products", productRoutes);

mongoose.connect("mongodb://localhost:27017/products", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

## API Endpoints
| Method | Endpoint        | Description                 |
|--------|---------------|-----------------------------|
| GET    | `/products/:id` | Get product with caching   |
| POST   | `/products/`    | Create a new product       |
| PUT    | `/products/:id` | Update a product          |
| DELETE | `/products/:id` | Delete a product          |


