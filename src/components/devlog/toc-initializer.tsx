"use client";

import { useEffect } from "react";
import { useToc } from "@/app/context/toc-provider";
import { TableOfContentsItem } from "@/types/index";

interface TocInitializerProps {
  toc: TableOfContentsItem[];
}

export function TocInitializer({ toc }: TocInitializerProps) {
  const { setToc } = useToc();

  useEffect(() => {
    setToc(toc);
    return () => setToc(null);
  }, [toc, setToc]);

  return null;
}
