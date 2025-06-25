---
title: "Introduction to AWS Lambda"
slug: "introduction-to-aws-lambda"
date: 2025-06-25
tags: ["AWS", "Serverless", "Lambda", "S3"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/535202db6c9fc67b95b4b3a4778472b2.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/535202db6c9fc67b95b4b3a4778472b2.png)


![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d7cbd301e4eaa799d03461935af1686c.png)
*구현할 서버리스 아키텍처 흐름*

다음은 AWS Skill Builder의 **Introduction to AWS Lambda** 실습 과정을 따라하며 서버리스 아키텍처를 직접 구현한 내용이다. 이번 실습의 목표는 AWS Lambda와 S3를 활용하여 이미지가 업로드되는 순간 자동으로 썸네일을 생성하는 시스템을 구축하는 것이다.

## 실습 아키텍처 살펴보기

먼저 구현할 시스템의 전체적인 흐름을 파악해보자.

1. 사용자가 **Amazon S3**의 소스 버킷에 이미지를 업로드한다.
2. Amazon S3가 객체 생성 이벤트를 감지한다.
3. Amazon S3가 Lambda 함수를 호출하고 이벤트 데이터를 전달한다.
4. AWS Lambda가 함수를 실행한다.
5. Lambda 함수는 이벤트 데이터에서 버킷 이름과 객체 키를 확인하고, 원본 이미지를 읽어 썸네일을 생성한 후 대상 버킷에 저장한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7e8ac820333339bf738757509cf2f46b.png)
*사용자의 액세스 권한*

이벤트 기반 아키텍처의 특징은 자동화다. 별도의 서버나 스케줄러 없이도 파일 업로드라는 이벤트만으로 썸네일 생성 프로세스가 자동으로 시작될 수 있다.

## 1. S3 버킷 생성하기

실습을 시작하기 위해 원본 이미지와 썸네일을 저장할 두 개의 S3 버킷을 생성했다.

AWS Management Console에서 S3 서비스로 이동한 후 **Create bucket**을 선택했다. 버킷 이름은 전 세계적으로 고유해야 하므로 `images-123456789`와 같은 형태로 임의의 숫자를 추가했다.

첫 번째 버킷 생성 후, 썸네일 저장용으로 두 번째 버킷을 생성했다. 이때는 첫 번째 버킷 이름 뒤에 `-resized`를 추가하여 `images-123456789-resized`로 명명했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9ccc867d2b4f8b09cb9488fef3be9597.png)
*생성된 두 개의 S3 버킷*

테스트를 위해 원본 버킷에 샘플 이미지(`HappyFace.jpg`)를 업로드했다. 이 이미지는 1280 x 853 크기의 비교적 큰 이미지로, 썸네일 생성 효과를 확인하기에 적합했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3dfdcc85b7d3cd84b36b760a73d384f6.png)
*원본 이미지를 images-123176236 버킷에 업로드*

## 2. Lambda 함수 생성하기

이제 핵심인 Lambda 함수를 생성할 차례다. 이 함수가 실제로 이미지 크기 조정 작업을 담당한다.

AWS Management Console에서 Lambda 서비스로 이동하여 **Create function**을 선택했다. **Author from scratch** 옵션을 선택하고 다음과 같이 설정했다.

- **Function name**: `Create-Thumbnail`
- **Runtime**: `Python 3.9`
- **Execution role**: 기존에 준비된 `lambda-execution-role` 사용

이 실행 역할은 Lambda 함수가 S3 버킷에 읽기/쓰기 권한을 가질 수 있도록 해준다. 실제 운영 환경에서는 최소 권한 원칙에 따라 필요한 권한만 부여해야 한다.

### S3 트리거 설정하기

Lambda 함수가 S3 이벤트에 반응하도록 트리거를 설정했다. 함수 페이지에서 **Add trigger**를 선택하고 다음과 같이 구성했다.

- **Trigger configuration**: S3 선택
- **Bucket**: 원본 이미지 버킷(`images-123456789`) 선택
- **Event type**: `All object create events` 선택

이제 해당 버킷에 파일이 업로드될 때마다 Lambda 함수가 자동으로 실행된다.

### 함수 코드 업로드하기

실습에서는 미리 준비된 Python 코드를 S3에서 다운로드하여 사용했다. 이 코드는 Pillow 라이브러리를 사용하여 이미지 크기를 조정하는 기능을 포함하고 있다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ea7b6ed3333c12876f66dd5e055a4e00.png)
*업로드된 Lambda 함수 코드*

코드의 주요 동작 방식은 다음과 같다.

- S3 이벤트에서 버킷 이름과 객체 키 추출
- 원본 이미지를 Lambda의 임시 스토리지(`/tmp`)에 다운로드
- Pillow 라이브러리로 이미지 크기 조정
- 조정된 이미지를 `-resized` 버킷에 업로드

중요한 설정 중 하나는 **Handler** 값을 `CreateThumbnail.handler`로 변경하는 것이었다. 이는 Lambda가 어떤 함수를 실행할지 알려주는 진입점 역할을 한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9f66def0e3aafb391319d69a086caa3f.png)
*Runtime settings - Python 3.9*

## 3. 함수 테스트하기

실제 파일 업로드 전에 함수가 제대로 작동하는지 테스트해보았다. Lambda는 테스트 이벤트를 통해 실제 S3 이벤트를 시뮬레이션할 수 있다.

**Test** 탭에서 새 테스트 이벤트를 생성하고 S3 Put 템플릿을 선택했다. 그 후 JSON에서 버킷 이름과 객체 키를 실제 값으로 수정했다.

```json
{
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "us-east-1",
      "eventTime": "1970-01-01T00:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "EXAMPLE"
      },
      "requestParameters": {
        "sourceIPAddress": "127.0.0.1"
      },
      "responseElements": {
        "x-amz-request-id": "EXAMPLE123456789",
        "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "testConfigRule",
        "bucket": {
          "name": "images-123176236",
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          },
          "arn": "arn:aws:s3:::images-123176236"
        },
        "object": {
          "key": "HappyFace.jpg",
          "size": 1024,
          "eTag": "0123456789abcdef0123456789abcdef",
          "sequencer": "0A1B2C3D4E5F678901"
        }
      }
    }
  ]
}
```

테스트를 실행하니 `Executing function: succeeded` 메시지와 함께 성공했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/84cff8812302123376f94117dc4ef8e9.png)

실행 결과에서 확인할 수 있었던 정보들은 다음과 같다.

- 실행 시간: 약 몇 초
- 구성된 리소스: 메모리 사용량
- 로그 출력: 함수 내부 동작 로그

당연히 `-resized` 버킷을 확인했을 때 썸네일이 정상적으로 생성되어 있다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/028d80f7f30d3a4cc42640307619aab0.png)

원본 이미지에 비해 훨씬 작은 크기의 썸네일이 자동으로 생성된 것을 확인할 수 있었다.

## 4. 모니터링 및 로깅

실습의 마지막 단계에서는 Lambda 함수의 모니터링 기능을 살펴보았다. **Monitor** 탭에서는 다양한 지표를 확인할 수 있었다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/486221670ce343000b375c1f337a59bc.png)
*Lambda 함수 모니터링 대시보드*

주요 지표들은 다음과 같다.

- **Invocations**: 함수 호출 횟수
- **Duration**: 실행 시간 (평균, 최소, 최대)
- **Error count and success rate**: 오류율과 성공률
- **Throttles**: 동시 실행 제한으로 인한 제한 횟수

특히 인상적이었던 부분은 CloudWatch Logs와의 연동이었다. View CloudWatch logs를 통해 함수 실행 로그를 상세히 확인할 수 있었고, 이는 디버깅이나 성능 최적화에 유용할 것이라 생각이 들었다.

## 마치며

이번 AWS Lambda 실습을 통해 서버리스 아키텍처를 직접 체험할 수 있었다. 특히 인상 깊었던 점들은 다음과 같다.

**간편한 설정**: 복잡한 서버 설정 없이도 몇 번의 클릭만으로 자동화된 이미지 처리 시스템을 구축할 수 있었다.

**이벤트 기반 아키텍처**: 파일 업로드라는 이벤트에 자동으로 반응하여 처리하는 방식이 매우 효율적이었다.

**비용 효율성**: 실제로 함수가 실행되는 시간만큼만 비용이 발생하므로, 간헐적인 이미지 처리 작업에는 매우 경제적일 것 같다.

실제 프로덕션 환경에서 활용한다면 에러 핸들링, 다양한 이미지 포맷 지원, 여러 크기의 썸네일 생성 등의 기능을 추가할 수 있을 것이다. 또한 이번 실습의 패턴은 이미지 처리뿐만 아니라 파일 변환, 데이터 처리, 알림 시스템 등 다양한 용도로 응용할 수 있겠다는 생각이 들었다.

> 이 글은 AWS Skill Builder의 [Introduction to AWS Lambda](https://skillbuilder.aws/learn) 실습 과정을 정리한 내용입니다.