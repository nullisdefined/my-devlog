---
title: "Getting Started with Amazon ECS"
slug: "getting-started-with-amazon-ecs"
date: 2025-07-15
tags: ["AWS", "ECS", "Docker", "IAM", "Fargate", "EC2"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2be604e9718a8ed5766637a2cf6f406d.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2be604e9718a8ed5766637a2cf6f406d.png)

## Amazon ECS란?
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b7bfcf202edcc1eadb843e6ded544cf6.png" alt="image" width="700" />

Amazon ECS(Amazon Elastic Container Service)는 AWS에서 제공하는 완전관리형 컨테이너 오케스트레이션 서비스이다.
쉽게 말해, 컨테이너 앱을 실행하고 관리하는 자동화된 시스템이다. 

예를 들어 Docker로 만든 웹 서비스를 운영하고 싶다고 할 때, 직접 서버를 설치해 컨테이너를 띄우고 관리해야 한다.
그런데 ECS를 활용하면 AWS가 대신 컨테이너를 배포하고, 실행하고, 상태를 체크해주는 등 많은 작업을 자동으로 처리헤준다.

실행 방식은 크게 두 가지가 있다.
- EC2 기반: 개발자가 직접 서버를 구성하고, 그 위에서 컨테이너를 실행
- Fargate 기반: 서버를 신경 쓰지 않고 컨테이너만 정의하면 AWS가 자동으로 실행
- Outposts를 통해 온프레미스 환경에서도 ECS 기능을 사용할 수 있으며
- ECS Anywhere를 활용하면 자체 보유 서버 어디서든 ECS의 기능을 적용할 수 있다

### 주요 기능 요약
- Docker 컨테이너 실행 및 오케스트레이션
    → 컨테이너 앱의 실행, 중단, 배포, 확장을 자동으로 관리

- EC2 또는 Fargate 기반 실행 방식 선택 가능
    → 서버 직접 관리 또는 서버리스 방식 중 선택

- AWS 서비스와의 통합 용이
    → IAM(권한 관리), CloudWatch(모니터링), ELB(트래픽 분산) 등과 쉽게 연동 가능

## Amazon ECS 구성 요소
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/124f03f8dc88d5744e38fd013a2bbe97.png" alt="image" width="600" />

**- **컨테이너****:
	- 애플리케이션 코드와 라이브러리, 종속성을 함께 패키징한 실행 단위
	- 보통 Docker 이미지를 사용하며 Amazon ECR에 저장됨
**- **클러스터****:
	- 컨테이너를 실행할 수 있는 인프라의 논리적 집합
	- EC2 인스턴스 또는 Fargate 환경이 포함
**- **태스크 정의(Task Definition)****:
	- 실행할 컨테이너의 이미지, CPU/메모리, 네트워크 설정 등을 포함하는 JSON 문서
	- 다시 말해, 어떤 컨테이너를 어떤 방식으로 실행할 것인가?를 명시한 문서
**- **태스크(Task)****:
	- 태스크 정의 문서를 기반으로 실행되는 실제 컨테이너 단위
	- 여러 개의 컨테이너를 하나의 단위로 묶음
	- k8s의 pod 개념과 유사
**- **서비스(Service)****:
	- ECS가 태스크 수를 유지하고 상태를 모니터링하며 실패한 태스크를 자동으로 재시작해주는 기능
	- 로드 밸런서와 연결 가능

## 실습 아키텍처
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ad585953bfde3f09b7efa715ef31d7d6.png)*실습 환경 아키텍처*

- WebSite: 사용자가 문장을 입력할 수 있는 프론트엔드
- API: 명사, 동사, 형용사 등 단어를 반환하는 Express 기반 Node.js API
- Save: 사용자가 생성한 문장을 DynamoDB에 저장하는 API

각 구성요소는 독립된 컨테이너로 구성되며, Application Load Balancer를 통해 접근이 가능하도록 설계되어 있다.

### 실습 흐름 요약

#### 1.	Docker 이미지 빌드
각 디렉터리(WebSite, API, Save)로 이동해 Dockerfile을 확인하고 Docker 이미지를 빌드했다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/290a82f8176da3ab32aa07f6182cefd4.png" alt="image" width="500" />

```bash
docker build -t storyizer/website --build-arg ELBDNS=$ALB_DNS_NAME .
```

#### 2.	Amazon ECR 리포지토리 생성 및 이미지 푸시
- ECR 레포지토리를 3개(WebSite, API, Save) 생성
- Docker 이미지를 각각 태그 지정 후 push

```bash
docker tag storyizer/website:latest $WEBSITE_URI:latest
docker push $WEBSITE_URI:latest
```

**ECR 인증 과정:**
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b4b3bd796c17da560b745e10b807b9a4.png)


**태그 및 푸시 확인:**
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e29de09bae568ede4e806265874ea73a.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8315302e3e2ed8e58b6ee369e1686a23.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d4b7fa335c92878b9c513202cf0793ba.png)

#### 3.	태스크 정의(Task Definition) 등록
각 마이크로서비스별로 JSON 형식의 태스크 정의 파일이 생성되어 있다.

```bash
tree ~/scripts/
cat ~/scripts/Site.json
```

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bb491e9d92d93b9b1e48760945eab209.png" alt="image" width="400" />

환경변수를 실제 값으로 바꾸기 위해 아래 명령어를 실행했다.

```bash
for json_file in ~/scripts/*.json; do
  envsubst < "$json_file" > temp && mv temp "$json_file"
done
```

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8522bbad9f89a226480f2add665182bd.png" alt="image" width="400" />

태스크 정의가 등록되었다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/66fe60b38f16fbc3b8a2c86f4d508f8e.png)

#### 4. ECS 서비스 생성
Application Load Balancer와 연결된 3개의 ECS 서비스를 생성했다.

```bash
aws ecs create-service --service-name WebSiteService ...
```

서비스별로 Target Group과 연결했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6e7cfe70baa8211ed62b32a6a5a4b83f.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/26e3772097a5459624459ccccbf00c37.png)

#### 5.	애플리케이션 테스트
ALB DNS 주소로 접속해 Storizer 웹사이트를 열고, 입력창에 문장을 입력하여 API에서 단어를 자동으로 채워보았다. Save 클릭 시 DynamoDB에 저장됨을 확인했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e4572ab46b6620ef06d876c8d352f97e.png)

## 마치며
이번 Getting Started with Amazon ECS, Building and Deploying Containers Using Amazon Elastic Container Service Skill Builder를 통해 Amazon ECS 서비스에 대한 이해와, Docker 이미지 빌드 → Amazon ECR 푸시 → ECS 클러스터 서비스화라는 실제 운영 흐름을 경험할 수 있었다.
특히, 마이크로서비스 아키텍처 기반 앱을 분리된 컨테이너로 관리하면서 ECS의 자동화된 운영 방식이 얼마나 유용한지 체감할 수 있었다.