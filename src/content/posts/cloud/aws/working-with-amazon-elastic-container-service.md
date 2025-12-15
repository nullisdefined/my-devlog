---
title: "Working with Amazon Elastic Container Service"
slug: "working-with-amazon-elastic-container-service"
date: 2025-07-15
tags: ["AWS", "ECS", "ALB"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2be604e9718a8ed5766637a2cf6f406d.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2be604e9718a8ed5766637a2cf6f406d.png)

이번 실습에서는 기존에 Amazon ECS를 통해 배포한 컨테이너 기반 애플리케이션을 업데이트하고, 이를 서비스화하는 과정을 포함한다. 구체적으로는 태스크 정의를 업데이트하고, 서비스 설정을 통해 로드 밸런서와 연동하며, 애플리케이션의 무중단 배포 및 태스크 복제본을 유지 및 관리를 실습했다.

## 1. 태스크 정의(Task Definition) 생성 및 등록
ECS에서 컨테이너를 실행하기 위해서는 반드시 태스크 정의(Task Definition)가 필요하다.
이 정의는 하나 이상의 컨테이너 설정(이미지, 포트, 환경 변수 등)을 포함하는 JSON 문서다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0ce63679c59592d7eb77a29a9673c7d8.png)
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/93d0159a33453279401d9fb42e259c74.png)

Amazon ECS 콘솔에서 직접 태스크를 정의했으며, 포트 매핑, 이미지 URI, 환경 변수 등 필요한 정보를 채운 후, 등록하면 해당 정의는 버전이 매겨진 상태로 저장된다.

## 2. ECS 서비스 생성 및 타입 지정
서비스는 ECS가 지정된 수의 태스크를 항상 실행 상태로 유지하도록 관리한다. 이때 서비스 타입에는 두 가지가 존재한다.
- Replica: 실행할 태스크의 개수를 명시적으로 지정
- Daemon: 클러스터의 각 인스턴스에 하나씩 태스크를 실행

이번 실습에서는 Replica 타입을 사용하여 처음에는 1개의 태스크가 실행되도록 설정하였다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7c15863d6ece69dd3ba4d05f8c6e9671.png)

## 3. 로드 밸런서 연결 설정
서비스 생성 시, ALB와 연결하여 외부에서 애플리케이션에 접근할 수 있도록 구성했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ceae1f1b93251777ed709ce4c6eb32e5.png)
ALB는 Listener Rule에 따라 URL 경로 기반으로 트래픽을 분배하고, 각 컨테이너 Task는 Target Group에 연결된다.
서비스를 생성하고 나면, ALB의 DNS 이름을 통해 브라우저에서 애플리케이션을 확인해볼 수 있었다.

## 4. 태스크 정의 업데이트 및 서비스 반영
컨테이너에 변경 사항이 발생하면, 태스크 정의의 새 버전을 생성하고 서비스 설정을 수정해야 ECS가 해당 변경을 반영한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d59bfa13cad7c1c7308e7f3a488f639b.png)

Cluster > Services > Update에서 태스크 정의 버전을 LATEST으로 변경하고 저장했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/40507674fbb151373e955a0fc50a22c2.png)
잠시 후 태스트 상태가 PENDING에서 RUNNING으로 전환되며, 실제 웹 페이지도 새 버전을 반영됨을 확인할 수 있었다. 

## 5. 태스크 복제본 설정 및 로드 밸런싱 테스트
ECS 서비스에서 Desired Tasks 수를 2로 변경(원래 1)하면 ECS는 두 개의 태스크 인스턴스를 병렬로 실행하게 된다. 이는 고가용성과 로드 밸런싱을 위한 전략이다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7a34d4c48dc0f29f46bc45576bd1bdb5.png)
로드 밸런서가 두 개의 태스크를 모두 인식하고, 트래픽을 분산 처리하게 된다.
예를 들어 새로고침할 때마다 다른 태스크에서 응답이 오는 형태로 확인할 수 있다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9f7198bd3d2616e81122613247cf740a.png)

## 실습 확인 문제
> **Q1. What is a task definition in Amazon ECS?**
> **A. A blueprint that describes how a Docker container should launch**

Task Definition은 컨테이너를 ECS에서 실행하기 위한 설정 템플릿이다.
컨테이너 이미지, 포트, 환경 변수, 볼륨 등 실행 조건을 정의한다.

> **Q2. After updating the task definition, what needs to be done to deploy the new version of the application in Amazon ECS?**
> **A. Update the ECS service to use the new task definition**

태스크 정의를 수정한 후, 이를 사용하려면 ECS 서비스 설정에서 새 태스크 정의 버전을 명시해야 ECS가 이를 반영해 새 태스크를 시작할 수 있다.

> **Q3. What is the primary purpose of an Amazon ECS task definition when deploying an application?**
> **A. To specify the container images to use**

Task Definition의 주요 목적은 어떤 컨테이너 이미지를 실행할지 정의하는 것이다.
추가적으로 포트, 환경 변수, 리소스 제한도 포함할 수 있습니다.

> **Q4. What does the ‘portMappings’ section in an Amazon ECS Task Definition specify?**
> **A. The mapping between container ports and host ports**

portMappings는 ECS에서 컨테이너 내부 포트와 호스트 포트 간의 연결 관계를 정의한다.
예를 들어, 컨테이너의 3000 포트를 호스트 80 포트로 노출하고 싶을 때 사용한다.

> **Q5. Which ECS feature allows you to run and maintain a specified number of instances of a task definition simultaneously in an ECS cluster?**
> **A. Service**

ECS의 Service는 지정한 수의 태스크를 동시에 실행하고 유지한다.
태스크가 중단되면 자동 복구되며, 로드 밸런서와도 연동 가능하다.

## 마치며
이번 실습을 통해 ECS의 기본 구조 → 서비스 구성 → 태스크 배포 및 유지 관리 → 로드 밸런싱까지 전체적인 흐름을 경험할 수 있었다. 특히 다음과 같은 포인트들을 실습으로 체득했다.

- **ECR을 통한 이미지 버전 관리**
- **태스크 정의 버전 관리와 서비스 재배포**
- **복제본 태스크와 ALB를 통한 트래픽 분산**