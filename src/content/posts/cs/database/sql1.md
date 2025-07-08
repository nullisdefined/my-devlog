---
title: "SQL1"
slug: "sql1"
date: 2025-04-21
tags: ["Database", "DBMS", "SQL"]
category: "CS/Database"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1748b43f0a1ae437b388415e734aabea.png"
draft: false
views: 0
---
# 3장. SQL1 (기본 SQL)

## 학습 목표

- 데이터베이스 언어의 종류와 특징을 이해한다
- DDL을 이용한 테이블 생성과 수정 방법을 학습한다
- DML을 이용한 데이터 조작 방법을 익힌다
- SELECT 문의 기본 구조를 파악한다
- WHERE절, FROM절을 활용한 질의 작성법을 학습한다

## 3.1 데이터베이스 언어

### 데이터베이스 언어

- 데이터베이스 시스템은 사용자와의 의사소통을 위하여 데이터베이스 언어 제공
- 사용자는 데이터베이스 언어를 이용하여 사용자의 요구사항을 데이터베이스 시스템에 표현
- 데이터베이스 언어를 기능적 관점에서 표현방식에 관련하여 분류

### 기능적 관점: DDL, DML, DCL로 구분

#### DDL (Data Definition Language)

- 데이터베이스 언어의 기능 중 데이터베이스 스키마에 대한 조작을 담당하는 명령
- 스키마 생성, 삭제, 변경 등을 담당
- 데이터베이스 시스템은 스키마에 대한 정보를 데이터 사전에 저장/관리하므로, DDL 실행결과는 데이터 사전에 반영
- DDL은 스키마에 관련되는 도메인, 데이터 무결성 조건 등을 표현할 수 있는 기능을 제공

#### DML (Data Manipulation Language)

- 데이터베이스 인스턴스를 조작하는 언어
- 인스턴스의 생성, 조회, 삭제, 변경 등의 기능을 사용자에게 제공
- 사용자는 DML을 이용하여 질의를 생성하여 데이터베이스 시스템에 전달/검색함. DML을 질의어라고도 함

#### DCL (Data Control Language)

- 데이터베이스 시스템의 데이터에 대한 인증/접근, 트랜잭션 시작/종료, 시간/지속, 세션 시작/종료, 회복 및 복구 기능, 데이터 접근 보안 및 권한, 사용자 제한 관리 등

### 질의처리, 비절차적 언어

- 질의 처리기
- 우리가 작성한 SQL문을 DB가 이해할 수 있는 저수준 연산으로 변환하는 역할

### 저장 관리자

- 데이터가 저장되는 실제 하드디스크에서 데이터를 읽고 쓰고 관리하는 일을 담당

### 관계형 데이터베이스 언어

- 관계형 데이터베이스 언어는 이론적으로 개발되어 있지만 실제 시스템은 구현되지 않았으며, 대부분은 상업적 관계형 데이터베이스 시스템에 구현되지 않았다
- 세 가지 언어는 질의 표현력 면에서 세 언어 간의 표현 능력의 정도가 동일하여 이론적으로 동등함
- 상용 시스템 또는 시제품 시스템에 구현되어 있는 언어는 SQL, QUEL, Query by Example, LDL 등이 있다

### SQL 개요

- 관계형 데이터베이스 모델을 위한 데이터베이스 언어
- SQL은 기능적으로는 DDL, DML, DCL을 모두 포함하는 언어

### SQL 역사

- 1967년: 최초 개발 시작
- 1968년: 발전 과정

### 표준화 단계

- 1968년: 표준화 작업 시작

## 3.2 DDL SQL

### DDL SQL

- SQL 언어의 DDL 부문을 이용하여 관계 테이블 생성하는데 사용하는 기능을 제공
- 관계 스키마
- 속성의 도메인
- 무결성 제약
- 관계에 연관되는 인덱스
- 관계 자료을 위한 디스크 상의 물리적 구조
- 관계에 연관되는 보안 및 권한 부여/취소

### SQL 명령은 대소문자 구분이 없다

- SQL 명령은 대소문자 구별이 없으며, 문자열 내에서는 대소문자를 구분한다
- 세미콜론(;)으로 문장 종료

### SQL 도메인 타입

#### 표준 SQL2와 오라클에 있는 데이터 타입

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1748b43f0a1ae437b388415e734aabea.png" alt="image" width="550" />

- char(n): Fixed-length character string with length n
    
- varchar(n): Variable-length character string with maximum length n
    
- int: Integer
    
- smallint: Small integer
    
- numeric(p,d): Fixed point number with precision of p digits, with d digits to the right of decimal point
    
- real, double precision: Floating point and double-precision floating point numbers
    
- float(n): Floating point number with precision of at least n digits
    
- 표준 SQL2와 오라클에 있는 데이터 타입들
    
- 문자열, 가변길이 문자열, 정수, 작은 정수, 고정소수점, 실수
    
- 정수 및 작은 정수는 특정 범위의 값만 가질 수 있는 정수에 해당한다 (e.g. varchar 대신 varchar2, Numeric(p,d) 대신 decimal(p,d) 또는 number(p,d))
    
- numeric타입은 숫자형 전체 자릿수를 지정하여 데이터형 정밀도 및 범위를 설정. p는 유효숫자 개수이고, d는 소수점 이하 자릿수(e.g. numeric(5,2) ⇒ xxx.xx)
    
- 상용 데이터베이스 시스템은 자체적으로 새로운 데이터 타입 제공
- 각각 (e.g. varchar 대신 varchar2 타입 사용, Numeric(p,d) 대신 decimal(p,d) 또는 number(p,d))
    
### 테이블 생성

- create table 문장은 새로운 테이블을 정의하여 생성

#### 테이블 생성 예제

```sql
Create table professor (
    pID         char(5),
    name        varchar(20) not null,
    deptName    varchar(20),
    salary      numeric(8,2));

Insert into professor values ('10', 'Lee', 'CS', 7500);
Insert into professor values ('11', 'Choi', 'CS', 7000);
```

- 두 번째 속성은 널 값을 허용하지 않는 not null 무결성 제약을 가지고 있음
- insert 문장은 professor 테이블에 튜플을 추가하는 명령

### 무결성 제약 (Integrity Constraints)

대표적인 무결성 제약에는 다음과 같은 것들이 있다.

- not null: 속성에 NULL 값이 저장되지 않도록 제한함
- primary key: 테이블에서 각 튜플을 고유하게 식별하는 키로, NOT NULL과 UNIQUE 제약을 동시에 가짐
- foreign key: 다른 테이블의 기본키를 참조하여 참조 무결성을 유지

예를 들어, pID를 기본키로 지정하고, deptName 속성이 department 테이블을 참조하도록 하려면 다음과 같이 외래키 제약을 정의한다.

```sql
CONSTRAINT myFirstForeignKey FOREIGN KEY (deptName) REFERENCES department;
```

#### 무결성 제약 생성 및 삭제

무결성 제약은 테이블 생성 시 지정할 수 있을 뿐 아니라, 이후 ALTER 문을 사용해 추가하거나 DROP 문으로 제거할 수도 있다.
이는 student, teaches 등 다른 테이블에도 동일하게 적용된다.

#### 값의 범위 제한

예를 들어 student 테이블에서 gender 속성이 'F' 또는 'M' 값만 가질 수 있도록 제한하려면, CHECK 제약을 사용한다.

```sql
gender CHAR(1) CHECK (gender IN ('F', 'M'))
```

참고로 외래키는 다른 테이블의 기본키나 유일키만 참조할 수 있다. 예를 들어 다음과 같은 외래키는 허용되지 않는다.

```sql
-- 올바르지 않은 예시
FOREIGN KEY (deptName) REFERENCES professor(pID)
```

이는 professor(pID)가 deptName과 직접적인 관계를 갖지 않기 때문이다.

## 3.3 DML SQL

### DML(Data Manipulation Language) SQL

- SQL 언어에서 DML 기능을 하는 주요 명령어는 다음 4가지
	1. SELECT
	2. INSERT
	3. DELETE
	4. UPDATE
- 이 중 SELECT 문이 가장 복잡한 기능을 수행한다

### 데이터 입력(insert)

데이터베이스 테이블에 새로운 데이터를 추가하는 연산이다

```sql
Insert into course values ('437', 'Advanced Databases', 'CS', 4);
```

- NULL을 명시하면 해당 속성에는 **값이 없는 상태**로 저장된다
- NULL은 SQL에서 **특별한 의미를 가지는 값**
- INSERT는 **SELECT-FROM-WHERE 절**과 함께 사용하여 다른 테이블에서 데이터를 가져와 삽입할 수도 있다

```sql
Insert into professor select * from professor_2;
```

위 문장은 professor_2 테이블의 모든 데이터를 professor 테이블로 복사하는 문장이다.
즉, 테이블 간 테이블 복사가 가능하다.

### 데이터 삭제(delete)

```sql
Delete from professor; -- to delete all professor tuples
Delete from professor where deptName='EE';
-- to delete all EE professors from the professor table
```

- DELETE 명령어는 테이블의 튜플(행)을 삭제하는 기능
- 주의할 점은, DELETE는 데이터만 삭제하며 테이블 자체는 유지된다
- 테이블 구조 자체를 삭제하려면 DROP 명령어를 사용해야 한다
    
WHERE 절을 통해 삭제 조건을 명확히 지정하지 않으면, 전체 행이 삭제될 수 있으므로 주의해야 한다.

### 데이터 갱신(update)

```sql
-- Increase salaries of professors whose salary is over 7000 by 3%, and all others receive a 5% raise

Update professor
    set salary = salary*1.03
    where salary > 7000;
Update professor
    set salary = salary*1.05
    where salary <= 7000;
```

- 위 예제는 **급여가 7000 이상인 교수에게는 3%, 이하인 교수에게는 5% 인상**을 적용한 예시
- 하지만, UPDATE 문의 순서에 따라 앞서 갱신된 값에 영향을 줄 수 있으므로 주의가 필요하다
	→ 이를 해결하기 위해 CASE 문을 활용한 단일 갱신 문으로도 작성할 수 있다

```sql
Update professor
set salary = case
    when salary <= 7000 then salary*1.05
    else salary*1.03
end;
```

## 3.4 Select SQL 문장

### SELECT 기본 구조

SELECT 문장은 총 **6개의 절**로 구성될 수 있으며, 실행 순서에 유의해야 한다.
  
> **실행 순서**:
> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY

```sql
SELECT title, name
FROM professor, teaches, course
WHERE teaches.cID = course.cID
  AND teaches.pID = professor.pID
  AND course.deptName = 'CS';
```

- FROM 절: 필요한 **테이블들을 나열**하고, 카티시안 곱(Cartesian Product)을 수행
- WHERE 절: 조인 조건 및 선택 조건을 적용
- GROUP BY 절: 그룹별로 데이터를 묶음
- HAVING 절: 그룹에 조건 적용
- SELECT 절: 최종 출력할 속성 선택
- ORDER BY 절: 결과 정렬

    ### WHERE 절

- 특정 조건을 만족하는 튜플만 필터링한다

```sql
SELECT name, cID
FROM professor, teaches
WHERE professor.pID = teaches.pID;
```

- 논리 연산자: AND, OR, NOT 사용 가능
- SQL에서 조건식은 관계대수의 선택연산(σ)에 대응된다

### JOIN

- 여러 테이블 간 관계를 기반으로 데이터를 결합한다

```sql
SELECT title, name
FROM professor, teaches, course
WHERE teaches.cID = course.cID
  AND teaches.pID = professor.pID;
```

- professor.pID = teaches.pID: 동등 조인(equi-join)
- SQL에서는 WHERE 절에서 조인 조건을 명시하거나, JOIN ... ON 구문을 사용할 수 있다
- > 또는 < 와 같은 조건을 활용하면 Theta-Join 가능

### AS

```sql
SELECT sID, name AS myName, deptName
FROM student;
```

- AS 키워드를 이용해 출력 컬럼명 또는 테이블 이름을 재정의할 수 있다
- AS는 생략 가능하지만, 공백 없이 정확히 명시해야 오류를 피할 수 있다

### 문자열 연산

```sql
SELECT name
FROM professor
WHERE name LIKE '%da%';
```

- LIKE 연산자를 사용해 문자열 패턴 매칭 가능
	- %: 임의 길이의 문자열
	- \_: 한 글자
- 문자열 연결, 대소문자 변환, 부분 문자열 추출 등 다양한 내장 함수도 지원한다

### ORDER BY

```sql
SELECT name, deptName
FROM professor
ORDER BY deptName DESC, name;
```

- 결과 튜플을 지정한 컬럼 기준으로 정렬
- DESC로 내림차순, 기본은 오름차순(ASC)
- 다중 기준 정렬 가능 (e.g. 학과 기준으로 내림차순, 이름 기준으로 오름차순)

### WHERE 절의 추가 연산자

- BETWEEN, IN, EXISTS 등 다양한 연산자를 사용할 수 있다
- 튜플 비교도 가능하며 서브쿼리와 함께 응용할 수 있다

### 중복 제거와 집합 연산

- SQL은 중복 튜플을 허용한다
- SELECT DISTINCT로 중복을 제거할 수 있다
- 집합 연산
	- UNION: 합집합
	- INTERSECT: 교집합
	- EXCEPT 또는 MINUS: 차집합

집합 연산을 사용하려면 SELECT 절의 컬럼 수와 타입이 같아야 한다

## 마무리

> 이 글은 이상호 교수님의 [데이터베이스 I 이론 및 실제 교재](https://product.kyobobook.co.kr/detail/S000001918597)를 토대로 공부한 내용을 정리한 것입니다.