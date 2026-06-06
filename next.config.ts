import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['viem'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false
    };
    return config;
  }
};

export default nextConfig;
