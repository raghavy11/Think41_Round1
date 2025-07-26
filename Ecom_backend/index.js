const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const csv = require("csv-parser");

const app = express();
app.use(express.json());
app.use(cors());

const productsPath = path.join(__dirname, "archive/products.csv");
const ordersPath = path.join(__dirname, "archive/orders.csv");

let products = [];
let orders = [];

fs.createReadStream(productsPath)
  .pipe(csv())
  .on("data", (row) => {
    row.units_sold = parseInt(row.units_sold);
    row.stock = parseInt(row.stock);
    products.push(row);
  });

fs.createReadStream(ordersPath)
  .pipe(csv())
  .on("data", (row) => {
    orders.push(row);
  });

app.get("/api/top-products", (req, res) => {
  const top = products
    .sort((a, b) => b.units_sold - a.units_sold)
    .slice(0, 5);
  res.json(top);
});

app.get("/api/order/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (order) res.json(order);
  else res.status(404).json({ error: "Order not found" });
});

app.get("/api/stock/:product", (req, res) => {
  const match = products.find((p) =>
    p.name.toLowerCase().includes(req.params.product.toLowerCase())
  );
  if (match) res.json({ name: match.name, stock: match.stock });
  else res.status(404).json({ error: "Product not found" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));



