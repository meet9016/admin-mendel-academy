

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
   experimental: {
    optimizeCss: true,
  },

  output: "standalone",

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  typescript: {
    ignoreBuildErrors: true,
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
