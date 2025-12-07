import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RouteGuard = ({ children, requireAuth = true, requireRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" />;
  }

  if (requireRole && user?.role !== requireRole) {
    if (requireRole === "instructor") {
      return <Navigate to="/" />;
    } else {
      return <Navigate to="/instructor" />;
    }
  }

  if (user && user.role === "instructor" && window.location.pathname.startsWith("/auth")) {
    return <Navigate to="/instructor" />;
  }

  return children;
};


