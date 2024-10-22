// src/components/theme-toggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/context/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 transform-gpu"
    >
      <div className="relative w-5 h-5 transform-gpu">
        <Sun
          className={`absolute transform-gpu transition-all
            ${
              theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
        />
        <Moon
          className={`absolute transform-gpu transition-all
            ${
              theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;
