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
  trailingSlash: false,

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
      // devlog 페이지 전용 헤더
      {
        source: "/devlog",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "X-Robots-Tag",
            value: "index, follow, noarchive",
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
