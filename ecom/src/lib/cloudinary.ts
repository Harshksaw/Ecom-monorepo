import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary from a buffer
 */
export async function uploadImageFromBuffer(buffer: Buffer, folderName = 'ecom') {
  return new Promise<{url: string, publicId: string}>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: 'auto',
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return reject(error);
        }
        
        if (!result) {
          return reject(new Error('No result from Cloudinary upload'));
        }
        
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // Convert buffer to stream and pipe to uploadStream
    const Readable = require('stream').Readable;
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

/**
 * Upload an image to Cloudinary from a file path
 */
export async function uploadImage(filePath: string, folderName = 'ecom') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: 'auto',
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

/**
 * Upload a video to Cloudinary
 */
export async function uploadVideo(filePath: string, folderName = 'ecom-videos') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: 'video',
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw error;
  }
}

/**
 * Extract public ID from Cloudinary URL
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split('/');
    const filenamePart = parts[parts.length - 1];
    const filename = filenamePart.split('.')[0]; // Remove extension
    const folderName = parts[parts.length - 2];
    
    return `${folderName}/${filename}`;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
}

export default cloudinary;