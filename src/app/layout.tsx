import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/theme-provider";

export const metadata: Metadata = {
  title: "김재우의 포트폴리오 & 블로그",
  description: "풀스택 개발자 김재우의 포트폴리오와 기술 블로그입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
