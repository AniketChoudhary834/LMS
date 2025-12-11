import { Routes, Route, Navigate } from "react-router-dom";
import { RouteGuard } from "./components/RouteGuard";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CourseProgressPage from "./pages/CourseProgressPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import QuizPage from "./pages/QuizPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import CreateCoursePage from "./pages/CreateCoursePage";
import { useAuth } from "./context/AuthContext";

function App() {
  const {user} = useAuth();
  return (
    <Routes>
      <Route path="/auth" element={user? <Navigate to='/' /> : <AuthPage />} />
      
      {/* <Route
        path="/"
        element={
          <RouteGuard >
            <HomePage />
          </RouteGuard>
        }
      /> */}
      <Route
        path="/"
        element={ <HomePage /> }
      />
      
      <Route
        path="/courses"
        element={
          <RouteGuard >
            <CoursesPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/course/:id"
        element={
          <RouteGuard >
            <CourseDetailsPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/course-progress/:id"
        element={
          <RouteGuard >
            <CourseProgressPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/my-courses"
        element={
          <RouteGuard >
            <MyCoursesPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/quiz"
        element={
          <RouteGuard >
            <QuizPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/instructor"
        element={
          <RouteGuard  requireRole="instructor">
            <InstructorDashboard />
          </RouteGuard>
        }
      />
      
      <Route
        path="/instructor/create-course"
        element={
          <RouteGuard  requireRole="instructor">
            <CreateCoursePage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/instructor/edit-course/:id"
        element={
          <RouteGuard  requireRole="instructor">
            <CreateCoursePage />
          </RouteGuard>
        }
      />
    </Routes>
  );
}

export default App;


