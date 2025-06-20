---
title: "Connection-Oriented TCP"
slug: "connection-oriented-tcp"
date: 2025-06-13
tags: ["NetworkProgramming", "TransportLayer", "TCP", "Handshake", "Connection"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e7e4047ee1cbaa795440e2c65f278c4d.png"
draft: false
---
TCP(Transmission Control Protocol)는 인터넷의 전송 계층에서 가장 중요한 프로토콜 중 하나로, 신뢰성 있는 데이터 전송을 보장한다. 다음은 TCP의 기본 개념과 연결 관리 메커니즘에 대해 정리한 내용이다.

## TCP란?

TCP는 **연결 지향적(Connection-Oriented)**이고 **신뢰성 있는(Reliable)** 전송 프로토콜이다. UDP와 달리 데이터를 전송하기 전에 연결을 설정하고, 전송 후에는 연결을 종료하는 과정을 거친다.

### TCP 주요 특징

#### 1. 연결 지향적 (Connection-Oriented)

- 데이터 전송 전 **연결 설정** 필요
- 양방향 통신 채널 구축
- 연결 상태 정보 유지 관리

#### 2. 신뢰성 보장 (Reliable)  

- **순서 보장**: 데이터가 올바른 순서로 전달
- **오류 검출 및 복구**: 손실된 패킷 재전송
- **중복 제거**: 중복된 패킷 처리
#### 3. 바이트 스트림 (Byte Stream)

- 애플리케이션 데이터를 연속된 바이트 스트림으로 처리
- 메시지 경계 없이 연속적인 데이터 흐름
- 송신자가 보낸 데이터와 수신자가 받는 데이터의 순서 보장

#### 4. 전이중 통신 (Full-Duplex)

- 양방향 동시 데이터 전송 가능
- 각 방향마다 독립적인 시퀀스 번호 관리

## 3-Way Handshake

TCP 연결은 **3-Way Handshake** 과정을 통해 설정된다. 이 과정에서 양쪽이 통신할 준비가 되었음을 확인한다.

### 3-Way Handshake 과정

![image|600](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e7e4047ee1cbaa795440e2c65f278c4d.png)

#### 1단계: SYN (Synchronize)

- **클라이언트 → 서버**
- 연결 요청 메시지 전송
- 초기 시퀀스 번호(ISN) 설정
- SYN 플래그 = 1, seq = x

#### 2단계: SYN + ACK (Synchronize + Acknowledge)  

- **서버 → 클라이언트**
- 연결 요청 수락 및 서버의 연결 요청
- 클라이언트 시퀀스 번호 확인응답
- SYN 플래그 = 1, ACK 플래그 = 1
- seq = y, ack = x+1

#### 3단계: ACK (Acknowledge)

- **클라이언트 → 서버**
- 서버의 연결 요청 확인응답
- 연결 설정 완료
- ACK 플래그 = 1, seq = x+1, ack = y+1

### 왜 3-Way인가?

**2-Way로는 부족한 이유:**

- 서버가 클라이언트의 요청을 받았는지 클라이언트가 확인할 수 없음
- 양방향 통신 채널 설정 불완전

**4-Way는 불필요한 이유:**

- 3단계에서 이미 양방향 연결 확인 완료
- 추가 메시지는 오버헤드만 증가

## 4-Way Handshake

TCP 연결 종료는 **4-Way Handshake** 과정을 통해 이루어진다. 양방향 연결이므로 각 방향을 독립적으로 종료해야 한다.

### 4-Way Handshake 과정

![image|600](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fa11aab03da3b7ef565f8b8f80a28f0e.png)
  

#### 1단계: FIN (Finish)

- **클라이언트 → 서버**
- 데이터 전송 완료, 연결 종료 요청
- FIN 플래그 = 1, seq = m

#### 2단계: ACK (Acknowledge)  

- **서버 → 클라이언트**
- 종료 요청 확인응답
- 서버는 아직 데이터 전송 가능
- ACK 플래그 = 1, ack = m+1

#### 3단계: FIN (Finish)

- **서버 → 클라이언트**
- 서버도 데이터 전송 완료, 연결 종료 요청
- FIN 플래그 = 1, seq = n

#### 4단계: ACK (Acknowledge)

- **클라이언트 → 서버**
- 서버의 종료 요청 확인응답
- 연결 완전 종료
- ACK 플래그 = 1, ack = n+1

### 왜 4-Way인가?

**전이중 통신의 특성:**

- 각 방향의 연결을 독립적으로 종료
- 한쪽이 FIN을 보내도 상대방은 계속 데이터 전송 가능

**Half-Close 상태:**

- 1단계 후: 클라이언트 → 서버 방향 종료
- 2단계 후: 서버는 여전히 데이터 전송 가능
- 3단계 후: 서버 → 클라이언트 방향도 종료 요청

## TCP 상태 전이 (State Transition)

TCP 연결은 다양한 상태를 가지며, 각 상태 간의 전이는 엄격하게 정의되어 있다.



### 주요 TCP state

#### 연결 설정 관련 상태

- **CLOSED**: 연결이 없는 상태
- **LISTEN**: 연결 요청 대기 상태 (서버)
- **SYN_SENT**: SYN 전송 후 SYN+ACK 대기 상태 (클라이언트)
- **SYN_RECEIVED**: SYN 수신 후 ACK 대기 상태 (서버)
- **ESTABLISHED**: 연결 설정 완료, 데이터 전송 가능 상태

#### 연결 종료 관련 상태

- **FIN_WAIT_1**: FIN 전송 후 ACK 대기 상태
- **FIN_WAIT_2**: ACK 수신 후 상대방 FIN 대기 상태
- **CLOSE_WAIT**: 상대방 FIN 수신 후 자신의 FIN 전송 대기 상태
- **CLOSING**: 동시에 FIN 전송한 경우
- **LAST_ACK**: FIN 전송 후 마지막 ACK 대기 상태
- **TIME_WAIT**: 연결 종료 후 일정 시간 대기 상태

### 상태 전이도

![image|660](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ce9e3e7a2192620bf211d1e4e96d9651.png)

## 시퀀스 번호와 확인응답 번호


TCP는 시퀀스 번호(Sequence Number)와 ack 번호(Acknowledgment Number)를 사용하여 데이터의 순서와 신뢰성을 보장한다.

### 시퀀스 번호 (Sequence Number)  

- **32비트** 크기
- 보내는 데이터의 첫 번째 바이트 번호
- 초기값은 ISN(Initial Sequence Number)으로 랜덤하게 설정
- 바이트 단위로 증가

### ACK 번호 (Acknowledgment Number)

- **32비트** 크기
- 다음에 받기를 기대하는 바이트 번호
- 현재까지 올바르게 받은 데이터의 마지막 바이트 + 1
- **누적 확인응답(Cumulative ACK)** 방식

## TCP의 장단점

### 장점

#### 1. 신뢰성 보장

- 데이터 손실 없이 전송
- 순서 보장으로 데이터 무결성 유지
- 오류 검출 및 복구 기능

#### 2. 흐름 제어

- 수신자의 처리 능력에 맞춰 전송 속도 조절
- 버퍼 오버플로우 방지

#### 3. 혼잡 제어

- 네트워크 상황에 따른 전송 속도 조절
- 네트워크 혼잡 최소화

### 단점

#### 1. 연결 설정 오버헤드

- 3-Way Handshake로 인한 지연
- 상태 정보 유지를 위한 메모리 사용

#### 2. 헤더 오버헤드

- 최소 20바이트의 고정 헤더
- UDP 대비 2.5배 큰 헤더 크기

#### 3. 복잡성

- 다양한 상태 관리
- 타이머 및 재전송 메커니즘

## 실제 활용 사례

### TCP를 사용하는 애플리케이션

- **HTTP/HTTPS**: 웹 브라우징
- **FTP**: 파일 전송
- **SMTP**: 이메일 전송
- **SSH**: 원격 접속
- **데이터베이스 연결**: MySQL, PostgreSQL 등

### TCP vs UDP 선택 기준

**TCP를 선택해야 하는 경우:**

- 데이터 정확성이 중요한 경우
- 순서 보장이 필요한 경우
- 신뢰성이 성능보다 중요한 경우

**UDP를 선택해야 하는 경우:**

- 실시간 성능이 중요한 경우
- 간단한 요청-응답 패턴
- 멀티캐스트/브로드캐스트 필요