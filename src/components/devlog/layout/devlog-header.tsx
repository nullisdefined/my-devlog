"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { SearchDialog } from "../search-dialog";
import type { Post } from "@/types/index";

interface DevlogHeaderProps {
  posts: Post[];
}

export function DevlogHeader({ posts }: DevlogHeaderProps) {
  // console.log("Posts in header:", posts);

  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos > currentScrollPos;

      setVisible(currentScrollPos < 10 || isScrollingUp);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[60] w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-full px-2">
        <div className="flex h-14 items-center justify-between">
          {/* 왼쪽 로고 */}
          <Link
            href="/devlog"
            className="flex items-center relative z-[61] px-0 -ml-2"
          >
            <Image
              src="/ssu.gif"
              alt="logo"
              width={120}
              height={40}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* 오른쪽 아이콘들 */}
          <div className="flex items-center gap-2 relative z-[61]">
            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 px-0"
              onClick={() => setIsOpen(true)}
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">검색 게시물 (Ctrl + K)</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <SearchDialog posts={posts} open={isOpen} onOpenChange={setIsOpen} />
    </header>
  );
}
