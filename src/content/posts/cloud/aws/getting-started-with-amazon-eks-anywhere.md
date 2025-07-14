---
title: "Getting Started with Amazon EKS Anywhere"
slug: "getting-started-with-amazon-eks-anywhere"
date: 2025-07-12
tags: ["AWS", "Kubernetes", "EKS", "ControlPlane", "Nodes", "Pod"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2be604e9718a8ed5766637a2cf6f406d.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2be604e9718a8ed5766637a2cf6f406d.png)

## Kubernetes란 무엇인가?

Kubernetes(K8s)는 컨테이너화된 애플리케이션을 자동으로 배포, 스케일링, 운영해주는 오픈소스 플랫폼이다.
수많은 컨테이너를 하나의 클러스터로 관리할 수 있게 도와주는 컨테이너 오케스트레이션 도구이다.

쉽게 말해, 여러 대의 서버 위에서 수많은 컨테이너를 잘 배포하고, 필요에 따라 자동으로 스케일링하며, 문제가 생기면 자동으로 복구해주는 통합 관리 시스템이라고 할 수 있다.


### K8s 구성과 동작 방식

k8s는 구성 파일을 기반으로 동작한다. 이 파일에서는 다음과 같은 정보를 선언한다.

- 어떤 이미지를 배포할지
- 몇 개의 인스턴스를 띄울지
- 트래픽이 몰리면 얼마나 확장할건지
- 컨테이너가 죽었을 때 어떻게 교체할건지

이렇게 구성 파일을 작성하면, k8s가 이를 자동으로 처리해준다. 운영자가 직접 관리하지 않아도 선언한 대로 컨테이너를 배포하고, 상태를 감시하며, 필요시 복구까지 수행한다.

k8s는 클라우드 서비스가 아니다. 오픈소스 소프트웨어다. AWS, GCP, Azure같은 클라우드 위에서 사용할 수도 있고 내 PC나 사내 서버 위에서도 설치해 사용할 수 있다. 클라우드 제공업체들이 k8s를 쉽게 쓰게 해주는 서비스인 EKS를 제공하기도 하지만 k8s 자체는 특정 클라우드에 종속되지 않는다.

여러 개의 Docker 컨테이너를 로컬 머신이나 단일 서버에서 실행가능하게 해주는 Docker Compose를 생각해 본다면, k8s는 그 개념을 여러 서버에 걸친 대규모 환경으로 확장한 것으로 볼 수 있다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8173b11b28a29153d6e86da737ab3cc8.png)

k8s에서 클러스터라는 개념이 등장하는데, 사실 이 용어는 k8s에서 처음 나온 것은 아니다.

> **클러스터란?**
> "서로 연결된 여러 대의 컴퓨터(서버)가 하나의 시스템처럼 동작하는 구조"

즉, 클러스터는 단일 서버처럼 보이지만, 실제로는 여러 서버가 함께 동작하는 구성이다.

k8s 클러스터는 크게 두 부분으로 구성된다.

#### 1. Control Plane (제어 영역)
클러스터 전체를 관리하고 제어하는 중심 시스템이다.
일반적으로 마스터 노드(Master Node)에 설치된다.
선언된 구성대로 어떤 앱을, 몇개나, 어떤 서버에 실행할지를 결정하고 지시한다.
주요 역할은 다음과 같다.
- 클러스터 상태 감시
- 앱 배포 및 스케일링 결정
- 장애 발생 시 자동 복구 지시

#### 2. Worker Node (작업 노드)
실제 애플리케이션(Pod)이 실행되는 서버다. 실행 중인 EC2 인스턴스라고 생각할 수 있다.
클러스터에는 여러 개의 Worker Node가 있을 수 있으며, 각 노드는 하나 이상의 Pod를 실행한다.
구성 요소로 다음이 있다.

- **kubelet**: 워커 노드와 마스터 노드 간 통신을 가능하게 해주는 소프트웨어 
- **Docker(Optional)**: 컨테이너를 생성하고 실행하는 Pod에 필요하다
- **kube-proxy**: 네트워크 연결 및 라우팅 담당
- **Pod**: 컨테이너 실행 단위
	- Volumes
	- Containers..

#### Pod
Pod는 k8s에서만 사용되는 개념이다.
하나 이상의 컨테이너를 담을 수 있는 실행 단위이다.
실제로는 컨테이너 1개만 포함하는 경우가 많다.

같은 Pod 내의 컨테이너들은 동일한 IP 주소, 동일한 네트워크 환경, 동일한 볼륨을 공유한다.

## 왜 k8s를 사용하는가?

### 1. 컨테이너 관리 복잡성 해결

기존의 방식에는 문제가 있었다.
- 수십, 수백 개의 컨테이너를 수동으로 관리하는 것은 거의 불가능하다
- 컨테이너 간 네트워킹, 볼륨 공유, 로드밸런싱 등을 개별적으로 설정해야 한다
- 장애 발생 시 수동으로 복구해야 한다

k8s로 예를들어 다음과 같이 해결할 수 있다.

```yaml
# 단순한 YAML 파일로 복잡한 애플리케이션 관리
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3  # 자동으로 3개의 복제본 유지
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
```

### 2. 스케일링 자동화

#### 수평 스케일링 (Horizontal Pod Autoscaler)

```bash
# CPU 사용률이 50%를 초과하면 자동으로 Pod 수를 늘림
kubectl autoscale deployment nginx-deployment --cpu-percent=50 --min=1 --max=10
```

#### 수직 스케일링 (Vertical Pod Autoscaler)

애플리케이션 리소스 사용량을 분석해서 CPU/메모리 할당량을 자동으로 조정한다.

e.g. 평소 웹 서버 3대를 운영하고 있다가, 트래픽 급증 시 자동으로 10대까지 확장하며 트래픽 감소 시 다시 3대로 축소하는 시나리오를 예로 들 수 있다.

### 3. 고가용성 및 장애 복구

#### 자가 치유(Self-Healing) 기능

```yaml
# Liveness Probe - 컨테이너 상태 지속 모니터링
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
```

e.g.
1. 웹 서버 Pod가 크래시 발생
2. k8s가 자동으로 감지
3. 새로운 Pod를 다른 노드에 즉시 생성
4. 로드밸런서가 트래픽을 정상 Pod로 자동 전환
5. 전체 과정이 수초 내에 완료

장애 복구의 시간 단축은 비용 절감으로 이어진다.

### 4. 무중단 배포 (Rolling Update)

기존 방식은 다음과 같은 문제가 있었다.
- 새 버전 배포 시 서비스 중단이 불가피하다
- 문제 발생 시 수동으로 Rollback 해주어야 한다

k8s는 다음과 같이 해결책을 제시한다.

```yaml
# 점진적 업데이트 전략
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1        # 최대 1개 추가 Pod 생성
    maxUnavailable: 0  # 중단 없이 업데이트
```

1. 새 버전 Pod 1개 생성
2. 정상 동작 확인 후 기존 Pod 1개 제거
3. 이 과정을 모든 Pod에 대해 반복
4. 문제 발생 시 한 번의 클릭으로 Rollback 가능

서비스의 무중단 또한 비용 절감으로 이어진다.

### 5. 리소스 효율성

#### 멀티테넌시의 지원

> 멀티테넌시(Multi-tenancy)는 하나의 소프트웨어 인스턴스(e.g. 웹 애플리케이션, 데이터베이스 등)를 여러 사용자 그룹(= 테넌트, tenants)이 공유하면서도, 각 테넌트는 자신의 데이터와 설정을 독립적으로 사용할 수 있도록 하는 아키텍처를 의미한다.

```yaml
# 네임스페이스로 환경 분리
apiVersion: v1
kind: Namespace
metadata:
  name: production
---
apiVersion: v1
kind: Namespace
metadata:
  name: staging
```

- 하나의 클러스에서 development/staging/production 환경을 분리시킬 수 있다
- CPU, 메모리 사용량을 실시간 모니터링할 수 있다
- 유휴 리소스(Idle Resources)는 자동으로 재분배한다

### 6. 서비스 디스커버리 및 로드밸런싱

기존 방식에는 다음과 같은 문제가 있다.

- 서비스 간 통신을 위해 IP 주소 하드코딩
- 로드밸런서 설정이 복잡하다

k8s로 예를 들어 이렇게 해결할 수 있다.

```yaml
# 서비스 자동 디스커버리
apiVersion: v1
kind: Service
metadata:
  name: database-service
spec:
  selector:
    app: database
  ports:
  - port: 3306
    targetPort: 3306
```

애플리케이션 코드에서는 단순히 `database-service:3306`으로 접근하면 k8s가 자동으로 적절한 Pod로 연결해준다.

### 7. 보안 및 정책 관리

#### 네트워크 정책

```yaml
# 특정 Pod 간 통신만 허용
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

#### RBAC (Role-Based Access Control)

- 사용자별, 팀별 접근 권한을 세밀하게 관리할 수 있다
- 개발자는 개발 네임스페이스만 접근 가능하다

### 8. CI/CD 파이프라인

#### GitOps 워크플로우

1. 개발자가 코드 변경 후 Git에 푸시하면
2. CI 파이프라인이 자동으로 이미지를 빌드하고
3. CD 파이프라인이 k8s에 자동 배포하며
4. 배포 상태를 Git에서 추적 가능하게 한다

## Amazon EKS Anywhere

Amazon EKS Anywhere는 AWS가 제공하는 온프레미스 Kubernetes 클러스터 설치 및 운영 도구다. 기존의 EKS가 AWS 클라우드 전용이었다면, EKS Anywhere은 기업이 자체 서버(온프레미스)에서도 AWS 방식으로 클러스터를 구성하고 운영할 수 있도록 도와준다.

### 주요 특징

- 설치부터 운영까지 전 과정을 지원 (eksctl-anywhere)
- GitOps 기반 클러스터 구성 관리
	- GitOps는 Git을 중심으로 애플리케이션 및 인프라의 배포와 운영을 자동화하는 방식을 뜻한다.
- 에어갭(외부 네트워크와 분리된, 인터넷이 없는) 환경을 지원
- AWS 기술지원 유료 옵션 제공

### EKS Anywhere 구조 이해

- 클러스터는 사용자 서버에 설치되며, AWS는 직접 접근 권한 없음
- 구성은 단일 YAML 파일로 정의 가능
- AWS 콘솔과 연결하여 상태 확인 가능
- 보안과 신뢰성을 위해 공동 책임 모델(shared responsibility model) 기반 운영

### EKS Anywhere 설치 예시

다음은 Docker 기반 개발 환경에서 클러스터를 설치하는 예시다.

```bash
# Mac에서 eksctl 설치
brew tap weaveworks/tap
brew install weaveworks/tap/eksctl

# 설치 확인
eksctl version

# eksctl-anywhere 플러그인 설치
brew install aws/tap/eks-anywhere

# 설치 확인
eksctl anywhere version
```

```bash
# 클러스터 이름 설정
CLUSTER_NAME=dev-cluster

# 클러스터 구성 템플릿 파일 생성
eksctl anywhere generate clusterconfig $CLUSTER_NAME --provider docker > $CLUSTER_NAME.yaml

# 클러스터 생성
eksctl anywhere create cluster -f $CLUSTER_NAME.yaml
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d7c34ccf835dc6266b84c52f010bb6b0.png)

클러스터가 생성되는데 약 30분 정도 소요됐다.

```bash
# kubeconfig 설정
export KUBECONFIG=${PWD}/${CLUSTER_NAME}/${CLUSTER_NAME}-eks-a-cluster.kubeconfig

# 클러스터 네임스페이스 확인
kubectl get ns
```

> kubectl get ns 명령을 실행하면 default, kube-system, kube-public 같은 기본 네임스페이스가 출력되며, 클러스터가 정상적으로 설치되었음을 알 수 있다.


### 샘플 애플리케이션 배포

EKS Anywhere 클러스터가 준비되었으면, k8s 방식으로 애플리케이션을 배포할 수 있다.

```bash
# 샘플 앱 배포
kubectl apply -f "https://anywhere.eks.amazonaws.com/manifests/hello-eks-a.yaml"

# 배포된 pod, 서비스 확인
kubectl get pods
kubectl get svc

# 서비스에 포트포워딩하여 로컬에서 접속 테스트
kubectl port-forward svc/hello-eks-a 8080:80
```

> 위 명령을 실행한 후 [http://localhost:8080](http://localhost:8080)으로 접속하면 샘플 앱을 확인할 수 있다.