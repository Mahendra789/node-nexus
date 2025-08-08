const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mahendraahada:kgBLJmmTWTO1HYgH@node-nexus.uubnrj0.mongodb.net/node-nexus"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
