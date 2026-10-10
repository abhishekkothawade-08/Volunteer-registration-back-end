const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("../config/db");

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://volunteer-registration-front-end.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Volunteer Management System API Running",
  });
});

// Routes
app.use("/api/auth", require("../routes/authRoutes"));

app.use(
  "/api/volunteers",
  require("../routes/volunteerRoutes")
);

app.use(
  "/api/admin",
  require("../routes/adminRoutes")
);

module.exports = app;