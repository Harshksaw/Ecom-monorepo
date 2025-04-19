'use client';

import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";


interface ProductImage {
  id: string | number;
  attributes: {
    url: string;
    name?: string;
  };
}

interface ProductDetailsCarouselProps {
  images: any[] | ProductImage[];
}

const ProductDetailsCarousel: React.FC<ProductDetailsCarouselProps> = ({ images }:any) => {
  // console.log("🚀 ~ images:", images)
  // If no images are provided, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="text-center p-5 border rounded-lg">
        <p className="text-gray-500">No product images available</p>
      </div>
    );
  }

  return (
    <div className="text-white text-[20px] w-full max-w-[1360px] mx-auto sticky top-[50px]">
      <Carousel
        infiniteLoop={true}
        showIndicators={false}
        showStatus={false}
        thumbWidth={60}
        className="productCarousel"
      >
        {images.map((img:any) => (
          <div key={img.id}>
            <img
              src={img}
              alt={img || "Product image"}
              className="object-contain"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProductDetailsCarousel;