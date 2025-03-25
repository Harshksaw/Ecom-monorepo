const { secret } = require("../config/secret");
const cloudinary = require("../utils/cloudinary");
const { Readable } = require("stream");

const Image = require("../models/Image");

// Upload multiple images to Cloudinary and save URLs to DB
export const uploadCarouselImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload images to Cloudinary
    const uploadResults = await Promise.all(
      req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "carousel_images" },
            async (error, result) => {
              if (error) {
                reject(error);
              } else {
                // Save image data to MongoDB
                const newImage = new Image({
                  url: result.secure_url,
                  publicId: result.public_id,
                });
                await newImage.save();
                resolve(newImage);
              }
            }
          );
          uploadStream.end(file.buffer);
        });
      })
    );

    res.status(200).json({
      success: true,
      message: "Carousel images uploaded and stored successfully",
      data: uploadResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload and save images" });
  }
};
const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 }); // Get all images sorted by latest
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch images" });
  }
};

// Get image by ID
const getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch image" });
  }
};

module.exports = { uploadCarouselImages, getAllImages, getImageById };
