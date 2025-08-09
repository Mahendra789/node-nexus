const express = require("express");

const userController = require("../controllers/auth");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/user", isAuth, userController.getUser);
router.put("/user/:userId", isAuth, userController.updateUser);

module.exports = router;
