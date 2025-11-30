"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Eye, RefreshCw } from "lucide-react";
import { format } from "date-fns";

interface PostViews {
  category: string;
  slug: string;
  title: string;
  views: number;
  date: string;
}

export default function ViewsPage() {
  const [posts, setPosts] = useState<PostViews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/admin/posts/views", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">게시글 조회수</h1>
          <p className="text-muted-foreground">
            총 {posts.length}개 게시글 · 누적 조회수{" "}
            {totalViews.toLocaleString()}
          </p>
        </div>
        <button
          onClick={fetchPosts}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          새로고침
        </button>
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            아직 조회수가 기록된 게시글이 없습니다.
          </Card>
        ) : (
          posts.map((post, index) => (
            <Card
              key={`${post.category}/${post.slug}`}
              className="p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-2xl font-bold text-muted-foreground w-8 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <h2 className="text-lg font-semibold truncate">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="truncate">{post.category}</span>
                      <span className="flex-shrink-0">
                        {format(new Date(post.date), "yyyy.MM.dd")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg flex-shrink-0">
                  <Eye className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-primary">
                    {post.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
