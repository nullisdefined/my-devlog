import { cn } from "@/lib/class-name-utils";
import Link from "next/link";

interface TagProps {
  name: string;
  className?: string;
  clickable?: boolean;
}

export function Tag({ name, className, clickable = false }: TagProps) {
  const tagContent = (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1.5 rounded-full",
        "text-xs font-medium",
        "bg-accent/50 transition-colors",
        clickable ? "hover:bg-accent cursor-pointer" : "hover:bg-accent",
        className
      )}
    >
      {name}
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/devlog/tags/${encodeURIComponent(name)}`}>
        {tagContent}
      </Link>
    );
  }

  return tagContent;
}
