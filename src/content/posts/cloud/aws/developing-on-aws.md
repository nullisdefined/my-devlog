---
title: "Developing on AWS"
slug: "developing-on-aws"
date: 2025-07-12
tags: ["AWS", "Serverless", "Lambda", "S3", "IAM", "DynamoDB", "MSA", "APIGateway", "Cognito"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/eac8150aacab9b3abdb0752727659669.png"
draft: false
views: 0
---


![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/eac8150aacab9b3abdb0752727659669.png)


## 1. AWS 기본 개념과 인프라

### 클라우드 컴퓨팅

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a57f62bb82887f16d6b00a475c4468db.png" alt="image" width="600" />

AWS는 전통적인 데이터센터의 서버/클라이언트 모델을 클라우드로 확장한 개념이다.

가상화(Virtualization)가 메인인 기술로, 물리적 하드웨어의 CPU, 메모리, 네트워크, 스토리지를 논리적으로 분할하여 여러 가상 머신이 하나의 물리 서버에서 동작할 수 있게 한다.

서비스화를 통해 인프라를 코드처럼 관리할 수 있으며, 콘솔, CLI, SDK를 통해 프로그래밍 방식으로 제어가 가능하다.

Public 네트워크와 VPC: 인터넷을 통해 접근하는 퍼블릭 네트워크와 격리된 프라이빗 클라우드 환경인 VPC(Virtual Private Cloud)를 제공한다.

Pay-as-you-go: 사용한 만큼만 비용을 지불하는 유연한 과금 모델을 제공한다.

## 2. HTTP와 웹 아키텍처

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4638f14960a23f945f5ec5edbf01bf73.png" alt="image" width="600" />

### Stateless 웹의 특징

HTTP는 본질적으로 **무상태(Stateless)** 프로토콜이다. 각 요청은 독립적이며 서버는 이전 요청을 기억하지 않는다.

**HTTP 메시지 구조**:

- **요청**: Start Line (Method + URI), Header, Body
- **응답**: Status Line (Status Code), Header, Body

**주요 HTTP 메서드**: GET, POST, PUT, DELETE, HEAD, PATCH, OPTION으로 RESTful API을 구성한다.

### 상태 관리

무상태 특성을 보완하기 위한 상태 관리 메커니즘들:

- **세션(Session)**: 서버 측에서 사용자 상태 정보를 저장하고 관리
- **쿠키(Cookie)**: 클라이언트 브라우저에 저장되는 작은 데이터 조각
- **토큰(JWT)**: JSON Web Token을 통한 인증 정보 전달
- **로컬 스토리지**: 브라우저의 로컬 저장소 활용
- **데이터베이스**: 영구적인 상태 정보 저장

## 3. REST API와 데이터 처리

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7eb32d934af107e9e898fbb34e92445a.png" alt="image" width="600" />


### REST API

**인증/인가 분리**: AuthN(누구인가?)과 AuthZ(무엇을 할 수 있는가?)를 구분하여 처리
**HTTP 메서드 활용**: CRUD 작업을 HTTP 메서드로 매핑

- GET: 조회 (Read)
- POST: 생성 (Create)
- PUT/PATCH: 수정 (Update)
- DELETE: 삭제 (Delete)

**리소스 중심 설계**: URI는 리소스를 식별하고, 동작은 HTTP 메서드로 표현
**JSON/XML 데이터 교환**: 클라이언트-서버 간 구조화된 데이터 교환

## 4. AWS 글로벌 인프라

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/722211eb11f403b8258c4b8d0bf2450f.png" alt="image" width="600" />

### 물리적 구조

1. **리전(Region)**: 지리적으로 분리된 AWS 데이터센터 집합 (예: ap-northeast-2)
2. **가용영역(AZ)**: 하나의 리전 내에서 물리적으로 분리된 데이터센터 (2a, 2b, 2c, 2d)
3. **엣지 로케이션**: CDN과 DNS 서비스를 위한 전 세계 캐시 서버

### 서비스 범위

1. **글로벌 서비스**: IAM, Route53, CloudFront - 전 세계에서 동일하게 작동
2. **리전 서비스**: EC2, S3, RDS, Lambda - 특정 리전에서만 작동
3. **AZ 서비스**: 특정 가용영역에 종속된 리소스

### 리소스 식별

**ARN(Amazon Resource Name)**:

```
arn:aws:service:region:account:resource
```

모든 AWS 리소스의 고유 식별자로 사용된다.

## 5. 단계별 관리형 서비스

AWS는 고객의 관리 부담을 단계적으로 줄여나가는 서비스를 제공한다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/dfba429f954ebc5c3c6900bc5b669dc8.png" alt="image" width="600" />

### 비관리형 → 완전관리형 → 서버리스

**1단계 - 비관리형 (EC2)**: 고객이 OS, 애플리케이션, 스케일링을 모두 관리. 인스턴스 타입과 AMI는 고객이 선택

**2단계 - 관리형 (RDS)**: AWS가 OS와 데이터베이스 엔진을 관리. 고객은 스키마와 애플리케이션에 집중

**3단계 - 완전관리형 (Aurora)**: 초기 용량 설정만 하면 AWS가 대부분의 운영 작업을 자동화

**4단계 - 서버리스 (Lambda)**: 용량 계획이 필요 없이 사용량에 따라 자동으로 확장/축소

## 6. IAM

### 구성 요소

- **계정(Account)**:
	- AWS 리소스의 최상위 격리 단위
	- Root User를 통해 관리하며 MFA 필수
- **사용자(User)**: 실제 사람이나 애플리케이션을 나타내는 엔터티
- **그룹(Group)**: 유사한 권한을 가진 사용자들의 집합
- **역할(Role)**: 임시 자격 증명을 제공하는 메커니즘

### 접근
- 콘솔 접근: ID/비밀번호
- 프로그래밍 접근: Access Key ID/Secret Access Key
- STS(Security Token Service)를 통해 임시 토큰 발급
- 교차 계정 접근, AWS 서비스 간 권한 위임에 활용

### 정책(Policy) 시스템

**자격 증명 기반 정책**: 사용자, 그룹, 역할에 직접 연결되는 정책

**리소스 기반 정책**: S3 버킷 정책처럼 리소스 자체에 연결되는 정책

**정책 구조** (JSON):

- Effect: Allow/Deny
- Action: 허용/거부할 동작
- Resource: 대상 리소스
- Principal: 정책이 적용될 주체

## 7. EC2 Instance Profile과 Lambda Execution Role

### EC2에서의 권한 관리

**Instance Profile**: EC2 인스턴스가 AWS 서비스에 접근할 때 사용하는 역할 컨테이너

**동작 과정**:

1. EC2 인스턴스에 IAM Role 연결
2. 애플리케이션이 메타데이터 서비스에서 임시 자격 증명 획득
3. STS AssumeRole API를 통해 임시 토큰 받아 AWS 서비스 호출

### Lambda 실행 역할

**Execution Role**: Lambda 함수가 다른 AWS 서비스에 접근하기 위한 권한

- CloudWatch Logs 기록 권한 기본 포함
- X-Ray 추적, 다른 AWS 서비스 접근 권한 추가 설정

## 8. AWS API와 SDK

1. **AWS API**: HTTP REST 엔드포인트를 통한 직접 접근

	- JSON/XML 형태의 요청/응답
	- AWS4-HMAC-SHA256 서명을 통한 인증

2. **AWS CLI**: Python 기반의 명령줄 도구

```bash
aws s3 cp s3://mybucket/mykey ./local
```

3. **AWS SDK**: 다양한 프로그래밍 언어 지원

	- API 호출 복잡성 추상화
	- 자동 인증, 재시도, 오류 처리 제공
	- e.g. boto3 (Python)

## 9. S3

### 아키텍처와 특징

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6b309043f355a44f8589c89d66f8e2c0.png" alt="image" width="600" />


**리전별 서비스**: 3개 이상의 AZ에 데이터 복제로 99.9% 내구성 보장

**객체 구조**:

- **Data**: 실제 파일 내용 (최대 5TB)
- **Key**: 객체의 고유 식별자 (파일명 역할)
- **Metadata**: 객체에 대한 추가 정보

**플랫 구조**: 폴더 개념 없이 버킷 내에서 키로만 객체 식별

### EBS와의 차이점

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8dc5d2fdfbddada87188773c8b653d04.png" alt="image" width="600" />

| **항목**       | **S3**                           | **EBS**                 |
| ------------ | -------------------------------- | ----------------------- |
| **스토리지 타입**  | 객체 스토리지 (Object Storage)         | 블록 스토리지 (Block Storage) |
| **접근 방식**    | HTTP 기반 API (PUT, GET)           | EC2에 마운트하여 파일 시스템으로 사용  |
| **사용 예시**    | 이미지, 백업 파일, 정적 웹 자산 저장 등         | 운영체제 디스크, 데이터베이스 저장소 등  |
| **중복 저장 범위** | 3개의 AZ(Avalibility Zone) 에 자동 복제 | 1개의 AZ 내 복제, 다중 AZ 불가   |
| **확장성**      | 무제한                              | 최대 수 TB (디스크당)          |
| **성능**       | 인터넷 속도 기반 (딜레이 있음)               | 디스크 수준 IOPS 지원 (빠름)     |
| **장착 여부**    | 장착 개념 없음 (API 호출만)               | EC2에 attach 필요          |
| **가격 모델**    | 저장 용량 기준                         | 저장 용량 + IOPS 성능 기준      |

## 10. DynamoDB

### RDB vs NoSQL 비교

- **RDB**: 일관성 중시, 정규화된 테이블 구조, JOIN 연산 지원
- **NoSQL**: 성능 우선, 유연한 스키마, 수평 확장 최적화

### DynamoDB 특징

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c1a6a86cd8c5e3f53baa8beda86f4fbb.png" alt="image" width="400" />

**기본 구조**:

- **Table**: 데이터를 저장하는 기본 단위 (↔ Collection)
- **Item**: 테이블의 한 레코드 (↔ Document)
- **Attribute**: 아이템의 개별 속성 (↔ Field)

**키 구조**:

- **Partition Key**: 데이터 분산을 위한 해시 키
- **Sort Key**: 파티션 내 정렬을 위한 범위 키
- **Primary Key**: Partition Key + Sort Key 조합

### 인덱스와 용량 모드

**보조 인덱스(Secondary Index)**:

- **GSI (Global Secondary Index)**: 완전히 다른 키 구조
- **LSI (Local Secondary Index)**: 같은 파티션 키, 다른 정렬 키

**용량 모드(Capacity Mode)**:
→ 얼마만큼 읽고 쓸 수 있는지 처리량(capacity throughput)을 어떻게 관리하고 과금할 것인가를 지정하는 모드

1. **Provisioned**: 1초에 몇 RCU, 몇 WCU까지 허용할지를 사용자가 정함
	- 사전에 RCU(Read Capacity Unit)/WCU(Write Capacity Unit)를 설정하여 사용
	- 필요 시 Auto Scaling으로 자동 조절 가능
	- Read:
		- Strongly Consistent Read: 한 번의 RCU로 최대 4KB 항목 1개 읽기 가능
		- Eventually Consistent Read: 한 번의 RCU로 최대 4KB 항목 2개 읽기 가능
	- Write:
		- 1 WCU = 최대 1KB 항목 1개 쓰기
2. **On-Demand**: 사용량에 따라 DynamoDB가 자동으로 확장됨
	- RRU:
		- Strongly
		- Eventually
	- WRU

**읽기 일관성**:

- **Strong Consistency**: 최신 데이터 보장 (1RCU = 4KB/초)
- **Eventual Consistency**: 최종 일관성 (1RCU = 8KB/초)

## 11. Modern Application Architecture

### 모놀리식(Monolithic) → MSA

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2587a61e45597ff6c34928062b04baef.png" alt="image" width="600" />

**모놀리식(Monolithic)**: 하나의 애플리케이션에 모든 비즈니스 로직과 데이터베이스가 결합된 구조

#### MSA (Microservices Architecture)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bfeb7576f9019eee00325a488f4205de.png" alt="image" width="600" />

- 비즈니스 기능별로 서비스 분리
- 각 서비스는 독립적인 데이터베이스 보유
- 서비스 간 느슨한 결합
- 실행 방식별 분류
	1. VM e.g. EC2
	2. Container e.g. AWS ECS, EKS
	3. Serverless e.g. AWS Lambda

| **항목**      | **Bare Metal** | **EC2 (VM)**    | **ECS/EKS (Container)** | **Lambda (Serverless)** |
| ----------- | -------------- | --------------- | ----------------------- | ----------------------- |
| **단위**      | 물리 서버          | 가상 머신 (VM)      | 컨테이너                    | 함수 (Function)           |
| **격리 수준**   | OS 수준          | VM 수준           | 프로세스 수준                 | 런타임 수준                  |
| **오버헤드**    | 높음             | 중간              | 낮음                      | 매우 낮음                   |
| **속도**      | 느림 (부팅 필요)     | 중간              | 빠름                      | 매우 빠름 (초기 콜드 스타트만 존재)   |
| **운영 부담**   | 매우 높음          | 높음 (패치, 모니터링 등) | 낮음 (자동 스케일링)            | 거의 없음                   |
| **MSA 적합성** | 낮음             | 중간              | 좋음                      | 매우 좋음                   |
| **예시 서비스**  | 자체 물리 서버       | Amazon EC2      | Amazon ECS, EKS         | AWS Lambda              |

- **Bare Metal**:
    - 물리 장비에 OS와 앱을 직접 설치
    - 격리 수준 낮고 유연성 없음
    - 클라우드 이전 시대의 구조
- **EC2 (VM 기반)**:
    - 하이퍼바이저 위에 VM을 올려 OS 단위로 격리
    - 인프라 제어권은 높지만 스케일아웃 불편
- **ECS/EKS (Container)**:
    - 컨테이너 엔진(Docker 등) 위에 앱 단위 배포
    - 경량화, 빠른 배포, 이식성 뛰어남
    - MSA의 핵심 기술
- **Lambda (Serverless)**:
    - Function 단위 실행
    - 서버 유지보수/운영 불필요
    - 초소형 MSA 단위에 최적
    - 이벤트 기반 트리거 구조

#### Application Integration
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ea91dbb4b8b459caabee15ed813d96d8.png" alt="image" width="600" />

- **API 기반 통합 (동기식, Request/Response)**:
    - 클라이언트가 API Gateway에 요청하여 Gateway는 서비스 A 또는 B에 동기적으로 전달하고, 응답을 받은 후 클라이언트에 결과를 전달하는 구조
    - 즉각적인 응답이 필요할 때 사용함
    - 서비스 간 직접 호출로 의존성이 높음
	    - 하나의 서비스가 장애 발생 시 연결된 다른 서비스에도 영향을 끼침
- **Event 기반** (비동기식, Event Driven):
	- 서비스 A에서 이벤트를 Event Bus에 publish
	- Event Bus(Event Bridge, SNS 등)를 통해 서비스 B가 해당 이벤트를 subscribe하여 처리

#### DevOps

- **CI/CD**:
    - CodePipeline: 전체 파이프라인 오케스트레이션
    - CodeBuild: 빌드 및 테스트 수행
    - CodeDeploy: 배포 자동화

- **IaC (Infrastructure as Code)**:
    - CloudFormation: 선언형 템플릿 기반 IaC
    - SAM (Serverless Application Model): 서버리스 전용 템플릿
    - CDK (Cloud Development Kit): 프로그래밍 언어로 인프라 정의

#### Observability

- **Metric (지표 수집)**
    - CloudWatch: 지표 기반 모니터링
- **Log (로그 분석)**:
    - CloudWatch Logs: 애플리케이션 및 시스템 로그 저장/분석
- **Trace (추적)**:
    - X-Ray: 서비스 간 호출 흐름 및 병목 추적

### 컴퓨팅 플랫폼 발전

**Bare Metal → VM → Container → Serverless**

각 단계별로 추상화 수준이 높아지며 운영 복잡성은 줄어들고 개발 생산성은 향상됩니다.

### 애플리케이션 통합 패턴

**1. API 기반 통합 (동기식)**:

- REST API를 통한 직접 호출
- API Gateway가 엔드포인트 관리
- 요청-응답 패턴

**2. 이벤트 기반 통합 (비동기식)**:

- Event Bus를 통한 느슨한 결합
- Publish-Subscribe 패턴
- EventBridge, SQS, SNS 활용

## 12. Lambda

### 서버리스 개념

**Function as a Service**: 코드만 업로드하면 AWS가 모든 인프라 관리

### Lambda 함수 구조

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0459f09a73bf94b7696f333251d7c22c.png" alt="image" width="600" />

**구성 요소**:

- **Function Name**: 함수 식별자
- **Handler**: 실행 진입점 (event, context)
- **Runtime**: Python, Java, Node.js 등
- **Memory**: 128MB~10GB
- **Timeout**: 최대 900초(15분)
- **Execution Role**: 다른 AWS 서비스 접근 권한

### 동시성(Concurrency)
AWS 계정마다 리전별로 기본 제공되는 동시 실행 가능한 limit에 제한이 있다. 기본값으로 1,000개 까지 동시 실행이 가능하며 1,001번째 호출은 대기 또는 실패한다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5fdafbf0be1e3a912f4fea1a4436ba0b.png" alt="image" width="600" />

Lambda는 호출마다 독립된 인스턴스(컨테이너)를 실행한다. 첫 호출 시 cold start로 인스턴스를 생성하고, 일정 시간 동안 재사용(warm 상태)한다. 동시에 호출되는 수만큼 컨테이너를 병렬로 생성하여 처리한다.

#### 콜드 스타트 최소화하기

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a9472aabc514bf61980363abbb3761a4.png" alt="image" width="600" />

1. Lambda 함수 예약 (Scheduled Invocation): EventBridge를 이용하여 주기적인 실행 규칙(Cron/Rate)을 생성하는 방식
2. 프로비저닝된 동시성(Provisioned Concurrency): Lambda 인스턴스를 미리 준비(warm)해두어 콜드 스타트 없는 즉시 응답을 보장하는 방식


### Lambda 호출 방법

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/97d387d01ce3dfaaaf1f35006fea5049.png" alt="image" width="600" />

**1. 동기식(Synchronous)**:

- API Gateway, CLI/SDK에서 직접 호출
- 요청-응답 대기 패턴

**2. 비동기식(Asynchronous)**:

- S3, SNS, EventBridge에서 이벤트 기반 호출
- 자동 재시도 최대 2회
- 실패 시 DLQ(Dead Letter Queue) 활용

> 비동기식의 호출은 동기식과는 다르게 200, 404와 같은 HTTP 응답이 없다. 성공/실패 여부를 직접 확인하거나 별도로 처리해야 한다. S3, SNS, EventBridge 같은 서비스들을 사용할 수 있다. 람다가 자체적으로 최대 2회의 retry를 하고 실패 시 DLQ 전송이 가능하다.

DLQ(Dead Letter Queue):
- DLQ는 SQS나 SNS 주제로 설정할 수 있는 에러 이벤트 보관소
- Lambda 비동기 호출이 모두 실패하면 DLQ에 해당 이벤트가 저장된다
- 이를 통해 후속 조치(알림, 로깅, 수동 처리 등)가 가능하다


<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ec156881ac68ddf3a551664f4f900b92.png" alt="image" width="600" />

**3. 이벤트 소스 매핑(Event Source Mapping)**:

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c9dd80b9cc9b91822f7219976cb8830c.png" alt="image" width="600" />

- DynamoDB Streams, Kinesis에서 자동 폴링
- 배치 단위로 이벤트 처리

#### 호출 권한과 실행 권한
1. 호출 권한(Invoke Permission)
	- 누가 Lambda를 호출할 수 있는지에 대한 권한
	- 즉, Lambda 함수를 실행할 수 있는 서비스나 사용자에게 주는 권한
	- 주로 IAM 정책이 아닌 Lambda의 리소스 기반 정책으로 관리됨
	- e.g.
		- API Gateway: HTTP 요청 시 Lambda 실행
		- S3: 객체 업로드 시 Lambda 트리거
		- EventBridge: 스케줄 이벤트로 Lambda 호출
		- 또다른 Lambda: A Lambda가 B Lambda를 호출
2. 실행 권한(Execution Role)
	- Lambda 함수가 AWS 리소스를 사용할 수 있는 권한
	- 즉, Lambda 함수 내부에서 사용되는 권한
	- Lambda가 S3에서 파일을 읽거나, DynamoDB에 쓰거나, CloudWatch에 로그를 남기거나 할 때 필요한 권한
	- IAM Role을 통해 설정

### Destinations

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1d7ed7fd9f38fe967bdae86b275818c5.png" alt="image" width="700" />

> [Lambda Destinations](https://nullisdefined.site/devlog/posts/cloud/aws/aws-lambda-destinations) 참고

### Lambda Runtime Life Cycle

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/468564b8aa01ebe0fa4231837d7ca982.png" alt="image" width="600" />




## 13. API Gateway

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/64e6c909013b08a37537d1fdc6af5608.png" alt="image" width="600" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fc36173beccd2e99b26048ce2a76ed28.png" alt="image" width="600" />*AWS 콘솔 화면*

### 요청-응답 변환

**Method Request**: 클라이언트 요청 정의

- 인증/권한 검증
- 요청 파라미터 및 본문 검증
- 데이터 형식 스키마 정의

**Integration**: 백엔드 연결

- Lambda, Mock, HTTP 엔드포인트 지원
- 매핑 템플릿을 통한 데이터 변환

**Method Response**: 최종 응답 정의

- HTTP 상태 코드 설정
- 응답 헤더 및 본문 스키마 정의

### 엔드포인트 유형

- **Edge Optimized**: CloudFront 통한 글로벌 최적화
- **Regional**: 특정 리전 내 서비스
- **VPC**: 프라이빗 네트워크 내부 전용

## 14. Cognito

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/dc80a537591834d843fecbc4801864eb.png" alt="image" width="600" />

### User Pool vs Identity Pool

**User Pool**: 사용자 인증(Authentication)

- 사용자 등록/로그인 관리
- JWT 토큰 발급 (ID, Access, Refresh Token)

**Identity Pool**: 자격 증명 연동(Authorization)

- JWT 토큰을 AWS 자격 증명으로 교환
- STS를 통한 임시 자격 증명 발급
- IAM Role 기반 권한 관리

### 통합 인증 프로세스

1. 사용자가 User Pool에 로그인하여 JWT 토큰 획득
2. Identity Pool에서 JWT를 AWS 자격 증명으로 교환
3. STS에서 임시 자격 증명(Access Key, Secret Key, Session Token) 발급
4. 임시 자격 증명으로 AWS 서비스 API 호출

## 15. DevOps

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8f3b023124bc3acd2094ba3bf7d37b16.png" alt="image" width="600" />


### 3가지 원칙

- **문화와 철학**: 개발팀과 운영팀 간의 협업 문화 조성
- **자동화**: 반복적인 작업의 자동화를 통한 효율성 향상
- **도구**: CI/CD 파이프라인을 지원하는 다양한 도구 활용

### CI/CD 파이프라인

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f5011fa5cbc0515a4673645846228911.png" alt="image" width="600" />


**Continuous Integration**:

- 코드 커밋 → 빌드 → 테스트 자동화
- CodeCommit, GitHub와 연동

**Continuous Deployment**:

- 테스트 통과 시 자동 배포
- CodePipeline을 통한 전체 워크플로 관리

### Infrastructure as Code (IaC)

- **CloudFormation**: YAML/JSON 템플릿 기반 인프라 정의
- **CDK**: Python, Java 등 프로그래밍 언어로 인프라 정의
- **SAM**: 서버리스 애플리케이션 특화 템플릿

## 16. Observability

### 3가지 방법

**1. Metrics (CloudWatch)**:

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/07c84c634a5cb79595eddd8662b8868c.png" alt="image" width="500" />

- **Namespace**: AWS 서비스별 지표 그룹
- **Metric**: Timestamp 기반 수치 데이터
- 기본 지표와 사용자 정의 지표

**2. Logs (CloudWatch Logs)**:

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b56f6137fe0f3ea72f6cfbde152c6df1.png" alt="image" width="600" />

- **Log Group**: 로그 스트림의 컨테이너
- **Log Stream**: 동일한 소스의 로그 이벤트 시퀀스
- **Log Event**: 타임스탬프가 있는 개별 로그 메시지

**3. Trace (X-Ray)**:

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/afe79c099d420ad7e000d1a2524a15d6.png" alt="image" width="700" />

- 분산 애플리케이션의 요청 추적
- **Service Map**: 서비스 간 의존성 시각화
- 성능 병목점과 오류 위치 식별

## 17. DocumentDB

### 클러스터 아키텍처

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ad28ec3e4cc2b5aa58cac996a684b9ac.png" alt="image" width="700" />

- **Primary-Replica 구조**: 1개의 Primary 노드와 여러 Replica 노드 
- **Quorum 기반**: 정족수(과반수) 방식으로 데이터 일관성 보장 
- **자동 장애 조치**: Primary 장애 시 Replica가 자동으로 승격

### MongoDB와의 용어 비교

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7fbaf8cf472c6b3dab2d83f2aa6c86fc.png" alt="image" width="700" />

- **Instance** ↔ **Database**
- **Collection** ↔ **Table**
- **Document** ↔ **Item**
- **Field** ↔ **Attribute**

### 집계 파이프라인
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b1aeeb049b0d2d6fde2e6f4cf705ad1b.png" alt="image" width="700" />

복잡한 데이터 처리를 위한 단계별 파이프라인: **Match** → **Stage** → **Sort** 등의 연속적인 데이터 변환 과정

## 18. ElastiCache

### Redis vs Memcached

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2257a43c9f1ed85e0471d904e9c0db0f.png" alt="image" width="600" />

**Redis**:

- Cluster Mode 지원
- 데이터 구조 다양성 (String, List, Set, Hash 등)
- 영속성 옵션 제공

**Memcached**:

- 단순한 키-값 저장
- 멀티스레드 지원
- 더 빠른 순수 캐시 성능

### 캐시 전략

**1. Lazy Loading (Cache-Aside)**:

- Cache Miss 시에만 DB에서 데이터 로드
- 캐시에 없는 데이터만 필요할 때 로드

**2. Write Through**:

- 쓰기 작업 시 캐시와 DB 동시 업데이트
- 데이터 일관성 보장하지만 쓰기 지연 발생