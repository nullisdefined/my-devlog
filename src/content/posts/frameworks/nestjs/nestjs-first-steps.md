---
title: "[NestJS] First Steps"
slug: "nestjs-first-steps"
date: 2025-08-24
tags: ["NestJS", "NestCLI"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# 첫 걸음

이 문서 시리즈에서는 Nest의 핵심 기본 사항을 배우게 됩니다. Nest 애플리케이션의 필수 구성 요소에 익숙해지기 위해, 입문 수준에서 많은 내용을 다루는 기본적인 CRUD 애플리케이션을 구축해볼 것입니다.

## 언어

우리는 TypeScript를 사랑하지만, 무엇보다도 Node.js를 사랑합니다. 그래서 Nest는 TypeScript와 순수 JavaScript 모두와 호환됩니다. Nest는 최신 언어 기능을 활용하므로, 바닐라 JavaScript와 함께 사용하려면 Babel 컴파일러가 필요합니다.

우리가 제공하는 예제에서는 주로 TypeScript를 사용하지만, 언제든지 코드 스니펫을 바닐라 JavaScript 구문으로 전환할 수 있습니다(각 스니펫의 오른쪽 상단 모서리에 있는 언어 버튼을 클릭하여 전환).

## 사전 요구사항

운영 체제에 Node.js(버전 >= 20)가 설치되어 있는지 확인하세요.

## 설정

Nest CLI를 사용하면 새 프로젝트 설정이 매우 간단합니다. npm이 설치되어 있다면, OS 터미널에서 다음 명령어로 새 Nest 프로젝트를 생성할 수 있습니다:

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

> [!HINT]
> TypeScript의 더 엄격한 기능 세트로 새 프로젝트를 생성하려면 `nest new` 명령에 `--strict` 플래그를 전달하세요.

`project-name` 디렉토리가 생성되고, node modules와 몇 가지 보일러플레이트 파일이 설치되며, `src/` 디렉토리가 생성되어 몇 가지 핵심 파일로 채워집니다.

```
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

다음은 핵심 파일들에 대한 간단한 설명입니다.

| 파일                       | 설명                                                             |
| ------------------------ | -------------------------------------------------------------- |
| `app.controller.ts`      | 단일 라우트를 가진 기본 컨트롤러                                             |
| `app.controller.spec.ts` | 컨트롤러에 대한 단위 테스트                                                |
| `app.module.ts`          | 애플리케이션의 루트 모듈                                                  |
| `app.service.ts`         | 단일 메서드를 가진 기본 서비스                                              |
| `main.ts`                | 핵심 함수 `NestFactory`를 사용하여 Nest 애플리케이션 인스턴스를 생성하는 애플리케이션의 진입 파일 |

`main.ts`는 다음과 같이 애플리케이션을 *부트스트랩*하는 비동기 함수를 포함합니다.

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

> **부트스트랩(Bootstrap)**: 프로젝트 실행을 위한 초기화 코드를 뜻 한다.

Nest 애플리케이션 인스턴스를 생성하기 위해 핵심 `NestFactory` 클래스를 사용합니다. `NestFactory`는 애플리케이션 인스턴스를 생성할 수 있는 몇 가지 정적 메서드를 제공합니다. `create()` 메서드는 `INestApplication` 인터페이스를 구현하는 애플리케이션 객체를 반환합니다. 이 객체는 다음 챕터에서 설명할 일련의 메서드를 제공합니다. 위의 `main.ts` 예제에서는 단순히 HTTP 리스너를 시작하여 애플리케이션이 인바운드 HTTP 요청을 기다리도록 합니다.

Nest CLI로 스캐폴딩된 프로젝트는 개발자가 각 모듈을 전용 디렉토리에 보관하는 규칙을 따르도록 권장하는 초기 프로젝트 구조를 생성합니다.

> [!HINT]
> 기본적으로 애플리케이션 생성 중 오류가 발생하면 앱은 코드 1로 종료됩니다. 대신 오류를 발생시키려면 `abortOnError` 옵션을 비활성화하세요 (e.g.  `NestFactory.create(AppModule, { abortOnError: false })`).

## 플랫폼

Nest는 플랫폼에 구애받지 않는 프레임워크를 목표로 합니다. 플랫폼 독립성은 개발자가 여러 유형의 애플리케이션에서 활용할 수 있는 재사용 가능한 논리적 부분을 만들 수 있게 합니다. 기술적으로 Nest는 *어댑터*가 생성되면 모든 Node HTTP 프레임워크와 함께 작동할 수 있습니다. 기본적으로 지원되는 두 가지 HTTP 플랫폼이 있습니다.
express와 fastify 입니다. 필요한 상황에 따라 가장 적합한 것을 선택할 수 있습니다.

> **어댑터(Adapter)**: Nest가 다양한 HTTP 서버(Express, Fastify 등) 위에서 동작할 수 있도록 연결해주는 중간 계층을 의미하며, Express와 Fastify 두 가지 어댑터를 제공한다.

| 플랫폼                | 설명                                                                                                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform-express` | Express는 node를 위한 잘 알려진 미니멀리스트 웹 프레임워크입니다. 커뮤니티에서 구현한 많은 리소스를 갖춘 검증된 프로덕션 준비 라이브러리입니다. `@nestjs/platform-express` 패키지가 기본적으로 사용됩니다. 많은 사용자가 Express로 충분히 만족하며, 이를 활성화하기 위한 별도의 작업이 필요하지 않습니다. |
| `platform-fastify` | Fastify는 최대 효율성과 속도 제공에 중점을 둔 고성능 저오버헤드 프레임워크입니다. 사용 방법은 [여기](https://docs.nestjs.com/techniques/performance)를 참조하세요.                                                                         |

어떤 플랫폼을 사용하든, 각각 고유한 애플리케이션 인터페이스를 노출합니다. 이들은 각각 `NestExpressApplication`과 `NestFastifyApplication`으로 표시됩니다.

아래 예제와 같이 `NestFactory.create()` 메서드에 타입을 전달하면, `app` 객체는 해당 특정 플랫폼에서만 사용 가능한 메서드를 갖게 됩니다. 하지만 실제로 기본 플랫폼 API에 액세스하려는 경우가 아니라면 타입을 지정할 필요는 없습니다.

```typescript
const app = await NestFactory.create<NestExpressApplication>(AppModule);
```

## 애플리케이션 실행

설치 프로세스가 완료되면, OS 명령 프롬프트에서 다음 명령을 실행하여 인바운드 HTTP 요청을 수신하는 애플리케이션을 시작할 수 있습니다.

```bash
$ npm run start
```

> [!HINT]
> 개발 프로세스 속도를 높이려면(20배 빠른 빌드), start 스크립트에 `-b swc` 플래그를 전달하여 *SWC 빌더*를 사용할 수 있습니다. `npm run start -- -b swc`

> **SWC 빌더**: TypeScript/JavaScript 코드를 고속으로 변환(트랜스파일)해주는 빌드 도구를 의미한다. Rust로 작성된 고속 트랜스파일러이며, Babel이나 tsc(TypeScript Compiler) 같은 기존 JS/TS 빌드 도구보다 수십 배 빠른 성능을 제공한다.
> 하지만, TS를 JS로 단순 트랜스파일만하며 타입에 대한 검사를 하지 않기 때문에 tsc처럼 컴파일 타임에 버그 검출이 불가하다.

이 명령은 `src/main.ts` 파일에 정의된 포트에서 HTTP 서버 수신을 시작합니다. 애플리케이션이 실행되면 브라우저를 열고 http://localhost:3000/ 으로 이동하세요. `Hello World!` 메시지가 표시됩니다.

파일 변경 사항을 감시하려면 다음 명령으로 애플리케이션을 시작할 수 있습니다.

```bash
$ npm run start:dev
```

이 명령은 파일을 감시하여 자동으로 재컴파일하고 서버를 다시 로드합니다.

## 린팅과 포매팅

CLI는 대규모에서 신뢰할 수 있는 개발 워크플로우를 스캐폴딩하기 위해 최선을 다합니다. 따라서 생성된 Nest 프로젝트에는 코드 린터와 포매터가 사전 설치되어 있습니다(각각 eslint와 prettier).

> [!HINT]
> 포매터와 린터의 역할이 확실하지 않으신가요? [여기](https://prettier.io/docs/comparison.html)에서 차이점을 알아보세요.

최대한의 안정성과 확장성을 보장하기 위해 기본 eslint와 prettier CLI 패키지를 사용합니다. 이 설정은 설계상 공식 확장 프로그램과 깔끔한 IDE 통합을 가능하게 합니다.

IDE가 관련이 없는 *헤드리스 환경*(지속적 통합, Git 훅 등)의 경우, Nest 프로젝트는 즉시 사용 가능한 npm 스크립트와 함께 제공됩니다.

> **헤드리스 환경(Headless Environment)**: 사용자 인터페이스(GUI) 없이, 명령어 기반(CLI)이나 자동화 도구로만 실행되는 환경을 의미한다. 즉, 개발자가 직접 IDE에서 실행/디버깅 하지 않고, CI/CD 서버, Git 훅, Docker 컨테이너 등에서 자동으로 코드가 빌드 · 테스트 · 배포되는 상황이다.

```bash
# eslint로 린트 및 자동 수정
$ npm run lint

# prettier로 포맷
$ npm run format
```

> Nest는 이런 헤드리스 환경에서도 바로 동작할 수 있도록 `npm run build`, `npm run start`, `npm run test`, `npm run lint`, `npm run format`같은 스크립트들을 기본으로 제공한다.

---
이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.