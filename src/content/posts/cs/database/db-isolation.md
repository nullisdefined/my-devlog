---
title: "고립성(Isolation)"
slug: "db-isolation"
date: 2024-12-17
tags: ["Database", "Transaction", "ACID"]
category: "CS/Database"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/98f9ddf7db0683bb64d464f595df87f7.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/98f9ddf7db0683bb64d464f595df87f7.png)


데이터베이스 트랜잭션의 ACID 특성 중 세 번째인 고립성(Isolation)은 **동시성 환경에서 발생하는 데이터의 불일치를 방지**하기 위한 중요한 특성이다. 고립성은 여러 트랜잭션이 **동시**에 실행될 때 서로의 영향을 받지 않고 **독립적**으로 처리되도록 보장한다. 다음은 고립성이 필요한 이유와 읽기 현상(Read Phenomena), 그리고 이를 해결하기 위한 고립 수준(Isolation Levels)을 정리한 내용이다.

## 고립성(Isolation)이란?
- 고립성은 트랜잭션이 실행되는 동안 다른 트랜잭션의 변경 사항이 보이지 않도록 보장하는 속성이다.
- 여러 사용자가 동시에 데이터를 읽거나 변경할 때 발생하는 데이터 불일치를 방지하기 위한 메커니즘이다.

## 읽기 현상(Read Phenomena)
읽기 현상이란 트랜잭션의 동시성 문제로 인해 발생할 수 있는 현상을 의미하며, 발생할 수 있는 읽기 현상은 다음과 같다.

1. **더티 읽기(Dirty Read)**
	- 아직 커밋되지 않은 다른 트랜잭션의 변경 사항을 읽는 현상
	- 만약 해당 트랜잭션이 롤백되면 읽은 데이터는 무효화된다.
	- e.g. 한 트랜잭션이 데이터를 변경했지만 아직 커밋하지 않은 상태에서 다른 트랜잭션이 그 데이터를 읽는 경우
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/866976c64b306718cc6865d69fc5d49d.png)

2. **Non-Repeatable Read**
	- 같은 트랜잭션 내에서 동일한 데이터를 여러 번 읽었을 때, 읽은 값이 변경되는 현상
	- 다른 트랜잭션이 해당 데이터를 업데이트하고 커밋한 경우 발생한다.
	- e.g. 첫 번째 읽기 후 다른 트랜잭션이 데이터를 수정하여 두 번째 읽기에서 값이 달라지는 상황
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/af343141e7f86efff00797fbbd4e029c.png)

3. **유령 읽기(Phantom Read)**
	- 트랜잭션이 범위 쿼리를 실행할 때, 다른 트랜잭션이 새로운 행을 삽입하여 결과에 영향을 주는 현상
	- e.g. 범위 쿼리에서 특정 조건에 맞는 행을 읽었는데, 다른 트랜잭션이 새로운 행을 추가하여 재실행 시 결과가 달라지는 경우
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d4d44ac5ae4f26aa2b0ecc6f5c907591.png)

4. **Lost Updates**
	- 두 개의 트랜잭션이 동일한 데이터를 읽고 수정한 후 커밋할 때, 한 트랜잭션의 업데이트가 덮어쓰기되어 사라지는 현상
	- e.g. 두 트랜잭션이 동시에 데이터를 업데이트하고 마지막 트랜잭션이 이전의 변경 사항을 덮어쓰는 상황

## 고립 수준(Isolation Levels)
읽기 현상을 방지하기 위해 고안된 SQL의 고립 수준은 다음과 같다.
1. Read Uncommitted(커밋되지 않은 읽기)
	- 다른 트랜잭션의 커밋되지 않은 변경 사항도 읽을 수 있다.
	- 더티 읽기가 발생할 수 있다.
	- 성능은 좋지만 데이터 일관성이 떨어진다.
2. Read Committed(커밋된 읽기)
	- 다른 트랜잭션의 커밋된 데이터만 읽을 수 있다.
	- 더티 읽기는 방지하지만, Non-Repeatable Read와 유령 읽기는 여전히 발생할 수 있다.
	- 많은 DBMS의 기본 고립 수준이다.
3. Repeatable Read(반복 가능한 읽기)
	- 동일한 트랜잭션 내에서는 같은 데이터를 반복해서 읽어도 동일한 값을 보장한다.
	- Non-Repeatable Read를 방지하지만, 유령 읽기는 여전히 발생할 수 있다.
4. Serializable(직렬화)
	- 가장 엄격한 고립 수준으로, 모든 트랜잭션이 순차적으로 실행된 것처럼 동작한다.
	- 더티 읽기,Non-Repeatable Read, 유령 읽기를 모두 방지한다.
	- 성능이 가장 낮고, 비용이 많이 든다.
5. Snapshot Isolation(스냅샷 고립)
	- 트랜잭션 시작 시점의 일관된 스냅샷을 기준으로 데이터를 읽는다.
	- MVCC(Multi-Version Concurrency Control)를 통해 구현되며, Postgres의 Repeatable Read는 Snapshop Isolation과 동일하다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3bf9f4f0310b87cd2beb245bb34d52e8.png)
*[Wikipedia: Isolation (database systems)](https://en.wikipedia.org/wiki/Isolation_(database_systems))*

## 고립성 구현 방식
고립성을 구현하는 방식은 다음과 같다.
1. 비관적 동시성 제어
	- 잠금(Locking)을 사용하여 다른 트랜잭션이 특정 데이터를 읽거나 수정하지 못하게 한다.
	- 행 잠금(Row Lock), 테이블 잠금(Table Lock) 등이 있다.
	- 단점: 성능 저하 및 교착 상태(Deadlock) 발생 가능성
2. 낙관적 동시성 제어
	- 잠금을 사용하지 않고 트랜잭션이 완료된 후 충돌 여부를 검증한다.
	- 충돌이 감지되면 트랜잭션을 롤백하고 재시도한다.
	- 성능은 좋지만, 재시도가 필요할 수 있다.

## 마치며
고립성은 데이터베이스 트랜잭션이 다른 트랜잭션과 독립적으로 실행되도록 보장하여 데이터의 일관성을 유지하는 중요한 특성이다. 그러나 동시성 환경에서 발생할 수 있는 더티 읽기, Non-Repeatable Read, 유령 읽기, Lost Updates와 같은 문제를 해결하기 위해 고립 수준이 도입되었다.
각 데이터베이스 시스템은 고립 수준을 서로 다르게 구현하며, 비관적 동시성 제어와 낙관적 동시성 제어를 통해 성능과 데이터 일관성 사이의 균형을 맞춘다. 상황에 맞는 고립 수준을 선택하고 구현하여 데이터베이스 성능과 안정성을 유지할 수 있다.

## 참고 자료
- [A beginner’s guide to ACID and database transactions](https://mbagrat.com/database/acid-atomicity-consistency-isolation-durability/)


> [!NOTE] 이 글은 Udemy의 [【한글자막】 데이터베이스 엔지니어링 ( Database Engineering ) 마스터하기!](https://www.udemy.com/course/database-engineering-korean/)강의를 토대로 공부한 내용을 정리한 것입니다.