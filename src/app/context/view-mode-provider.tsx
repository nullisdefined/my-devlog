"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ViewMode = "masonry" | "card" | "list";

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(
  undefined
);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");

  // 로컬 스토리지에서 초기값 로드
  useEffect(() => {
    const saved = localStorage.getItem("viewMode") as ViewMode;
    if (
      saved &&
      (saved === "card" || saved === "list" || saved === "masonry")
    ) {
      setViewMode(saved);
    }
  }, []);

  // 뷰 모드 변경 시 로컬 스토리지에 저장
  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("viewMode", mode);
  };

  const toggleViewMode = () => {
    const modes: ViewMode[] = ["masonry", "card", "list"];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    handleSetViewMode(modes[nextIndex]);
  };

  return (
    <ViewModeContext.Provider
      value={{
        viewMode,
        setViewMode: handleSetViewMode,
        toggleViewMode,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
