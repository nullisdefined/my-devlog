"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { searchPosts } from "@/lib/search";
import type { Post } from "@/types/index";
import { format } from "date-fns";

interface SearchDialogProps {
  posts: Post[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 dark:bg-yellow-800">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const groupByCategory = (posts: Post[]) => {
  return posts.reduce((groups, post) => {
    const category = post.category || "Uncategorized";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(post);
    return groups;
  }, {} as Record<string, Post[]>);
};

export function SearchDialog({ posts, open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSearchResults([]);
    }
  }, [open]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      try {
        if (value.trim().length > 0) {
          const results = searchPosts(posts, value.trim());
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    },
    [posts]
  );

  const handleSelect = useCallback(
    (post: Post) => {
      if (!post?.category || !post?.slug) {
        console.error("Invalid post data:", post);
        return;
      }

      router.push(`/devlog/posts/${post.category.toLowerCase()}/${post.slug}`);
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  const groupedResults = groupByCategory(searchResults);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">게시글 검색</DialogTitle>
      <DialogDescription className="sr-only">
        제목, 내용, 태그로 게시글을 검색할 수 있습니다.
      </DialogDescription>
      <div className="flex flex-col overflow-hidden rounded-md border">
        <CommandInput
          placeholder="검색어를 입력하세요 (제목, 내용, 태그) (⌘ + K)"
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList className="max-h-[400px] overflow-y-auto">
          <CommandEmpty className="py-6 text-center text-sm">
            {query.length === 0
              ? "검색어를 입력해주세요."
              : "검색 결과가 없습니다."}
          </CommandEmpty>
          {Object.entries(groupedResults).map(([category, categoryPosts]) => (
            <CommandGroup
              key={category}
              heading={`${category} (${categoryPosts.length})`}
            >
              {categoryPosts.map((post) => (
                <CommandItem
                  key={post.slug}
                  onSelect={() => handleSelect(post)}
                  className="flex flex-col items-start py-3 cursor-pointer"
                >
                  <div className="flex flex-col w-full gap-1">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold">
                        {highlightText(post.title, query)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(post.date), "yyyy.MM.dd")}
                      </span>
                    </div>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {highlightText(post.excerpt, query)}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {highlightText(tag, query)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </div>
    </CommandDialog>
  );
}
