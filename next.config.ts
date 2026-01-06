import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    unoptimized: true, // Disable optimization to serve images directly from Nginx/Disk
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'kampuscms', // Internal docker network
      },
      {
        protocol: 'https',
        hostname: '**', // Allow external images (like from Google, Unsplash)
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
