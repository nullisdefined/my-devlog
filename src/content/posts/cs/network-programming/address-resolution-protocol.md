---
title: "Address Resolution Protocol (ARP)"
slug: "address-resolution-protocol"
date: 2025-05-13
tags: ["NetworkProgramming", "NetworkLayer", "IP", "ARP"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/eb452982ace322630a199d104f8272a0.png"
draft: false
views: 0
---
## ARP 개념과 필요성

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/eb452982ace322630a199d104f8272a0.png" alt="image" width="600" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/12956c2c0a042fe774d1f3dad24ff271.png" alt="image" width="600" />

### ARP란?

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5e399a3e92103b163e794f5b22a66e2e.png" alt="image" width="600" />

Address Resolution Protocol의 약자로, 논리 주소(IP)를 물리 주소(MAC)로 변환하는 프로토콜이다.

### 왜 ARP가 필요한가?

#### 네트워크 계층의 이중 주소 체계

- **논리 주소 (IP 주소)**: 네트워크 계층에서 사용, 라우팅 목적
- **물리 주소 (MAC 주소)**: 데이터링크 계층에서 사용, 실제 전송 목적

#### 실제 전송 과정

1. **상위 계층**: IP 주소로 목적지 지정
2. **네트워크 계층**: IP 주소 기반으로 라우팅
3. **데이터링크 계층**: MAC 주소 필요하여 실제 전송
4. **물리 계층**: 전기 신호로 전송

## 주소 변환 방법

### 1. Static Mapping (정적 변환)

- **수동으로 IP-MAC 매핑 테이블 작성**
- 관리자가 직접 설정 및 유지
- 소규모 네트워크에서 사용

#### 장점

- 안정적이고 예측 가능
- ARP 트래픽 불필요

#### 단점

- 수동 관리 부담
- 네트워크 변경 시 업데이트 필요
- 확장성 부족

### 2. Dynamic Mapping (동적 변환)

- **ARP 프로토콜을 통한 자동 변환**
- 실시간으로 필요 시에만 주소 해결
- 현재 주로 사용되는 방식

## ARP 패킷 구조

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f0a05b2a7ee026f8081b704a419b2de5.png" alt="image" width="600" />

### ARP 패킷 필드

|필드|크기|설명|
|---|---|---|
|**Hardware Type**|16비트|네트워크 유형 (이더넷=1)|
|**Protocol Type**|16비트|상위 프로토콜 (IPv4=0x0800)|
|**Hardware Length**|8비트|물리 주소 길이 (이더넷=6)|
|**Protocol Length**|8비트|논리 주소 길이 (IPv4=4)|
|**Operation**|16비트|동작 유형 (요청=1, 응답=2)|
|**Sender Hardware Address**|48비트|송신자 MAC 주소|
|**Sender Protocol Address**|32비트|송신자 IP 주소|
|**Target Hardware Address**|48비트|대상 MAC 주소|
|**Target Protocol Address**|32비트|대상 IP 주소|

### 필드별 상세 설명

#### Hardware Type

- **1**: Ethernet (IEEE 802.3)
- **6**: IEEE 802 Networks
- **7**: ARCNET
- **15**: Frame Relay

#### Protocol Type

- **0x0800**: IPv4
- **0x0806**: ARP
- **0x86DD**: IPv6

#### Operation

- **1**: ARP Request (ARP 요청)
- **2**: ARP Reply (ARP 응답)
- **3**: RARP Request (역방향 ARP 요청)
- **4**: RARP Reply (역방향 ARP 응답)

## ARP 동작 과정

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e14d769862d0f91877b05b38e4068ac8.png" alt="image" width="600" />


### 기본 ARP 프로세스

#### 1단계: ARP 요청 (Request)

```
송신자 A (192.168.1.10)가 수신자 B (192.168.1.20)의 MAC 주소를 알고 싶은 경우

ARP 요청 패킷:
- Hardware Type: 1 (Ethernet)
- Protocol Type: 0x0800 (IPv4)
- Operation: 1 (Request)
- Sender Hardware Address: AA:BB:CC:DD:EE:FF (A의 MAC)
- Sender Protocol Address: 192.168.1.10 (A의 IP)
- Target Hardware Address: 00:00:00:00:00:00 (모름)
- Target Protocol Address: 192.168.1.20 (B의 IP)

전송 방식: 브로드캐스트 (FF:FF:FF:FF:FF:FF)
```

#### 2단계: ARP 응답 (Reply)

```
수신자 B만 응답:

ARP 응답 패킷:
- Operation: 2 (Reply)
- Sender Hardware Address: 11:22:33:44:55:66 (B의 MAC)
- Sender Protocol Address: 192.168.1.20 (B의 IP)
- Target Hardware Address: AA:BB:CC:DD:EE:FF (A의 MAC)
- Target Protocol Address: 192.168.1.10 (A의 IP)

전송 방식: 유니캐스트 (A의 MAC 주소로 직접 전송)
```

#### 3단계: 캐시 저장

- A는 B의 IP-MAC 매핑을 **ARP 캐시 테이블**에 저장
- 이후 B로 전송할 때 ARP 요청 없이 바로 전송 가능

## ARP 사용 경우 4가지

이미지 표시

### Case 1: 호스트 → 같은 네트워크의 호스트

**송신자와 수신자가 동일한 물리 네트워크에 있는 경우**

```
시나리오: 192.168.1.10 → 192.168.1.20

과정:
1. 목적지 IP (192.168.1.20)가 같은 서브넷인지 확인
2. 192.168.1.20의 MAC 주소를 위한 ARP 요청
3. 192.168.1.20 호스트가 자신의 MAC 주소로 응답
4. 직접 전송
```

### Case 2: 호스트 → 다른 네트워크 (라우터 경유)

**송신자가 다른 네트워크의 호스트에게 전송하는 경우**

```
시나리오: 192.168.1.10 → 10.0.0.50

과정:
1. 목적지가 다른 네트워크임을 확인
2. 기본 게이트웨이 (192.168.1.1)의 MAC 주소를 위한 ARP 요청
3. 라우터가 자신의 MAC 주소로 응답
4. 라우터로 전송 (목적지 IP는 10.0.0.50, 목적지 MAC은 라우터)
```

### Case 3: 라우터 → 다른 라우터

**라우터가 다른 라우터로 패킷을 전달하는 경우**

```
시나리오: 라우터 R1 → 라우터 R2

과정:
1. 라우팅 테이블에서 다음 홉 라우터 결정
2. 다음 홉 라우터의 MAC 주소를 위한 ARP 요청
3. 다음 홉 라우터가 응답
4. 다음 홉 라우터로 전송
```

### Case 4: 라우터 → 같은 네트워크의 호스트

**라우터가 직접 연결된 네트워크의 호스트로 전달하는 경우**

```
시나리오: 라우터 → 192.168.2.30 (최종 목적지)

과정:
1. 목적지가 직접 연결된 네트워크임을 확인
2. 목적지 호스트의 MAC 주소를 위한 ARP 요청
3. 목적지 호스트가 응답
4. 최종 전달 완료
```

## ARP 캐시 테이블

### 캐시 테이블 구조

```
IP Address        MAC Address           Type      TTL
192.168.1.1       aa:bb:cc:dd:ee:ff     dynamic   1200
192.168.1.20      11:22:33:44:55:66     dynamic   800
192.168.1.255     ff:ff:ff:ff:ff:ff     static    -
224.0.0.1         01:00:5e:00:00:01     static    -
```

### 엔트리 유형

#### Dynamic (동적)

- **ARP 요청/응답**으로 학습된 엔트리
- **TTL: 1200초** (20분) 후 자동 삭제
- 대부분의 일반적인 호스트 엔트리

#### Static (정적)

- **수동으로 설정**된 엔트리
- **영구 보존** (시스템 재시작 시까지)
- 브로드캐스트, 멀티캐스트 주소
- 보안상 중요한 서버의 고정 설정

### 특수 주소 엔트리

#### 브로드캐스트 주소

```
IP: 192.168.1.255 (또는 255.255.255.255)
MAC: FF:FF:FF:FF:FF:FF
용도: 네트워크 내 모든 호스트에게 전송
```

#### 멀티캐스트 주소

```
IP: 224.0.0.1 ~ 239.255.255.255
MAC: 01:00:5E:xx:xx:xx (IEEE 표준)
용도: 특정 그룹에게만 전송
```

## Proxy ARP

### Proxy ARP 개념

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6c6029bf6218057c0ad16fd1af8d936e.png" alt="image" width="600" />

**라우터가 다른 서브넷의 호스트를 대신해 ARP 응답하는 기술**

### 동작 원리

1. 호스트는 목적지가 같은 네트워크에 있다고 가정
2. 목적지 IP에 대한 ARP 요청 송신
3. **Proxy ARP 라우터가 자신의 MAC 주소로 응답**
4. 호스트는 라우터의 MAC으로 프레임 전송
5. 라우터가 실제 목적지로 IP 패킷 전달

### 사용 예시

```
네트워크 구성:
- 호스트 A: 141.23.56.21/24
- 호스트 B: 141.23.56.22/24  
- 호스트 C: 141.23.56.23/24 (실제로는 다른 서브넷)

Proxy ARP 동작:
1. A가 C의 MAC 주소 요청 (같은 네트워크라고 생각)
2. 라우터가 자신의 MAC 주소로 응답
3. A는 라우터로 패킷 전송
4. 라우터가 실제 C의 위치로 전달
```

### Proxy ARP 장점

- **네트워크 재구성 불필요**: 호스트 설정 변경 없음
- **투명한 라우팅**: 호스트는 라우터 존재를 모름
- **서브넷 확장 효과**: 논리적으로 하나의 네트워크처럼 동작

### Proxy ARP 단점

- **브로드캐스트 트래픽 증가**
- **보안 위험**: ARP 스푸핑에 취약
- **디버깅 어려움**: 네트워크 구조 파악 곤란

## Directed ARP

### Directed ARP란?

**ARP 캐시 엔트리의 유효시간이 만료되기 전에 유니캐스트로 ARP 요청을 보내 엔트리를 갱신하는 기술**

### 동작 과정

1. **캐시 엔트리 만료 임박**: TTL이 거의 다됨 (예: 1200초 → 100초 남음)
2. **유니캐스트 ARP 요청**: 브로드캐스트 대신 해당 MAC 주소로 직접 전송
3. **응답 확인**:
    - 응답 있음 → TTL을 1200초로 재설정
    - 응답 없음 → 캐시에서 엔트리 삭제

### Directed ARP 장점

- **브로드캐스트 트래픽 감소**
- **네트워크 효율성 향상**
- **불필요한 ARP 요청 최소화**

## ARP 관련 보안 문제

### 1. ARP Spoofing (ARP 스푸핑)

**공격자가 가짜 ARP 응답을 보내 ARP 캐시를 조작하는 공격**

#### 공격 과정

1. 공격자가 정상 호스트 IP로 가짜 ARP 응답 전송
2. 피해자의 ARP 캐시에 공격자 MAC 주소 저장
3. 피해자는 모든 트래픽을 공격자에게 전송
4. 공격자는 트래픽을 도청하거나 변조 후 원래 목적지로 전달

#### 방어 방법

- **Static ARP 엔트리**: 중요한 호스트는 정적으로 설정
- **ARP 모니터링**: 비정상적인 ARP 트래픽 탐지
- **DHCP Snooping**: 신뢰할 수 있는 DHCP 서버만 허용
- **Port Security**: 스위치 포트별 MAC 주소 제한

### 2. ARP Flooding

**대량의 ARP 요청으로 네트워크 혼잡을 유발하는 공격**

#### 방어 방법

- **Rate Limiting**: ARP 요청 빈도 제한
- **ARP Cache Timeout 조정**: 적절한 캐시 시간 설정