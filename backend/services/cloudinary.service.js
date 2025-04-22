const { secret } = require("../config/secret");
const cloudinary = require("../utils/cloudinary");
const { Readable } = require('stream');

// cloudinary Image Upload
// const cloudinaryImageUpload = async (image) => {
//   console.log('image service',image)
//   const uploadRes = await cloudinary.uploader.upload(image, {
//     upload_preset: secret.cloudinary_upload_preset,
//   });
//   return uploadRes;
// };

const cloudinaryImageUpload = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { upload_preset: secret.cloudinary_upload_preset },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          reject(error);
        } else {i
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  });
};


// cloudinaryImageDelete and can use the same to delete video
const cloudinaryImageDelete = async (public_id) => {
  const deletionResult = await cloudinary.uploader.destroy(public_id);
  return deletionResult;
};

const cloudinaryVideoUpload = (videoBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        upload_preset: secret.cloudinary_upload_preset,
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading video to Cloudinary:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(videoBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  });
};


exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
  cloudinaryVideoUpload
};
