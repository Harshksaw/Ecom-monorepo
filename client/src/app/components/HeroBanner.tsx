'use client'
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { BiArrowFromRight, BiArrowFromLeft } from "react-icons/bi";
import { Carousel } from "react-responsive-carousel";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {API_URL} from "../lib/api";
// Define interface for image
interface BannerImage {
  id: string;
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

  const arrowStyles = {
    "position": "absolute",
    "zIndex": 2,
    "top": "calc(50% - 15px)",
    "width": 30,
    "height": 30,
    "cursor": "pointer",
    "borderRadius": "50%",
    "backgroundColor": "rgba(0,0,0,0.5)",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "color": "yellow"
  };

  // Render loading or error state
  if (isLoading) {
    return (
      <div className="relative text-white text-[20px] w-full max-w-[1360px] mx-auto h-[50vh] flex items-center justify-center">
        Loading banner...
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="relative text-white text-[20px] w-full max-w-[1360px] mx-auto h-[50vh] flex items-center justify-center">
        {error || 'No banner images available'}
      </div>
    );
  }

  return (
    <div className="relative text-white text-[20px] w-full max-w-[1360px] mx-auto">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showIndicators={false}
        showStatus={false}
        // renderArrowPrev={(clickHandler, hasPrev, label) => {
        //   if (!hasPrev) {
        //     return null;
        //   }
        //   return (
        //     <button
        //       type="button"
        //       onClick={clickHandler}
        //       title={label}
        //       style={{ ...arrowStyles, left: 15 }}
        //     >
        //       <BiArrowFromRight size={30} />
        //     </button>
        //   )
        // }}
        // renderArrowNext={(clickHandler, hasNext, label) => {
        //   if (!hasNext) {
        //     return null;
        //   }
        //   return (
        //     <button
        //       type="button"
        //       onClick={clickHandler}
        //       title={label}
        //       style={{ ...arrowStyles, right: 15 }}
        //     >
        //       <BiArrowFromLeft size={30} />
        //     </button>
        //   )
        // }}
      >
        {images.map((image) => (
          <div key={image._id}>
            <img
              src={image.url}
              alt={image.legend || `Banner slide ${image.id}`}
              className="aspect-[16/10] md:aspect-auto object-cover"
            />
            {image.legend && (
              <div
                className="px-[15px] md:px-[40px] py-[10px] md:py-[25px] font-oswald 
                bg-gray-100 absolute bottom-[25px] md:bottom-[75px] left-0 text-black/[0.9] text-[15px]
                md:text-[30px] uppercase font-medium cursor-pointer hover:opacity-90"
              >
                {image.legend}
              </div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
};