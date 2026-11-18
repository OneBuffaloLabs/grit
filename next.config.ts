import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: ['10.5.1.63', 'localhost'],
  transpilePackages: ['@onebuffalolabs/herd-sync', '@onebuffalolabs/adapter-webrtc'],
  experimental: {
    agentUpgrade: 'security',
  },
  turbopack: {},
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Only remove in production
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        events: false,
        buffer: false,
        stream: false,
      };
    }
    return config;
  },
};

export default nextConfig;
