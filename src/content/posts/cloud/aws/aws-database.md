---
title: "AWS - Database"
slug: "aws-database"
date: 2025-06-23
tags: ["RDB", "EC2", "RDS", "Redis", "DynamoDB", "ElastiCache", "MemoryDB", "DocumentDB", "Keyspaces", "Neptune", "Timestream", "QLDB"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a069e2871f8756716b84b6fa1ebd080d.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a069e2871f8756716b84b6fa1ebd080d.png)

클라우드 환경에서 애플리케이션을 개발할 때 적절한 데이터베이스를 선택하는 것이 중요하다. AWS는 다양한 워크로드에 최적화된 15개 이상의 데이터베이스 서비스를 제공하며, 각각은 고유한 특징과 장단점을 가지고 있다. 다음은 AWS의 주요 데이터베이스 서비스들을 실무 관점에서 비교하고, 어떤 상황에서 어떤 데이터베이스를 선택해야 하는지를 정리한 내용이다.

## 데이터베이스의 발전: 온프레미스에서 클라우드로

### 전통적인 관계형 DB

1970년대부터 기업들은 관계형 데이터베이스를 기본으로 사용해왔다. 관계형 DB는 데이터를 테이블로 정리하고, 테이블 간의 관계를 통해 복잡한 데이터 구조를 표현한다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/018ae22c6297c4772dd9e11e2e120243.png" alt="image" width="600" />

위 그림처럼 도서 테이블, 판매 테이블, 저자 테이블이 '저자' 속성으로 연결되어 있다. 이런 구조 덕분에 "특정 저자의 책이 얼마나 팔렸는지"와 같은 복잡한 질문에 SQL로 쉽게 답할 수 있다.

### 관계형 DB의 특징

|**장점**|**단점**|
|---|---|
|복잡한 SQL 조인으로 데이터 분석 가능|고정된 스키마로 유연성 부족|
|ACID 원칙으로 데이터 무결성 보장|수평적 확장이 어려움|
|개발자들에게 친숙한 SQL 사용|대용량 비정형 데이터 처리 한계|
|중복성 감소로 저장 공간 효율적|실시간 대규모 트래픽 처리 어려움|

## 클라우드 시대의 DB 운영 방식

### 비관리형 vs 관리형 DB

AWS에서 데이터베이스를 운영하는 방식은 크게 두 가지로 나뉜다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b129cee147e4cd60478890733c743c06.png" alt="image" width="600" />

1. **비관리형 DB (EC2에서 직접 설치)**

EC2 인스턴스에 MySQL, PostgreSQL 등을 직접 설치하고 운영하는 방식이다.

**장점:**
- 완전한 제어권 확보
- 특수한 설정이나 튜닝 가능
- 기존 온프레미스와 동일한 환경 구성

**단점:**
- 모든 관리 작업을 직접 수행
- 패치, 백업, 복구 등 운영 부담
- 고가용성 구성이 복잡함

2. **관리형 DB (Amazon RDS)**

AWS가 인프라와 데이터베이스 관리를 대신해주는 서비스다.

**AWS가 관리해주는 것들:**
- 하드웨어 프로비저닝
- 데이터베이스 설치 및 설정
- 자동 백업 및 복구
- 소프트웨어 패치
- 고가용성 구성

**남은 사용자가 해야 할 일:**
- 스키마 설계
- 쿼리 최적화
- 인덱스 관리
- 보안 설정

특별한 이유가 없다면 관리형 서비스를 선택하는 것이 좋다. 인프라 관리에 들어가는 시간과 비용을 비즈니스 로직 개발에 투자할 수 있기 때문이다.

## Amazon RDS

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/25028d44a550e4bdfd67b075a22b0da7.png" alt="image" width="600" />

### RDS가 지원하는 DB 엔진

|**유형**|**데이터베이스**|**특징**|
|---|---|---|
|**상용**|Oracle, SQL Server|기업 환경에서 검증된 안정성|
|**오픈소스**|MySQL, PostgreSQL, MariaDB|비용 효율적, 커뮤니티 지원|
|**클라우드 네이티브**|Amazon Aurora|AWS 최적화, 최고 성능|
### RDS 구성 요소

#### 1. DB 인스턴스

DB 인스턴스는 데이터베이스 엔진이 실행되는 격리된 클라우드 환경이다. EC2와 비슷하지만, 데이터베이스 운영에 최적화되어 있다.

**인스턴스 클래스 선택 기준:**
- **범용 (m5, m6)**: 대부분의 워크로드에 적합
- **메모리 최적화 (r5, r6i)**: 대용량 데이터를 메모리에서 처리
- **버스트 가능 (t3, t4g)**: 간헐적 부하가 있는 개발/테스트 환경

#### 2. 스토리지 옵션

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6d25afa41dc5e76526b68911fb536c9b.png" alt="image" width="600" />

1. **범용 SSD (gp3)**
	- 대부분의 워크로드에 적합
	- 비용 효율적
	- 최대 16,000 IOPS
2. **프로비저닝된 IOPS (io1)**
	- 높은 I/O 성능 필요 시
	- 일관된 성능 보장
	- 최대 64,000 IOPS
3. 마그네틱
	- 레거시 옵션
	- 매우 저렴
	- 성능이 중요하지 않은 경우만
	- 현재는 거의 사용하지 않음

> 여기서 IOPS는 Input/Output Operations Per Second의 약자로 초당 입출력 작업 횟수를 의미한다.

### 고가용성을 위한 다중 AZ 배포

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/82e46b367fb1b3c9e67542436f244f68.png" alt="image" width="600" />

그림과 같이, 장애를 대비한 고가용성을 위한 RDS를 여러 군데에 복제해서 운영하는 구조다.

**📌 아키텍처 개요:**

**정상 상태:**

```txt
App → DNS (db.example.com) → Primary DB (AZ-A)
                                    ↓ 동기 복제
                              Standby DB (AZ-B)
```

**장애 발생 시:**

```txt
App → DNS (db.example.com) → Primary DB (AZ-A) ❌
                                    ↓ 자동 장애 조치 (Failover)
                              New Primary DB (AZ-B) ✅
```

| **구성 요소**                  | **설명**                                             |
| -------------------------- | -------------------------------------------------- |
| **가용 영역 1 (AZ1)**          | RDS의 **기본 인스턴스 (Primary)**가 위치. 모든 쓰기 작업은 여기서 처리됨  |
| **가용 영역 2 (AZ2)**          | **대기 인스턴스 (Standby)**가 위치. 실시간 복제만 받고, 쓰기 요청은 안 받음 |
| **프라이빗 서브넷**               | 보안을 위해 퍼블릭이 아닌 내부망에서 동작하는 DB 환경.                   |
| **VPC**                    | 가상 네트워크. 애플리케이션과 DB가 이 안에서 통신함                     |
| **쓰기 작업(Write Operation)** | 오직 기본 인스턴스(RDS 기본)만 처리 가능함                         |

**작동 방식:**

1. 기본 DB 인스턴스가 모든 읽기/쓰기 처리
2. 대기 DB 인스턴스가 다른 AZ에서 동기식 복제
3. 장애 발생 시 1-2분 내 자동 장애 조치
4. 애플리케이션 코드 변경 없이 DNS만 전환

#### 백업 전략

**자동 백업 구성:**

- 일일 스냅샷 자동 수행
- 트랜잭션 로그 실시간 저장 (포인트 인 타임 복구 가능)

**백업 모범 사례:**

| **항목**       | **설명**                                 |
| ------------ | -------------------------------------- |
| 자동 백업 활성화    | 기본 제공 기능, 설정 필수                        |
| 수동 스냅샷       | 배포 전후, 마이그레이션 직전 등 주요 시점 보존            |
| 교차 리전 스냅샷 복제 | 재해 복구(Disaster Recovery)를 위해 다른 리전에 복사 |
| 백업 모니터링      | CloudWatch 또는 EventBridge로 실패 알림 구성    |


#### 복구 전략

|**상황**|**대응 방안**|
|---|---|
|DB 장애|Multi-AZ 자동 Failover|
|실수로 데이터 삭제|Point-in-Time Recovery|
|리전 전체 장애|Cross-Region Snapshot 복원|
|코드 배포 후 문제 발생|수동 스냅샷에서 수동 복원|

## 목적별 데이터베이스

### 1. Amazon DynamoDB

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3f763fac86ff0dbce870aff533e44d75.png" alt="image" width="300" />

DynamoDB는 AWS에서 제공하는 완전관리형 NoSQL Key-Value 및 문서(document) 기반 데이터베이스다.
어떤 규모에서든 빠르고 일관된 성능을 제공하며, 서버 관리가 필요 없는 서버리스 구조이다.

### 2. Amazon ElastiCache

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/50053caff397b55893cfb9faa43fbfe4.png" alt="image" width="300" />

ElastiCache는 AWS에서 제공하는 완전관리형 인-메모리 캐싱 서비스다.
Redis와 Memcached라는 두 가지 오픈 소스 캐시 엔진을 지원하며, 빠른 데이터 액세스와 애플리케이션 성능 향상을 위한 목적으로 사용된다.

### 3. Amazon MemoryDB for Redis

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/73d6a79ba9130e4636d0dc327f8e068f.png" alt="image" width="300" />

MemoryDB는 Redis와 호환되는 고성능 인메모리 데이터베이스 서비스로, 캐시 그 이상을 목표로 하는 완전관리형 솔루션이다.
Redis처럼 빠르지만, 내구성과 고가용성까지 갖춘 데이터 저장소이다.

**ElastiCache vs MemoryDB:**

| **항목** | **ElastiCache (Redis)** | **MemoryDB**                           |
| ------ | ----------------------- | -------------------------------------- |
| 용도     | **캐시** 중심               | **프라이머리 데이터베이스**로 사용 가능                |
| 내구성    | 기본적으로 휘발성, 백업은 가능       | 디스크 저널링으로 영구 저장 가능                     |
| 장애 조치  | Multi-AZ 지원 (Redis만)    | Multi-AZ 기본 + 데이터 무손실 보장               |
| 성능     | 초고속                     | **더 빠름**, 안정성 강화                       |
| 스냅샷    | 지원                      | 지원 + 더 강력한 복구 기능                       |
| 사용 사례  | DB 앞단 캐시                | Redis 기반 **실시간 DB** 사용처 (e.g. 세션, 메시징) |

### 4. Amazon DocumentDB

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e0d05bcd8393a2a1608a72e6c24f5cd4.png" alt="image" width="300" />

DocumentDB는 AWS에서 제공하는 완전관리형 문서기반 NoSQL 데이터베이스 서비스이다.
문서형 데이터 모델을 사용하는 애플리케이션에서 유연하게 데이터를 저장하고 빠르게 쿼리할 수 있다.
특히 MongoDB와 API 호환되어 있어, MongoDB 사용자에게 매우 친숙한 환경을 제공한다.

**MongoDB vs Amazon DocumentDB:**

|**항목**|**MongoDB (자체 운영)**|**Amazon DocumentDB**|
|---|---|---|
|설치/운영|직접 설치, 클러스터 구성 필요|완전관리형|
|API 호환성|100% (원본)|**버전 제한적 호환** (예: 4.0, 5.0 등)|
|고가용성 구성|복제 셋, 샤딩 직접 구성|자동 Multi-AZ 구성 가능|
|백업/복원|직접 설정|자동 백업, PITR 지원|
|비용|낮을 수 있으나 운영 복잡|관리형 비용 + 운영 부담 ↓|

### 5. Amazon Keyspaces (Apache Cassandra용)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/106f079bc64eee0ec8b629496ce2872c.png" alt="image" width="300" />

Keyspaces는 AWS에서 제공하는 완전관리형, 고가용성 NoSQL 데이터베이스 서비스로, Apache Cassandra와 호환된다.
기존에 Cassandra를 사용하던 워크로드를 코드 변경 없이 AWS 클라우드 환경으로 옮겨 실행할 수 있다.

### 6. Amazon Neptune

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4c10685272a221c924651f56167b4211.png" alt="image" width="300" />

Neptune은 AWS에서 제공하는 완전관리형 그래프(graph) 데이터베이스 서비스다.
데이터 간의 복잡한 관계를 표현하고, 관계 기반의 빠른 탐색이 필요한 애플리케이션에 적합하다.

> **그래프 데이터베이스란?**
> - 데이터를 노드(node)와 엣지(edge)로 표현
> - 관계형 DB의 JOIN보다 훨씬 빠르게 관계를 탐색할 수 있음
> - 복잡한 관계형 구조에 강력함

### 7. Amazon Timestream

Timestream은 AWS에서 제공하는 완전관리형 시계열(time seires) 데이터베이스 서비스다.
서버리스 기반으로, 수조 개의 시간 기반 이벤트를 빠르고 저렴하게 저장 및 분석할 수 있다.

> **시계열 데이터란?**
> → 시간(time)을 기준으로 연속적으로 발생하는 데이터이다.
> 	e.g. IoT 센서 값이나 CPU 사용률, 메모리 사용량 등의 서버 모니터링 로그, 주식 시세, 환율, 날씨 기록 등

### 8. Amazon Quantum Ledger Database(QLDB)

QLDB는 AWS에서 제공하는 완전관리형 원장(ledger) 데이터베이스로, 데이터의 모든 변경 내역을 영구적이고 변경 불가능하게 기록하고, 암호학적으로 무결성을 검증할 수 있는 신뢰성 높은 데이터베이스다.

> 원장(ledger)이란?
> → 시간 순서대로 데이터를 기록하고, 그 변경 내역을 절대로 삭제하거나 수정할 수 없게 만든 기록 시스템

**왜 필요한가?:**

기존 RDB/NoSQL의 문제점은 기록 덮어쓰기/삭제가 가능해 데이터 위변조 가능성이 존재한다는 것이다. 감사 테이블을 따로 두어 구현할 수도 있지만 개발자의 부담이 증가하고 확장의 어려움이 있다. 또한 이력의 무결성 보장이 어렵다.

QLDB는 이러한 문제를 해결한다. 데이터를 원본 + 변경 이력까지 포함한 원장으로 기록하는 것이다.



> 이 글은 AWS Skill Builder의 [AWS Technical Essentials](https://skillbuilder.aws/learn/K8C2FNZM6X/aws-technical-essentials-/T158S72U18) 강의를 토대로 공부한 내용을 정리한 것입니다.