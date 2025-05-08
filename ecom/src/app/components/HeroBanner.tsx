'use client'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { API_URL } from "../lib/api"
import Image from "next/image"

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
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideInterval = useRef<NodeJS.Timeout | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  const [playOverlays, setPlayOverlays] = useState<boolean[]>([])

  // Fetch media on component mount
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get<{ images: BannerMedia[] }>(`${API_URL}/images`)
        const withType = res.data.images.map((item) => ({
          ...item,
          type: /\.(mp4|webm|ogg|mov|quicktime)$/i.test(item.url) ? "video" : "image",
        }))
        //@ts-ignore
        setMedia(withType)
        videoRefs.current = withType.map(() => null)
        setPlayOverlays(withType.map(() => true)) // Initialize all overlays as visible
      } catch (err) {
        console.error("Banner fetch error:", err)
        setError("Failed to load banner media")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMedia()
    
    // Track user interaction for autoplay policy
    const handleInteraction = () => {
      setUserInteracted(true)
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
    
    document.addEventListener('click', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)
    
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [])

  // Handle slide interval
  useEffect(() => {
    if (media.length > 0) {
      startSlideInterval()
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current)
      }
    }
  }, [media, currentSlide])

  // Initialize or handle video on current slide
  useEffect(() => {
    if (media.length > 0 && media[currentSlide]?.type === "video") {
      const video = videoRefs.current[currentSlide]
      if (video) {
        // Pause all other videos first
        videoRefs.current.forEach((v, i) => {
          if (i !== currentSlide && v) {
            v.pause()
          }
        })
        // Always start muted to comply with autoplay policies
        video.muted = true
        video.currentTime = 0 // Start from beginning
        
        // Try to play the video
        video.play().catch(err => {
          console.warn("Video autoplay failed:", err)
        })
      }
    }
  }, [currentSlide, media])

  const startSlideInterval = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current)
    }

    slideInterval.current = setInterval(() => {
      const currentMedia = media[currentSlide]
      if (currentMedia?.type === "image") {
        setCurrentSlide((prev) => (prev + 1) % media.length)
      }
    }, 5000)
  }

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
  }

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return
    
    setUserInteracted(true)
    
    if (video.paused) {
      // Try to play unmuted if user has interacted
      try {
        video.muted = false
        video.play().catch(err => {
          console.warn("Unmuted play failed, trying muted:", err)
          video.muted = true
          video.play().catch(e => console.error("Even muted play failed:", e))
        })
      } catch (e) {
        console.error("Video play error:", e)
      }
      
      // Hide play overlay when video starts playing
      const newOverlays = [...playOverlays]
      newOverlays[index] = false
      setPlayOverlays(newOverlays)
    } else {
      video.pause()
      
      // Show play overlay when video is paused
      const newOverlays = [...playOverlays]
      newOverlays[index] = true
      setPlayOverlays(newOverlays)
    }
  }

  const handleVideoPlay = (index: number) => {
    // Hide play overlay when video starts playing
    const newOverlays = [...playOverlays]
    newOverlays[index] = false
    setPlayOverlays(newOverlays)
  }

  const handleVideoPause = (index: number) => {
    // Show play overlay when video is paused
    const newOverlays = [...playOverlays]
    newOverlays[index] = true
    setPlayOverlays(newOverlays)
  }

  const handleVideoEnd = (index: number) => {
    // Show play overlay when video ends
    const newOverlays = [...playOverlays]
    newOverlays[index] = true
    setPlayOverlays(newOverlays)
    
    // Move to next slide
    const nextSlide = (index + 1) % media.length
    setCurrentSlide(nextSlide)
  }

  const getMimeType = (url: string) => {
    if (/\.mov$/i.test(url)) return "video/quicktime"
    if (/\.webm$/i.test(url)) return "video/webm"
    if (/\.ogg$/i.test(url)) return "video/ogg"
    return "video/mp4"
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
        autoPlay={false}
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
                  priority={index === 0}
                />
              ) : (
                <div 
                  onClick={() => handleVideoClick(index)}
                  className="video-container w-full h-full cursor-pointer"
                >
                  <video
                  //@ts-ignore
                    ref={el => videoRefs.current[index] = el}
                    className="w-full h-full object-cover"
                    playsInline
                    preload="metadata"
                    muted={false}
                    controls={false}
                    loop={false}
                    onPlay={() => handleVideoPlay(index)}
                    onPause={() => handleVideoPause(index)}
                    onEnded={() => handleVideoEnd(index)}
                    onError={e => console.error("Video failed:", e)}
                  >
                    <source src={item.url} type={getMimeType(item.url)} />
                    Your browser does not support HTML5 video.
                  </video>
                  
                  {/* Play overlay - only show when video is paused */}
                  {playOverlays[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                      <div className="p-4 bg-black/50 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  )}
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