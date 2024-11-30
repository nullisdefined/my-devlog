"use client";

import { useState, useEffect } from "react";
import { DevlogHeader } from "./devlog-header";
import { DevlogSidebar } from "./devlog-sidebar";
import { MobileSidebarToggle } from "./mobile-sidebar-toggle";
import Footer from "@/components/footer";
import { TableOfContents } from "./table-of-contents";
import { TableOfContentsItem, Post } from "@/types/index";
import { ScrollToTop } from "../scroll-to-top";
import { cn } from "@/lib/class-name-utils";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <DevlogHeader posts={posts} />
      <div className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* 모바일/태블릿 사이드바 */}
            <aside
              className={cn(
                "xl:hidden fixed inset-y-0 left-0 z-40 w-72 bg-background/80 backdrop-blur-sm",
                "transform transition-transform duration-300 ease-out",
                "border-r border-border/40",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <div className="h-full pt-20 pb-4 overflow-y-auto custom-scrollbar">
                <DevlogSidebar posts={posts} />
              </div>
            </aside>

            {/* PC 사이드바 */}
            <aside className="hidden xl:block w-60 shrink-0">
              <div className="sticky top-20 pt-[40px] pb-[700px]">
                <DevlogSidebar posts={posts} />
              </div>
            </aside>

            {/* 메인 컨텐츠 */}
            <main className="flex-1 min-h-[calc(100vh-4rem)] py-6 pt-[76px]">
              <div className="relative w-full mx-auto">
                {/* 컨텐츠 영역 - 태블릿에서는 더 넓은 너비 사용 */}
                <div className="w-full xl:w-[768px] mx-auto">{children}</div>
              </div>
            </main>

            {/* TOC - 태블릿과 PC에서 표시 */}
            {toc && toc.length > 0 && (
              <aside className="hidden md:block w-60 shrink-0">
                <div className="sticky top-20 pt-[46px] flex flex-col gap-2">
                  <TableOfContents items={toc} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* 모바일/태블릿 사이드바 토글 버튼 */}
      <MobileSidebarToggle
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        className="xl:hidden"
      />

      {/* 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 xl:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Footer />
      <ScrollToTop />
    </div>
  );
}
