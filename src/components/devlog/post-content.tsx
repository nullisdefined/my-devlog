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

  // Mermaid 차트 렌더링 함수
  const renderMermaidDiagrams = useCallback(async () => {
    // 기존 mermaid 컨테이너들을 찾아서 원래 코드 블록으로 복원
    const existingContainers = document.querySelectorAll(".mermaid-container");
    existingContainers.forEach((container) => {
      const mermaidCode = container.getAttribute("data-mermaid-code");
      if (mermaidCode) {
        const pre = document.createElement("pre");
        pre.setAttribute("data-language", "mermaid");
        const code = document.createElement("code");
        code.className = "language-mermaid";
        code.textContent = mermaidCode;
        pre.appendChild(code);
        container.parentNode?.replaceChild(pre, container);
      }
    });

    const mermaidBlocks = document.querySelectorAll(
      'pre[data-language="mermaid"] code, pre code.language-mermaid'
    );

    if (mermaidBlocks.length === 0) return;

    try {
      const mermaid = (await import("mermaid")).default;

      // 다크모드 감지
      const isDarkMode = document.documentElement.classList.contains("dark");
      // console.log('Current theme mode:', isDarkMode ? 'dark' : 'light');

      // Mermaid 초기화
      mermaid.initialize({
        startOnLoad: false,
        theme: isDarkMode ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "inherit",
        fontSize: 14,
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

      for (let index = 0; index < mermaidBlocks.length; index++) {
        const block = mermaidBlocks[index];
        const code = block as HTMLElement;
        const mermaidCode = code.textContent || "";
        const id = `mermaid-diagram-${index}-${Date.now()}`;

        console.log(
          "Found mermaid block:",
          mermaidCode.substring(0, 50) + "..."
        );

        // 기존 pre 요소를 div로 교체
        const pre = code.parentElement;
        if (pre && pre.parentNode) {
          const container = document.createElement("div");
          container.className =
            "mermaid-container my-6 flex justify-center overflow-x-auto";
          container.style.minHeight = "200px";
          container.setAttribute("data-mermaid-code", mermaidCode); // 원본 코드 저장

          try {
            // Mermaid 다이어그램 렌더링
            const { svg } = await mermaid.render(id, mermaidCode);
            container.innerHTML = svg;
            console.log(`Successfully rendered diagram ${index}`);
          } catch (error) {
            console.error("Mermaid rendering error:", error);
            container.innerHTML = `<pre style="color: red; background: #fef2f2; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444;">Mermaid 렌더링 오류: ${error}</pre>`;
          }

          pre.parentNode.replaceChild(container, pre);
        }
      }

      console.log("Processed", mermaidBlocks.length, "mermaid diagrams");
    } catch (error) {
      console.error("Failed to load mermaid:", error);
    }
  }, []);

  // Mermaid 차트 처리를 위한 useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      renderMermaidDiagrams();
    }, 100);

    return () => clearTimeout(timer);
  }, [content, renderMermaidDiagrams]);

  // 다크모드 변경 감지 및 Mermaid 다이어그램 재렌더링
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          console.log(
            "Theme change detected, current classes:",
            document.documentElement.className
          );
          // 다크모드가 변경되었을 때 Mermaid 다이어그램을 다시 렌더링
          setTimeout(() => {
            console.log("Re-rendering mermaid diagrams for theme change");
            renderMermaidDiagrams();
          }, 200);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [renderMermaidDiagrams]);

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
