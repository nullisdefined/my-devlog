"use client";

import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface CategoryIconProps {
  icon: LucideIcon | IconType;
  className?: string;
}

export function CategoryIcon({ icon: Icon, className }: CategoryIconProps) {
  return <Icon className={className} />;
}
