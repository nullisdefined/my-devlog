---
title: "[NestJS] Controllers"
slug: "nestjs-controllers"
date: 2025-08-24
tags: ["NestJS", "Controllers"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# 컨트롤러

컨트롤러는 들어오는 요청을 처리하고 클라이언트에게 응답을 반환하는 역할을 담당합니다.
<img src="https://docs.nestjs.com/assets/Controllers_1.png" alt="image" width="700" />*https://docs.nestjs.com/controllers*

컨트롤러의 목적은 애플리케이션의 특정 요청을 처리하는 것입니다. 라우팅 메커니즘이 각 요청을 처리할 컨트롤러를 결정합니다. 일반적으로 컨트롤러는 여러 라우트를 가지며, 각 라우트는 다른 작업을 수행할 수 있습니다.

Nest에서 컨트롤러는 클래스와 데코레이터를 사용해 정의합니다. 데코레이터는 클래스에 라우팅 정보를 담은 메타데이터를 추가하고, Nest는 이 정보를 활용해 들어온 요청을 올바른 컨트롤러 메서드와 연결합니다.

> [!HINT]  
> 빌트인 검증 기능이 포함된 CRUD 컨트롤러를 빠르게 생성하려면 CLI의 CRUD 생성기를 사용할 수 있습니다. 
> e.g.`nest g resource [name]`

## 라우팅

다음 예제에서는 기본 컨트롤러를 정의하는 데 필요한 `@Controller()` 데코레이터를 사용합니다. 선택적으로 `cats`라는 라우트 경로 접두사를 지정합니다. `@Controller()` 데코레이터에 경로 접두사를 사용하면 관련 라우트를 그룹화하고 반복적인 코드를 줄일 수 있습니다. 예를 들어, 고양이 엔티티와의 상호작용을 관리하는 라우트를 `/cats` 경로 아래에 그룹화하려면 `@Controller()` 데코레이터에 `cats` 경로 접두사를 지정할 수 있습니다. 이렇게 하면 파일의 각 라우트에서 해당 경로 부분을 반복할 필요가 없습니다.

```typescript
// cats.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

> [!HINT]  
> CLI를 사용하여 컨트롤러를 생성하려면 간단히 `$ nest g controller [name]` 명령을 실행하세요.

`findAll()` 메서드 앞에 배치된 `@Get()` HTTP 요청 메서드 데코레이터는 Nest에게 HTTP 요청의 특정 엔드포인트에 대한 핸들러를 생성하도록 지시합니다. 이 엔드포인트는 HTTP 요청 메서드(이 경우 GET)와 라우트 경로로 정의됩니다. 그렇다면 라우트 경로는 무엇일까요? 핸들러의 라우트 경로는 컨트롤러에 선언된 (선택적) 접두사와 메서드의 데코레이터에 지정된 경로를 결합하여 결정됩니다. 모든 라우트에 접두사(`cats`)를 설정하고 메서드 데코레이터에 특정 경로를 추가하지 않았으므로, Nest는 `GET /cats` 요청을 이 핸들러에 매핑합니다.

언급했듯이, 라우트 경로는 선택적 컨트롤러 경로 접두사와 메서드의 데코레이터에 지정된 경로 문자열을 모두 포함합니다. 예를 들어, 컨트롤러 접두사가 `cats`이고 메서드 데코레이터가 `@Get('breed')`인 경우, 결과 라우트는 `GET /cats/breed`가 됩니다.

위 예제에서 이 엔드포인트에 GET 요청이 들어오면, Nest는 요청을 사용자 정의 `findAll()` 메서드로 라우팅합니다. 여기서 선택한 메서드 이름은 완전히 임의적입니다. 라우트를 바인딩할 메서드를 선언해야 하지만, *Nest는 메서드 이름에 특별한 의미를 부여하지 않습니다.* 

> Nest는 오직 데코레이터로만 "이 메서드가 어떤 HTTP 요청을 처리하는지" 결정한다.

이 메서드는 관련 응답과 함께 200 상태 코드를 반환하며, 이 경우 단순한 문자열입니다. 왜 이런 일이 발생할까요? 설명하기 위해 Nest가 응답을 조작하는 두 가지 다른 옵션을 사용한다는 개념을 먼저 소개해야 합니다.

| 옵션          | 설명                                                                                                                                                                                                                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **표준 (권장)** | 이 빌트인 메서드를 사용하면, 요청 핸들러가 JavaScript 객체나 배열을 반환할 때 자동으로 JSON으로 직렬화됩니다. JavaScript 원시 타입(e.g. 문자열, 숫자, 불린)을 반환할 때는 직렬화를 시도하지 않고 값만 전송합니다. 이렇게 하면 응답 처리가 간단해집니다. 값을 반환하기만 하면 Nest가 나머지를 처리합니다.<br><br>또한 응답 상태 코드는 POST 요청이 201을 사용하는 것을 제외하고 기본적으로 항상 200입니다. 핸들러 레벨에서 `@HttpCode(...)` 데코레이터를 추가하여 이 동작을 쉽게 변경할 수 있습니다. |
| **라이브러리별**  | 라이브러리별(e.g. Express) 응답 객체를 사용할 수 있으며, 메서드 핸들러 시그니처에서 `@Res()` 데코레이터를 사용하여 주입할 수 있습니다(e.g. `findAll(@Res() response)`). 이 접근 방식을 사용하면 해당 객체가 노출하는 네이티브 응답 처리 메서드를 사용할 수 있습니다. 예를 들어, Express에서는 `response.status(200).send()`와 같은 코드를 사용하여 응답을 구성할 수 있습니다.                                                             |

> [!WARNING]
> Nest는 핸들러가 `@Res()` 또는 `@Next()`를 사용하는 것을 감지하여 라이브러리별 옵션을 선택했음을 나타냅니다. 두 접근 방식이 동시에 사용되면 표준 접근 방식이 이 단일 라우트에 대해 자동으로 비활성화되고 예상대로 작동하지 않습니다.
> 두 접근 방식을 동시에 사용하려면(e.g. 응답 객체를 주입하여 쿠키/헤더만 설정하고 나머지는 프레임워크에 맡기려면) `@Res({ passthrough: true })` 데코레이터에서 `passthrough` 옵션을 `true`로 설정해야 합니다. 

> `@Res({ passthrough: true })` 옵션을 사용하면, 응답 객체를 주입하는 직접 방식도 사용하지만, Nest 표준 표준 방식도 사용한다는 의미이다.

## 요청 객체

핸들러는 종종 클라이언트의 요청 세부사항에 접근해야 합니다. Nest는 기본 플랫폼(기본값은 Express)의 요청 객체에 대한 접근을 제공합니다. 핸들러의 시그니처에서 `@Req()` 데코레이터를 사용하여 Nest에게 주입하도록 지시하여 요청 객체에 접근할 수 있습니다.

```typescript
// cats.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return 'This action returns all cats';
  }
}
```

> [!HINT]
> Express 타이핑을 활용하려면(위의 `request: Request` 파라미터 예제처럼) `@types/express` 패키지를 설치하세요.

요청 객체는 HTTP 요청을 나타내며 쿼리 문자열, 파라미터, HTTP 헤더, 본문에 대한 속성을 포함합니다. 대부분의 경우 이러한 속성에 수동으로 접근할 필요가 없습니다. 대신 기본 제공되는 `@Body()` 또는 `@Query()`와 같은 전용 데코레이터를 사용할 수 있습니다. 다음은 제공된 데코레이터와 그들이 나타내는 플랫폼별 객체 목록입니다.

| 데코레이터 | 객체 |
|-----------|------|
| `@Request()`, `@Req()` | `req` |
| `@Response()`, `@Res()`* | `res` |
| `@Next()` | `next` |
| `@Session()` | `req.session` |
| `@Param(key?: string)` | `req.params` / `req.params[key]` |
| `@Body(key?: string)` | `req.body` / `req.body[key]` |
| `@Query(key?: string)` | `req.query` / `req.query[key]` |
| `@Headers(name?: string)` | `req.headers` / `req.headers[name]` |
| `@Ip()` | `req.ip` |
| `@HostParam()` | `req.hosts` |

기본 HTTP 플랫폼(e.g. Express와 Fastify) 간의 타이핑 호환성을 위해 Nest는 `@Res()`와 `@Response()` 데코레이터를 제공합니다. `@Res()`는 단순히 `@Response()`의 별칭입니다. 둘 다 기본 네이티브 플랫폼 응답 객체 인터페이스를 직접 노출합니다. 사용할 때는 기본 라이브러리의 타이핑(예: `@types/express`)도 가져와야 완전히 활용할 수 있습니다. 메서드 핸들러에 `@Res()` 또는 `@Response()`를 주입하면 해당 핸들러에 대해 Nest를 라이브러리별 모드로 전환하고 응답 관리에 대한 책임을 지게 됩니다. 이 경우 응답 객체에서 어떤 종류의 호출(e.g. `res.json(...)` 또는 `res.send(...)`)을 해야 하며, 그렇지 않으면 HTTP 서버가 중단됩니다.

> [!HINT]
> 사용자 정의 데코레이터를 만드는 방법은 [이 챕터](https://docs.nestjs.com/custom-decorators)를 참조하세요.

## 리소스

이전에 고양이 리소스를 가져오는 엔드포인트(GET 라우트)를 정의했습니다. 일반적으로 새 레코드를 생성하는 엔드포인트도 제공하고 싶을 것입니다. 이를 위해 POST 핸들러를 만들어 봅시다.

```typescript
// cats.controller.ts
import { Controller, Get, Post } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

이렇게 간단합니다. Nest는 모든 표준 HTTP 메서드에 대한 데코레이터를 제공합니다: `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`, `@Options()`, `@Head()`. 또한 `@All()`은 모든 메서드를 처리하는 엔드포인트를 정의합니다.

## 라우트 와일드카드

패턴 기반 라우트도 NestJS에서 지원됩니다. 예를 들어, 별표(`*`)는 경로 끝에서 문자의 조합을 일치시키는 와일드카드로 사용할 수 있습니다. 다음 예제에서 `findAll()` 메서드는 뒤따르는 문자 수에 관계없이 `abcd/`로 시작하는 모든 라우트에 대해 실행됩니다.

```typescript
@Get('abcd/*')
findAll() {
  return 'This route uses a wildcard';
}
```

`'abcd/*'` 라우트 경로는 `abcd/`, `abcd/123`, `abcd/abc` 등과 일치합니다. 하이픈(-)과 점(.)은 문자열 기반 경로에서 문자 그대로 해석됩니다.

이 접근 방식은 Express와 Fastify 모두에서 작동합니다. 하지만 Express의 최신 릴리스(v5)에서는 라우팅 시스템이 더 엄격해졌습니다. 순수 Express에서는 라우트가 작동하도록 명명된 와일드카드를 사용해야 합니다(예: `abcd/*splat`, 여기서 `splat`은 단순히 와일드카드 파라미터의 이름이며 특별한 의미가 없습니다). 원하는 대로 이름을 지정할 수 있습니다. 그렇긴 하지만 Nest는 Express에 대한 호환성 레이어를 제공하므로 여전히 별표(`*`)를 와일드카드로 사용할 수 있습니다.

라우트 중간에 사용되는 별표의 경우, Express는 명명된 와일드카드(e.g. `ab{*splat}cd`)를 요구하지만 Fastify는 전혀 지원하지 않습니다.

## 상태 코드

언급했듯이 응답의 기본 상태 코드는 POST 요청이 201로 기본 설정되는 것을 제외하고 항상 200입니다. 핸들러 레벨에서 `@HttpCode(...)` 데코레이터를 사용하여 이 동작을 쉽게 변경할 수 있습니다.

```typescript
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

> [!HINT]
> `@nestjs/common` 패키지에서 `HttpCode`를 가져오세요.

종종 상태 코드는 정적이지 않고 다양한 요인에 따라 달라집니다. 이 경우 라이브러리별 응답(`@Res()`를 사용하여 주입) 객체를 사용하거나 (오류의 경우 예외를 발생시킬 수 있습니다).

## 응답 헤더

사용자 정의 응답 헤더를 지정하려면 `@Header()` 데코레이터 또는 라이브러리별 응답 객체를 사용할 수 있습니다(그리고 `res.header()`를 직접 호출).

```typescript
@Post()
@Header('Cache-Control', 'no-store')
create() {
  return 'This action adds a new cat';
}
```

> [!!HINT]  
> `@nestjs/common` 패키지에서 `Header`를 가져오세요.

## 리다이렉션

응답을 특정 URL로 리다이렉트하려면 `@Redirect()` 데코레이터 또는 라이브러리별 응답 객체를 사용할 수 있습니다(그리고 `res.redirect()`를 직접 호출).

`@Redirect()`는 두 개의 인수 `url`과 `statusCode`를 받으며, 둘 다 선택 사항입니다. 생략된 경우 `statusCode`의 기본값은 302(Found)입니다.

```typescript
@Get()
@Redirect('https://nestjs.com', 301)
```

> [!HINT]  
> 때로는 HTTP 상태 코드나 리다이렉트 URL을 동적으로 결정하고 싶을 수 있습니다. `@nestjs/common`의 `HttpRedirectResponse` 인터페이스를 따르는 객체를 반환하여 이를 수행할 수 있습니다.

반환된 값은 `@Redirect()` 데코레이터에 전달된 모든 인수를 재정의합니다.

```typescript
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

> `@Redirect()`를 사용하면, 메서드가 객체를 반환할 수 있다. `{ url: '...' }` 형태로 반환하면, 데코레이터에서 지정한 URL 대신 이 값이 우선 적용된다.
> 1. `/docs?version=5` 요청이 들어올 경우, https://docs.nestjs.com/v5/ 로 리다이렉트
> 2. `/docs` 또는 다른 쿼리일 경우, 기본값(https://docs.nestjs.com)으로 리다이렉트

## 라우트 파라미터

요청의 일부로 동적 데이터를 받아야 할 때 정적 경로를 가진 라우트는 작동하지 않습니다(e.g. `GET /cats/1`로 id가 1인 고양이를 가져오기). 파라미터가 있는 라우트를 정의하려면 라우트 경로에 라우트 파라미터 토큰을 추가하여 URL에서 동적 값을 캡처할 수 있습니다. 아래 `@Get()` 데코레이터 예제의 라우트 파라미터 토큰이 이 접근 방식을 보여줍니다. 이러한 라우트 파라미터는 메서드 시그니처에 추가되어야 하는 `@Param()` 데코레이터를 사용하여 접근할 수 있습니다.

> [!HINT]
> 파라미터가 있는 라우트는 정적 경로 뒤에 선언되어야 합니다. 이렇게 하면 매개변수화된 경로가 정적 경로로 향하는 트래픽을 가로채는 것을 방지할 수 있습니다.

```typescript
@Get(':id')
findOne(@Param() params: any): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

`@Param()` 데코레이터는 메서드 파라미터(위 예제에서 `params`)를 데코레이트하는 데 사용되며, 라우트 파라미터를 해당 데코레이트된 메서드 파라미터의 속성으로 메서드 내에서 사용할 수 있게 합니다. 코드에 표시된 대로 `params.id`를 참조하여 `id` 파라미터에 접근할 수 있습니다. 또는 데코레이터에 특정 파라미터 토큰을 전달하고 메서드 본문 내에서 이름으로 라우트 파라미터를 직접 참조할 수 있습니다.

> [!HINT]  
> `@nestjs/common` 패키지에서 `Param`을 가져오세요.

```typescript
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```

## 서브도메인 라우팅

`@Controller` 데코레이터는 들어오는 요청의 HTTP 호스트가 특정 값과 일치하도록 요구하는 `host` 옵션을 사용할 수 있습니다.

```typescript
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```

> [!WARNING]
> Fastify는 중첩된 라우터를 지원하지 않으므로 서브도메인 라우팅을 사용하는 경우 기본 Express 어댑터를 대신 사용하는 것이 좋습니다.

라우트 경로와 마찬가지로 `host` 옵션은 토큰을 사용하여 호스트 이름의 해당 위치에서 동적 값을 캡처할 수 있습니다. 아래 `@Controller()` 데코레이터 예제의 호스트 파라미터 토큰이 이 사용법을 보여줍니다. 이러한 방식으로 선언된 호스트 파라미터는 메서드 시그니처에 추가되어야 하는 `@HostParam()` 데코레이터를 사용하여 접근할 수 있습니다.

```typescript
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```

## 상태 공유

다른 프로그래밍 언어에서 온 개발자들에게는 Nest에서 거의 모든 것이 들어오는 요청 간에 공유된다는 것이 놀라울 수 있습니다. 여기에는 데이터베이스 연결 풀, 전역 상태를 가진 싱글톤 서비스 등의 리소스가 포함됩니다. Node.js는 각 요청이 별도의 스레드에서 처리되는 요청/응답 다중 스레드 무상태 모델을 사용하지 않는다는 것을 이해하는 것이 중요합니다. 따라서 Nest에서 *싱글톤 인스턴스*를 사용하는 것은 애플리케이션에 완전히 안전합니다.

> **싱글톤 인스턴스(Singleton Instance)**: 애플리케이션 전체에서 단 하나만 생성되고, 모든 곳에서 공유되는 개체를 의미한다.

그렇긴 하지만, 컨트롤러에 대한 요청 기반 수명이 필요한 특정 엣지 케이스가 있습니다. 예를 들면 GraphQL 애플리케이션의 요청별 캐싱, 요청 추적 또는 멀티 테넌시 구현 등이 있습니다. 주입 범위 제어에 대한 자세한 내용은 [여기](https://docs.nestjs.com/fundamentals/injection-scopes)에서 확인할 수 있습니다.

## 비동기성

우리는 현대 JavaScript를 사랑하며, 특히 비동기 데이터 처리에 대한 강조를 좋아합니다. 그래서 Nest는 async 함수를 완전히 지원합니다. 모든 async 함수는 Promise를 반환해야 하며, 이를 통해 Nest가 자동으로 해결할 수 있는 지연된 값을 반환할 수 있습니다. 예시를 보겠습니다.

```typescript
// cats.controller.ts
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

이 코드는 완벽하게 유효합니다. 하지만 Nest는 한 걸음 더 나아가 라우트 핸들러가 RxJS observable 스트림도 반환할 수 있도록 합니다. Nest는 내부적으로 구독을 처리하고 스트림이 완료되면 최종 방출된 값을 해결합니다.

```typescript
// cats.controller.ts
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

두 접근 방식 모두 유효하며, 필요에 가장 적합한 것을 선택할 수 있습니다.

## 요청 페이로드

이전 예제에서 POST 라우트 핸들러는 클라이언트 파라미터를 받지 않았습니다. `@Body()` 데코레이터를 추가하여 이를 수정해 봅시다.

진행하기 전에(TypeScript를 사용하는 경우) DTO(Data Transfer Object) 스키마를 정의해야 합니다. DTO는 네트워크를 통해 데이터를 전송하는 방법을 지정하는 객체입니다. TypeScript 인터페이스나 간단한 클래스를 사용하여 DTO 스키마를 정의할 수 있습니다. 하지만 여기서는 클래스를 사용하는 것을 권장합니다. 왜일까요? 클래스는 JavaScript ES6 표준의 일부이므로 컴파일된 JavaScript에서 실제 엔티티로 유지됩니다. 반면 TypeScript 인터페이스는 트랜스파일 중에 제거되므로 Nest가 런타임에 참조할 수 없습니다. 이는 Pipes와 같은 기능이 런타임에 변수의 메타타입에 접근할 수 있어야 하는데, 이는 클래스에서만 가능하기 때문에 중요합니다.

`CreateCatDto` 클래스를 만들어 봅시다.

```typescript
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

세 가지 기본 속성만 있습니다. 이후 CatsController 내에서 새로 생성된 DTO를 사용할 수 있습니다.

```typescript
// cats.controller.ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

> [!HINT]
> ValidationPipe는 메서드 핸들러가 받지 말아야 할 속성을 필터링할 수 있습니다. 이 경우 허용 가능한 속성을 화이트리스트로 지정할 수 있으며, 화이트리스트에 포함되지 않은 속성은 결과 객체에서 자동으로 제거됩니다. CreateCatDto 예제에서 화이트리스트는 `name`, `age`, `breed` 속성입니다. 자세한 내용은 [여기](https://docs.nestjs.com/techniques/validation#stripping-properties)에서 확인하세요.

## 쿼리 파라미터

라우트에서 쿼리 파라미터를 처리할 때 `@Query()` 데코레이터를 사용하여 들어오는 요청에서 추출할 수 있습니다. 실제로 어떻게 작동하는지 살펴보겠습니다.

`age`와 `breed`와 같은 쿼리 파라미터를 기반으로 고양이 목록을 필터링하려는 라우트를 생각해봅시다. 먼저 CatsController에서 쿼리 파라미터를 정의합니다.

```typescript
// cats.controller.ts
@Get()
async findAll(@Query('age') age: number, @Query('breed') breed: string) {
  return `This action returns all cats filtered by age: ${age} and breed: ${breed}`;
}
```

이 예제에서 `@Query()` 데코레이터는 쿼리 문자열에서 `age`와 `breed`의 값을 추출하는 데 사용됩니다. 예를 들어 다음과 같은 요청

```
GET /cats?age=2&breed=Persian
```

은 `age`가 2이고 `breed`가 Persian이 됩니다.

애플리케이션이 중첩된 객체나 배열과 같은 더 복잡한 쿼리 파라미터를 처리해야 하는 경우

```
?filter[where][name]=John&filter[where][age]=30
?item[]=1&item[]=2
```

HTTP 어댑터(Express 또는 Fastify)를 적절한 쿼리 파서를 사용하도록 구성해야 합니다. Express에서는 확장 파서를 사용할 수 있으며, 이를 통해 풍부한 쿼리 객체를 허용합니다.

```typescript
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set('query parser', 'extended');
```

Fastify에서는 `querystringParser` 옵션을 사용할 수 있습니다.

```typescript
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({
    querystringParser: (str) => qs.parse(str),
  }),
);
```

> [!HINT]
> `qs`는 중첩과 배열을 지원하는 쿼리 문자열 파서입니다. `npm install qs`를 사용하여 설치할 수 있습니다.

## 오류 처리

오류 처리(예외 작업)에 대한 별도의 챕터가 [여기](https://docs.nestjs.com/exception-filters)에 있습니다.

## 전체 리소스 샘플

다음은 기본 컨트롤러를 만들기 위해 사용 가능한 여러 데코레이터의 사용을 보여주는 예제입니다. 이 컨트롤러는 내부 데이터에 접근하고 조작하는 몇 가지 메서드를 제공합니다.

```typescript
// cats.controller.ts
import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
```

> [!HINT]
> Nest CLI는 모든 보일러플레이트 코드를 자동으로 생성하는 생성기(스키매틱)를 제공하여 수동으로 수행하는 것을 피하고 전반적인 개발자 경험을 향상시킵니다. 이 기능에 대한 자세한 내용은 [여기](https://docs.nestjs.com/recipes/crud-generator)에서 확인하세요.

## 시작하기

`CatsController`가 완전히 정의되었더라도 Nest는 아직 이에 대해 알지 못하며 클래스의 인스턴스를 자동으로 생성하지 않습니다.

컨트롤러는 항상 모듈의 일부여야 하므로 `@Module()` 데코레이터 내에 `controllers` 배열을 포함합니다. 루트 `AppModule` 외에 다른 모듈을 정의하지 않았으므로 이를 사용하여 `CatsController`를 등록합니다.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

`@Module()` 데코레이터를 사용하여 모듈 클래스에 메타데이터를 첨부했으며, 이제 Nest는 어떤 컨트롤러를 마운트해야 하는지 쉽게 결정할 수 있습니다.

## 라이브러리별 접근 방식

지금까지 응답을 조작하는 표준 Nest 방식을 다루었습니다. 또 다른 접근 방식은 라이브러리별 응답 객체를 사용하는 것입니다. 특정 응답 객체를 주입하기 위해 `@Res()` 데코레이터를 사용할 수 있습니다. 차이점을 강조하기 위해 CatsController를 다음과 같이 다시 작성해 보겠습니다.

```typescript
import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res: Response) {
     res.status(HttpStatus.OK).json([]);
  }
}
```

이 접근 방식은 작동하며 응답 객체에 대한 완전한 제어를 제공하여(헤더 조작 및 라이브러리별 기능에 대한 접근 등) 더 많은 유연성을 제공하지만, 주의해서 사용해야 합니다. 일반적으로 이 방법은 덜 명확하고 몇 가지 단점이 있습니다. 주요 단점은 코드가 플랫폼에 종속되게 되는 것입니다. 다른 기본 라이브러리는 응답 객체에 대해 다른 API를 가질 수 있기 때문입니다. 또한 응답 객체를 모킹해야 하는 등 테스트를 더 어렵게 만들 수 있습니다.

또한 이 접근 방식을 사용하면 Interceptors 및 `@HttpCode()` / `@Header()` 데코레이터와 같은 표준 응답 처리에 의존하는 Nest 기능과의 호환성을 잃게 됩니다. 이를 해결하기 위해 다음과 같이 `passthrough` 옵션을 활성화할 수 있습니다.

```typescript
@Get()
findAll(@Res({ passthrough: true }) res: Response) {
  res.status(HttpStatus.OK);
  return [];
}
```

이 접근 방식을 사용하면 네이티브 응답 객체와 상호작용할 수 있으면서(e.g. 특정 조건에 따라 쿠키나 헤더 설정) 나머지는 프레임워크가 처리하도록 할 수 있습니다.

---
이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.