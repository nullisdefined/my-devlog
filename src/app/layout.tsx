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
  display: "swap",
});

const appleSdGothic = localFont({
  src: [
    { path: "../../public/fonts/AppleSDGothicNeoB.ttf", weight: "700" },
    { path: "../../public/fonts/AppleSDGothicNeoEB.ttf", weight: "800" },
    { path: "../../public/fonts/AppleSDGothicNeoH.ttf", weight: "900" },
    { path: "../../public/fonts/AppleSDGothicNeoSB.ttf", weight: "600" },
    { path: "../../public/fonts/AppleSDGothicNeoM.ttf", weight: "500" },
    { path: "../../public/fonts/AppleSDGothicNeoR.ttf", weight: "400" },
    { path: "../../public/fonts/AppleSDGothicNeoL.ttf", weight: "300" },
    { path: "../../public/fonts/AppleSDGothicNeoUL.ttf", weight: "200" },
    { path: "../../public/fonts/AppleSDGothicNeoT.ttf", weight: "100" },
  ],
  variable: "--font-apple-sd",
  display: "swap",
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
  metadataBase: new URL("https://nullisdefined.my"),
  title: {
    default: "개발새발",
    template: "%s",
  },
  description:
    "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그입니다.",
  keywords: [
    "nullisdefined",
    "개발새발",
    "개발 블로그",
    "기술 블로그",
    "소프트웨어 개발",
  ],
  authors: [{ name: "nullisdefined", url: "https://nullisdefined.my" }],
  creator: "nullisdefined",
  publisher: "nullisdefined",
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
    url: "https://nullisdefined.my",
    siteName: "개발새발",
    title: "개발새발",
    description: "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그입니다.",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
        alt: "개발새발",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "개발새발",
    description: "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그입니다.",
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
    canonical: "https://nullisdefined.my",
    types: {
      "application/rss+xml": [
        {
          url: "https://nullisdefined.my/feed.xml",
          title: "개발새발 RSS Feed",
        },
      ],
    },
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
    name: "개발새발",
    description: "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그입니다.",
    url: "https://nullisdefined.my",
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
    potentialAction: {
      "@type": "SearchAction",
      target: "https://nullisdefined.my?q={search_term_string}",
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
      <body
        className={`${appleSdGothic.className} ${pretendard.className} ${jetbrainsMono.variable} ${appleSdGothic.variable} ${pretendard.variable}`}
      >
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
