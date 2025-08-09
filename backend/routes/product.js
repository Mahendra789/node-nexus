const express = require("express");

const productController = require("../controllers/product");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/all", productController.getProducts);
router.delete("/:productId", productController.deleteProduct);
router.get("/stats", productController.stats);
router.get("/sales-and-orders", productController.salesAndOrders);
router.get(
  "/suppliers-and-categories",
  productController.suppliersAndCategories
);
router.get("/suppliers", productController.suppliers);
router.get("/categories", productController.categories);

module.exports = router;
