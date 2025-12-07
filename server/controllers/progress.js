const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const StudentCourses = require("../models/StudentCourses");

// Get progress
exports.getProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Check if enrolled
    const studentCourses = await StudentCourses.findOne({ userId });
    const isEnrolled = studentCourses?.courses.some(c => c.courseId.toString() === courseId);
    
    if (!isEnrolled) {
      return res.json({ success: true, data: { isEnrolled: false } });
    }

    const progress = await CourseProgress.findOne({ userId, courseId });
    const course = await Course.findById(courseId);

    if (!progress || !progress.lecturesProgress.length) {
      return res.json({
        success: true,
        data: {
          courseDetails: course,
          progress: [],
          isEnrolled: true
        }
      });
    }

    res.json({
      success: true,
      data: {
        courseDetails: course,
        progress: progress.lecturesProgress,
        completed: progress.completed,
        completionDate: progress.completionDate,
        isEnrolled: true
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark lecture as viewed
exports.markLectureViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [{
          lectureId,
          viewed: true,
          dateViewed: new Date()
        }]
      });
    } else {
      const lectureProgress = progress.lecturesProgress.find(l => l.lectureId === lectureId);
      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date()
        });
      }
    }

    const course = await Course.findById(courseId);
    const allViewed = progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every(l => l.viewed);

    if (allViewed) {
      progress.completed = true;
      progress.completionDate = new Date();
      
      const studentIndex = course.students.findIndex(s => s.studentId.toString() === userId);
      if (studentIndex !== -1) {
        course.students[studentIndex].completed = true;
        await course.save();
      }
    }

    await progress.save();
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset progress
exports.resetProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const progress = await CourseProgress.findOne({ userId, courseId });
    
    if (!progress) {
      return res.status(404).json({ success: false, message: "Progress not found" });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;
    await progress.save();

    res.json({ success: true, message: "Progress reset" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


