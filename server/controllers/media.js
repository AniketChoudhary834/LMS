const multer = require("multer");
const { uploadToCloudinaryBuffer, deleteFromCloudinary } = require("../helpers/cloudinary");

// Multer RAM storage
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 1073741824 // 1GB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/") || file.mimetype.startsWith("image/") ) {
      cb(null, true);
    } else {
      cb(null, false);
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

      // Manual size check
      const maxSize = 1073741824; // 1GB
      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 1GB limit. Please upload a smaller file."
        });
      }

      // Upload buffer to Cloudinary
      const result = await uploadToCloudinaryBuffer(req.file.buffer, {
        public_id: `${Date.now()}_${req.file.originalname.replace(/\s+/g, "_")}`
      });

      res.json({ success: true, data: result });

    } catch (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File size exceeds 1GB limit."
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
