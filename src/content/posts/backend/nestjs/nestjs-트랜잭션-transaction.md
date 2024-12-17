---
title: "[NestJS] 트랜잭션(Transaction)"
date: 2024-12-15
tags: ["NestJS", "Transaction"]
category: "Backend/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png)
트랜잭션은 데이터베이스에서 논리적인 작업 단위를 구성하는 하나의 연산 집합을 의미한다. 모든 작업이 성공적으로 완료되면 데이터를 저장(commit)하고, 하나의 작업이라도 실패하면 이전 상태로 되돌린다(rollback). 이를 통해 데이터의 무결성과 일관성을 보장할 수 있다.

## 트랜잭션의 주요 특징(ACID)
1. **원자성(Atomicity)**: 작업이 모두 성공하거나 모두 실패해야 함
2. **일관성(Consistency)**: 트랜잭션이 끝난 후 데이터베이스는 일관된 상태를 유지해야 함
3. **고립성(Isolation)**: 하나의 트랜잭션이 완료되기 전까지 다른 트랜잭션이 접근할 수 없음
4. **지속성(Durability)**: 트랜잭션이 성공적으로 완료되면 그 결과는 영구적으로 반영됨

## 왜 트랜잭션을 사용하는가?
트랜잭션은 다음과 같은 상황에서 필수적이다:
- **데이터 무결성 보장**: 여러 작업이 포함된 연산에서 일부 작업만 성공할 경우 데이터 일관성이 깨질 수 있음
- **에러 복구**: 시스템 오류나 장애가 발생했을 때 데이터 상태를 이전 상태로 복구할 수 있음
- **동시성 문제 방지**: 다수의 사용자가 동일한 데이터를 수정할 때 발생할 수 있는 충돌을 방지함

## NestJS에서 트랜잭션 사용 방법
ORM 종류에 따라 트랜잭션을 적용하는 방식이 달라진다. 가장 대중적인 `TypeORM`은 `QueryRunner`를 사용하여 트랜잭션을 관리한다. `QueryRunner`를 통해 트랜잭션을 시작하고, 작업을 수행하며, 성공 시 커밋하거나 실패 시 롤백할 수 있다.

### 코드 예시
아래는 현재 진행 중인 프로젝트의 서비스 코드 일부분이다. `queryRunner`를 생성하고 `connect()`로 데이터베이스에 연결, `startTransaction()`으로 트랜잭션을 시작할 수 있다. 작업 후 성공적으로 커밋하거나 중간에 오류가 있다면 롤백된다.
```ts title:schedule.service.ts
async createSchedule(
  userUuid: string,
  createScheduleDto: CreateScheduleDto,
): Promise<ResponseScheduleDto> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const category = await queryRunner.manager.findOne(Category, {
      where: { categoryId: createScheduleDto.categoryId ?? 7 },
    });

    if (!category) {
      throw new NotFoundException('해당 카테고리가 존재하지 않습니다.');
    }

    const schedule = queryRunner.manager.create(Schedule, {
      ...createScheduleDto,
      userUuid,
      category,
    });

    const savedSchedule = await queryRunner.manager.save(Schedule, schedule);

    await queryRunner.commitTransaction();

    return this.convertToResponseDto(savedSchedule);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

```

하지만 여러 메서드에 트랜잭션을 적용하다보니 중복 코드가 발생했고, 가독성이 저하되었다. 다른 메서드에도 트랜잭션이 필요한 경우 또 동일한 패턴의 코드를 반복 작성해야 하는 상황이 생겼다. 

## 래핑(wrapping) 메서드를 활용한 트랜잭션 관리 코드
### 래핑 메서드 정의
```ts
private async withTransaction<T>(
  callback: (queryRunner: QueryRunner) => Promise<T>,
): Promise<T> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await callback(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

```

### 적용한 코드 예시
```ts title:schedule.service.ts
async createScheduleWithWrapping(
  userUuid: string,
  createScheduleDto: CreateScheduleDto,
): Promise<ResponseScheduleDto> {
  return this.withTransaction(async (queryRunner) => {
    const category = await queryRunner.manager.findOne(Category, {
      where: { categoryId: createScheduleDto.categoryId ?? 7 },
    });

    if (!category) {
      throw new NotFoundException('해당 카테고리가 존재하지 않습니다.');
    }

    const schedule = queryRunner.manager.create(Schedule, {
      ...createScheduleDto,
      userUuid,
      category,
    });

    const savedSchedule = await queryRunner.manager.save(Schedule, schedule);

    return this.convertToResponseDto(savedSchedule);
  });
}

```

트랜잭션 관리 로직이 `withTransaction` 래핑 메서드로 추상화되어 비즈니스 로직에만 집중할 수 있게 되었다. 또한 다른 메서드에서도 동일한 방식으로 트랜잭션 관리를 처리할 수 있어 재사용성이 늘었다.

## typeorm-transactional 라이브러리 활용
중복되는 트랜잭션 코드 문제를 해결하기 위해 커뮤니티에서 제공하는 라이브러리를 활용할 수도 있다. 대표적인 예로 [typeorm-transactional-cls-hooked](https://www.npmjs.com/package/typeorm-transactional-cls-hooked) 라이브러리가 있다. 이 라이브러리를 사용하면, 메서드에 간단한 데코레이터를 붙여 트랜잭션 범위를 선언할 수 있으며, 메서드 내에서 발생하는 모든 데이터베이스 연산이 하나의 트랜잭션으로 처리된다.

```ts
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class SomeService {
  @Transactional()
  async doSomethingTransactional() {
    // 이 메서드 내의 모든 DB 연산은 트랜잭션 범위에서 실행
  }
}

```

매번 QueryRunner를 생성하고 관리하는 코드를 작성할 필요가 없어지며, 가독성과 유지보수성이 향상된다.

또한 신기하게도 데코레이터를 사용한 해당 메서드 코드 안에 다른 서비스의 메서드를 호출하고, 그 메서드에서 DB 연산이 이뤄진다면, 이 연산들도 동일한 트랜잭션 안에 포함된다. 이 메커니즘은 CLS(Continuation Local Storage)를 통해 구현되며, 트랜잭션을 시작하는 메서드와 그로부터 호출되는 다른 서비스의 메서드들이 동일한 요청 흐름 내에서 실행될 경우, 모두 동일한 트랜잭션 매니저를 참조하게 된다.

정리하자면 다음과 같다:
- **트랜잭션 컨텍스트 공유**:  
    `@Transactional()` 데코레이터가 붙은 메서드가 트랜잭션을 시작하면, 라이브러리는 CLS를 사용하여 현재 실행 흐름(context)에 트랜잭션 매니저(또는 EntityManager)를 저장한다.
- **하위 호출 메서드의 DB 연산 처리**:  
    만약 이 메서드 내부에서 다른 서비스의 메서드를 호출하고, 그 메서드에서도 DB 연산(예: `repository.save()`, `manager.find()`)을 수행한다면, 해당 DB 연산들은 CLS를 통해 전달받은 동일한 트랜잭션 매니저를 사용하게 된다. 즉, 호출한 측 메서드와 호출받은 측 메서드 간의 DB 조작 모두 한 트랜잭션 안에서 처리된다.
- **에러 발생 시 롤백**:  
    트랜잭션 범위 내에서 어디서 에러가 발생하든, 최종적으로 `@Transactional()` 메서드가 정상 종료되지 않고 에러를 던진다면 트랜잭션은 롤백된다. 다른 서비스에서 일어난 DB 연산이라 할지라도 모두 동일한 트랜잭션 범위 안에 있으므로 하나의 원자적 연산 단위로 취급된다.

## typeorm-test-transactions 라이브러리 활용
`typeorm-test-transactions` 라이브러리를 활용해서 `typeorm-transactional`로 구현된 트랜잭션을 테스트해보자.