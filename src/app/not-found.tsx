"use client";

import { ThemeProvider } from "@/app/context/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/class-name-utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-8">
            페이지를 찾을 수 없습니다.
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}
