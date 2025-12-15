---
title: "할사람 프론트엔드 화면정의서"
slug: "halsaram-frontend-wireframe"
date: 2025-08-21
tags: ["ToyProject", "Halsaram", "KOSA", "React", "PWA"]
category: "Series/Toy-Project"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/42fa1e6e1c4b4584a35e880434337990.png"
draft: true
views: 0
---
# 할사람 프론트엔드 화면정의서

## 📋 개요
본 문서는 **할사람** 프로젝트의 프론트엔드 화면 구성을 정의합니다. KOSA 교육과정 중 팀 프로젝트로 진행되는 React PWA 애플리케이션의 주요 화면들을 시각적으로 정리하였습니다.

## 🎯 목적 및 배경
PRD(Product Requirements Document) 작성 후 팀원 간 구체적인 화면 구성에 대한 논의가 필요했습니다. 각자가 생각하는 UI/UX 방향성을 통일하고 개발 방향을 명확히 하기 위해 화면정의서를 작성하게 되었습니다.

## 🛠️ 제작 도구
- **와이어프레임 도구**: [Lovable.dev](https://lovable.dev/) 활용
- **제작 배경**: 팀 내 와이어프레임 도구 숙련자 부재 및 시간 제약으로 AI 기반 도구 활용
- **제작 방식**: 무료 크레딧 한계로 인해 기본 화면 생성 후 상세 기능은 텍스트로 보완

## 📱 화면 구성

### 🚀 사용자 온보딩 플로우

#### 1. 온보딩 튜토리얼
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/42fa1e6e1c4b4584a35e880434337990.png" alt="image" width="300" />

**주요 기능:**
- 앱 소개 및 핵심 기능 안내
- 사용법 가이드 제공
- 첫 사용자 경험 최적화

#### 2. 로그인
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8be2e9a86560587dbf5f2312c195c0cc.png" alt="image" width="300" />

**주요 기능:**
- 소셜 로그인 지원 (Google, Kakao 등)
- 계정 생성 및 로그인 처리
- 보안 인증 프로세스

#### 3. 온보딩 - 지역 선택
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3d15607f17449c8ff06760080913ae0e.png" alt="image" width="300" />

**주요 기능:**
- 사용자 거주 지역 설정
- 지역 기반 미션 추천 기반 데이터
- 위치 정보 권한 요청

#### 4. 온보딩 - 관심사 선택
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/403479f4be9a2891e0d32d478c536822.png" alt="image" width="300" />

**주요 기능:**
- 개인 관심사 카테고리 선택
- 맞춤형 미션 추천 알고리즘 기초 데이터
- 다중 선택 지원

### 🏠 메인 서비스 화면

#### 5. 홈 화면 대시보드
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d5db1712a8237d93995ee4e9e1b27870.png" alt="image" width="300" />

**주요 기능:**
- 개인 활동 현황 요약
- 진행 중인 미션 표시
- 획득 포인트 및 달성률 표시
- 추천 미션 카드

#### 6. 미션 리스트
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/66f630ebd75eb8c5dd7ad23903ef183a.png" alt="image" width="300" />

**주요 기능:**
- 카테고리별 미션 분류
- 필터링 및 검색 기능
- 미션 난이도 및 포인트 표시
- 참여 인원 및 마감일 정보

#### 7. 미션 상세 페이지
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/be8434530c111ef0594e827231bdb11c.png" alt="image" width="300" />

**주요 기능:**
- 미션 상세 정보 및 규칙
- 참여자 목록 및 진행 상황
- 미션 참여 신청 버튼
- 댓글 및 질의응답 섹션

### 💰 포인트 및 리워드

#### 8. 포인트 마켓
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/69b7acf3c55a9c3e3e0a70bd09599618.png" alt="image" width="300" />

**주요 기능:**
- 적립 포인트로 상품 구매
- 카테고리별 상품 분류
- 포인트 잔액 및 사용 내역
- 상품 상세 정보 및 교환

### 📝 커뮤니티 및 피드백

#### 9. 모임 리뷰
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c5d860cf959dca5d841aa3455e1fb3ad.png" alt="image" width="300" />

**주요 기능:**
- 완료된 미션에 대한 후기 작성
- 별점 평가 시스템
- 사진 첨부 및 경험 공유
- 다른 참여자들과의 소통

### 👤 개인 설정

#### 10. 마이페이지
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9b9eb640772087dd4232ca92aba4eb6c.png" alt="image" width="300" />

**주요 기능:**
- 개인 프로필 관리
- 활동 통계 및 성취도
- 설정 및 환경설정
- 고객지원 및 문의

## 🔧 기술 사양 및 요구사항

### 플랫폼 및 기술 스택
- **프론트엔드**: React, PWA (Progressive Web App)
- **상태 관리**: Context API 또는 Redux
- **스타일링**: Styled Components 또는 CSS Modules
- **빌드 도구**: Vite 또는 Create React App

### 화면 설계 원칙
- **반응형 디자인**: 모바일 우선 설계
- **접근성**: WCAG 2.1 AA 수준 준수
- **성능**: 페이지 로딩 시간 3초 이내
- **사용자 경험**: 직관적이고 일관된 인터페이스

### 주요 컴포넌트
- **네비게이션**: 하단 탭 바 구조
- **카드 레이아웃**: 미션 및 상품 표시용
- **모달 시스템**: 상세 정보 및 액션 처리
- **폼 컴포넌트**: 로그인, 회원가입, 설정

## 📋 개발 우선순위
1. **1차 개발 (MVP)**
   - 사용자 인증 (로그인/회원가입)
   - 기본 미션 리스트 및 상세 화면
   - 마이페이지 (기본 정보)

2. **2차 개발**
   - 포인트 시스템 및 마켓
   - 리뷰 및 평가 시스템
   - 소셜 기능 강화

3. **3차 개발**
   - 고급 필터링 및 검색
   - 알림 시스템
   - 성능 최적화

## 🚀 프로젝트 정보
이 프로젝트는 **KOSA(Korea Software HRD Center)** 교육과정의 일환으로 진행되는 팀 프로젝트입니다. 

**기술 스택**: React, PWA, Node.js  
**팀원**: 프론트엔드 2명, 백엔드 2명  
**개발 기간**: 6주


> [!NOTE] 프로젝트 관련 코드와 상세 정보는 GitHub 저장소에서 확인하실 수 있습니다.