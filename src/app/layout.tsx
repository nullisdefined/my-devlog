import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Blog",
  description: "Welcome to my blog ㅋㅋ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gray-800 text-white p-4">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <footer className="bg-gray-800 text-white p-4 mt-8">
          <p>&copy; 2024 My Blog. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
