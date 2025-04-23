// ===================== utils/cloudinary.js =====================
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

function saveFileFromBuffer(file, destinationDir = './uploads') {
  const filename = Date.now() + '-' + file.originalname;
  const fullPath = path.join(destinationDir, filename);

  fs.writeFileSync(fullPath, file.buffer); // Write buffer to file

  return fullPath; // Return path to save in DB
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jewelry-ecommerce', // Store in a specific folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp','mp4', 'mov', 'avi', 'mkv'],
    transformation: [{ width: 1000, crop: 'limit' }], // Resize large images
    resource_type:"auto"

    // You can add more transformations as needed
  }
});

// Setup multer with Cloudinary storage
// Setup multer with Cloudinary storage with better error handling
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 15MB
}).fields([
  { name: 'images', maxCount: 5 },
  { name: 'variant_0_images', maxCount: 3 },
  { name: 'variant_1_images', maxCount: 3 },
  { name: 'variant_2_images', maxCount: 3 },
  { name: 'variant_3_images', maxCount: 3 },
  { name: 'variant_4_images', maxCount: 3 },
  { name: 'video', maxCount: 1 },
]);
// Create an error-handling wrapper for the upload middleware
const handleUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
    next();
  });
};


// Function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0]; // Remove extension
    return `jewelry-ecommerce/${publicId}`;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

module.exports = {
  upload,
  cloudinary,
  deleteImage,
  getPublicIdFromUrl,
  handleUpload
};