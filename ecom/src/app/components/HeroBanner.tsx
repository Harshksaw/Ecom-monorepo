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
  const [showPlayOverlay, setShowPlayOverlay] = useState(true)
  const initialPlayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const playAttemptedRef = useRef(false)

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
    
    // Set up the initial delayed play timer
    initialPlayTimerRef.current = setTimeout(() => {
      attemptAutoplayWithSound();
    }, 2000); // 2 second delay
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      if (initialPlayTimerRef.current) {
        clearTimeout(initialPlayTimerRef.current);
      }
    };
  }, [])

  // Function to attempt autoplay with sound after the delay
  const attemptAutoplayWithSound = () => {
    if (playAttemptedRef.current) return; // Only try once
    
    playAttemptedRef.current = true;
    const currentVideo = videoRefs.current[currentSlide];
    
    if (currentVideo && media[currentSlide]?.type === "video") {
      // Create a user gesture simulation
      const simulateUserGesture = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        // Try to unmute the video
        currentVideo.muted = false;
        currentVideo.volume = 1;
        
        // Try to play with sound
        const playPromise = currentVideo.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log("Delayed autoplay with sound successful");
            setShowPlayOverlay(false);
          }).catch(error => {
            console.log("Delayed autoplay with sound failed:", error);
            // Fall back to muted if needed
            currentVideo.muted = true;
            currentVideo.play().catch(e => console.error("Even muted play failed:", e));
          });
        }
      };
      
      // Execute the user gesture simulation
      simulateUserGesture();
    }
  };

// after your fetch‑media useEffect, but before your slide‑interval useEffect
useEffect(() => {
  if (!videoRefs.current[currentSlide]) return;
  const vid = videoRefs.current[currentSlide]!;

  // 1️⃣ Kick off a muted autoplay immediately
  vid.muted = true;
  vid.volume = 0;
  vid.play().catch(console.warn);

  // 2️⃣ After 1 second, unmute and re‑play with sound
  const timer = setTimeout(() => {
    vid.muted = false;
    vid.volume = 1;
    vid.play().catch(err => {
      console.warn("Unmuted autoplay blocked:", err);
      // if it still fails, you’re back to muted playback
      vid.muted = true;
      vid.play().catch(console.error);
    });
  }, 1000);

  return () => clearTimeout(timer);
}, [currentSlide, media]);


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
    setShowPlayOverlay(true) // Reset play overlay on slide change

    // Pause all videos
    videoRefs.current.forEach((videoRef) => {
      if (videoRef) {
        videoRef.pause()
      }
    })

    // Play the current video if it exists
    const currentVideo = videoRefs.current[index]
    if (currentVideo && media[index]?.type === "video") {
      // Try to play unmuted first
      currentVideo.muted = false
      currentVideo.volume = 1
      
      const playPromise = currentVideo.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing with sound");
            setShowPlayOverlay(false);
          })
          .catch((error) => {
            console.log("Unmuted autoplay prevented:", error)
            // If unmuted play fails, try muted
            currentVideo.muted = true
            currentVideo.play().then(() => {
              console.log("Video playing muted");
              setShowPlayOverlay(false);
            }).catch(e => {
              console.error("Even muted play failed:", e)
              setShowPlayOverlay(true);
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
        // Try to play with sound
        video.muted = false;
        video.volume = 1;
        
        video.play().then(() => {
          console.log("User-initiated play successful");
          setShowPlayOverlay(false);
        }).catch(e => {
          console.log("Play on click failed:", e);
          // If unmuted play fails, try muted
          video.muted = true;
          video.play().then(() => {
            setShowPlayOverlay(false);
          }).catch(e => {
            console.error("Even muted play failed:", e);
          });
        });
      } else {
        video.pause();
        setShowPlayOverlay(true);
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

  // Function to handle playing events
  const handleVideoPlay = () => {
    setShowPlayOverlay(false);
  }
  
  // Function to handle pausing events
  const handleVideoPause = () => {
    setShowPlayOverlay(true);
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
                    preload="auto"
                    loop={false} // Do not loop videos
                    controls={false}
                    onEnded={() => handleVideoEnd(index)} // Trigger when video ends
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onError={(e) => console.error("Video failed to load:", e)}
                  >
                    <source src={item.url} type={getMimeType(item.url)} />
                    Your browser does not support HTML5 video.
                  </video>
                  
                  {/* Play indicator overlay - only show when video is paused */}
                  {showPlayOverlay && index === currentSlide && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                      <div className="p-4 bg-black/50 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Sound indicator - show when playing */}
                  {!showPlayOverlay && index === currentSlide && (
                    <div className="absolute bottom-4 right-4 p-2 bg-black/50 rounded-full">
                      {!videoRefs.current[index]?.muted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.39 7.39 0 00-5.657 2.343M15.535 15.536a9 9 0 001.535-5.536 9 9 0 00-1.535-5.536" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012 12M12 12v.01" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                      )}
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