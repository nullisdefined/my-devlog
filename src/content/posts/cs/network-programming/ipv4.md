---
title: "IPv4"
slug: "ipv4"
date: 2025-05-10
tags: ["NetworkProgramming", "NetworkLayer", "IP", "IPv4", "Forwarding", "CIDR", "Fragmentation", "ARP", "OSPF", "RIP"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8f7a5baa17e6aa063b861db32b978d75.png"
draft: false
views: 0
---
## IPv4 Address

### IPv4 주소 기본 개념
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8f7a5baa17e6aa063b861db32b978d75.png" alt="IPv4" width="500" />

- **32비트 식별자**로 인터넷상 호스트나 라우터를 유일하게 식별
- IP 주소는 **인터페이스의 주소**임 (호스트 자체가 아님)
- 점분 십진법(dotted decimal)으로 표현: `192.168.1.1`

### 클래스기반 주소지정(Classful Addressing)
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/679cf7e94f26b98a820f554bce2e8476.png" alt="classful addressing" width="550" />

| 클래스 | 시작 비트 | 첫 옥텟 범위 | Netid 크기 | Hostid 크기 | 주소 개수    | 용도       |
| --- | ----- | ------- | -------- | --------- | -------- | -------- |
| A   | 0     | 0~127   | 8bit     | 24bit     | 약 1억 6천만 | 매우 큰 조직  |
| B   | 10    | 128~191 | 16bit    | 16bit     | 약 6만 5천  | 중간 규모 조직 |
| C   | 110   | 192~223 | 24bit    | 8bit      | 256      | 소규모 조직   |
| D   | 1110  | 224~239 | -        | -         | -        | 멀티캐스트용   |
| E   | 1111  | 240~255 | -        | -         | -        | 사용 X     |

**문제점**: A, B 클래스는 주소 낭비, C 클래스는 주소 부족

## 서브넷팅(Subnetting)

### 개념
- 기존 네트워크를 더 작은 서브네트워크로 분할
- 서브넷 마스크를 사용하여 네트워크와 호스트 부분 구분

### 계산 공식
- **서브넷 수** = 2^s (s: 서브넷에 할당된 비트 수)
- **각 서브넷 내 호스트 수** = 2^h - 2 (h: 호스트에 할당된 비트 수)

### 예제
```
네트워크: 141.14.0.0/16
서브넷 마스크: 255.255.192.0 (/18)
→ 4개의 서브넷 생성 (2^2 = 4)
→ 각 서브넷당 16,382개 호스트 (2^14 - 2)
```

## 슈퍼네팅(Supernetting)

### 개념
- 여러 개의 작은 네트워크를 하나의 큰 네트워크로 결합
- 주로 Class C 블록들을 묶어 사용

### 슈퍼넷 마스크 계산
```
n_super = n - log₂(c)
- n: 디폴트 마스크 비트 수
- c: 합칠 Class C 개수
```

### 한계
- 2의 거듭제곱 개수만 결합 가능
- 주소 낭비 발생 가능
- 라우팅 복잡성 증가

## CIDR (Classless Inter-Domain Routing)

### 주요 특징
- 클래스 개념 없이 **가변 길이 서브넷 마스크(VLSM)** 사용
- **프리픽스/서픽스** 구조: 네트워크 부분/호스트 부분
- 슬래시 표기법: `192.168.1.0/24`

### 특수 주소 블록
1. **네트워크 주소**: 서픽스가 모두 0 (예: `192.168.1.0/24`)
2. **직접 브로드캐스트 주소**: 서픽스가 모두 1 (예: `192.168.1.255/24`)

### CIDR 특수 주소
- **0.0.0.0**: DHCP 요청 시 출발지 주소로 사용
- **255.255.255.255**: 제한된 브로드캐스트 주소
- **127.0.0.1**: 루프백 주소 (자기 자신 테스트)
- **사설 주소**: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
- **멀티캐스트 주소**: 224.0.0.0/4

## NAT (Network Address Translation)

### 필요성
- 공인 IP 주소 부족 문제 해결
- 내부는 사설 IP, 외부 통신 시 공인 IP로 변환

### 동작 방식
1. **송신 시**: 사설 IP → 공인 IP 변환
2. **수신 시**: 변환 테이블 참조하여 원래 사설 IP로 복원
3. **PAT**: IP + Port 함께 매핑하여 다수 호스트가 하나의 공인 IP 공유

## Delivery and Forwarding of IP Packets

### 전달(Delivery) 방식

#### 직접 전달(Direct Delivery)
- 목적지가 **같은 물리 네트워크**에 있는 경우
- 라우터 없이 직접 전송

#### 간접 전달(Indirect Delivery)
- 목적지가 **다른 네트워크**에 있는 경우
- 하나 이상의 라우터를 경유

### 포워딩(Forwarding) 방식

#### 1. Next-hop method (다음 홉 방법)
- 가장 일반적, 메모리 효율적
- 다음 홉 정보만 저장

#### 2. Network-specific method (네트워크 지정 방법)
- 같은 네트워크는 하나의 엔트리로 관리
- 실제 라우팅 테이블에서 주로 사용

#### 3. Host-specific method (호스트 지정 방법)
- 특정 호스트를 위한 특별 경로
- 정책 기반 라우팅에서 제한적 사용

#### 4. Default method (디폴트 방법)
- 일치하는 경로가 없을 때 사용
- 인터넷 연결 시 필수

### 라우팅 테이블 구조
|Destination|Subnet Mask|Next Hop|Interface|
|---|---|---|---|
|192.168.1.0|255.255.255.0|10.0.0.2|eth0|
|0.0.0.0|0.0.0.0|192.168.1.1|eth0|

**주의**: Next Hop이 `0.0.0.0`이면 직접 전달 의미

## Classless Addressing Forwarding

### 특징
1. **마스크 정보 필수**: 테이블에 `/n` 정보 포함
2. **주소 집약화**: 라우팅 테이블 간소화
3. **Longest Prefix Match**: 가장 구체적인 경로 우선 선택

### 예제
```
목적지: 201.4.22.35
**라우팅 테이블**:
201.4.22.0/26  → 매치 안됨
201.4.22.0/25  → 매치 안됨  
201.4.22.0/24  → 선택됨
```

## 계층적 라우팅(Hierarchical Routing)

### 구조
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4ef905403ee4dd73228258adcfa80bc0.png" alt="계층적 라우팅 구조" width="550" />

- **Backbone ISP** → **Regional ISP** → **Local ISP**
- 각 단계에서 자신의 범위만 관리
- 상위 ISP는 하위 블록을 집약하여 관리

### 장점
- 라우팅 테이블 크기 감소
- 검색 속도 향상
- 관리 효율성 증대

## Internet Protocol Version 4 (IPv4)

### IP 프로토콜 특성
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/46818d951985a3d80f39b0e07eceac74.png" alt="IP 프로토콜" width="600" />

- **Unreliable**: 신뢰성 제공 안함
- **Connectionless**: 비연결형 데이터그램 프로토콜
- 각 패킷은 독립적으로 처리

### IP 데이터그램 헤더 (고정 20바이트)
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/250ad2539d1b8ec705cc91b172f931b9.png" alt="IP 데이터그램 헤더" width="550" />

|필드|크기|설명|
|---|---|---|
|VER|4비트|IP 버전 (IPv4=4)|
|HLEN|4비트|헤더 길이 (4바이트 단위)|
|Total Length|16비트|전체 길이 (1바이트 단위)|
|Identification|16비트|단편화 식별자|
|Flags|3비트|단편화 제어|
|Fragment Offset|13비트|단편 위치 (8바이트 단위)|
|TTL|8비트|홉 제한|
|Protocol|8비트|상위 프로토콜 (TCP=6, UDP=17)|
|Checksum|16비트|헤더 오류 검출|
|Source IP|32비트|송신자 IP|
|Destination IP|32비트|수신자 IP|

### 단편화(Fragmentation)

#### 단편화 관련 필드
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2ec383f33dc89c1e7d666e63a93308e2.png" alt="단편화 플래그 필드" width="600" />

- **Identification**: 같은 데이터그램 조각 식별
**- **Flags****:
    - DF(Don't Fragment): 단편화 금지
    - MF(More Fragments): 더 많은 조각 있음
- **Fragment Offset**: 조각 위치 (8바이트 단위)

#### 단편화 규칙
1. 수신지에서만 재조립
2. 모든 조각이 도착해야 재조립 가능
3. 시간 내 미도착 시 모든 조각 폐기

#### 단편 상태 판별
- `offset=0, MF=0`: 원본 패킷 (단편화 안됨)
- `offset=0, MF=1`: 첫 번째 조각
- `offset≠0, MF=1`: 중간 조각
- `offset≠0, MF=0`: 마지막 조각

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c6e432bc48d549b8530ebd36b41a1227.png" alt="단편화 예시" width="600" />

### IP 옵션 (가변 길이, 최대 40바이트)

#### 옵션 구조 (TLV 형식)
- **Type**: Copy(1) + Class(2) + Number(5)
- **Length**: 옵션 전체 길이
- **Value**: 옵션 데이터

#### 주요 옵션들
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d75e8b1f26702ab8d4b018aafdb1a8fd.png" alt="IP 옵션" width="600" />

1. **No Operation (1)**: 패딩용
2. **End of Option (0)**: 옵션 종료
3. **Record Route (7)**: 경로 기록
4. **Strict Source Route (137)**: 엄격한 경로 지정
5. **Loose Source Route (131)**: 느슨한 경로 지정
6. **Timestamp (68)**: 시간 기록

### 체크섬(Checksum)
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ed51282676e03652248837fcac0b684e.png" alt="체크섬" width="600" />

#### 송신 측 계산
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8ba6d0a46b9dc1682ebc93a165a02c27.png" alt="송신지 체크섬" width="600" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/76a32c8ab11c9f7e57bb856c61843344.png" alt="검사합" width="600" />

1. 헤더를 16비트씩 분할
2. 모두 합산 후 1의 보수 계산
3. 체크섬 필드에 저장

#### 수신 측 검증
1. 체크섬 포함 모든 필드 합산
2. 1의 보수 계산
3. 결과가 0이면 정상, 아니면 폐기

**특징**: 헤더만 검사, 데이터는 상위 계층에서 처리

### IPv4 보안 문제와 해결책

#### 주요 취약점
1. **Packet Sniffing**: 패킷 내용 탈취
2. **Packet Modification**: 패킷 내용 변조
3. **IP Spoofing**: 출발지 IP 위조

#### IPSec 해결책
1. **암호화**: 내용 보호
2. **무결성 검사**: 변조 방지
3. **Origin Authentication**: 발신자 인증

## 5. Address Resolution Protocol (ARP)
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/cb6f6b1848c2f126b25c80beeb89ad74.png" alt="ARP" width="600" />

### ARP 개념
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f0f8645fc6d422298d81552cb85cde83.png" alt="ARP 동작" width="600" />

- **논리 주소(IP) → 물리 주소(MAC) 변환**
- 동적 매핑 방식 사용
- 같은 네트워크 내에서만 동작

### ARP 패킷 구조
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8a464fb38003f681bb35fb8d35496901.png" alt="ARP 패킷" width="600" />

|필드|크기|설명|
|---|---|---|
|Hardware Type|16비트|네트워크 유형 (이더넷=1)|
|Protocol Type|16비트|상위 프로토콜 (IPv4=0x0800)|
|Hardware Length|8비트|MAC 주소 길이 (6)|
|Protocol Length|8비트|IP 주소 길이 (4)|
|Operation|16비트|요청=1, 응답=2|
|Sender Hardware Address|48비트|송신자 MAC|
|Sender Protocol Address|32비트|송신자 IP|
|Target Hardware Address|48비트|대상 MAC|
|Target Protocol Address|32비트|대상 IP|

### ARP 동작 과정
1. **ARP 요청**: 브로드캐스트로 전송 (Target MAC = 00:00:00:00:00:00)
2. **ARP 응답**: 해당 IP 호스트만 유니캐스트로 응답
3. **캐시 저장**: 응답받은 MAC 주소를 ARP 테이블에 저장

### ARP 사용 경우 4가지
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8c509d2f7b20fbccf12236ec9850da6f.png" alt="ARP 사용하는 경우" width="650" />

1. **호스트 → 같은 네트워크 호스트**: 목적지 IP 변환
2. **호스트 → 다른 네트워크**: 라우터 IP 변환
3. **라우터 → 다른 라우터**: 다음 라우터 IP 변환
4. **라우터 → 같은 네트워크 호스트**: 목적지 IP 변환

### ARP 캐시 테이블
- **Dynamic**: 1200초 후 자동 삭제
- **Static**: 수동 등록, 영구 보존
- **Broadcast/Multicast**: 정적 엔트리로 저장

### Proxy ARP
- 라우터가 다른 서브넷 호스트를 대신해 ARP 응답
- 네트워크 재구성 없이 서브넷 확장 가능
- 호스트는 같은 네트워크인 것처럼 인식

## 6. Internet Control Message Protocol Version 4 (ICMPv4)
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4d5790e1a34970ee68809eaad18fe825.png" alt="ICMP" width="600" />

### ICMP 역할
- IP 프로토콜의 **오류 보고 및 제어** 기능 보완
- IP 패킷 내부에 캡슐화되어 전송

### ICMP 메시지 구조
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b85894ec994d6b42d2fe1fa07e1ca9c3.png" alt="ICMP 메시지 구조" width="600" />

|필드|크기|설명|
|---|---|---|
|Type|8비트|메시지 종류|
|Code|8비트|상세 이유|
|Checksum|16비트|오류 검출|
|Data|가변|메시지별 데이터|

### 오류 보고 메시지 (Error Reporting)
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/98f97e2456a20dda5adfca5b709e6ad3.png" alt="오류 보고 메시지" width="600" />

#### 1. Destination Unreachable (Type 3)
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/13f5d8aeebd715376b4ecfb9157019b8.png" alt="image" width="600" />

- 목적지 도달 불가 시 발생
- Code: 네트워크/호스트/프로토콜/포트 도달 불가 등

#### 2. Time Exceeded (Type 11)
- Code 0: TTL=0 (라우터에서 발생)
- Code 1: 단편 재조립 시간 초과

#### 3. Parameter Problem (Type 12)
- IP 헤더나 옵션 필드 오류

#### 4. Redirection (Type 5)
- 더 나은 경로 알림
- 호스트의 라우팅 테이블 갱신

#### 오류 메시지 생성 제한
- ICMP 오류 메시지에 대해서는 생성 안함
- 멀티캐스트 주소 대상은 생성 안함
- 루프백 주소는 생성 안함
- 첫 번째 단편이 아닌 조각은 생성 안함

### 질의 메시지 (Query Messages)

#### Echo Request/Reply (Type 8/0)
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0c402f1873da3f37172ced2cf4911684.png" alt="image" width="600" />

- **Ping 명령어**로 연결성 테스트
- RTT(Round Trip Time) 측정 가능

#### Traceroute 도구
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5112e08c290df8f9d52089d82aefba8d.png" alt="image" width="600" />

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8074402533fcd77f0fe98e5e2e1b727e.png" alt="image" width="600" />

- TTL을 1부터 증가시키며 전송
- 각 라우터에서 Time Exceeded 응답 받음
- 경로상의 모든 라우터 IP 확인 가능

## 7. Unicast Routing Protocols

### 라우팅 기본 개념
- **Cost/Metric**: 경로 선택 기준
- **Static vs Dynamic**: 수동 설정 vs 자동 갱신
- **AS(Autonomous System)**: 동일 관리 기관의 라우터 집합

### 라우팅 분류
1. **Intradomain**: AS 내부 라우팅 (RIP, OSPF)
2. **Interdomain**: AS 간 라우팅 (BGP)

## Distance Vector Routing (RIP)

### 동작 원리
- **Bellman-Ford 알고리즘** 기반
- 인접 라우터와 거리 정보 교환
- 홉 수(hop count)를 metric으로 사용

### RIP 특징
- 최대 15홉까지 지원 (16 = 무한대)
- 소규모 네트워크에 적합
- 30초마다 전체 테이블 교환

### 동작 과정
1. 초기화: 직접 연결된 네트워크만 알고 있음
2. 정보 교환: 이웃에게 라우팅 테이블 전송
3. 테이블 갱신: 더 나은 경로 발견 시 갱신
4. 수렴: 모든 라우터가 안정된 상태 도달

## Link State Routing (OSPF)

### 동작 원리
- 전체 네트워크 **토폴로지** 파악
- **다익스트라 알고리즘**으로 최단 경로 계산
- LSA(Link State Advertisement) 정보 전파

### OSPF 구조
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/dcbc02881819b2bf9e01d0ba58b466a7.png" alt="image" width="600" />

#### Area 개념
- **Area 0**: Backbone Area (모든 Area는 Area 0 경유)
- **Area n**: 일반 영역

#### 라우터 유형
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/74ca40f9af9490d3dba56452391cb0c8.png" alt="image" width="600" />

- **Internal Router**: 단일 Area 내 라우터
- **Backbone Router**: Area 0에 속한 라우터
- **ABR**: 두 개 이상 Area 연결 라우터
- **ASBR**: 외부 AS와 연결 라우터

### OSPF 패킷 종류
1. **Hello**: 인접 관계 형성
2. **DBD**: LSDB 요약 정보 교환
3. **LSR**: 필요한 LSA 요청
4. **LSU**: LSA 정보 전송
5. **LSAck**: 수신 확인

### LSA 종류
|Type|이름|생성자|설명|
|---|---|---|---|
|1|Router Link LSA|모든 라우터|자신의 링크 정보|
|2|Network Link LSA|DR|브로드캐스트 네트워크 정보|
|3|Summary LSA (Network)|ABR|다른 Area 네트워크 정보|
|4|Summary LSA (ASBR)|ABR|ASBR 경로 정보|
|5|External Link LSA|ASBR|외부 네트워크 정보|

### DR/BDR 선출
- **브로드캐스트 네트워크**에서 대표 라우터 선출
- 모든 라우터는 DR/BDR과만 인접 관계 형성
- LSA 전파 효율성 증대

## 핵심 정리

### IPv4 주소 체계
1. **클래스 기반** → **서브넷팅/슈퍼네팅** → **CIDR**로 발전
2. NAT로 IP 주소 부족 문제 해결
3. 특수 주소 활용으로 다양한 용도 지원

### 패킷 전달
1. **직접/간접 전달** 구분
2. **포워딩 방식** 선택 (Next-hop이 일반적)
3. **계층적 라우팅**으로 확장성 확보

### 프로토콜 역할
1. **IP**: 비신뢰적 패킷 전달
2. **ARP**: IP-MAC 주소 변환
3. **ICMP**: 오류 보고 및 진단
4. **라우팅 프로토콜**: 경로 정보 교환

### 라우팅 프로토콜 선택
- **소규모**: RIP (단순함)
- **대규모**: OSPF (확장성, 빠른 수렴)
- **AS 간**: BGP (정책 기반)