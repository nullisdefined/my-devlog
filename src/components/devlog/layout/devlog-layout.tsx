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
    <div className="flex flex-col min-h-screen relative">
      <DevlogHeader posts={posts} />
      <div className="flex-1">
        <div className="container mx-auto max-w-[1440px] px-4">
          <div className="flex flex-col xl:flex-row gap-8">
            <aside
              className={cn(
                "xl:hidden fixed inset-y-0 left-0 z-40 w-72 bg-background",
                "transform transition-transform duration-300 ease-out",
                "border-r border-border/40",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <div className="h-full pt-16 pb-4 overflow-y-auto">
                <DevlogSidebar posts={posts} />
              </div>
            </aside>

            <aside className="hidden xl:block w-60 shrink-0">
              <div className="sticky top-20 pt-[40px] pb-[700px]">
                <DevlogSidebar posts={posts} />
              </div>
            </aside>

            <main className="flex-1 min-h-[calc(100vh-4rem)] py-6 pt-[40px] sm:pt-[76px]">
              <div className="relative w-full mx-auto">
                <div
                  className={cn(
                    "w-full mx-auto",
                    isListPage ? "xl:w-[1000px]" : "xl:w-[768px]"
                  )}
                >
                  {children}
                </div>
              </div>
            </main>

            {toc && (
              <aside className="hidden md:block w-48 lg:w-52 shrink-0">
                <div className="sticky top-20 lg:top-24 pt-[20px] pb-[100px] flex flex-col gap-2 mr-8 lg:mr-12">
                  <TableOfContents toc={toc} />
                </div>
              </aside>
            )}
          </div>
        </div>
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
  );
}
