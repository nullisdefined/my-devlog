import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { getAllPosts } from "@/lib/posts";
import { Metadata } from "next";
import { TocProvider } from "../context/toc-provider";

export const metadata: Metadata = {
  title: {
    default: "개발새발",
    template: "%s | 개발새발",
  },
  description:
    "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그입니다.",
  keywords: [
    "개발 블로그",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "NestJS",
    "프로그래밍",
    "웹 개발",
    "백엔드",
    "프론트엔드",
  ],
  authors: [{ name: "nullisdefined" }],
  creator: "nullisdefined",
  publisher: "nullisdefined",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    notranslate: true,
  },
  openGraph: {
    title: "개발새발",
    description:
      "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그",
    url: "https://nullisdefined.site/devlog",
    siteName: "Devlog",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
        alt: "Devlog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "개발새발",
    description:
      "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그",
    images: ["/favicon.ico"],
  },
  alternates: {
    canonical: "https://nullisdefined.site/devlog",
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getAllPosts();
  return (
    <TocProvider>
      <DevlogLayout posts={posts} isListPage={true}>
        {children}
      </DevlogLayout>
    </TocProvider>
  );
}
