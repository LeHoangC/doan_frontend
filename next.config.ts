import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "images.pexels.com"
      },
      {
        protocol: 'http',
        hostname: "localhost"
      },
      {
        protocol: 'https',
        hostname: "res.cloudinary.com"
      }
    ]
  }
};

export default nextConfig;
