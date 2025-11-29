"use client";

import { useState, useEffect } from "react";
import { DevlogHeader } from "./devlog-header";
import { DevlogSidebar } from "./devlog-sidebar";
import { MobileSidebarToggle } from "./mobile-sidebar-toggle";
import Footer from "@/components/footer";
import { TableOfContents } from "./table-of-contents";
import { Post } from "@/types/index";
import { ScrollToTop } from "../scroll-to-top";
import { cn } from "@/lib/class-name-utils";
import { useToc } from "@/app/context/toc-provider";
import { ViewModeProvider } from "@/app/context/view-mode-provider";

interface DevlogLayoutProps {
  children: React.ReactNode;
  posts?: Post[];
  isListPage?: boolean;
}

export function DevlogLayout({
  children,
  posts = [],
  isListPage = false,
}: DevlogLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toc } = useToc();

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ViewModeProvider>
      <div className="flex flex-col min-h-screen relative">
        <DevlogHeader posts={posts} />
        <div className="flex-1">
          {/* 모바일 사이드바 */}
          <aside
            className={cn(
              "xl:hidden fixed inset-y-0 left-0 z-40 w-72 bg-background",
              "transform transition-transform duration-300 ease-out",
              "border-r border-border/40",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="h-full pt-16 pb-4 overflow-y-auto scrollbar-thin pr-2">
              <DevlogSidebar
                posts={posts}
                onLinkClick={() => setIsSidebarOpen(false)}
              />{" "}
            </div>
          </aside>

          {/* 데스크톱 고정 사이드바 */}
          <aside className="hidden xl:block fixed left-0 top-0 w-[288px] h-screen bg-background border-r border-border/40 z-30">
            <div className="h-full overflow-y-auto scrollbar-thin px-2">
              <div className="pt-20 pb-8">
                <DevlogSidebar posts={posts} />
              </div>
            </div>
          </aside>

          {/* 메인 콘텐츠 영역 */}
          <div className={cn("xl:ml-[288px]", toc && "xl:mr-[280px]")}>
            <main className="min-h-[calc(100vh-4rem)] py-6 pt-[76px] px-4">
              <div
                className={cn(
                  "w-full mx-auto",
                  isListPage ? "max-w-5xl" : "max-w-4xl",
                )}
              >
                {children}
              </div>
            </main>
          </div>

          {/* 데스크톱 고정 TOC */}
          {toc && (
            <aside className="hidden xl:block fixed right-0 top-0 w-[280px] h-screen bg-background border-l border-border/40 z-30">
              <div className="h-full overflow-y-auto scrollbar-thin">
                <TableOfContents toc={toc} />
              </div>
            </aside>
          )}
        </div>

        <MobileSidebarToggle
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isOpen={isSidebarOpen}
        />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 xl:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <Footer />
        <ScrollToTop />
      </div>
    </ViewModeProvider>
  );
}
