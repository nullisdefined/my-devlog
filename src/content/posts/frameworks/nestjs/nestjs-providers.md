---
title: "[NestJS] Providers"
slug: "nestjs-providers"
date: 2025-08-25
tags: ["NestJS", "Providers", "DI"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# 프로바이더

프로바이더는 Nest의 핵심 개념입니다. 서비스, 리포지토리, 팩토리, 헬퍼 등 많은 기본 Nest 클래스를 프로바이더로 취급할 수 있습니다. 프로바이더의 핵심 아이디어는 의존성으로 주입될 수 있다는 것이며, 이를 통해 객체들이 서로 다양한 관계를 형성할 수 있습니다. 이러한 객체들을 "연결"하는 책임은 주로 Nest 런타임 시스템에서 처리합니다.

<img src="https://docs.nestjs.com/assets/Components_1.png" alt="image" width="700" />*https://docs.nestjs.com/providers*

이전 챕터에서 간단한 `CatsController`를 만들었습니다. 컨트롤러는 HTTP 요청을 처리하고 더 복잡한 작업을 프로바이더에게 위임해야 합니다. 프로바이더는 NestJS 모듈에서 프로바이더로 선언된 일반 JavaScript 클래스입니다. 자세한 내용은 "모듈" 챕터를 참조하세요.

> [!HINT]  
> Nest는 객체 지향 방식으로 의존성을 설계하고 구성할 수 있게 해주므로, *SOLID 원칙*을 따르는 것을 강력히 권장합니다.

> **SOLID 원칙**: 객체지향 프로그래밍(OOP)에서 좋은 설계 원칙을 요약한 다섯 가지 규칙이다. 이 원칙들은 유지보수성, 확장성, 재사용성을 높이는 데 목적을 둔다.
> 1. S → 단일 책임 원칙 (Single Responsibility Principle): 하나의 클래스는 하나의 책임만 가져야 한다.
> 2. O → 개방-폐쇄 원칙 (Open/Closed Principle): 새로운 기능을 추가할 때는 기존 코드를 수정하지 않고 확장할 수 있어야 한다.
> 3. L → 리스코프 치환 원칙 (Liskov Substitution Principle): 하위 클래스는 언제나 상위 클래스를 대체할 수 있어야 한다.
> 	즉, 상속받은 클래스는 부모의 기능을 깨뜨리지 않고 대체 가능해야 한다. e.g. Bird → Eagle은 날 수 있지만, Penguin은 날 수 없음 → 잘못된 상속 구조
> 4. I → 인터페이스 분리 원칙 (Interface Segregation Principle): 클라이언트는 자신이 사용하지 않는 메서드에 의존하지 않아야 한다.
> 	큰 인터페이스 하나보다는 목적에 맞게 작은 인터페이스 여러 개를 두는 것이 좋다.
> 5. D → 의존성 역전 원칙 (Dependency Inversion Principle): 고수준 모듈은 저수준 모듈에 의존하지 않고, 둘 다 추상화(인터페이스)에 의존해야 한다.

## 서비스

간단한 `CatsService`를 만드는 것부터 시작해봅시다. 이 서비스는 데이터 저장과 조회를 처리하며, `CatsController`에서 사용됩니다. 애플리케이션 로직을 관리하는 역할 때문에 프로바이더로 정의하기에 이상적인 후보입니다.

```typescript
// cats.service.ts
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

> [!HINT]  
> CLI를 사용하여 서비스를 생성하려면 간단히 `$ nest g service cats` 명령을 실행하세요.

우리의 `CatsService`는 하나의 속성과 두 개의 메서드를 가진 기본 클래스입니다. 여기서 핵심적인 추가 사항은 `@Injectable()` 데코레이터입니다. 이 데코레이터는 클래스에 메타데이터를 첨부하여 `CatsService`가 Nest IoC 컨테이너에서 관리할 수 있는 클래스임을 알립니다.

또한 이 예제는 다음과 같이 보일 가능성이 높은 `Cat` 인터페이스를 사용합니다.

```typescript
// interfaces/cat.interface.ts
export interface Cat {
  name: string;
  age: number;
  breed: string;
}
```

이제 고양이를 조회하는 서비스 클래스가 있으므로 `CatsController` 내에서 사용해봅시다.

```typescript
// cats.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

`CatsService`는 클래스 생성자를 통해 주입됩니다. `private` 키워드의 사용에 주목하세요. 이 축약 표현은 같은 줄에서 `catsService` 멤버를 선언하고 초기화할 수 있게 하여 프로세스를 간소화합니다.

## 의존성 주입

Nest는 의존성 주입이라는 강력한 디자인 패턴을 중심으로 구축되었습니다. 공식 Angular 문서에서 이 개념에 대한 훌륭한 글을 읽어보는 것을 적극 권장합니다.

Nest에서는 TypeScript의 기능 덕분에 의존성 관리가 간단합니다. 의존성은 타입을 기반으로 해결되기 때문입니다. 아래 예제에서 Nest는 `CatsService`의 인스턴스를 생성하고 반환하여 `catsService`를 해결합니다(또는 싱글톤의 경우, 다른 곳에서 이미 요청된 경우 기존 인스턴스를 반환합니다). 이 의존성은 컨트롤러의 생성자에 주입됩니다(또는 지정된 속성에 할당됩니다).

```typescript
constructor(private catsService: CatsService) {}
```

## 스코프

프로바이더는 일반적으로 애플리케이션 수명 주기와 일치하는 수명("스코프")을 갖습니다. 애플리케이션이 부트스트랩될 때 각 의존성이 해결되어야 하며, 이는 모든 프로바이더가 인스턴스화됨을 의미합니다. 마찬가지로 애플리케이션이 종료되면 모든 프로바이더가 소멸됩니다. 하지만 프로바이더를 요청 범위로 만들 수도 있으며, 이는 수명이 애플리케이션 수명 주기가 아닌 특정 요청에 연결됨을 의미합니다. 이러한 기법에 대한 자세한 내용은 주입 스코프 챕터에서 확인할 수 있습니다.

## 커스텀 프로바이더

Nest는 프로바이더 간의 관계를 관리하는 빌트인 제어 역전("IoC") 컨테이너와 함께 제공됩니다. 이 기능은 의존성 주입의 기초이지만, 실제로는 지금까지 다룬 것보다 훨씬 더 강력합니다. 프로바이더를 정의하는 방법에는 여러 가지가 있습니다. 일반 값, 클래스, 비동기 또는 동기 팩토리를 사용할 수 있습니다. 프로바이더 정의에 대한 더 많은 예제는 의존성 주입 챕터를 확인하세요.

## 선택적 프로바이더

때때로 항상 해결될 필요가 없는 의존성을 가질 수 있습니다. 예를 들어, 클래스가 구성 객체에 의존할 수 있지만, 제공되지 않으면 기본값을 사용해야 합니다. 이러한 경우 의존성은 선택적으로 간주되며, 구성 프로바이더의 부재가 오류를 발생시켜서는 안 됩니다.

프로바이더를 선택적으로 표시하려면 생성자의 시그니처에서 `@Optional()` 데코레이터를 사용하세요.

```typescript
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

위 예제에서는 커스텀 프로바이더를 사용하고 있으므로 `HTTP_OPTIONS` 커스텀 토큰을 포함합니다. 이전 예제들은 생성자 기반 주입을 보여주었는데, 생성자에서 클래스를 통해 의존성을 나타냅니다. 커스텀 프로바이더와 관련 토큰이 작동하는 방식에 대한 자세한 내용은 커스텀 프로바이더 챕터를 확인하세요.

## 속성 기반 주입

지금까지 사용한 기법은 생성자 기반 주입이라고 하며, 프로바이더가 생성자 메서드를 통해 주입됩니다. 특정한 경우에는 속성 기반 주입이 유용할 수 있습니다. 예를 들어, *최상위 클래스가 하나 이상의 프로바이더에 의존하는 경우, 하위 클래스에서 `super()`를 통해 모든 것을 전달하는 것은 번거로울 수 있습니다.*

> 상속 구조 때문에 부모 클래스의 생성자에서 의존성을 요구한다면, 자식 클래스가 생성될 때도 그 생성자 파라미터를 반드시 채워줘야 한다.

이를 피하기 위해 속성 레벨에서 직접 `@Inject()` 데코레이터를 사용할 수 있습니다.

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

> [!WARNING]  
> 클래스가 다른 클래스를 확장하지 않는 경우 일반적으로 생성자 기반 주입을 사용하는 것이 더 좋습니다. 생성자는 필요한 의존성을 명확하게 지정하여 더 나은 가시성을 제공하고 `@Inject`로 주석이 달린 클래스 속성과 비교하여 코드를 더 쉽게 이해할 수 있게 만듭니다.

## 프로바이더 등록

이제 프로바이더(`CatsService`)와 소비자(`CatsController`)를 정의했으므로, 주입을 처리할 수 있도록 Nest에 서비스를 등록해야 합니다. 이는 모듈 파일(`app.module.ts`)을 편집하고 `@Module()` 데코레이터의 `providers` 배열에 서비스를 추가하여 수행됩니다.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

이제 Nest는 `CatsController` 클래스의 의존성을 해결할 수 있습니다.

이 시점에서 디렉토리 구조는 다음과 같아야 합니다.

```
src
├── cats
│   ├── dto
│   │   └── create-cat.dto.ts
│   ├── interfaces
│   │   └── cat.interface.ts
│   ├── cats.controller.ts
│   └── cats.service.ts
├── app.module.ts
└── main.ts
```

## 수동 인스턴스화

지금까지 Nest가 의존성 해결의 대부분 세부 사항을 자동으로 처리하는 방법을 다루었습니다. 하지만 어떤 경우에는 *빌트인 의존성 주입 시스템*을 벗어나 수동으로 프로바이더를 검색하거나 인스턴스화해야 할 수도 있습니다. 이러한 두 가지 기법에 대해 간략히 논의합니다.


기존 인스턴스를 검색하거나 *프로바이더를 동적으로 인스턴스화*하려면 [모듈 참조](https://docs.nestjs.com/fundamentals/module-ref)를 사용할 수 있습니다.
`bootstrap()` 함수 내에서 프로바이더를 가져오려면(e.g. 독립 실행형 애플리케이션용 또는 부트스트래핑 중에 구성 서비스를 사용하기 위해) [독립 실행형 애플리케이션](https://docs.nestjs.com/standalone-applications)을 확인하세요.

> 1. Nest가 DI를 자동으로 해주는 작업을 의미한다.
> 2. 수동 인스턴스화가 필요한 순간이다.

---
이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.