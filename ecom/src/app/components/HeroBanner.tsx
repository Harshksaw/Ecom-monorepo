'use client'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import React, { useState, useEffect } from "react"
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

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get<{ images: BannerMedia[] }>(`${API_URL}/images`)
        // If your API doesn’t tell you the type, infer it from the URL:
        const withType = res.data.images.map(item => ({
          ...item,
          type: /\.(mp4|webm|ogg)(\?.*)?$/i.test(item.url) ? "video" : "image"
        }))
        setMedia(withType)
      } catch (err) {
        console.error(err)
        setError("Failed to load banner media")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMedia()
  }, [])

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
        autoPlay
        infiniteLoop
        showThumbs={false}
        showIndicators
        showStatus={false}
        className="banner-carousel"
      >
        {media.map(item => (
          <div key={item._id} className="carousel-slide">
            <div className="relative h-[300px] md:h-[500px] overflow-hidden">
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt={item.legend || "Banner image"}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source src={item.url} type="video/mp4" />
                  {/* fallback text */}
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
