import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: [
      'plus.unsplash.com',
      'images.unsplash.com' ,
          "res.cloudinary.com"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        // You can add port and pathname if needed
      },
      // Add more hostnames as needed
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ]
  }
};


export default nextConfig;