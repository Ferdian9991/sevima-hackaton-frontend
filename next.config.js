/** @type {import('next').NextConfig} */

require("dotenv").config({ path: ".env" });

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  env: {
    API_URL: process.env.API_URL,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compilerOptions: {
    jsxImportSource: "preact",
  },
  reactStrictMode: false,
});

module.exports = nextConfig;
