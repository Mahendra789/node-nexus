require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

const app = express();
const connectDB = require("./config/db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
// Support both legacy and new signup endpoints

// Basic health/root endpoints for platform health checks
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/product", productRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
