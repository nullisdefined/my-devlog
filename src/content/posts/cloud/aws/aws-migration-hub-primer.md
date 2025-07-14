---
title: "AWS Migration Hub Primer"
slug: "aws-migration-hub-primer"
date: 2025-07-09
tags: []
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/159e9a38bcb2893d4560150f3d10548f.png"
draft: true
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/159e9a38bcb2893d4560150f3d10548f.png)


기업이 온프레미스 환경에서 AWS로 전환하고자 할 때 다음과 같은 질문들을 떠올릴 수 있다.

1. 무엇을 옮겨야 할까
2. 어떻게 옮기는 것이 효율적일까
3. 어디까지 진행됐는지 실시간으로 볼 수는 없을까

이러한 고민을 해결하기 위한 AWS 서비스가 Migraton Hub이다.

Migration Hub는 클라우드로 이전하려는 조직(기업)을 위해 애플리케이션 포트폴리오를 시각적으로 보여주고, 마이그레이션 상태를 실시간 추적하며, 각 마이그레이션 단계에 필요한 도구를 통합 관리할 수 있는 단일 콘솔이다.

## 주요 기능 및 이점들

Migration Hub는 단순히 시각화해주는 도구가 아닌, 인벤토리 탐색 → 분석 → 전략 추천 → 자동 실행까지 포괄하는 마이그레이션 허브이다.

1. **인벤토리 파악**
	- 온프레미스 서버 및 애플리케이션을 자동으로 탐색
	- 인벤토리 구성으로 현재 IT 자산 구조 시각화

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/154e9c5c51f805f4e9a2dafe596cd358.png" alt="image" width="600" />


2. 온프레미스 데이터 분석
	- CPU, 메모리, 디스크, 네트워크 등 자원 사용 현황 분석
	- 종속성(Dependency) 및 트래픽 흐름 파악

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/09226e871cdddc549e53aa25d2863ea5.png" alt="image" width="600" />

3. Strategy Recommendations
	- 자동 분석 결과에 따라 리호스트, 리플랫폼, 리팩터 전략 제시

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/066faa0767e48e7e5e25c9983e301f0a.png" alt="image" width="600" />

| **전략 유형**         | **설명**                               |
| ----------------- | ------------------------------------ |
| 리호스트 (Rehost)     | 변경 없이 lift & shift                   |
| 리플랫폼 (Replatform) | OS 또는 DB만 변경                         |
| 리팩터 (Refactor)    | 애플리케이션 구조 자체 변경 (e.g. Microservices) |

4. Amazon EC2 인스턴스 권장 사항
	- 온프레미스 워크로드에 적합한 EC2 유형을 추천하여 효율적인 이전을 지원함
5. 오케스트레이션
	- 마이그레이션 워크플로우를 순서대로 자동 실행 가능 (e.g. 데이터베이스 → 애플리케이션 순서)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bc370a6c8a2335e43bfc5f3ece747e0e.png" alt="image" width="700" />

6. 단일 관리 대시보드
	- 여러 마이그레이션 도구에서 오는 상태를 하나의 뷰에서 통합 추적

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5b4748326dfd04ac3b8eae2c97d0bdf6.png" alt="image" width="600" />

7. 리팩터링 지원
	Refactor Spaces와 연계해 마이크로서비스로의 점진적 전환을 지원함

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f653d809c66c5d2fd9cf9a7bb0e8b69f.png" alt="image" width="600" />


## 사용 절차

### 1. 보안 자격 증명 구성

- **루트 계정 사용 지양**: 모든 권한을 가진 루트 계정은 사용하지 않도록 하고, 보안상 특정 작업에만 제한적으로 사용함
- **IAM 사용자 생성**: 마이그레이션 작업용 관리자 IAM 사용자를 생성하고 필요한 권한 부여
- **역할(Role) 기반 접근 권장**: 서비스 간 연동에는 IAM Role을 사용하여 최소 권한 원칙을 적용함
- **감사 및 모니터링**: IAM 사용자는 추적 및 로깅이 가능하므로 보안 및 관리에 유리

### 2. 홈 리전 선택

- Migration Hub의 중심 리전으로, 모든 검색 데이터, 추적 정보, 계획 정보가 저장되는 리전을 선택
- 한 번 설정하면 변경 불가
- 다중 리전 마이그레이션 가능: 홈 리전은 단일하지만, 이동 대상은 여러 리전이어도 무방함

### 3. 도구 설정 및 연결

Application Discovery Service, DMS 등 연결

### 4. 서버 및 앱 검색 시작

온프레미스 자산 → AWS Migration Hub로 업로드하여 마이그레이션 분석 시작

## 온프레미스 리소스 탐색

마이그레이션을 위한 첫 번째 작업은 가지고 있는 자원을 파악하는 것이다. 이를 위해 AWS는 Application Discovery Agent (ADS Agent)를 제공한다.

### ADS Agent 역할

- 서버 내부에 설치되어 OS, CPU, 프로세스, 네트워크 등 정보 수집
- TLS 기반으로 안전하게 AWS로 전송
- 15초 단위 수집, 15분마다 Migration Hub와 동기화
- Agent는 물리적/가상 서버 모두 지원