import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      
      <Route
        path="/"
        element={
          <RouteGuard requireAuth={true}>
            <HomePage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/courses"
        element={
          <RouteGuard requireAuth={true}>
            <CoursesPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/course/:id"
        element={
          <RouteGuard requireAuth={true}>
            <CourseDetailsPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/course-progress/:id"
        element={
          <RouteGuard requireAuth={true}>
            <CourseProgressPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/my-courses"
        element={
          <RouteGuard requireAuth={true}>
            <MyCoursesPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/quiz"
        element={
          <RouteGuard requireAuth={true}>
            <QuizPage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/instructor"
        element={
          <RouteGuard requireAuth={true} requireRole="instructor">
            <InstructorDashboard />
          </RouteGuard>
        }
      />
      
      <Route
        path="/instructor/create-course"
        element={
          <RouteGuard requireAuth={true} requireRole="instructor">
            <CreateCoursePage />
          </RouteGuard>
        }
      />
      
      <Route
        path="/instructor/edit-course/:id"
        element={
          <RouteGuard requireAuth={true} requireRole="instructor">
            <CreateCoursePage />
          </RouteGuard>
        }
      />
    </Routes>
  );
}

export default App;


