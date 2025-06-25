"use client";

import { useEffect, useState, useCallback } from "react";
import { Quote } from "lucide-react";
import { ImageModal } from "./image-modal";

interface PostContentProps {
  content: string;
}

// 복사 버튼 기능만 유지
function setupCopyButtons() {
  const buttons = document.querySelectorAll(".copy-button");

  const handleCopy = async (button: Element) => {
    const pre = button.parentElement;
    const code = pre?.querySelector("code");
    const svg = button.querySelector("svg");

    if (code) {
      // 텍스트만 추출하여 복사 (HTML 태그 제외)
      const textContent = code.textContent || "";
      await navigator.clipboard.writeText(textContent);

      // 복사 성공 표시
      if (svg) {
        svg.innerHTML =
          '<path d="M20 6L9 17l-5-5" stroke="currentColor" fill="none" stroke-width="2"/>';

        setTimeout(() => {
          svg.innerHTML =
            '<path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.912 4.895 3 6 3h8c1.105 0 2 .912 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.088 19.105 22 18 22h-8c-1.105 0-2-.912-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"/>';
        }, 2000);
      }
    }
  };

  buttons.forEach((button) => {
    // 중복 이벤트 리스너 방지
    if (!button.hasAttribute("data-copy-initialized")) {
      button.addEventListener("click", () => handleCopy(button));
      button.setAttribute("data-copy-initialized", "true");
    }
  });
}

// 이미지와 캡션 정렬 기능
function alignImageCaptions() {
  const images = document.querySelectorAll(".prose img");

  images.forEach((img) => {
    const imageElement = img as HTMLImageElement;
    const caption = imageElement.nextElementSibling;

    // 다음 형제가 em 요소(캡션)인지 확인
    if (caption && caption.tagName === "EM") {
      const captionElement = caption as HTMLElement;

      // 이미지가 로드된 후 너비 계산
      const updateCaptionWidth = () => {
        const imageWidth = imageElement.offsetWidth;
        captionElement.style.setProperty("--image-width", `${imageWidth}px`);
        captionElement.style.width = `${imageWidth}px`;
      };

      // 이미지가 이미 로드된 경우
      if (imageElement.complete) {
        updateCaptionWidth();
      } else {
        // 이미지 로드 완료 시 실행
        imageElement.addEventListener("load", updateCaptionWidth);
      }

      // 리사이즈 시에도 업데이트
      window.addEventListener("resize", updateCaptionWidth);
    }
  });
}

// Quote 아이콘 추가 기능
function addQuoteIcons() {
  const lastParagraphs = document.querySelectorAll(
    ".prose p:last-child, .post-content p:last-child, .prose > div:last-child p:last-child"
  );

  lastParagraphs.forEach((paragraph) => {
    const p = paragraph as HTMLElement;

    // 이미 아이콘이 추가되었는지 확인
    if (p.querySelector(".quote-icon")) return;

    // Quote 아이콘 생성
    const iconContainer = document.createElement("div");
    iconContainer.className = "quote-icon";
    iconContainer.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
      </svg>
    `;

    // 스타일 적용 - 에메랄드 그린 테마
    iconContainer.style.cssText = `
      position: absolute;
      top: 1rem;
      left: 0.75rem;
      background: #059669;
      color: white;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
      z-index: 1;
    `;

    // 다크모드 확인
    if (document.documentElement.classList.contains("dark")) {
      iconContainer.style.background = "#34d399";
      iconContainer.style.boxShadow = "0 2px 4px rgba(52, 211, 153, 0.3)";
    }

    p.appendChild(iconContainer);
  });
}

export function PostContent({ content }: PostContentProps) {
  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  // 이미지 클릭 핸들러를 useCallback으로 메모이제이션
  const handleImageClick = useCallback((src: string, alt: string) => {
    setModalImage({ src, alt });
  }, []);

  // 이미지 스타일과 호버 효과를 적용하는 함수
  const applyImageStyles = useCallback(() => {
    const images = document.querySelectorAll(".prose img");

    images.forEach((img) => {
      const imageElement = img as HTMLImageElement;

      // 이미 스타일이 적용되었는지 확인
      if (imageElement.hasAttribute("data-styled")) return;

      // 스타일 적용
      imageElement.style.cursor = "zoom-in";
      imageElement.style.transition =
        "transform 0.2s ease, box-shadow 0.2s ease";

      // 호버 효과 함수들
      const handleMouseEnter = () => {
        imageElement.style.transform = "scale(1.02)";
        imageElement.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
      };

      const handleMouseLeave = () => {
        imageElement.style.transform = "scale(1)";
        imageElement.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
      };

      // 이벤트 리스너 등록
      imageElement.addEventListener("mouseenter", handleMouseEnter);
      imageElement.addEventListener("mouseleave", handleMouseLeave);

      // 스타일 적용 완료 표시
      imageElement.setAttribute("data-styled", "true");

      // cleanup 함수를 이미지 요소에 저장
      (imageElement as any).__hoverCleanup = () => {
        imageElement.removeEventListener("mouseenter", handleMouseEnter);
        imageElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, []);

  // 초기 콘텐츠 로드시에만 실행되는 useEffect (content 변경시에만)
  useEffect(() => {
    const timer = setTimeout(() => {
      setupCopyButtons();
      alignImageCaptions();
      // addQuoteIcons(); // 마무리 부분 Quote 아이콘 제거
      applyImageStyles();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [content, applyImageStyles]);

  // 이벤트 위임을 위한 별도 useEffect (모달 상태 변경에 영향받지 않음)
  useEffect(() => {
    const postContentElement = document.querySelector(".post-content");
    if (!postContentElement) return;

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;

      // 클릭된 요소가 이미지이고 prose 안에 있는지 확인
      if (target.tagName === "IMG" && target.closest(".prose")) {
        const img = target as HTMLImageElement;
        handleImageClick(img.src, img.alt || "이미지");
      }
    };

    // 이벤트 위임으로 클릭 처리
    postContentElement.addEventListener("click", handleClick);

    return () => {
      postContentElement.removeEventListener("click", handleClick);
    };
  }, [handleImageClick]);

  // 모달이 닫힐 때 이미지 스타일을 다시 적용하는 useEffect
  useEffect(() => {
    if (!modalImage) {
      // 모달이 닫혔을 때 약간의 지연 후 스타일 재적용
      const timer = setTimeout(() => {
        applyImageStyles();
        alignImageCaptions();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [modalImage, applyImageStyles]);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="post-content"
      />
      <ImageModal
        src={modalImage?.src || ""}
        alt={modalImage?.alt || ""}
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
      />
    </>
  );
}
