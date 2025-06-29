---
title: "AWS Lambda — 호출 방식 정리"
slug: "aws-lambda-invocation-methods"
date: 2025-06-26
tags: ["AWS", "Serverless", "Lambda", "FaaS", "Kinesis", "DynamoDB", "Fargate", "CloudWatch", "SNS", "SQS", "EventBridge"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/80c9cc3385f65a68c179e65233fdfb2e.png"
draft: false
views: 0
---
AWS Lambda는 AWS에서 가장 널리 쓰이는 서비스 중 하나로, 애플리케이션을 배포하고 사용하는 방법에 있어 혁신을 가져온 서비스다. 다음은 Lambda와 서버리스 아키텍처에 대해 학습한 내용을 정리한 내용이다. 실습 과정은 AWS Console을 사용하여 진행했다.

## 서버리스란?

서버리스(Severless)라는 단어를 보고 서버가 없는 것이라고 생각하면 안 된다. 실제로는 다음과 같은 의미가 된다.

1. **서버를 관리할 필요가 없다**: 물리적인 서버는 여전히 존재하며, 개발자가 직접 관리하지 않아도 된다
2. **기능 자체를 배포하는 FaaS(Function as a Service)**: 전체 애플리케이션이 아닌 개별 함수 단위로 배포한다
3. **서버를 프로비전하지 않음**: 여기서 프로비전이란, 서버를 구입하거나, OS를 설치하거나, 네트워크의 설정, 리소스 할당 등 서비스를 실행할 준비 상태로 만드는 일련의 과정을 의미하는데, 이를 불필요하게 만든다

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/80c9cc3385f65a68c179e65233fdfb2e.png" alt="image" width="250" />*서버리스 환경 아키텍처*

위 그림에서 볼 수 있듯 서버리스 아키텍처는 다음과 같은 흐름으로 동작할 수 있다.

1. 사용자가 CloudFront + S3에서 정적 콘텐츠를 받음
2. Cognito로 사용자 인증 처리
3. API Gateway를 통해 REST API 호출
4. API Gateway가 Lambda 함수를 실행
5. Lambda 함수가 DynamoDB에서 데이터를 저장하고 검색

## AWS의 서버리스 서비스들

AWS에서 제공하는 주요 서버리스 서비스들은 다음과 같다.

- **AWS Lambda**: 함수 실행 환경
- **DynamoDB**: NoSQL 데이터베이스
- **AWS Cognito**: 사용자 인증 및 권한 관리
- **AWS API Gateway**: REST API 관리
- **Amazon S3**: 객체 스토리지
- **AWS SNS & SQS**: 메시징 서비스
- **AWS Kinesis Data Firehose**: 실시간 데이터 스트리밍
- **Aurora Serverless**: 서버리스 관계형 데이터베이스
- **Step Functions**: 워크플로우 관리
- **Fargate**: 서버리스 컨테이너 실행

이들의 공통점은 처리량만큼만 스케일링되고, 사용한 만큼만 지불하며, 서버를 프로비전하지 않는다는 것이다.

## AWS Lambda

### EC2 vs Lambda

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0007568da49235d537cdd4ca320159ae.png)

**EC2의 경우:**

- 클라우드에 가상 서버가 있어 직접 프로비저닝 필요
- 메모리와 CPU 양에 제한이 있음
- 지속적으로 실행됨 (사용하지 않아도 계속 과금)
- Auto Scaling Group을 통한 수동 확장 관리

**Lambda의 경우:**

- 가상 함수로 관리할 서버가 없음
- 코드만 준비하면 됨
- 시간 제한이 있음 (최대 15분)
- 수요에 따라 실행 (사용하지 않을 때는 비용 없음)
- 자동 확장

#### Lambda의 장점

1. **저렴한 가격**: 요청 수에 따라 비용 지불
2. **무료 사용량**: 월 100만 건 요청, 40만 GB초의 컴퓨팅 시간 제공
3. **다양한 AWS 서비스와 통합**
4. **다양한 프로그래밍 언어 지원**: Node.js, Python, Java, C#, PowerShell, Ruby 등
5. **CloudWatch를 통한 쉬운 모니터링**
6. **최대 10GB RAM 할당 가능**: RAM 증가 시 CPU와 네트워크 성능도 향상

### Lambda 함수 생성 방법

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/74f3b15ea05f2c0a83f7a3925497e0e6.png)*Lambda 함수 생성*

람다 함수 생성에는 세 가지 방법이 있다.

1. **새로 작성(Create from scratch)**: 직접 핸들러 코드를 작성하는 가장 일반적인 방식
2. **블루프린트 사용(Use a blueprint)**: AWS가 제공하는 템플릿 코드를 이용해 시작
3. **컨테이너 이미지(Container image)**: 도커 이미지로 배포, 최대 10GB, 복잡한 종속성이나 표준화된 배포가 필요할 때 사용

## Lambda 호출 방식

### 1. 동기식 호출 (Synchronous Invocations)
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f2a1f3cb7faf0cab36e0b7a40041a4ff.png)*동기식 호출 다이어그램*

**특징:**

- 결과를 기다리고 있으면 결과가 돌아옴
- 모든 오류는 클라이언트 측에서 해결해야 함
- 재시도나 지수 백오프 전략 사용 가능

**동기식 호출을 사용하는 서비스들:**

- 사용자 직접 호출: CLI, SDK
- Application Load Balancer (ALB)
- Amazon API Gateway
- Amazon CloudFront (Lambda@Edge)
- Amazon Cognito
- AWS Step Functions

#### CLI를 통한 동기식 호출 실습

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5467822aab7f0f5f7fbb3849e74b5da3.png)*AWS Lambda functions 조회*

```bash
# Lambda 함수 목록 조회
aws lambda list-functions

# Lambda 함수 동기식 호출
aws lambda invoke --function-name lambda-function --cli-binary-format raw-in-base64-out --payload '{"key1": "value1", "key2": "value2", "key3": "value3"}' --region ap-northeast-2 response.json
```
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ab10a26194a5c705633bc041189a01c8.png)*호출 결과 - 200 응답 확인*

### 2. Application Load Balancer와 Lambda 통합

ALB를 통해 Lambda 함수를 HTTP/HTTPS 엔드포인트로 노출할 수 있다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7edee92b009e95f77b175bb32edda4a5.png" alt="image" width="500" />*ALB가 Target Group에 있는 Lambda 함수를 동기식으로 호출하는 구조*

#### HTTP to JSON 변환

ALB에서 Lambda로 요청이 전달될 때 HTTP 요청은 JSON 문서로 변환된다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2f4a35af29c74c21d4852daaf0050db5.png)*HTTP 요청이 JSON으로 변환된 예시*

#### JSON to HTTP 변환

Lambda 함수의 응답도 JSON 형태로 작성해야 하며, ALB가 이를 다시 HTTP 응답으로 변환한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8b0dbf9a4c6f943abc3489fd19060df.png)*Lambda 응답이 HTTP로 변환되는 과정*

#### 다중 헤더 값 지원

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/aa00fb7e6c5170c936c66bc16268c78a.png" alt="image" width="400" />*다중 쿼리스트링 매개변수를 Lambda 함수로 된 배열로 변환*

ALB 설정을 통해 같은 이름의 헤더나 쿼리 스트링이 여러 개 있을 때 배열 형태로 Lambda에 전달할 수 있다.

#### ALB + Lambda 실습

**로드밸런서 생성:**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a22710e599c6004d6bfcb4fbd2d4feb3.png)*Application Load Balancer 선택*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/85de4e3131cf9690d393bdd9806ac375.png)*모든 가용 영역을 선택*

**Target Group 설정:**
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d6fa06a8ca0cf064ef7b1d8ef52fa8ab.png)*Lambda 함수를 Target으로 설정*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0e1004503490b4d75c2d16101a3a946a.png)*HTTP 프로토콜 80번 포트 설정*

**결과 확인:**

![생성된 로드밸런서 정보](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/21293d23205b547471338049fc3ee870.png)_생성된 로드밸런서 정보_

![](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/70d3bfb771489389403529e30e86647a.png)_브라우저에서 접근 시 Lambda 응답 확인 → 파일 설치_

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8b25fa79915b03b24f79550f0b57c897.png)_Lambda 함수에 ALB 트리거가 자동으로 추가돤 모습_

### 3. 비동기식 호출 (Asynchronous Invocations)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/611f12546a0313f752f73b7843948ef9.png)_비동기식 호출 흐름도_

**특징:**

- Lambda 함수를 뒤에서 호출하는 방식
- 이벤트가 내부 이벤트 대기열에 위치
- 실패 시 자동으로 3번 재시도 (즉시 → 1분 후 → 2분 후)
- 멱등성이 중요 (같은 입력에 대해 항상 같은 결과)
- Dead Letter Queue(DLQ) 설정 가능

> 여기서 DLQ(Dead Letter Queue)란, AWS Lambda의 비동기 호출에서 오류가 발생했을 때 이벤트를 안전하게 보관하기 위한 대체 저장소다. 실패한 이벤트를 DLQ로 보내면 나중에 해당 이벤트를 다시 분석하거나 재처리할 수 있다.

**비동기식 호출을 사용하는 서비스들:**

- Amazon S3 (이벤트 알림)
- Amazon SNS
- CloudWatch Events/EventBridge
- CodeCommit, CodePipeline
- CloudWatch Logs
- SES (Simple Email Service)
- CloudFormation, Config, IoT

#### 비동기식 호출 실습

```bash
aws lambda invoke --function-name demo-lambda --invocation-type Event --cli-binary-format raw-in-base64-out --payload '{"key1": "value1"}' response.json
```

결과는 항상 StatusCode 202를 반환하며, **함수의 실제 성공/실패 여부는 CloudWatch Logs에서 확인**해야 한다.

#### DLQ(Dead Letter Queue) 설정

함수가 계속 실패할 경우를 대비해 DLQ를 설정할 수 있다.

DLQ로 설정 가능한 서비스는 아래와 같이 두 가지가 있다.

1. SQS(Simple Queue Service)
2. SNS(Simple Notification Service)

| **항목**       | **SQS (Simple Queue Service)**   | **SNS (Simple Notification Service)** |
| ------------ | -------------------------------- | ------------------------------------- |
| **형태**       | 대기열(Queue)                       | 주제(Pub/Sub Topic)                     |
| **구독 모델**    | Pull 기반 – 소비자가 직접 읽음             | Push 기반 – 여러 구독자에게 알림 전송              |
| **주요 사용 사례** | 실패한 이벤트를 안전하게 저장하고 나중에 수동/자동 재처리 | 실패 이벤트를 실시간으로 관리자에게 이메일/SMS 등으로 알림    |
| **지속성**      | 메시지가 보존됨 (최대 14일)                | 메시지가 즉시 발송됨, 보존되지 않음                  |
| **중복 처리**    | 수동 재처리 가능                        | 실시간 대응 중심                             |
| **활용 예시**    | 데이터 유실 방지                        |                                       |

DLQ 설정 흐름은 다음과 같다.

1. SQS 대기열 생성: `lambda-dlq`
2. Lambda 함수에 SQS 권한 부여 (`AmazonSQSFullAccess`)
3. 비동기식 호출 설정에서 DLQ 연결

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/92893dfee9655a2e2b7d50646ff5eb50.png)*CloudWatch에서 확인한 재시도 로그 - 같은 요청 ID로 3번 시도*

### 4. 이벤트 소스 매핑 (Event Source Mapping)

동기식, 비동기식에 이어 Lambda가 이벤트를 처리하는 마지막 방법이 **이벤트 소스 매핑**이다. 이는 Kinesis 데이터 스트림, SQS, SQS FIFO 대기열, DynamoDB 스트림에 사용된다. 1, 2, 3번 방식과 다른 주요 차이점은 폴링 방식을 사용한다는 것이다.

**특징:**

- 레코드가 소스에서 **폴링**되어야 함
- Lambda가 서비스에 레코드를 요청해서 반환받는 방식
- Lambda 함수는 **동기적으로 호출**됨

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f93986d5248beba1ea048d18b8805796.png" alt="image" width="400" />

> 여기서 말하는 폴링(Polling)이란, 컴퓨터에서 어떤 상태나 데이터가 있는지 주기적으로 확인하는 동작을 의미한다. 즉 AWS에서의 Polling은 람다가 SQS나 Kinesis처럼 이벤트를 자동으로 전달받지 못할 때 람다가 스스로 주기적으로 해당 소스에 가서 메시지가 있는지 확인하는 것으로, 메시지가 있으면 가져와서 처리한다.

#### 이벤트 소스 매핑의 두 가지 범주

**1. 스트림 (Kinesis 데이터 스트림, DynamoDB 스트림)**

- 각 샤드에 대한 반복자를 생성
- 샤드 레벨에서 아이템을 순차적으로 처리
- 읽기 시작 위치 구성 가능:
    - 새로운 아이템만 읽기
    - 샤드 시작 위치부터 읽기
    - 특정 타임스탬프부터 읽기
- **중요**: 아이템이 처리되어도 스트림에서 제거되지 않음 (다른 소비자도 읽기 가능)

> 샤드(Shard)란, 조각, 파편이라는 뜻이며 하나의 큰 데이터를 작게 나누는 방법으로 Kinesis나 DynamoDB에서 자주 등장하는 용어다.

**스트림 처리 최적화:**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/83dc1db45cd34ed8dd417c542284d35f.png)

- **낮은 트래픽**: 배치 윈도우(Batch Window)를 사용해 레코드를 축적한 후 처리
- **높은 트래픽**: 샤드 레벨에서 동시에 여러 배치 처리
    - 샤드당 최대 10개의 배치 프로세서 가능
    - 파티션 키 레벨에서 순차적 처리

> Batch Size란, 단일 Batch에서 몇 개의 메시지를 수신할지 지정하는 크기를 의미하고,
> Batch Window란, 일정 시간 동안 데이터를 모아 한 번에 처리하는 시간 간격을 의미한다. 람다 함수에서 데이터를 얼마나 모았다가 호출할지 정하는 기준이 된다.

**스트림 오류 처리:**

- 함수가 오류를 반환하면 성공할 때까지 또는 배치 만료까지 재처리
- 오류가 해결될 때까지 영향받는 배치의 처리가 중단됨
- 관리 방법:
    - 오래된 이벤트 폐기 구성
    - 재시도 횟수 제한
    - 오류 시 배치 분할 (Lambda 시간초과 문제 해결)

**2. 대기열 (SQS, SQS FIFO)**

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1e856d58cd3b88d9731ed5c37fcae1cc.png" alt="image" width="300" />

- SQS 대기열을 Lambda의 이벤트 소스 매핑으로 폴링
- 긴 폴링(Long Polling)을 이용해 효율적으로 폴링
- 배치 크기: 1~10개 메시지 설정 가능
- 대기열 표시 시간초과를 Lambda 함수 시간초과의 6배로 설정하는 것을 

**SQS DLQ 설정:**

- Lambda용 DLQ가 아닌 **SQS 대기열에 DLQ 설정**
- 이유: Lambda DLQ는 비동기식 호출에만 작동하는데, 이벤트 소스 매핑은 동기식 호출이기 때문

**FIFO vs 표준 대기열:**

_FIFO 대기열:_

- Lambda가 순차적 처리 지원
- 스케일링되는 Lambda 함수 수 = 활성 메시지 그룹 수
- 그룹 ID로 메시지 그룹 정의

_표준 대기열:_

- 순서 보장 없음
- Lambda가 최대한 빠르게 스케일링하여 모든 메시지 처리
- 오류 발생 시 배치가 개별 아이템으로 대기열에 반환
- 동일한 아이템을 두 번 수신할 수 있음 (멱등성 필요)
- 처리 완료 시 Lambda가 대기열에서 아이템 삭제

#### 이벤트 소스 매핑 스케일링

**Kinesis 데이터 스트림 & DynamoDB 스트림:**

- 각 스트림 샤드당 Lambda 호출 1번
- 병렬 처리 시: 샤드당 동시에 10개 배치까지 처리 가능

**SQS 표준:**

- 매우 빠른 스케일링
- 분당 60개 인스턴스까지 추가 가능
- 초당 최대 1,000개 배치 동시 처리

**SQS FIFO:**

- 그룹 ID가 같은 메시지는 순서대로 처리
- Lambda 함수는 활성 메시지 그룹 수만큼 스케일 업


## Lambda와 다른 서비스 통합

### CloudWatch Events/EventBridge

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6b101c16373593ea7d50afb32fcdd507.png)_EventBridge를 통한 Lambda 통합_

다음 두 가지 사용 패턴이 있다.

1. **서버리스 CRON**: 일정한 간격으로 Lambda 함수 실행
2. **이벤트 기반 실행**: AWS 서비스 상태 변화에 반응

### S3 이벤트 알림

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9d1558bed0d7776d9676baa2f6336f35.png)*S3 이벤트 알림 흐름*

**S3에서 객체 생성, 삭제, 복구, 복제 등의 이벤트 발생 시 Lambda 함수를 트리거**할 수 있다. **접두어와 접미어로 필터링이 가능**하다.

이미지 썸네일 생성을 예로 들면

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3b14ecdab75499cd28e99c555a26dffd.png" alt="image" width="500" />

S3 버킷이 새 파일 이벤트를 람다에게 보내면 람다 함수가 그 파일을 처리해 DynamoDB 테이블이나 RDS 데이터베이스의 테이블로 보내게 되는 것이다.

**주의할 점:**

- 이벤트 전달은 보통 몇 초 이내이지만 때로는 1분 이상 걸릴 수 있음
- 이벤트 누락을 방지하려면 버킷 버저닝 활성화 필요
- 동시에 같은 객체에 두 번의 쓰기가 발생하면 하나의 알림만 받을 수 있음

## 람다 가격 모델

Lambda의 가격은 두 가지 요소로 결정된다.

1. **호출 횟수**: 첫 100만 건 무료, 이후 100만 건당 $0.20
2. **실행 시간**: 월 40만 GB초 무료, 이후 600,000 GB초당 $1

GB초는 메모리와 실행 시간의 곱이다.

- 예를 들어, 1GB RAM 함수가 40만 초 실행 = 40만 GB초
- 128MB RAM 함수가 320만 초 실행 = 40만 GB초 (8배 더 오래 실행 가능)