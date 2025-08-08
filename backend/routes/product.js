const express = require("express");

const productController = require("../controllers/product");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/all", productController.getProducts);

module.exports = router;
