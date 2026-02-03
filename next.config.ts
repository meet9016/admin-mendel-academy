const nextConfig = {
  // Enable React strict mode for better dev warnings
  reactStrictMode: true,

  // Use SWC to minify and produce smaller client bundles (faster loads)
  swcMinify: true,

  // Important: Silence turbopack warning
  turbopack: {},

  // Experimental options to improve navigation and streaming
  experimental: {
    reactRoot: true,
    serverActions: true,
    scrollRestoration: true,
    optimizeCss: true,
  },

  // Your webpack SVG loader
  webpack(config : any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  standalone: true,
  // Allow builds to pass even with type errors
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
