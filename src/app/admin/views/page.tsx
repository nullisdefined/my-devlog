"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/admin/posts/views");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">게시글 조회수</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={`${post.category}/${post.slug}`} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{post.category}</span>
                  <span>{format(new Date(post.date), "yyyy.MM.dd")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Eye className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  {post.views.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
