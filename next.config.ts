import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: ['10.5.1.63', 'localhost'],
  experimental: {
    agentUpgrade: 'security',
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Only remove in production
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
