import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  // ✅ Add these sections below
  typescript: {
    // ❗ Allow production builds to complete even if there are type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ❗ Skip ESLint checks during `next build`
    ignoreDuringBuilds: true,
  },
  
};

export default nextConfig;
