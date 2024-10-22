"use client";

import { useState, useEffect } from "react";
import { DevlogHeader } from "./devlog-header";
import { DevlogSidebar } from "./devlog-sidebar";
import Footer from "@/components/footer";
import { TableOfContents } from "./table-of-contents";
import { TableOfContentsItem } from "@/types/post";
import { ScrollToTop } from "../scroll-to-top";

interface DevlogLayoutProps {
  children: React.ReactNode;
  toc?: TableOfContentsItem[];
}

export function DevlogLayout({ children, toc = [] }: DevlogLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DevlogHeader />
      <div className="flex-1">
        <div className="container mx-auto">
          <div className="flex gap-4">
            {/* 왼쪽 사이드바 */}
            <aside className="hidden lg:block w-60 shrink-0 pr-[70px]">
              <div className="pt-[120px]">
                <DevlogSidebar />
              </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 min-h-[calc(100vh-4rem)] py-6 pt-[76px] px-4 pl-24">
              <div className="w-full max-w-3xl">
                {/* 너비 고정 및 왼쪽 정렬 */}
                <div className="w-full">
                  {/* 내부 컨텐츠를 감싸는 컨테이너 */}
                  {children}
                </div>
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
