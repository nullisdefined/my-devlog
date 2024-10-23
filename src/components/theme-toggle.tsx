// src/components/theme-toggle.tsx
"use client";

import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "@/app/context/theme-provider";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // 키보드 단축키 추가
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "m") {
        event.preventDefault(); // 기본 동작 방지
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [theme, setTheme]);

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
      <span className="sr-only">테마 전환 (Ctrl + M)</span>
    </Button>
  );
}

export default ThemeToggle;
