---
title: "SQL1"
slug: "sql1"
date: 2025-04-21
tags: ["Database", "DBMS", "SQL", "Oracle"]
category: "CS/Database"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f43c80d23e5108e341f51d9ca9dd9e39.png"
draft: false
views: 0
---
# 4장. 오라클 실습 1

## 학습 목표
- 오라클 DBMS 서버 설치와 환경 구성을 이해한다
- 개발 도구의 종류와 사용법을 학습한다
- 사용자 생성과 권한 관리 방법을 익힌다
- 첫 번째 데이터베이스와 테이블 생성을 실습한다
- 오라클의 특징적인 기능들을 파악한다

## 4.1 설치

### 오라클 DBMS 서버
- DBMS 시스템은 대규모 소프트웨어이다
- 오라클 데이터베이스 시스템의 버전명인 i, g, c는 각각 internet, grid, cloud를 의미한다

### 개발 도구

#### SQL\*Plus: a basic command-line interface
- 기본적인 명령줄 인터페이스

#### Oracle SQL Developer
- GUI 환경을 제공하는 무료 개발 도구
- 데이터베이스 객체 탐색, SQL 문 실행, 스크립트 실행, PL/SQL 편집 및 디버깅 등이 가능

#### Oracle Application Express (APEX)
- 가장 널리 사용되는 데이터베이스 응용 프로그램 개발 도구

#### Oracle Forms, Oracle Reports, Oracle JDeveloper
- DBMS 설치 후 컴파일하여 사용하려면 설치 시 제공되는 도구가 필요하다
- SQL\*Plus와 Oracle SQL Developer는 SQL 실습에 적합하며, SQL Developer는 GUI 환경으로 사용이 쉽다
- APEX는 데이터베이스 기반의 응용 개발을 지원하는 도구이다

### 설치 및 DBA 계정
- 오라클의 대표적인 DBA 계정은 system과 sys 두 가지가 있으며, 설치 중에 이들의 비밀번호를 설정해야 한다
- system 계정은 일반적인 DBA 작업을 수행할 수 있다
- sys 계정은 데이터 사전과 관련된 고급 작업을 수행할 수 있으며, 시스템 운영 권한이 있다
- 일반적인 작업은 system 계정을 사용한다

### DBA로 사용자 생성하기
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f43c80d23e5108e341f51d9ca9dd9e39.png" alt="image" width="550" />


```sql
**Connect the server as DBA ('sys' account) and do following**:

Create user C##hodori identified by tooshytotell 
default TABLESPACE users
temporary TABLESPACE temp;

Grant connect, resource to C##hodori;
```

- DBA 권한을 가진 계정으로 접속한 후 새로운 사용자를 생성하고 필요한 권한을 부여한다

## 4.2 첫 DB 만들기

### 테이블 만들기
```sql
Create table firstTable (
    id          char(13) primary key,
    name        varchar(30),
    height      numeric(4,1));

Insert into firstTable values ('11', 'Hong Gildong', 165.3);
Insert into firstTable values ('22', 'Lee Chulsoo', 175.4);
Insert into firstTable values ('33', 'Kim Younghee', 167.5);
```

- SQL 문장은 대소문자를 구별하지 않는다. 단, 문자열 리터럴 내부의 문자는 대소문자를 구별한다
- 작성한 SQL 문장은 .sql 확장자를 가진 ASCII 파일로 저장해두면 재사용이 가능하다

### 외래키와 데이터 입력
```sql
Create table temp1 (
    deptName    char(10) primary key,
    address     char(20));

Create table temp2 (
    name        char(10) primary key,
    dept        char(10),
    constraint c1 foreign key (dept) references temp1);
```

- 먼저 temp1 테이블에 데이터를 삽입한 후 temp2 테이블에 데이터를 삽입할 수 있다
- 또는 외래키 제약을 나중에 추가하거나 임시로 비활성화할 수 있다

```sql
Alter table temp2 add constraint c1 foreign key (dept) references temp1;
Alter table temp2 disable constraint c1;
```

### 외래키와 데이터 입력 예제 1
```sql
R = (A, B, C, D)    S = (B, D, E)
r × s = {t | t ∈ r and t ∈ s}

myCourseCID  title    deptName   credit   myPrereq cID  prereqCID
BIO-301      Genetics Biology    4        BIO-301      BIO-101
CS-301       DB       CS         4        CS-301       CS-101
```

- 자연 조인은 조인 조건을 명시하지 않아도, 두 테이블에서 이름이 동일한 속성을 기준으로 조인이 수행된다
- 동일한 속성 값을 가진 튜플들만 결합된다

### 자연 조인 예제 2
```sql
Retrieve professor names who teach in the Fall semester of 2020 together with the course titles that the professors teach

myCourse ← DeptName=title, title ∩ deptName(Course)(course)
Πname,title(σsemester="Fall" ∧ year = 2020(professor) ⋈ teaches ⋈ myCourse)
```


> [!NOTE] - 2020년 가을 학기에 강의한 교수 이름과 해당 교과목 제목을 검색하는 예시
- teaches 관계에서 조건을 먼저 필터링한 후 조인을 수행한다

## 4.3 Oracle SQLs

### 데이터 사전
- 데이터 사전은 데이터베이스에 대한 메타데이터(테이블, 속성, 인덱스 등)를 관리한다
- 사용자는 데이터 사전을 통해 시스템 정보를 확인할 수 있다
- 오라클은 데이터 사전을 SGA의 dictionary cache에 보관하여 빠른 접근을 제공한다
- 데이터 사전은 DBA가 소유하며, 일반 사용자는 SELECT 문으로만 접근 가능하다
- 시스템 성능 정보를 담은 동적 성능 테이블은 V$ 접두사로 제공되며, 일반 사용자도 접근 가능하다

#### View prefixes
| prefix | scope                          |
| ------ | ------------------------------ |
| USER   | 사용자의 스키마에 있는 객체 정보             |
| ALL    | 사용자가 접근 가능한 모든 객체 정보           |
| DBA    | 모든 사용자의 객체 정보를 포함 (DBA만 접근 가능) |
```sql
Select * from user_objects;
Select * from user_tables;
Select * from user_sequences;
Select * from user_indexes;
Select * from user_views;
Select * from user_constraints;

describe user_objects;
```

- 접두사(user, all, dba)에 따라 다른 범위의 객체 정보를 확인할 수 있다
- describe 명령은 테이블 또는 뷰의 스키마 정보를 확인하는 데 사용한다

### 시퀀스
```sql
Create sequence sequ1 start with 10 increment by 10;
Alter sequence sequ1 maxvalue 10000;

Select sequ1.nextval, sequ1.currval from dual;

Create table dept1 (
    deptno number(4) primary key,
    dname varchar2(30));

Insert into dept1 values(sequ1.nextval, 'Software');
Insert into dept1 values(sequ1.nextval, 'Hardware');

Drop sequence sequ1;
```

- 시퀀스는 여러 사용자가 동시에 유일한 숫자를 생성할 수 있도록 해주는 객체이다
- 시퀀스는 테이블과 직접 연결되지는 않으며, nextval을 통해 값을 생성한다
- 생성된 시퀀스 값은 트랜잭션의 성공 여부와 관계없이 유일성이 유지된다

### 데이터 타입
- 오라클의 varchar2는 최대 4000바이트까지 저장 가능하다
- 사용자가 varchar로 정의하더라도 오라클은 내부적으로 varchar2로 처리한다

### 오라클에서의 널 값과 공스트링
```sql
Create table myTable (
    ID      number,
    name    varchar2(100));

Insert into myTable(ID, name) values (100, null);
Insert into myTable(ID, name) values (200, '');

Select count(*) from myTable where name='';    -- 결과: 0
Select count(*) from myTable where name is null; -- 결과: 2
```

- 오라클에서는 공스트링(’’)도 NULL로 간주한다
- 따라서 name='' 조건으로는 결과가 나오지 않으며, name IS NULL 조건을 사용해야 한다


> [!NOTE] 이 글은 이상호 교수님의 [데이터베이스 I 이론 및 실제 교재](https://product.kyobobook.co.kr/detail/S000001918597)를 토대로 공부한 내용을 정리한 것입니다.