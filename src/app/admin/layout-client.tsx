"use client";

import { ThemeProvider, useTheme } from "@/app/context/theme-provider";
import { Sun, Moon, Laptop, MessageSquare, Eye, LogOut } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
      >
        {theme === "dark" ? (
          <Moon className="w-5 h-5" />
        ) : theme === "light" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Laptop className="w-5 h-5" />
        )}
        <span className="hidden sm:inline text-sm font-medium">
          {theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-popover border border-border rounded-lg shadow-lg z-50">
          <button
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-muted transition-colors text-left"
            onClick={() => {
              setTheme("light");
              setOpen(false);
            }}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
          <button
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-muted transition-colors text-left"
            onClick={() => {
              setTheme("dark");
              setOpen(false);
            }}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
          <button
            className="flex items-center gap-2 w-full px-4 py-2 hover:bg-muted transition-colors text-left"
            onClick={() => {
              setTheme("system");
              setOpen(false);
            }}
          >
            <Laptop className="w-4 h-4" /> System
          </button>
        </div>
      )}
    </div>
  );
}

function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-red-500 hover:text-red-600 transition-colors"
      onClick={() => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("admin_authenticated");
        }
        router.push("/admin/login");
      }}
      aria-label="Logout"
    >
      <LogOut className="w-5 h-5" />
      <span className="hidden sm:inline text-sm font-medium">Logout</span>
    </button>
  );
}

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4">
              <Link
                href="/admin/chat"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 border",
                  pathname === "/admin/chat"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow"
                    : "bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-800 hover:text-emerald-900 dark:hover:text-white"
                )}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </Link>
              <Link
                href="/admin/views"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 border",
                  pathname === "/admin/views"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow"
                    : "bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-800 hover:text-emerald-900 dark:hover:text-white"
                )}
              >
                <Eye className="w-4 h-4" />
                <span>Views</span>
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </div>
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
