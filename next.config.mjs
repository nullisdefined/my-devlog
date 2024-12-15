/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ["storage.googleapis.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // appDir: true,
  },
  vercelToolbar: false,
  vercelSpeedInsights: {
    enabled: false,
  },
};

export default nextConfig;
