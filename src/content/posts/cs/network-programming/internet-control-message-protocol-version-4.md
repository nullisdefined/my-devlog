---
title: "Internet Control Message Protocol Version 4 (ICMPv4)"
slug: "internet-control-message-protocol-version-4"
date: 2025-05-14
tags: ["NetworkProgramming", "NetworkLayer", "IP", "ICMP"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4d5790e1a34970ee68809eaad18fe825.png"
draft: false
views: 0
---
## ICMP 개념과 필요성
![ICMP](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4d5790e1a34970ee68809eaad18fe825.png)

### ICMP란?
Internet Control Message Protocol의 약자로, IP 프로토콜의 오류 보고 및 제어 기능을 보완하는 프로토콜이다.

### ICMP가 필요한 이유

#### IP 프로토콜의 한계
- **Unreliable**: 패킷 전달 보장 없음
- **Connectionless**: 연결 상태 정보 없음
- **Best Effort**: 오류 발생 시 알릴 방법 없음

#### ICMP의 역할
- **오류 상황 보고**: 패킷 전달 실패 원인 알림
- **네트워크 진단**: 연결성 및 경로 정보 제공
- **제어 메시지**: 라우팅 최적화 정보 전달

### ICMP 특징
- **IP 패킷 내부에 캡슐화**되어 전송
- **Protocol Number 1**로 식별
- **오류 보고만 수행**, 오류 수정은 상위 계층에서 담당

## ICMP 메시지 구조
![ICMP 메시지 구조](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b85894ec994d6b42d2fe1fa07e1ca9c3.png)

### 기본 헤더 구조
|필드|크기|설명|
|---|---|---|
|**Type**|8비트|메시지 종류 (오류/질의)|
|**Code**|8비트|세부 오류 원인|
|**Checksum**|16비트|ICMP 메시지 오류 검출|
|**데이터**|가변|메시지 유형별 추가 정보|

### Type 필드 주요 값
|Type|메시지 이름|분류|
|---|---|---|
|**0**|Echo Reply|질의|
|**3**|Destination Unreachable|오류|
|**5**|Redirection|오류|
|**8**|Echo Request|질의|
|**11**|Time Exceeded|오류|
|**12**|Parameter Problem|오류|

## 오류 보고 메시지 (Error Reporting)
![오류 보고 메시지](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/98f97e2456a20dda5adfca5b709e6ad3.png)

### 오류 메시지 구조
모든 오류 메시지는 다음과 같이 구성된다.

1. **ICMP 헤더** (8바이트)
2. **원본 IP 헤더** (20바이트)
3. **원본 데이터의 처음 8바이트**

### 오류 메시지 생성 제한 사항
ICMP 오류 메시지는 다음 경우에는 생성되지 않는다.

1. **ICMP 오류 메시지 자체**에 대한 오류
2. **멀티캐스트 주소**를 대상으로 한 데이터그램
3. **루프백 주소** (127.0.0.1, 0.0.0.0 등) 사용
4. **첫 번째 단편이 아닌** 조각 데이터그램
5. **브로드캐스트 주소**를 대상으로 한 데이터그램

## 주요 오류 메시지 유형

### 1. Destination Unreachable (Type 3)
![Destination Unreachable](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/13f5d8aeebd715376b4ecfb9157019b8.png)

**목적지에 도달할 수 없을 때 발생하는 오류**

#### Code 값별 의미
|Code|의미|발생 상황|
|---|---|---|
|**0**|Network Unreachable|목적지 네트워크로의 경로 없음|
|**1**|Host Unreachable|목적지 호스트 응답 없음|
|**2**|Protocol Unreachable|지원하지 않는 프로토콜|
|**3**|Port Unreachable|목적지 포트가 열려있지 않음|
|**4**|Fragmentation Needed|단편화 필요하지만 DF 플래그 설정|
|**5**|Source Route Failed|소스 라우팅 실패|

#### 실제 사용 예시
```bash

# 존재하지 않는 호스트에 ping
ping 192.168.1.999
→ "Destination Host Unreachable" 메시지

# 닫힌 포트에 접속 시도
telnet 192.168.1.1 8080  
→ "Port Unreachable" 메시지
```

### 2. Time Exceeded (Type 11)
**시간 초과로 인한 오류**

#### Code 값별 의미
|Code|의미|발생 상황|
|---|---|---|
|**0**|TTL Exceeded|TTL이 0이 되어 패킷 폐기|
|**1**|Fragment Reassembly Time Exceeded|단편 재조립 시간 초과|

#### TTL Exceeded 동작
```
패킷 경로: A → R1 → R2 → R3 → B
초기 TTL: 3

A에서 전송: TTL=3
R1 통과: TTL=2
R2 통과: TTL=1  
R3 도착: TTL=0 → 패킷 폐기, ICMP Time Exceeded 전송
```

### 3. Parameter Problem (Type 12)
**IP 헤더나 옵션 필드의 오류**

#### 주요 원인
- 잘못된 헤더 길이
- 유효하지 않은 옵션 값
- 체크섬 오류
- 버전 필드 오류

### 4. Redirection (Type 5)
**더 나은 경로 정보 제공**

#### 동작 시나리오
```
**네트워크 구성**:
Host A (192.168.1.10) 
Gateway R1 (192.168.1.1)
Better Router R2 (192.168.1.2)

**과정**:
1. A가 기본 게이트웨이 R1으로 패킷 전송
2. R1이 더 나은 경로 R2를 발견
3. R1이 A에게 Redirection 메시지 전송
4. A의 라우팅 테이블 갱신: 해당 목적지는 R2 사용
```

#### Code 값별 의미
|Code|의미|
|---|---|
|**0**|Network Redirection|
|**1**|Host Redirection|
|**2**|Type of Service and Network Redirection|
|**3**|Type of Service and Host Redirection|

## 질의 메시지 (Query Messages)

### Echo Request/Reply (Type 8/0)
![Echo Request/Reply](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0c402f1873da3f37172ced2cf4911684.png)

**네트워크 연결성 테스트용 메시지**

#### 메시지 구조
```
**ICMP Echo 메시지**:
- Type: 8 (Request) 또는 0 (Reply)
- Code: 0
- Checksum: 16비트
- Identifier: 16비트 (프로세스 식별)
- Sequence Number: 16비트 (순서 번호)
- Data: 가변 길이 (타임스탬프, 패턴 데이터 등)
```

#### Ping 명령어 동작
```bash
ping 192.168.1.1

**과정**:
1. Echo Request (Type 8) 전송
2. 목적지에서 Echo Reply (Type 0) 응답
3. RTT (Round Trip Time) 계산
4. 연결성 및 응답 시간 확인
```

## 네트워크 진단 도구

### Ping 명령어

#### 기본 사용법
```bash

# 기본 ping
ping 192.168.1.1

# 패킷 수 제한
ping -c 4 192.168.1.1

# 패킷 크기 지정
ping -s 1000 192.168.1.1

# 간격 조정
ping -i 0.5 192.168.1.1
```

#### Ping 결과 해석
```
PING 192.168.1.1 (192.168.1.1): 56 data bytes
64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=1.2ms
64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.8ms

**정보**:
- icmp_seq: 시퀀스 번호
- ttl: 남은 TTL 값
- time: 왕복 시간 (RTT)
```

### Traceroute 도구
![Traceroute 1](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5112e08c290df8f9d52089d82aefba8d.png)

![Traceroute 2](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8074402533fcd77f0fe98e5e2e1b727e.png)

#### Traceroute 동작 원리
**TTL 값을 점진적으로 증가시켜 경로상의 모든 라우터를 발견**

```
목적지: 203.252.15.5

**단계별 과정**:
1. TTL=1로 패킷 전송 → 첫 번째 라우터에서 Time Exceeded 응답
2. TTL=2로 패킷 전송 → 두 번째 라우터에서 Time Exceeded 응답  
3. TTL=3으로 패킷 전송 → 세 번째 라우터에서 Time Exceeded 응답
...
n. TTL=n으로 패킷 전송 → 목적지에서 Echo Reply 응답 (도착)
```

#### 실제 사용 예시
```bash
traceroute google.com

**출력**:
1  192.168.1.1 (192.168.1.1)  1.2ms  1.1ms  1.0ms
2  10.0.0.1 (10.0.0.1)  5.2ms  5.1ms  5.3ms  
3  203.252.15.1 (203.252.15.1)  15.2ms  14.8ms  15.1ms
4  8.8.8.8 (8.8.8.8)  25.5ms  25.2ms  25.8ms

**정보**:
- 각 홉별 라우터 IP 주소
- 3번의 측정값 (패킷 손실 대비)
- 각 구간별 지연 시간
```

#### Traceroute 구현 방식

##### Unix/Linux: ICMP 방식
- Echo Request 패킷 사용
- TTL 값을 1부터 증가
- Time Exceeded 응답으로 경로 추적

##### Windows: UDP 방식
```bash
tracert google.com  # Windows 명령어

**동작**:
- UDP 패킷을 높은 포트 번호로 전송
- TTL 만료 시 Time Exceeded 응답
- 목적지 도달 시 Port Unreachable 응답
```

## ICMP 보안

### ICMP를 이용한 공격

#### 1. ICMP Flood
**대량의 ICMP 패킷으로 네트워크 마비**

```
**공격 방법**:
- 큰 크기의 ping 패킷 연속 전송
- 네트워크 대역폭 소모
- 시스템 리소스 고갈
```

#### 2. Ping of Death
**비정상적으로 큰 ICMP 패킷으로 시스템 다운**

```
**공격 원리**:
- 65,535바이트를 초과하는 ping 패킷 전송
- 시스템 버퍼 오버플로우 유발
- 시스템 충돌 또는 서비스 거부
```

#### 3. ICMP Redirect 공격
**가짜 Redirect 메시지로 라우팅 조작**

```
**공격 과정**:
1. 공격자가 가짜 ICMP Redirect 전송
2. 피해자의 라우팅 테이블 변조
3. 트래픽을 공격자가 제어하는 경로로 우회
4. 패킷 도청 또는 조작
```

### ICMP 보안 대책

#### 1. ICMP 필터링
불필요한 ICMP 트래픽을 차단하고 외부에서 내부로 들어오는 ping 요청(Echo Request)을 차단하여 시스템 노출을 방지한다.
Redirect 메시지는 라우팅 테이블을 조작할 수 있어 보안상 위험하다. 일반적으로 필요하지 않으며 차단이 권장된다.

```bash

# iptables를 이용한 ICMP 제한
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP  # ping 차단
iptables -A INPUT -p icmp --icmp-type redirect -j DROP      # redirect 차단
```

#### 2. Rate Limiting
과도한 ICMP 트래픽은 서비스 거부(DDoS) 공격으로 이어질 수 있으므로 속도 제한(Rate Limiting)을 통해 방어한다. 

```
**ICMP 패킷 빈도 제한**:
- 초당 허용 패킷 수 제한
- 임계치 초과 시 일시 차단
- DDoS 공격 완화
```

#### 3. 선별적 허용
모든 ICMP 메시지를 무작정 차단하면 네트우크 트러블슈팅이나 오류 처리 기능까지 손상된다. 따라서 아래처럼 필수 메시지만 허용하는 것이 좋다.

```
**허용을 권장하는 ICMP 타입**:
- Echo Reply (ping 응답)
- Destination Unreachable
- Time Exceeded  
- Parameter Problem

**차단이 권장되는 ICMP 타입**:
- Echo Request (외부에서 내부로)
- Redirect
- Source Quench
```