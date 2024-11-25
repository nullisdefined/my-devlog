---
title: "Thumbs Up v1.0"
date: 2024-11-02
tags: ["토이프로젝트"]
category: "Series/thumbs-up"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/83851ab3c72e414bef22a0a1454f61e5.png"
draft: false
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/83851ab3c72e414bef22a0a1454f61e5.png)

## 개발 배경
블로그에 사용할 1:1 비율의 썸네일 제작 도구가 필요해서 직접 개발해보기로 했다.

## 주요 기능
### 다양한 레이아웃 지원
- 1:1, 4:3, 16:9 비율의 레이아웃 지원
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/48cd6570348193c074b799d80e7689ed.png)
### 스타일 커스터마이징
#### 배경
- 그라디언트/단색/이미지 배경 지원
- 셔플 버튼으로 랜덤한 그라디언트 생성
- 이미지 배경 선택 시
	- 자유로운 크롭 기능
	- 블러 효과 강도 조절
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2009b2b9d640b461da6bd2283df423b3.png)
#### 타이포그래피
- 한글 최적화 무료 상업용 폰트 지원
	- Gmarket Sans
	- 나눔스퀘어 네오
	- Pretendard
- 세부 조정 기능
	- 제목/부제목 크기 조절
	- 텍스트 굵게/이탤릭/그림자 효과
	- 좌/중앙/우 정렬
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2210da160fd8ff766a8bb74830c574d1.png)

### 사용자 경험 최적화
- 썸네일 미리보기
- 이미지 다운로드
- 클립보드 복사
- 반응형 인터페이스
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a1ceb12e801a8f150f1e55ba2b716b36.png)


## 사용된 기술 스택
#### 코어 스택
- React
- TypeScript
- TailwindCSS
- Vite

#### 주요 라이브러리
- Radix UI
- react-image-crop
- gh-pages

## 배포
다음과 같은 이유들로 GitHub Pages를 통해 서비스를 배포했다:
- 무료 호스팅
- 간편한 배포 프로세스
- CI/CD 파이프라인 구축 용이
- HTTPS

## 향후 개선할 점
현재 초기 버전이 배포된 상태이며, 다음과 같은 개선 사항들을 계획하고 있다.
#### 기능 개선
- favicon 추가
- 이미지 재크롭 프로세스 추가
- 폰트 기본값 지정
#### 성능 최적화
- 미리보기 크기 최적화
    - 실제 다운로드 시에는 원본 크기로 제공하되, 미리보기에서는 최적화된 크기로 렌더링하여 페이지 로드 및 렌더링 성능 개선
#### UX 개선
- 모바일 환경에서의 슬라이더 조작성 개선
- 이미지 배경 선택 시 미리보기 UI 개선

---
이 프로젝트의 모든 소스 코드는 GitHub에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영입니다.