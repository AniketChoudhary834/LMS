const multer = require("multer");
const { uploadToCloudinary, deleteFromCloudinary } = require("../helpers/cloudinary");
const fs = require("fs");

// Configure multer with file size limit (1GB = 1073741824 bytes)
const upload = multer({ 
  dest: "uploads/",
  limits: {
    fileSize: 1073741824 // 1GB in bytes
  },
  fileFilter: (req, file, cb) => {
    // Check if file is a video
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(null, true); // Allow other file types too (for images)
    }
  }
});

// Upload single file
exports.uploadFile = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (req.user.role !== "instructor") {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      // Additional size check (in case multer limit doesn't catch it)
      const maxSize = 1073741824; // 1GB
      if (req.file.size > maxSize) {
        // Clean up uploaded file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ 
          success: false, 
          message: "File size exceeds 1GB limit. Please upload a smaller file." 
        });
      }

      const result = await uploadToCloudinary(req.file.path);
      
      // Clean up temporary file after upload
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.json({ success: true, data: result });
    } catch (error) {
      // Clean up temporary file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ 
          success: false, 
          message: "File size exceeds 1GB limit. Please upload a smaller file." 
        });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }
];

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    await deleteFromCloudinary(req.params.id);
    res.json({ success: true, message: "File deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


