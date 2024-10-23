// src/components/theme-toggle.tsx
"use client";

import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "@/app/context/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 px-0"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <HiSun className="h-4 w-4" />
      ) : (
        <HiMoon className="h-4 w-4" />
      )}
      <span className="sr-only">테마 전환</span>
    </Button>
  );
}

export default ThemeToggle;
