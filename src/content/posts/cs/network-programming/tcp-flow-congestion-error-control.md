---
title: "TCP Flow, Congestion, Error Control"
slug: "tcp-flow-congestion-error-control"
date: 2025-06-18
tags: ["NetworkProgramming", "TransportLayer", "TCP", "FlowControl", "CongestionControl", "ErrorControl"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5814c335ba54be65ec30bc11c9b781c4.png"
draft: false
views: 0
---
TCP 서비스의 특징은 네트워크 상황과 수신자의 처리 능력에 맞춰 데이터 전송 속도를 조절한다는 것이다. 다음은 TCP의 흐름 제어, 혼잡 제어, 그리고 오류 제어 메커니즘에 정리한 내용이다.

## 흐름 제어 (Flow Control)

→ **송신자가 수신자의 처리 능력을 초과하지 않도록** 전송 속도를 조절하는 메커니즘

### RWND (Receive Window)

RWND(Receive Window)는 수신자가 현재 받을 수 있는 데이터의 양을 나타낸다.

#### RWND의 계산

> RWND = 수신 버퍼 크기 - (수신했지만 애플리케이션이 읽지 않은 데이터)

#### 동작 예

```

수신자 버퍼 크기: 8192바이트

현재 버퍼 사용량: 2048바이트

→ RWND = 8192 - 2048 = 6144바이트

```

### 슬라이딩 윈도우 (Sliding Window)

TCP는 **슬라이딩 윈도우** 방식을 사용하여 효율적인 데이터 전송을 구현한다.

#### 윈도우 구성 요소

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5814c335ba54be65ec30bc11c9b781c4.png" alt="image" width="600" />
*송신자 측 윈도우*

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ef56a8dc0873e552802f21ed4d4f3dad.png" alt="image" width="600" />
*수신자 측 윈도우*
#### 윈도우 슬라이딩

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3bd00b97a368b53278867e45cb296a6f.png" alt="image" width="600" />
- **Sent and acknowledged**: 애플리케이션이 처리한 바이트
- **Sent but not acknowledgeed**: 수신했지만 미처리 바이트
- **Segments waiting for transmission**: 수신 가능한 바이트(rwnd)

윈도우 동작 원리는 다음과 같다.

- 데이터 수신 시: Left Wall 이동 → rwnd 감소 → Close
- 데이터 처리 시: Right Wall 이동 → rwnd 증가 → Open
- Right Wall: 왼쪽으로 이동하지 않음 (= Shrink 없음)

### Zero Window 문제

수신자의 버퍼가 가득 차면 RWND = 0이 되어 **Zero Window** 상황이 발생한다.

#### Zero Window 처리

1. **Window Probe**: 송신자가 주기적으로 1바이트 데이터 전송
2. **Window Update**: 수신자가 버퍼 여유 생기면 윈도우 크기 업데이트
3. **Keep-alive**: 연결 유지를 위한 주기적 확인

## 혼잡 제어 (Congestion Control)  

혼잡 제어는 **네트워크의 혼잡 상황을 감지하고 전송 속도를 조절**하여 네트워크 전체의 성능을 최적화한다.

### CWND (Congestion Window)  

CWND(Congestion Window)는 네트워크 혼잡 상황을 고려한 송신 윈도우 크기다.

#### 실제 전송 윈도우

> 실제 윈도우 크기 = min(RWND, CWND)

- **RWND**: 수신자 기준 제한
- **CWND**: 네트워크 기준 제한

### TCP 혼잡 제어 알고리즘  

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b3920717dc29ee1fce2ffffce1b07ce9.png" alt="image" width="600" />

#### 1. Slow Start

- **목적**: 네트워크 용량을 점진적으로 탐색
- **동작**: CWND를 지수적으로 증가
- **초기값**: 일반적으로 1 MSS

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8fbfc0739568f85e94606aea040578d3.png" alt="image" width="600" />


```

RTT 0: CWND = 1 MSS

RTT 1: CWND = 2 MSS (각 ACK마다 +1)

RTT 2: CWND = 4 MSS

RTT 3: CWND = 8 MSS

...

```

#### 2. Congestion Avoidance  

- **시작 조건**: CWND가 ssthresh(slow start threshold)에 도달
- **동작**: CWND를 선형적으로 증가
- **증가율**: RTT당 1 MSS씩 증가

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a14db3ae39fc3a2a2ec3544c1a62ead6.png)

#### 3. Fast Retransmit

- **감지 조건**: 동일한 ACK 3번 연속 수신
- **추정**: 패킷 손실 발생
- **동작**: 타임아웃 대기 없이 즉시 재전송

#### 4. Fast Recovery

- **시작**: Fast Retransmit 후
- **동작**: Slow Start 건너뛰고 Congestion Avoidance 진입
- **목적**: 성능 급격한 저하 방지

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e68a41550bfb4a6539ef3f2827ed499b.png" alt="image" width="600" />

## 오류 제어 (Error Control)

TCP는 데이터의 신뢰성을 보장하기 위해 다양한 오류 제어 메커니즘을 사용한다.

### 오류 검출

#### 1. Checksum

- **범위**: TCP 헤더 + 데이터 + Pseudo Header
- **알고리즘**: 16비트 1의 보수 체크섬
- **한계**: 단순한 오류만 검출 가능

#### 2. Sequence Number  

- **순서 검증**: 데이터 순서 확인
- **중복 검출**: 중복된 데이터 식별
- **손실 검출**: 누락된 데이터 발견

### 오류 복구

#### 1. ARQ (Automatic Repeat Request)

**Stop-and-Wait ARQ**

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/cb20220ff5fb4f000cdbcaf848c61362.png" alt="image" width="600" />
*출처:https://ajay-yadav.medium.com/computer-networks-stop-wait-protocol-33fe8f4725f9

**Go-Back-N ARQ**

- 윈도우 내 모든 데이터 재전송
- 간단하지만 비효율적

**Selective Repeat ARQ**

- 오류난 세그먼트만 선택적 재전송
- 효율적이지만 복잡함

#### 2. 타임아웃과 재전송

**RTO (Retransmission Timeout) 계산**

```

SRTT = (1-α) × SRTT + α × RTT_sample
RTTVAR = (1-β) × RTTVAR + β × |SRTT - RTT_sample|
RTO = SRTT + 4 × RTTVAR

일반적인 값:
α = 1/8, β = 1/4

```

**지수적 백오프**

```

첫 번째 타임아웃: RTO
두 번째 타임아웃: 2 × RTO
세 번째 타임아웃: 4 × RTO

...

최대: 64 × RTO

```

### 각종 시나리오

#### 1. Normal Operation

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f5c1e4d9c429e0eecb342982984c44a5.png" alt="image" width="600" />

  - **Rule 1**: 응답 데이터가 있을 경우, 즉시 ACK
	- 클라이언트가 서버로 데이터를 전송할 때(Seq: 1201–1400), 이전에 받은 데이터(Ack: 4001)에 대한 ACK를 **동시에 전송**
	- 서버도 마찬가지로 데이터 전송(Seq: 4001–5000) 시 클라이언트의 데이터에 대한 ACK(Ack: 1401)를 함께 보냄
- **Rule 2**: 일정 시간(예: 500ms) 내에 응답할 데이터가 없을 경우, 타이머 만료 시 ACK 전송
	- 클라이언트가 서버로부터 4001–5000을 수신하고 나서도 보낼 데이터가 없을 경우
	- **ACK-delay timer**가 시작되고, 500ms 이내에 전송할 데이터가 없으면 타이머 만료 시점에 **단독 ACK (Ack: 5001)** 전송
- **Rule 3**: 지연 ACK 타이머 도중 추가 데이터 수신 시 즉시 ACK
	- 5001–6000 수신 후 ACK-delay 타이머 시작
	- **타이머가 만료되기 전**에 6001–7000까지 수신되면  
	- 클라이언트는 **즉시 ACK (Ack: 7001)** 전송 → **지연 중단하고 즉시 응답**

ACK는 무조건 바로 보내지 않고, 상황에 따라 지연된다. 응답할 데이터가 생기면 그 데이터와 함께 ACK를 묶어서 전송한다. 지연 ACK 타이머가 돌고 있는 중에 새로운 데이터가 오면 바로 ACK 응답한다.

#### 2. Lost Segment

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/70270a3d9be3caa86264fd3082ace2b3.png" alt="image" width="600" />

- **Rule 3**: 순서대로 받은 데이터에 대해 ACK 전송
- **Rule 4**: 순서가 어긋난 데이터는 버퍼에 저장하되, ACK는 여전히 기대하는 번호(701)를 보냄
- **Rule 5**: 누락된 데이터를 재전송받고, 순서 맞춰 모두 수신한 경우 → 누적 ACK 전송

중간에 손실된 세그먼트가 있으면 ACK 번호가 멈춘다. 서버는 뒤에 오는 데이터들을 버퍼에 저장하지만, 누락된 부분이 들어오기 전까지 ACK는 고정한다. 누락된 세그먼트 재수신 시 모든 데이터가 순서대로 정리하여 누적 ACK로 복구된다.

#### 3. Fast Retransmit

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5d4493a53c244b617c9eddb9978700eb.png" alt="image" width="600" />

- **Rule 3**: 순서대로 수신된 경우 → 다음 기대 시퀀스 번호로 ACK
- **Fast retransmit**: 같은 ACK를 3번 받으면 타이머 기다리지 않고 즉시 재전송

클라이언트는 중복 ACK가 **3번 연속** 오면 해당 세그먼트를 즉시 재전송한다. 이 방식은 RTO(타임아웃)를 기다리지 않아서 빠르게 손실을 복구할 수 있다. 서버는 누락된 세그먼트를 받고 나면 정상적으로 누적 ACK를 전송한다.

#### 4. Lost acknowledgement

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b74799f3780aba53dabdc34fa92ce48d.png" alt="image" width="600" />

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/50ff2f0bbe1366e0c78906636fe35a54.png)

데이터가 아니라 ACK가 손실된 상황으로, 수신자는 이미 받은 데이터를 다시 받지만, 중복 수신으로 처리한다. 신뢰성 보장을 위해 ACK를 받지 못한 쪽이 재전송을 수행한다.

### SACK (Selective Acknowledgment)

기본 TCP의 누적 ACK 한계를 극복하기 위한 확장

#### SACK 블록 예제

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/312a6b12dc5e595ee8dec41d09d5a895.png" alt="image" width="600" />

#### SACK의 장점

- **선택적 재전송**: 손실된 세그먼트만 재전송
- **성능 향상**: 불필요한 재전송 감소
- **네트워크 효율성**: 대역폭 절약