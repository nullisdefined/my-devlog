---
title: "[NestJS] Modules"
slug: "nestjs-modules"
date: 2025-08-25
tags: ["NestJS", "Modules"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# 모듈
모듈은 `@Module()` 데코레이터로 주석이 달린 클래스입니다. 이 데코레이터는 Nest가 애플리케이션 구조를 효율적으로 구성하고 관리하는 데 사용하는 메타데이터를 제공합니다.
<img src="https://docs.nestjs.com/assets/Modules_1.png" alt="image" width="700" />*https://docs.nestjs.com/modules*

모든 Nest 애플리케이션에는 최소한 하나의 모듈인 루트 모듈이 있으며, 이는 Nest가 애플리케이션 그래프를 구축하는 시작점 역할을 합니다. 이 그래프는 Nest가 모듈과 프로바이더 간의 관계와 의존성을 해결하는 데 사용하는 내부 구조입니다. 작은 애플리케이션은 루트 모듈만 가질 수도 있지만, 일반적으로 그렇지 않습니다. 모듈은 컴포넌트를 구성하는 효과적인 방법으로 적극 권장됩니다. 대부분의 애플리케이션에서는 밀접하게 관련된 기능 집합을 각각 캡슐화하는 여러 모듈을 갖게 될 것입니다.

`@Module()` 데코레이터는 모듈을 설명하는 속성이 있는 단일 객체를 받습니다.

| 속성            | 설명                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------- |
| `providers`   | Nest 인젝터에 의해 인스턴스화되고 최소한 이 모듈 내에서 공유될 수 있는 프로바이더들                                             |
| `controllers` | 이 모듈에서 정의되어 인스턴스화되어야 하는 컨트롤러 집합                                                               |
| `imports`     | 이 모듈에서 필요한 프로바이더를 내보내는 가져온 모듈 목록                                                              |
| `exports`     | 이 모듈에서 제공되고 이 모듈을 가져오는 다른 모듈에서 사용할 수 있어야 하는 프로바이더의 하위 집합. 프로바이더 자체 또는 토큰(provide 값)만 사용할 수 있음 |

모듈은 기본적으로 프로바이더를 캡슐화합니다. 즉, 현재 모듈의 일부이거나 다른 가져온 모듈에서 명시적으로 내보낸 프로바이더만 주입할 수 있습니다. **모듈에서 내보낸 프로바이더는 본질적으로 모듈의 공개 인터페이스 또는 API 역할을 합니다.**

## 기능 모듈
예제에서 `CatsController`와 `CatsService`는 밀접하게 관련되어 있고 동일한 애플리케이션 도메인을 제공합니다. 이들을 기능 모듈로 그룹화하는 것이 합리적입니다. 기능 모듈은 특정 기능과 관련된 코드를 구성하여 명확한 경계와 더 나은 구성을 유지하는 데 도움이 됩니다. 이는 특히 애플리케이션이나 팀이 성장할 때 중요하며 SOLID 원칙과 일치합니다.

다음으로, 컨트롤러와 서비스를 그룹화하는 방법을 보여주기 위해 `CatsModule`을 만들어 보겠습니다.

```typescript
// cats/cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

> [!HINT] CLI를 사용하여 모듈을 생성하려면 간단히 `$ nest g module cats` 명령을 실행하세요.

위에서 `cats.module.ts` 파일에 `CatsModule`을 정의하고 이 모듈과 관련된 모든 것을 `cats` 디렉토리로 이동했습니다. 마지막으로 해야 할 일은 이 모듈을 루트 모듈(`app.module.ts` 파일에 정의된 `AppModule`)로 가져오는 것입니다.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

**이제 디렉토리 구조는 다음과 같습니다**:

```
src
├── cats
│   ├── dto
│   │   └── create-cat.dto.ts
│   ├── interfaces
│   │   └── cat.interface.ts
│   ├── cats.controller.ts
│   ├── cats.module.ts
│   └── cats.service.ts
├── app.module.ts
└── main.ts
```

## 공유 모듈
Nest에서 모듈은 기본적으로 싱글톤이므로 여러 모듈 간에 동일한 프로바이더 인스턴스를 쉽게 공유할 수 있습니다.

**모든 모듈은 자동으로 공유 모듈입니다. 한 번 생성되면 모든 모듈에서 재사용할 수 있습니다. 여러 다른 모듈 간에 `CatsService`의 인스턴스를 공유하려고 한다고 가정해 봅시다. 이를 위해서는 먼저 아래와 같이 모듈의 `exports` 배열에 추가하여 `CatsService` 프로바이더를 내보내야 합니다**:

```typescript
// cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

이제 `CatsModule`을 가져오는 모든 모듈은 `CatsService`에 접근할 수 있으며 이를 가져오는 다른 모든 모듈과 동일한 인스턴스를 공유합니다.

만약 필요한 모든 모듈에서 `CatsService`를 직접 등록한다면 실제로 작동하겠지만, 각 모듈이 `CatsService`의 별도 인스턴스를 갖게 됩니다. 이는 동일한 서비스의 여러 인스턴스가 생성되어 메모리 사용량이 증가할 수 있으며, 서비스가 내부 상태를 유지하는 경우 상태 불일치와 같은 예기치 않은 동작을 일으킬 수도 있습니다.

`CatsModule`과 같은 모듈 내에 `CatsService`를 캡슐화하고 내보냄으로써, `CatsModule`을 가져오는 모든 모듈에서 `CatsService`의 동일한 인스턴스가 재사용되도록 보장합니다. 이는 메모리 소비를 줄일 뿐만 아니라 모든 모듈이 동일한 인스턴스를 공유하므로 더 예측 가능한 동작으로 이어지며, 공유 상태나 리소스를 관리하기 쉽게 만듭니다. 이것이 NestJS와 같은 프레임워크에서 모듈성과 의존성 주입의 주요 이점 중 하나입니다 - 애플리케이션 전체에서 서비스를 효율적으로 공유할 수 있게 해줍니다.

## 모듈 재내보내기
위에서 본 것처럼 모듈은 내부 프로바이더를 내보낼 수 있습니다. 또한 가져온 모듈을 재내보낼 수도 있습니다. 아래 예제에서 `CommonModule`은 `CoreModule`로 가져오고 내보내지므로, 이를 가져오는 다른 모듈에서 사용할 수 있습니다.

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

## 의존성 주입
모듈 클래스도 프로바이더를 주입할 수 있습니다(e.g. 구성 목적으로).

```typescript
// cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

그러나 모듈 클래스 자체는 순환 의존성으로 인해 프로바이더로 주입될 수 없습니다.

## 전역 모듈
어디서나 동일한 모듈 세트를 가져와야 한다면 지루해질 수 있습니다. Nest와 달리 Angular의 프로바이더는 전역 범위에 등록됩니다. 한 번 정의되면 어디서나 사용할 수 있습니다. 그러나 Nest는 모듈 범위 내에서 프로바이더를 캡슐화합니다. 캡슐화 모듈을 먼저 가져오지 않으면 모듈의 프로바이더를 다른 곳에서 사용할 수 없습니다.

어디서나 즉시 사용 가능해야 하는 프로바이더 세트(e.g. 헬퍼, 데이터베이스 연결 등)를 제공하려면 `@Global()` 데코레이터로 모듈을 전역으로 만드세요.

```typescript
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

`@Global()` 데코레이터는 모듈을 전역 범위로 만듭니다. 전역 모듈은 한 번만 등록되어야 하며, 일반적으로 루트 또는 코어 모듈에 의해 등록됩니다. 위의 예제에서 `CatsService` 프로바이더는 어디에나 존재하며, 서비스를 주입하려는 모듈은 imports 배열에 `CatsModule`을 가져올 필요가 없습니다.

> [!HINT] 모든 것을 전역으로 만드는 것은 설계 관행으로 권장되지 않습니다. 전역 모듈은 보일러플레이트를 줄이는 데 도움이 될 수 있지만, 일반적으로 imports 배열을 사용하여 제어되고 명확한 방식으로 모듈의 API를 다른 모듈에서 사용할 수 있게 하는 것이 더 좋습니다. 이 접근 방식은 더 나은 구조와 유지 관리성을 제공하여 모듈의 필요한 부분만 다른 모듈과 공유되도록 하면서 애플리케이션의 관련 없는 부분 간의 불필요한 결합을 피합니다.

## 동적 모듈
Nest의 동적 모듈을 사용하면 런타임에 구성할 수 있는 모듈을 만들 수 있습니다. 이는 특정 옵션이나 구성을 기반으로 프로바이더를 생성할 수 있는 유연하고 사용자 정의 가능한 모듈을 제공해야 할 때 특히 유용합니다. 동적 모듈이 작동하는 방식에 대한 간략한 개요는 다음과 같습니다.

```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

> [!HINT] `forRoot()` 메서드는 동기적으로 또는 비동기적으로(즉, `Promise`를 통해) 동적 모듈을 반환할 수 있습니다.

> `forRoot()`를 호출하지 않으면 기본값을 쓰고, 전달하면 해당 값으로 덮어씌운다.

이 모듈은 기본적으로 `Connection` 프로바이더를 정의하지만(`@Module()` 데코레이터 메타데이터에서), 추가적으로 `forRoot()` 메서드에 전달된 `entities`와 `options` 객체에 따라 프로바이더 컬렉션(e.g., 레포지토리)을 노출합니다. 동적 모듈에서 반환된 속성은 `@Module()` 데코레이터에 정의된 기본 모듈 메타데이터를 재정의하는 것이 아니라 확장한다는 점에 유의하세요. 이것이 정적으로 선언된 `Connection` 프로바이더와 동적으로 생성된 리포지토리 프로바이더가 모두 모듈에서 내보내지는 방법입니다.

전역 범위에서 동적 모듈을 등록하려면 `global` 속성을 `true`로 설정하세요.

```typescript
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```

> [!WARNING] 위에서 언급했듯이 모든 것을 전역으로 만드는 것은 좋은 설계 결정이 아닙니다.

> `@Global()` 데코레이터를 사용하는 방식은 모듈 선언부에 사용하여, "모듈을 선언하는 순간"부터 모듈 자체를 전역으로 만드는 것이고,
> `global: true` 옵션을 주는 방식은 모듈이 "import되는 시점"에 전역으로 등록되는 것에서 차이가 있다.

`DatabaseModule`은 다음과 같은 방식으로 가져오고 구성할 수 있습니다.

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

동적 모듈을 다시 내보내려면 exports 배열에서 `forRoot()` 메서드 호출을 생략할 수 있습니다.

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}
```

동적 모듈 챕터에서 이 주제를 더 자세히 다루며 작동 예제를 포함합니다.

> [!HINT] `ConfigurableModuleBuilder`를 사용하여 고도로 사용자 정의 가능한 동적 모듈을 구축하는 방법은 [이 챕터](https://docs.nestjs.com/fundamentals/dynamic-modules#configurable-module-builder)에서 알아보세요.


> [!NOTE] 이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.