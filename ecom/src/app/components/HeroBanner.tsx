'use client'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { API_URL } from "../lib/api"
import Image from "next/image"

// Extend your interface to include a `type`:
interface BannerMedia {
  _id: string
  url: string
  legend?: string
  type: "image" | "video"
}

export const HeroBanner = () => {
  const [media, setMedia] = useState<BannerMedia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get<{ images: BannerMedia[] }>(`${API_URL}/images`);
        const withType = res.data.images.map((item) => ({
          ...item,
          type: /\.(mp4|webm|ogg|mov|quicktime)$/i.test(item.url) ? "video" : "image",
        }));
        setMedia(withType);
        // Initialize refs array with the correct length
        videoRefs.current = withType.map((_, i) => videoRefs.current[i] || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load banner media");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedia();
  }, []);

  // Handle slide change to pause/play videos appropriately
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    // Pause all videos except the current one
    videoRefs.current.forEach((videoRef, i) => {
      if (videoRef && i !== index) {
        videoRef.pause();
      }
    });
  
    // Play the current video if it exists
    const currentVideo = videoRefs.current[index];
    if (currentVideo && media[index]?.type === "video") {
      // Using a promise with catch to handle autoplay restrictions
      const playPromise = currentVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error);
          // You could show a play button here if needed
        });
      }
    }
  };

  const getMimeType = (url: string) => {
    if (/\.(mov|quicktime)$/i.test(url)) return "video/quicktime";
    if (/\.(webm)$/i.test(url)) return "video/webm";
    if (/\.(ogg)$/i.test(url)) return "video/ogg";
    return "video/mp4"; // Default
  };

  if (isLoading) {
    return (
      <div className="relative w-full max-w-[1360px] mx-auto h-[300px] md:h-[400px] flex items-center justify-center bg-gray-100">
        <span className="text-gray-500">Loading banner…</span>
      </div>
    )
  }

  if (error || media.length === 0) {
    return (
      <div className="relative w-full max-w-[1360px] mx-auto h-[300px] md:h-[400px] flex items-center justify-center bg-gray-100">
        <span className="text-gray-500">{error || "No banner media available"}</span>
      </div>
    )
  }

      
  return (
    <div className="relative w-full max-w-[1360px] mx-auto z-10">
      <Carousel
  autoPlay={media.every(item => item.type === 'image')} // Only autoplay if all slides are images
  interval={media[currentSlide]?.type === 'video' ? 10000 : 3000} // Longer interval for video slides
  infiniteLoop
  showThumbs={false}
  showIndicators
  showStatus={false}
  className="banner-carousel"
  onChange={handleSlideChange}
  onClickItem={(index) => handleSlideChange(index)}
  selectedItem={currentSlide}
  stopOnHover
      >
        {media.map((item, index) => (
          <div key={item._id} className="carousel-slide">
            
            <div className="relative h-[300px] md:h-[500px] overflow-hidden">
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt={item.legend || "Banner image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 1360px"
                  style={{ objectFit: "cover" }}
                  priority={index === 0} // Only prioritize the first image
                />
              ) : (
                <video
                  ref={el => videoRefs.current[index] = el}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  loop
                  onError={(e) => console.error("Video failed to load:", e)}
                >
                  <source
                    src={item.url}
                    type={getMimeType(item.url)}
                  />
                  Your browser does not support HTML5 video.
                </video>
              )}
            </div>
            {item.legend && (
              <div className="legend p-4 bg-black/50 text-white absolute bottom-0 w-full">
                {item.legend}
              </div>
            )}
          </div>
        ))}
      </Carousel>
    </div>
  )
}