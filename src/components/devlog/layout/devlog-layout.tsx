"use client";

import { useState, useEffect } from "react";
import { DevlogHeader } from "./devlog-header";
import { DevlogSidebar } from "./devlog-sidebar";
import Footer from "@/components/footer";
import { TableOfContents } from "./table-of-contents";
import { TableOfContentsItem, Post } from "@/types/index";
import { ScrollToTop } from "../scroll-to-top";

interface DevlogLayoutProps {
  children: React.ReactNode;
  toc?: TableOfContentsItem[];
  posts?: Post[];
}

export function DevlogLayout({
  children,
  toc = [],
  posts = [],
}: DevlogLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DevlogHeader posts={posts} />
      <div className="flex-1">
        <div className="container mx-auto">
          <div className="flex gap-4">
            {/* 왼쪽 사이드바 */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-20 pt-[120px]">
                <DevlogSidebar posts={posts} />
              </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 min-h-[calc(100vh-4rem)] py-6 pt-[76px] px-4">
              <div className="w-full max-w-3xl mx-auto">
                {/* 내부 컨텐츠를 감싸는 컨테이너 */}
                {children}
              </div>
            </main>

            {/* 오른쪽 사이드바(고정) */}
            {toc && toc.length > 0 && (
              <aside className="hidden xl:block w-60 shrink-0">
                <div className="sticky top-20 pt-[46px] flex flex-col gap-2">
                  <TableOfContents items={toc} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
