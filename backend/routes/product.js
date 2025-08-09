const express = require("express");

const productController = require("../controllers/product");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/all", isAuth, isAuth, productController.getProducts);
router.delete("/:productId", isAuth, isAuth, productController.deleteProduct);
router.get("/stats", isAuth, isAuth, productController.stats);
router.get(
  "/sales-and-orders",
  isAuth,
  isAuth,
  productController.salesAndOrders
);
router.get(
  "/suppliers-and-categories",
  isAuth,
  isAuth,
  productController.suppliersAndCategories
);
router.get("/suppliers", isAuth, isAuth, productController.suppliers);
router.get("/categories", isAuth, isAuth, productController.categories);

module.exports = router;
