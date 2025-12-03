import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface PostViewsProps {
  category: string;
  slug: string;
}

export function PostViews({ category, slug }: PostViewsProps) {
  const [views, setViews] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackView = async () => {
      try {
        const response = await fetch(`/api/posts/${category}/${slug}/views`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setViews(data.views);
      } catch (error) {
        // console.error("Error tracking view:", error);
      } finally {
        setLoading(false);
      }
    };

    // 페이지 진입 시 조회수 추적
    trackView();
  }, [category, slug]);

  if (loading) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Eye className="w-4 h-4" />
      <span>{views.toLocaleString()}</span>
    </div>
  );
}
