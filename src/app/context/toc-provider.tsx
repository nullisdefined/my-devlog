"use client";

import { TableOfContentsItem } from "@/types";
import { createContext, useContext, ReactNode, useState } from "react";

interface TocContextType {
  toc: TableOfContentsItem[] | null;
  setToc: (toc: TableOfContentsItem[] | null) => void;
}

const TocContext = createContext<TocContextType>({
  toc: null,
  setToc: () => {},
});

export function TocProvider({ children }: { children: ReactNode }) {
  const [toc, setToc] = useState<TableOfContentsItem[] | null>(null);

  return (
    <TocContext.Provider value={{ toc, setToc }}>
      {children}
    </TocContext.Provider>
  );
}

export function useToc() {
  return useContext(TocContext);
}
