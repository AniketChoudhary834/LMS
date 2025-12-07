import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCoursesAPI } from "../utils/api";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    language: "",
    sort: ""
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (filters.category) query.append("category", filters.category);
    if (filters.level) query.append("level", filters.level);
    if (filters.language) query.append("language", filters.language);
    if (filters.sort) query.append("sort", filters.sort);

    const result = await getCoursesAPI(query.toString());
    if (result.success) {
      setCourses(result.data);
    }
    setLoading(false);
  };

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">All Courses</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All</option>
                <option value="web-development">Web Development</option>
                <option value="backend-development">Backend Development</option>
                <option value="data-science">Data Science</option>
                <option value="machine-learning">Machine Learning</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange("level", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Default</option>
                <option value="title-atoz">Title: A to Z</option>
                <option value="title-ztoa">Title: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No courses found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {course.image && (
                  <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">{course.instructorName}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {course.level}
                    </span>
                  </div>
                  <Link
                    to={`/course/${course._id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                  >
                    View Details
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


