---
title: "[NestJS] 데코레이터(Decorator)"
slug: "nestjs-decorator"
date: 2024-12-15
tags: ["NestJS", "Decorator", "Pipe"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png)
NestJS는 데코레이터를 활용하여 라우트, 파라미터, 메타데이터 등을 선언적으로 정의할 수 있는 기능을 제공한다. 데코레이터가 무엇인지, 그리고 실제 프로젝트에서 유용하게 사용할 수 있는 커스텀 데코레이터(Custom Decorator)를 만드는 과정을 소개한다.

## 데코레이터란?
**데코레이터는 **클래스, 메서드, 프로퍼티, 파라미터에 추가적인 동작을 부여하는 데 사용되는 특수한 함수**다. NestJS는 TypeScript의 데코레이터를 기반으로 작동하며, 다음과 같은 목적에 사용할 수 있다**:
- **HTTP 요청 처리 간소화**: 요청 객체에서 값을 추출하거나 특정 동작을 추가
- **코드 가독성 향상**: 중복 코드를 줄이고, 선언적으로 로직을 정의
- **메타데이터 설정**: 클래스나 메서드에 메타데이터를 추가해 다양한 동작을 구현

#### 메타데이터(Metadata)
- 데이터를 설명하는 데이터
- NestJS에서는 데코레이터를 통해 클래스, 메서드, 파라미터 등에 메타데이터를 추가하고, 런타임에 이를 활용함 e.g. `@GET`, `@POST`, `@ApiTags`, `@Controller` 등

## NestJS 기본 제공 데코레이터
NestJS에서 다음과 같은 기본 데코레이터를 제공한다. 이 데코레이터들은 Express(또는 Fastify)를 추상화하여 요청(req), 응답(res) 객체를 쉽게 다룰 수 있도록 돕는다.

| 데코레이터        | 설명        | 해당하는 Express 객체 |
| ------------ | --------- | --------------- |
| `@Body()`    | 요청 본문 데이터 | `req.body`      |
| `@Param()`   | 경로 파라미터   | `req.params`    |
| `@Query()`   | 쿼리 문자열    | `req.query`     |
| `@Headers()` | 요청 헤더     | `req.headers`   |
| `@Req()`     | 요청 객체 전체  | `req`           |
| `@Res()`     | 응답 객체 전체  | `res`           |

## 커스텀 데코레이터 구현하기

### 커스텀 데코레이터란?
NestJS는 기본 제공 데코레이터 이외에도 커스텀 데코레이터를 만들어 프로젝트 요구사항에 맞는 동작을 정의할 수 있다. 예를 들어, 요청 객체에서 특정 프로퍼티를 추출하거나 검증하는 과정을 추가할 수 있다.

### e.g. `@GetUserUuid` 데코레이터
다음은 인증된 사용자의 `userUuid`를 req 객체에서 추출하는 커스텀 데코레이터다.
```ts title:get-user-uuid.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserUuid = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest(); // HTTP 요청 객체 가져오기
    const user = request.user; // 인증된 사용자 정보

    // userUuid가 없는 경우 에러 발생
    if (!user || !user.userUuid) {
      throw new Error('userUuid를 찾을 수 없습니다. 인증이 필요합니다.');
    }

    return user.userUuid; // userUuid 반환
  },
);
```
- `data`는 데코레이터를 호출할 때 전달받는 값
- `ctx`는 요청 컨텍스트로, 요청 객체(`req`)를 가져올 수 있음
- `data`가 있으면 요청 객체의 `user` 속성에서 해당 필드만 반환하고, 없으면 `user` 객체 전체를 반환

컨트롤러에서 `@GetUserUuid`를 사용하여 간결하게 `userUuid`를 추출할 수 있다.

변경 전: `req` 객체에 직접 접근
```ts title:schedule.controller.ts
  @Get('all')
  @ApiOperation({
    summary: '사용자의 모든 일정 조회',
    description: '사용자의 반복 일정을 포함한 전후 1년의 일정을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '일정 조회 성공',
    type: [ResponseScheduleDto],
  })
  async getAllSchedulesByUserUuid(@Req() req): Promise<ResponseScheduleDto[]> {
    const userUuid = req.user.userUuid
    return this.schedulesService.findAllByUserUuid(userUuid)
  }
```

변경 후: 커스텀 데코레이터 사용
```ts title:schedule.controller.ts
  @Get('all')
  @ApiOperation({
    summary: '사용자의 모든 일정 조회',
    description: '사용자의 반복 일정을 포함한 전후 1년의 일정을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '일정 조회 성공',
    type: [ResponseScheduleDto],
  })
  async getAllSchedulesByUserUuid(
    @GetUserUuid() userUuid: string,
  ): Promise<ResponseScheduleDto[]> {
    return this.schedulesService.findAllByUserUuid(userUuid)
  }
```

**결과**:
- 요청이 들어오면 `@GetUserUuid` 데코레이터가 req 객체에서 `userUuid`를 추출해 `getAllSchedulesByUserUuid` 메서드의 `userUuid` 파라미터로 전달한다.
- 코드의 가독성이 좋아지고 중복 코드가 줄어든다.

## 데코레이터 활용하기

### 1. 데이터 전달
커스텀 데코레이터는 팩토리 함수를 통해 데이터를 전달받아 동적으로 동작할 수 있다. 아래는 req 객체의 특정 프로퍼티를 추출하는 예시다.
```ts
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user; // 전달받은 data로 특정 속성 추출
  },
);
```

컨트롤러에서 사용
```ts
@Get('profile')
async getProfile(@User('name') name: string) {
  console.log(`${name}님, 안녕하세요.`);
  return { name };
}
```

### 2. 다른 파이프와 조합
데코레이터는 파이프와 결합하여 값을 검증(validate)하거나 변환(transform)할 수 있다. `validateCustomDecorators: true` 옵션을 통해 `ValidationPipe`가 커스텀 데코레이터의 값을 검증하도록 설정
```ts
@Get('profile')
async getProfile(
  @GetUserUuid(new ValidationPipe({ validateCustomDecorators: true }))
  userUuid: string,
) {
  console.log(`Validated User UUID: ${userUuid}`);
}
```

### 3. 다른 데코레이터와 조합
`applyDecorators`를 사용하여 여러 데코레이터를 하나로 묶을 수 있다. 아래는 여러 API 문서화 데코레이터를 하나의 함수로 묶어 재사용성을 높인 코드다.
```ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiDocumentation(summary: string, description: string) {
  return applyDecorators(
    ApiOperation({ summary, description }), // API 설명
    ApiResponse({ status: 200, description: '요청 성공' }), // 성공 응답
    ApiResponse({ status: 400, description: '잘못된 요청' }), // 잘못된 요청
    ApiResponse({ status: 500, description: '서버 에러' }), // 서버 에러
  );
}

@Get('docs')
@ApiDocumentation('문서 조회', 'API 문서 정보를 조회합니다.')
getDocs() {
  return 'API Documentation';
}

@Get('users')
@ApiDocumentation('사용자 조회', '모든 사용자를 조회합니다.')
getUsers() {
  return 'User List';
}
```

### 참고 자료

> [!NOTE] - [NestJS 공식문서](https://docs.nestjs.com/custom-decorators)