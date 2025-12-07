import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getEnrolledCoursesAPI } from "../utils/api";

export default function MyCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    const result = await getEnrolledCoursesAPI();
    if (result.success) {
      setCourses(result.data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="text-blue-600 hover:text-blue-800">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.courseId} className="bg-white rounded-lg shadow-md overflow-hidden">
                {course.courseImage && (
                  <img
                    src={course.courseImage}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">Instructor: {course.instructorName}</p>
                  <Link
                    to={`/course-progress/${course.courseId}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


