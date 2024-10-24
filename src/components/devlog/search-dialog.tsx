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
import { searchPosts } from "@/lib/search";
import type { Post } from "@/types/index";
import { format } from "date-fns";

interface SearchDialogProps {
  posts: Post[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
      if (value.length > 0) {
        const results = searchPosts(posts, value);
        setSearchResults(results || []);
      } else {
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

      router.push(`/devlog/${post.category.toLowerCase()}/${post.slug}`);
      onOpenChange(false);
    },
    [router, onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">게시글 검색</DialogTitle>
      <DialogDescription className="sr-only">
        제목, 내용, 태그로 게시글을 검색할 수 있습니다.
      </DialogDescription>
      <div className="flex flex-col overflow-hidden rounded-md border">
        <CommandInput
          placeholder="검색어를 입력하세요 (제목, 내용, 태그) (Ctrl + K)"
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList className="max-h-[300px] overflow-y-auto">
          <CommandEmpty className="py-6 text-center text-sm">
            {query.length === 0
              ? "검색어를 입력해주세요."
              : "검색 결과가 없습니다."}
          </CommandEmpty>
          {searchResults.length > 0 && (
            <CommandGroup heading={`검색 결과 (${searchResults.length})`}>
              {searchResults.map((post) => (
                <CommandItem
                  key={post.slug}
                  onSelect={() => handleSelect(post)}
                  className="flex flex-col items-start py-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold">{post.title}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{format(new Date(post.date), "yyyy.MM.dd")}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </div>
    </CommandDialog>
  );
}
