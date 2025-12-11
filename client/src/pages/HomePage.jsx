import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Background Image */}
      <section
        className="bg-cover bg-center text-white py-24"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        <div className="bg-black bg-opacity-50 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn Without Limits
            </h1>

            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
              Access high-quality courses, improve your skills, and prepare for real-world careers.
            </p>

            <Link
              to="/courses"
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-gray-100"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Boxes */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What You Can Do
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Explore Courses</h3>
            <p className="text-gray-600 mb-5">
              Browse a variety of courses and start learning what interests you.
            </p>
            <Link to="/courses" className="text-blue-600 font-semibold hover:underline">
              View Courses →
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">My Learning</h3>
            <p className="text-gray-600 mb-5">
              Track your enrolled courses and continue where you left off.
            </p>
            <Link to="/my-courses" className="text-blue-600 font-semibold hover:underline">
              My Courses →
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Take Quiz</h3>
            <p className="text-gray-600 mb-5">
              Test your knowledge by taking quizzes generated just for you.
            </p>
            <Link to="/quiz" className="text-blue-600 font-semibold hover:underline">
              Start Quiz →
            </Link>
          </div>
        </div>
      </div>



      {/* Top Categories */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Popular Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {["Web Development", "Python", "Data Science", "Machine Learning"].map(
            (cat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
              >
                <h3 className="text-xl font-semibold mb-2">{cat}</h3>
                <p className="text-gray-600">Explore {cat} courses</p>
              </div>
            )
          )}
        </div>
      </div>


      {/* Testimonials */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-700 italic mb-4">
                "The best learning platform! The courses helped me get a job as a developer."
              </p>
              <h4 className="font-semibold text-gray-900">— Rohan</h4>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-700 italic mb-4">
                "Simple UI, great content, and very easy to understand. Highly recommended!"
              </p>
              <h4 className="font-semibold text-gray-900">— Priya</h4>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-700 italic mb-4">
                "The AI quizzes are amazing! They help me test my skills instantly."
              </p>
              <h4 className="font-semibold text-gray-900">— Aman</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-300">© 2025 Learning Portal. All rights reserved.</p>
          <p className="text-gray-400 mt-2">
            Built for learning, growth, and real-world skills.
          </p>
        </div>
      </footer>
    </div>
  );
}


