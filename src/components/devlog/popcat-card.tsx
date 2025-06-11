"use client";

import Image from "next/image";
import { useState } from "react";

interface PopcatCardProps {
  variant: 1 | 2;
}

export function PopcatCard({ variant }: PopcatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="break-inside-avoid mb-4 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/10 dark:to-yellow-900/10 rounded-xl p-6 border border-orange-100/30 dark:border-orange-800/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] aspect-square flex flex-col justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative flex justify-center items-center">
            <Image
              src={isHovered ? `/pop1.png` : `/pop2.png`}
              alt={`Popcat ${variant}`}
              width={120}
              height={120}
              className="pixelated transition-all duration-200"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
