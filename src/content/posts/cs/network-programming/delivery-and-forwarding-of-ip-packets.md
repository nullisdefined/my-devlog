---
title: "Delivery and Forwarding of IP Packets"
slug: "delivery-and-forwarding-of-ip-packets"
date: 2025-05-16
tags: ["NetworkProgramming", "NetworkLayer", "IP", "Forwarding", "Routing"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3eaad1217a0fa061d01c5c2b53d7ea98.png"
draft: false
views: 0
---
## 패킷 전달(Delivery) 개념

### 전달의 정의

**송신지에서 수신지까지 패킷을 전달하는 전체 과정**을 의미한다.
이는 end-to-end 또는 hop-by-hop 방식으로 이루어진다.

### 전달 방식 분류

#### 직접 전달(Direct Delivery)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3eaad1217a0fa061d01c5c2b53d7ea98.png" alt="image" width="600" />

- 목적지 호스트가 같은 물리 네트워크(LAN)에 있는 경우
- 라우터를 거치지 않고 직접 전송
- 마지막 홉에서 목적지 호스트로의 전달

**예시 상황:**

- 같은 서브넷 내 호스트 간 통신
- 라우터에서 직접 연결된 네트워크의 호스트로 전달

#### 간접 전달(Indirect Delivery)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6f86cc163c447e3e92b220e22ec0cc23.png" alt="image" width="600" />

- 목적지 호스트가 **다른 네트워크**에 있는 경우
- **하나 이상의 라우터**를 경유하여 전달
- 인터넷 상의 대부분의 통신이 해당

**예시 상황:**

- 서로 다른 ISP 네트워크 간 통신
- 회사 내부에서 인터넷 사이트 접속

## 포워딩(Forwarding) 개념

### 포워딩의 정의

**패킷을 다음 홉 라우터 또는 목적지로 보내는 동작**을 의미합니다. 라우터의 핵심 기능 중 하나입니다.

### 포워딩 과정

1. **목적지 주소(DA) 확인**: 패킷 헤더에서 목적지 IP 추출
2. **라우팅 테이블 검색**: 목적지에 대한 최적 경로 찾기
3. **다음 홉 결정**: Next hop IP 주소 또는 출력 인터페이스 선택
4. **ARP 수행**: 다음 홉의 MAC 주소 획득
5. **패킷 전송**: 프레임으로 캡슐화하여 전송

## 라우팅 테이블 구조

### 기본 테이블 구성

|Destination|Subnet Mask|Next Hop|Interface|
|---|---|---|---|
|192.168.1.0|255.255.255.0|10.0.0.2|eth0|
|10.0.0.0|255.0.0.0|0.0.0.0|eth1|
|0.0.0.0|0.0.0.0|192.168.1.1|eth0|

### 필드 설명

- **Destination**: 목적지 네트워크 주소
- **Subnet Mask**: 네트워크/호스트 구분용 마스크
- **Next Hop**: 다음에 전달할 라우터 IP (0.0.0.0이면 직접 전달)
- **Interface**: 출력할 물리적 인터페이스

---

## 포워딩 방식

### 1. Next-hop Method (다음 홉 방법)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5fe5ea3977e61daea7feb4ee6d14311b.png" alt="image" width="600" />

**가장 일반적이고 효율적인 방식**

#### 특징

- 라우팅 테이블에 **다음 홉 정보만** 저장
- 메모리 사용량 최소화
- 빠른 검색 속도

#### 장점

- **메모리 효율성**: 전체 경로가 아닌 다음 홉만 저장
- **단순성**: 구현과 관리가 간단
- **확장성**: 네트워크 크기에 관계없이 효율적

### 2. Network-specific Method (네트워크 지정 방법)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f5e96f6834ea0d78e593e04e87d8e328.png" alt="image" width="600" />

**실제 라우팅 테이블에서 주로 사용**

#### 특징

- 같은 네트워크의 모든 호스트를 **하나의 엔트리**로 관리
- 네트워크 단위의 경로 정보 저장

#### 예시

```
목적지: 192.168.1.0/24 → 이 네트워크의 모든 호스트 포함
목적지: 10.0.0.0/8 → Class A 전체 네트워크 포함
```

### 3. Host-specific Method (호스트 지정 방법)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/728c19efb2265193ebfb2629b032483d.png" alt="image" width="600" />

**특별한 용도로 제한적 사용**

#### 특징

- **특정 호스트**를 위한 특별한 경로 지정
- 정책 기반 라우팅에서 사용

#### 사용 예시

- 특정 서버로의 우선 경로 설정
- 보안상 특별한 경로가 필요한 호스트
- 네트워크 테스트 및 디버깅용

### 4. Default Method (디폴트 방법)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/01a581300ea49a89c558747a13314dbf.png" alt="image" width="600" />

**인터넷 연결 시 필수**

#### 특징

- 일치하는 경로가 **없을 때 사용**하는 기본 경로
- `0.0.0.0/0`으로 표현
- 게이트웨이 라우터로 연결

#### 중요성

- 인터넷의 모든 주소를 라우팅 테이블에 저장할 수 없음
- 기본 경로를 통해 ISP로 전달하여 해결

### 5. Route Method (전체 경로 방법)

**현재는 사용하지 않음**

#### 문제점

- 메모리 사용량 과다
- 네트워크 변화 시 전체 경로 재계산 필요
- 확장성 부족

## Classful Addressing Forwarding

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d3d385cb667495279d066cea37e3cd2b.png" alt="image" width="600" />

### 동작 과정

1. **패킷 수신**: 목적지 주소 추출
2. **클래스 식별**: 주소의 앞 비트로 클래스 판별
3. **네트워크 주소 추출**: 클래스에 따라 네트워크 부분 분리
4. **라우팅 테이블 검색**: 해당 네트워크 주소로 검색
5. **포워딩 결정**: 매치되는 엔트리의 다음 홉으로 전송

### 클래스별 라우팅 테이블 예시

#### Class A 라우팅 테이블

|Network Address|Next-hop Address|Interface|
|---|---|---|
|111.0.0.0|0.0.0.0|m0|

#### Class B 라우팅 테이블

|Network Address|Next-hop Address|Interface|
|---|---|---|
|145.80.0.0|0.0.0.0|m1|
|170.14.0.0|0.0.0.0|m2|

#### Class C 라우팅 테이블

|Network Address|Next-hop Address|Interface|
|---|---|---|
|192.16.7.0|111.15.17.32|m0|

#### Default 라우팅 테이블

|Network Address|Next-hop Address|Interface|
|---|---|---|
|0.0.0.0|111.30.31.18|m0|

## Classless Addressing Forwarding

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/48bd219d8c0b6b77ef58e3fa7ae30c91.png" alt="image" width="600" />

### 특징

1. **마스크 정보 필수**: 테이블에 프리픽스 길이(`/n`) 정보 포함
2. **주소 집약화**: 여러 네트워크를 하나로 표현하여 테이블 간소화
3. **Longest Prefix Match**: 가장 구체적인 경로 우선 선택

### Longest Prefix Match 원리

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/50716411ff30be1b80f820f79d815bbe.png" alt="image" width="600" />

**가장 긴 마스크(가장 구체적인 경로)를 우선적으로 선택**하는 방식

#### 예시

```
목적지 주소: 201.4.22.35

라우팅 테이블:
201.4.22.0/26  → 201.4.22.0과 매치 안됨
201.4.22.0/25  → 201.4.22.0과 매치 안됨  
201.4.22.0/24  → 201.4.22.0과 매치됨! (선택)
```

### 올바른 테이블 정렬의 중요성

라우팅 테이블은 **마스크 길이 순으로 정렬**되어야 합니다.

#### 잘못된 정렬의 문제

```
잘못된 순서:
201.4.22.0/24  (넓은 범위가 먼저)
201.4.22.0/26  (좁은 범위가 나중)

결과: /24가 먼저 매치되어 잘못된 경로 선택
```

#### 올바른 정렬

```
올바른 순서:
201.4.22.0/26  (가장 구체적)
201.4.22.0/25
201.4.22.0/24  (가장 일반적)
0.0.0.0/0      (기본 경로)
```

## 계층적 라우팅(Hierarchical Routing)

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ec6c5bb9570d98a44d5efb2b666d463a.png" alt="image" width="600" />

### 계층적 라우팅의 필요성

인터넷이 커지면서 **모든 라우터의 정보를 하나의 테이블에 저장하기 어려워짐**

### 계층 구조

```
Backbone ISP (최상위)
    ↓
Regional ISP (지역별)
    ↓  
Local ISP (지역 내)
    ↓
조직/사용자
```

### 주소 할당 예시

```
Regional ISP가 할당받은 블록: 120.14.64.0/18

하위 분배:
Local ISP A: 120.14.64.0/20  (120.14.64.0 ~ 120.14.79.255)
Local ISP B: 120.14.80.0/20  (120.14.80.0 ~ 120.14.95.255)
Local ISP C: 120.14.96.0/20  (120.14.96.0 ~ 120.14.111.255)

각 Local ISP 내 조직 분배:
조직 1: 120.14.64.0/23
조직 2: 120.14.66.0/23
조직 3: 120.14.68.0/23
```

### 계층적 라우팅의 장점

1. **라우팅 테이블 크기 감소**: 각 계층에서 자신의 범위만 관리
2. **검색 속도 향상**: 테이블이 작아져 빠른 검색 가능
3. **관리 효율성 증대**: 계층별 독립적 관리
4. **확장성**: 새로운 네트워크 추가 시 영향 최소화

## 지리적 라우팅(Geographical Routing)

### 개념

**지리적 위치를 고려한 주소 할당**으로 라우팅 효율성 더욱 향상

### 주소 할당 예시

```
대륙별 할당:
북미: a.b.c.d/8
유럽: e.f.g.h/8  
아시아: i.j.k.l/8

국가별 세분화:
미국: a.b.c.d/10
캐나다: a.b.c.d/12
```

### 장점

- **라우팅 테이블 더욱 간소화**
- **지역별 트래픽 최적화**
- **네트워크 관리 효율성 향상**

## MPLS (Multiprotocol Label Switching)

### MPLS 개념

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/88f752aca45b1c31f5084a5d595b501b.png" alt="image" width="600" />

- **레이블 기반 포워딩** 방식
- IP 주소 대신 **짧은 레이블**로 빠른 포워딩
- **2.5계층 기술**로 불림 (L2와 L3 사이)

### MPLS 동작 방식

1. **레이블 할당**: 패킷에 레이블 부착
2. **레이블 스위칭**: 중간 라우터는 레이블만으로 포워딩
3. **레이블 제거**: 목적지 근처에서 레이블 제거

### MPLS 헤더 구조

|필드|크기|설명|
|---|---|---|
|Label|20비트|포워딩용 레이블 값|
|TC|3비트|QoS 및 혼잡 제어|
|S|1비트|스택 끝 표시 (1=마지막)|
|TTL|8비트|홉 제한|

### MPLS 장점

- **고속 포워딩**: IP 주소 검색 없이 레이블로 즉시 포워딩
- **QoS 지원**: 트래픽 클래스별 차등 서비스
- **VPN 지원**: 레이블로 가상 사설망 구현

## 라우터 구조와 포워딩

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/aabece87a7dfe80d6f367f98e5a9516c.png" alt="image" width="600" />

### 라우터 주요 구성요소

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/109eb191b2f217887fd5c2a89da5b0da.png" alt="image" width="600" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/23d54eb4f7ac9a3eb1bf43f67585556b.png" alt="image" width="600" />

1. **입력 포트**: 패킷 수신 및 역캡슐화
2. **출력 포트**: 패킷 캡슐화 및 전송
3. **라우팅 프로세서**: 라우팅 테이블 관리 및 경로 계산
4. **스위칭 패브릭**: 입력 포트에서 출력 포트로 패킷 전달

### 스위칭 패브릭 종류

#### 1. Crossbar Switch

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5952aee767556fd2d1b1f7a68054120f.png" alt="image" width="600" />

- **직접 연결** 방식
- 각 입력과 출력 사이에 스위치 배치
- **병렬 처리** 가능, 고성능

#### 2. Banyan Switch

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2cad25a5391aff503034fda49ead01d5.png" alt="image" width="600" />

- **다단계 스위칭** 방식
- 여러 단계를 거쳐 경로 설정
- 비용 효율적

#### 3. Batcher-Banyan Switch

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1387969a52b809fbf82faf43427aed10.png" alt="image" width="600" />

- **충돌 방지** 기능 추가
- 동일 출력 포트 경합 해결
- 높은 안정성