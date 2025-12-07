const API_URL = "http://localhost:5000/api";

// Simple fetch wrapper
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
    const data = await response.json();
    return data;
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
export const uploadMediaAPI = async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const token = localStorage.getItem("token");
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress(percentComplete);
      }
    });
    
    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject({ success: false, message: "Failed to parse response" });
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        } catch {
          reject({ success: false, message: `Upload failed with status ${xhr.status}` });
        }
      }
    });
    
    // Handle errors
    xhr.addEventListener("error", () => {
      reject({ success: false, message: "Network error during upload" });
    });
    
    xhr.addEventListener("abort", () => {
      reject({ success: false, message: "Upload aborted" });
    });
    
    xhr.open("POST", `${API_URL}/media/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  });
};


