const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload BUFFER instead of file path
const uploadToCloudinaryBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        chunk_size: 6000000, // 6MB per chunk
        eager: [],
        eager_async: false,
        ...options
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error("Error uploading to Cloudinary: " + error.message));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    throw new Error("Error deleting from Cloudinary");
  }
};

module.exports = { uploadToCloudinaryBuffer, deleteFromCloudinary };
