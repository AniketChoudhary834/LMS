import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { registerAPI, verifyOtpAPI, loginAPI, forgotPasswordAPI, resetPasswordAPI } from "../utils/api";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [otpStep, setOtpStep] = useState(false);
  const [forgotStep, setForgotStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await registerAPI(formData);
    if (result.success) {
      setOtpStep(true);
      setMessage("OTP sent to your email");
    } else {
      setMessage(result.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const result = await verifyOtpAPI(formData.userEmail, otp);
    if (result.success) {
      setOtpStep(false);
      setActiveTab("login");
      setMessage("Registration successful! Please login.");
    } else {
      setMessage(result.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginAPI(formData);
    if (result.success) {
      login(result.data.token, result.data.user);
      navigate(result.data.user.role === "instructor" ? "/instructor" : "/");
    } else {
      setMessage(result.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const result = await forgotPasswordAPI(formData.userEmail);
    if (result.success) {
      setForgotStep(1);
      setMessage("OTP sent to your email");
    } else {
      setMessage(result.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const result = await resetPasswordAPI(formData.userEmail, otp, formData.newPassword);
    if (result.success) {
      setForgotStep(0);
      setActiveTab("login");
      setMessage("Password reset successful!");
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => { setActiveTab("login"); setOtpStep(false); setForgotStep(0); }}
            className={`flex-1 py-2 rounded ${activeTab === "login" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Login
          </button>
          <button
            onClick={() => { setActiveTab("register"); setOtpStep(false); setForgotStep(0); }}
            className={`flex-1 py-2 rounded ${activeTab === "register" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Register
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes("success") || message.includes("sent") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        {activeTab === "register" && !otpStep && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="userName"
              placeholder="Username"
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="email"
              name="userEmail"
              placeholder="Email"
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <select
              name="role"
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            >
              <option value="user">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Register
            </button>
          </form>
        )}

        {otpStep && (
          <form onSubmit={handleVerifyOtp}>
            <p className="mb-4">Enter OTP sent to {formData.userEmail}</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Verify OTP
            </button>
          </form>
        )}

        {activeTab === "login" && forgotStep === 0 && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="userEmail"
              placeholder="Email"
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => setForgotStep(1)}
              className="text-blue-500 mb-4 text-sm"
            >
              Forgot Password?
            </button>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Login
            </button>
          </form>
        )}

        {forgotStep === 1 && (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              name="userEmail"
              placeholder="Email"
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-2 hover:bg-blue-600">
              Send OTP
            </button>
            <button
              type="button"
              onClick={() => setForgotStep(2)}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              I have OTP
            </button>
          </form>
        )}

        {forgotStep === 2 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="email"
              name="userEmail"
              placeholder="Email"
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


