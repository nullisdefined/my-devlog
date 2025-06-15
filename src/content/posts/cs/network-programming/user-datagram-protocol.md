---
title: "UDP (User Datagram Protocol)"
slug: "user-datagram-protocol"
date: 2025-05-23
tags: ["NetworkProgramming", "TransportLayer", "UDP"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ea39122b061587fc322b39717a9a325c.png"
draft: false
---
UDP(User Datagram Protocol)는 TCP와 함께 인터넷의 핵심 전송 계층 프로토콜이다. 실시간 애플리케이션과 고성능 네트워크 서비스의 백본 역할을 한다.

## UDP란?

![image|600](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ea39122b061587fc322b39717a9a325c.png)

UDP는 연결 없는(Connectionless) 프로토콜로, TCP보다 단순하지만 빠른 데이터 전송을 제공한다. "Fire and Forget" 방식으로 동작하여 실시간 통신에 최적화되어 있다.

### 핵심 특징

- **8바이트 고정 헤더**: 최소한의 오버헤드
- **연결 설정 불필요**: 즉시 데이터 전송 가능
- **순서 보장 없음**: 애플리케이션에서 처리
- **신뢰성보다 속도**: 실시간 성능 우선

## UDP 헤더 구조

UDP 데이터그램은 간단하면서도 효율적인 구조를 가진다.

![image|600](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6dad97cad9537738b2f1854ca4845dd5.png)

### 필드 설명

#### Source Port (16비트)

- 범위: 0~65,535
- 송신 프로세스 식별
- 클라이언트에서는 주로 동적 할당

#### Destination Port (16비트)

- 범위: 0~65,535
- 수신 프로세스 식별
- 서버에서는 well-known 포트 사용

#### Length (16비트)

- 헤더 + 데이터의 총 길이
- 최소값: 8바이트 (헤더만)
- 최대값: 65,535바이트

#### Checksum (16비트)

- 오류 검출용
- 선택적 사용 가능 (IPv4에서)
- IPv6에서는 필수

## UDP 체크섬 계산

UDP 체크섬은 IP 프로토콜과 다른 계산 방식을 사용한다.

### 체크섬 구성 요소

![image|600](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ee3c399e79517e1f5d1ec8f15ac17189.png)

1. **Pseudoheader**: IP 헤더의 일부 필드
2. **UDP Header**: 실제 UDP 헤더
3. **Data**: 애플리케이션 데이터

## 주요 UDP 포트 번호

UDP는 다양한 네트워크 서비스에서 활용된다.

|포트|프로토콜|설명|
|---|---|---|
|**7**|Echo|받은 데이터그램을 그대로 반환|
|**9**|Discard|받은 모든 데이터그램 폐기|
|**13**|Daytime|현재 날짜와 시간 반환|
|**53**|DNS|도메인 네임 서비스|
|**67/68**|DHCP|동적 IP 주소 할당|
|**69**|TFTP|간단한 파일 전송|
|**111**|RPC|원격 프로시저 호출|
|**123**|NTP|네트워크 시간 동기화|
|**161/162**|SNMP|네트워크 관리 프로토콜|
|**514**|Syslog|시스템 로그 전송|

## UDP의 장단점

### **장점**

#### 1. 빠른 전송 속도

- 연결 설정 과정 불필요
- 최소한의 헤더 오버헤드 (8바이트)
- 즉시 데이터 전송 가능

#### 2. 단순한 구조

- 복잡한 상태 관리 불필요
- 구현이 간단함
- 디버깅이 용이함

#### 3. 멀티캐스트 지원

- 일대다 통신 효율적
- 브로드캐스트 가능
- 네트워크 대역폭 절약

#### 4. 실시간 특성

- 지연 시간 최소화
- 버퍼링 불필요
- 스트리밍에 적합

### **단점**

#### 1. 신뢰성 부족

- 패킷 손실 가능
- 순서 보장 없음
- 중복 패킷 가능

#### 2. 흐름 제어 없음

- 수신자 처리 능력 고려 안 함
- 네트워크 혼잡 제어 없음
- 버퍼 오버플로우 위험

#### 3. 오류 제어 제한적

- 체크섬만으로 오류 검출
- 오류 복구 기능 없음
- 애플리케이션에서 처리 필요