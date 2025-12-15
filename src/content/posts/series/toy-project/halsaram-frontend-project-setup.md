---
title: "[할사람] 프론트엔드 프로젝트 설정"
slug: "halsaram-frontend-project-setup"
date: 2025-08-21
tags: ["ToyProject", "Halsaram", "KOSA", "React", "PWA", "Vite"]
category: "Series/Toy-Project"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/41cd02897e1a3b4209771a683de6c404.png"
draft: true
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/41cd02897e1a3b4209771a683de6c404.png)

## 프론트엔드 기술스택 선정
할사람 프로젝트를 시작하면서 가장 먼저 고민했던 것은 플랫폼 선택이었다. 미션 기반 모임 플랫폼이라는 서비스 특성상 사용자들이 야외에서 모바일로 자주 접속할 것으로 예상했고, 네이티브 앱 수준의 사용자 경험이 필요했다.

하지만 현실적인 제약이 있었는데, 팀원 중 Swift나 Kotlin을 다룰 수 있는 사람이 없었고, 프론트엔드 개발을 혼자 담당하게 되면서 3주라는 제한된 기간 내에 React Native나 Flutter 같은 새로운 프레임워크를 학습하기 어려웠다.

그래서 "React로 어떻게 네이티브 앱과 유사한 사용자 경험을 제공할 수 있을까?"라는 질문에서 PWA(Progressive Web App)를 선택하게 되었다.

## PWA로 구현 가능한 주요 기능들
PWA를 통해 우리 서비스에 필요한 네이티브 앱 수준의 기능들을 구현할 수 있었다.

### 모바일 하드웨어 접근
- **카메라 접근**: 미션 인증 사진 촬영, QR 코드 체크인
- **위치 권한**: GPS 기반 지역 인증
- **갤러리 업로드**: 이미지 선택 및 업로드

### 사용자 경험 향상
- **홈 화면 추가**: 네이티브 앱처럼 설치하여 홈에서 쉽게 접근
- **푸시 알림**: 실시간 알림
- **오프라인 지원**: 네트워크가 불안정한 환경에서도 기본 UI 제공

앱스토어 배포 없이도 사용자들이 쉽게 접근할 수 있다는 점도 MVP 단계에서는 큰 장점이었다.

## 개발 환경 구성

### 빌드 도구: Vite
Create React App 대신 Vite를 선택한 가장 큰 이유는 PWA 플러그인 지원이 잘 되어 있기 때문이었다. `vite-plugin-pwa`로 손쉽게 PWA 설정을 할 수 있었고, 개발 서버 속도도 훨씬 빨라서 개발 경험이 크게 향상되었다.

### 상태 관리: Zustand  
Redux나 Recoil 대신 Zustand를 선택했다. 프로젝트 규모가 크지 않고 3주라는 짧은 기간에 러닝커브를 최소화하고 싶었기 때문이다. 실제로 보일러플레이트 코드 없이도 깔끔하게 전역 상태를 관리할 수 있었다.

### 스타일링: Styled Components
CSS-in-JS 방식에 익숙했고, 컴포넌트별 스타일 격리가 필요했다. 전체적인 레이아웃은 반응형으로 설계했지만, 데스크톱에서 접속 시 빈 공간이 생기는 문제는 브랜딩 요소로 채우는 방식으로 해결했다.

## 프로젝트 구조 설계
기능별 구조(feature-based)를 선택했다.

```
src/
├── app/              # 전역 앱 설정
├── features/         # 기능별 모듈
├── shared/           # 공통 요소
├── data/             # mock 데이터
├── types/            # 타입 정의
└── assets/           # 정적 파일
```

규모가 커질수록 가독성과 유지보수성을 고려했을 때, 컴포넌트·훅·스타일로 나누는 레이어 기반 구조보다는 기능별로 구분하는 방식이 더 적합하다고 판단했다.

## PWA 설정 과정

### Vite PWA 플러그인 설정
**`vite.config.ts`에서 PWA 관련 설정을 추가했다**:

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: '할사람',
        short_name: '할사람',
        description: '지역 기반 번개모임 커뮤니티',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          // ... 다양한 사이즈의 아이콘들
        ]
      }
    })
  ]
})
```

### HTML 메타 태그 최적화
**PWA가 제대로 동작하려면 HTML의 메타 태그 설정이 중요하다. 특히 iOS Safari 지원을 위해 다음과 같은 설정들을 추가했다**:

```html
<!-- iOS Safari PWA 지원 -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-touch-fullscreen" content="yes" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

`apple-mobile-web-app-capable` 설정을 통해 iOS에서 홈 화면에 추가했을 때 Safari UI 없이 전체화면으로 실행되도록 했다. `apple-touch-fullscreen`은 전체화면 모드를 지원하고, 전용 아이콘도 설정했다.

### 뷰포트 설정으로 모바일 최적화
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

모바일 우선 서비스이기 때문에 사용자가 확대/축소할 수 없도록 `user-scalable=no`를 설정했다. 이렇게 하면 더 네이티브 앱에 가까운 경험을 제공할 수 있다.

### 외부 리소스 최적화
Pretendard 폰트와 Kakao SDK 등 외부 리소스들의 로딩 성능을 위해 프리커넥션을 설정했다.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
```

특히 한글 폰트는 용량이 크기 때문에 가변 폰트인 Pretendard Variable을 사용해서 로딩 시간을 단축했다.

## 서비스 워커 커스터마이징
초기에는 Vite PWA 플러그인의 기본 워크박스 전략을 사용했지만, 배포 후 캐싱 문제가 발생했다. HTML 파일이 캐시되어 새로운 배포가 반영되지 않는 문제였다.

결국 커스텀 서비스 워커를 작성해서 다음과 같은 캐싱 전략을 적용했다.

```javascript
// HTML 파일: NetworkFirst - 항상 최신 버전 우선 시도
if (req.mode === "navigate" || req.destination === "document") {
  event.respondWith(
    networkFirst(req, { cacheName: CACHE_PAGES, timeoutSeconds: 3 })
  );
}

// JS/CSS: StaleWhileRevalidate - 빠른 로딩과 백그라운드 업데이트
if (req.destination === "script" || req.destination === "style") {
  event.respondWith(staleWhileRevalidate(req, { cacheName: CACHE_STATIC }));
}

// 이미지: CacheFirst - 불필요한 네트워크 요청 방지
if (req.destination === "image") {
  event.respondWith(cacheFirst(req, { cacheName: CACHE_IMAGES }));
}
```

이렇게 리소스 타입별로 다른 캐싱 전략을 적용해서 성능과 최신성을 모두 확보할 수 있었다.


> [!NOTE] 이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/NIPA-AWS-Developer-2nd/client)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.