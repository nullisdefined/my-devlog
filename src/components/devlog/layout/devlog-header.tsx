"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useHeaderStore } from "@/store/header-store";

export function DevlogHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { isForceHidden, setForceHidden } = useHeaderStore();

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setForceHidden(false);
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }

      if (currentScrollY === 0) {
        setForceHidden(false);
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY, setForceHidden]);

  return (
    <header
      className={`
        fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
        transition-transform duration-300
        ${isVisible && !isForceHidden ? "translate-y-0" : "-translate-y-full"}
      `}
      onMouseEnter={() => !isForceHidden && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/devlog" className="flex items-center space-x-2">
            <span className="font-bold">Devlog</span>
          </Link>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
