"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/class-name-utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="relative group not-prose">
      {filename && (
        <div className="bg-muted/50 px-4 py-2 text-sm border-b rounded-t-lg font-mono text-muted-foreground">
          {filename}
        </div>
      )}
      <pre
        className={cn(
          "relative overflow-hidden",
          language && `language-${language}`,
          filename ? "rounded-t-none" : "rounded-t-lg",
          "rounded-b-lg"
        )}
        data-language={language || "plaintext"}
      >
        <code className={cn("block", language && `language-${language}`)}>
          {lines.map((line, i) => (
            <span key={i} className="line">
              {line}
            </span>
          ))}
        </code>
        <button
          onClick={copyCode}
          className={cn(
            "absolute right-2 top-2 p-2 rounded-lg",
            "opacity-0 group-hover:opacity-100",
            "bg-primary/10 hover:bg-primary/20",
            "transition-all duration-200"
          )}
          aria-label="Copy code"
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
