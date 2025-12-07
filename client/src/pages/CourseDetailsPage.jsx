import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getCourseDetailsAPI, checkEnrollmentAPI, enrollCourseAPI } from "../utils/api";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollment();
  }, [id]);

  const fetchCourseDetails = async () => {
    const result = await getCourseDetailsAPI(id);
    if (result.success) {
      setCourse(result.data);
    }
    setLoading(false);
  };

  const checkEnrollment = async () => {
    const result = await checkEnrollmentAPI(id);
    if (result.success) {
      setIsEnrolled(result.data.isEnrolled);
    }
  };

  const handleEnroll = async () => {
    const result = await enrollCourseAPI(id);
    if (result.success) {
      setIsEnrolled(true);
      alert("Enrolled successfully!");
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center py-12">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          {course.image && (
            <img src={course.image} alt={course.title} className="w-full h-64 object-cover rounded-lg mb-6" />
          )}
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <div className="flex gap-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">{course.category}</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded">{course.level}</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">{course.primaryLanguage}</span>
          </div>
          <p className="text-gray-600 mb-4">Instructor: {course.instructorName}</p>
          <p className="text-gray-700 mb-6">{course.description}</p>
          {course.objectives && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Objectives</h3>
              <p className="text-gray-700">{course.objectives}</p>
            </div>
          )}
          {isEnrolled ? (
            <Link
              to={`/course-progress/${id}`}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
            >
              Continue Learning
            </Link>
          ) : (
            <button
              onClick={handleEnroll}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Enroll Now (Free)
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
          {course.curriculum && course.curriculum.length > 0 ? (
            <div className="space-y-4">
              {course.curriculum.map((lecture, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{lecture.title}</h3>
                      {lecture.freePreview && (
                        <span className="text-sm text-green-600">Free Preview</span>
                      )}
                    </div>
                    {lecture.freePreview && (
                      <a
                        href={lecture.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Watch Preview
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No lectures added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}


