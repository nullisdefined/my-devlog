"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setScale(1);

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.stopPropagation();
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
      document.addEventListener("keydown", handleKeyDown, true);
      document.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="이미지 확대"
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        // 직접 배경을 클릭했을 때만 닫기
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* 상단 컨트롤 바 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        {/* 줌 레벨 표시 */}
        <div className="px-3 py-1 bg-white/10 rounded-lg text-white text-sm font-medium pointer-events-none">
          {Math.round(scale * 100)}%
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          aria-label="모달 닫기"
        >
          <X className="w-6 h-6" />
        </button>
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
        <div className="pointer-events-none flex items-center justify-center w-full h-full">
          <img
            src={src}
            alt={alt}
            className="pointer-events-auto transition-transform duration-200 ease-out select-none"
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
    </div>,
    document.body,
  );
}
