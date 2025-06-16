---
title: "ER 모델"
slug: "database-design"
date: 2025-05-05
tags: ["Database", "DBMS", "ERD"]
category: "CS/Database"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/32a452c922eb2e81ffa06799956fa0a5.png"
draft: false
---
# 6장. 데이터베이스 설계 (ER 모델)

## 학습 목표

- Entity-Relationship 모델의 기본 개념을 이해한다
- 엔터티, 관계, 속성의 정의와 특징을 학습한다
- ER 다이어그램 작성 방법을 익힌다
- 제약조건과 카디널리티를 파악한다
- ER 모델을 관계형 모델로 변환하는 방법을 학습한다

## 6.1 ER 모델 개요

### Entity-Relationship 모델

- 데이터베이스 설계를 위한 개념적 모델링 도구
- 1976년 Peter Chen에 의해 제안
- 현실 세계의 정보를 엔터티, 관계, 속성으로 표현
- 데이터베이스 설계의 초기 단계에서 사용

### ER 모델의 구성 요소

#### 엔터티 (Entity)
- 현실 세계에서 독립적으로 존재하는 객체나 개념
- 다른 엔터티와 구별되는 고유한 특성을 가짐
- 예: 학생, 교수, 과목, 부서

#### 관계 (Relationship)
- 둘 이상의 엔터티 간의 연관성
- 엔터티들 사이의 의미 있는 연결
- 예: 학생이 과목을 수강, 교수가 과목을 강의

#### 속성 (Attribute)
- 엔터티나 관계가 가지는 특성이나 성질
- 예: 학생의 학번, 이름, 주소

## 6.2 ER 다이어그램

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/32a452c922eb2e81ffa06799956fa0a5.png)

### ER 다이어그램 기호

- 엔터티: 사각형
- 관계: 다이아몬드
- 속성: 타원 (기본키는 밑줄)
- 연결선: 엔터티와 관계, 속성 연결

### 속성의 종류

- 단순 속성: 더 이상 분해되지 않음 (예: 학번)
- 복합 속성: 여러 속성으로 구성 (예: 주소)
- 단일값 속성: 하나의 값 (예: 이름)
- 다중값 속성: 여러 값 (예: 전화번호) → 이중 타원
- 유도 속성: 계산으로 도출 (예: 나이) → 점선 타원

## 6.3 엔터티와 엔터티 집합

### 엔터티 집합
- 같은 타입의 엔터티들

### 강한 vs 약한 엔터티

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/710aec2776e23dc3d456e3c23bb72697.png)


- 강한 엔터티: 기본키 있음, 독립 존재
- 약한 엔터티: 기본키 없음, 다른 엔터티에 의존
- 약한 엔터티는 이중 사각형, 식별 관계는 이중 다이아몬드

## 6.4 관계와 관계 집합

### 관계 집합
- 동일한 타입의 관계들

### 관계의 차수
- 이진: 두 엔터티 (가장 일반적)
- 삼진: 세 엔터티
- n진: n개 엔터티

### 관계의 카디널리티

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/71978b18d8a3a1f62e755b2bef5f423f.png)

- 1:1 (예: 부서-부서장)
- 1:N (예: 교수-학생)
- M:N (예: 학생-과목)

### 참여 제약조건

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0df9464aaedad8a9e2eba66f4b3287f1.png)

- 전체 참여: 모든 엔터티가 관계에 참여 (이중선)
- 부분 참여: 일부만 참여 (단일선)

## 6.5 ER 다이어그램 작성 예제

### 대학 데이터베이스 예제

![image|600](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c72ec828ae038b7314eeddc4ad7d50cc.png)

엔터티:
- 학생(학번, 이름, 주소, 전화번호)
- 교수(교수번호, 이름, 급여, 연구분야)
- 과목(과목번호, 과목명, 학점)
- 학과(학과번호, 학과명, 건물, 예산)

관계:
- 수강(학생-과목, M:N)
- 강의(교수-과목, 1:N)
- 소속(학생-학과, N:1)
- 근무(교수-학과, N:1)

### ER 설계 단계

1. 요구사항 분석
2. 엔터티 식별
3. 관계 식별
4. 속성 정의
5. 제약조건 설정

## 6.6 ER 모델을 관계형 모델로 변환

### 변환 규칙

- 강한 엔터티 → 테이블로 변환 (속성 포함)
- 약한 엔터티 → 외래키와 부분키로 구성된 테이블
- 1:1 → 한쪽에 외래키
- 1:N → N 쪽에 외래키
- M:N → 별도 관계 테이블 생성
- 다중값 속성 → 별도 테이블 생성

### 변환 예제

학생 엔터티 →  
```sql
Student(학번, 이름, 시, 구, 동)
Student_Phone(학번, 전화번호)
```

수강 관계 →  
```sql
Takes(학번, 과목번호, 성적, 수강년도)
-- 기본키: (학번, 과목번호)
-- 외래키: 학번 → Student, 과목번호 → Course
```

## 6.7 확장된 ER 모델

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d05628f379509d052a6b5fadfddde6b5.png)

- 특수화: 상위 엔터티를 하위 엔터티로 나눔 (ISA)
- 일반화: 하위 엔터티의 공통 특성을 상위로 추상화
- 집합: 관계를 하나의 엔터티처럼 표현

## 마무리

> 이 글은 이상호 교수님의 [데이터베이스 I 이론 및 실제 교재](https://product.kyobobook.co.kr/detail/S000001918597)를 토대로 공부한 내용을 정리한 것입니다.