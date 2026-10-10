const router = require("express").Router();

const Volunteer = require("../models/Volunteer");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const volunteerOnly = (req, res, next) => {
  if (req.user.role !== "volunteer") {
    return res.status(403).json({
      success: false,
      message: "Access Denied. Volunteer accounts only.",
    });
  }

  next();
};

const applicationFields = [
  "phone",
  "age",
  "city",
  "skills",
  "availability",
  "reason",
];

const getTrimmedApplication = (body) =>
  Object.fromEntries(
    applicationFields.map((field) => [
      field,
      typeof body[field] === "string" ? body[field].trim() : body[field],
    ])
  );

// Statistics and named routes intentionally appear before dynamic routes.

// Statistics - ADMIN
router.get(
  "/stats",
  protect,
  admin,
  async (req, res) => {
    try {
      const [total, approved, pending, rejected] = await Promise.all([
        Volunteer.countDocuments(),
        Volunteer.countDocuments({ status: "Approved" }),
        Volunteer.countDocuments({ status: "Pending" }),
        Volunteer.countDocuments({ status: "Rejected" }),
      ]);

      res.json({ success: true, total, approved, pending, rejected });
    } catch (error) {
      console.error("Could not load volunteer statistics:", error.message);
      res.status(500).json({ success: false, message: "Unable to load volunteer statistics" });
    }
  }
);

// Get logged-in volunteer's application
router.get(
  "/my-application",
  protect,
  volunteerOnly,
  async (req, res) => {
    try {
      const volunteer = await Volunteer.findOne({ userId: req.user._id });

      if (!volunteer) {
        return res.status(404).json({ success: false, message: "No volunteer application found" });
      }

      res.json({ success: true, volunteer });
    } catch (error) {
      console.error("Could not load volunteer application:", error.message);
      res.status(500).json({ success: false, message: "Unable to load volunteer application" });
    }
  }
);

// Get all volunteers - ADMIN
router.get(
  "/",
  protect,
  admin,
  async (req, res) => {
    try {
      const volunteers =
        await Volunteer.find().sort({
          createdAt: -1,
        });

      res.json({ success: true, volunteers });
    } catch (error) {
      console.error("Could not load volunteer applications:", error.message);

      res.status(500).json({
        success: false,
        message: "Unable to load volunteer applications",
      });
    }
  }
);

// Register Volunteer - LOGGED IN USER
router.post(
  "/",
  protect,
  volunteerOnly,
  async (req, res) => {
    try {
      const application = getTrimmedApplication(req.body);
      const missingField = applicationFields.find((field) => !application[field]);

      if (missingField || !Number.isInteger(Number(application.age)) || Number(application.age) < 16 || Number(application.age) > 120) {
        return res.status(400).json({
          success: false,
          message: "Please provide all application fields and an age between 16 and 120.",
        });
      }

      const existing = await Volunteer.findOne({ userId: req.user._id });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "You have already submitted a volunteer application.",
        });
      }

      const volunteer = await Volunteer.create({
          userId: req.user._id,
          name: req.user.name,
          email: req.user.email,
          ...application,
          age: Number(application.age),
        });

      res.status(201).json({
        success: true,
        message:
          "Volunteer Registered Successfully",
        volunteer,
      });

    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: "You have already submitted a volunteer application." });
      }

      console.error("Could not submit volunteer application:", error.message);

      res.status(500).json({
        success: false,
        message: "Unable to submit volunteer application",
      });
    }
  }
);

// Approve - ADMIN
router.put(
  "/approve/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.findByIdAndUpdate(
          req.params.id,
          { status: "Approved", adminRemarks: req.body.adminRemarks?.trim() || "" },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          message: "Volunteer not found",
        });
      }

      res.json({ success: true, message: "Volunteer application approved", volunteer });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to approve volunteer application",
      });
    }
  }
);

// Reject - ADMIN
router.put(
  "/reject/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.findByIdAndUpdate(
          req.params.id,
          { status: "Rejected", adminRemarks: req.body.adminRemarks?.trim() || "" },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          message: "Volunteer not found",
        });
      }

      res.json({ success: true, message: "Volunteer application rejected", volunteer });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to reject volunteer application",
      });
    }
  }
);

// Delete - ADMIN
router.delete(
  "/:id",
  protect,
  admin,
  async (req, res) => {
    try {
      const volunteer =
        await Volunteer.findByIdAndDelete(
          req.params.id
        );

      if (!volunteer) {
        return res.status(404).json({
          success: false,
          message: "Volunteer not found",
        });
      }

      res.json({
        success: true,
        message:
          "Volunteer Deleted Successfully",
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Unable to delete volunteer application",
      });
    }
  }
);

module.exports = router;
