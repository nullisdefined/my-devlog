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
    default: "Devlog",
    template: "%s | Devlog",
  },
  description:
    "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그입니다. JavaScript, TypeScript, Node.js, NestJS, 데이터베이스 등 다양한 개발 주제를 다룹니다.",
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
    type: "website",
    locale: "ko_KR",
    url: "https://nullisdefined.site",
    siteName: "Devlog",
    title: "Devlog",
    description:
      "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그",
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
    title: "Devlog",
    description:
      "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그",
    images: ["/favicon.ico"],
  },
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
  verification: {
    google: "ff3317b463f80ded",
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
    "@type": "WebSite",
    name: "Devlog",
    description:
      "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그",
    url: "https://nullisdefined.site",
    author: {
      "@type": "Person",
      name: "nullisdefined",
    },
    publisher: {
      "@type": "Person",
      name: "nullisdefined",
    },
    inLanguage: "ko-KR",
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
