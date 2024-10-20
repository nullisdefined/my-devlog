/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // next.js를 HTML로 내보내기 위한 설정
  basePath: "/nullisdefined",
  assetPrefix: "/nullisdefined/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
