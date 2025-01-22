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
        ],
      },
    ];
  },
  async redirects() {
    return [
      // 시리즈의 개별 포스트 리디렉션
      {
        source: "/devlog/series/:seriesSlug/:postSlug",
        destination: "/devlog/posts/series/:seriesSlug/:postSlug",
        permanent: true,
      },
      // posts/series/* 를 series/* 로 리디렉션 (리스트 페이지)
      {
        source: "/devlog/posts/series/:seriesSlug",
        has: [
          {
            type: "header",
            key: "referer",
            value: "(?!.*/:postSlug).*",
          },
        ],
        destination: "/devlog/series/:seriesSlug",
        permanent: true,
      },
      // 일반 포스트 리디렉션 (posts가 없는 경우)
      {
        source: "/devlog/:category/:postSlug",
        has: [
          {
            type: "header",
            key: "referer",
            value: "(?!/devlog/posts/).*",
          },
        ],
        destination: "/devlog/posts/:category/:postSlug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
