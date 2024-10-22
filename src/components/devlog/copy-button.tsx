// src/components/devlog/copy-button.tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/class-name-utils";
import copy from "copy-to-clipboard";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    copy(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      className={cn(
        "absolute top-2 right-2 p-2 rounded-lg",
        "text-zinc-400 hover:text-zinc-200",
        "bg-zinc-800/50 hover:bg-zinc-800/70",
        "transition-all duration-200"
      )}
      onClick={handleClick}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
