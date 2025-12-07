const mongoose = require("mongoose");

const LectureProgressSchema = new mongoose.Schema({
  lectureId: String,
  viewed: Boolean,
  dateViewed: Date
});

const CourseProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completionDate: Date,
  lecturesProgress: [LectureProgressSchema]
});

module.exports = mongoose.model("CourseProgress", CourseProgressSchema);


