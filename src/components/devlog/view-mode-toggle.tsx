"use client";

import { Button } from "@/components/ui/button";
import { Grid3X3, List, LayoutGrid } from "lucide-react";
import { useViewMode } from "@/app/context/view-mode-provider";
import { cn } from "@/lib/class-name-utils";

export function ViewModeToggle() {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode("masonry")}
        className={cn(
          "h-8 px-3",
          viewMode === "masonry"
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline ml-2">masonry</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode("list")}
        className={cn(
          "h-8 px-3",
          viewMode === "list"
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline ml-2">list</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode("card")}
        className={cn(
          "h-8 px-3",
          viewMode === "card"
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Grid3X3 className="w-4 h-4" />
        <span className="hidden sm:inline ml-2">card</span>
      </Button>
    </div>
  );
}
