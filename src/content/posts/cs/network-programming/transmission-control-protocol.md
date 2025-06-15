---
title: "TCP (Transmission Control Protocol)"
slug: "transmission-control-protocol"
date: 2025-05-24
tags: ["NetworkProgramming", "TransportLayer", "TCP"]
category: "CS/Network Programming"
draft: true
---
## TCP란?

TCP(Transmission Control Protocol)는 전송 계층의 프로토콜로, 데이터의 신뢰성 있는 전달을 보장하며 연결 지향적이다. 데이터를 정확한 순서로 전달하고 오류 복구, 흐름 제어, 혼잡 제어 기능을 제공한다.

### 커넥션 연결 → 3-Way Handshake

1. **Client → Server** : SYN 전송 (연결 요청, 초기 시퀀스 번호 설정)
2. **Server → Client** : SYN + ACK 전송 (요청 수락 및 서버의 초기 시퀀스 번호 전송)
3. **Client → Server** : ACK 전송 (최종 확인)
    

### 커넥션 종료 → 4-Way Handshake

1. **Client → Server** : FIN 전송 (데이터 송신 종료 요청)
2. **Server → Client** : ACK 응답
3. **Server → Client** : FIN 전송 (서버 데이터 송신 종료)
4. **Client → Server** : ACK 응답

## TCP 상태 전이 (State Transition)

- **LISTEN**: 연결 요청 대기
- **SYN_SENT**: 연결 요청 후 SYN 응답 대기
- **SYN_RECEIVED**: SYN 수신 후 ACK 응답 대기
- **ESTABLISHED**: 데이터 송수신 가능 상태
- **FIN_WAIT, TIME_WAIT** 등: 연결 종료 중인 상태