const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { uploadFile, deleteFile } = require("../controllers/media");

// Upload single file
router.post("/upload", authMiddleware, ...uploadFile);

// Delete file
router.delete("/:id", authMiddleware, deleteFile);

module.exports = router;


