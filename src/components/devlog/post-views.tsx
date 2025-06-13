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

    const updateViews = async () => {
      try {
        const response = await fetch(`/api/posts/${category}/${slug}/views`);
        const data = await response.json();
        setViews(data.views);
      } catch (error) {
        // console.error("Error updating views:", error);
      }
    };

    // 초기 조회수 추적
    trackView();

    // 페이지 포커스 시에만 업데이트 (탭 전환 등)
    const handleFocus = () => {
      updateViews();
    };

    // 페이지 가시성 변경 시 업데이트
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateViews();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
