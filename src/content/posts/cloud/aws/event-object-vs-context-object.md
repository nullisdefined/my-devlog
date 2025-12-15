---
title: "AWS Lambda — 이벤트 객체와 컨텍스트 객체"
slug: "event-object-vs-context-object"
date: 2025-06-28
tags: ["AWS", "Serverless", "Lambda", "EventObject", "ContextObject"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f5a8cc2df058de8208aa49da96aa146b.png"
draft: false
views: 0
---
이전에는 AWS의 서버리스 아키텍처에서의 Lambda 함수의 호출 방식을 알아보았다. 이어서 Lambda와 관련된 이벤트 객체와 컨텍스트 객체에 대한 내용이다.

## 이벤트 객체와 컨텍스트 객체
람다 함수가 실행될 때 두 개의 객체가 함수에 전달된다.

1. **이벤트 객체 (Event Object)**: 함수가 처리해야 할 실제 데이터
2. **컨텍스트 객체 (Context Object)**: 함수 실행 환경에 대한 메타데이터

EventBridge 규칙에 의해 Lambda 함수가 호출되는 과정을 살펴보면

1. **EventBridge가 이벤트를 생성**
2. **생성된 이벤트가 Lambda 함수로 전달**
3. **Lambda 함수가 이를 이벤트 객체로 수신**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f5a8cc2df058de8208aa49da96aa146b.png)

이 과정에서 EventBridge에서 생성된 실제 이벤트 데이터가 **이벤트 객체**가 되고, Lambda 실행 환경 정보는 **컨텍스트 객체**에 담겨 함께 전달된다.

## 이벤트 객체 (Event Object)

### 특징
이벤트 객체는 **JSON 형태의 데이터 문서**로, 다음과 같은 특징을 가진다.

- 함수가 처리해야 할 실제 데이터를 포함
- 호출하는 서비스에 따라 구조가 달라짐
- 사용하는 런타임에 따라 적절한 객체로 변환됨 (Python에서는 딕셔너리)

이벤트 객체가 **포함하는 정보**는 다음과 같다.

- 이벤트가 어디에서 발생했는지 (소스 정보)
- 관련된 서비스의 데이터
- 입력 인자나 서비스별 특정 매개변수
- 이벤트 발생 시간, 리전 등의 메타데이터

### 서비스별 이벤트 객체 구조
**S3 이벤트 객체 예시:**

```json
{
  "Records": [
    {
      "eventVersion": "2.1",
      "eventSource": "aws:s3",
      "awsRegion": "us-east-1",
      "eventTime": "2023-01-01T12:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "s3": {
        "bucket": {
          "name": "my-bucket"
        },
        "object": {
          "key": "my-image.jpg",
          "size": 1024
        }
      }
    }
  ]
}
```

**API Gateway 이벤트 객체 예시:**

```json
{
  "httpMethod": "GET",
  "path": "/users",
  "queryStringParameters": {
    "id": "123"
  },
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"name\": \"John\"}"
}
```

**SQS 이벤트 객체 예시:**

```json
{
  "Records": [
    {
      "messageId": "12345",
      "body": "Hello from SQS",
      "attributes": {
        "SenderId": "AIDA...",
        "SentTimestamp": "1234567890"
      }
    }
  ]
}
```

## 컨텍스트 객체 (Context Object)

### 컨텍스트 객체의 특징
**함수 실행 환경의 메타데이터**

- Lambda 런타임이 함수에 전달하는 정보
- 호출하는 서비스와 무관하게 일관된 구조
- 함수 실행과 관련된 AWS 환경 정보 포함

### 컨텍스트 객체에 포함된 주요 정보
**함수 식별 정보:**

- `function_name`: Lambda 함수 이름
- `function_version`: 함수 버전 ($LATEST 또는 특정 버전)
- `invoked_function_arn`: 호출된 함수의 ARN

**실행 환경 정보:**

- `memory_limit_in_mb`: 함수에 할당된 메모리 크기 (MB)
- `remaining_time_in_millis()`: 남은 실행 시간 (밀리초)

**요청 추적 정보:**

- `aws_request_id`: 고유한 요청 ID (디버깅시 중요)
- `log_group_name`: CloudWatch 로그 그룹 이름
- `log_stream_name`: CloudWatch 로그 스트림 이름

**기타 정보:**

- `client_context`: 모바일 앱에서 호출시 클라이언트 정보
- `cognito_identity`: Cognito 인증 사용시 사용자 정보

## Python 코드 예시

### 기본 핸들러 구조
```python
**def lambda_handler(event, context)**:

    # 이벤트 객체에서 정보 추출
    print(f"Event source: {event.get('source', 'Unknown')}")
    print(f"Event region: {event.get('region', 'Unknown')}")
    print(f"Event detail: {event.get('detail', {})}")

    # 컨텍스트 객체에서 정보 추출
    print(f"AWS Request ID: {context.aws_request_id}")
    print(f"Function ARN: {context.invoked_function_arn}")
    print(f"Function Name: {context.function_name}")
    print(f"Memory Limit: {context.memory_limit_in_mb}MB")
    print(f"Remaining Time: {context.get_remaining_time_in_millis()}ms")
    print(f"Log Group: {context.log_group_name}")
    print(f"Log Stream: {context.log_stream_name}")

    # 실제 비즈니스 로직 처리

    # ...
    return {
        'statusCode': 200,
        'body': 'Function executed successfully'
    }
```

핸들러는 이벤트와 컨텍스트를 갖고 있으며, 이벤트에는 이벤트의 소스나 리전과 같은 정보가 들어 있다.
그리고 컨텍스트에는 AWS 요청 ID, ARN과 이름, 사용 메모리 한도가 있으며 Cloudwatch 로그의  로그 스트림명, 로그 그룹명과 같은 것들이 포함되어 있다.

> 특정 정보가 이벤트 또는 컨텍스트 어디에서 오는지를 구분짓는 것이 중요하다.

### S3 이벤트 처리 예시
```python
**def lambda_handler(event, context)**:

    # S3 이벤트 객체에서 버킷과 객체 정보 추출
    **for record in event['Records']**:
        bucket_name = record['s3']['bucket']['name']
        object_key = record['s3']['object']['key']
        event_name = record['eventName']

        print(f"Processing {event_name} for {object_key} in {bucket_name}")

        # 컨텍스트에서 실행 환경 정보 확인
        print(f"Function: {context.function_name}")
        print(f"Request ID: {context.aws_request_id}")
        print(f"Remaining time: {context.get_remaining_time_in_millis()}ms")

        # 실제 S3 객체 처리 로직

        # process_s3_object(bucket_name, object_key)
    return {'processed': len(event['Records'])}
```

### API Gateway 이벤트 처리 예시
```python
import json

**def lambda_handler(event, context)**:

    # API Gateway 이벤트 객체에서 HTTP 정보 추출
    http_method = event['httpMethod']
    path = event['path']
    query_params = event.get('queryStringParameters') or {}
    headers = event.get('headers') or {}
    body = event.get('body')

    print(f"HTTP {http_method} request to {path}")
    print(f"Query parameters: {query_params}")

    # 컨텍스트에서 함수 정보 로깅
    print(f"Executed by function: {context.function_name}")
    print(f"Request ID: {context.aws_request_id}")

    # HTTP 응답 형태로 반환
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Success',
            'requestId': context.aws_request_id,
            'method': http_method,
            'path': path
        })
    }
```

## 이벤트 객체와 컨텍스트 객체 비교

### 정보의 성격이 다름
**1. 이벤트 객체:**

- **외부에서 전달되는 데이터**: "무엇을 처리할 것인가?"
- **가변적 구조**: 호출하는 서비스에 따라 완전히 다른 구조
- **비즈니스 로직과 직결**: 실제 처리해야 할 데이터

**2. 컨텍스트 객체: **

- **내부 실행 환경 정보**: "어떤 환경에서 실행되고 있는가?"
- **일관된 구조**: 호출 서비스와 무관하게 동일한 구조
- **운영 및 모니터링용**: 디버깅, 로깅, 성능 모니터링에 활용

### 사용 목적이 다름
**1. 이벤트 객체:**

```python

# 실제 비즈니스 로직에서 사용
**def process_user_data(event, context)**:
    user_id = event['userId']  # 이벤트에서 사용자 ID 추출
    action = event['action']   # 이벤트에서 수행할 액션 추출

    **if action == 'create'**:
        create_user(user_id)
    **elif action == 'delete'**:
        delete_user(user_id)
```

**2. 컨텍스트 객체:**

```python

# 로깅, 모니터링, 디버깅에서 사용
**def log_execution_info(event, context)**:
    logger.info(f"Function {context.function_name} started")
    logger.info(f"Request ID: {context.aws_request_id}")
    logger.info(f"Memory limit: {context.memory_limit_in_mb}MB")

    # 실행 시간 모니터링
    start_time = time.time()

    # 비즈니스 로직 실행
    process_data(event)

    # 실행 시간 체크
    execution_time = (time.time() - start_time) * 1000
    remaining_time = context.get_remaining_time_in_millis()

    if remaining_time < 1000:  # 1초 미만 남았을 때
        logger.warning("Function execution time running low!")
```