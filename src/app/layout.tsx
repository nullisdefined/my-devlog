import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/theme-provider";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { ChatWidget } from "@/components/chat/chat-widget";
import SessionWrapper from "@/components/session-wrapper";

const pretendard = localFont({
  src: [
    {
      path: "../public/fonts/Pretendard-Black.ttf",
      weight: "900",
    },
    {
      path: "../public/fonts/Pretendard-ExtraBold.ttf",
      weight: "800",
    },
    {
      path: "../public/fonts/Pretendard-Bold.ttf",
      weight: "700",
    },
    {
      path: "../public/fonts/Pretendard-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../public/fonts/Pretendard-Medium.ttf",
      weight: "500",
    },
    {
      path: "../public/fonts/Pretendard-Regular.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/Pretendard-Light.ttf",
      weight: "300",
    },
    {
      path: "../public/fonts/Pretendard-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../public/fonts/Pretendard-Thin.ttf",
      weight: "100",
    },
  ],
  variable: "--font-pretendard",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nullisdefined.site"),
  title: {
    default: "Jaewoo Kim | Portfolio",
    template: "%s",
  },
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
    "웹 개발",
    "백엔드 개발",
    "프론트엔드 개발",
    "소프트웨어 개발",
    "프로그래밍",
    "개발자 이력서",
    "프로젝트 포트폴리오",
    "Full-stack Developer",
    "Web Developer",
    "Portfolio",
    "Software Engineer",
  ],
  authors: [
    { name: "Jaewoo Kim (nullisdefined)", url: "https://nullisdefined.site" },
  ],
  creator: "Jaewoo Kim",
  publisher: "Jaewoo Kim",
  category: "Technology",
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
    notranslate: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://nullisdefined.site",
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
      "풀스택 개발자 김재우(Jaewoo Kim, nullisdefined)의 포트폴리오입니다. Node.js, NestJS, TypeScript를 활용한 웹 애플리케이션 개발 경험과 프로젝트를 소개합니다.",
    creator: "@nullisdefined",
  },
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
  verification: {
    google: "ff3317b463f80ded",
    other: {
      "naver-site-verification": "acc1996a3ef10bb25b7449629e79dcb2",
    },
  },
  alternates: {
    canonical: "https://nullisdefined.site",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "ProfilePage"],
    name: "Jaewoo Kim's Portfolio",
    description:
      "풀스택 개발자 김재우의 포트폴리오입니다. Node.js, NestJS, TypeScript를 활용한 웹 애플리케이션 개발 경험과 프로젝트를 소개합니다.",
    url: "https://nullisdefined.site",
    author: {
      "@type": "Person",
      name: "Jaewoo Kim",
      alternateName: ["김재우", "nullisdefined"],
      jobTitle: "풀스택 개발자",
      url: "https://nullisdefined.site",
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
    publisher: {
      "@type": "Person",
      name: "Jaewoo Kim (nullisdefined)",
    },
    inLanguage: "ko-KR",
    mainEntity: {
      "@type": "Person",
      name: "Jaewoo Kim",
      alternateName: ["김재우", "nullisdefined"],
      jobTitle: "풀스택 개발자",
      description: "Node.js와 TypeScript를 주력으로 하는 풀스택 개발자",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nullisdefined.site/devlog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function setTheme() {
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme || 'light';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                }
                
                // 즉시 실행
                setTheme();
                
                // DOM이 완전히 로드된 후에도 한 번 더 실행
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', setTheme);
                } else {
                  setTheme();
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SessionWrapper>
            {children}
            <ChatWidget />
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
