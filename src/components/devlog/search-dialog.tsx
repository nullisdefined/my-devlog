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
import { searchPosts } from "@/lib/search";
import type { Post } from "@/types/post";
import { format } from "date-fns";
import { Tag } from "./tag";

interface SearchDialogProps {
  posts: Post[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ posts, open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.length > 0) {
        const results = searchPosts(posts, value);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    },
    [posts]
  );

  const handleSelect = (post: Post) => {
    router.push(`/devlog/${post.category.toLowerCase()}/${post.slug}`);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="검색어를 입력하세요... (제목, 내용, 태그) (Ctrl + K)"
        value={query}
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
        <CommandGroup heading={`검색 결과 (${searchResults.length})`}>
          {searchResults.map((post) => (
            <CommandItem
              key={post.slug}
              onSelect={() => handleSelect(post)}
              className="flex flex-col items-start py-3"
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium">{post.title}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(post.date), "yyyy.MM.dd")}
                </span>
              </div>
              {post.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {post.description}
                </p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {post.tags.map((tag) => (
                    <Tag key={tag} name={tag} className="text-xs py-0" />
                  ))}
                </div>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
