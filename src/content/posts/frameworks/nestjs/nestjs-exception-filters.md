---
title: "[NestJS] Exception Filters"
slug: "nestjs-exception-filters"
date: 2025-08-26
tags: ["NestJS", "Exception", "Filters"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# 예외 필터(Exception filters)
Nest는 애플리케이션 전체에서 처리되지 않은 모든 예외를 처리하는 내장 예외 레이어를 제공합니다. 애플리케이션 코드에서 예외가 처리되지 않으면, 이 레이어가 예외를 포착하고 적절한 사용자 친화적인 응답을 자동으로 전송합니다.

<img src="https://docs.nestjs.com/assets/Filter_1.png" alt="예외 필터 동작 흐름" width="700" />

> 이 그림에의 축은 요청(Request)과 응답(Response)의 흐름을 구분하려는 단순화된 표현이다.
> 위쪽 (Pipe 쪽)은 정상적은 요청 흐름으로 클라이언트에서 들어온 데이터가 라우트 핸들러에 도달하기 전에 변환 및 검증되는 단계로, 즉 데이터를 검증하는 Positive Flow를 나타낸다.
> 아래쪽 (Filter 쪽)은 예외/에러 처리 흐름으로 요청을 처리하다 예외(Exception)가 발생했을 때, 이를 잡아 응답으로 바꿔주는 단계로, 즉 에러를 캐치하는 Negative Flow를 나타낸다. 전역적인 에러 캐처이고, 요청 흐름 어디서든 발생한 에러를 최종적으로 캐치해 응답한다.

기본적으로 이 작업은 `HttpException` 타입(및 하위 클래스)의 예외를 처리하는 내장 전역 예외 필터에 의해 수행됩니다. 예외가 인식되지 않으면(HttpException도 아니고 HttpException을 상속받지도 않은 경우), 내장 예외 필터는 다음과 같은 기본 JSON 응답을 생성합니다.

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

> [!HINT] 전역 예외 필터는 `http-errors` 라이브러리를 부분적으로 지원합니다. 기본적으로 `statusCode`와 `message` 속성을 포함하는 모든 예외는 적절히 처리되어 응답으로 전송됩니다(인식되지 않은 예외의 경우 기본 `InternalServerErrorException` 대신).

## 표준 예외 발생시키기
Nest는 `@nestjs/common` 패키지에서 노출되는 내장 `HttpException` 클래스를 제공합니다. 일반적인 HTTP REST/GraphQL API 기반 애플리케이션의 경우, 특정 오류 조건이 발생했을 때 표준 HTTP 응답 객체를 전송하는 것이 모범 사례입니다.

예를 들어, `CatsController`에 `findAll()` 메서드(GET 라우트 핸들러)가 있다고 가정해봅시다. 이 라우트 핸들러가 어떤 이유로 예외를 발생시킨다고 가정하면, 다음과 같이 하드코딩할 수 있습니다.

```typescript
// cats.controller.ts
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

> [!HINT] 여기서 `HttpStatus`를 사용했습니다. 이는 `@nestjs/common` 패키지에서 가져온 헬퍼 열거형입니다.

클라이언트가 이 엔드포인트를 호출하면 응답은 다음과 같습니다.

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

`HttpException` 생성자는 응답을 결정하는 두 개의 필수 인수를 받습니다.

- `response` 인수는 JSON 응답 본문을 정의합니다. 문자열이나 객체가 될 수 있습니다.
- `status` 인수는 HTTP 상태 코드를 정의합니다.

기본적으로 JSON 응답 본문에는 두 가지 속성이 포함됩니다.

- `statusCode`: status 인수에 제공된 HTTP 상태 코드가 기본값입니다
- `message`: status에 기반한 HTTP 오류의 간단한 설명

JSON 응답 본문의 message 부분만 재정의하려면 response 인수에 문자열을 제공합니다. 전체 JSON 응답 본문을 재정의하려면 response 인수에 객체를 전달합니다. Nest는 *객체를 직렬화하여* JSON 응답 본문으로 반환합니다.

> 객체를 직렬화(serialization)한다는 건 단순히 JS 객체 → JSON 문자열로 변환하는 과정을 의미한다.

두 번째 생성자 인수인 `status`는 유효한 HTTP 상태 코드여야 합니다. 모범 사례는 `@nestjs/common`에서 가져온 `HttpStatus` 열거형을 사용하는 것입니다.

세 번째 생성자 인수(선택사항)인 `options`는 오류 원인을 제공하는 데 사용할 수 있습니다. 이 `cause` 객체는 응답 객체로 직렬화되지 않지만, `HttpException`이 발생한 내부 오류에 대한 귀중한 정보를 제공하여 로깅 목적으로 유용할 수 있습니다.

다음은 전체 응답 본문을 재정의하고 오류 원인을 제공하는 예제입니다.

```typescript
// cats.controller.ts
@Get()
async findAll() {
  try {
    await this.service.findAll()
  } catch (error) {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }
}
```

위의 코드를 사용하면 응답은 다음과 같습니다.

```json
{
  "status": 403,
  "error": "This is a custom message"
}
```

## 예외 로깅
기본적으로 예외 필터는 `HttpException`과 같은 내장 예외(및 이를 상속받는 예외)를 로그에 기록하지 않습니다. 이러한 예외가 발생해도 콘솔에 표시되지 않으며, 정상적인 애플리케이션 흐름의 일부로 처리됩니다. `WsException` 및 `RpcException`과 같은 다른 내장 예외에도 동일한 동작이 적용됩니다.

>  즉,`throw new BadRequestException('잘못된 요청입니다.');`은 서버의 버그가 아니라, 사용자 요청이 잘못됐다는 걸 알려주는 정상 흐름이므로 콘솔에 에러 로그가 찍히지 않는다.

이러한 예외들은 모두 `@nestjs/common` 패키지에서 내보내는 기본 `IntrinsicException` 클래스를 상속받습니다. 이 클래스는 정상적인 애플리케이션 작동의 일부인 예외와 그렇지 않은 예외를 구분하는 데 도움이 됩니다.

이러한 예외를 로그에 기록하려면 사용자 정의 예외 필터를 만들 수 있습니다. 다음 섹션에서 이를 수행하는 방법을 설명하겠습니다.

## 사용자 정의 예외
많은 경우 사용자 정의 예외를 작성할 필요가 없으며, 다음 섹션에서 설명하는 내장 Nest HTTP 예외를 사용할 수 있습니다. 사용자 정의 예외를 만들어야 하는 경우, 사용자 정의 예외가 기본 `HttpException` 클래스에서 상속받는 자체 예외 계층 구조를 만드는 것이 좋습니다. 이 접근 방식을 사용하면 Nest가 예외를 인식하고 오류 응답을 자동으로 처리합니다. 이러한 사용자 정의 예외를 구현해 보겠습니다.

```typescript
// forbidden.exception.ts
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

`ForbiddenException`이 기본 `HttpException`을 확장하므로 내장 예외 핸들러와 원활하게 작동하며, 따라서 `findAll()` 메서드 내에서 사용할 수 있습니다.

```typescript
// cats.controller.ts
@Get()
async findAll() {
  throw new ForbiddenException();
}
```

## 내장 HTTP 예외
Nest는 기본 `HttpException`에서 상속받는 표준 예외 세트를 제공합니다. 이들은 `@nestjs/common` 패키지에서 노출되며 가장 일반적인 HTTP 예외를 나타냅니다.

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `HttpVersionNotSupportedException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `ImATeapotException`
- `MethodNotAllowedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`
- `PreconditionFailedException`

모든 내장 예외는 `options` 매개변수를 사용하여 오류 원인과 오류 설명을 모두 제공할 수 있습니다.

```typescript
throw new BadRequestException('Something bad happened', {
  cause: new Error(),
  description: 'Some error description',
});
```

위의 코드를 사용하면 응답은 다음과 같습니다.

```json
{
  "message": "Something bad happened",
  "error": "Some error description",
  "statusCode": 400
}
```

## 예외 필터
기본(내장) 예외 필터가 많은 경우를 자동으로 처리할 수 있지만, 예외 레이어를 완전히 제어하고 싶을 수 있습니다. 예를 들어, 동적 요인에 따라 로깅을 추가하거나 다른 JSON 스키마를 사용하고 싶을 수 있습니다. **예외 필터**는 정확히 이러한 목적을 위해 설계되었습니다. 예외 필터를 사용하면 정확한 제어 흐름과 클라이언트로 전송되는 응답 내용을 제어할 수 있습니다.

`HttpException` 클래스의 인스턴스인 예외를 포착하고 사용자 정의 응답 로직을 구현하는 예외 필터를 만들어 보겠습니다. 이를 위해 기본 플랫폼 `Request` 및 `Response` 객체에 액세스해야 합니다. 원본 `url`을 가져와 로깅 정보에 포함시키기 위해 `Request` 객체에 액세스합니다. `response.json()` 메서드를 사용하여 전송되는 응답을 직접 제어하기 위해 `Response` 객체를 사용합니다.

```typescript
// http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

> [!HINT] 모든 예외 필터는 제네릭 `ExceptionFilter<T>` 인터페이스를 구현해야 합니다. 이를 위해 표시된 시그니처와 함께 `catch(exception: T, host: ArgumentsHost)` 메서드를 제공해야 합니다. `T`는 예외의 타입을 나타냅니다.

> [!WARNING] `@nestjs/platform-fastify`를 사용하는 경우 `response.json()` 대신 `response.send()`를 사용할 수 있습니다. `fastify`에서 올바른 타입을 가져오는 것을 잊지 마세요.

`@Catch(HttpException)` 데코레이터는 필요한 메타데이터를 예외 필터에 바인딩하여, 이 특정 필터가 `HttpException` 타입의 예외만 찾고 있다는 것을 Nest에 알립니다. `@Catch()` 데코레이터는 단일 매개변수 또는 쉼표로 구분된 목록을 받을 수 있습니다. 이를 통해 여러 타입의 예외에 대한 필터를 한 번에 설정할 수 있습니다.

### Arguments host
`catch()` 메서드의 매개변수를 살펴보겠습니다. `exception` 매개변수는 현재 처리 중인 예외 객체입니다. `host` 매개변수는 `ArgumentsHost` 객체입니다. `ArgumentsHost`는 [실행 컨텍스트 챕터](https://docs.nestjs.com/fundamentals/execution-context)에서 자세히 살펴볼 강력한 유틸리티 객체입니다. 이 코드 샘플에서는 원래 요청 핸들러(예외가 발생한 컨트롤러)로 전달되는 `Request` 및 `Response` 객체에 대한 참조를 얻는 데 사용합니다. 이 코드 샘플에서는 `ArgumentsHost`의 일부 헬퍼 메서드를 사용하여 원하는 `Request` 및 `Response` 객체를 가져왔습니다.

이러한 추상화 수준의 이유는 `ArgumentsHost`가 모든 컨텍스트(e.g. 현재 작업 중인 HTTP 서버 컨텍스트뿐만 아니라 마이크로서비스 및 WebSockets)에서 작동하기 때문입니다. 실행 컨텍스트 챕터에서는 `ArgumentsHost`와 그 헬퍼 함수의 힘으로 모든 실행 컨텍스트에 적절한 기본 인수에 액세스하는 방법을 살펴볼 것입니다. 이를 통해 모든 컨텍스트에서 작동하는 제네릭 예외 필터를 작성할 수 있습니다.

## 필터 바인딩
새로운 `HttpExceptionFilter`를 `CatsController`의 `create()` 메서드에 연결해 보겠습니다.

```typescript
// cats.controller.ts
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

> [!HINT] `@UseFilters()` 데코레이터는 `@nestjs/common` 패키지에서 가져옵니다.

여기서 `@UseFilters()` 데코레이터를 사용했습니다. `@Catch()` 데코레이터와 마찬가지로 단일 필터 인스턴스나 쉼표로 구분된 필터 인스턴스 목록을 받을 수 있습니다. 여기서는 `HttpExceptionFilter`의 인스턴스를 제자리에서 생성했습니다. 또는 인스턴스 대신 클래스를 전달하여 인스턴스화 책임을 프레임워크에 맡기고 **의존성 주입**을 활성화할 수 있습니다.

```typescript
// cats.controller.ts
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

> [!HINT] 가능한 경우 인스턴스 대신 클래스를 사용하여 필터를 적용하는 것이 좋습니다. Nest는 전체 모듈에서 동일한 클래스의 인스턴스를 쉽게 재사용할 수 있으므로 **메모리 사용량**을 줄입니다.

> 내가 직접 new로 인스턴스를 만드느냐, 클래스만 전달해서 Nest가 싱글턴 객체로 인스턴스를 만드느냐의 차이다.
> Nest의 의존성 주입(DI)이 가능해지고, 한 번 만든 인스턴스르 계속 사용할 수 있어 메모리 효율성 면에서 좋다는 설명이다.

위 예제에서 `HttpExceptionFilter`는 단일 `create()` 라우트 핸들러에만 적용되어 메서드 범위가 됩니다. 예외 필터는 다양한 수준에서 범위를 지정할 수 있습니다. 컨트롤러/*리졸버*/게이트웨이의 메서드 범위, 컨트롤러 범위 또는 전역 범위. 예를 들어 필터를 컨트롤러 범위로 설정하려면 다음과 같이 합니다.

> 여기서 말하는 리졸버(resolver)는 GraphQL 모듈에서 쓰이는 개념이다.

```typescript
// cats.controller.ts
@Controller()
@UseFilters(new HttpExceptionFilter())
export class CatsController {}
```

이 구조는 `CatsController` 내부에 정의된 모든 라우트 핸들러에 대해 `HttpExceptionFilter`를 설정합니다.

전역 범위 필터를 만들려면 다음과 같이 합니다.

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

> [!WARNING] `useGlobalFilters()` 메서드는 게이트웨이나 하이브리드 애플리케이션에 대한 필터를 설정하지 않습니다.

전역 범위 필터는 전체 애플리케이션, 모든 컨트롤러 및 모든 라우트 핸들러에 사용됩니다. 의존성 주입 측면에서, 모듈 외부에서 등록된 전역 필터(위 예제의 `useGlobalFilters()`와 같이)는 모듈 컨텍스트 외부에서 수행되므로 종속성을 주입할 수 없습니다. 이 문제를 해결하기 위해 다음 구조를 사용하여 모든 모듈에서 직접 전역 범위 필터를 등록할 수 있습니다.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

> [!HINT] 이 접근 방식을 사용하여 필터에 대한 의존성 주입을 수행할 때, 이 구조가 사용되는 모듈에 관계없이 필터가 실제로 전역적이라는 점에 유의하세요. 이 작업은 어디에서 수행해야 할까요? 필터(위 예제의 `HttpExceptionFilter`)가 정의된 모듈을 선택하세요. 또한 `useClass`만이 사용자 정의 공급자 등록을 처리하는 유일한 방법은 아닙니다. [여기](https://docs.nestjs.com/fundamentals/custom-providers)에서 자세히 알아보세요.

이 기술을 사용하여 필요한 만큼 많은 필터를 추가할 수 있습니다. 단순히 각각을 providers 배열에 추가하면 됩니다.

## 모든 예외를 잡는 필터
예외 타입에 관계없이 모든 처리되지 않은 예외를 포착하려면 `@Catch()` 데코레이터의 매개변수 목록을 비워두세요(e.g. `@Catch()`).

> 원래는 특정 예외만 잡는데(e.g. `@Catch(HttpException)`) `@Catch()`를 비워두면 예외 타입에 상관없이 모든 예외를 잡을 수 있다.

아래 예제에서는 HTTP 어댑터를 사용하여 응답을 전달하고 플랫폼별 객체(`Request` 및 `Response`)를 직접 사용하지 않으므로 플랫폼에 구애받지 않는 코드를 가지고 있습니다.

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // 특정 상황에서 `httpAdapter`는 생성자 메서드에서
    // 사용할 수 없을 수 있으므로 여기서 해결해야 합니다.
    const { httpAdapter } = this.httpAdapterHost; // 현재 플랫폼(Express/Fastify) 추상화 객체

    const ctx = host.switchToHttp(); // HTTP 컨텍스트 변환

		// 예외가 HttpException이면 상태코드를 꺼내고, 그렇지 않으면 500 처리
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()), // 공통 메서드로 URL 추출
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
```

> [!WARNING] 모든 예외를 잡는 예외 필터를 특정 타입에 바인딩된 필터와 결합할 때는 "모든 예외를 잡는 필터를 먼저 선언"하여 특정 필터가 바인딩된 타입을 올바르게 처리할 수 있도록 해야 합니다.

## 상속
일반적으로 애플리케이션 요구 사항을 충족하도록 제작된 완전히 사용자 정의된 예외 필터를 만듭니다. 그러나 내장된 기본 **전역 예외 필터**를 단순히 확장하고 특정 요인에 따라 동작을 재정의하려는 사용 사례가 있을 수 있습니다.

예외 처리를 기본 필터에 위임하려면 `BaseExceptionFilter`를 확장하고 상속된 `catch()` 메서드를 호출해야 합니다.

```typescript
// all-exceptions.filter.ts
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
```

> [!WARNING] `BaseExceptionFilter`를 확장하는 메서드 범위 및 컨트롤러 범위 필터는 `new`로 인스턴스화해서는 안 됩니다. 대신 프레임워크가 자동으로 인스턴스화하도록 하세요.

전역 필터는 기본 필터를 확장할 수 있습니다. 이는 두 가지 방법 중 하나로 수행할 수 있습니다.

첫 번째 방법은 사용자 정의 전역 필터를 인스턴스화할 때 `HttpAdapter` 참조를 주입하는 것입니다.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

두 번째 방법은 [여기](https://docs.nestjs.com/exception-filters#binding-filters)에 표시된 대로 `APP_FILTER` 토큰을 사용하는 것입니다.


> [!NOTE] 이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.