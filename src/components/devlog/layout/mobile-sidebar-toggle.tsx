"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/class-name-utils";

interface MobileSidebarToggleProps {
  onToggle: () => void;
  className?: string;
}

export function MobileSidebarToggle({
  onToggle,
  className,
}: MobileSidebarToggleProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed left-4 bottom-4 z-50 h-10 w-10 rounded-full",
        "bg-background/80 backdrop-blur-sm border border-border",
        "hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}
      onClick={onToggle}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
