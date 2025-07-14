---
title: "[NestJS] Query Parameter Boolean 변환에서 발생한 이슈"
slug: "nestjs-query-parameter-boolean-transformation-issue"
date: 2025-07-14
tags: ["NestJS", "Pipe", "DTO", "Decorator"]
category: "Backend/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png)

## 문제 상황

현재 진행하고 있는 사이드 프로젝트 백엔드 애플리케이션의 알림 API 기능 구현에서 `unreadOnly=false` 쿼리 파라미터를 전달해도 미읽음 알림만 조회되는 버그가 발생했다.

**예상 동작:**
- `GET /notifications?unreadOnly=true` → 미읽음 알림만 조회
- `GET /notifications?unreadOnly=false` → 모든 알림 조회

**실제 동작:**
- `GET /notifications?unreadOnly=true` → 미읽음 알림만 조회
- `GET /notifications?unreadOnly=false` → 미읽음 알림만 조회

## 원인 분석

### 1. 코드 확인

코드를 분석한 결과 DTO 코드에서 문제가 발생한다는 것을 알게되었다.

```typescript
export class GetNotificationsDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)  // 문제 지점
  unreadOnly?: boolean;
}
```

`@Type(() => Boolean)`은 class-transformer가 문자열을 Boolean으로 변환하기 위해 사용된다.

HTTP의 쿼리 파라미터는 항상 문자열로 전달된다.
다시 말해, `unreadOnly=true`은 문자열 `"true"`를, `unreadOnly=false`는 문자열 `"false"`를 전달하는 것이다.

그래서 최종적으로 다음과 같이 동작한다.

```typescript
Boolean("true")   // true
Boolean("false")  // true
Boolean("")       // false
Boolean("0")      // true
Boolean("1")      // true
```

JavaScript에서 빈 문자열이 아닌 모든 문자열은 truthy하기 때문에 `"false"` 문자열도 `true`로 변환된다.



### 2. 서비스 로직 확인

```typescript
if (unreadOnly) {
  queryBuilder.andWhere('notification.isRead = :isRead', { isRead: false });
}
```

→ 문자열 `"false"`가 `true`로 변환되어 항상 미읽음 조건이 적용된 것

## 해결

### 1. Transform 데코레이터 사용
즉, 직관적으로 명시적 변환을 사용하는 방법이다.

```typescript
import { Transform } from 'class-transformer';

export class GetNotificationsDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  unreadOnly?: boolean;
}
```

### 2. 동작 테스트

```bash
# 테스트 케이스
curl "http://localhost:3000/notifications?unreadOnly=true"   # 미읽음 알림 조회
curl "http://localhost:3000/notifications?unreadOnly=false"  # 모든 알림 조회
curl "http://localhost:3000/notifications"
```

## 다른 해결방안

다른 해결책도 있어 정리해보았다.

### 방법 1: 컨트롤러에서 ParseBoolPipe 사용

```typescript
@Get()
getNotifications(
  @Query('unreadOnly', new ParseBoolPipe({ optional: true })) 
  unreadOnly?: boolean,
) {
  // ...
}
```

NestJS에서 기본으로 제공하는 파이프를 사용하는 것이다.
문자열 `"true"`를 `true`로, `"false"`를 `false`로 자동 변환한다.

### 방법 2: 문자열 enum 방식으로 리팩토링

```typescript
enum ReadStatus {
  ALL = 'all',
  UNREAD_ONLY = 'unread_only'
}

export class GetNotificationsDto {
  @IsOptional()
  @IsEnum(ReadStatus)
  readStatus?: ReadStatus = ReadStatus.ALL;
}
```

쿼리 파라미터의 문자열을 그대로 문자열 enum으로 사용하는 방식인데 확장성을 가진다는 점에서 좋다.
예를 들어, 추후 알림 상태가 읽음, 미읽음, 보관됨(archived), 삭제됨(deleted) 등으로 확장될 수도 있기 때문에, API의 상태 필터는 초기부터 enum으로 설계해두는 것이 유연할 수 있다.

## 정리

1. 항상 HTTP 쿼리 파라미터는 항상 문자열임을 인지하고 적절한 변환 로직을 구현해야 한다
2. `@Type(() => Boolean)`은 문자열 `"false"`를 올바르게 변환하지 못하며 명시적인 변환 로직이 필요하다
3. Boolean 타입 쿼리 파라미터 처리시 `@Transform` 데코레이터를 사용하는 것이 좋다
4. 엣지 케이스에 대한 테스트 코드의 작성으로 이런 버그를 예방하는 습관을 들이는 것이 좋겠다