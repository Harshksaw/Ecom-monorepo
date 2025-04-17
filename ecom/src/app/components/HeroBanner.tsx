'use client'
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { BiArrowFromRight, BiArrowFromLeft } from "react-icons/bi";
import { Carousel } from "react-responsive-carousel";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {API_URL} from "../lib/api";
import Image from "next/image";

// Define interface for image
interface BannerImage {
  _id: string;
  url: string;
  legend?: string;
}

export const HeroBanner = () => {
  // State to store fetched images
  const [images, setImages] = useState<BannerImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch images on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const data = await axios.get(`${API_URL}/images`);
        console.log("🚀 ~ fetchImages ~ data:", data.data.images)
        setImages(data.data.images);
      } catch (err) {
        console.error('Error fetching banner images:', err);
        setError('Failed to load banner images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Render loading or error state
  if (isLoading) {
    return (
      <div className="relative w-full max-w-[1360px] mx-auto h-[300px] md:h-[400px] flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading banner...</div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="relative w-full max-w-[1360px] mx-auto h-[300px] md:h-[400px] flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">{error || 'No banner images available'}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1360px] mx-auto">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showIndicators={true}
        showStatus={false}
        className="banner-carousel"
      >
        {images.map((image) => (
          <div key={image._id} className="carousel-slide">
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
            <Image
                src={image.url}
                alt={image.legend || "Banner image"}
                fill // Replaces layout="fill"
                style={{ objectFit: "cover" }} // Replaces objectFit="cover"
                priority // Optional: Ensures the image is loaded eagerly
              />
              {image.legend && (
                <div
                  className="px-[15px] md:px-[40px] py-[10px] md:py-[25px] font-oswald 
                  bg-white/80 absolute bottom-[25px] md:bottom-[50px] left-0 text-black/[0.9] text-[15px]
                  md:text-[24px] uppercase font-medium cursor-pointer hover:opacity-90"
                >
                  {image.legend}
                </div>
              )}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};