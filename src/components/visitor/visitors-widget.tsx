"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface VisitorStats {
  total: number;
}

export function VisitorsWidget() {
  const [stats, setStats] = useState<VisitorStats>({ total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isInitialLoad = true;

    const trackVisit = async () => {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setStats({ total: data.total });
      } catch (error) {
        // console.error("Error tracking visit:", error);
      } finally {
        setLoading(false);
      }
    };

    const updateStats = async () => {
      try {
        const response = await fetch("/api/visitors");
        const data = await response.json();
        setStats({ total: data.total });
      } catch (error) {
        // console.error("Error updating stats:", error);
      }
    };

    // 초기 방문 추적
    trackVisit();

    // 페이지 포커스 시에만 업데이트 (탭 전환 등)
    const handleFocus = () => {
      if (!isInitialLoad) {
        updateStats();
      }
      isInitialLoad = false;
    };

    // 페이지 가시성 변경 시 업데이트
    const handleVisibilityChange = () => {
      if (!document.hidden && !isInitialLoad) {
        updateStats();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Eye className="w-4 h-4" />
      <p className="text-sm font-bold">{stats.total.toLocaleString()}</p>
    </div>
  );
}
