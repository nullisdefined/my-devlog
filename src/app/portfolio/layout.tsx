import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaewoo Kim | Portfolio",
  description:
    "풀스택 개발자 김재우(Jaewoo Kim, nullisdefined)의 포트폴리오입니다. Node.js, NestJS, TypeScript를 활용한 웹 애플리케이션 개발 경험과 프로젝트를 소개합니다.",
  keywords: [
    "Jaewoo Kim",
    "김재우",
    "nullisdefined",
    "풀스택 개발자",
    "웹 개발자",
    "포트폴리오",
    "Node.js",
    "NestJS",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Full-stack Developer",
    "Portfolio",
    "Software Engineer",
  ],
  authors: [
    { name: "Jaewoo Kim (nullisdefined)", url: "https://nullisdefined.my" },
  ],
  creator: "Jaewoo Kim",
  publisher: "Jaewoo Kim",
  openGraph: {
    type: "profile",
    locale: "ko_KR",
    url: "https://nullisdefined.my/portfolio",
    siteName: "Jaewoo Kim Portfolio",
    title: "Jaewoo Kim | Portfolio",
    description:
      "풀스택 개발자 김재우(Jaewoo Kim, nullisdefined)의 포트폴리오입니다. Node.js, NestJS, TypeScript를 활용한 웹 애플리케이션 개발 경험과 프로젝트를 소개합니다.",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
        alt: "Jaewoo Kim 포트폴리오",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaewoo Kim | Portfolio",
    description:
      "풀스택 개발자 김재우(Jaewoo Kim, nullisdefined)의 포트폴리오입니다.",
    creator: "@nullisdefined",
  },
  alternates: {
    canonical: "https://nullisdefined.my/portfolio",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "Jaewoo Kim's Portfolio",
    description:
      "풀스택 개발자 김재우의 포트폴리오입니다. Node.js, NestJS, TypeScript를 활용한 웹 애플리케이션 개발 경험과 프로젝트를 소개합니다.",
    url: "https://nullisdefined.my/portfolio",
    mainEntity: {
      "@type": "Person",
      name: "Jaewoo Kim",
      alternateName: ["김재우", "nullisdefined"],
      jobTitle: "풀스택 개발자",
      description: "Node.js와 TypeScript를 주력으로 하는 풀스택 개발자",
      url: "https://nullisdefined.my/portfolio",
      knowsAbout: [
        "Node.js",
        "NestJS",
        "TypeScript",
        "JavaScript",
        "React",
        "Next.js",
        "웹 개발",
        "풀스택 개발",
      ],
    },
    inLanguage: "ko-KR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
