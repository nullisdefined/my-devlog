import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { getAllPosts } from "@/lib/posts";
import { Metadata } from "next";
import { TocProvider } from "../context/toc-provider";

export const metadata: Metadata = {
  title: {
    default: "개발새발",
    template: "%s",
  },
  description:
    "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그입니다. JavaScript, TypeScript, Node.js, NestJS 등 웹 개발 기술을 다룹니다.",
  keywords: [
    "개발 블로그",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Express",
    "NestJS",
    "프로그래밍",
    "웹 개발",
    "백엔드",
    "Backend",
    "프론트엔드",
    "Frontend",
    "소프트웨어 개발",
    "Software Development",
    "기술 블로그",
    "Tech Blog",
    "개발자",
    "Developer",
    "코딩",
    "Coding",
    "React",
    "Next.js",
    "Cloud",
    "AWS",
  ],
  authors: [{ name: "nullisdefined", url: "https://nullisdefined.my" }],
  creator: "nullisdefined",
  publisher: "nullisdefined",
  category: "Technology",
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ff3317b463f80ded",
    other: {
      "naver-site-verification": "acc1996a3ef10bb25b7449629e79dcb2",
    },
  },
  openGraph: {
    title: "개발새발 | 소프트웨어 개발 블로그",
    description:
      "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그입니다. JavaScript, TypeScript, Node.js, NestJS 등 웹 개발 기술을 다룹니다.",
    url: "https://nullisdefined.my/devlog",
    siteName: "개발새발",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://nullisdefined.my/favicon.ico",
        width: 800,
        height: 600,
        alt: "개발새발 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "개발새발 | 소프트웨어 개발 블로그",
    description:
      "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그",
    images: ["https://nullisdefined.my/favicon.ico"],
    creator: "@nullisdefined",
    site: "@nullisdefined",
  },
  alternates: {
    canonical: "https://nullisdefined.my/devlog",
    types: {
      "application/rss+xml": [
        {
          url: "https://nullisdefined.my/feed.xml",
          title: "개발새발 - 전체 RSS Feed",
        },
        {
          url: "https://nullisdefined.my/feed/category/javascript",
          title: "개발새발 - JavaScript 카테고리 RSS",
        },
        {
          url: "https://nullisdefined.my/feed/category/typescript",
          title: "개발새발 - TypeScript 카테고리 RSS",
        },
        {
          url: "https://nullisdefined.my/feed/series/devlog",
          title: "개발새발 - Devlog 시리즈 RSS",
        },
      ],
    },
  },
  other: {
    "google-site-verification": "ff3317b463f80ded",
    "naver-site-verification": "acc1996a3ef10bb25b7449629e79dcb2",
    "Cache-Control": "public, max-age=0, must-revalidate",
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "개발새발",
    description:
      "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그",
    url: "https://nullisdefined.my/devlog",
    author: {
      "@type": "Person",
      name: "nullisdefined",
      url: "https://nullisdefined.my",
    },
    publisher: {
      "@type": "Person",
      name: "nullisdefined",
    },
    inLanguage: "ko-KR",
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://nullisdefined.my/devlog/posts/${post.urlCategory}/${post.slug}`,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: "nullisdefined",
      },
    })),
  };

  return (
    <TocProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DevlogLayout posts={posts} isListPage={true}>
        {children}
      </DevlogLayout>
    </TocProvider>
  );
}
