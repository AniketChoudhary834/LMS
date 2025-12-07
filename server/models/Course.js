const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  freePreview: { type: Boolean, default: false }
});

const CourseSchema = new mongoose.Schema({
  instructorId: { type: String, required: true },
  instructorName: { type: String, required: true },
  title: { type: String, required: true },
  category: String,
  level: String,
  primaryLanguage: String,
  description: String,
  image: String,
  welcomeMessage: String,
  objectives: String,
  curriculum: [LectureSchema],
  students: [{
    studentId: String,
    studentName: String,
    studentEmail: String,
    completed: { type: Boolean, default: false }
  }],
  isPublished: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Course", CourseSchema);


