"use client";
import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/app/lib/api";

export default function AdminDashboardPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const formData = new FormData();
    // Append each file to a form field named "files"
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
    } catch (error: any) {
      console.error("Upload failed", error);

      toast.error(
        error.response?.data?.message || "An error occurred during upload"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* You can add other dashboard elements like stats grid here */}

      {/* Carousel/Hero Images Upload Section */}
      <div className="p-4 border rounded shadow bg-white">
        <h2 className="mb-4 text-xl font-bold">
          Upload Carousel Hero Images
        </h2>
        <input
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
    </div>
  );
}