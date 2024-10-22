"use client";

import { useEffect, useRef } from "react";
import { CopyButton } from "./copy-button";
import { createRoot } from "react-dom/client";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const preElements = containerRef.current.querySelectorAll("pre");
    preElements.forEach((pre) => {
      const code = pre.getAttribute("data-code");
      if (code) {
        const wrapper = document.createElement("div");
        wrapper.className = "relative group";
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const buttonContainer = document.createElement("div");
        buttonContainer.className =
          "opacity-0 group-hover:opacity-100 transition-opacity";
        buttonContainer.style.position = "absolute";
        buttonContainer.style.top = "0.5rem";
        buttonContainer.style.right = "0.5rem";
        wrapper.appendChild(buttonContainer);

        const root = createRoot(buttonContainer);
        root.render(<CopyButton text={code} />);
      }
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
