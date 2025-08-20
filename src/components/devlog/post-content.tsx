"use client";

import { useEffect, useState, useCallback } from "react";
import { Quote } from "lucide-react";
import { ImageModal } from "./image-modal";
import { DiagramModal } from "./diagram-modal";

interface PostContentProps {
  content: string;
}

// 복사 버튼과 토글 버튼 기능
function setupCodeBlockButtons(
  onDiagramClick: (content: string) => void,
  onToggleView: (element: Element, view: 'code' | 'diagram') => void
) {
  const copyButtons = document.querySelectorAll(".copy-button");
  const toggleButtons = document.querySelectorAll(".toggle-diagram-button");
  const expandButtons = document.querySelectorAll(".mermaid-container button[aria-label='다이어그램 확대']");
  const codeButtons = document.querySelectorAll(".mermaid-container button[aria-label='코드로 보기']");

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

  const handleToggleClick = (button: Element) => {
    const view = button.getAttribute("data-view") as 'code' | 'diagram';
    onToggleView(button, view);
  };

  const handleExpandClick = (button: Element) => {
    const container = button.parentElement;
    if (container && container.hasAttribute("data-mermaid-code")) {
      const mermaidContent = container.getAttribute("data-mermaid-code") || "";
      onDiagramClick(mermaidContent);
    }
  };

  copyButtons.forEach((button) => {
    // 중복 이벤트 리스너 방지
    if (!button.hasAttribute("data-copy-initialized")) {
      button.addEventListener("click", () => handleCopy(button));
      button.setAttribute("data-copy-initialized", "true");
    }
  });

  toggleButtons.forEach((button) => {
    // 중복 이벤트 리스너 방지
    if (!button.hasAttribute("data-toggle-initialized")) {
      button.addEventListener("click", () => handleToggleClick(button));
      button.setAttribute("data-toggle-initialized", "true");
    }
  });

  expandButtons.forEach((button) => {
    // 중복 이벤트 리스너 방지
    if (!button.hasAttribute("data-expand-initialized")) {
      button.addEventListener("click", () => handleExpandClick(button));
      button.setAttribute("data-expand-initialized", "true");
    }
  });

  codeButtons.forEach((button) => {
    // 중복 이벤트 리스너 방지
    if (!button.hasAttribute("data-code-initialized")) {
      button.addEventListener("click", () => handleToggleClick(button));
      button.setAttribute("data-code-initialized", "true");
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
  
  const [modalDiagram, setModalDiagram] = useState<{
    content: string;
  } | null>(null);
  
  // 다이어그램 상태 추적 (기본값: 다이어그램 보기)
  const [shouldShowAsDiagram, setShouldShowAsDiagram] = useState(true);

  // 이미지 클릭 핸들러를 useCallback으로 메모이제이션
  const handleImageClick = useCallback((src: string, alt: string) => {
    setModalImage({ src, alt });
  }, []);

  // 다이어그램 클릭 핸들러
  const handleDiagramClick = useCallback((content: string) => {
    setModalDiagram({ content });
  }, []);

  // 뷰 토글 핸들러
  const handleToggleView = useCallback(async (button: Element, view: 'code' | 'diagram') => {
    const container = button.closest('[data-language="mermaid"], .mermaid-container');
    if (!container) return;

    if (view === 'diagram') {
      // 코드 -> 다이어그램으로 전환
      const code = container.querySelector('code');
      const mermaidCode = code?.textContent || '';
      await convertToMermaidDiagram(container as HTMLElement, mermaidCode);
      setShouldShowAsDiagram(true);
    } else {
      // 다이어그램 -> 코드로 전환
      const mermaidCode = container.getAttribute('data-mermaid-code') || '';
      convertToCodeBlock(container as HTMLElement, mermaidCode);
      setShouldShowAsDiagram(false);
    }
  }, []);

  // 코드 -> 다이어그램 변환 함수
  const convertToMermaidDiagram = useCallback(async (container: HTMLElement, mermaidCode: string) => {
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

      const id = `mermaid-toggle-${Date.now()}`;
      const { svg } = await mermaid.render(id, mermaidCode);

      // 새 다이어그램 컨테이너 생성
      const newContainer = document.createElement("div");
      newContainer.className = "mermaid-container my-6 relative group";
      newContainer.style.minHeight = "200px";
      newContainer.setAttribute("data-mermaid-code", mermaidCode);

      // 코드로 보기 버튼 생성
      const codeButton = document.createElement("button");
      codeButton.className = 
        "absolute top-2 right-14 p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-gray-500/30 hover:bg-gray-500/50 transition-all duration-200 z-10";
      codeButton.setAttribute("aria-label", "코드로 보기");
      codeButton.setAttribute("data-view", "code");
      codeButton.style.width = "40px";
      codeButton.style.height = "40px";
      codeButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-white mx-auto">
          <polyline points="16,18 22,12 16,6"></polyline>
          <polyline points="8,6 2,12 8,18"></polyline>
        </svg>
      `;

      // 확대 버튼 생성
      const expandButton = document.createElement("button");
      expandButton.className = 
        "absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-blue-500/30 hover:bg-blue-500/50 transition-all duration-200 z-10";
      expandButton.setAttribute("aria-label", "다이어그램 확대");
      expandButton.style.width = "40px";
      expandButton.style.height = "40px";
      expandButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-white mx-auto">
          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
        </svg>
      `;

      // 다이어그램 컨테이너
      const diagramWrapper = document.createElement("div");
      diagramWrapper.className = "flex justify-center overflow-x-auto";
      diagramWrapper.innerHTML = svg;

      newContainer.appendChild(codeButton);
      newContainer.appendChild(expandButton);
      newContainer.appendChild(diagramWrapper);

      // 기존 요소를 새 컨테이너로 교체
      container.parentNode?.replaceChild(newContainer, container);

      // 버튼 이벤트 재설정
      setTimeout(() => {
        setupCodeBlockButtons(handleDiagramClick, handleToggleView);
      }, 100);
    } catch (error) {
      console.error("Mermaid rendering error:", error);
    }
  }, [handleDiagramClick, handleToggleView]);

  // 다이어그램 -> 코드 변환 함수
  const convertToCodeBlock = useCallback((container: HTMLElement, mermaidCode: string) => {
    // 새 코드 블록 생성
    const pre = document.createElement("pre");
    pre.className = "relative group rounded-lg overflow-hidden border-l-4 border-l-blue-500 my-6";
    pre.setAttribute("data-language", "mermaid");

    const code = document.createElement("code");
    code.className = "language-mermaid";
    code.textContent = mermaidCode;

    // 복사 버튼 생성
    const copyButton = document.createElement("button");
    copyButton.className = 
      "copy-button absolute right-2 top-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-black/30 hover:bg-black/50 transition-all duration-200";
    copyButton.setAttribute("aria-label", "코드 복사");
    copyButton.style.width = "40px";
    copyButton.style.height = "40px";
    copyButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mx-auto" data-copy-icon="true">
        <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.912 4.895 3 6 3h8c1.105 0 2 .912 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.088 19.105 22 18 22h-8c-1.105 0-2-.912-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"></path>
      </svg>
    `;

    // 다이어그램으로 보기 버튼 생성
    const toggleButton = document.createElement("button");
    toggleButton.className = 
      "toggle-diagram-button absolute right-14 top-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-blue-500/30 hover:bg-blue-500/50 transition-all duration-200";
    toggleButton.setAttribute("aria-label", "다이어그램으로 보기");
    toggleButton.setAttribute("data-view", "diagram");
    toggleButton.style.width = "40px";
    toggleButton.style.height = "40px";
    toggleButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mx-auto">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="7.5,8 12,5 16.5,8"></polyline>
        <polyline points="7.5,16 12,19 16.5,16"></polyline>
        <polyline points="12,12 12,5"></polyline>
      </svg>
    `;

    pre.appendChild(code);
    pre.appendChild(copyButton);
    pre.appendChild(toggleButton);

    // 기존 요소를 새 코드 블록으로 교체
    container.parentNode?.replaceChild(pre, container);

    // 버튼 이벤트 재설정
    setTimeout(() => {
      setupCodeBlockButtons(handleDiagramClick, handleToggleView);
    }, 100);
  }, [handleDiagramClick, handleToggleView]);

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

  // Mermaid 초기화만 담당하는 함수 (자동 렌더링 비활성화)
  const initializeMermaid = useCallback(async () => {
    try {
      const mermaid = (await import("mermaid")).default;
      
      // 다크모드 감지
      const isDarkMode = document.documentElement.classList.contains("dark");
      
      // Mermaid 초기화 (자동 렌더링 비활성화)
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
    } catch (error) {
      console.error("Failed to initialize mermaid:", error);
    }
  }, []);

  // Mermaid 초기화 및 기본 다이어그램 렌더링을 위한 useEffect
  useEffect(() => {
    const timer = setTimeout(async () => {
      await initializeMermaid();
      
      // 기본적으로 다이어그램 보기로 설정
      if (shouldShowAsDiagram) {
        const mermaidCodeBlocks = document.querySelectorAll('[data-language="mermaid"]');
        for (const block of mermaidCodeBlocks) {
          const code = block.querySelector('code');
          const mermaidCode = code?.textContent || '';
          if (mermaidCode) {
            await convertToMermaidDiagram(block as HTMLElement, mermaidCode);
          }
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [content, initializeMermaid, shouldShowAsDiagram, convertToMermaidDiagram]);

  // 다크모드 변경 감지 (테마 변경시 Mermaid 재초기화)
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
          // 테마 변경시 Mermaid 재초기화 및 다이어그램 재렌더링
          setTimeout(async () => {
            await initializeMermaid();
            
            // 현재 다이어그램 상태라면 다시 렌더링
            if (shouldShowAsDiagram) {
              const mermaidCodeBlocks = document.querySelectorAll('[data-language="mermaid"]');
              const mermaidContainers = document.querySelectorAll('.mermaid-container');
              
              // 기존 다이어그램 컨테이너들을 다시 렌더링
              for (const container of mermaidContainers) {
                const mermaidCode = container.getAttribute('data-mermaid-code');
                if (mermaidCode) {
                  await convertToMermaidDiagram(container as HTMLElement, mermaidCode);
                }
              }
              
              // 코드 블록들도 다이어그램으로 변환
              for (const block of mermaidCodeBlocks) {
                const code = block.querySelector('code');
                const mermaidCode = code?.textContent || '';
                if (mermaidCode) {
                  await convertToMermaidDiagram(block as HTMLElement, mermaidCode);
                }
              }
            }
          }, 200);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [initializeMermaid, shouldShowAsDiagram, convertToMermaidDiagram]);

  // 초기 콘텐츠 로드시에만 실행되는 useEffect (content 변경시에만)
  useEffect(() => {
    const timer = setTimeout(() => {
      setupCodeBlockButtons(handleDiagramClick, handleToggleView);
      alignImageCaptions();
      // addQuoteIcons(); // 마무리 부분 Quote 아이콘 제거
      applyImageStyles();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [content, applyImageStyles, handleDiagramClick, handleToggleView]);

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

  // 다이어그램 모달이 닫힐 때 상태에 따라 올바른 뷰 유지
  useEffect(() => {
    if (!modalDiagram) {
      // 다이어그램 모달이 닫혔을 때
      const timer = setTimeout(async () => {
        if (shouldShowAsDiagram) {
          // 다이어그램 상태여야 하는 경우
          const mermaidCodeBlocks = document.querySelectorAll('[data-language="mermaid"]');
          for (const block of mermaidCodeBlocks) {
            const code = block.querySelector('code');
            const mermaidCode = code?.textContent || '';
            if (mermaidCode) {
              await convertToMermaidDiagram(block as HTMLElement, mermaidCode);
            }
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [modalDiagram, shouldShowAsDiagram, convertToMermaidDiagram]);

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
      <DiagramModal
        content={modalDiagram?.content || ""}
        isOpen={!!modalDiagram}
        onClose={() => setModalDiagram(null)}
      />
    </>
  );
}
