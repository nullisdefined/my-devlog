import { getTagConfig } from "@/config/tags";

interface TagProps {
  name: string;
  className?: string;
}

export function Tag({ name, className = "" }: TagProps) {
  const config = getTagConfig(name);
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full transition-colors ${config.light} ${config.dark} ${className}`}
    >
      {name}
    </span>
  );
}
