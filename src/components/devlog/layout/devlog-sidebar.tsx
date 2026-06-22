"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tag } from "../tag";
import { Post } from "@/types/index";
import { VisitorsWidget } from "@/components/visitor/visitors-widget";
import { cn } from "@/lib/class-name-utils";
import {
  Tag as TagIcon,
  FileText,
  LayoutGrid,
  Rss,
} from "lucide-react";

interface DevlogSidebarProps {
  posts: Post[];
  onLinkClick?: () => void;
}

export function DevlogSidebar({ posts, onLinkClick }: DevlogSidebarProps) {
  const [showAllTags, setShowAllTags] = useState(false);

  const allTagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => {
          counts.set(tag, (counts.get(tag) || 0) + 1);
        });
      }
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({
        name: tag,
        count: count,
      }));
  }, [posts]);

  const tagCounts = showAllTags ? allTagCounts : allTagCounts.slice(0, 10);

  return (
    <div className="relative w-full">
      <div className="space-y-3 px-1 min-h-full">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-2 py-0 pb-2 relative z-10">
          <Link href="/" onClick={onLinkClick}>
            <Avatar className="h-28 w-28 border-2 border-primary/20 hover:border-primary/40 transition-colors relative z-10">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/164657817?v=4"
                alt="Profile"
              />
              <AvatarFallback className="text-foreground">JK</AvatarFallback>
            </Avatar>
          </Link>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-foreground">
              Jaewoo Kim
            </h3>
            <p className="text-xs text-muted-foreground">{/**/}</p>
          </div>
        </div>

        {/* All Posts */}
        <div>
          <Link
            href="/devlog"
            onClick={onLinkClick}
            className={cn(
              "flex items-center justify-between w-full px-2 py-2 rounded-md",
              "hover:bg-accent hover:text-accent-foreground",
              "transition-colors cursor-pointer group",
            )}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-semibold text-foreground">
                All Posts
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {posts.length}
              </span>
            </div>
          </Link>
        </div>

        <div className="border-t border-border/50" />

        {/* Tags */}
        <div>
          <h4 className="text-sm font-semibold mb-2 px-2 text-foreground flex items-center gap-2">
            <TagIcon className="w-4 h-4" />
            Tags
          </h4>
          {tagCounts.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 px-2 items-center">
              {tagCounts.map(({ name, count }) => (
                <Link
                  key={name}
                  href={`/devlog/tags/${encodeURIComponent(
                    name.toLowerCase(),
                  )}`}
                  onClick={onLinkClick}
                >
                  <Tag
                    name={`${name} (${count})`}
                    className="group-hover:bg-accent text-foreground text-xs"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground px-2">
              태그가 없습니다
            </p>
          )}
          {allTagCounts.length > 10 && (
            <div className="w-full flex justify-center mt-2">
              <button
                className="px-4 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:text-muted-foreground/80 transition-colors"
                onClick={() => setShowAllTags((show) => !show)}
                type="button"
              >
                {showAllTags ? "Show less" : "Show more"}
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-border/50" />

        {/* Widgets Section */}
        <div className="space-y-3 px-3 py-1">
          <VisitorsWidget />
          <Link
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onLinkClick}
            className="flex items-center justify-start gap-2 py-1 text-sm text-foreground hover:text-accent-foreground transition-colors"
            title="RSS 피드 구독"
          >
            <Rss className="w-4 h-4" />
            <span className="font-semibold">RSS Feed</span>
          </Link>
        </div>

        {/* Bottom padding for scroll */}
        <div className="h-6" />
      </div>
    </div>
  );
}
