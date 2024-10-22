// src/components/devlog/post-content.tsx
"use client";

import { useEffect } from "react";

export function PostContent({ content }: { content: string }) {
  useEffect(() => {
    const buttons = document.querySelectorAll(".copy-button");
    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const code = (button as HTMLElement).dataset.code;
        if (code) {
          await navigator.clipboard.writeText(code);
          const originalIcon = button.innerHTML;
          button.innerHTML = `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          setTimeout(() => {
            button.innerHTML = originalIcon;
          }, 2000);
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
