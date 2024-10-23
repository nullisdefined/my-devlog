import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/theme-provider";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

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

export const metadata: Metadata = {
  title: "Main",
  description: "메인 페이지 입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`min-h-screen bg-background font-sans antialiased ${pretendard.className}`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
