const { cloudinary } = require("../utils/cloudinary");
const Image = require("../model/Image"); // Updated path to match your actual file location

// Upload multiple images to Cloudinary and save URLs to DB
const uploadCarouselImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No files uploaded" 
      });
    }

    // Process uploaded files (they're already uploaded to Cloudinary by multer-storage-cloudinary)
    const savedImages = [];
    
    for (const file of req.files) {
      try {
        // Extract the publicId from the Cloudinary URL
        // Format: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567/folder/filename
        const urlParts = file.path.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        
        // Create new image document
        const newImage = new Image({
          url: file.path,
          publicId: `jewelry-ecommerce/${publicId}`, // Include folder in publicId
        });
        
        // Save to database
        await newImage.save();
        savedImages.push(newImage);
      } catch (err) {
        console.error("Error saving image to database:", err);
      }
    }

    res.status(200).json({
      success: true,
      message: `${savedImages.length} carousel images uploaded and stored successfully`,
      data: savedImages,
    });
  } catch (error) {
    console.error("Error in uploadCarouselImages:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to upload and save images", 
      error: error.message 
    });
  }
};

// Get all images from database
const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: images.length,
    images,
    });
  } catch (error) {
    console.error("Error in getAllImages:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch images",
      error: error.message 
    });
  }
};

// Get image by ID
const getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ 
        success: false, 
        message: "Image not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Error in getImageById:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch image",
      error: error.message
    });
  }
};

// Delete image by ID
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ 
        success: false, 
        message: "Image not found" 
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    
    // Delete from database
    await Image.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete image",
      error: error.message
    });
  }
};

module.exports = { 
  uploadCarouselImages, 
  getAllImages, 
  getImageById,
  deleteImage
};