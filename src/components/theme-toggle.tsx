// src/components/theme-toggle.tsx
"use client";

import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "@/app/context/theme-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 키보드 단축키 추가
  useEffect(() => {
    if (!mounted) return;

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
  }, [theme, setTheme, mounted]);

  // 마운트되지 않은 경우 스켈레톤 반환
  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 px-0" disabled>
        <div className="h-5 w-5 animate-pulse bg-muted rounded" />
        <span className="sr-only">테마 로딩 중...</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 px-0"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <HiSun className="h-5 w-5" />
      ) : (
        <HiMoon className="h-5 w-5" />
      )}
      <span className="sr-only">테마 전환 (Ctrl + M)</span>
    </Button>
  );
}

export default ThemeToggle;
