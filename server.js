const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    message: "Volunteer Management System API Running",
  });
});

/*
Routes
*/

app.use("/api/auth", require("./routes/authRoutes"));

app.use(
  "/api/volunteers",
  require("./routes/volunteerRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});