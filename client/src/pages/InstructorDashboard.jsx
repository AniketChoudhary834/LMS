import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getInstructorCoursesAPI } from "../utils/api";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const result = await getInstructorCoursesAPI();
    if (result.success) {
      setCourses(result.data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">My Courses</h2>
          <Link
            to="/instructor/create-course"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Create New Course
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
            <Link
              to="/instructor/create-course"
              className="text-blue-600 hover:text-blue-800"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        course.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {course.students?.length || 0} students
                    </span>
                  </div>
                  <Link
                    to={`/instructor/edit-course/${course._id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                  >
                    Edit Course
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


