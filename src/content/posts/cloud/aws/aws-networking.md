---
title: "AWS - Networking"
slug: "aws-networking"
date: 2025-06-21
tags: ["AWS", "IP", "CIDR", "VPC", "Subnet", "IGW", "VGW", "NACL", "SecurityGroup"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a069e2871f8756716b84b6fa1ebd080d.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a069e2871f8756716b84b6fa1ebd080d.png)

클라우드에서 애플리케이션을 안전하고 효율적으로 운영하기 위해서는 네트워킹에 대한 이해가 필수적이다. AWS 네트워킹은 편지를 보내는 과정과 유사한데, 발신자와 수신자가 정확한 주소를 가져야 편지가 목적지에 도달하듯, 클라우드 환경에서도 올바른 네트워크 설정을 통해 안전하고 원활한 통신을 수행할 수 있다. 다음은 VPC(Virtual Private Cloud) 그리고 보안 설정에 대해 정리한 내용이다.

## 네트워킹 기본 개념

### IP 주소와 CIDR 표기법

#### IP 주소란?

IP 주소는 네트워크 내에서 각 컴퓨터를 식별하는 고유한 주소다. IP 주소는 데이터를 정확한 컴퓨터로 전송하는 역할을 한다.

- **IPv4 주소 형식**: 32비트 구성 (e.g. 192.168.0.1)
- 8비트씩 4개의 그룹으로 구성
- 각 그룹은 0~255 범위의 10진수

#### CIDR 표기법

CIDR(Classless Inter-Domain Routing)은 IP 주소 범위를 효율적으로 표현하기 위한 방법이다.

- 형식 예: 192.168.0.1/24
	- /24는 처음 24비트를 고정으로 호스트 ID를 식별하는 데 사용한다
	- 나머지 8비트로 256개 주소 사용 가능

|CIDR|사용 가능한 IP 수|용도|
|---|---|---|
|/16|65,536개|대규모 VPC|
|/24|256개|일반적인 서브넷|
|/28|16개|최소 단위 서브넷 (AWS 최소값)|

## Amazon VPC

### VPC란?

Amazon Virtual Private Cloud(VPC)는 AWS 상에서 생성되는 격리된 가상 네트워크로, 온프레미스 데이터 센터와 유사한 방식으로 작동하되 클라우드의 확장성과 유연성을 제공한다.

#### VPC 필수 구성 요소

- VPC 이름
- 리전(region)
- CIDR 블록 (e.g. 10.1.0.0/16)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f7608e9b5fd035bd00197af0b044906f.png" alt="image" width="600" />

#### VPC 특징

- 리전 단위로 생성 (모든 가용 영역 포함)
- 최대 5개 CIDR 블록 추가 가능 (/16 ~ /28 지원)

## 서브넷

### 서브넷이란?

서브넷은 VPC 내에서 네트워크를 논리적으로 분할한 영역으로, 고가용성과 다양한 연결 옵션을 제공한다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/79df98233abee10a9511b503ff09a8c6.png" alt="image" width="600" />

### 퍼블릭 vs 프라이빗 서브넷

- 퍼블릭 서브넷: 인터넷(외부) 접근 가능, 웹 서버 또는 로드 밸런서 배치
- 프라이빗 서브넷: 인터넷(외부) 직접 접근 불가, 데이터베이스 또는 내부 서버 배치

### 서브넷 생성 시 필요 정보

- VPC ID
- 가용 영역 (AZ)
- CIDR 블록 (VPC 내 범위에서 지정)

### 고가용성을 위한 설계

AWS의 고가용성(HA, High Availability) 아키텍처 구성(중복성과 내결함성을 유지)하기 위해 2개의 가용 영역에 구성된 서브넷을 2개 이상 생성한다.

> 1. 중복성(Redundancy): 장애 발생 시를 대비해 여러 복제본을 두는 것
> 2.내결함성(Fault Tolerance): 일부 시스템에 문제가 생겨도 전체 서비스가 계속 작동할 수 있는 능력

다시 말해, 하나의 리전 안에서 서로 다른 두 개의 데이터 센터(AZ)에 각각 서브넷을 만들어 장애가 발생해도 계속 서비스가 유지되도록 하는 것이다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ef669d0654a2077409a07599bcafa8af.png)

### AWS가 예약하는 IP 주소

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/398252bf3920d9f49e6b6c1cdb8bf7ba.png)
    

> 따라서 /24 서브넷은 실제로 251개 IP만 사용 가능하다.

## 게이트웨이

### 인터넷 게이트웨이 (IGW)

- 인터넷과의 통신을 가능하게 하는 VPC 컴포넌트
- 고가용성, 수평 확장 지원
- 하나의 VPC에 하나의 IGW만 연결 가능

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/814513d8ab201340a3f7ba5a2681b4a9.png" alt="image" width="600" />

- 가용 영역 A
	- 퍼블릭 서브넷:
		- 여기에 있는 인스턴스 (EC2 등)는 IGW를 통해 외부 인터넷과 통신할 수 있음
		- 라우팅 테이블에 0.0.0.0/0 → IGW로 연결되어 있음
- 가용 영역 B
	- 프라이빗 서브넷:
		- 외부 인터넷과 직접 통신할 수 없음
		- 인터넷 접속이 필요하다면 NAT Gateway를 추가로 구성해야 함

### 가상 프라이빗 게이트웨이 (VGW)

VGW(Virtual Private Gateway)는 AWS VPC 내부의 리소스와 온프레미스(자체 데이터센터) 네트워크를 안전하게 연결해주는 장치다.
외부 인터넷은 차단하면서도, 온프레미스와의 통신은 허용하고 싶을 때 사용한다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1edac339bb5b418808f3e4e800b028b3.png" alt="image" width="600" />

예를 들어 AWS에 있는 서버는 인터넷에서 접근 못 하게 하고, 우리 회사 내부 네트워크에서만 접속 가능하게 하고 싶을 때 사용할 수 있다.
이럴 때 VGW를 사용하면
- 인터넷을 통한 외부 접근을 막고
- 온프레미스 네트워크와는 암호화된 VPN 터널을 통해 안전하게 연결할 수 있다

이때 사용하는 연결 방식은 IPSec VPN으로,
암호화된 터널을 통해 데이터가 오가는 보안 연결이 이루어진다.

### AWS Direct Connect

온프레미스 데이터센터와 AWS를 전용 네트워크 회선으로 직접 연결하는 서비스다.
즉, 인터넷을 거치지 않고 더 안정적이고 빠르며 안전한 통신을 가능하게 한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/47bd5ed53414ba52bc078c03a6f7f55f.png)

- 온프레미스 ↔ AWS 간의 전용 물리적 연결
- 안정적이고 일관된 성능 제공
- 대용량 데이터 전송에 적합

고성능이 필요한 기업 환경에서 VPN보다 더 적합할 수 있다.
    
## 라우팅

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7ce95426d320f9e96b77b4dade39ffc1.png)

### 라우팅 테이블

- 트래픽 흐름을 제어하는 규칙 집합
- 각 서브넷은 하나의 라우팅 테이블과 연결됨

### 기본 라우팅 테이블

- 자동 생성됨    
- VPC 내 서브넷 간 로컬 통신 허용

### 사용자 지정 라우팅 테이블

- 퍼블릭 서브넷에 IGW 연결 시 필요
- e.g. 목적지: 0.0.0.0/0 → 대상: 인터넷 게이트웨이

> 가장 구체적인 라우팅 경로가 우선 적용된다.

## VPC 보안

### 네트워크 ACL (NACL)

NACL은 서브넷 수준의 방화벽이라고 볼 수 있다.

- 서브넷 단위 보안 제어    
- 스테이트리스(Stateless): 요청과 응답 별도 처리
- 규칙 번호가 낮을수록 우선 적용됨

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/38f2562b7ba2c44f370e5db538fc050d.png)

**위 그림에서 알 수 있는 것:**

1. VPC 내 두 개의 서브넷
	- 서브넷 1과 서브넷 2는 각각 EC2 인스턴스를 포함하고 있음
	- 서로 다른 서브넷에 위치한 리소스 간에 통신하려는 상황

2. 라우터(Route Table)
	- VPC 내부의 라우팅은 모두 VPC 라우터를 거쳐 처리됨
	- 서브넷 간, 서브넷과 IGW 간 통신 모두 이 라우팅 테이블을 통해 결정

3. 네트워크 ACL (NACL)
	- 서브넷 단위로 설정되는 보안 필터링 장치
	- 서브넷 1에는 NACL A, 서브넷 2에는 NACL B가 연결됨
	- 양방향 규칙(인바운드/아웃바운드)을 모두 설정해야 트래픽 허용됨

### 보안 그룹 (Security Group)

인스턴스 수준의 방화벽으로, 상태 기반(stateful) 보안 제어 기능을 제공한다.

- 인스턴스 단위 보안 제어    
- **Stateful(상태 추척)**: 요청을 허용하면, 응답은 자동 허용
- 기본 설정:
	- 인바운드: 차단
	- 아웃바운드: 허용

#### 웹 서버용 보안 그룹 예시

- 인바운드: 80, 443, 22 (내 IP만)
- 아웃바운드: 전체 허용 (0.0.0.0/0)

### 계층형 보안 설계 예시

|**계층**|**접근 방식**|**설명**|
|---|---|---|
|웹 티어|HTTPS (공개)|사용자 직접 접근|
|앱 티어|HTTP (내부)|웹 서버만 접근 가능|
|DB 티어|MySQL (내부)|앱 서버만 접근 가능|

### NACL vs 보안 그룹 비교

|**항목**|**네트워크 ACL**|**보안 그룹**|
|---|---|---|
|적용 범위|서브넷|EC2 인스턴스|
|상태 추적|Stateless (비상태성)|Stateful (상태기반)|
|기본 설정|모든 트래픽 허용|인바운드 차단|
|규칙 평가 방식|우선순위 번호로 판단|모든 규칙을 종합 평가|

## 실전 시나리오

- 요구 사항
    - 인터넷에서 접근 가능한 웹 서버
    - 외부 노출되지 않는 데이터베이스
    - 장애 시 대비해 **다중 AZ 배포**

- 설계 요약    
    - VPC: 10.0.0.0/16
    - 퍼블릭/프라이빗 서브넷을 각 AZ (1a, 1b)에 구성

### 시나리오 2: 하이브리드 클라우드 환경

- 요구 사항
    - 온프레미스와 AWS 연결
    - 민감 데이터는 외부 차단
    
- 해결 방안
    - **Direct Connect** 또는 **VPN**
    - **프라이빗 서브넷** + **VGW(Virtual Gateway)** 활용

## VPC 보안 및 네트워킹 모범 사례

#### VPC 설계

- 넉넉한 CIDR 블록 (/16) 사용 후, /24 단위로 서브넷 나누기
- 최소 2개 AZ 활용해 고가용성 확보
- 보안 그룹은 최소 권한 원칙 적용

#### 라우팅 설계

- 기본 라우팅 테이블 사용 지양
- 모든 라우팅은 문서화 및 버전 관리

#### 보안 설정

- NACL과 보안 그룹을 병행하여 계층적 보안 적용 
- 불필요한 규칙은 주기적으로 삭제


> 이 글은 AWS Skill Builder의 [AWS Technical Essentials](https://skillbuilder.aws/learn/K8C2FNZM6X/aws-technical-essentials-/T158S72U18) 강의를 토대로 공부한 내용을 정리한 것입니다.