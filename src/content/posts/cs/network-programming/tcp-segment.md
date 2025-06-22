---
title: "TCP Segment"
slug: "tcp-segment"
date: 2025-06-15
tags: ["NetworkProgramming", "TransportLayer", "TCP", "Segment"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f63d135824a3ff49ee19c7003db53c86.png"
draft: false
views: 0
---
다음은 TCP 헤더의 각 필드와 세그먼트 구조, 그리고 TCP state table에 대해 정리한 내용입니다.

## TCP 세그먼트 구조  

TCP에서 전송되는 데이터 단위를 세그먼트(Segment)라고 한다. 각 세그먼트는 TCP 헤더와 애플리케이션 데이터로 구성된다.

### 세그먼트 vs 패킷 vs 프레임

- **세그먼트**: 전송 계층(TCP)에서의 데이터 단위
- **패킷**: 네트워크 계층(IP)에서의 데이터 단위
- **프레임**: 데이터링크 계층에서의 데이터 단위

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f63d135824a3ff49ee19c7003db53c86.png" alt="image" width="600" />

## TCP 헤더 구조

  <img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/995c388c03d0929e0f9a832d42eff7fc.png" alt="image" width="600" />

TCP 헤더는 **최소 20바이트**의 고정 부분과 **최대 40바이트**의 옵션 부분으로 구성된다.

### 각 필드 상세 설명

#### 1. Source Port (16비트)

- **발신지 포트 번호**
- 범위: 0 ~ 65,535
- 클라이언트에서는 보통 동적으로 할당되는 임시 포트 사용
- 예: 클라이언트가 웹 서버에 접속할 때 사용하는 포트

#### 2. Destination Port (16비트)  

- **목적지 포트 번호**
- 범위: 0 ~ 65,535
- 서버에서는 **Well-Known Port** 사용
- 예: HTTP(80), HTTPS(443), FTP(21), SSH(22)

#### 3. Sequence Number (32비트)  

- **시퀀스 번호**
- 이 세그먼트에 포함된 데이터의 첫 번째 바이트 번호
- 초기값: ISN(Initial Sequence Number)
- 바이트 단위로 증가

#### 4. Acknowledgment Number (32비트)

- **확인응답 번호**
- 다음에 받기를 기대하는 바이트 번호
- ACK 플래그가 1일 때만 유효
- 누적 확인응답 방식

#### 5. Data Offset (4비트)  

- **헤더 길이**
- TCP 헤더의 길이를 32비트 워드 단위로 표현
- 최소값: 5 (20바이트), 최대값: 15 (60바이트)
- 계산식: 실제 헤더 길이 = Data Offset × 4 바이트

#### 6. Reserved (6비트)

- **예약 필드**
- 현재 사용되지 않음
- 항상 0으로 설정

## TCP 제어 필드 (Control Flags)

TCP 헤더의 제어 필드는 **6개의 1비트 플래그**로 구성되어 있고, 각각 별도의 의미를 가진다.

### 제어 플래그 종류

#### 1. URG (Urgent)

- **긴급 데이터** 존재를 알림
- URG = 1일 때 Urgent Pointer 필드 유효
- 긴급 데이터는 일반 데이터보다 우선 처리
- 예: Ctrl+C와 같은 인터럽트 신호

#### 2. ACK (Acknowledgment)

- **ACK 응답 번호** 유효성 표시
- ACK = 1일 때 Acknowledgment Number 필드 유효
- 연결 설정 후 모든 세그먼트에서 ACK = 1

#### 3. PSH (Push) - 푸시 플래그  

- **즉시 전달** 요청
- 버퍼링 없이 즉시 애플리케이션에 전달
- 대화형 애플리케이션에서 사용
- e.g. Telnet , SSH에서의 키 입력

#### 4. RST (Reset)

- **연결 강제 종료**
- 비정상적인 상황에서 연결 재설정
- 즉시 연결 종료 (4-Way Handshake 없이)
- e.g. 서버 다운, 잘못된 포트 접근

#### 5. SYN (Synchronize)

- **커넥션 연결** 요청
- 시퀀스 번호 동기화
- 3-Way Handshake에서 사용
- SYN = 1일 때 Sequence Number는 ISN

#### 6. FIN (Finish)

- **연결 종료** 요청
- 더 이상 보낼 데이터가 없음을 표시
- 4-Way Handshake에서 사용

### 제어 플래그 조합 예시


| 플래그 조합       | 상황        | 설명                  |
| ------------ | --------- | ------------------- |
| SYN=1        | 연결 요청     | 3-Way Handshake 1단계 |
| SYN=1, ACK=1 | 연결 수락     | 3-Way Handshake 2단계 |
| ACK=1        | 일반 데이터 전송 | 확인응답 포함             |
| FIN=1, ACK=1 | 연결 종료 요청  | 4-Way Handshake     |
| RST=1        | 강제 연결 종료  | 비정상 종료              |
| PSH=1, ACK=1 | 즉시 전달     | 실시간 데이터             |

## 나머지 헤더 필드

#### 7. Window Size (16비트)

- **수신 윈도우 크기**
- 수신자가 받을 수 있는 바이트 수
- 흐름 제어에 사용
- 최대값: 65,535바이트 (윈도우 스케일링 옵션으로 확장 가능)

#### 8. Checksum (16비트)

- **오류 검출**
- TCP 헤더 + 데이터 + 의사 헤더에 대한 체크섬
- 송신 시 계산, 수신 시 검증
- 오류 발견 시 세그먼트 폐기

#### 9. Urgent Pointer (16비트)

- **긴급 데이터 포인터**
- URG 플래그가 1일 때만 유효
- 긴급 데이터의 마지막 바이트 위치 표시
- Sequence Number + Urgent Pointer = 긴급 데이터 끝

#### 10. Options (가변 길이)

- **TCP 옵션**
- 다양한 확장 기능 제공
- 4바이트 배수로 정렬 (Padding 사용)

### 주요 TCP 옵션

| 옵션               | 길이    | 설명                      |
| ---------------- | ----- | ----------------------- |
| **MSS**          | 4바이트  | Maximum Segment Size 설정 |
| **Window Scale** | 3바이트  | 윈도우 크기 확장               |
| **SACK**         | 가변    | 선택적 확인응답                |
| **Timestamp**    | 10바이트 | RTT 측정 및 순서 보장          |
| **No Operation** | 1바이트  | 정렬용 패딩                  |

## TCP 상태 테이블 (State Table)

TCP 연결의 상태 전이는 **현재 상태**와 **수신한 세그먼트**에 따라 결정된다.

### 상태 전이 테이블  

| 현재 상태            | 수신 세그먼트   | 다음 상태        | 동작         |
| ---------------- | --------- | ------------ | ---------- |
| **CLOSED**       | SYN       | SYN_RECEIVED | SYN+ACK 전송 |
| **LISTEN**       | SYN       | SYN_RECEIVED | SYN+ACK 전송 |
| **SYN_SENT**     | SYN+ACK   | ESTABLISHED  | ACK 전송     |
| **SYN_RECEIVED** | ACK       | ESTABLISHED  | 연결 설정 완료   |
| **ESTABLISHED**  | FIN       | CLOSE_WAIT   | ACK 전송     |
| **ESTABLISHED**  | 데이터       | ESTABLISHED  | ACK 전송     |
| **FIN_WAIT_1**   | ACK       | FIN_WAIT_2   | 대기         |
| **FIN_WAIT_1**   | FIN+ACK   | TIME_WAIT    | ACK 전송     |
| **FIN_WAIT_2**   | FIN       | TIME_WAIT    | ACK 전송     |
| **CLOSE_WAIT**   | 사용자 close | LAST_ACK     | FIN 전송     |
| **LAST_ACK**     | ACK       | CLOSED       | 연결 종료      |
| **TIME_WAIT**    | 타임아웃      | CLOSED       | 연결 종료      |

### 특별한 상태들

#### TIME_WAIT 상태

- **목적**: 지연된 세그먼트 처리
- **지속 시간**: 2 × MSL (Maximum Segment Lifetime)
- **MSL**: 일반적으로 30초~2분
- **이유**:
	- 마지막 ACK가 손실된 경우 재전송 처리
	- 같은 커넥션에서 이전 세그먼트 간섭 방지
  
#### CLOSE_WAIT 상태

- **의미**: 상대방이 연결 종료 요청
- **상황**: 애플리케이션이 아직 close() 호출 안 함
- **문제**: 애플리케이션 버그로 인한 리소스 누수 가능

## 세그먼트 크기와 MSS

### MSS (Maximum Segment Size)  

- **정의**: TCP 세그먼트에서 데이터 부분의 최대 크기
- **기본값**: 536바이트 (IPv4), 1220바이트 (IPv6)
- **협상**: 연결 설정 시 양쪽이 협상하여 결정
- **계산**: MTU - IP 헤더 - TCP 헤더

### MSS announcement (negotiation)

TCP 커넥션 연결을 시작할 때, 3-way handshake 과정의 SYN 패킷에 자신의 MSS 값을 포함시켜 전송하는 것이다.

```

클라이언트 MSS = 1460, 서버 MSS = 1200

→ 실제 사용 MSS = min(1460, 1200) = 1200

```

실제론 협상이 잘 이루어지지 않는다. 왜냐면

1. Ethernet의 기본 MTU = 1,500 바이트
2. 일부 네트워크 환경(특히 VPN, 터널링, 일부 방화벽 설정)에서는 실제 가능한 MTU가 1,400 이하

### 일반적인 MSS 값

| 네트워크      | MTU  | MSS (IPv4) | MSS (IPv6) |
| --------- | ---- | ---------- | ---------- |
| **이더넷**   | 1500 | 1460       | 1440       |
| **PPPoE** | 1492 | 1452       | 1432       |
| **기본값**   | 576  | 536        | 516        |