const API_URL = "http://localhost:5000/api";

// fetch wrapper
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    let data = null;

    try {
      data = await response.json();
    } catch {
      // Non-JSON response
      data = null;
    }

    if (!response.ok) {
      const message = data?.message || `Request failed with status ${response.status}`;
      return {
        success: false,
        status: response.status,
        message,
        data: data ?? undefined
      };
    }

    // For successful responses, return parsed data (or a default success flag)
    return data ?? { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Auth APIs
export const registerAPI = (formData) => apiCall("/auth/register", {
  method: "POST",
  body: JSON.stringify(formData)
});

export const verifyOtpAPI = (userEmail, otp) => apiCall("/auth/verify-otp", {
  method: "POST",
  body: JSON.stringify({ userEmail, otp })
});

export const loginAPI = (formData) => apiCall("/auth/login", {
  method: "POST",
  body: JSON.stringify(formData)
});

export const checkAuthAPI = () => apiCall("/auth/check-auth");

export const forgotPasswordAPI = (userEmail) => apiCall("/auth/forgot-password", {
  method: "POST",
  body: JSON.stringify({ userEmail })
});

export const resetPasswordAPI = (userEmail, otp, newPassword) => apiCall("/auth/reset-password", {
  method: "POST",
  body: JSON.stringify({ userEmail, otp, newPassword })
});

// Course APIs
export const getCoursesAPI = (query = "") => apiCall(`/courses?${query}`);
export const getCourseDetailsAPI = (id) => apiCall(`/courses/${id}`);
export const getInstructorCoursesAPI = () => apiCall("/courses/instructor/all");
export const createCourseAPI = (formData) => apiCall("/courses", {
  method: "POST",
  body: JSON.stringify(formData)
});
export const updateCourseAPI = (id, formData) => apiCall(`/courses/${id}`, {
  method: "PUT",
  body: JSON.stringify(formData)
});
export const enrollCourseAPI = (id) => apiCall(`/courses/${id}/enroll`, {
  method: "POST"
});
export const getEnrolledCoursesAPI = () => apiCall("/courses/student/enrolled");
export const checkEnrollmentAPI = (id) => apiCall(`/courses/${id}/check-enrollment`);

// Progress APIs
export const getProgressAPI = (userId, courseId) => apiCall(`/progress/${userId}/${courseId}`);
export const markLectureViewedAPI = (userId, courseId, lectureId) => apiCall("/progress/mark-viewed", {
  method: "POST",
  body: JSON.stringify({ userId, courseId, lectureId })
});
export const resetProgressAPI = (userId, courseId) => apiCall("/progress/reset", {
  method: "POST",
  body: JSON.stringify({ userId, courseId })
});

// Quiz APIs
export const generateQuizAPI = (topic) => apiCall("/quiz", {
  method: "POST",
  body: JSON.stringify({ prompt: topic })
});
export const saveQuizResultAPI = (data) => apiCall("/quiz/result", {
  method: "POST",
  body: JSON.stringify(data)
});
export const getQuizResultsAPI = () => apiCall("/quiz/results");

// Media APIs
export const uploadMediaAPI = async (file) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/media/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw error;
    } catch {
      throw { success: false, message: `Upload failed with status ${response.status}` };
    }
  }

  try {
    return await response.json();
  } catch {
    throw { success: false, message: "Failed to parse response" };
  }
};


