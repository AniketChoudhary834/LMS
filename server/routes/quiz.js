const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  generateQuiz,
  saveQuizResult,
  getQuizResults
} = require("../controllers/quiz");

// Generate quiz
router.post("/", generateQuiz);

// Save quiz result
router.post("/result", authMiddleware, saveQuizResult);

// Get quiz results
router.get("/results", authMiddleware, getQuizResults);

module.exports = router;


