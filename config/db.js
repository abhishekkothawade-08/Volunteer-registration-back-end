const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  // Reuse existing connection
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // Check MONGO_URI
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = conn.connection.readyState === 1;

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (error) {
    isConnected = false;

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};

module.exports = connectDB;