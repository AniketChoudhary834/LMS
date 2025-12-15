import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getCourseDetailsAPI, createCourseAPI, updateCourseAPI, uploadMediaAPI } from "../utils/api";

export default function CreateCoursePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "",
    primaryLanguage: "",
    description: "",
    objectives: "",
    welcomeMessage: "",
    image: "",
    curriculum: [{ title: "", videoUrl: "", freePreview: false }],
    isPublished: false
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    const result = await getCourseDetailsAPI(id);
    if (result.success) {
      setFormData({
        ...result.data,
        curriculum: result.data.curriculum || [{ title: "", videoUrl: "", freePreview: false }]
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadMediaAPI(file);
    if (result.success) {
      setFormData({ ...formData, image: result.data.secure_url });
    }
    setUploading(false);
  };

  const handleVideoUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (1GB = 1073741824 bytes)
    const maxSize = 1073741824; // 1GB in bytes
    if (file.size > maxSize) {
      setMessage("Video file size exceeds 1GB limit. Please choose a smaller file.");
      e.target.value = ""; // Reset input
      return;
    }

    // Check if it's a video file
    if (!file.type.startsWith("video/")) {
      setMessage("Please select a valid video file.");
      e.target.value = ""; // Reset input
      return;
    }

    // Use functional state updates to avoid race conditions
    setUploadingVideo((prev) => ({ ...prev, [index]: true }));
    setUploadProgress((prev) => ({ ...prev, [index]: 0 }));

    try {
      const result = await uploadMediaAPI(file, (progress) => {
        // Update progress for this specific video index
        setUploadProgress((prev) => ({ ...prev, [index]: progress }));
      });

      if (result.success) {
        // Use functional state update to ensure we have the latest curriculum state
        setFormData((prevFormData) => {
          const newCurriculum = [...prevFormData.curriculum];
          // Ensure the index still exists (in case curriculum was modified during upload)
          if (newCurriculum[index]) {
            newCurriculum[index] = {
              ...newCurriculum[index],
              videoUrl: result.data.secure_url || result.data.url
            };
          }
          return { ...prevFormData, curriculum: newCurriculum };
        });
        setMessage("");
      } else {
        setMessage(result.message || "Failed to upload video");
      }
    } catch (error) {
      setMessage(error.message || "Failed to upload video");
    } finally {
      // Use functional state updates to safely remove upload state
      setUploadingVideo((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
      setUploadProgress((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
      e.target.value = ""; // Reset input
    }
  };

  const handleCurriculumChange = (index, field, value) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[index][field] = value;
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const addLecture = () => {
    setFormData({
      ...formData,
      curriculum: [...formData.curriculum, { title: "", videoUrl: "", freePreview: false }]
    });
  };

  const removeLecture = (index) => {
    const newCurriculum = formData.curriculum.filter((_, i) => i !== index);
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const handleSubmit = async () => {
    const result = id
      ? await updateCourseAPI(id, formData)
      : await createCourseAPI(formData);

    if (result.success) {
      setMessage("Course saved successfully!");
      setTimeout(() => {
        navigate("/instructor");
      }, 2000);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setStep(1)}
              className={`px-4 py-2 rounded ${step === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Step 1: Basic Info
            </button>
            <button
              onClick={() => setStep(2)}
              className={`px-4 py-2 rounded ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Step 2: Curriculum
            </button>
            <button
              onClick={() => setStep(3)}
              className={`px-4 py-2 rounded ${step === 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Step 3: Publish
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {message}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Course Information</h2>
              <input
                type="text"
                name="title"
                placeholder="Course Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option value="">Select Category</option>
                <option value="web-development">Web Development</option>
                <option value="backend-development">Backend Development</option>
                <option value="data-science">Data Science</option>
                <option value="machine-learning">Machine Learning</option>
              </select>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                name="primaryLanguage"
                value={formData.primaryLanguage}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              >
                <option value="">Select Language</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
              <textarea
                name="description"
                placeholder="Course Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                rows="4"
              />
              <textarea
                name="objectives"
                placeholder="Course Objectives"
                value={formData.objectives}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                rows="4"
              />
              <textarea
                name="welcomeMessage"
                placeholder="Welcome Message"
                value={formData.welcomeMessage}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                rows="3"
              />
              <div>
                <label className="block mb-2">Course Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-3 border rounded"
                  disabled={uploading}
                />
                {formData.image && (
                  <img src={formData.image} alt="Course" className="mt-4 w-64 h-48 object-cover rounded" />
                )}
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                disabled={uploading}
              >
                Next: Add Curriculum
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Course Curriculum</h2>
              {formData.curriculum.map((lecture, index) => (
                <div key={index} className="border p-4 rounded">
                  <input
                    type="text"
                    placeholder="Lecture Title"
                    value={lecture.title}
                    onChange={(e) => handleCurriculumChange(index, "title", e.target.value)}
                    className="w-full mb-3 p-2 border rounded"
                  />
                  <div className="mb-3">
                    {lecture.videoUrl ? (
                      <div className="space-y-2">
                        <video 
                          src={lecture.videoUrl} 
                          controls 
                          className="w-full max-w-md rounded"
                          style={{ maxHeight: "200px" }}
                        />
                        <button
                          onClick={() => {
                            const newCurriculum = [...formData.curriculum];
                            newCurriculum[index] = { ...newCurriculum[index], videoUrl: "" };
                            setFormData({ ...formData, curriculum: newCurriculum });
                          }}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Video
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label className="block mb-2 text-sm font-medium">Upload Video (Max 1GB)</label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(e, index)}
                          className="w-full p-2 border rounded"
                          disabled={uploadingVideo[index]}
                        />
                        {uploadingVideo[index] && (
                          <div className="mt-2 flex items-center gap-2 text-blue-600">
                            <svg
                              className="animate-spin h-5 w-5 text-blue-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span className="text-sm font-medium">Uploading...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={lecture.freePreview}
                      onChange={(e) => handleCurriculumChange(index, "freePreview", e.target.checked)}
                    />
                    Free Preview
                  </label>
                  {formData.curriculum.length > 1 && (
                    <button
                      onClick={() => removeLecture(index)}
                      className="mt-2 text-red-600 hover:text-red-800"
                    >
                      Remove Lecture
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addLecture}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Add Lecture
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                >
                  Next: Publish
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Publish Course</h2>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                Publish this course
              </label>
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
              >
                {id ? "Update Course" : "Create Course"}
              </button>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-500 text-white py-3 rounded hover:bg-gray-600"
              >
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


