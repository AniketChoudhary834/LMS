const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  createCourse,
  updateCourse,
  enrollInCourse,
  getEnrolledCourses,
  checkEnrollment
} = require("../controllers/courses");

// Get all courses (for students - only published)
router.get("/", getAllCourses);

// Get instructor's courses (must come before /:id)
router.get("/instructor/all", authMiddleware, getInstructorCourses);

// Get enrolled courses (must come before /:id)
router.get("/student/enrolled", authMiddleware, getEnrolledCourses);

// Get course details
router.get("/:id", getCourseById);

// Create course
router.post("/", authMiddleware, createCourse);

// Update course
router.put("/:id", authMiddleware, updateCourse);

// Enroll in course (free enrollment - no payment)
router.post("/:id/enroll", authMiddleware, enrollInCourse);

// Check if enrolled
router.get("/:id/check-enrollment", authMiddleware, checkEnrollment);

module.exports = router;


