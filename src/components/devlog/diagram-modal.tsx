"use client";

import { useEffect, useState } from "react";

interface DiagramModalProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DiagramModal({ content, isOpen, onClose }: DiagramModalProps) {
  const [scale, setScale] = useState(1);
  const [diagramSvg, setDiagramSvg] = useState<string>("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      renderDiagram();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, content]);

  const renderDiagram = async () => {
    if (!content.trim()) return;

    try {
      const mermaid = (await import("mermaid")).default;
      
      // 다크모드 감지
      const isDarkMode = document.documentElement.classList.contains("dark");
      
      // Mermaid 초기화
      mermaid.initialize({
        startOnLoad: false,
        theme: isDarkMode ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "inherit",
        fontSize: 16,
        themeVariables: isDarkMode
          ? {
              background: "#1f2937",
              primaryColor: "#3b82f6",
              primaryTextColor: "#f9fafb",
              primaryBorderColor: "#6b7280",
              lineColor: "#9ca3af",
              sectionBkgColor: "#374151",
              altSectionBkgColor: "#4b5563",
              gridColor: "#6b7280",
              secondaryColor: "#10b981",
              tertiaryColor: "#f59e0b",
            }
          : {
              background: "#ffffff",
              primaryColor: "#3b82f6",
              primaryTextColor: "#1f2937",
              primaryBorderColor: "#e5e7eb",
              lineColor: "#6b7280",
              sectionBkgColor: "#f9fafb",
              altSectionBkgColor: "#f3f4f6",
              gridColor: "#e5e7eb",
              secondaryColor: "#10b981",
              tertiaryColor: "#f59e0b",
            },
      });

      const id = `diagram-modal-${Date.now()}`;
      const { svg } = await mermaid.render(id, content);
      setDiagramSvg(svg);
    } catch (error) {
      console.error("Diagram rendering error:", error);
      setDiagramSvg(`<div style="color: red; padding: 2rem; text-align: center;">다이어그램 렌더링 오류: ${error}</div>`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isOpen) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(0.3, Math.min(prev + delta, 5)));
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!isOpen) return;
      if (e.target !== e.currentTarget && !(e.target as Element).closest('.diagram-draggable')) return;
      
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isOpen || !isDragging) return;
      
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("wheel", handleWheel, { passive: false });
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isOpen, onClose, isDragging, position, dragStart]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* 줌 레벨 표시 */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="px-3 py-1 bg-white/10 rounded-lg text-white text-sm font-medium">
          {Math.round(scale * 100)}%
        </div>
      </div>


      {/* 다이어그램 컨테이너 */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div 
          className="flex items-center justify-center w-full h-full"
          style={{ overflow: scale > 1 ? 'visible' : 'hidden' }}
        >
          <div
            className={`diagram-draggable transition-transform duration-200 ease-out select-none bg-white/5 rounded-lg p-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              maxWidth: scale <= 1 ? '90vw' : 'none',
              maxHeight: scale <= 1 ? '90vh' : 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              if (scale > 1) {
                setIsDragging(true);
                setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
              }
            }}
            dangerouslySetInnerHTML={{ __html: diagramSvg }}
          />
        </div>
      </div>
    </div>
  );
}