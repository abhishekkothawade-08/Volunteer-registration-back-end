const router = require("express").Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get(
  "/dashboard",
  protect,
  admin,
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Admin Dashboard",
      admin: req.user,
    });
  }
);

module.exports = router;