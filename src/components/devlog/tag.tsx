import { cn } from "@/lib/class-name-utils";

interface TagProps {
  name: string;
  className?: string;
}

export function Tag({ name, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1.5 rounded-full",
        "text-xs font-medium",
        "bg-accent/50 hover:bg-accent transition-colors",
        className
      )}
    >
      {name}
    </span>
  );
}
