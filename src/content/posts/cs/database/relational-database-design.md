---
title: "관계 데이터베이스 설계"
slug: "relational-database-design"
date: 2025-05-12
tags: ["Database", "DBMS", "SQL", "Normalization"]
category: "CS/Database"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e2a04e26dbb1fbc79e050b412dd7ddd2.png"
draft: false
views: 0
---
# 7장. 관계 데이터베이스 설계

## 학습 목표

- 좋은 관계형 스키마 설계의 원칙을 이해한다
- 함수 종속성의 개념과 역할을 학습한다
- 정규화의 개념과 각 정규형을 파악한다
- 분해와 무손실 조인의 특성을 익힌다
- 다치 종속성과 조인 종속성을 이해한다

## 7.1 설계 문제점

### 나쁜 설계의 문제점

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e2a04e26dbb1fbc79e050b412dd7ddd2.png" alt="image" width="550" />

#### 정보 중복 (Information Redundancy)

- 같은 정보가 여러 곳에 중복 저장
- 저장 공간 낭비
- 데이터 일관성 문제 발생

#### 갱신 이상 (Update Anomaly)

- 중복된 데이터 중 일부만 갱신시 불일치 발생
- 모든 중복 데이터를 찾아서 갱신해야 하는 부담

#### 삽입 이상 (Insertion Anomaly)

- 새로운 정보 삽입시 불필요한 정보도 함께 삽입해야 함
- 필요한 정보가 없으면 삽입 불가능

#### 삭제 이상 (Deletion Anomaly)

- 튜플 삭제시 다른 중요한 정보도 함께 손실
- 의도하지 않은 정보 손실 발생

### 설계 목표

- 정보의 중복을 최소화
- 삽입, 삭제, 갱신 이상을 방지
- NULL 값의 사용을 최소화
- 의미있는 속성들만 하나의 관계에 모음

## 7.2 함수 종속성

### 함수 종속성 정의

#### 함수 종속성 (Functional Dependency)

- X → Y: X가 Y를 함수적으로 결정한다
- X 값이 같으면 Y 값도 반드시 같다
- X는 결정자(Determinant), Y는 종속자(Dependent)

#### 예제

```
학번 → 이름, 주소, 학과
-- 학번이 같으면 이름, 주소, 학과가 반드시 같다

과목번호 → 과목명, 학점
-- 과목번호가 같으면 과목명, 학점이 반드시 같다

(학번, 과목번호) → 성적
-- 학번과 과목번호가 같으면 성적이 반드시 같다
```

### 함수 종속성의 종류

#### 완전 함수 종속성 (Full Functional Dependency)

- 종속자가 결정자 전체에 종속
- 결정자의 일부분으로는 종속자를 결정할 수 없음
- X → Y이고, X의 진부분집합으로는 Y를 결정할 수 없음

#### 부분 함수 종속성 (Partial Functional Dependency)

- 종속자가 결정자의 일부분에만 종속
- 복합키의 일부분만으로도 다른 속성을 결정

#### 이행적 함수 종속성 (Transitive Functional Dependency)

- X → Y, Y → Z이면 X → Z
- 간접적인 종속 관계

### 함수 종속성 추론 규칙

#### 암스트롱 공리 (Armstrong's Axioms)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/09e65e47518dfeffa0f86ace8e246418.png" alt="image" width="550" />

반사 규칙 (Reflexivity)

- Y ⊆ X이면 X → Y

첨가 규칙 (Augmentation)

- X → Y이면 XZ → YZ

이행 규칙 (Transitivity)

- X → Y이고 Y → Z이면 X → Z

#### 추가 규칙

합집합 규칙 (Union)

- X → Y이고 X → Z이면 X → YZ

분해 규칙 (Decomposition)

- X → YZ이면 X → Y이고 X → Z

의사이행 규칙 (Pseudotransitivity)

- X → Y이고 WY → Z이면 WX → Z

### 함수 종속성 폐쇄

#### 속성 집합의 폐쇄 (Closure of Attribute Set)

- F+: 함수 종속성 집합 F로부터 추론할 수 있는 모든 함수 종속성의 집합
- X+: 속성 집합 X로부터 함수적으로 결정되는 모든 속성의 집합

#### 폐쇄 계산 알고리즘

```
알고리즘: X+ 계산
1. result := X
2. repeat
   for each 함수 종속성 Y → Z in F do
     if Y ⊆ result then result := result ∪ Z
   until (result가 더 이상 변하지 않음)
3. return result
```

## 7.3 정규화

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/79ab03ccd3db39c8011ea5b43714a55b.png" alt="image" width="550" />

### 제1정규형 (First Normal Form, 1NF)

#### 정의

- 모든 속성이 원자값(atomic value)을 가져야 함
- 다중값 속성이나 복합 속성을 허용하지 않음
- 관계형 데이터베이스의 기본 조건

#### 1NF 위반 예제

```
Student(학번, 이름, 전화번호)
-- 전화번호가 {010-1234-5678, 02-987-6543}처럼 다중값을 가지면 1NF 위반
```

#### 1NF로 변환

```
Student(학번, 이름)
Student_Phone(학번, 전화번호)
```

### 제2정규형 (Second Normal Form, 2NF)

#### 정의

- 1NF를 만족하고
- 기본키가 아닌 모든 속성이 기본키에 완전 함수 종속
- 부분 함수 종속성을 제거

#### 2NF 위반 예제

```
수강(학번, 과목번호, 성적, 학생이름, 과목명)
-- 기본키: (학번, 과목번호)
-- 학번 → 학생이름 (부분 함수 종속)
-- 과목번호 → 과목명 (부분 함수 종속)
```

#### 2NF로 변환

```
수강(학번, 과목번호, 성적)
학생(학번, 학생이름)
과목(과목번호, 과목명)
```

### 제3정규형 (Third Normal Form, 3NF)

#### 정의

- 2NF를 만족하고
- 기본키가 아닌 모든 속성이 기본키에 직접 종속
- 이행적 함수 종속성을 제거

#### 3NF 위반 예제

```
학생(학번, 이름, 학과번호, 학과명)
-- 학번 → 학과번호 → 학과명 (이행적 종속)
```

#### 3NF로 변환

```
학생(학번, 이름, 학과번호)
학과(학과번호, 학과명)
```

### BCNF (Boyce-Codd Normal Form)

#### 정의

- 3NF를 만족하고
- 모든 결정자가 후보키
- X → Y인 모든 함수 종속성에서 X는 수퍼키

#### BCNF와 3NF의 차이

- 3NF에서 허용되지만 BCNF에서 위반되는 경우
- 후보키가 아닌 속성이 후보키의 일부를 결정하는 경우

#### BCNF 위반 예제

```
강의(교수, 과목, 시간)
-- 함수 종속성: (교수, 과목) → 시간, 시간 → 교수
-- 시간 → 교수에서 시간은 후보키가 아님
```

#### BCNF로 변환

```
강의1(교수, 과목)
강의2(시간, 교수)
```

## 7.4 분해 (Decomposition)

### 무손실 조인 분해 (Lossless Join Decomposition)

#### 정의

- 분해된 관계들을 자연 조인했을 때 원래 관계와 동일
- 정보의 손실이 없는 분해

#### 무손실 조인 조건

R을 R1과 R2로 분해할 때

- R1 ∩ R2 → R1 - R2 또는
- R1 ∩ R2 → R2 - R1
- 공통 속성이 분해된 관계 중 하나에서 키가 되어야 함

### 종속성 보존 분해 (Dependency Preserving Decomposition)

#### 정의

- 원래 관계의 함수 종속성이 분해된 관계들에서도 유지
- 각 함수 종속성을 하나의 관계에서 확인 가능

#### 종속성 보존 조건

- F ⊆ (F1 ∪ F2 ∪ ... ∪ Fn)+
- Fi는 Ri에 투영된 함수 종속성 집합

### 정규화 알고리즘

#### 3NF 분해 알고리즘

```
1. F의 최소 덮개 Fc를 구한다
2. Fc의 각 함수 종속성 X → Y에 대해 관계 스키마 XY를 만든다
3. 어떤 스키마도 R의 후보키를 포함하지 않으면 후보키를 포함하는 스키마 추가
4. 다른 스키마에 포함되는 스키마 제거
```

#### BCNF 분해 알고리즘

```
result := {R}
while (result에 BCNF를 위반하는 스키마 Ri가 있음) do
   Ri에서 BCNF를 위반하는 함수 종속성 X → Y를 찾는다
   Ri를 (Ri - Y)와 (X ∪ Y)로 분해한다
   result := (result - Ri) ∪ {(Ri - Y), (X ∪ Y)}
```

## 7.5 고차 정규형

### 제4정규형 (Fourth Normal Form, 4NF)

#### 다치 종속성 (Multi-valued Dependency)

- X →→ Y: X가 Y를 다치 종속으로 결정
- X 값이 주어지면 Y 값들의 집합이 Z와 무관하게 결정

#### 4NF 정의

- BCNF를 만족하고
- 모든 다치 종속성 X →→ Y에서 X는 수퍼키

#### 4NF 위반 예제

```
학생_과목_취미(학번, 과목, 취미)
-- 학번 →→ 과목 (과목은 취미와 무관)
-- 학번 →→ 취미 (취미는 과목과 무관)
```

#### 4NF로 변환

```
학생_과목(학번, 과목)
학생_취미(학번, 취미)
```

### 제5정규형 (Fifth Normal Form, 5NF)

#### 조인 종속성 (Join Dependency)

- ⋈{R1, R2, ..., Rn}: 관계들의 조인으로 원래 관계를 완전히 복원

#### 5NF 정의

- 4NF를 만족하고
- 모든 조인 종속성이 후보키에 의해 함축

## 7.6 설계 과정

### 데이터베이스 설계 단계

1. 요구사항 분석
    - 사용자 요구사항 수집
    - 데이터와 응용 파악
2. 개념적 설계
    - ER 모델링
    - 개념적 스키마 작성
3. 논리적 설계
    - 관계형 모델로 변환
    - 정규화 수행
4. 물리적 설계
    - 저장 구조 결정
    - 인덱스 설계

### 정규화의 장단점

#### 장점

- 데이터 중복 최소화
- 갱신 이상 방지
- 저장 공간 효율성
- 데이터 일관성 보장

#### 단점

- 조인 연산 증가
- 질의 성능 저하 가능
- 복잡한 스키마 구조

### 반정규화 (Denormalization)

#### 개념

- 성능 향상을 위해 의도적으로 정규화 규칙을 위반
- 조회 성능과 데이터 일관성 사이의 트레이드오프

#### 반정규화 기법

- 테이블 병합
- 중복 컬럼 추가
- 파생 컬럼 추가
- 요약 테이블 생성

## 마치며

> 이 글은 이상호 교수님의 [데이터베이스 I 이론 및 실제 교재](https://product.kyobobook.co.kr/detail/S000001918597)를 토대로 공부한 내용을 정리한 것입니다.