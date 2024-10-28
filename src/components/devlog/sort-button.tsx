"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortButtonProps {
  order: "asc" | "desc";
  preserveParams?: boolean;
  className?: string;
}

export function SortButton({
  order,
  preserveParams = true,
  className = "",
}: SortButtonProps) {
  const handleSort = () => {
    const newOrder = order === "asc" ? "desc" : "asc";

    if (preserveParams) {
      const url = new URL(window.location.href);
      url.searchParams.set("order", newOrder);
      window.location.href = url.toString();
    } else {
      window.location.href = `?order=${newOrder}`;
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSort}
      className={`font-medium hover:bg-accent/70 transition-colors duration-200 rounded-full ${className}`}
    >
      {order === "asc" ? "oldest" : "latest"}
      <ArrowUpDown className="w-4 h-4 ml-2 text-muted-foreground" />
    </Button>
  );
}
