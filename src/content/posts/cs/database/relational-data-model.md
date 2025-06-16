---
title: "관계형 데이터 모델"
slug: "relational-data-model"
date: 2025-04-07
tags: ["Database", "RelationalAlgebra"]
category: "CS/Database"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0c4e3564f81c421b75c7949ab712eb9d.png"
draft: false
---
# 2장. 관계형 데이터 모델
## 학습 목표

- 관계형 데이터 모델의 핵심 개념을 이해한다
- 관계, 속성, 도메인의 개념을 파악한다
- 키(Key)의 종류와 역할을 학습한다
- 참조 무결성 제약조건을 이해한다
- 관계 대수의 기본 연산을 익힌다

## 2.1 관계형 데이터 모델

### 개요

- **관계형 데이터 모델은 1970년 수학자 E.F.Codd에 의하여 최초로 제안**
- **관계형 데이터 모델은 데이터베이스를 관계의 무결성 제약의 응용으로 표현**

### 관계 예제

#### Student 관계의 예

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0c4e3564f81c421b75c7949ab712eb9d.png)

- **student 관계의 예제**
- **관계형 데이터 모델에서 의미하는 관계는 테이블 형태**
- **student는 7개의 속성과 5개의 튜플을 가지고 있음**

### 동일한 용어

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2c27517cf850e4f30176aa07fff2f012.png)

- **관계 = 테이블, 릴레이션 = 레코드, 속성 = 칼럼**

### 속성

- **각 속성은 속성 값으로 허용할 수 있는 원자 값들의 집합을 가지며, 이를 도메인이라고 함**
- **속성 값은 해당 도메인의 원소**
- **속성 도메인에 속하는 값은 원자값이어야 함**
- **각 도메인은 null 값이 속하는 것을 의미하는 null 값을 포함할 수 있다고 가정**

### 모든 속성 값은 원자 값이어야 한다

- **관계형 모델에서 모든 속성 값은 원자 값이어야 함(더 이상 분해될 수 없는 값)**
- **정수, 실수, 문자, 문자열, 시간, 날짜, 타임스탬프 등을 원자 값으로 분류**
- **집합, 백, 리스트는 원자 값이 아님**
- **집합은 중복 없음, 순서 없음**
- **백은 중복 허용, 순서 없음**
- **리스트는 중복 허용, 순서 있음**

### 관계 스키마 및 인스턴스

#### 관계 스키마

- **관계 스키마는 관계 이름과 속성명 나열을 의미**
- **관계 인스턴스는 관계 스키마가 정의되면 거기에 적합한 값들의 조합**

#### student 관계의 예

**student(sID, name, gender, deptName, year, GPA, totalCredit)은 관계 스키마이며, 관계 인스턴스는 5개의 튜플이다.**

### 관계형 데이터베이스

- **관계형 데이터베이스 시스템에서 데이터베이스는 관계들의 집합으로 구성되고 정의**
- **무결성 제약은 다양한 형태가 존재**
    - **키 제약(주 키는 중복된 값을 가지지 않아야 함)**
    - **엔터티 제약(주 키는 null 값을 가지지 않아야 함)**

## 2.2 샘플 대학교 데이터베이스

### Schema Diagram

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/80b8c1627eebb1d4314895af022dfffb.png)

### 테이블 간 관계 설명

- **밑줄이 있는 속성은 해당 테이블의 주 키(Primary Key)**
- **밑줄이 없는 속성 중에서 다른 테이블을 참조하는 속성이 외래 키(Foreign Key)**
- **예: teaches 테이블의 cID 속성은 course 테이블의 cID를 참조하는 외래 키**

## 2.3 관계 대수

### 관계 대수란?

- **관계 대수는 관계형 데이터 모델의 원리를 자료 처리 관점에서 정의한 관계 처리 전용 연산**
- **관계 대수는 관계에 대한 다수 개의 간단한 연산을 제공하고, 사용자는 관계 대수를 이용하여 데이터베이스로부터 구하고자 하는 정보를 데이터베이스 시스템에 요청할 수 있다**
- **관계 대수를 연산으로 하나 혹은 둘 이상의 관계를 연산 대상으로 하며, 관계를 반환하는 연산이다**
- **관계 대수는 직접적으로 사용자에게 지원되지 않고, SQL 언어를 사용하여 지원**
- **관계 대수는 데이터베이스 시스템 내부에서 사용되는 언어이며, 사용자에게 직접 보이지는 않는다**

### 선택 연산 예제

#### σ(sigma) -> 선택 연산: σp(r)

- **선택 연산은 주어진 관계에서 주어진 조건을 만족하는 튜플들을 선정**
- **p는 선택 조건을 의미, r은 관계를 의미**

선택 연산 사례

#### σ(sigma) -> 선택 연산: σp(r)

- **선택 연산은 주어진 관계에서 주어진 조건을 만족하는 튜플들 선정**

#### 선택 연산 사례

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7e21ff038ef507bf3857a0b12559bff7.png)


### 투영 연산 예제

#### π(pi) -> 투영 연산: π(p)

- **투영 연산은 관계에서 임의의 속성을 선택하는 연산**
- **투영 후에 중복된 튜플이 생기면, 결과 관계에는 동일한 튜플이 두 번 이상 나타나지 않는다**

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a91acc7da85f6c5cdcb6a9c409e85284.png)

### 합집합 연산 예제

#### ∪ → 합집합 연산: r ∪ s

- **두 개의 관계에서 모든 튜플을 포함하는 연산**
- **중복 튜플은 결과 관계에서 제거되어, 결과 관계는 유일한 튜플들로 구성**

#### 합집합 연산 조건

- **r ∪ s = {t | t ∈ r or t ∈ s}**
- **For r ∪ s to be valid:**
- **r, s must have the same arity (same number of attributes)**
- **attribute domains must be compatible**

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/088703471704098d510ff6f5e9adfbaf.png)

### 차집합 연산

#### − → 차집합 연산: r − s

- **차집합 연산은 commutative하지 않으므로 r−s와 s−r 연산 결과는 다르다**

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/48ece83d477b8d512b4f954660a89c86.png)

**Example: 2014년 가을에 가르치는 과목 중에서 2015년 봄에는 가르치지 않는 과목**

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e52e3e0a832dc55ebd4b5c386e266b42.png)

### 카티시안곱 연산 예제

#### × -> 카티시안곱 연산: r × s

- **카티시안곱 연산의 결과에는 모든 가능한 r과 s의 튜플 조합이 포함**

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2b470a6cb102fa444cd19d7bc56d2f68.png)

### 재명명 연산

#### ρ(rho) -> 재명명 연산

- **재명명 연산은 관계 이름이나 속성 이름을 변경하는 연산**
- **X를 관계명으로, A1, ..., An을 속성명으로 나타냄**
- **관계명만 또는 속성명만 재명명이 가능**

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5320f841e10a129a6bae5bb89f8bf809.png)

### 관계 대수식

- **상기 나타난 관계 대수 6개가 기본적인 관계 대수 연산**
- **이들을 조합하여 복잡한 질의를 표현할 수 있음**

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0d822405954ccf13d49f6269ca2aee38.png)

## 2.4 추가 관계 대수

### 추가 관계 대수

- **추가되는 관계 대수는 기본 관계 대수를 이용하여 표현이 가능함**
- **교집합 연산, 할당 연산, 자연 조인, 외부 조인, 나눔 연산에 대하여 살펴봄**

### 교집합 연산

- **교집합 연산**: r ∩ s = r − (r − s)
- **두 관계에 공통으로 포함된 튜플들을 반환**

### 할당 연산

- **할당 연산은 복잡한 질의문을 작성할 때 중간 관계 표현을 임시로 저장할 수 있음**


## 마무리

> 이 글은 이상호 교수님의 [데이터베이스 I 이론 및 실제 교재](https://product.kyobobook.co.kr/detail/S000001918597)를 토대로 공부한 내용을 정리한 것입니다.