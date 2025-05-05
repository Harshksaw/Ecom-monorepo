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
  const [media, setMedia] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideInterval = useRef<NodeJS.Timeout | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get<{ images: BannerMedia[] }>(`${API_URL}/images`)
        const withType = res.data.images.map((item) => ({
          ...item,
          type: /\.(mp4|webm|ogg|mov|quicktime)$/i.test(item.url) ? "video" : "image",
        }))
        setMedia(withType)
        videoRefs.current = withType.map(() => null) // Initialize refs
      } catch (err) {
        console.error(err)
        setError("Failed to load banner media")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMedia()
    
    // Add a one-time event listener to detect user interaction
    const handleInteraction = () => {
      setUserInteracted(true)
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [])

  useEffect(() => {
    // Start the interval for auto-changing slides
    if (media.length > 0) {
      startSlideInterval()
    }

    return () => {
      // Clear the interval when the component unmounts
      if (slideInterval.current) {
        clearInterval(slideInterval.current)
      }
    }
  }, [media, currentSlide])

  const startSlideInterval = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current)
    }

    slideInterval.current = setInterval(() => {
      const currentMedia = media[currentSlide]
      if (currentMedia?.type === "image") {
        // Move to the next slide after 5 seconds for images
        setCurrentSlide((prev) => (prev + 1) % media.length)
      }
    }, 5000) // 5 seconds interval
  }

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)

    // Pause all videos
    videoRefs.current.forEach((videoRef) => {
      if (videoRef) {
        videoRef.pause()
      }
    })

    // Play the current video if it exists
    const currentVideo = videoRefs.current[index]
    if (currentVideo && media[index]?.type === "video") {
      // Always mute videos to comply with autoplay policies
      currentVideo.muted = true 
      
      // Only try to unmute if user has interacted with the page
      if (userInteracted) {
        try {
          currentVideo.muted = false;
        } catch (e) {
          console.log("Could not unmute video:", e);
        }
      }
      
      // Attempt to play the video
      const playPromise = currentVideo.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing successfully");
            // If video is playing and user interacted, we can try to unmute
            if (userInteracted && currentVideo.muted) {
              try {
                currentVideo.muted = false;
              } catch (e) {
                console.log("Could not unmute after successful play:", e);
              }
            }
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error)
            // If autoplay fails with unmuted, try with muted
            currentVideo.muted = true
            currentVideo.play().catch(e => {
              console.error("Even muted play failed:", e)
            })
          })
      }
    }
  }

  // Add a function to handle user-initiated play
  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.muted = false;
        video.play().catch(e => {
          console.log("Play on click failed:", e);
          // If unmuted play fails, try muted
          video.muted = true;
          video.play();
        });
      } else {
        video.pause();
      }
    }
    setUserInteracted(true);
  }

  const handleVideoEnd = (index: number) => {
    // Move to the next slide when the video ends
    const nextSlide = (index + 1) % media.length
    setCurrentSlide(nextSlide)
  }

  const getMimeType = (url: string) => {
    if (/\.(mov|quicktime)$/i.test(url)) return "video/quicktime"
    if (/\.(webm)$/i.test(url)) return "video/webm"
    if (/\.(ogg)$/i.test(url)) return "video/ogg"
    return "video/mp4" // Default
  }

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
        autoPlay={false} // Disable default autoplay
        infiniteLoop
        showThumbs={false}
        showIndicators
        showStatus={false}
        className="banner-carousel"
        onChange={handleSlideChange}
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
                <div onClick={() => handleVideoClick(index)} className="video-container w-full h-full cursor-pointer">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el
                    }}
                    className="w-full h-full object-cover"
                    playsInline
                    autoPlay={index === currentSlide} // Only autoplay the current slide
                    muted={false} // Start muted to work with autoplay policies
                    loop={false} // Do not loop videos
                    onEnded={() => handleVideoEnd(index)} // Trigger when video ends
                    onError={(e) => console.error("Video failed to load:", e)}
                  >
                    <source src={item.url} type={getMimeType(item.url)} />
                    Your browser does not support HTML5 video.
                  </video>
                  {/* Optional play indicator overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="p-4 bg-black/50 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
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