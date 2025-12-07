import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Learning Portal
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Learn new skills and advance your career
          </p>
          <Link
            to="/courses"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 inline-block"
          >
            Browse Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Explore Courses</h3>
            <p className="text-gray-600 mb-4">
              Browse through our wide range of courses and find what interests you.
            </p>
            <Link to="/courses" className="text-blue-600 hover:text-blue-800">
              View Courses →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">My Learning</h3>
            <p className="text-gray-600 mb-4">
              Continue your learning journey with enrolled courses.
            </p>
            <Link to="/my-courses" className="text-blue-600 hover:text-blue-800">
              My Courses →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Take Quiz</h3>
            <p className="text-gray-600 mb-4">
              Test your knowledge with AI-generated quizzes on any topic.
            </p>
            <Link to="/quiz" className="text-blue-600 hover:text-blue-800">
              Start Quiz →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


