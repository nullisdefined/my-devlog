---
title: "[NestJS] Middleware"
slug: "nestjs-middleware"
date: 2025-08-25
tags: ["NestJS", "Middleware"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# 미들웨어

미들웨어는 라우트 핸들러 이전에 호출되는 함수입니다. 미들웨어 함수는 요청 및 응답 객체에 접근할 수 있으며, 애플리케이션의 요청-응답 주기에서 `next()` 미들웨어 함수에 접근할 수 있습니다. 다음 미들웨어 함수는 일반적으로 `next`라는 변수로 표시됩니다.

Nest 미들웨어는 기본적으로 express 미들웨어와 동일합니다. 공식 express 문서의 다음 설명은 미들웨어의 기능을 설명합니다.

미들웨어 함수는 다음 작업을 수행할 수 있습니다.
- 모든 코드를 실행
- 요청 및 응답 객체를 변경
- 요청-응답 주기를 종료
- 스택의 다음 미들웨어 함수를 호출
- 현재 미들웨어 함수가 요청-응답 주기를 종료하지 않으면 제어를 다음 미들웨어 함수로 전달하기 위해 `next()`를 호출해야 합니다. 그렇지 않으면 요청이 중단된 상태로 남게 됩니다.

커스텀 Nest 미들웨어는 함수 또는 `@Injectable()` 데코레이터가 있는 클래스로 구현할 수 있습니다. 클래스는 `NestMiddleware` 인터페이스를 구현해야 하지만, 함수에는 특별한 요구 사항이 없습니다. 클래스 메서드를 사용하여 간단한 미들웨어 기능을 구현하는 것부터 시작해봅시다.

> [!WARNING]  
> Express와 fastify는 미들웨어를 다르게 처리하고 다른 메서드 시그니처를 제공합니다. 자세한 내용은 [여기](https://docs.nestjs.com/techniques/performance#middleware)를 참조하세요.

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

## 의존성 주입

Nest 미들웨어는 의존성 주입을 완전히 지원합니다. 프로바이더 및 컨트롤러와 마찬가지로 동일한 모듈 내에서 사용 가능한 의존성을 주입할 수 있습니다. 일반적으로 이는 생성자를 통해 수행됩니다.

## 미들웨어 적용

`@Module()` 데코레이터에는 미들웨어를 위한 자리가 없습니다. 대신 모듈 클래스의 `configure()` 메서드를 사용하여 설정합니다. 미들웨어를 포함하는 모듈은 `NestModule` 인터페이스를 구현해야 합니다. `AppModule` 레벨에서 `LoggerMiddleware`를 설정해봅시다.

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}
```

위 예제에서는 이전에 `CatsController` 내부에 정의된 `/cats` 라우트 핸들러에 대해 `LoggerMiddleware`를 설정했습니다. 미들웨어를 구성할 때 `forRoutes()` 메서드에 라우트 경로와 요청 메서드를 포함하는 객체를 전달하여 미들웨어를 특정 요청 메서드로 더 제한할 수도 있습니다. 아래 예제에서는 원하는 요청 메서드 타입을 참조하기 위해 `RequestMethod` enum을 가져오는 것에 주목하세요.

```typescript
// app.module.ts
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

> [!HINT]  
> `configure()` 메서드는 `async/await`를 사용하여 비동기로 만들 수 있습니다(e.g., `configure()` 메서드 본문 내에서 비동기 작업 완료를 await할 수 있습니다).

> [!WARNING]  
> express 어댑터를 사용할 때, NestJS 앱은 기본적으로 `body-parser` 패키지에서 `json`과 `urlencoded`를 등록합니다. 즉, `MiddlewareConsumer`를 통해 해당 미들웨어를 사용자 정의하려면 `NestFactory.create()`로 애플리케이션을 생성할 때 `bodyParser` 플래그를 `false`로 설정하여 전역 미들웨어를 꺼야 합니다.

## 라우트 와일드카드

패턴 기반 라우트는 NestJS 미들웨어에서도 지원됩니다. 예를 들어, 명명된 와일드카드(*splat)는 라우트에서 문자 조합을 일치시키는 와일드카드로 사용할 수 있습니다. 다음 예제에서 미들웨어는 뒤따르는 문자 수에 관계없이 `abcd/`로 시작하는 모든 라우트에 대해 실행됩니다.

```typescript
forRoutes({
  path: 'abcd/*splat',
  method: RequestMethod.ALL,
});
```

> [!HINT]  
> `splat`은 단순히 와일드카드 파라미터의 이름이며 특별한 의미가 없습니다. `*wildcard`와 같이 원하는 대로 이름을 지정할 수 있습니다.

`'abcd/*'` 라우트 경로는 `abcd/1`, `abcd/123`, `abcd/abc` 등과 일치합니다. 하이픈(-)과 점(.)은 문자열 기반 경로에서 문자 그대로 해석됩니다. 그러나 추가 문자가 없는 `abcd/`는 라우트와 일치하지 않습니다. 이를 위해서는 와일드카드를 중괄호로 감싸 선택 사항으로 만들어야 합니다:

```typescript
forRoutes({
  path: 'abcd/{*splat}',
  method: RequestMethod.ALL,
});
```

## 미들웨어 컨슈머

`MiddlewareConsumer`는 헬퍼 클래스입니다. 미들웨어를 관리하기 위한 여러 빌트인 메서드를 제공합니다. 이들은 모두 플루언트 스타일로 간단히 체이닝할 수 있습니다. `forRoutes()` 메서드는 단일 문자열, 여러 문자열, `RouteInfo` 객체, 컨트롤러 클래스, 심지어 여러 컨트롤러 클래스를 사용할 수 있습니다. 대부분의 경우 쉼표로 구분된 컨트롤러 목록을 전달할 것입니다. 다음은 단일 컨트롤러가 있는 예제입니다:

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CatsController);
  }
}
```

> [!HINT]  
> `apply()` 메서드는 단일 미들웨어를 사용하거나 여러 미들웨어를 지정하기 위해 여러 인수를 사용할 수 있습니다.

## 라우트 제외

때로는 특정 라우트에 미들웨어가 적용되는 것을 제외하고 싶을 수 있습니다. 이는 `exclude()` 메서드를 사용하여 쉽게 달성할 수 있습니다. `exclude()` 메서드는 제외할 라우트를 식별하기 위해 단일 문자열, 여러 문자열 또는 `RouteInfo` 객체를 받습니다.

사용 방법의 예는 다음과 같습니다:

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/{*splat}',
  )
  .forRoutes(CatsController);
```

> [!HINT]  
> `exclude()` 메서드는 `path-to-regexp` 패키지를 사용하여 와일드카드 파라미터를 지원합니다.

위의 예제를 사용하면 `LoggerMiddleware`는 `exclude()` 메서드에 전달된 세 개를 제외하고 `CatsController` 내부에 정의된 모든 라우트에 바인딩됩니다.

이 접근 방식은 특정 라우트 또는 라우트 패턴을 기반으로 미들웨어를 적용하거나 제외하는 유연성을 제공합니다.

## 함수형 미들웨어

우리가 사용해온 `LoggerMiddleware` 클래스는 매우 간단합니다. 멤버, 추가 메서드, 의존성이 없습니다. 왜 클래스 대신 간단한 함수로 정의할 수 없을까요? 사실 가능합니다. 이 유형의 미들웨어를 함수형 미들웨어라고 합니다. 차이점을 설명하기 위해 로거 미들웨어를 클래스 기반에서 함수형 미들웨어로 변환해봅시다:

```typescript
// logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
};
```

그리고 `AppModule` 내에서 사용합니다:

```typescript
// app.module.ts
consumer
  .apply(logger)
  .forRoutes(CatsController);
```

> [!HINT]  
> 미들웨어에 의존성이 필요하지 않을 때마다 더 간단한 함수형 미들웨어 대안 사용을 고려하세요.

## 다중 미들웨어

위에서 언급했듯이 순차적으로 실행되는 여러 미들웨어를 바인딩하려면 `apply()` 메서드 내에 쉼표로 구분된 목록을 제공하기만 하면 됩니다:

```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

## 전역 미들웨어

등록된 모든 라우트에 미들웨어를 한 번에 바인딩하려면 `INestApplication` 인스턴스에서 제공하는 `use()` 메서드를 사용할 수 있습니다:

```typescript
// main.ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(process.env.PORT ?? 3000);
```

> [!HINT]  
> 전역 미들웨어에서 DI 컨테이너에 접근하는 것은 불가능합니다. `app.use()`를 사용할 때는 대신 함수형 미들웨어를 사용할 수 있습니다. 또는 클래스 미들웨어를 사용하고 `AppModule`(또는 다른 모듈) 내에서 `.forRoutes('*')`와 함께 사용할 수 있습니다.

---
이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.