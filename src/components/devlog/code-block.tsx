"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/class-name-utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {filename && (
        <div className="bg-muted px-4 py-2 text-sm border-b">{filename}</div>
      )}
      <pre className={cn("relative", language && `language-${language}`)}>
        <code
          className={cn(
            "block overflow-x-auto p-4",
            language && `language-${language}`
          )}
        >
          {code}
        </code>
        <button
          onClick={copyCode}
          className={cn(
            "absolute right-2 top-2 p-2 rounded-lg",
            "opacity-0 group-hover:opacity-100",
            "bg-primary/10 hover:bg-primary/20",
            "transition-all duration-200"
          )}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </pre>
    </div>
  );
}
