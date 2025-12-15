---
title: "뷰 모드 기능 개발"
slug: "view-mode-system"
date: 2025-06-20
tags: ["Devlog", "View"]
category: "Series/devlog"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/262c71177408734aa602608d7ec58a71.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/262c71177408734aa602608d7ec58a71.png" alt="image" width="600" />

블로그를 운영하다 보니 게시글 목록이 점점 늘어나면서 한 가지 아쉬운 점이 생겼다. 모든 글이 똑같은 형태로만 보여서 조금 단조롭다는 느낌이 들었다. 특히 썸네일이 있는 글과 없는 글이 섞여 있을 때, 시각적으로 균형이 맞지 않아 보였다.

그래서 Pinterest나 Medium 같은 사이트들을 둘러보면서 영감을 얻었다. 자신의 취향에 맞게 뷰 모드를 선택할 수 있으면 어떨까? 하는 생각이 들었고, 이를 구현해보기로 했다.

## 기존 방식의 한계
처음 블로그를 만들 때는 단순하게 접근했다. 반응형 그리드를 만들어서 화면 크기에 따라 열 개수만 조절하는 방식이었다.

```tsx
// 기존 방식: 고정된 그리드 레이아웃
export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
```

이 방식은 구현이 간단하고 안정적이었지만, 몇 가지 아쉬운 점들이 있었다.

첫째, **썸네일이 없는 글들이 허전해 보였다.** 텍스트만 있는 카드는 이미지가 있는 카드에 비해 시각적 무게감이 떨어져서 전체적인 레이아웃이 불균형해 보였다.

둘째, **긴 제목이나 설명이 잘리는 문제가 있었다.** 모든 카드의 높이를 맞추다 보니 내용이 긴 글은 `...`으로 잘려서 표시되었고, 이는 좋은 사용자 경험이 아니었다.

셋째, **스크롤이 단조로웠다.** 모든 카드가 같은 높이로 정렬되어 있어서 스크롤할 때 변화가 없고 지루한 느낌을 주었다.

## 3가지 뷰 모드 설계
이런 문제들을 해결하기 위해 사용자가 선택할 수 있는 3가지 뷰 모드를 설계했다.

### 1. Masonry View (벽돌 레이아웃)
Pinterest에서 영감을 받은 이 레이아웃은 **각 카드의 높이가 콘텐츠에 맞게 동적으로 조절**된다. 이미지가 많은 포스트는 크게, 텍스트만 있는 포스트는 작게 표시되어 자연스러운 흐름을 만든다.

이 방식의 가장 큰 장점은 **공간 효율성**이다. 빈 공간이 최소화되고, 다양한 크기의 카드들이 조화롭게 배치된다. 또한 스크롤할 때 시각적으로 흥미로운 패턴이 만들어져 지루하지 않다.

### 2. Card View (카드 레이아웃)
전통적인 그리드 레이아웃으로, **모든 카드가 동일한 크기**를 갖는다. 이는 예측 가능하고 정돈된 느낌을 주어서 정보를 체계적으로 탐색하고 싶은 사용자에게 적합하다.

썸네일과 텍스트의 비율이 일정해서 **일관된 시각적 경험**을 제공하고, 특히 썸네일이 중요한 콘텐츠(포트폴리오, 갤러리 등)에 적합하다.

### 3. List View (목록 레이아웃)
가장 **정보 밀도가 높은** 레이아웃이다. 한 줄에 하나의 포스트만 표시되지만, 그만큼 더 많은 정보를 한 화면에 담을 수 있다.

빠르게 스캔하면서 원하는 글을 찾아야 하는 사용자나, 모바일 환경에서 효율적으로 브라우징하고 싶은 사용자에게 최적화되어 있다.

## 구현 과정

### Context API로 전역 상태 관리
먼저 뷰 모드를 전역적으로 관리하기 위해 Context API를 사용했다. 사용자가 선택한 뷰 모드는 `localStorage`에 저장되어 다음 방문 시에도 유지된다.

```tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ViewMode = "masonry" | "card" | "list";

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");

  // localStorage에서 사용자 선호도 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("viewMode") as ViewMode;
      if (saved && ["masonry", "card", "list"].includes(saved)) {
        setViewMode(saved);
      }
    }
  }, []);

  // 뷰 모드 변경 시 localStorage에 저장
  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("viewMode", mode);
    }
  };

  return (
    <ViewModeContext.Provider 
      value={{ viewMode, setViewMode: handleSetViewMode }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}
```

이렇게 하면 사용자가 선택한 뷰 모드가 페이지를 새로고침하거나 다시 방문해도 유지된다. 작은 디테일이지만, 사용자 경험을 크게 향상시키는 요소다.

### 직관적인 토글 버튼 디자인
사용자가 쉽게 뷰 모드를 전환할 수 있도록 직관적인 토글 버튼을 만들었다. 각 모드를 나타내는 아이콘과 레이블을 함께 표시해서 기능을 명확히 전달했다.

```tsx
export default function ViewModeToggle() {
  const { viewMode, setViewMode } = useViewMode();

  const modes = [
    {
      key: "masonry" as const,
      icon: LayoutGrid,
      label: "Masonry",
      description: "벽돌 레이아웃"
    },
    {
      key: "card" as const,
      icon: Grid3X3,
      label: "Card",
      description: "카드 레이아웃"
    },
    {
      key: "list" as const,
      icon: List,
      label: "List",
      description: "목록 레이아웃"
    }
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = viewMode === mode.key;

        return (
          <Button
            key={mode.key}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode(mode.key)}
            className={`h-8 px-3 ${
              isActive 
                ? "bg-background shadow-sm" 
                : "hover:bg-background/50"
            }`}
            title={mode.description}
          >
            <Icon className="w-4 h-4" />
            <span className="ml-1.5 text-xs font-medium">
              {mode.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
```

### Masonry 레이아웃의 구현 고민
Masonry 레이아웃을 구현하는 방법은 여러 가지가 있다. 처음에는 CSS Grid의 `masonry` 속성을 사용하려 했지만, 아직 브라우저 지원이 제한적이어서 다른 방법을 찾아야 했다.

결국 **컬럼 기반 접근법**을 선택했다. 포스트를 여러 컬럼에 순차적으로 배치하는 방식으로, 각 컬럼은 독립적인 flex 컨테이너가 된다.

```tsx
export default function MasonryLayout({ posts }: MasonryLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(3);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // 포스트를 컬럼별로 분배
  const distributePostsToColumns = () => {
    const columnArrays: Post[][] = Array.from({ length: columns }, () => []);

    posts.forEach((post, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push(post);
    });

    return columnArrays;
  };

  const columnArrays = distributePostsToColumns();

  return (
    <div 
      ref={containerRef}
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}
    >
      {columnArrays.map((columnPosts, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-6">
          {columnPosts.map((post) => (
            <PostCard 
              key={post.slug} 
              post={post} 
              variant="masonry"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

이 방식의 장점은 **구현이 단순하고 성능이 좋다**는 것이다. 복잡한 높이 계산이나 DOM 조작 없이 CSS의 flexbox만으로 자연스러운 masonry 효과를 얻을 수 있다.

### 뷰 모드별 PostCard 최적화
각 뷰 모드에 맞게 PostCard 컴포넌트도 다르게 스타일링했다. 같은 데이터를 표시하지만, 레이아웃과 정보의 우선순위가 달라진다.

```tsx
export default function PostCard({ post, variant }: PostCardProps) {
  const baseClasses = "group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md";

  const variantClasses = {
    masonry: "flex flex-col",
    card: "flex flex-col h-full",
    list: "flex flex-row items-center gap-4 p-4"
  };

  const imageClasses = {
    masonry: "aspect-auto w-full object-cover",
    card: "aspect-[16/9] w-full object-cover",
    list: "w-20 h-20 object-cover rounded-md flex-shrink-0"
  };

  return (
    <Link href={`/devlog/posts/${post.slug}`}>
      <article className={`${baseClasses} ${variantClasses[variant]}`}>
        {/* 뷰 모드에 따라 다른 레이아웃 적용 */}
      </article>
    </Link>
  );
}
```

**Masonry 모드**에서는 이미지의 원본 비율을 유지하고, **Card 모드**에서는 일관된 16:9 비율을 적용했다. **List 모드**에서는 작은 정사각형 썸네일만 표시해서 공간을 절약했다.

## 성능 최적화 전략

### 이미지 레이지 로딩
많은 포스트를 표시할 때 모든 이미지를 한 번에 로드하면 성능 문제가 발생할 수 있다. Next.js의 Image 컴포넌트를 활용해 레이지 로딩을 적용했다.

```tsx
<Image
  src={post.thumbnail}
  alt={post.title}
  width={400}
  height={200}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  className={imageClasses[variant]}
/>
```

`placeholder="blur"`와 함께 base64로 인코딩된 작은 이미지를 제공하면, 실제 이미지가 로드되기 전에 블러 처리된 프리뷰를 보여줄 수 있다. 이는 **레이아웃 시프트를 방지**하고 더 나은 사용자 경험을 제공한다.

### React.memo로 불필요한 리렌더링 방지
뷰 모드가 변경될 때 모든 PostCard가 리렌더링되는 것을 방지하기 위해 `React.memo`를 활용했다.

```tsx
const PostCard = React.memo(({ post, variant }: PostCardProps) => {
  // 컴포넌트 로직
}, (prevProps, nextProps) => {
  return prevProps.post.slug === nextProps.post.slug && 
         prevProps.variant === nextProps.variant;
});
```

포스트 내용과 뷰 모드가 변경되지 않았다면 컴포넌트를 리렌더링하지 않는다. 이는 특히 포스트가 많을 때 성능 향상에 큰 도움이 된다.

### List View의 가상화
목록 뷰에서 수백 개의 포스트를 표시해야 한다면, 모든 항목을 DOM에 렌더링하는 것은 비효율적이다. `react-window`를 사용해 **가상 스크롤링**을 구현했다.

```tsx
import { FixedSizeList as List } from "react-window";

export default function VirtualizedList({ posts, height }: VirtualizedListProps) {
  const ITEM_HEIGHT = 120;

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <PostCard post={posts[index]} variant="list" />
    </div>
  );

  return (
    <List
      height={height}
      itemCount={posts.length}
      itemSize={ITEM_HEIGHT}
      className="scrollbar-thin"
    >
      {Row}
    </List>
  );
}
```

화면에 보이는 항목만 렌더링하고, 스크롤에 따라 동적으로 추가/제거한다. 이렇게 하면 수천 개의 포스트도 부드럽게 스크롤할 수 있다.

## 사용자 경험 개선 디테일

### 부드러운 전환 애니메이션
뷰 모드를 변경할 때 갑작스러운 레이아웃 변화는 사용자를 당황하게 할 수 있다. CSS 트랜지션을 추가해 부드러운 전환 효과를 구현했다.

```tsx
.view-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.masonry-enter {
  opacity: 0;
  transform: translateY(20px);
}

.masonry-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-out;
}
```

`cubic-bezier` 함수를 사용해 자연스러운 가속/감속 효과를 만들었다. 작은 디테일이지만, 전체적인 완성도를 높이는 중요한 요소다.

### 로딩 상태 표시
데이터를 불러오는 동안 빈 화면을 보여주는 것보다는 **스켈레톤 UI**를 표시하는 것이 좋다. 각 뷰 모드에 맞는 스켈레톤을 만들었다.

```tsx
export default function PostSkeleton({ variant }: PostSkeletonProps) {
  if (variant === "list") {
    return (
      <div className="flex gap-4 p-4 border rounded-lg">
        <div className="w-20 h-20 bg-muted rounded-md animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className={`bg-muted animate-pulse ${
        variant === "card" ? "aspect-[16/9]" : "h-48"
      }`} />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
      </div>
    </div>
  );
}
```

`animate-pulse` 클래스로 미묘한 깜빡임 효과를 추가해 로딩 중임을 명확히 표시했다.

## 마주했던 문제들과 해결 과정

### Masonry 레이아웃의 아이템 순서 문제
처음에는 단순히 컬럼별로 순차 배치했더니, 최신 포스트가 여러 컬럼에 분산되어 시간 순서를 파악하기 어려웠다.

이를 해결하기 위해 **가장 높이가 낮은 컬럼에 다음 아이템을 배치**하는 알고리즘으로 변경하려 했지만, 이는 각 카드의 높이를 미리 계산해야 해서 복잡도가 높아졌다.

결국 현재의 단순한 방식을 유지하되, 사용자가 정렬 옵션(최신순, 인기순 등)을 선택할 수 있도록 하는 것이 더 나은 해결책이라고 판단했다.

### 상태 동기화 문제
여러 페이지 간에 뷰 모드가 일관되게 유지되지 않는 문제가 있었다. 예를 들어, 메인 페이지에서 List 모드를 선택했는데 카테고리 페이지로 이동하면 다시 기본 모드로 돌아가는 식이었다.

Context API를 도입하고 `localStorage`와 연동함으로써 이 문제를 해결했다. 이제 사용자의 선호도가 전체 사이트에서 일관되게 유지된다.

### SEO 고려사항
클라이언트 사이드에서만 뷰 모드를 변경하면 SEO에 영향을 줄 수 있다. 검색 엔진 봇은 JavaScript를 실행하지 않을 수도 있기 때문이다.

이를 해결하기 위해 **서버 사이드에서는 항상 기본 레이아웃(Card View)을 렌더링**하도록 했다. 그리고 클라이언트에서 hydration된 후에 사용자의 선호도에 따라 뷰 모드를 변경한다.

```tsx
// 서버 컴포넌트에서는 기본 레이아웃 사용
export default function ServerPostList({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} variant="card" />
      ))}
    </div>
  );
}
```


> [!NOTE] 이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/mydevlog)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.