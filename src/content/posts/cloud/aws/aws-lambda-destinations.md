---
title: "AWS Lambda — Destinations"
slug: "aws-lambda-destinations"
date: 2025-06-28
tags: ["AWS", "Serverless", "Lambda", "Destinations", "DLQ"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7678ae302e22ff90449e71de2d0a6f15.png"
draft: false
views: 0
---
다음은 Lambda의 목적지(Destinations) 기능에 대한 내용이다. 기존의 DLQ(Dead Letter Queue) 방식보다 훨씬 더 유연하고 포괄적인 해결책을 제공한다.

## Lambda Destinations
Lambda를 사용하다 보면 다음과 같은 상황에서 어려움을 겪는다.

1. **비동기식 호출 결과 추적 어려움**: S3 이벤트로 Lambda가 호출되었을 때 성공/실패 여부를 쉽게 알 수 없었음
2. **이벤트 소스 매핑 실패 처리**: Kinesis나 DynamoDB 스트림에서 처리 실패 시 전체 스트림이 차단되는 문제
3. **제한적인 DLQ 기능**: SQS와 SNS만 지원하고, 실패한 경우만 처리 가능

그럴 때 사용할 수 있는 기능이 바로 목적지 기능이다. 목적지는 비동기화 호출 결과 또는 이벤트 매퍼의 실패 결과를 다른 서비스로 전송하는 기능이다.

이를 통해 다음과 같은 이점을 얻을 수 있다.

1. **성공과 실패 모두 추적 가능**
2. **더 많은 대상 서비스 지원**
3. **더 많은 메타데이터 제공**

### 비동기식 호출에서의 Destination
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7678ae302e22ff90449e71de2d0a6f15.png)


**지원되는 목적지 서비스**는 다음과 같다.

- Amazon SQS
- Amazon SNS  
- AWS Lambda
- Amazon EventBridge (CloudWatch Events)

그리고 **설정 가능한 조건**은 다음과 같다.

- **성공 시 목적지**: 함수 실행이 성공적으로 완료된 경우
- **실패 시 목적지**: 모든 재시도가 완료된 후에도 실패한 경우

### 이벤트 소스 매핑에서의 Destination
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f016e00fce05d154275fb61c08b68ea3.png)


**적용되는 대상**은 다음과 같다.

- Kinesis 데이터 스트림
- DynamoDB 스트림 
- SQS (표준 및 FIFO) 

**동작 방식**은 다음과 같다.

- 처리할 수 없는 이벤트 배치를 폐기할 때 사용 
- 전체 스트림을 차단하는 대신 실패한 배치만 목적지로 전송 
- Amazon SQS나 Amazon SNS로 전송 가능

### DLQ, Destinations 비교
| 기능    | DLQ      | 목적지                           |
| ----- | -------- | ----------------------------- |
| 지원 대상 | SQS, SNS | SQS, SNS, Lambda, EventBridge |
| 처리 조건 | 실패만      | 성공, 실패 모두                     |
| 메타데이터 | 제한적      | 풍부한 정보                        |
| 권장 사용 | 레거시      | 신규 프로젝트                       |