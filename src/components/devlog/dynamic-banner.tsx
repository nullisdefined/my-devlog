"use client";

import { useEffect, useState, useRef } from "react";

interface DynamicBannerProps {
  thumbnail: string;
}

// 색상 추출 및 그라디언트 생성 함수
function extractColorsAndCreateGradient(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    // 브라우저 환경이 아닌 경우 기본값 반환
    if (typeof window === "undefined") {
      resolve(
        "linear-gradient(135deg, #059669 0%, #10b981 35%, #34d399 70%, #6ee7b7 100%)"
      );
      return;
    }

    // CORS 프록시 시도 목록
    const corsProxies = [
      "", // 원본 URL 먼저 시도
      "https://api.allorigins.win/raw?url=",
      "https://corsproxy.io/?",
      "https://cors-anywhere.herokuapp.com/",
    ];

    let currentProxyIndex = 0;

    const tryLoadImage = () => {
      const img = new window.Image();

      // CORS 설정
      img.crossOrigin = "anonymous";

      // 타임아웃 설정 (각 프록시당 2초)
      const timeout = setTimeout(() => {
        // console.log(`이미지 로딩 타임아웃 (프록시 ${currentProxyIndex})`);
        tryNextProxy();
      }, 2000);

      const tryNextProxy = () => {
        clearTimeout(timeout);
        currentProxyIndex++;

        if (currentProxyIndex < corsProxies.length) {
          // console.log(
          //   `다음 프록시 시도 (${currentProxyIndex}/${corsProxies.length - 1})`
          // );
          tryLoadImage();
        } else {
          // console.log("모든 프록시 시도 실패 - 기본 그라디언트 사용");
          resolve(
            "linear-gradient(135deg, #059669 0%, #10b981 35%, #34d399 70%, #6ee7b7 100%)"
          );
        }
      };

      img.onload = () => {
        clearTimeout(timeout);
        // console.log("이미지 로드 성공:", img.width, "x", img.height);

        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d", { willReadFrequently: true });

          if (!ctx) {
            // console.log("Canvas context 생성 실패");
            tryNextProxy();
            return;
          }

          // 이미지 크기 최적화
          const targetSize = 80; // 더 작게 설정
          const scale = Math.min(
            targetSize / img.width,
            targetSize / img.height
          );
          canvas.width = Math.max(40, Math.floor(img.width * scale));
          canvas.height = Math.max(40, Math.floor(img.height * scale));

          // 이미지 그리기
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // console.log("Canvas 크기:", canvas.width, "x", canvas.height);

          // 이미지 데이터 추출
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // 색상 히스토그램 생성
          const colorMap = new Map<string, number>();

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const alpha = data[i + 3];

            // 투명한 픽셀 무시
            if (alpha < 128) continue;

            // 너무 어둡거나 밝은 색상 필터링
            const brightness = (r + g + b) / 3;
            if (brightness < 40 || brightness > 220) continue;

            // 색상을 20단위로 반올림하여 비슷한 색상들을 그룹화
            const rRounded = Math.round(r / 20) * 20;
            const gRounded = Math.round(g / 20) * 20;
            const bRounded = Math.round(b / 20) * 20;

            const colorKey = `${rRounded},${gRounded},${bRounded}`;
            colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
          }

          // console.log("추출된 색상 개수:", colorMap.size);

          if (colorMap.size === 0) {
            // console.log("유효한 색상이 없음");
            tryNextProxy();
            return;
          }

          // 가장 많이 나타나는 색상들 찾기
          const sortedColors = Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

          // console.log("상위 색상들:", sortedColors);

          // 주요 색상 선택
          let dominantColor: number[] | null = null;

          for (const [colorStr] of sortedColors) {
            const [r, g, b] = colorStr.split(",").map(Number);

            // 채도 계산
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;

            // 적절한 채도를 가진 첫 번째 색상 선택
            if (saturation > 0.1) {
              dominantColor = [r, g, b];
              break;
            }
          }

          // 채도가 있는 색상을 찾지 못했다면, 가장 빈도가 높은 색상 사용
          if (!dominantColor && sortedColors.length > 0) {
            const [colorStr] = sortedColors[0];
            dominantColor = colorStr.split(",").map(Number);
          }

          if (!dominantColor) {
            // console.log("주요 색상 추출 실패");
            tryNextProxy();
            return;
          }

          // console.log("선택된 주요 색상:", dominantColor);

          // HSL 변환
          const hsl = rgbToHsl(
            dominantColor[0],
            dominantColor[1],
            dominantColor[2]
          );
          // console.log("HSL 값:", hsl);

          // 조화로운 색상 팔레트 생성
          const palette = generateImprovedPalette(hsl);
          // console.log("생성된 팔레트:", palette);

          // 그라디언트 생성
          const gradient = `linear-gradient(135deg, 
            rgb(${palette.color1.join(",")}) 0%, 
            rgb(${palette.color2.join(",")}) 35%, 
            rgb(${palette.color3.join(",")}) 70%, 
            rgb(${palette.color4.join(",")}) 100%)`;

          // console.log("생성된 그라디언트:", gradient);
          resolve(gradient);
        } catch (error) {
          // console.error("색상 추출 중 오류:", error);
          tryNextProxy();
        }
      };

      img.onerror = (error) => {
        clearTimeout(timeout);
        // console.error(`이미지 로드 실패 (프록시 ${currentProxyIndex}):`, error);
        tryNextProxy();
      };

      // 프록시 URL 생성
      const currentProxy = corsProxies[currentProxyIndex];
      const imageUrl = currentProxy
        ? currentProxy + encodeURIComponent(imageSrc)
        : imageSrc;

      // console.log(`이미지 로드 시도 (프록시 ${currentProxyIndex}):`, imageUrl);
      img.src = imageUrl;
    };

    // 첫 번째 시도 시작
    tryLoadImage();
  });
}

// 개선된 색상 팔레트 생성
function generateImprovedPalette(hsl: [number, number, number]) {
  const [h, s, l] = hsl;

  // 채도와 명도 조정으로 더 자연스러운 그라디언트 생성
  const baseSaturation = Math.max(0.4, Math.min(0.8, s)); // 채도를 적절한 범위로 제한
  const baseLightness = Math.max(0.3, Math.min(0.7, l)); // 명도를 적절한 범위로 제한

  return {
    color1: hslToRgb(
      h,
      baseSaturation * 0.9,
      Math.min(0.8, baseLightness * 1.3)
    ), // 가장 밝은 색
    color2: hslToRgb(h, baseSaturation, baseLightness), // 기본 색
    color3: hslToRgb(h, baseSaturation * 1.1, baseLightness * 0.8), // 조금 더 진한 색
    color4: hslToRgb(h, baseSaturation * 1.2, baseLightness * 0.6), // 가장 진한 색
  };
}

// RGB to HSL 변환 함수 (수정됨)
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

// HSL to RGB 변환 함수 (수정됨)
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360; // 색조값을 0-360 범위로 정규화
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

  return [
    Math.max(0, Math.min(255, Math.round(r * 255))),
    Math.max(0, Math.min(255, Math.round(g * 255))),
    Math.max(0, Math.min(255, Math.round(b * 255))),
  ];
}

export function DynamicBanner({ thumbnail }: DynamicBannerProps) {
  const [gradientStyle, setGradientStyle] = useState<string>("transparent");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // 색상 캐시 - 같은 이미지 재처리 방지
  const gradientCache = useRef<Map<string, string>>(new Map());
  // 현재 처리 중인 썸네일 추적
  const currentThumbnail = useRef<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && thumbnail) {
      // 같은 썸네일이면 처리하지 않음
      if (currentThumbnail.current === thumbnail) return;

      currentThumbnail.current = thumbnail;

      // 캐시에서 확인
      if (gradientCache.current.has(thumbnail)) {
        const cachedGradient = gradientCache.current.get(thumbnail)!;
        // console.log("캐시된 그라디언트 사용:", thumbnail);
        setGradientStyle(cachedGradient);
        return;
      }

      // console.log("새 썸네일 처리 시작:", thumbnail);
      setIsLoading(true);
      setDebugInfo("Analyzing colors...");

      extractColorsAndCreateGradient(thumbnail)
        .then((gradient) => {
          // 현재 처리 중인 썸네일과 일치하는지 확인 (경쟁 상태 방지)
          if (currentThumbnail.current === thumbnail) {
            // console.log("그라디언트 적용:", gradient);

            // 캐시에 저장
            gradientCache.current.set(thumbnail, gradient);

            setGradientStyle(gradient);
            setDebugInfo("Colors extracted");
          }
        })
        .catch((error) => {
          if (currentThumbnail.current === thumbnail) {
            // console.error("그라디언트 생성 실패:", error);
            const fallbackGradient =
              "linear-gradient(135deg, #059669 0%, #10b981 35%, #34d399 70%, #6ee7b7 100%)";

            gradientCache.current.set(thumbnail, fallbackGradient);
            setGradientStyle(fallbackGradient);
            setDebugInfo("Using default colors");
          }
        })
        .finally(() => {
          if (currentThumbnail.current === thumbnail) {
            setIsLoading(false);
            setTimeout(() => setDebugInfo(""), 1500);
          }
        });
    }
  }, [thumbnail, isMounted]);

  return (
    <div className="relative w-screen h-[24vh] min-h-[180px] max-h-[280px] sm:h-[28vh] sm:min-h-[220px] sm:max-h-[320px] -mx-4 -mt-[40px] sm:-mt-[0px] mb-8 left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
      {/* 메인 배경 레이어 */}
      <div
        className="absolute inset-0 transition-all duration-[2000ms] ease-out"
        style={{
          background: gradientStyle,
          opacity: gradientStyle === "transparent" ? 0 : 1,
        }}
      />

      {/* 로딩 */}
      {isLoading && (
        <div className="absolute inset-0">
          {/* 베이스 스켈레톤 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />

          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent transform -translate-x-full animate-[scan_2s_ease-in-out_infinite]"
              style={{ width: "200%" }}
            />
          </div>

          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(90deg, currentColor 1px, transparent 1px),
                linear-gradient(currentColor 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      )}

      {/* 다크모드에서 배너 어둡게 처리 */}
      <div className="absolute inset-0 bg-black/0 dark:bg-black/20 transition-colors duration-300" />

      {/* 부드러운 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />

      {/* 로딩 인디케이터 */}
      {(isLoading || debugInfo) && (
        <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 dark:border-white/5 transition-all duration-300">
          {isLoading && (
            <div className="relative">
              <div className="w-3 h-3 rounded-full border border-current opacity-20" />
              <div className="absolute inset-0 w-3 h-3 rounded-full border border-transparent border-t-current animate-spin" />
            </div>
          )}
          {debugInfo && (
            <span className="text-slate-700 dark:text-slate-300 text-xs font-medium tracking-wide">
              {debugInfo}
            </span>
          )}
        </div>
      )}

      {/* 스타일 정의 */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(50%);
          }
        }
      `}</style>
    </div>
  );
}
