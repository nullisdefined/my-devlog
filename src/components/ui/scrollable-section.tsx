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
      [&::-webkit-scrollbar]:h-2
      [&::-webkit-scrollbar-track]:bg-muted
      [&::-webkit-scrollbar-thumb]:bg-primary/20
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:border-2
      [&::-webkit-scrollbar-thumb]:border-transparent
      [&::-webkit-scrollbar-thumb]:bg-clip-padding
      hover:[&::-webkit-scrollbar-thumb]:bg-primary/40
      motion-safe:scroll-smooth
      ${className}
    `}
  >
    {children}
  </div>
);

export default ScrollableSection;
