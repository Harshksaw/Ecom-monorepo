const fs = require("fs");
const { cloudinaryServices } = require("../services/cloudinary.service");
const Video = require('../model/Video');
// add image
const saveImageCloudinary = async (req, res, next) => {
  // console.log(req.file)
  try {
    const result = await cloudinaryServices.cloudinaryImageUpload(
      req.file.buffer
    );
    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data: { url: result.secure_url, id: result.public_id },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// add image
const addMultipleImageCloudinary = async (req, res) => {
  try {
    const files = req.files;

    // Array to store Cloudinary image upload responses
    const uploadResults = [];

    for (const file of files) {
      // Upload image to Cloudinary
      const result = await cloudinaryServices.cloudinaryImageUpload(file.path);

      // Store the Cloudinary response in the array
      uploadResults.push(result);
    }

    // Delete temporary local files
    for (const file of files) {
      fs.unlinkSync(file.path);
    }

    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data:
        uploadResults.length > 0
          ? uploadResults.map((res) => ({
              url: res.secure_url,
              id: res.public_id,
            }))
          : [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Failed to upload image",
    });
  }
};

// cloudinary ImageDelete
const cloudinaryDeleteController = async (req, res) => {
  try {
    const { folder_name, id } = req.query;
    const public_id = `${folder_name}/${id}`;
    const result = await cloudinaryServices.cloudinaryImageDelete(public_id);
    res.status(200).json({
      success: true,
      message: "delete image successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Failed to delete image",
    });
  }
};

const saveVideoCloudinary = async (req, res, next) => {
  try {
    
    const result = await cloudinaryServices.cloudinaryVideoUpload(
      req.file.buffer
    );


    const newVideo = await Video.create({
      url: result.secure_url,
      publicId: result.public_id,
    });

    res.status(200).json({
      success: true,
      message: "Video uploaded and saved successfully",
      data: {
        _id: newVideo._id,
        url: newVideo.url,
        publicId: newVideo.publicId,
        createdAt: newVideo.createdAt,
      },
    });
  } catch (err) {
    console.error("Video upload error:", err);
    next(err);
  }
};


exports.cloudinaryController = {
  cloudinaryDeleteController,
  saveImageCloudinary,
  addMultipleImageCloudinary,
  saveVideoCloudinary
};
