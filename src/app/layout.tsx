import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/theme-provider";

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
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
