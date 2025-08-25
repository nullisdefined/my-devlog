---
title: "[NestJS] Introduction"
slug: "nestjs-introduction"
date: 2025-08-24
tags: ["NestJS", "NestCLI"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# 소개

Nest(NestJS)는 효율적이고 확장 가능한 Node.js 서버 애플리케이션을 구축하기 위한 프레임워크입니다. *Progressive JavaScript*를 사용하며, TypeScript로 구축되어 완벽하게 지원합니다(순수 JavaScript로도 개발 가능). 또한 객체 지향 프로그래밍(OOP), 함수형 프로그래밍(FP), 함수형 반응형 프로그래밍(FRP)의 요소들을 결합하여 제공합니다.

> **Progressive**: Nest의 철학 중 하나로, 한 번에 모든 걸 배우지 않고도 가볍게 시작할 수 있고, 필요할 때 점진적으로(progressively) 새로운 개념을 학습하며 확장할 수 있도록 설계되어 있다는 의미이다.

내부적으로 Nest는 Express(기본값)와 같은 강력한 HTTP 서버 프레임워크를 활용하며, 선택적으로 Fastify를 사용하도록 구성할 수도 있습니다!

Nest는 이러한 일반적인 Node.js 프레임워크(Express/Fastify) 위에 *추상화 계층을 제공*하면서도, *개발자에게 해당 API를 직접 노출*합니다. 이를 통해 개발자는 기본 플랫폼에서 사용 가능한 수많은 서드파티 모듈을 자유롭게 활용할 수 있습니다.

> 1. Nest 자체가 새로운 서버 엔진을 만든 것이 아니라, 기본값인 Express 또는 Fastify 위에 추상화 계층(abstraction layer)를 얹은 프레임워크다. 추상화 계층 덕분에 Nest는 모듈, DI, 데코레이터 등의 구조를 제공할 수 있다.
> 2. 다른 프레임워크를 보면 추상화 레이어를 올리면서 내부 엔진의 API를 막아버리는 경우도 있는데, Nest는 Express/Fastify의 원래 API도 그대로 노출한다는 의미이다.

## 철학

최근 몇 년간 Node.js 덕분에 JavaScript는 프론트엔드와 백엔드 애플리케이션 모두에서 웹의 '공용어'가 되었습니다. 이로 인해 Angular, React, Vue와 같은 훌륭한 프로젝트들이 탄생했고, 개발자 생산성을 향상시키며 빠르고 테스트 가능하며 확장 가능한 프론트엔드 애플리케이션을 만들 수 있게 되었습니다. 하지만 Node(서버 사이드 JavaScript)를 위한 뛰어난 라이브러리, 헬퍼, 도구들이 많이 존재함에도 불구하고, 아키텍처라는 핵심 문제를 효과적으로 해결하는 것은 없었습니다.

Nest는 개발자와 팀이 테스트 가능하고, 확장 가능하며, 느슨하게 결합되고, 유지보수가 쉬운 애플리케이션을 만들 수 있도록 즉시 사용 가능한 애플리케이션 아키텍처를 제공합니다. *이 아키텍처는 Angular에서 많은 영감을 받았습니다.*

> NestJS는 Angular로부터 다음과 같은 핵심 아이디어들을 차용했다.
> 1. 모듈(Module) 기반 구조로 기능을 캡슐화
> 2. 의존성 주입(Dependency Injection, DI)을 통한 유연한 객체 관리
> 3. 데코레이터(Decorator)를 활용한 선언적 프로그래밍
> 4. 구조적인 아키텍처: Controller → Service → Module → DI → (옵션) RxJS

## 설치

시작하려면 Nest CLI로 프로젝트를 *스캐폴딩*(scaffolding)하거나, 스타터 프로젝트를 클론할 수 있습니다(둘 다 동일한 결과를 생성합니다).

> **스캐폴딩(Scaffolding)**: 개발자가 일일이 파일/디렉터리를 만들 필요 없이, 프레임워크나 CLI 도구가 초기 코드 구조를 자동으로 생성해주는 기능을 의미한다.

Nest CLI로 프로젝트를 스캐폴딩하려면 다음 명령어를 실행하세요. 이 명령어는 새 프로젝트 디렉토리를 생성하고, 초기 핵심 Nest 파일과 지원 모듈로 디렉토리를 채워 프로젝트의 기본 구조를 만듭니다. 처음 사용하는 사용자에게는 Nest CLI로 새 프로젝트를 생성하는 것을 권장합니다. 첫 단계에서 이 방법으로 계속 진행하겠습니다.

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

> [!HINT]
> 더 *엄격한 기능* 세트를 가진 새 TypeScript 프로젝트를 생성하려면 `nest new` 명령에 `--strict` 플래그를 전달하세요.

> **엄격한 기능**은 TypeScript의 Strict Mode 설정을 뜻한다. 
> Nest CLI에서 --strict 옵션을 주면, 새 프로젝트가 TypeScript의 strict 모드로 설정된 상태로 생성된다.

## 대안

Git을 사용하여 TypeScript 스타터 프로젝트를 설치하는 방법도 있습니다.

```bash
$ git clone https://github.com/nestjs/typescript-starter.git project
$ cd project
$ npm install
$ npm run start
```

> [!HINT]
> git 히스토리 없이 저장소를 클론하려면 *degit*을 사용할 수 있습니다.

> **degit**: Git 저장소에서 `.git` 폴더(히스토리)를 빼고, 파일 스냅샷만 가져오는 CLI 툴을 의미한다.

브라우저를 열고 http://localhost:3000/ 으로 이동하세요.

JavaScript 버전의 스타터 프로젝트를 설치하려면 위 명령어에서 `javascript-starter.git`을 사용하세요.

핵심 패키지와 지원 패키지를 설치하여 처음부터 새 프로젝트를 시작할 수도 있습니다. 이 경우 프로젝트 보일러플레이트 파일을 직접 설정해야 한다는 점을 유의하세요. 최소한 다음 종속성이 필요합니다.
`@nestjs/core`, `@nestjs/common`, `rxjs`, `reflect-metadata` 

처음부터 완전한 프로젝트를 만드는 방법에 대한 짧은 글을 확인해보세요
[최소한의 NestJS 앱을 처음부터 만드는 5단계!](https://dev.to/micalevisk/5-steps-to-create-a-bare-minimum-nestjs-app-from-scratch-5c3b)

---
이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.