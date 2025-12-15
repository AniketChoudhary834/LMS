import { createContext, useState, useEffect, useContext } from "react";
import { checkAuthAPI } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const result = await checkAuthAPI();
      if (result.success) {
        setUser(result.data.user);
      } else {
        localStorage.removeItem("token");
      }
      setLoading(false);
      
    } catch (error) {
      
      localStorage.removeItem("token");
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


