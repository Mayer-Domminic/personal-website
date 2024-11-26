import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Required for static deployment on Netlify
  images: {
    unoptimized: true, // Required for static export
  },
  // If you're using rewrites/redirects, they should be defined here
  // Remove this if you don't need them
  async rewrites() {
    return [];
  }
};

export default nextConfig;
