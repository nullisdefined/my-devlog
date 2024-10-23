"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { SearchDialog } from "../search-dialog";
import type { Post } from "@/types/post";

export function DevlogHeader({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/devlog" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Devlog</span>
          </Link>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="relative h-8 w-8 px-0"
            onClick={() => setOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">검색 게시물</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <SearchDialog posts={posts} open={open} onOpenChange={setOpen} />
    </header>
  );
}
