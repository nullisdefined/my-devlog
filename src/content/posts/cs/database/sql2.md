---
title: "SQL2"
slug: "sql2"
date: 2025-04-28
tags: ["Database", "DBMS", "SQL", "Oracle", "Join", "GroupBy"]
category: "CS/Database"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a9eb3eec458968e0a3f88a28115a0d53.png"
draft: false
---
# 5장. SQL2 (고급 SQL)

## 학습 목표

- 집계 함수의 종류와 사용법을 이해한다  
- GROUP BY와 HAVING 절의 활용법을 학습한다  
- 다양한 조인 연산을 익힌다  
- 집합 연산과 나눔 연산을 파악한다  
- 고급 SQL 기법을 활용한 복잡한 질의 작성법을 학습한다  

## 5.1 집계 함수

### 집계 함수

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a9eb3eec458968e0a3f88a28115a0d53.png)

- avg: 평균  
- min: 최소값  
- max: 최대값  
- sum: 합계  
- count: 개수  

집계 함수는 테이블의 속성 값들에 대해 연산을 수행하고 하나의 결과를 반환한다.

### 집계 함수 예제  

```sql

-- student 테이블의 튜플 수

SELECT count(*) FROM student;

  

-- CS 학과 교수들의 평균, 최대, 최소 급여

SELECT avg(salary), max(salary), min(salary)

FROM professor

WHERE deptName = 'CS';

  

-- 2010년 봄 학기에 강의한 서로 다른 교수 수

SELECT count(distinct pID)

FROM teaches

WHERE semester = 'Spring' AND year = 2010;

```

- `count(*)`는 튜플 전체 개수를 반환하며, `count(distinct column)`은 중복을 제거한 고유 값의 개수를 반환한다

### GROUP BY 절

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1846e1fd6f1cc0290386b0a3d763b0c0.png)

```sql
-- 학과별 교수 수
SELECT deptName, count(*)
FROM professor
GROUP BY deptName;

-- 학과별 교수 급여 평균
SELECT deptName, avg(salary)
FROM professor
GROUP BY deptName;
```

- GROUP BY는 특정 속성 기준으로 그룹을 나눈 후, 각 그룹에 대해 집계함수를 적용한다
- SELECT 절에 포함된 집계 함수 외의 속성은 반드시 GROUP BY 절에도 포함되어야 한다
  
```sql
-- 오류 예시: pID는 GROUP BY에 포함되지 않았기 때문에 오류 발생
SELECT deptName, pID, avg(salary)
FROM professor
GROUP BY deptName;

-- 허용되는 예시: deptName은 GROUP BY에만 포함되고 SELECT에는 없어도 된다
SELECT avg(salary)
FROM professor
GROUP BY deptName;
```

### HAVING 절

```sql
SELECT deptName, avg(salary)
FROM professor
GROUP BY deptName
HAVING avg(salary) > 6900;
```

### 널 값과 집계 함수

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1bf960972ad69133e467d79bbe1da30c.png)

```sql
SELECT sum(salary)
FROM professor;
```

## 5.2 조인 테이블

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/34ebcabe0b12c3804cc48225345bf7f1.png)

### 조인 테이블 개요

- 조인 연산은 두 테이블을 받아 하나의 결과 테이블을 생성
- INNER JOIN과 다양한 OUTER JOIN을 사용할 수 있음

### 조인 조건과 예제

```sql
myCourse INNER JOIN myPrereq ON myCourse.cID = myPrereq.cID
```

#### 결과 예시

| cID     | title     | deptName | credit | prereqCID |
|---------|-----------|----------|--------|-----------|
| BIO-301 | Genetics  | Biology  | 4      | BIO-101   |
| CS-301  | DB        | CS       | 4      | CS-101    |

```sql
myCourse LEFT OUTER JOIN myPrereq ON myCourse.cID = myPrereq.cID
```

| cID     | title     | deptName | credit | prereqCID |
|---------|-----------|----------|--------|-----------|
| BIO-301 | Genetics  | Biology  | 4      | BIO-101   |
| CS-301  | DB        | CS       | 4      | CS-101    |
| CS-302  | AI        | CS       | 3      | NULL      |

## 5.3 집합 연산

### 집합 연산

```sql
-- 합집합
SELECT cID FROM teaches WHERE semester = 'Fall' AND year = 2009
UNION
SELECT cID FROM teaches WHERE semester = 'Fall' AND year = 2010;

-- 교집합
SELECT cID FROM teaches WHERE semester = 'Fall' AND year = 2009
INTERSECT
SELECT cID FROM teaches WHERE semester = 'Fall' AND year = 2010;

-- 차집합
SELECT cID FROM teaches WHERE semester = 'Fall' AND year = 2009
EXCEPT
SELECT cID FROM teaches WHERE semester = 'Fall' AND year = 2010;
```

- 중복을 포함하려면 `UNION ALL`, `INTERSECT ALL`, `EXCEPT ALL`을 사용

## 5.4 널 값

### 널 값의 의미

- 값이 존재하지 않음을 의미하며, 정보 부족 또는 확정되지 않은 상태를 나타냄

### 세 값 논리

- NULL이 포함된 비교는 `UNKNOWN`을 반환
- WHERE 절에서 `UNKNOWN`은 `FALSE`처럼 취급되어 결과에서 제외됨

#### 예시

```sql
-- NULL 비교 예
SELECT * FROM student WHERE grade = NULL;      -- 항상 false
SELECT * FROM student WHERE grade IS NULL;     -- 올바른 비교
```

## 마무리

> 이 글은 이상호 교수님의 [데이터베이스 I 이론 및 실제 교재](https://product.kyobobook.co.kr/detail/S000001918597)를 토대로 공부한 내용을 정리한 것입니다.