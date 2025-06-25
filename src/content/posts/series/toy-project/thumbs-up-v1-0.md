---
title: "[Thumbs Up] v1.0 - 썸네일 제작 도구"
slug: "thumbs-up-v1-0"
date: 2024-11-02
tags: ["React", "TypeScript", "TailwindCSS", "ToyProject"]
category: "Series/Toy-Project"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/96853286d6745f087ef00bf2d48b8a3d.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/96853286d6745f087ef00bf2d48b8a3d.png)

블로그에 사용할 1:1 비율의 썸네일 제작 도구가 필요해 개발하게 된 프로젝트

---
## 주요 기능
### 다양한 레이아웃 지원
1:1, 4:3, 16:9 비율의 레이아웃을 제공한다.

### 스타일 커스터마이징
#### 배경
- 그라디언트, 단색, 이미지 배경 지원
- 셔플 버튼을 통해 랜덤 그라디언트 생성
- 이미지 배경 선택 시 크롭 기능과 블러 효과 강도 조절

#### 타이포그래피
- 무료 상업용 한글 폰트 지원 (Gmarket Sans, 나눔스퀘어 네오, Pretendard)
- 제목과 부제목에 대한 세부 조정
    - 텍스트 크기, 굵기, 이탤릭, 그림자 효과
    - 좌/중앙/우 정렬

### 사용자 경험 최적화
- 썸네일 미리보기
- 이미지 다운로드 및 클립보드 복사
- 반응형 인터페이스

---
## 기술 스택
### 코어 스택
- React
- TypeScript
- TailwindCSS
- Vite

### 주요 라이브러리
- Radix UI
- react-image-crop
- gh-pages

---
## 배포
Github Pages를 통해 배포했으며, 다음과 같은 이유로 선택했다.
- 무료 호스팅
- 간편한 배포 프로세스
- CI/CD 파이프라인 구축 용이
- HTTPS 지원

배포된 프로젝트는 [Thumbs Up](https://nullisdefined.github.io/thumbs-up/)에서 확인할 수 있다.

---
## 향후 개선 사항

### 기능 개선
- favicon 추가
- 이미지 재크롭 기능
- 폰트 기본값 설정

### 성능 최적화
- 미리보기 크기 최적화

### UX 개선
- 모바일 슬라이더 조작성 개선
- 이미지 배경 선택 시 미리보기 UI 개선
---
이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/thumbs-up)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.