"use client";

import { useTheme } from "@/app/context/theme-provider";
import { useEffect, useRef } from "react";

export function Comments() {
  const { theme } = useTheme();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "nullisdefined/next-devlog");
    script.setAttribute("data-repo-id", "R_kgDONC5Xiw");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDONC5Xi84CjmQ-");
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", window.location.pathname);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute(
      "data-theme",
      theme === "dark" ? "noborder_dark" : "light_tritanopia"
    );
    script.setAttribute("data-lang", "ko");
    script.crossOrigin = "anonymous";
    script.async = true;

    const comments = elementRef.current;
    if (comments) {
      comments.innerHTML = "";
      comments.appendChild(script);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [theme]);

  return (
    <section className="mt-16 mr-1 pr-1">
      <hr className="border-t border-gray-200 dark:border-gray-700 mb-8 mx-auto" />
      <div ref={elementRef} className="w-11/12 mx-auto" />
    </section>
  );
}
