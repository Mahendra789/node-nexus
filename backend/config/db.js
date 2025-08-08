const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
