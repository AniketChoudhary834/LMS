const mongoose = require("mongoose");

const StudentCoursesSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  courses: [{
    courseId: String,
    title: String,
    instructorId: String,
    instructorName: String,
    dateOfPurchase: Date,
    courseImage: String
  }]
});

module.exports = mongoose.model("StudentCourses", StudentCoursesSchema);


