import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ReactPlayer from "react-player";
import { getProgressAPI, markLectureViewedAPI } from "../utils/api";

export default function CourseProgressPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [id]);

  const fetchProgress = async () => {
    const result = await getProgressAPI(user._id, id);
    if (result.success && result.data.isEnrolled) {
      setCourse(result.data.courseDetails);
      setProgress(result.data.progress || []);
    }
    setLoading(false);
  };

  const handleVideoEnd = async () => {
    if (!course || !course.curriculum[currentLecture]) return;
    
    const lectureId = course.curriculum[currentLecture]._id || currentLecture.toString();
    const result = await markLectureViewedAPI(user._id, id, lectureId);
    if (result.success) {
      fetchProgress();
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p>Course not found or not enrolled</p>
        <Link to="/courses" className="text-blue-600">Browse Courses</Link>
      </div>
    );
  }

  const lectures = course.curriculum || [];
  const currentLectureData = lectures[currentLecture];

  const isLectureViewed = (lectureIndex) => {
    const lectureId = lectures[lectureIndex]._id || lectureIndex.toString();
    return progress.some(p => p.lectureId === lectureId && p.viewed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        <h1 className="text-3xl font-bold mb-8">{course.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {currentLectureData?.title || "No lecture selected"}
              </h2>
              {currentLectureData?.videoUrl ? (
                <div className="aspect-video">
                  <ReactPlayer
                    url={currentLectureData.videoUrl}
                    width="100%"
                    height="100%"
                    controls
                    onEnded={handleVideoEnd}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No video available</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Course Content</h3>
              <div className="space-y-2">
                {lectures.map((lecture, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentLecture(index)}
                    className={`w-full text-left p-3 rounded ${
                      currentLecture === index
                        ? "bg-blue-100 border-2 border-blue-500"
                        : isLectureViewed(index)
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{lecture.title}</span>
                      {isLectureViewed(index) && (
                        <span className="text-green-600 text-xs">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


