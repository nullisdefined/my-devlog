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
        console.error("Error tracking visit:", error);
      } finally {
        setLoading(false);
      }
    };

    trackVisit();

    // 5분마다 방문자 수 업데이트
    const interval = setInterval(async () => {
      const response = await fetch("/api/visitors");
      const data = await response.json();
      setStats({ total: data.total });
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-black">
      <Eye className="w-4 h-4" />
      <p className="text-sm font-bold">{stats.total.toLocaleString()}</p>
    </div>
  );
}
