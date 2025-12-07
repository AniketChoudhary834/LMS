const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getProgress,
  markLectureViewed,
  resetProgress
} = require("../controllers/progress");

// Get progress
router.get("/:userId/:courseId", authMiddleware, getProgress);

// Mark lecture as viewed
router.post("/mark-viewed", authMiddleware, markLectureViewed);

// Reset progress
router.post("/reset", authMiddleware, resetProgress);

module.exports = router;


