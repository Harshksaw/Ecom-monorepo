"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/app/lib/api";
import Image from "next/image";

interface ImageType {
  _id: string;
  url: string;
  publicId: string;
  type: string;
  legend?: string;
}

export default function AdminDashboardPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch all images when component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // Function to fetch images from the API
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/images`);
      if (response.data.success) {
        setImages(response.data.images);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
      toast.error("Failed to load images. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const formData = new FormData();
    // Append each file to a form field named "images"
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    setIsUploading(true);

    try {
      const response = await axios.post(
        `${API_URL}/upload-carousel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(
        response.data.message || "Images uploaded successfully!"
      );
      // Refresh the images list after successful upload
      fetchImages();
      // Clear the file input
      setFiles(null);
      // Reset the file input element
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error("Upload failed", error);
      toast.error(
        error.response?.data?.message || "An error occurred during upload"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setIsDeleting(id);
    try {
      const response = await axios.delete(`${API_URL}/images/${id}`);
      if (response.data.success) {
        toast.success("Image deleted successfully");
        // Remove the deleted image from the state
        setImages(images.filter(img => img._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Carousel/Hero Images Upload Section */}
      <div className="p-4 border rounded shadow bg-white mb-6">
        <h2 className="mb-4 text-xl font-bold">
          Upload Carousel Hero Images
        </h2>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      {/* Image Management Section */}
      <div className="p-4 border rounded shadow bg-white">
        <h2 className="mb-4 text-xl font-bold">Manage Carousel Images</h2>
        
        {isLoading ? (
          <div className="text-center py-8">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No images found. Upload some images above.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image._id} className="border rounded overflow-hidden relative group">
                <div className="relative h-48">
                  {image.type.includes('video') ? (
                    <video 
                      src={image.url} 
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={image.url}
                      alt={image.legend || "Carousel image"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-2 bg-gray-50 flex justify-between items-center">
                  <div className="truncate text-sm flex-1">
                    {image.legend || "No caption"}
                  </div>
                  <button
                    onClick={() => handleDelete(image._id)}
                    disabled={isDeleting === image._id}
                    className="py-1 px-3 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting === image._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}