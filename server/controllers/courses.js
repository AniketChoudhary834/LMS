const Course = require("../models/Course");
const StudentCourses = require("../models/StudentCourses");

// Get all courses (for students - only published)
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, language, sort } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (language) query.primaryLanguage = language;

    let courses = await Course.find(query);

    if (sort === "title-atoz") {
      courses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "title-ztoa") {
      courses.sort((a, b) => b.title.localeCompare(a.title));
    }

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get course details
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get instructor's courses
exports.getInstructorCourses = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const courses = await Course.find({ instructorId: req.user._id });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create course
exports.createCourse = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const courseData = {
      ...req.body,
      instructorId: req.user._id,
      instructorName: req.user.userName
    };

    const course = new Course(courseData);
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not your course" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Enroll in course (free enrollment - no payment)
exports.enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Add to StudentCourses
    let studentCourses = await StudentCourses.findOne({ userId: req.user._id });
    if (studentCourses) {
      const alreadyEnrolled = studentCourses.courses.some(c => c.courseId.toString() === courseId);
      if (!alreadyEnrolled) {
        studentCourses.courses.push({
          courseId,
          title: course.title,
          instructorId: course.instructorId,
          instructorName: course.instructorName,
          dateOfPurchase: new Date(),
          courseImage: course.image
        });
        await studentCourses.save();
      }
    } else {
      studentCourses = new StudentCourses({
        userId: req.user._id,
        courses: [{
          courseId,
          title: course.title,
          instructorId: course.instructorId,
          instructorName: course.instructorName,
          dateOfPurchase: new Date(),
          courseImage: course.image
        }]
      });
      await studentCourses.save();
    }

    // Add student to course
    const studentExists = course.students.some(s => s.studentId.toString() === req.user._id.toString());
    if (!studentExists) {
      course.students.push({
        studentId: req.user._id,
        studentName: req.user.userName,
        studentEmail: req.user.userEmail
      });
      await course.save();
    }

    res.json({ success: true, message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const studentCourses = await StudentCourses.findOne({ userId: req.user._id });
    if (!studentCourses) {
      return res.json({ success: true, data: [] });
    }
    res.json({ success: true, data: studentCourses.courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if enrolled
exports.checkEnrollment = async (req, res) => {
  try {
    const studentCourses = await StudentCourses.findOne({ userId: req.user._id });
    const isEnrolled = studentCourses?.courses.some(c => c.courseId.toString() === req.params.id);
    res.json({ success: true, data: { isEnrolled: !!isEnrolled } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



