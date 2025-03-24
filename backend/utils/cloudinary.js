// ===================== utils/cloudinary.js =====================
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jewelry-ecommerce', // Store in a specific folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, crop: 'limit' }], // Resize large images
    // You can add more transformations as needed
  }
});

// Setup multer with Cloudinary storage
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 } // 5MB limit
});

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
  getPublicIdFromUrl
};