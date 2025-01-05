"use client";

import * as LucideIcons from "lucide-react";
import * as SiIcons from "react-icons/si";

interface IconMapperProps {
  name: string;
  className?: string;
}

export function IconMapper({ name, className }: IconMapperProps) {
  // @ts-expect-error - Dynamic icon import from lucide-react/react-icons
  const LucideIcon = LucideIcons[name];
  // @ts-expect-error - Dynamic icon import from lucide-react/react-icons
  const SiIcon = SiIcons[name];

  if (LucideIcon) {
    return <LucideIcon className={className} />;
  }

  if (SiIcon) {
    return <SiIcon className={className} />;
  }

  return null;
}
