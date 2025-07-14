---
title: "Getting Started with Amazon ECR"
slug: "getting-started-with-amazon-ecr"
date: 2025-07-15
tags: ["AWS", "ECR", "SAM", "Lambda", "Docker"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2be604e9718a8ed5766637a2cf6f406d.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2be604e9718a8ed5766637a2cf6f406d.png)

이번 실습에서는 AWS Lambda를 컨테이너 이미지 기반으로 배포하고, 로컬 테스트부터 API Gateway를 통한 호출, 그리고 컨테이너 이미지 재배포까지의 과정을 진행했다.

## 1. Lambda 컨테이너 이미지 개념
기존 Lambda는 ZIP으로 압축된 코드 패키지를 사용하는 방식이었지만, 지금은 최대 10GB의 컨테이너 이미지를 지원한다. 이 기능을 통해 머신러닝 모델처럼 대용량 의존성을 가진 애플리케이션도 서버리스 방식으로 실행할 수 있다.
즉, Lambda의 운영 간편성(서버리스, 오토스케일링, 고가용성)은 그대로 유지하면서 컨테이너의 유연성을 가질 수 있다.

## 2. SAM 애플리케이션 생성 및 패키지 설치
SAM(Serverless Application Model)은 AWS에서 제공하는 오픈소스 프레임워크로, 서버리스 애플리케이션을 빠르게 구축, 테스트, 배포할 수 있도록 돕는다.
특히 컨테이너 이미지 기반의 Lambda도 간편하게 관리할 수 있다.

```bash
sam init
npm init -y && npm i pdfkit faker
```

pdfkit, faker 라이브러리를 이용해 PDF 파일을 생성하는 Lambda 함수를 구현한다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7780473ba50251ab381bf1fa640cb94d.png" alt="image" width="700" />

## 3. Docker 이미지 생성 및 로컬 테스트
컨테이너 환경에서 Lambda를 테스트하기 위해 Dockerfile을 작성한 후 이미지를 빌드하고 실행한다.

```bash
docker build -t getletter .
docker images
docker run -p 9000:8080 getletter:latest
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

위 명령어로 Lambda Runtime Interface Emulator(RIE)를 활용하여 로컬 테스트를 수행할 수 있다.
호출 결과는 PDF의 Base64 인코딩 데이터로 응답된다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c7ef3d00d57362325e901f897e504936.png" alt="image" width="700" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2dd7da2ed35e8ec5ce17bfe9ea93e4ac.png" alt="image" width="600" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1166b77bc641efb72f3e398eee7ac8cc.png" alt="image" width="700" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/95966ff381cbfc1fe792f0cedf41e3b1.png" alt="image" width="800" />

## 4. SAM으로 빌드 및 로컬 호출
SAM은 docker 명령 없이도 컨테이너 이미지를 빌드하고, 로컬 테스트까지 지원한다.

```bash
sam build
sam local invoke GetLetter
```

- sam build는 Dockerfile을 기반으로 자동으로 이미지 빌드
- sam local invoke는 로컬에서 Lambda 함수 실행

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/cb29fc3384ff162884a8c817536d1d7c.png" alt="image" width="700" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7fd45fe89781fd974c7492e77ecc350f.png" alt="image" width="700" />

## 5. Amazon ECR에 컨테이너 이미지 업로드
배포할 컨테이너 이미지를 ECR에 업로드한다.

```bash
aws ecr create-repository --repository-name getletter
docker tag getletter:latest <repositoryUri>
aws ecr get-login-password | docker login --username AWS --password-stdin <repositoryUri>
docker push <repositoryUri>:latest
```

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a2f458e903dc62e02ff7b0e46605bf44.png" alt="image" width="600" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8e9a86f1591dd47330daa54c3b2596d7.png" alt="image" width="600" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/43060b49c083d1d03574d09184760fba.png" alt="image" width="700" />

## 6. Lambda 함수 배포 (SAM CLI)
컨테이너 이미지가 ECR에 등록되었으면, SAM을 통해 Lambda 함수로 배포한다.

```bash
sam deploy \
  --stack-name getletter \
  --s3-bucket <S3Bucket> \
  --capabilities CAPABILITY_AUTO_EXPAND \
  --image-repository <repositoryUri>
```

- CloudFormation 스택으로 배포되며, 필요한 리소스를 자동으로 생성 및 연결한다

## 7. Lambda + API Gateway 트리거 설정
Lambda 콘솔에서 Add Trigger > API Gateway (HTTP API) 트리거를 설정한다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9b60e3ade052c505db87c4a3a2c2acb9.png" alt="image" width="600" />

설정 후 제공된 API Gateway URL을 통해 Lambda 함수를 호출하면 PDF 파일을 브라우저에서 다운로드됨을 확인할 수 있다.

## 8. 컨테이너 수정 및 재배포

Lambda 함수의 코드를 수정 후 다음 과정을 수행한다.

```bash
sam build
sam deploy ...
```

예시로 app.mjs에 날짜 출력 기능을 추가하고 다시 배포하면, 호출된 PDF에 날짜가 포함되어 있는 것을 확인할 수 있었다.
SAM은 기존 스택에 대해 변경사항만 감지하여 필요한 리소스만 업데이트 해준다.

## 마치며
이번 실습을 통해 AWS Lambda를 컨테이너 이미지로 배포하는 전체 과정을 직접 경험할 수 있었다. 기존의 ZIP 방식과 달리, 컨테이너 이미지를 활용하면 대용량 의존성이나 복잡한 애플리케이션도 서버리스 환경에서 보다 유연하게 운영할 수 있다는 점이 인상 깊었다.
특히 sam init, sam build, sam deploy 명령만으로 애플리케이션을 손쉽게 생성하고, Docker와 RIE를 활용해 로컬에서 테스트할 수 있었던 점이 인상적이었다. 또한, ECR에 이미지를 푸시하고 Lambda 함수에 연결한 뒤 API Gateway를 통해 결과(PDF)를 확인하는 일련의 흐름은 컨테이너와 서버리스 아키텍처를 통합하는 방식에 대한 이해를 높이는 데 도움이 되었다.
마지막으로 코드 수정 후 이미지 재배포 과정도 간편하게 이루어졌으며, SAM이 변경 사항만 자동으로 반영해주는 점에서 운영 효율성도 충분히 체감할 수 있었다.