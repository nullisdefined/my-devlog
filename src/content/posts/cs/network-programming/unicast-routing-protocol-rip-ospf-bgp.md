---
title: "Unicast Routing Protocol (RIP, OSPF and BGP)"
slug: "unicast-routing-protocol-rip-ospf-bgp"
date: 2025-05-15
tags: ["NetworkProgramming", "NetworkLayer", "IP", "RIP", "OSPF"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/dcbc02881819b2bf9e01d0ba58b466a7.png"
draft: false
views: 0
---
## 라우팅 프로토콜

### 라우팅 기본 개념

- **라우팅**: 라우팅 테이블을 구축하고 유지하는 과정
- **포워딩**: 라우팅 테이블을 조회하여 패킷을 다음 홉으로 전달
- **Metric/Cost**: 경로 선택 기준이 되는 값
- **Convergence**: 네트워크 변화 후 모든 라우터가 일관된 라우팅 정보를 갖는 상태

### 라우팅 테이블 관리 방식

#### Static Routing (정적 라우팅)

- **수동 설정**: 관리자가 직접 경로 입력
- **고정 경로**: 네트워크 변화 시 수동 수정 필요
- **소규모 네트워크**: 단순하고 예측 가능

#### Dynamic Routing (동적 라우팅)

- **자동 갱신**: 라우팅 프로토콜을 통한 정보 교환
- **적응적**: 네트워크 변화에 자동 대응
- **확장성**: 대규모 네트워크에 적합

## AS (Autonomous System)

### AS란?

**동일한 관리 정책 하에 있는 라우터와 네트워크의 집합**

### AS의 특징

- 단일 관리 기관 운영
- 통일된 라우팅 정책
- 고유한 AS 번호 (ASN) 할당
- 독립적인 라우팅 결정

### AS 번호 체계

- **2바이트 ASN**: 1 ~ 65,535 (기존)
- **4바이트 ASN**: 1 ~ 4,294,967,295 (확장)
- **사설 ASN**: 64,512 ~ 65,534 (2바이트), 4,200,000,000 ~ 4,294,967,294 (4바이트)

## 라우팅 프로토콜 분류

### 도메인 기준 분류

#### Intradomain Routing (IGP - Interior Gateway Protocol)

**AS 내부에서 사용하는 라우팅 프로토콜**

- **RIP** (Routing Information Protocol)
- **OSPF** (Open Shortest Path First)
- **EIGRP** (Enhanced Interior Gateway Routing Protocol) - Cisco 독점

#### Interdomain Routing (EGP - Exterior Gateway Protocol)

**AS 간에 사용하는 라우팅 프로토콜**

- **BGP** (Border Gateway Protocol)

### 알고리즘 기준 분류

#### Distance Vector

- **동작 원리**: 인접 라우터와 거리 정보 교환
- **대표 프로토콜**: RIP, EIGRP
- **특징**: 구현 단순, 느린 수렴

#### Link State

- **동작 원리**: 전체 네트워크 토폴로지 기반 경로 계산
- **대표 프로토콜**: OSPF, IS-IS
- **특징**: 빠른 수렴, 메모리 사용량 많음

#### Path Vector

- **동작 원리**: 경로 정보와 정책 기반 라우팅
- **대표 프로토콜**: BGP
- **특징**: 정책 제어 가능, 루프 방지

## RIP (Routing Information Protocol)

### RIP 개요

- Distance Vector 알고리즘 기반
- Bellman-Ford 알고리즘 사용
- 홉 수(Hop Count)를 metric으로 사용
- 소규모 네트워크에 적합

### RIP 특징

#### 버전별 차이

|특징|RIP v1|RIP v2|
|---|---|---|
|클래스 지원|Classful|Classless (VLSM)|
|서브넷 마스크|전송 안함|전송함|
|인증|미지원|지원|
|멀티캐스트|미지원|224.0.0.9 사용|
|브로드캐스트|255.255.255.255|선택적|

#### 기본 사양

- **최대 홉 수**: 15홉 (16 = 무한대)
- **갱신 주기**: 30초마다 전체 라우팅 테이블 전송
- **홀드다운 타이머**: 180초 (갱신 없으면 삭제)
- **플러시 타이머**: 240초 (완전 삭제)

### RIP 동작 과정

#### 1. 초기화

```
각 라우터는 직접 연결된 네트워크만 인식:

라우터 A 초기 테이블:
Network     Hop Count   Next Hop    Interface
192.168.1.0    0         -         eth0
10.0.0.0       0         -         eth1
```

#### 2. 정보 교환

```
30초마다 인접 라우터에게 전체 테이블 전송:

A → B로 전송하는 정보:
192.168.1.0/24, Hop=1
10.0.0.0/8, Hop=1
```

#### 3. 테이블 갱신

```
B가 A로부터 받은 정보로 테이블 갱신:

기존: 192.168.2.0/24, Hop=0 (직접 연결)
새로 추가: 192.168.1.0/24, Hop=2, Next Hop=A
새로 추가: 10.0.0.0/8, Hop=2, Next Hop=A
```

### RIP 문제점

#### 1. Count to Infinity

```
네트워크 단절 시 홉 수가 무한히 증가하는 문제:

초기: A-B 연결, A는 B를 통해 C 도달 (Hop=2)
단절: B-C 연결 끊어짐
문제: A와 B가 서로 잘못된 정보 교환하여 홉 수 계속 증가
```

#### 해결 방법

- **Split Horizon**: 정보를 받은 인터페이스로 동일 정보 재전송 금지
- **Poison Reverse**: 도달 불가능한 네트워크는 홉 수 16으로 광고
- **Hold Down Timer**: 일정 시간 동안 경로 변경 금지

#### 2. 느린 수렴 (Slow Convergence)

- 30초 갱신 주기로 인한 느린 반응
- 대규모 네트워크에서 수렴 시간 길어짐

### RIP 설정 예시

#### Cisco 라우터 설정

```cisco
router rip
 version 2
 network 192.168.1.0
 network 10.0.0.0
 no auto-summary
 passive-interface FastEthernet0/0  # 특정 인터페이스에서 RIP 비활성화
```

#### Linux (Quagga/FRR) 설정

```bash
# /etc/frr/ripd.conf
router rip
 version 2
 network 192.168.1.0/24
 network 10.0.0.0/8
 redistribute connected
```

## OSPF (Open Shortest Path First)

![OSPF 구조](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/dcbc02881819b2bf9e01d0ba58b466a7.png)

### OSPF 개요

- **Link State 알고리즘** 기반
- **다익스트라 알고리즘** 사용
- **계층적 구조**: Area 개념 도입
- **빠른 수렴**: 변화 즉시 LSA 전파

### OSPF 계층 구조

#### Area 개념

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/40b4bca7bd445894e5add562f9383060.png" alt="image" width="600" />

#### Area 유형

- **Area 0 (Backbone)**: 모든 Area를 연결하는 중추 영역
- **Standard Area**: 일반적인 영역
- **Stub Area**: 외부 라우트 정보 제한
- **Totally Stubby Area**: 외부와 요약 라우트 정보 모두 제한
- **NSSA**: 제한적 외부 라우트 허용

### OSPF 라우터 유형

![OSPF 라우터 유형](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/74ca40f9af9490d3dba56452391cb0c8.png)

#### Internal Router

- **단일 Area**에만 속한 라우터
- 해당 Area의 완전한 토폴로지 정보 보유

#### Backbone Router

- **Area 0**에 속한 라우터
- Area 간 트래픽 전달 담당

#### ABR (Area Border Router)

- **두 개 이상의 Area**에 연결된 라우터
- **Summary LSA** 생성하여 Area 간 정보 요약 전달
- 각 Area별로 별도의 LSDB 유지

#### ASBR (Autonomous System Boundary Router)

- **외부 AS**와 연결된 라우터
- **External LSA** 생성하여 외부 경로 정보 내부 전파
- 다른 라우팅 프로토콜과의 재분배 담당

### OSPF 패킷 종류

#### 패킷 유형과 기능

|Type|패킷 이름|기능|
|---|---|---|
|**1**|Hello|인접 라우터 발견 및 관계 유지|
|**2**|DBD (Database Description)|LSDB 요약 정보 교환|
|**3**|LSR (Link State Request)|필요한 LSA 요청|
|**4**|LSU (Link State Update)|LSA 정보 전송|
|**5**|LSAck (Acknowledgment)|LSU 수신 확인|

#### Hello 패킷

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6937fb9e04344436344c5ff7300da3c4.png" alt="image" width="600" />

```
Hello 패킷 주요 필드:
- Router ID: 라우터 고유 식별자
- Area ID: 소속 Area
- Hello Interval: Hello 주기 (기본 10초)
- Dead Interval: 인접 관계 만료 시간 (기본 40초)
- Designated Router: DR IP 주소
- Backup Designated Router: BDR IP 주소
- Neighbor List: 인접 라우터 목록
```

### OSPF 네트워크 유형

#### Point-to-Point

- **두 라우터 간 직접 연결**
- DR/BDR 선출 없음
- 빠른 인접 관계 형성

#### Broadcast (Ethernet)

- **여러 라우터가 연결된 네트워크**
- **DR/BDR 선출** 필요
- 모든 라우터는 DR/BDR과만 Full 인접 관계

#### Non-Broadcast Multi-Access (NBMA)

- **Frame Relay, ATM** 등
- DR/BDR 선출하지만 브로드캐스트 미지원
- **수동 neighbor 설정** 필요

#### Point-to-Multipoint

- **하나의 허브가 여러 spoke 연결**
- DR/BDR 선출 없음
- 각 원격 라우터와 Point-to-Point 연결로 취급

### LSA (Link State Advertisement) 유형

#### Type 1: Router LSA

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3102cc2cdfcee9ec473bc8b96f9bf033.png" alt="image" width="600" />

```
생성자: 모든 라우터
범위: 해당 Area 내부만
내용: 
- 라우터의 모든 링크 정보
- 연결된 네트워크 타입
- 인터페이스 비용
```

#### Type 2: Network LSA

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f60cad8a349c1dcef5fbb0d8fd3f3d14.png" alt="image" width="600" />

```
생성자: DR (Designated Router)
범위: 해당 Area 내부만  
내용:
- 브로드캐스트 네트워크에 연결된 라우터 목록
- 공통 네트워크 주소
```

#### Type 3: Summary LSA (Network)

```
생성자: ABR
범위: 다른 Area로 전파
내용:
- 다른 Area에 있는 네트워크 정보
- 집약된 경로 정보
```

#### Type 4: Summary LSA (ASBR)

```
생성자: ABR
범위: 다른 Area로 전파
내용:
- ASBR까지의 경로 정보
- 외부 라우팅을 위한 준비
```

#### Type 5: External LSA

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/92b60f5a17a6c3829f109f4565c62590.png" alt="image" width="600" />

```
생성자: ASBR
범위: 전체 OSPF 도메인 (Stub Area 제외)
내용:
- AS 외부 네트워크 정보
- 외부 라우팅 프로토콜에서 학습한 경로
```