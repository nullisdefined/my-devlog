---
title: "Developing on AWS"
slug: "developing-on-aws"
date: 2025-07-08
tags: ["AWS"]
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6d093ecbb00918d0f80c849c8a1d93ce.png"
draft: true
views: 0
---
AWS 기반 개발에서 EC2를 직접 관리하는 것은 러닝 커브가 상당히 높을 수 있다. 보안, 로드밸런서, 오토스케일링 등을 모두 다뤄야 하기 때문이다. 반면 서버리스 아키텍처는 인프라의 구현 걱정 없이 기능 구현에만 집중할 수 있어 접근성이 좋다. 이번 실습에서는 다음과 같은 AWS 서버리스 서비스들을 다뤄본다.

- AWS Lambda
- API Gateway
- DynamoDB
- S3
- EventBridge
- Step Functions

실습 환경 구성



실습

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6d093ecbb00918d0f80c849c8a1d93ce.png)

실습환경 아키텍처


![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/24cb65e99c751374673ed9ba21eb6b63.png)


### 태스크 1.4: VS Code 환경에 올바른 역할이 연결되어 있는지 확인.

9.  **명령:** [AWS CLI 명령 참조 - AWS Security Token Service(AWS STS)](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/sts/index.html)에 따라 선택한 올바른 명령을 실행하여 이제 VS Code가 어느 보안 인증 정보를 사용하여 **TODO 1**에 대한 요청을 인증하는지 확인합니다.

- 보기 A

```
aws sts get-caller-identity
```

- 보기 B

```
aws sts decode-authorization-message
```

 **답변:** 아래 섹션을 확장하여 해결 방법을 확인할 수 있습니다.

## TODO 1 해답

- **보기 A가 정답입니다.**

```
aws sts get-caller-identity
```

- 보기 B는 decode-authorization-message 명령을 호출하므로 정답이 아닙니다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/26640299b2536489948c415dd45274f9.png)

CLI에서 명령어 실행 결과 이런식으로 출력됨
notes-application-role이라는 역할이 출력되는 것을 볼수있음


### 태스크 1.3: AWS CLI 리전 설정정

 **명령:** **VS Code 터미널**을 사용하여 

aws configure

 명령을 실행합니다. 

REGION

 값을 이 지침의 왼쪽에 표시된 리전 값으로 업데이트해야 합니다. 그리고 AWS 액세스 키 ID와 AWS 시크릿 액세스 키는 비워둔 채로 출력 형식을 

yaml

로 설정합니다.

 **참고:** 이 예제에서는 리전이 **ap-northeast-1**으로 설정되어 있지만 실습에서는 이 리전이 다를 수 있습니다.

```
aws configure
```

8. 메시지가 표시되면 다음을 확인합니다.

- **AWS Access Key ID** [비워 둠]: _ENTER_ 키를 누릅니다.
- **AWS Secret Access Key** [비워 둠]: _ENTER_ 키를 누릅니다.
- **Default region name** [적절한 리전으로 업데이트]: 
    
    REGION
    
- **Default output format** [yaml으로 업데이트]: 
    
    yaml
    

**예:**

```
**********************************
**** This is an EXAMPLE ONLY. ****
**********************************

AWS Access Key ID [None]:
AWS Secret Access Key [None]:
Default region name [None]: ap-northeast-1
Default output format [None]: yaml
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a88a0b9bdca62522032ac8f7bd372dd4.png)

iam의 role을 사용하기 때문에 액세스 키 부분을 비워둠

실제 콘솔에서 확인해보면 이렇게 보임

## 태스크 2: AWS 확장장 옵션 검토

이 태스크에서는 이제 AWS CLI를 구성했으므로 **AWS 확장**이 기능하는지 확인합니다.

개략적 지침

- **AWS** 확장 창을 엽니다.
- **profile**이 
    
    ec2:instance
    
    를 사용하도록 설정되어 있는지 확인합니다.
- **region**이 이 지침의 왼쪽에 있는 값과 일치하는지 확인합니다.
- **AWS Explorer**에서 서비스 리소스를 검토합니다.

상세 지침

10. 사이드 메뉴에서 **AWS** 확장으로 연결되는 링크인  (**AWS** 아이콘)를 선택합니다.

- 인스턴스에 연결된 인스턴스 프로파일을 사용하기 때문에 자동으로 연결되어야 합니다. 이는 **Explorer** 섹션 아래에 
    
    Connected with ec2:instance
    
    이라는 메시지로 표시됩니다.

11. AWS 확장의 **EXPLORER** 섹션 아래 **Add regions to AWS Explorer**…를 클릭합니다.
    
12. 이 지침의 왼쪽에 표시된 **LabRegion** 값을 기반으로 리전을 선택하고 **OK**를 클릭하세요.
    
13. **AWS Explorer**를 사용하여 다양한 AWS 서비스의 리소스를 보고, 생성하고, 업데이트하고, 삭제할 수 있습니다. 서비스를 검토하여 사용 가능한 옵션을 숙지하는 것이 좋습니다.
    

 **태스크 완료:** AWS 확장을 성공적으로 검토했습니다.


<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fc8ff35e08a187b2f5d586ca007fb57b.png" alt="image" width="300" />

이렇게 보인다


## 태스크 3: IAM 권한 확인

이 태스크에서는 명령을 실행하여 이 계정의 Amazon S3 버킷을 나열하고, 한 버킷을 삭제해보고, 

--debug

 명령을 실행하여 어디에서 삭제 시도가 실패하는지 확인합니다.

개략적 지침:

- aws s3
    
     명령을 실행하여 모든 s3 버킷을 **확인**합니다.
- aws s3
    
     명령을 실행하여 이름에 
    
    deleteme
    
    가 있는 폐기된 s3 버킷을 **삭제**합니다.
- aws s3
    
    명령을 실행하여 이름에 
    
    deleteme
    
    가 있는 폐기된 S3 버킷을 **삭제**하고 디버그 옵션을 사용합니다.

상세 지침:

### 태스크 3.1: AWS CLI Amazon S3 명령을 실행하여 버킷 보기

14.  **명령:** 명령 인터페이스에서 다음 명령을 실행하여 Amazon S3 버킷을 나열합니다.

```
aws s3 ls
```

 **예상 출력:**

```
******************************
**** EXAMPLE OUTPUT ****
******************************

2022-03-24 17:58:33 6nzxc1sjkmar-lab1deletemebucket-t63kd50lk000
2022-03-24 17:58:34 6nzxc1sjkmarkw5g4ugi-lab1bucket-1g9fvp2ico63h
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3751020f0fa14163db8a2ecd6df69c6c.png)
실제출력결과

 **참고:** 이 출력에는 이름에 

lab1

이 포함된 버킷이 나열됩니다. 실제로 출력된 목록에는 여기에 언급되지 않은 버킷이 포함될 수 있습니다. 또한 이러한 버킷에는 **lab1** 설명자 앞에 텍스트가 있습니다.

이렇듯 cli에서 보는것과 콘솔에서 보는것 그리고 sdk로 보는것은 접근 방법은 동일하다

### 태스크 3.2: AWS CLI Amazon S3 명령을 실행하여 버킷 삭제

15. 다음 명령을 실행하여 이후 명령에서 버킷 이름을 지정하는 데 사용할 **bucketToDelete**라는 변수를 생성합니다.

 **참고:** 이렇게 하면 이름에 **deleteme**가 있는 버킷으로만 버킷이 제한됩니다.

```
bucketToDelete=$(aws s3api list-buckets --output text --query 'Buckets[?contains(Name, `deletemebucket`) == `true`] | [0].Name')
```

 **예상 출력:**

오류가 발생하지 않으면 출력이 표시되지 않습니다.

16.  **명령:** **TODO 2**에서 이름에 
    
    deleteme
    
    가 포함된 용 버킷을 삭제하는 올바른 명령을 선택합니다. 필요한 경우 [AWS CLI 명령 참조 - Amazon S3](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/index.html)를 사용하십시오.

- 보기 A

```
aws s3 remove-bucket s3://$bucketToDelete
```

- 보기 B

```
aws s3 rb s3://$bucketToDelete
```

 **답변:** 아래 섹션을 확장하여 해결 방법을 확인할 수 있습니다.

## TODO 2 해답

 **예상 출력:**

```
******************************
**** EXAMPLE OUTPUT ****
******************************

remove_bucket failed: s3://6nzxc1sjkmar-lab1deletemebucket-t63kd50lk000 An error occurred (AccessDenied) when calling the DeleteBucket operation: Access Denied
```

**Access Denied** 오류가 발생했습니다. 이 명령을 실행하는 데 권한 문제가 있는 것 같습니다.

### 태스크 3.3: --debug를 사용하여 AWS CLI Amazon S3 명령을 실행해 버킷 삭제

**–debug** 옵션을 포함하면 다음과 같은 세부 정보가 포함됩니다.

- 보안 인증 정보 검색
- 제공된 파라미터 구문 분석
- AWS 서버로 전송된 요청 구성
- AWS로 전송된 요청의 내용
- 원시 응답의 내용
- 서식 지정된 출력

17.  **명령:** 명령 인터페이스에서 다음 명령을 실행하여 이름에 
    
    deleteme
    
    이 포함된 버킷을 삭제합니다.

```
aws s3 rb s3://$bucketToDelete --debug
```

 **참고:** 출력은 다소 길 수 있으므로 아래의 글머리 기호 목록은 프로세스 및 요청이 거부된 이유를 이해하는 데 도움이 되는 출력 정보를 강조 표시합니다.

 **예상 출력:**

- 요청을 개별 인수로 분할하는 디버그의 시작.

```
******************************
**** EXAMPLE OUTPUT ****
******************************

2022-03-24 19:19:39,813 - MainThread - awscli.clidriver - DEBUG - Arguments entered to CLI: ['s3', 'rb', 's3://6nzxc1sjkmar-lab1deletemebucket-t63kd50lk000', '--debug']
```

- 이제 디버그는 인스턴스 메타데이터를 검색하여 **인증 프로세스**를 시작합니다. 사용할 인스턴스 프로파일 **notes-application-role**을 발견합니다.

```
******************************
**** EXAMPLE OUTPUT ****
******************************

2022-03-24 19:19:39,839 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: env
2022-03-24 19:19:39,839 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: assume-role
2022-03-24 19:19:39,839 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: assume-role-with-web-identity
2022-03-24 19:19:39,840 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: sso
2022-03-24 19:19:39,840 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: shared-credentials-file
2022-03-24 19:19:39,840 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: custom-process
2022-03-24 19:19:39,840 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: config-file
2022-03-24 19:19:39,841 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: ec2-credentials-file
2022-03-24 19:19:39,841 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: boto-config
2022-03-24 19:19:39,841 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: container-role
2022-03-24 19:19:39,841 - MainThread - botocore.credentials - DEBUG - Looking for credentials via: iam-role

2022-03-24 19:19:39,848 - MainThread - botocore.credentials - DEBUG - Found credentials from IAM Role: notes-application-role
```

- 다음으로, **v4 auth**를 사용하여 **서명**을 확인한 후 **Amazon S3 요청**을 준비하고, 응답 헤더, 응답 본문을 생성하고, 버킷 목록을 반환합니다.

```
******************************
**** EXAMPLE OUTPUT ****
******************************

2022-03-24 19:19:39,893 - MainThread - botocore.auth - DEBUG - Calculating signature using v4 auth.
2022-03-24 19:19:39,893 - MainThread - botocore.auth - DEBUG - CanonicalRequest:
DELETE
/

host:6nzxc1sjkmar-lab1deletemebucket-t63kd50lk000.s3.ap-northeast-1.amazonaws.com
x-amz-content-sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
x-amz-date:20220324T191939Z
x-amz-security-token:IQoJb3JpZ2luX2VjENr//////////wEaDmFwLW5vcnRoZWFzdC0xIkYwRAIgMQ6lF0VuNK96WM5KqACmFmMPSRJpe08nLvahhsIzmNsCIH6lB+/N/dHFnRUPS9AwrmwCBNZTY9iOOy0FGaSrtZM2KoQECGQQAhoMNzEwNjA2ODYzMTk4IgweYZgX3OUW4KfPMBYq4QMzS41cdKcix5pk5kbRzIh77Cim/malp+V5MZl70uIaesg5M2GKrtKabo4dXtAl/as7Zz3UORmqyoGo6xcQXZjUwMmtdL4BFa5BCXvDMgGtVShJkyV2KJFPBsekYqThmOp4ZaPC+Acuac+5k6lesTJz48wG/jbbEBzRiOUTYwez+rL+bg2YENVO+lyyGuMweOH90RnDT507c2NwIBGxbjIZ7PLyPT/x1Fc7nnVosFel+m0/OPqz4B6hrahTH+ZLh68yOej6QaSAJDklNEr1dig/vhIwwkZZRlHtwQN91LEmvH7yNNu8WiBbYwL6+apEZ2cgctSvgQL8yeVkoL416bRTDdXColmwKLfBu1cSIV/r0nUP3C5qY5VMfdollBSq6KlPcrM/z3BWCK+I2LU5ufUS1ZwVI/sxQd3wIXC+qA0cCucpUxyWySRXi3UHg99SD343/TnaW2/eO8VIktWGtePXzr4hFQR0KrM/V4HzdACNK/HENItxSnNYJD0F29iqgJUDBZd/p7tXOqhAyFXkE8ROXr2Sr0kTbc5sMD6Z5z5Uk8688ojVcaZ8EWFB0Jtod1fjeV9UqImDrPPHOrwZEksF2B2p1rjhkmrMkoz6s+1qG0xY7rM5PMK2//NwMoN0pMeGMOX18pEGOqYB5qiG15/m/2Lm9FK+NY2VbDyKQeI2KYg1Nlp+BX+CkVc04hhMvLnYAkHFaKghTb7/GxW0qWfQkRNPzXnyaqF0rdfjiMbhzegnfnX2PW1aX2c0Xo92uHZS0tDX3Rj1y2u49BbAo7Zu7Op/ucov86o1sJMRbDfGoc91QT4EMEHp7lxSN8ACbw2SDH2pzbAjRH0OM2VN0yyUMBuzJmbJklc+Zbuo5tHEUg==

host;x-amz-content-sha256;x-amz-date;x-amz-security-token
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
2022-03-24 19:19:39,893 - MainThread - botocore.auth - DEBUG - StringToSign:
AWS4-HMAC-SHA256
20220324T191939Z
20220324/ap-northeast-1/s3/aws4_request
```

- 마지막으로 **Amazon S3 endpoint**에 연결합니다. **403 오류** **Access Denied**가 발생합니다.

```
******************************
**** EXAMPLE OUTPUT ****
******************************

2022-03-24 19:19:39,894 - MainThread - urllib3.connectionpool - DEBUG - Starting new HTTPS connection (1): 6nzxc1sjkmar-lab1deletemebucket-t63kd50lk000.s3.ap-northeast-1.amazonaws.com:443
2022-03-24 19:19:39,981 - MainThread - urllib3.connectionpool - DEBUG - https://6nzxc1sjkmar-lab1deletemebucket-t63kd50lk000.s3.ap-northeast-1.amazonaws.com:443 "DELETE / HTTP/1.1" 403 None
2022-03-24 19:19:39,982 - MainThread - botocore.parsers - DEBUG - Response headers: {'x-amz-request-id': '7XBWQ3W8JM3KRY1W', 'x-amz-id-2': 'HcRkKJkSag//iCDC+ap7N/FaWWYNPhAsOdTE24I6pFYPdn+sZ7qtv1mzy4ZcKID++GCjomil6ks=', 'Content-Type': 'application/xml', 'Transfer-Encoding': 'chunked', 'Date': 'Thu, 24 Mar 2022 19:19:39 GMT', 'Server': 'AmazonS3'}
2022-03-24 19:19:39,982 - MainThread - botocore.parsers - DEBUG - Response body:
b'<?xml version="1.0" encoding="UTF-8"?>\n<Error><Code>AccessDenied</Code><Message>Access Denied</Message><RequestId>7XBWQ3W8JM3KRY1W</RequestId><HostId>HcRkKJkSag//iCDC+ap7N/FaWWYNPhAsOdTE24I6pFYPdn+sZ7qtv1mzy4ZcKID++GCjomil6ks=</HostId></Error>'

remove_bucket failed: s3://6nzxc1sjkmar-lab1deletemebucket-t63kd50lk000 An error occurred (AccessDenied) when calling the DeleteBucket operation: Access Denied
```

이 명령은 **notes-application-role**에 

s3:DeleteBucket

 IAM 권한이 위임되지 않았기 때문에 실패했습니다.

 **태스크 완료**: IAM 권한을 성공적으로 확인했습니다.

---

## 태스크 4: 누락된 권한을 개발자 역할에 추가

이 태스크에서는 방금 발생한 권한 문제를 해결하기 위해 **notes-application-role**에 적절한 역할을 할당해야 합니다. 시간을 절약하기 위해 이미 생성된 관리형 **IAM 정책**을 사용합니다. 먼저 

s3:DeleteBucket

 권한이 포함된 이 정책을 검토한 다음 

notes-application-role

에 연결합니다. 다음 명령을 실행하여 이름에 

deleteme

가 포함된 버킷을 삭제합니다.

 **참고:** 대부분의 조직에서는 IAM 권한 부여, 제거 및 승격을 보안 팀에서 관리합니다. 이 실습에서는 학습을 위해 **s3:DeleteBucket** 권한이 포함된 고객 관리형 정책을 추가하고 이 특정 역할에 적용할 수 있는 권한을 제공합니다.

개략적 지침:

- aws iam
    
     명령을 실행하여 
    
    S3DeleteBucketPolicyARN
    
     **version 1**의 권한을 검토합니다.
- aws iam
    
     명령을 실행하여 
    
    S3-Delete-Bucket-Policy
    
    를 
    
    notes-application-role
    
    에 연결합니다.
- aws s3
    
     명령을 실행하여 이름에 
    
    deleteme
    
    가 있는 폐기된 버킷을 제거합니다.


![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c6aa6bbae742f87e4594d250f5482c44.png)


상세 지침:

### 태스크 4.1: 고객 관리형 IAM 정책 검토

18.  **명령:** 다음 명령을 실행하여 다음 명령에 사용되는 정책 ARN 값을 **$policyArn** 변수에 할당합니다.

```
policyArn=$(aws iam list-policies --output text --query 'Policies[?PolicyName == `S3-Delete-Bucket-Policy`].Arn')
```

 **예상 출력:**

오류가 발생하지 않으면 출력이 표시되지 않습니다.

19.  **명령:** 다음 명령을 실행하여 
    
    S3-Delete-Bucket-Policy
    
     정책의 정책 문서를 검토합니다. 이 정책은 역할에 delete bucket 권한을 부여하기 위해 미리 생성된 것입니다.

```
aws iam get-policy-version --policy-arn $policyArn --version-id v1
```

 **예상 출력:**

```
******************************
**** EXAMPLE OUTPUT ****
******************************

PolicyVersion:
  CreateDate: '2022-03-24T17:58:58+00:00'
  Document:
    Statement:
    - Action:
      - s3:DeleteBucket
      Effect: Allow
      Resource: arn:aws:s3:::6nzxc1sjkmar-lab1deletemebucket-t63kd50lk000
    Version: '2012-10-17'
  IsDefaultVersion: true
  VersionId: v1
```

### 태스크 4.2: IAM 정책을 notes-application-role에 연결

20.  **명령:** [AWS CLI 명령 참조 - IAM](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/iam/index.html)에 따라 **TODO 3**에 올바른 명령을 사용하여 
    
    S3-Delete-Bucket-Policy
    
     정책을 
    
    notes-application-role
    
     역할에 연결합니다.

 **참고:** 

policy-arn

 값에 **$policyArn** 변수를 지정합니다.

- 보기 A

```
aws iam attach-role-policy --policy-arn $policyArn --role-name notes-application-role
```

- 보기 B

```
aws iam attach-role-policy --policy-arn $policyArn --user-name notes-application-role
```

 **답변:** 아래 섹션을 확장하여 해결 방법을 확인할 수 있습니다.

## TODO 3 해답

 **예상 출력:**

오류가 발생하지 않으면 출력이 표시되지 않습니다.

### 태스크 4.3: 역할에 연결된 정책 검토

-  **명령:** 정책이 추가되었는지 확인하려면 다음 IAM 명령을 실행합니다.

```
aws iam list-attached-role-policies --role-name notes-application-role
```

 **예상 출력:**

```
******************************
**** EXAMPLE OUTPUT ****
******************************

AttachedPolicies:
- PolicyArn: arn:aws:iam::012345678901:policy/S3-Delete-Bucket-Policy
  PolicyName: S3-Delete-Bucket-Policy
- PolicyArn: arn:aws:iam::aws:policy/ReadOnlyAccess
  PolicyName: ReadOnlyAccess
- PolicyArn: arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
  PolicyName: AmazonSSMManagedInstanceCore
```

### 태스크 4.4: 버킷 삭제 명령을 실행하여 버킷이 삭제되었는지 확인

21.  **명령:** 이제 **notes-application-role**에는 이름에 
    
    deleteme
    
    이 포함된 버킷을 삭제할 권한이 있으므로 다음 명령을 실행합니다.

```
aws s3 rb s3://$bucketToDelete
```

 **예상 출력:**

```
******************************
**** EXAMPLE OUTPUT ****
******************************

remove_bucket: 6nzxc1sjkmar-lab1deletemebucket-t63kd50lk000
```

22.  **명령:** **명령 인터페이스**를 사용하여 버킷이 제거되었는지 확인하려면 다음 명령을 입력합니다.

```
aws s3 ls
```

 **예상 출력:**

```
******************************
**** EXAMPLE OUTPUT ****
******************************

2022-03-24 17:58:34 6nzxc1sjkmarkw5g4ugi-lab1bucket-1g9fvp2ico63h
```

 **참고:** 이 출력에는 이름에 **lab1**이 포함된 버킷만 나열됩니다. 출력에 추가 버킷이 있을 수도 있습니다.

- **Amazon S3** 콘솔에서도 버킷이 삭제되었는지 확인할 수 있습니다.
    
- 또한 **AWS Explorer** 창으로 이동하여 **Amazon S3** 메뉴를 새로 고치면 버킷이 삭제되었는지 확인할 수 있습니다.
    

 **태스크 완료:** 누락된 권한을 추가했습니다.

---

## 결론

다음 작업을 성공적으로 수행했습니다.

- 개발 환경에 연결함
- IDE 및 AWS CLI가 설치되어 있고 애플리케이션 프로파일을 사용하도록 구성되어 있는지 확인함
- AWS CLI 명령을 실행하는 데 필요한 권한이 부여되었는지 확인함
- 역할에 IAM 정책을 할당하여 Amazon S3 버킷을 삭제함