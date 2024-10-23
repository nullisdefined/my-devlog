import { ReactNode } from "react";

interface ScrollableSectionProps {
  children: ReactNode;
  className?: string;
}

export const ScrollableSection = ({
  children,
  className = "",
}: ScrollableSectionProps) => (
  <div
    className={`
      overflow-x-auto
      [&::-webkit-scrollbar]:h-2.5
      [&::-webkit-scrollbar-track]:bg-muted/50
      [&::-webkit-scrollbar-thumb]:bg-black/20
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:border
      [&::-webkit-scrollbar-thumb]:border-transparent
      [&::-webkit-scrollbar-thumb]:bg-clip-padding
      hover:[&::-webkit-scrollbar-thumb]:bg-black/30
      dark:[&::-webkit-scrollbar-thumb]:bg-white/50
      dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/60
      motion-safe:scroll-smooth
      ${className}
    `}
  >
    {children}
  </div>
);

export default ScrollableSection;
