const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connectDB = require("./config/db");

const userController = require("./controllers/user");

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
app.post("/user", userController.addUser);
app.get("/user", userController.getUser);
app.put("/user/:userId", userController.updateUser);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
