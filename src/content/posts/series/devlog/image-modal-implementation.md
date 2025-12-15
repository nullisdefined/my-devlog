---
title: "게시글 페이지에 이미지 모달 구현하기"
slug: "image-modal-implementation"
date: 2025-06-25
tags: ["Devlog", "TypeScript", "DOM"]
category: "Series/devlog"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bda02db8a3f14f2637f18a86373e7397.png"
draft: false
views: 0
---
마크다운에서 `<img src="s3_url" alt="image" width="300" />` 형태로 이미지 너비를 조정할 수 있지만, 세로로 긴 이미지들은 의도보다 크게 표시되는 문제가 있었다.

그래서 일단 모든 이미지를 축소해서 자연스럽게 보이도록 조정했는데, 캡처 스크린샷 같은 이미지들이 너무 작아서 글씨가 잘 보이지 않는 문제가 생겼다. 이 문제를 해결하기 위해 이미지를 클릭하면 확대해서 볼 수 있는 모달 기능을 구현하게 되었다.

## 문제 상황

### 기존 이미지 표시 방식
마크다운에서 S3에 업로드한 이미지를 표시할 때 다음과 같은 문제들이 있었다.

- **일관성 없는 크기**: 너비만 조정하다 보니 세로로 긴 이미지는 비정상적으로 크게 표시됨

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bda02db8a3f14f2637f18a86373e7397.png" alt="image" width="600" />*세로로 긴 이미지가 들어갔을 때 크게 표시됨 예시*

- **가독성 문제**: 축소된 캡처 이미지에서 텍스트나 세부 내용을 확인하기 어려움
- **사용자 경험**: 이미지 내용을 제대로 보려면 별도로 이미지 링크를 열어야 하는 번거로움

이런 문제들 때문에 전반적인 가독성이 떨어지고 있었다.

## 해결책: 이미지 확대 모달 구현

### 요구사항 정의
- 포스팅 글의 이미지를 클릭했을 때 확대해서 보여주는 기능
- 확대/축소 → 마우스 스크롤
- 글에서는 이미지 왼쪽 정렬, 확대시에는 중앙 표시
- 확대시 헤더 숨김 (z-index 조정)

### 구현 과정

#### 컴포넌트 구조
```
PostContent (부모)
├── ImageModal (자식)
└── 이벤트 위임을 통한 이미지 클릭 처리
```

Next.js와 TypeScript를 기반으로 하되, 안정적인 이벤트 처리를 위해 이벤트 위임 패턴을 적용했다.

**📌 이벤트 위임이란?**
- 상위 요소에 하나의 이벤트 핸들러를 등록하고, 이벤트가 버블링되는 걸 이용해 특정 자식 요소에서 발생한 이벤트를 처리하는 방식

### 1. ImageModal 컴포넌트
가장 중요한 모달 컴포넌트부터 구현했다. 

```typescript
"use client";

import { useEffect, useState } from "react";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setScale(1);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isOpen) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((prev) => Math.max(0.5, Math.min(prev + delta, 3)));
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* 줌 레벨 표시 */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="px-3 py-1 bg-white/10 rounded-lg text-white text-sm font-medium">
          {Math.round(scale * 100)}%
        </div>
      </div>

      {/* 이미지 컨테이너 - 중앙 배치 */}
      <div 
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={src}
            alt={alt}
            className="transition-transform duration-200 ease-out select-none"
            style={{
              transform: `scale(${scale})`,
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
            draggable={false}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

### 2. 이벤트 위임 패턴
가장 중요한 부분으로, 처음에는 각 이미지에 직접 클릭 이벤트를 등록했는데, 모달을 닫은 후 재클릭이 안 되는 문제가 발생했다.

```typescript
// 이벤트 위임을 사용한 이미지 클릭 처리
useEffect(() => {
  const postContentElement = document.querySelector('.post-content');
  if (!postContentElement) return;

  const handleClick = (e: Event) => {
    const target = e.target as HTMLElement;

    // 클릭된 요소가 이미지이고 prose 안에 있는지 확인
    if (target.tagName === 'IMG' && target.closest('.prose')) {
      const img = target as HTMLImageElement;
      handleImageClick(img.src, img.alt || "이미지");
    }
  };

  // 이벤트 위임으로 클릭 처리
  postContentElement.addEventListener('click', handleClick);

  // 이미지 스타일 적용
  const images = document.querySelectorAll('.prose img');
  images.forEach((img) => {
    const imageElement = img as HTMLImageElement;

    // 스타일 적용
    imageElement.style.cursor = "zoom-in";
    imageElement.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";

    // 호버 효과
    const handleMouseEnter = () => {
      imageElement.style.transform = "scale(1.02)";
      imageElement.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
    };

    const handleMouseLeave = () => {
      imageElement.style.transform = "scale(1)";
      imageElement.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
    };

    imageElement.addEventListener("mouseenter", handleMouseEnter);
    imageElement.addEventListener("mouseleave", handleMouseLeave);
  });

  return () => {
    postContentElement.removeEventListener('click', handleClick);
  };
}, [content, handleImageClick]);
```

이벤트 위임 패턴을 사용함으로써 DOM이 재구성되어도 안정적으로 이벤트를 처리할 수 있게 되었다.

### 3. 스타일링 조정
기본 이미지 스타일도 함께 개선했다.

```css
.prose img {
  @apply rounded-lg shadow-sm my-4;
  max-width: 65%;
  height: auto;
  margin-left: 0;           /* 왼쪽 정렬을 위해 0으로 설정 */
  margin-right: auto;
  display: block;
  transition: filter 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  cursor: zoom-in;          /* 클릭 가능함을 나타내는 커서 */
}
```

## 개발 중 마주한 주요 이슈들

### 1. 재클릭 문제
**문제**: ESC로 모달을 닫은 후 이미지를 다시 클릭해도 모달이 열리지 않음

**원인**: 개별 이미지에 직접 연결된 이벤트 리스너가 모달 상태 변화에 따라 정상적으로 작동하지 않음

**해결**: 이벤트 위임 패턴을 도입하여 부모 요소에서 이벤트를 처리하도록 변경

### 2. 중앙 정렬 문제
**문제**: 확대된 이미지가 완전히 중앙에 배치되지 않고 왼쪽으로 치우쳐 보임

**해결**: 이중 Flexbox 컨테이너와 CSS margin을 동시에 활용해 중앙 정렬

```typescript
<div className="absolute inset-0 flex items-center justify-center p-4">
  <div className="flex items-center justify-center w-full h-full">
    <img style={{ margin: "0 auto" }} />
  </div>
</div>
```

### 3. Z-Index 겹침 문제
**문제**: 확대 모달이 헤더나 다른 UI 요소 아래에 표시됨

**해결**: z-index를 9999로 설정하여 최상위 레이어에 배치

### 4. 이미지 확대 후 스타일 깨짐
**문제**: 이미지 확대 후 모달을 닫으면 호버 효과와 캡션 위치가 망가지는 문제가 발생

**원인**: useEffect의 dependency에 content가 포함되어 있어서, 모달이 닫힐 때마다 전체 useEffect가 다시 실행되어 DOM이 재구성되면서 기존에 적용된 스타일과 이벤트 리스너가 초기화됨

**해결**: useEffect를 기능별로 분리하고 모달 닫히면 스타일을 재적용

## 마치며
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/47b3c193b9c1e92ea79db558ca0d5c98.gif)*구현된 이미지 모달*

블로그 이미지 표시 문제를 해결하기 위해 시작한 작업이었지만, 결과적으로는 사용자 경험을 크게 개선하는 기능이 되었다. 덕분에 이벤트 위임 패턴의 중요성과 React에서의 DOM 이벤트 처리 방법에 대해 학습할 수 있었다.

이제 캡처 스크린샷 같은 이미지들을 작게 표시해도 클릭 한 번으로 크게 확대해서 볼 수 있게 되었다. 블로그의 가독성과 사용자 경험이 한층 향상된 것 같아 만족스럽다.