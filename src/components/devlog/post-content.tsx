"use client";

import { useEffect } from "react";

export function PostContent({ content }: { content: string }) {
  useEffect(() => {
    const buttons = document.querySelectorAll(".copy-button");

    const handleCopy = async (button: Element) => {
      const pre = button.parentElement;
      const code = pre?.querySelector("code");
      const svg = button.querySelector("svg");

      if (code) {
        await navigator.clipboard.writeText(code.textContent || "");

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
      button.addEventListener("click", () => handleCopy(button));
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", () => handleCopy(button));
      });
    };
  }, [content]);

  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
