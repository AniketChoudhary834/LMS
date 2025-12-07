const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      chunk_size: 6000000, // 6MB chunks for large video files
      eager: [], // No eager transformations
      eager_async: false
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error uploading to Cloudinary: " + error.message);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error("Error deleting from Cloudinary");
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };


