"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { SearchDialog } from "../search-dialog";
import type { Post } from "@/types/index";

export function DevlogHeader({ posts = [] }: { posts: Post[] }) {
  console.log("Posts in header:", posts);

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
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/devlog" className="flex items-center space-x-2">
            <span className="font-bold text-lg">#nullisdefined</span>
          </Link>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
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

      <SearchDialog posts={posts} open={isOpen} onOpenChange={setIsOpen} />
    </header>
  );
}
