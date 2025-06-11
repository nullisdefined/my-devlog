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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Set-Cookie",
            value:
              "__vercel_toolbar_=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;",
          },
          {
            key: "X-Robots-Tag",
            value:
              "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
        ],
      },
    ];
  },
  // Generate sitemap during build
  async redirects() {
    return [];
  },
  // SEO improvements
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
