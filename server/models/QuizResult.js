const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QuizResult", QuizResultSchema);


