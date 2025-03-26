// ===================== utils/cloudinary.js =====================
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

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
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1000, crop: 'limit' }], // Resize large images
    // You can add more transformations as needed
  }
});

// Setup multer with Cloudinary storage
// Setup multer with Cloudinary storage with better error handling
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 15000000 }, // 5MB limit
  
  // Add custom error handling
  fileFilter: (req, file, cb) => {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    
    // Check if file extension is allowed
    const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = file.originalname.split('.').pop().toLowerCase();
    
    if (!allowedFormats.includes(extension)) {
      return cb(new Error(`File extension .${extension} is not allowed!`), false);
    }
    
    cb(null, true);
  }
}).array('images', 10); // Limit to 10 images

// Create an error-handling wrapper for the upload middleware
const handleUpload = (req, res, next) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
        error: err.code
      });
    } else if (err) {
      // An unknown error occurred
      console.error('Unknown upload error:', err);
      return res.status(500).json({
        success: false,
        message: `Upload failed: ${err.message}`
      });
    }
    
    // Everything went fine
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