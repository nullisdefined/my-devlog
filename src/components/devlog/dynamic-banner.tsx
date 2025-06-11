"use client";

import { useEffect, useState } from "react";

interface DynamicBannerProps {
  thumbnail: string;
}

// 색상 추출 및 그라디언트 생성 함수 - 개선된 버전
function extractColorsAndCreateGradient(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    // 브라우저 환경이 아닌 경우 기본값 반환
    if (typeof window === "undefined") {
      console.log("서버 환경에서 기본 그라디언트 반환");
      resolve(
        "linear-gradient(135deg, #2d7d5f 0%, #4ade80 30%, #a3e635 70%, #d9f99d 100%)"
      );
      return;
    }

    console.log("🎨 이미지 색상 추출 시작:", imageSrc);

    const img = new window.Image();

    // CORS 설정 및 타임아웃 추가
    img.crossOrigin = "anonymous";

    // 타임아웃 설정 (5초)
    const timeout = setTimeout(() => {
      console.warn("⏰ 이미지 로드 타임아웃 - 기본 그라디언트 사용");
      resolve(
        "linear-gradient(135deg, #2d7d5f 0%, #4ade80 30%, #a3e635 70%, #d9f99d 100%)"
      );
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      console.log("✅ 이미지 로드 완료:", img.width, "x", img.height);

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.warn("❌ Canvas context 생성 실패");
          resolve(
            "linear-gradient(135deg, #2d7d5f 0%, #4ade80 30%, #a3e635 70%, #d9f99d 100%)"
          );
          return;
        }

        // 이미지 크기 최적화 - 성능과 정확도의 균형
        const maxSize = 150;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = Math.max(50, img.width * scale);
        canvas.height = Math.max(50, img.height * scale);

        console.log("📐 Canvas 크기:", canvas.width, "x", canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        console.log("🔍 픽셀 데이터 추출:", data.length / 4, "픽셀");

        // K-means 클러스터링을 위한 색상 샘플링
        const sampleColors: number[][] = [];
        const step = 4; // 매 4번째 픽셀만 샘플링하여 성능 향상

        for (let i = 0; i < data.length; i += 4 * step) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];

          if (alpha < 200) continue; // 투명한 픽셀 제외

          // 색상 필터링 개선
          const brightness = r * 0.299 + g * 0.587 + b * 0.114; // 인간의 시각적 인지도 고려
          const saturation = Math.max(r, g, b) - Math.min(r, g, b);

          // 너무 어둡거나 밝거나 채도가 낮은 색상 제외
          if (brightness < 40 || brightness > 220 || saturation < 25) continue;

          sampleColors.push([r, g, b]);
        }

        console.log("🎯 유효한 색상 샘플:", sampleColors.length);

        if (sampleColors.length < 10) {
          console.warn("⚠️ 색상 샘플 부족 - 기본 그라디언트 사용");
          resolve(
            "linear-gradient(135deg, #2d7d5f 0%, #4ade80 30%, #a3e635 70%, #d9f99d 100%)"
          );
          return;
        }

        // 간단한 K-means 클러스터링으로 주요 색상 찾기
        const dominantColor = findDominantColor(sampleColors);
        console.log("🌈 주요 색상 발견:", dominantColor);

        // HSL 변환 및 그라디언트 생성
        const hsl = rgbToHsl(
          dominantColor[0],
          dominantColor[1],
          dominantColor[2]
        );
        console.log("🎨 HSL 변환:", hsl);

        // 더 자연스럽고 조화로운 색상 팔레트 생성
        const colors = generateHarmoniousColors(hsl);

        const gradient = `linear-gradient(135deg, 
          rgb(${colors.light.join(",")}) 0%, 
          rgb(${colors.base.join(",")}) 30%, 
          rgb(${colors.medium.join(",")}) 60%, 
          rgb(${colors.dark.join(",")}) 100%)`;

        console.log("✨ 최종 그라디언트:", gradient);
        resolve(gradient);
      } catch (error) {
        console.error("💥 색상 추출 중 오류:", error);
        resolve(
          "linear-gradient(135deg, #2d7d5f 0%, #4ade80 30%, #a3e635 70%, #d9f99d 100%)"
        );
      }
    };

    img.onerror = (error) => {
      clearTimeout(timeout);
      console.error("❌ 이미지 로드 실패:", error);
      resolve(
        "linear-gradient(135deg, #2d7d5f 0%, #4ade80 30%, #a3e635 70%, #d9f99d 100%)"
      );
    };

    img.src = imageSrc;
  });
}

// 주요 색상 찾기 (개선된 클러스터링)
function findDominantColor(colors: number[][]): number[] {
  if (colors.length === 0) return [5, 150, 105]; // 기본 에메랄드 색상

  // 색상을 HSL 공간에서 분석하여 더 정확한 클러스터링
  const colorAnalysis: Array<{
    rgb: number[];
    hsl: number[];
    weight: number;
  }> = [];

  colors.forEach((color) => {
    const hsl = rgbToHsl(color[0], color[1], color[2]);
    const saturation = hsl[1];
    const lightness = hsl[2];

    // 채도와 명도를 기반으로 가중치 계산 (더 생생한 색상에 높은 가중치)
    const weight = saturation * 0.7 + (1 - Math.abs(lightness - 0.5) * 2) * 0.3;

    colorAnalysis.push({
      rgb: color,
      hsl: hsl,
      weight: weight,
    });
  });

  // 가중치 기반으로 정렬
  colorAnalysis.sort((a, b) => b.weight - a.weight);

  // 상위 30% 색상들을 대상으로 클러스터링
  const topColors = colorAnalysis.slice(
    0,
    Math.max(5, Math.floor(colorAnalysis.length * 0.3))
  );

  // 색조(Hue) 기반 클러스터링
  const hueGroups: { [key: number]: Array<{ rgb: number[]; weight: number }> } =
    {};

  topColors.forEach(({ rgb, hsl, weight }) => {
    const hueGroup = Math.round(hsl[0] / 30) * 30; // 30도 단위로 그룹화
    if (!hueGroups[hueGroup]) hueGroups[hueGroup] = [];
    hueGroups[hueGroup].push({ rgb, weight });
  });

  // 가장 가중치가 높은 색조 그룹 찾기
  let bestGroup: Array<{ rgb: number[]; weight: number }> = [];
  let maxTotalWeight = 0;

  Object.values(hueGroups).forEach((group) => {
    const totalWeight = group.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight > maxTotalWeight) {
      maxTotalWeight = totalWeight;
      bestGroup = group;
    }
  });

  if (bestGroup.length === 0) {
    return [5, 150, 105]; // 기본 에메랄드 색상
  }

  // 가중 평균으로 최종 색상 계산
  let totalWeight = 0;
  let weightedR = 0,
    weightedG = 0,
    weightedB = 0;

  bestGroup.forEach(({ rgb, weight }) => {
    weightedR += rgb[0] * weight;
    weightedG += rgb[1] * weight;
    weightedB += rgb[2] * weight;
    totalWeight += weight;
  });

  const finalR = Math.round(weightedR / totalWeight);
  const finalG = Math.round(weightedG / totalWeight);
  const finalB = Math.round(weightedB / totalWeight);

  console.log(
    `🎯 최종 주요 색상: RGB(${finalR}, ${finalG}, ${finalB}), 가중치: ${maxTotalWeight.toFixed(
      2
    )}`
  );

  return [finalR, finalG, finalB];
}

// 조화로운 색상 팔레트 생성
function generateHarmoniousColors(hsl: [number, number, number]) {
  const [h, s, l] = hsl;

  return {
    light: hslToRgb(h, Math.max(0.2, s * 0.6), Math.min(0.85, l * 1.4)),
    base: hslToRgb(h, s, l),
    medium: hslToRgb(h, Math.min(1, s * 1.1), Math.max(0.25, l * 0.8)),
    dark: hslToRgb(h, Math.min(1, s * 1.2), Math.max(0.15, l * 0.6)),
  };
}

// RGB to HSL 변환 함수
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s, l];
}

// HSL to RGB 변환 함수
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function DynamicBanner({ thumbnail }: DynamicBannerProps) {
  const [gradientStyle, setGradientStyle] = useState<string>(
    "linear-gradient(135deg, #2d7d5f 0%, #4ade80 30%, #a3e635 70%, #d9f99d 100%)"
  );
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && thumbnail) {
      console.log("🚀 배너 색상 추출 시작 - 썸네일:", thumbnail);
      setIsLoading(true);

      extractColorsAndCreateGradient(thumbnail)
        .then((gradient) => {
          console.log("🎉 배너 그라디언트 적용 완료:", gradient);
          setGradientStyle(gradient);
        })
        .catch((error) => {
          console.error("❌ 배너 색상 추출 실패:", error);
          setGradientStyle(
            "linear-gradient(135deg, #2d7d5f 0%, #4ade80 30%, #a3e635 70%, #d9f99d 100%)"
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [thumbnail, isMounted]);

  return (
    <div className="relative w-screen h-[28vh] min-h-[200px] max-h-[320px] sm:h-[32vh] sm:min-h-[240px] sm:max-h-[360px] -mx-4 -mt-[40px] sm:-mt-[76px] mb-8 left-1/2 right-1/2 -ml-[50vw]">
      <div
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          isLoading ? "opacity-80" : "opacity-100"
        }`}
        style={{ background: gradientStyle }}
      />

      {/* 다크모드에서 배너 어둡게 처리 */}
      <div className="absolute inset-0 bg-black/0 dark:bg-black/40 transition-colors duration-300" />

      {/* 부드러운 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

      {/* 로딩 인디케이터 (선택사항) */}
      {isLoading && (
        <div className="absolute top-4 right-4 opacity-50">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
