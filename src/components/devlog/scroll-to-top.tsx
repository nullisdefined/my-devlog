"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      className={`
      fixed bottom-[80px] right-4 
      transition-all duration-100 ease-in-out
      ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }
    `}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="p-4 bg-primary/10 hover:bg-primary/20 rounded-full transition-all duration-200 backdrop-blur-sm"
      >
        <ChevronUp className="h-5 w-5" />
        <span className="sr-only">Scroll to top</span>
      </button>
    </div>
  );
}
