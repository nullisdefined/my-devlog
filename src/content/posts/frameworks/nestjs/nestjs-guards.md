---
title: "[NestJS] Guards"
slug: "nestjs-guards"
date: 2025-09-15
tags: ["NestJS", "Guards", "Authentication", "Authorization"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# Guards

Guard(가드)는 `@Injectable()` 데코레이터로 주석이 달린 클래스이며, `CanActivate` 인터페이스를 구현합니다.

![Guards](https://docs.nestjs.com/assets/Guards_1.png)

Guard는 단일 책임을 가집니다. 런타임에 존재하는 특정 조건(권한, 역할, ACL 등)에 따라 주어진 요청이 라우트 핸들러에 의해 처리될지 여부를 결정합니다. 이것을 종종 **인가(authorization)**라고 합니다. 전통적인 Express 애플리케이션에서는 인가(그리고 보통 협력하는 인증(authentication))가 미들웨어에 의해 처리되었습니다. 토큰 검증이나 request 객체에 속성을 첨부하는 것과 같은 작업은 특정 라우트 컨텍스트(및 해당 메타데이터)와 강력하게 연결되어 있지 않으므로 미들웨어는 인증을 위한 좋은 선택입니다.

하지만 미들웨어는 본질적으로 "무지"합니다. `next()` 함수를 호출한 후 어떤 핸들러가 실행될지 알지 못합니다. 반면, Guard는 `ExecutionContext` 인스턴스에 액세스할 수 있으므로 다음에 실행될 것이 무엇인지 정확히 알 수 있습니다. Guard는 예외 필터, 파이프, 인터셉터와 마찬가지로 요청/응답 주기의 정확한 지점에서 처리 로직을 삽입할 수 있도록 설계되었으며, 이를 선언적으로 수행할 수 있습니다. 이는 코드를 DRY하고 선언적으로 유지하는 데 도움이 됩니다.

> [!HINT]
> Guard는 모든 미들웨어 이후에 실행되지만, 인터셉터나 파이프보다는 먼저 실행됩니다.

## Authorization guard

앞서 언급했듯이, 특정 라우트가 호출자(일반적으로 특정 인증된 사용자)가 충분한 권한을 가지고 있을 때만 사용할 수 있어야 하므로 **인가**는 Guard의 훌륭한 사용 사례입니다. 우리가 지금 구축할 `AuthGuard`는 인증된 사용자를 가정합니다(따라서 토큰이 요청 헤더에 첨부되어 있음). 토큰을 추출하고 검증한 다음, 추출된 정보를 사용하여 요청이 진행될 수 있는지 여부를 결정합니다.

```typescript
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

> [!HINT]
> 애플리케이션에서 인증 메커니즘을 구현하는 실제 예제를 찾고 있다면 [이 챕터](https://docs.nestjs.com/security/authentication)를 방문하세요. 마찬가지로 더 정교한 인가 예제는 [이 페이지](https://docs.nestjs.com/security/authorization)를 확인하세요.

`validateRequest()` 함수 내부의 로직은 필요에 따라 간단하거나 정교할 수 있습니다. 이 예제의 주요 포인트는 Guard가 요청/응답 주기에 어떻게 맞는지 보여주는 것입니다.

모든 Guard는 `canActivate()` 함수를 구현해야 합니다. 이 함수는 현재 요청이 허용되는지 여부를 나타내는 boolean을 반환해야 합니다. 응답을 동기적으로 또는 비동기적으로(`Promise` 또는 `Observable`을 통해) 반환할 수 있습니다. Nest는 반환 값을 사용하여 다음 동작을 제어합니다.

- `true`를 반환하면 요청이 처리됩니다.
- `false`를 반환하면 Nest는 요청을 거부합니다.

## Execution context

`canActivate()` 함수는 `ExecutionContext` 인스턴스라는 단일 인수를 받습니다. `ExecutionContext`는 `ArgumentsHost`를 상속받습니다. 우리는 예외 필터 챕터에서 `ArgumentsHost`를 이전에 보았습니다. 위의 샘플에서는 `Request` 객체에 대한 참조를 얻기 위해 이전에 사용했던 `ArgumentsHost`에서 정의된 동일한 헬퍼 메서드를 사용하고 있습니다. 이 주제에 대한 자세한 내용은 예외 필터 챕터의 [Arguments host](https://docs.nestjs.com/exception-filters#arguments-host) 섹션을 참조할 수 있습니다.

`ArgumentsHost`를 확장함으로써, `ExecutionContext`는 현재 실행 프로세스에 대한 추가 세부사항을 제공하는 여러 새로운 헬퍼 메서드를 추가합니다. 이러한 세부사항은 광범위한 컨트롤러, 메서드 및 실행 컨텍스트에서 작동할 수 있는 보다 일반적인 Guard를 구축하는 데 도움이 될 수 있습니다. `ExecutionContext`에 대해 자세히 알아보세요 [여기](https://docs.nestjs.com/fundamentals/execution-context).

## Role-based authentication

특정 역할을 가진 사용자에게만 액세스를 허용하는 더 기능적인 Guard를 구축해 보겠습니다. 기본 Guard 템플릿으로 시작하여 다음 섹션에서 이를 구축하겠습니다. 현재로서는 모든 요청이 진행되도록 허용합니다.

```typescript
// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

## Binding guards

파이프 및 예외 필터와 마찬가지로 Guard는 컨트롤러 범위, 메서드 범위 또는 글로벌 범위일 수 있습니다. 아래에서 `@UseGuards()` 데코레이터를 사용하여 컨트롤러 범위 Guard를 설정합니다. 이 데코레이터는 단일 인수 또는 쉼표로 구분된 인수 목록을 취할 수 있습니다. 이를 통해 하나의 선언으로 적절한 Guard 세트를 쉽게 적용할 수 있습니다.

```typescript
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

> [!HINT]
> `@UseGuards()` 데코레이터는 `@nestjs/common` 패키지에서 가져옵니다.

위에서는 (인스턴스 대신) `RolesGuard` 클래스를 전달하여 인스턴스화 책임을 프레임워크에 맡기고 의존성 주입을 활성화했습니다. 파이프 및 예외 필터와 마찬가지로 인플레이스 인스턴스를 전달할 수도 있습니다.

```typescript
@Controller('cats')
@UseGuards(new RolesGuard())
export class CatsController {}
```

위의 구조는 이 컨트롤러에서 선언된 모든 핸들러에 Guard를 첨부합니다. Guard가 단일 메서드에만 적용되기를 원한다면 메서드 레벨에서 `@UseGuards()` 데코레이터를 적용합니다.

글로벌 Guard를 설정하려면 Nest 애플리케이션 인스턴스의 `useGlobalGuards()` 메서드를 사용합니다.

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

> [!WARNING]
> 하이브리드 앱의 경우 `useGlobalGuards()` 메서드는 기본적으로 게이트웨이 및 마이크로서비스에 대한 Guard를 설정하지 않습니다(이 동작을 변경하는 방법에 대한 정보는 [하이브리드 애플리케이션](https://docs.nestjs.com/faq/hybrid-application) 참조). "표준"(비-하이브리드) 마이크로서비스 앱의 경우 `useGlobalGuards()`는 Guard를 전역적으로 마운트합니다.

글로벌 Guard는 모든 컨트롤러와 모든 라우트 핸들러에 대해 전체 애플리케이션에서 사용됩니다. 의존성 주입 측면에서, 모든 모듈 외부에서 등록된 글로벌 Guard(위의 예제와 같이 `useGlobalGuards()`를 사용)는 이것이 모든 모듈의 컨텍스트 외부에서 수행되기 때문에 의존성을 주입할 수 없습니다. 이 문제를 해결하기 위해 다음 구조를 사용하여 모든 모듈에서 직접 Guard를 설정할 수 있습니다.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

> [!HINT]
> Guard에 대한 의존성 주입을 수행하기 위해 이 접근 방식을 사용할 때, 이 구조가 사용되는 모듈에 관계없이 Guard는 실제로 글로벌하다는 점에 유의하세요. 이것은 어디에서 수행되어야 할까요? Guard(`RolesGuard`는 위의 예제)가 정의된 모듈을 선택하세요. 또한 `useClass`는 사용자 정의 프로바이더 등록을 다루는 유일한 방법이 아닙니다. [여기](https://docs.nestjs.com/fundamentals/custom-providers)에서 자세히 알아보세요.

## Setting roles per handler

`RolesGuard`는 작동하지만 아직 그리 똑똑하지 않습니다. 아직 가장 중요한 Guard 기능인 실행 컨텍스트를 활용하지 못하고 있습니다. 아직 역할에 대해 알지 못하거나 각 핸들러에 허용되는 역할이 무엇인지 알지 못합니다. 예를 들어, `CatsController`는 다른 라우트에 대해 다른 권한 체계를 가질 수 있습니다. 일부는 관리자 사용자에게만 사용할 수 있고, 다른 일부는 모든 사람에게 열려 있을 수 있습니다. 역할을 라우트에 유연하고 재사용 가능한 방식으로 일치시킬 수 있는 방법은 무엇일까요?

여기서 **사용자 정의 메타데이터**가 등장합니다([여기](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata)에서 자세히 알아보세요). Nest는 `Reflector.createDecorator` 정적 메서드를 통해 생성된 데코레이터 또는 내장된 `@SetMetadata()` 데코레이터를 통해 라우트 핸들러에 사용자 정의 메타데이터를 첨부하는 기능을 제공합니다.

예를 들어, `Reflector.createDecorator` 메서드를 사용하여 핸들러에 메타데이터를 첨부할 `@Roles()` 데코레이터를 만들어 보겠습니다. `Reflector`는 프레임워크에서 기본적으로 제공되며 `@nestjs/core` 패키지에서 노출됩니다.

```typescript
// roles.decorator.ts
import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<string[]>();
```

여기서 `Roles` 데코레이터는 `string[]` 타입의 단일 인수를 받는 함수입니다.

이제 이 데코레이터를 사용하려면 핸들러에 주석을 답니다.

```typescript
// cats.controller.ts
@Post()
@Roles(['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

여기서 `Roles` 데코레이터 메타데이터를 `create()` 메서드에 첨부하여 `admin` 역할을 가진 사용자만 이 라우트에 액세스할 수 있음을 나타냈습니다.

대안적으로, `Reflector.createDecorator` 메서드를 사용하는 대신 내장된 `@SetMetadata()` 데코레이터를 사용할 수 있습니다. [여기](https://docs.nestjs.com/fundamentals/execution-context#low-level-approach)에서 자세히 알아보세요.

## Putting it all together

이제 돌아가서 이를 `RolesGuard`와 함께 연결해 보겠습니다. 현재는 모든 경우에 `true`를 반환하여 모든 요청이 진행되도록 허용합니다. 현재 사용자에게 할당된 역할을 처리 중인 현재 라우트에서 실제로 필요한 역할과 비교하여 반환 값을 조건부로 만들고 싶습니다. 라우트의 역할(사용자 정의 메타데이터)에 액세스하기 위해 다음과 같이 `Reflector` 헬퍼 클래스를 다시 사용하겠습니다.

```typescript
// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
```

> [!HINT]
> Node.js 세계에서는 권한이 있는 사용자를 request 객체에 첨부하는 것이 일반적인 관행입니다. 따라서 위의 샘플 코드에서 `request.user`가 사용자 인스턴스와 허용된 역할을 포함한다고 가정합니다. 앱에서는 사용자 정의 인증 Guard(또는 미들웨어)에서 해당 연관관계를 만들 것입니다. 이 주제에 대한 자세한 정보는 [이 챕터](https://docs.nestjs.com/security/authentication)를 확인하세요.

> [!WARNING]
> `matchRoles()` 함수 내부의 로직은 필요에 따라 간단하거나 정교할 수 있습니다. 이 예제의 주요 포인트는 Guard가 요청/응답 주기에 어떻게 맞는지 보여주는 것입니다.

컨텍스트 감지 방식으로 `Reflector`를 활용하는 방법에 대한 자세한 내용은 실행 컨텍스트 챕터의 [반성 및 메타데이터](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata) 섹션을 참조하세요.

권한이 불충분한 사용자가 엔드포인트를 요청하면, Nest는 자동으로 다음 응답을 반환합니다.

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

내부적으로 Guard가 `false`를 반환하면 프레임워크는 `ForbiddenException`을 발생시킵니다. 다른 오류 응답을 반환하려면 고유한 특정 예외를 발생시켜야 합니다. 예를 들어:

```typescript
throw new UnauthorizedException();
```

Guard에 의해 발생한 모든 예외는 예외 레이어(글로벌 예외 필터 및 현재 컨텍스트에 적용된 모든 예외 필터)에 의해 처리됩니다.

> [!HINT]
> 권한 부여 구현 방법에 대한 실제 예제를 찾고 있다면 [이 챕터](https://docs.nestjs.com/security/authorization)를 확인하세요.

---
이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.