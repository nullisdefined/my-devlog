"use client";

import { useState, useEffect } from "react";
import { DevlogHeader } from "./devlog-header";
import { DevlogSidebar } from "./devlog-sidebar";
import Footer from "@/components/footer";
import { TableOfContents } from "./table-of-contents";
import { TableOfContentsItem } from "@/types/post";

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
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {/* Left Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-20 pt-4">
                <DevlogSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-h-[calc(100vh-4rem)] py-6">
              <div className="max-w-3xl mx-auto">{children}</div>
            </main>

            {/* Right Sidebar - TOC */}
            {toc && toc.length > 0 && (
              <aside className="hidden xl:block w-64 shrink-0">
                <div className="sticky top-20 pt-4">
                  <TableOfContents items={toc} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
