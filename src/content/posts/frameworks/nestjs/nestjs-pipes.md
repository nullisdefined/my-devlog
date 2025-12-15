---
title: "[NestJS] Pipes"
slug: "nestjs-pipes"
date: 2025-09-01
tags: ["NestJS", "Pipes", "Validation", "Transformation"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# Pipes
파이프(Pipe)는 `@Injectable()` 데코레이터로 주석이 달린 클래스로, `PipeTransform` 인터페이스를 구현합니다.

> `@Injectable` 데코레이터는 의존성 주입(DI) 컨테이너가 관리하는 프로바이더임을 나타낸다.
> 즉, 이 클래스를 NestJS IoC 컨테이너가 생성 · 주입할 수 있게 해주는 데코레이터다.

> 파이프는 항상 PipeTransform 인터페이스를 구현해야 한다.

파이프는 두 가지 일반적인 사용 사례가 있습니다.

- **변환(transformation)**: 입력 데이터를 원하는 형태로 변환 (e.g., 문자열에서 정수로)
- **검증(validation)**: 입력 데이터를 평가하고 유효한 경우 변경 없이 통과시키고, 그렇지 않으면 예외를 발생

두 경우 모두 파이프는 컨트롤러 라우트 핸들러가 처리하는 인수에서 작동합니다. Nest는 메서드가 호출되기 직전에 파이프를 개입시키며, 파이프는 메서드로 향하는 인수를 받아 이를 작동시킵니다. 모든 변환 또는 검증 작업은 이 시점에 수행되며, 그 후 라우트 핸들러가 (잠재적으로) 변환된 인수와 함께 호출됩니다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a0913d9c2d854e0ba6e1af7b6e2448d6.png" alt="image" width="700" />

Nest는 즉시 사용할 수 있는 여러 내장 파이프를 제공합니다. 커스텀 파이프도 빌드할 수 있습니다. 이 장에서는 내장 파이프를 소개하고 라우트 핸들러에 바인딩하는 방법을 보여드리겠습니다. 그런 다음 처음부터 빌드하는 방법을 보여주기 위해 여러 커스텀 파이프를 살펴보겠습니다.

> [!HINT] 파이프는 예외 처리 흐름 안에서 실행됩니다. 그래서 파이프 안에서 예외가 발생하면, 이 예외는 전역 예외 필터나 현재 컨텍스트에 걸려 있는 예외 필터가 대신 처리하게 됩니다.
> 즉, 파이프 단계에서 예외가 던져지는 순간 요청은 바로 중단되며, 그 뒤의 컨트롤러 메서드는 실행되지 않습니다. 이 동작 덕분에 외부에서 들어오는 데이터를 시스템 경계에서 확실하게 검증할 수 있고, 잘못된 값이 애플리케이션 내부 로직까지 흘러들어오는 일을 막을 수 있습니다.

## 내장 파이프
Nest는 즉시 사용 가능한 여러 파이프를 제공합니다.

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`
- `ParseDatePipe`

이들은 `@nestjs/common` 패키지에서 내보내집니다.

`ParseIntPipe` 사용을 간단히 살펴보겠습니다. 이는 변환 사용 사례의 예로, 파이프가 메서드 핸들러 매개변수를 JavaScript 정수로 변환하도록 보장합니다(변환이 실패하면 예외를 발생시킵니다). 이 장의 후반부에서는 `ParseIntPipe`에 대한 간단한 커스텀 구현을 보여드리겠습니다. 아래 예제 기술은 다른 내장 변환 파이프(`ParseBoolPipe`, `ParseFloatPipe`, `ParseEnumPipe`, `ParseArrayPipe`, `ParseDatePipe`, `ParseUUIDPipe`도 적용됩니다. 이 장에서는 이들을 `Parse*` 파이프라고 부르겠습니다).

## 파이프 바인딩
파이프를 사용하려면 파이프 클래스의 인스턴스를 적절한 컨텍스트에 바인딩해야 합니다. `ParseIntPipe` 예제에서는 파이프를 특정 라우트 핸들러 메서드와 연결하고 메서드가 호출되기 전에 실행되도록 하려고 합니다. 다음과 같은 구조로 수행하며, 이를 메서드 매개변수 수준에서 파이프를 바인딩한다고 합니다.

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

이렇게 하면 다음 두 조건 중 하나가 참임을 보장합니다. `findOne()` 메서드에서 받는 매개변수가 숫자이거나(`this.catsService.findOne()` 호출에서 예상대로), 라우트 핸들러가 호출되기 전에 예외가 발생합니다.

예를 들어, 다음과 같이 라우트가 호출된다고 가정해보세요.

```
GET localhost:3000/abc
```

Nest는 다음과 같은 예외를 발생시킵니다.

```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

예외는 `findOne()` 메서드의 본문이 실행되는 것을 방지합니다.

위의 예제에서는 인스턴스가 아닌 클래스(`ParseIntPipe`)를 전달하여 인스턴스화 책임을 프레임워크에 맡기고 의존성 주입을 활성화합니다. 파이프, 가드와 마찬가지로 대신 *인플레이스 인스턴스*를 전달할 수 있습니다. 인플레이스 인스턴스를 전달하는 것은 옵션을 전달하여 내장 파이프의 동작을 사용자 정의하려는 경우에 유용합니다.

> 인플레이스(in-place) 인스턴스란 Nest DI 컨테이너에서 관리되는 프로바이더 클래스가 아니라, 직접 생성한 객체 인스턴스를 파라미터 자리에 곧바로 넘겨주는 방식을 의미한다.
> 예를 들어, ParseIntPipe 클래스를 넘겨주는 것이 아닌 `new ParseIntPipe(...)` 처럼 인플레이스 인스턴스를 직접 넘길 수 있다.

```typescript
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

다른 변환 파이프(모든 `Parse*` 파이프) 바인딩도 유사하게 작동합니다. 이러한 파이프는 모두 라우트 매개변수, 쿼리 문자열 매개변수 및 요청 본문 값을 검증하는 컨텍스트에서 작동합니다.

예를 들어 쿼리 문자열 매개변수의 경우.

```typescript
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

다음은 `ParseUUIDPipe`를 사용하여 문자열 매개변수를 구문 분석하고 UUID인지 검증하는 예입니다.

```typescript
@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return this.catsService.findOne(uuid);
}
```

> [!HINT] `ParseUUIDPipe()`를 사용할 때 버전 3, 4 또는 5의 UUID를 구문 분석합니다. 특정 버전의 UUID만 필요한 경우 파이프 옵션에 버전을 전달할 수 있습니다.

위에서 다양한 `Parse*` 계열의 내장 파이프를 바인딩하는 예를 보았습니다. 검증 파이프 바인딩은 약간 다릅니다. 다음 섹션에서 이에 대해 논의하겠습니다.

> [!HINT] 검증 파이프의 광범위한 예제는 [검증 기법](https://docs.nestjs.com/techniques/validation)을 참조하세요.

## 커스텀 파이프
언급했듯이 자체 커스텀 파이프를 빌드할 수 있습니다. Nest는 강력한 내장 `ParseIntPipe`와 `ValidationPipe`를 제공하지만, 커스텀 파이프가 어떻게 구성되는지 보기 위해 각각의 간단한 커스텀 버전을 처음부터 빌드해보겠습니다.

간단한 `ValidationPipe`로 시작합니다. 처음에는 입력 값을 받아 즉시 동일한 값을 반환하여 항등 함수처럼 동작하도록 합니다.

```typescript
// validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

> [!HINT] `PipeTransform<T, R>`은 모든 파이프가 구현해야 하는 제네릭 인터페이스입니다. 제네릭 인터페이스는 입력 값의 타입을 나타내는 `T`와 `transform()` 메서드의 반환 타입을 나타내는 `R`을 사용합니다.

모든 파이프는 `PipeTransform` 인터페이스 계약을 이행하기 위해 `transform()` 메서드를 구현해야 합니다. 이 메서드에는 두 개의 매개변수가 있습니다.

- `value`
- `metadata`

`value` 매개변수는 현재 처리 중인 메서드 인수(라우트 핸들링 메서드에서 받기 전)이고, `metadata`는 현재 처리 중인 메서드 인수의 메타데이터입니다. 메타데이터 객체에는 다음 속성이 있습니다.

```typescript
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}
```

이러한 속성은 현재 처리 중인 인수를 설명합니다.

| 속성 | 설명 |
|---|---|
| `type` | 인수가 body `@Body()`, query `@Query()`, param `@Param()` 또는 커스텀 매개변수인지를 나타냅니다. |

> [!NOTE] | `metatype` | 인수의 메타타입을 제공합니다(예: `String`). 참고: 라우트 핸들러 메서드 시그니처에서 타입 선언을 생략하거나 바닐라 JavaScript를 사용하는 경우 값은 `undefined`입니다. |
| `data` | 데코레이터에 전달된 문자열입니다(예: `@Body('string')`). 데코레이터 괄호를 비워두면 `undefined`입니다. |

> [!WARNING] TypeScript 인터페이스는 트랜스파일 중에 사라집니다. 따라서 메서드 매개변수의 타입이 클래스 대신 인터페이스로 선언된 경우 메타타입 값은 `Object`가 됩니다.

## 스키마 기반 검증
검증 파이프를 좀 더 유용하게 만들어봅시다. `CatsController`의 `create()` 메서드를 자세히 살펴보면, 서비스 메서드를 실행하기 전에 게시 본문 객체가 유효한지 확인하고 싶을 것입니다.

```typescript
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

`createCatDto` 본문 매개변수에 초점을 맞춰봅시다. 타입은 `CreateCatDto`입니다.

```typescript
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

create 메서드로 들어오는 모든 요청에 유효한 본문이 포함되어 있는지 확인하려고 합니다. 따라서 `createCatDto` 객체의 세 멤버를 검증해야 합니다. 라우트 핸들러 메서드 내부에서 이를 수행할 수 있지만, 단일 책임 원칙(SRP)을 위반하므로 이상적이지 않습니다.

또 다른 접근 방식은 검증자 클래스를 만들고 거기에 작업을 위임하는 것입니다. 이는 각 메서드의 시작 부분에서 이 검증자를 호출하는 것을 기억해야 한다는 단점이 있습니다.

검증 미들웨어를 만드는 것은 어떨까요? 이것은 작동할 수 있지만 안타깝게도 전체 애플리케이션의 모든 컨텍스트에서 사용할 수 있는 제네릭 미들웨어를 만드는 것은 불가능합니다. 미들웨어는 호출될 핸들러와 그 매개변수를 포함한 실행 컨텍스트를 인식하지 못하기 때문입니다.

이것이 바로 파이프가 설계된 사용 사례입니다. 그러니 검증 파이프를 개선해봅시다.

## 객체 스키마 검증
깔끔하고 DRY한 방식으로 객체 검증을 수행하는 데 사용할 수 있는 몇 가지 접근 방식이 있습니다. 일반적인 접근 방식 중 하나는 스키마 기반 검증을 사용하는 것입니다. 이 접근 방식을 시도해봅시다.

Zod 라이브러리를 사용하면 읽기 쉬운 API로 간단한 방식으로 스키마를 만들 수 있습니다. Zod 기반 스키마를 사용하는 검증 파이프를 빌드해봅시다.

필요한 패키지를 설치하는 것으로 시작합니다.

```bash
$ npm install --save zod
```

아래 코드 샘플에서는 스키마를 생성자 인수로 받는 간단한 클래스를 만듭니다. 그런 다음 제공된 스키마에 대해 들어오는 인수를 검증하는 `schema.parse()` 메서드를 적용합니다.

앞서 언급했듯이 검증 파이프는 값을 변경하지 않고 반환하거나 예외를 발생시킵니다.

다음 섹션에서는 `@UsePipes()` 데코레이터를 사용하여 주어진 컨트롤러 메서드에 적절한 스키마를 제공하는 방법을 볼 것입니다. 이렇게 하면 우리가 설정한 대로 검증 파이프를 컨텍스트 전반에서 재사용할 수 있습니다.

```typescript
import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema  } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
```

## 검증 파이프 바인딩
앞서 변환 파이프(`ParseIntPipe` 및 나머지 `Parse*` 파이프)를 바인딩하는 방법을 보았습니다.

검증 파이프 바인딩도 매우 간단합니다.

이 경우 메서드 호출 수준에서 파이프를 바인딩하려고 합니다. 현재 예제에서 `ZodValidationPipe`를 사용하려면 다음을 수행해야 합니다.

1. `ZodValidationPipe`의 인스턴스 생성
2. 파이프의 클래스 생성자에 컨텍스트별 Zod 스키마 전달
3. 메서드에 파이프 바인딩

```typescript
// zod schema example
import { z } from 'zod';

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required();

export type CreateCatDto = z.infer<typeof createCatSchema>;
```

아래와 같이 `@UsePipes()` 데코레이터를 사용하여 수행합니다.

```typescript
// cats.controller.ts
@Post()
@UsePipes(new ZodValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

> [!HINT] `@UsePipes()` 데코레이터는 `@nestjs/common` 패키지에서 가져옵니다.

> [!WARNING] zod 라이브러리는 `tsconfig.json` 파일에서 `strictNullChecks` 구성을 활성화해야 합니다.

## 클래스 검증자
> [!WARNING] 이 섹션의 기술은 TypeScript가 필요하며 바닐라 JavaScript로 작성된 앱에서는 사용할 수 없습니다.

검증 기술에 대한 대체 구현을 살펴봅시다.

Nest는 class-validator 라이브러리와 잘 작동합니다. 이 강력한 라이브러리를 사용하면 데코레이터 기반 검증을 사용할 수 있습니다. 데코레이터 기반 검증은 특히 Nest의 파이프 기능과 결합할 때 매우 강력합니다. 처리된 속성의 메타타입에 액세스할 수 있기 때문입니다. 시작하기 전에 필요한 패키지를 설치해야 합니다.

```bash
$ npm i --save class-validator class-transformer
```

설치가 완료되면 `CreateCatDto` 클래스에 몇 가지 데코레이터를 추가할 수 있습니다. 이 방식의 큰 장점은 `CreateCatDto`가 Post 요청 본문 객체를 표현하는 유일한 진실의 원천(single source of truth)으로 남는다는 점입니다. 따라서 별도의 검증 전용 클래스를 만들 필요 없이, 하나의 DTO 클래스 안에서 타입 정의와 유효성 검증을 동시에 관리할 수 있습니다.

```typescript
// create-cat.dto.ts
import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

> [!HINT] class-validator 데코레이터에 대한 자세한 내용은 [여기](https://github.com/typestack/class-validator#usage)를 참조하세요.

이제 이러한 주석을 사용하는 `ValidationPipe` 클래스를 만들 수 있습니다.

```typescript
// validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

> [!HINT] 다시 한 번 상기시켜드리자면, `ValidationPipe`가 Nest에서 즉시 제공되므로 자체적으로 제네릭 검증 파이프를 빌드할 필요가 없습니다. 내장 `ValidationPipe`는 이 장에서 빌드한 샘플보다 더 많은 옵션을 제공합니다. 커스텀 빌드 파이프의 메커니즘을 설명하기 위해 기본으로 유지되었습니다. 전체 세부 정보와 많은 예제는 [여기](https://docs.nestjs.com/techniques/validation)에서 찾을 수 있습니다.

> [!HINT] 위에서 class-transformer 라이브러리를 사용했는데, 이는 class-validator 라이브러리와 같은 저자가 만들었으며, 결과적으로 매우 잘 작동합니다.

이 코드를 살펴봅시다. 먼저 `transform()` 메서드가 `async`로 표시되어 있음을 주목하세요. 이는 Nest가 동기 및 비동기 파이프를 모두 지원하기 때문에 가능합니다. class-validator 검증 중 일부가 비동기일 수 있기 때문에(Promise를 활용) 이 메서드를 비동기로 만듭니다.

다음으로 구조 분해를 사용하여 `metatype` 필드를 추출합니다(`ArgumentMetadata`에서 이 멤버만 추출) 우리의 `metatype` 매개변수로. 이는 전체 `ArgumentMetadata`를 가져온 다음 `metatype` 변수를 할당하는 추가 문을 갖는 것의 축약형입니다.

다음으로 헬퍼 함수 `toValidate()`를 주목하세요. 현재 처리 중인 인수가 네이티브 JavaScript 타입일 때 검증 단계를 우회하는 역할을 합니다(검증 데코레이터를 첨부할 수 없으므로 검증 단계를 통해 실행할 이유가 없습니다).

다음으로 class-transformer 함수 `plainToInstance()`를 사용하여 일반 JavaScript 인수 객체를 타입이 지정된 객체로 변환하여 검증을 적용할 수 있도록 합니다. 이를 수행해야 하는 이유는 네트워크 요청에서 역직렬화될 때 들어오는 게시 본문 객체에 타입 정보가 없기 때문입니다(이것이 Express와 같은 기본 플랫폼이 작동하는 방식입니다). Class-validator는 앞서 DTO에 대해 정의한 검증 데코레이터를 사용해야 하므로, 이 변환을 수행하여 들어오는 본문을 일반 바닐라 객체가 아닌 적절하게 데코레이트된 객체로 처리해야 합니다.

마지막으로, 앞서 언급했듯이 이것은 검증 파이프이므로 값을 변경하지 않고 반환하거나 예외를 발생시킵니다.

마지막 단계는 `ValidationPipe`를 바인딩하는 것입니다. 파이프는 매개변수 범위, 메서드 범위, 컨트롤러 범위 또는 전역 범위일 수 있습니다. 앞서 Zod 기반 검증 파이프로 메서드 수준에서 파이프를 바인딩하는 예를 보았습니다. 아래 예제에서는 파이프 인스턴스를 라우트 핸들러 `@Body()` 데코레이터에 바인딩하여 게시 본문을 검증하기 위해 파이프가 호출되도록 합니다.

```typescript
// cats.controller.ts
@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
) {
  this.catsService.create(createCatDto);
}
```

매개변수 범위 파이프는 검증 논리가 하나의 지정된 매개변수에만 관련이 있을 때 유용합니다.

## 전역 범위 파이프
`ValidationPipe`가 가능한 한 제네릭하게 생성되었으므로, 전체 애플리케이션의 모든 라우트 핸들러에 적용되도록 전역 범위 파이프로 설정하여 그 완전한 유틸리티를 실현할 수 있습니다.

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

> [!HINT] 하이브리드 앱의 경우 `useGlobalPipes()` 메서드는 게이트웨이 및 마이크로서비스에 대한 파이프를 설정하지 않습니다. "표준"(비하이브리드) 마이크로서비스 앱의 경우 `useGlobalPipes()`는 파이프를 전역적으로 마운트합니다.

전역 파이프는 모든 컨트롤러와 모든 라우트 핸들러에 대해 전체 애플리케이션에서 사용됩니다.

의존성 주입 측면에서, 모듈 외부에서 등록된 전역 파이프(위의 예제에서 `useGlobalPipes()`와 같이)는 바인딩이 모듈의 컨텍스트 외부에서 수행되었기 때문에 종속성을 주입할 수 없습니다. 이 문제를 해결하기 위해 다음 구성을 사용하여 모든 모듈에서 직접 전역 파이프를 설정할 수 있습니다.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

> [!HINT] 이 접근 방식을 사용하여 파이프에 대한 의존성 주입을 수행할 때, 이 구성이 사용되는 모듈에 관계없이 파이프는 실제로 전역적입니다. 어디에서 수행해야 할까요? 파이프(위 예제의 `ValidationPipe`)가 정의된 모듈을 선택하세요. 또한 `useClass`는 커스텀 프로바이더 등록을 처리하는 유일한 방법이 아닙니다. [여기](https://docs.nestjs.com/fundamentals/custom-providers)에서 자세히 알아보세요.

## 내장 ValidationPipe
다시 한 번 상기시켜드리자면, `ValidationPipe`가 Nest에서 즉시 제공되므로 자체적으로 제네릭 검증 파이프를 빌드할 필요가 없습니다. 내장 `ValidationPipe`는 이 장에서 빌드한 샘플보다 더 많은 옵션을 제공합니다. 커스텀 빌드 파이프의 메커니즘을 설명하기 위해 기본으로 유지되었습니다. 전체 세부 정보와 많은 예제는 [여기](https://docs.nestjs.com/techniques/validation)에서 찾을 수 있습니다.

## 변환 사용 사례
검증은 커스텀 파이프의 유일한 사용 사례가 아닙니다. 이 장의 시작 부분에서 파이프가 입력 데이터를 원하는 형식으로 변환할 수도 있다고 언급했습니다. 이는 `transform` 함수에서 반환된 값이 인수의 이전 값을 완전히 재정의하기 때문에 가능합니다.

언제 유용할까요? 클라이언트에서 전달된 데이터가 라우트 핸들러 메서드에서 적절하게 처리되기 전에 일부 변경을 거쳐야 하는 경우가 있습니다. 예를 들어 문자열을 정수로 변환하는 것입니다. 또한 일부 필수 데이터 필드가 누락될 수 있으며 기본값을 적용하고 싶을 수 있습니다. 변환 파이프는 클라이언트 요청과 요청 핸들러 사이에 처리 함수를 개입시켜 이러한 기능을 수행할 수 있습니다.

다음은 문자열을 정수 값으로 구문 분석하는 간단한 `ParseIntPipe`입니다. (위에서 언급했듯이 Nest에는 더 정교한 내장 `ParseIntPipe`가 있습니다. 이것을 커스텀 변환 파이프의 간단한 예로 포함합니다).

```typescript
// parse-int.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

그런 다음 아래와 같이 이 파이프를 선택한 매개변수에 바인딩할 수 있습니다.

```typescript
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return this.catsService.findOne(id);
}
```

또 다른 유용한 변환 사례는 요청에 제공된 ID를 사용하여 데이터베이스에서 기존 사용자 엔티티를 선택하는 것입니다.

```typescript
@Get(':id')
findOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {
  return userEntity;
}
```

이 파이프의 구현은 사용자에게 맡기지만, 다른 모든 변환 파이프와 마찬가지로 입력 값(id)을 받고 출력 값(`UserEntity` 객체)을 반환합니다. 이렇게 하면 보일러플레이트 코드를 핸들러에서 공통 파이프로 추상화하여 코드를 더 선언적이고 DRY하게 만들 수 있습니다.

## 기본값 제공
`Parse*` 파이프는 매개변수의 값이 정의되어 있을 것으로 예상합니다. `null` 또는 `undefined` 값을 받으면 예외를 발생시킵니다. 엔드포인트가 누락된 쿼리 문자열 매개변수 값을 처리할 수 있도록 하려면 `Parse*` 파이프가 이러한 값에 대해 작동하기 전에 주입할 기본값을 제공해야 합니다. `DefaultValuePipe`가 그 목적을 수행합니다. 아래와 같이 관련 `Parse*` 파이프 전에 `@Query()` 데코레이터에서 `DefaultValuePipe`를 간단히 인스턴스화하면 됩니다.

```typescript
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```


> [!NOTE] 이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.