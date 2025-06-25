"use client";

import { useEffect, useState } from "react";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setScale(1);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      setScale((prev) => Math.max(0.5, Math.min(prev + delta, 3)));
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        // 직접 배경을 클릭했을 때만 닫기
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

      {/* 이미지 컨테이너 - 완전한 중앙 배치 */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => {
          // 이미지 컨테이너 클릭 시에도 닫기
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={src}
            alt={alt}
            className="transition-transform duration-200 ease-out select-none"
            style={{
              transform: `scale(${scale})`,
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
            draggable={false}
            onClick={(e) => {
              // 이미지 자체 클릭은 이벤트 전파 방지
              e.stopPropagation();
            }}
          />
        </div>
      </div>
    </div>
  );
}
