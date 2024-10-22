// src/components/devlog/post-content.tsx
"use client";

import { useEffect } from "react";

export function PostContent({ content }: { content: string }) {
  useEffect(() => {
    const buttons = document.querySelectorAll(".copy-code-button");
    buttons.forEach((button) => {
      const pre = button.parentElement;
      const code = pre?.querySelector("code");

      button.addEventListener("click", async () => {
        if (code) {
          await navigator.clipboard.writeText(code.textContent || "");

          // 복사 성공 표시
          const svg = button.querySelector("svg");
          if (svg) {
            const originalPath = svg.innerHTML;
            svg.innerHTML =
              '<path d="M20 6L9 17l-5-5" stroke="currentColor" fill="none" stroke-width="2"/>';

            setTimeout(() => {
              svg.innerHTML = originalPath;
            }, 2000);
          }
        }
      });
    });
  }, []);

  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
