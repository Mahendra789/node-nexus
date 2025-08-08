const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    product_name: { type: String },
    category: { type: String },
    quantity: { type: Number },
    unit_price: { type: Number },
    total_price: { type: Number },
    date_ordered: { type: String },
    supplier: { type: String },
    about: { type: String },
    customer_name: { type: String },
    customer_email: { type: String },
  },
  { collection: "products" }
);

module.exports = mongoose.model("Product", productSchema);
