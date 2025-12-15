---
title: "VoLTE 통화 과정 분석"
slug: "sip-rtp-volte"
date: 2025-06-10
tags: ["NetworkProgramming", "NetworkLayer", "SIP", "RTP", "VoLTE"]
category: "CS/Network Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdfa59aee34a5e0e6383a0155caa3116.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdfa59aee34a5e0e6383a0155caa3116.png" alt="image" width="500" />

## VoLTE

### VoLTE이란?
VoLTE(Voice over LTE)는 4G LTE 네트워크를 통해 음성 통화를 IP 패킷으로 전송하는 기술이다. 기존 2G/3G의 회선 교환 방식과 달리 패킷 교환 방식을 사용하여 더 높은 음질과 빠른 연결을 제공한다.

### 기존 음성 통화와의 차이점
|구분|기존 회선교환|VoLTE|
|---|---|---|
|**네트워크**|2G/3G 회선교환망|4G LTE 패킷망|
|**프로토콜**|TDM 기반|IP 기반 (SIP/RTP)|
|**음성 품질**|협대역 (8kHz)|광대역 (16kHz)|
|**연결 시간**|3-7초|1-2초|
|**데이터 동시 사용**|불가|가능|

## VoLTE 네트워크 아키텍처

### IMS (IP Multimedia Subsystem) 구조
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6231e7cf6ca1c7db4f6ec940285b83ab.png" alt="image" width="500" />

> [!NOTE] *출처: https://letitkang.tistory.com/entry/%ED%86%B5%EC%8B%A0-IMS-IP-Multimedia-Subsystem-%EB%9E%80

### 주요 구성 요소
- **P-CSCF**: Proxy Call Session Control Function (SIP 프록시)
- **S-CSCF**: Serving CSCF (세션 제어)
- **HSS**: Home Subscriber Server (가입자 정보)
- **PCRF**: Policy Control and Charging Rules Function (정책 제어)

## VoLTE 통화 패킷 분석

### 분석 환경 설정
```python

# Python Scapy를 이용한 VoLTE 패킷 분석
from scapy.all import *
import re

**class VoLTEAnalyzer**:
    **def __init__(self, pcap_file)**:
        self.packets = rdpcap(pcap_file)
        self.sip_messages = []
        self.rtp_streams = {}

    **def analyze_packets(self)**:
        **for packet in self.packets**:
            **if self.is_volte_packet(packet)**:
                inner_packet = self.extract_inner_packet(packet)
                **if self.is_sip_packet(inner_packet)**:
                    self.parse_sip_message(inner_packet)
                **elif self.is_rtp_packet(inner_packet)**:
                    self.parse_rtp_packet(inner_packet)
```

### 패킷 캡슐화 구조
VoLTE 패킷은 다음과 같은 터널링 구조를 가진다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d44fd8e3252cec20d63e63b1cf24798c.png" alt="image" width="600" />

## SIP 프로토콜 분석

### SIP 시그널링 플로우

#### 1. 통화 설정 과정
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/cace2733e87e8612ce74920a5e3c4235.png)
*Wireshark - SIP Flow Graph*

#### 2. 실제 분석 결과
|단계|메시지|응답시간|설명|
|---|---|---|---|
|1|INVITE|-|통화 요청 (SDP 포함)|
|2|180 Ringing|58ms|매우 빠른 응답|
|3|200 OK|2.04초|사용자 응답 포함|
|4|ACK|495ms|세션 확립|
|5|BYE|-|17.24초 후 종료|
|6|200 OK|131ms|종료 확인|

### SIP 메시지 구조 분석

#### INVITE 메시지
```sip
INVITE sip:01012345678@ims.mnc000.mcc001.3gppnetwork.org SIP/2.0
Via: SIP/2.0/UDP [2001:2d8:e0:220::50]:5060
From: <sip:01087654321@ims.mnc000.mcc001.3gppnetwork.org>;tag=abc123
To: <sip:01012345678@ims.mnc000.mcc001.3gppnetwork.org>
Call-ID: unique-call-identifier-12345
Content-Type: application/sdp

v=0
o=caller 2890844526 2890844527 IN IP6 2001:2d8:e0:171::70
s=VoLTE Call
c=IN IP6 2001:2d8:e0:171::70
t=0 0
m=audio 40406 RTP/AVP 100
a=rtpmap:100 AMR-WB/16000
a=fmtp:100 mode-change-capability=2
```

### 추출된 통화 정보
- **발신자**: 010-8765-4321
- **수신자**: 010-1234-5678
- **IMS 도메인**: ims.mnc000.mcc001.3gppnetwork.org
- **코덱**: AMR-WB (16kHz 광대역)

## RTP 미디어 전송 분석

### RTP 헤더 구조
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/cf266207a54d4e2e41848023d66a83d0.png)

### 실제 RTP 스트림 분석

#### Stream 1: 수신자 → 발신자
```python
SSRC: 0x0012260b
시작 시퀀스: 1
포트: 2001:2d8:eb2b:d6cd::6d2:cbbc:7010 → 2001:2d8:e0:171::70:40406
페이로드 타입: 100 (AMR-WB)
패킷 수: 465개
전송 시간: 17.54초
```

#### Stream 2: 발신자 → 수신자
```python
SSRC: 0x0024b9cd
시작 시퀀스: 29459
포트: 2001:2d8:e0:171::70:40406 → 2001:2d8:eb2b:d6cd::6d2:cbbc:7010
페이로드 타입: 100 (AMR-WB)
패킷 수: 194개
전송 시간: 17.21초
```

### RTP 헤더 필드 분석
|필드|크기|관찰값|의미|
|---|---|---|---|
|**Version**|2비트|2|RTP v2 표준|
|**Payload Type**|7비트|100|AMR-WB 코덱|
|**Sequence Number**|16비트|연속값|패킷 순서 보장|
|**Timestamp**|32비트|160씩 증가|20ms 간격|
|**SSRC**|32비트|고유값|스트림 식별자|

### 타임스탬프 분석
```python

# RTP 타임스탬프 계산
샘플링_주파수 = 16000  # AMR-WB는 16kHz
타임스탬프_증가량 = 160
패킷_간격 = 타임스탭프_증가량 / 샘플링_주파수

# 결과: 160 / 16000 = 0.01초 = 10ms

# 실제로는 20ms 간격으로 전송

# (AMR-WB의 프레임 길이가 20ms)
```

## SDP 미디어 협상 분석

### SDP Offer (INVITE에 포함)
```sdp
v=0  # 버전
o=caller 2890844526 2890844527 IN IP6 2001:2d8:e0:171::70  # 세션 소유자
s=VoLTE Call  # 세션 이름
c=IN IP6 2001:2d8:e0:171::70  # 연결 정보
t=0 0  # 세션 시간 (영구)
m=audio 40406 RTP/AVP 100  # 미디어: 오디오, 포트 40406, RTP 프로필, PT 100
a=rtpmap:100 AMR-WB/16000  # 페이로드 타입 100 = AMR-WB, 16kHz
a=fmtp:100 mode-change-capability=2  # 모드 변경 지원
```

### SDP Answer (200 OK에 포함)
```sdp
v=0
o=callee 2890844528 2890844529 IN IP6 2001:2d8:eb2b:d6cd::6d2:cbbc
s=VoLTE Call
c=IN IP6 2001:2d8:eb2b:d6cd::6d2:cbbc
t=0 0
m=audio 7010 RTP/AVP 100  # 수신자 RTP 포트: 7010
a=rtpmap:100 AMR-WB/16000  # 동일한 코덱 수락
a=fmtp:100 mode-change-capability=2
```

## AMR-WB 코덱 특성 분석

### AMR-WB (Adaptive Multi-Rate Wideband)
- **주파수 대역**: 50Hz ~ 7kHz (광대역)
- **샘플링 주파수**: 16kHz
- **비트레이트**: 6.6 ~ 23.85 kbps (적응형)
- **프레임 길이**: 20ms
- **품질**: HD Voice 수준

### 네트워크 적응 기능
```python

# AMR-WB 모드별 비트레이트
모드_비트레이트 = {
    0: 6.60,   # kbps
    1: 8.85,
    2: 12.65,
    3: 14.25,
    4: 15.85,
    5: 18.25,
    6: 19.85,
    7: 23.05,
    8: 23.85
}
```

## VoLTE 통화 품질 분석

### 네트워크 성능 지표

#### 지연시간 (Latency)
- **SIP 응답시간**: 58ms (우수)
- **세션 확립시간**: 495ms
- **End-to-End 지연**: <100ms (예상)

#### 패킷 손실률 (Packet Loss)
```python

# 시퀀스 번호 연속성 검사
**def check_packet_loss(rtp_packets)**:
    lost_packets = 0
    **for i in range(1, len(rtp_packets))**:
        expected_seq = (rtp_packets[i-1].seq + 1) % 65536
        **if rtp_packets[i].seq != expected_seq**:
            lost_packets += 1
    return lost_packets

# 분석 결과: 패킷 손실률 0%
```

#### 지터 (Jitter)
- **RTP 패킷 간격**: 정확히 20ms
- **타임스탬프 변화**: 일정한 160 단위 증가
- **지터**: 거의 0에 가까움

### 대역폭 사용량
```python

# VoLTE 대역폭 계산
rtp_헤더 = 12  # bytes
udp_헤더 = 8   # bytes  
ip_헤더 = 40   # bytes (IPv6)
amr_페이로드 = 32  # bytes (평균)

총_패킷_크기 = rtp_헤더 + udp_헤더 + ip_헤더 + amr_페이로드  # 92 bytes
패킷_주기 = 0.02  # 20ms

대역폭 = (총_패킷_크기 * 8) / 패킷_주기 / 1000  # kbps

# 결과: 약 37 kbps (단방향), 74 kbps (양방향)
```

## VoLTE vs 기존 음성통화 비교

### 음질 비교

#### 주파수 응답
```
기존 PSTN/GSM: 300Hz ~ 3.4kHz (협대역)
VoLTE AMR-WB:  50Hz ~ 7kHz (광대역)

**개선 효과**:
- 저음역 확장: 50Hz ~ 300Hz
- 고음역 확장: 3.4kHz ~ 7kHz
- 결과: HD Voice 품질 (2배 향상)
```

#### 압축 효율성
|코덱|비트레이트|품질|특징|
|---|---|---|---|
|**GSM-FR**|13 kbps|보통|기존 2G|
|**GSM-EFR**|12.2 kbps|향상|개선된 2G|
|**AMR-NB**|4.75-12.2 kbps|적응형|3G 표준|
|**AMR-WB**|6.6-23.85 kbps|HD급|VoLTE 표준|

### 서비스 연속성
- **SRVCC**: Single Radio Voice Call Continuity
- **VoLTE → 3G**: 자동 핸드오버
- **끊김 없는 통화**: <1초 전환시간

### 모니터링 도구

#### Wireshark 필터
```bash

# VoLTE 트래픽 필터
sip || rtp || rtcp

# 특정 Call-ID 추적
sip.Call-ID == "unique-call-identifier"

# RTP 스트림 분석
rtp.ssrc == 0x12260b
```

#### IMS 로그 분석
```bash

# P-CSCF 로그
tail -f /var/log/pcscf/pcscf.log | grep "INVITE\|BYE\|REGISTER"

# HSS 로그 (인증 실패)
grep "authentication failed" /var/log/hss/hss.log
```

## 실습: VoLTE 패킷 분석하기

### 분석 도구 설치
```bash

# Wireshark 설치
sudo apt-get install wireshark

# Python 환경 설정
pip install scapy pyshark
```

### 패킷 캡처 및 분석
```python
#!/usr/bin/env python3

# -*- coding: utf-8 -*-
from scapy.all import *
from scapy.layers.inet import IP, UDP
from scapy.layers.inet6 import IPv6
from scapy.layers.l2 import Ether
import struct
import re
from collections import defaultdict
import binascii

**class VoLTEAnalyzer**:
    **def __init__(self, pcap_file)**:
        self.pcap_file = pcap_file
        self.packets = []               # pcap에서 읽어온 전체 패킷들 저장
        self.sip_messages = []          # SIP 메시지들만 따로 저장
        self.rtp_packets = []           # RTP 패킷들만 따로 저장
        self.sdp_sessions = []          # SDP 정보들 저장
        self.call_flows = defaultdict(list)  # Call-ID별로 SIP 메시지 그룹화
        self.rtp_ports = set()          # SDP에서 추출한 RTP 포트들 저장

    **def load_pcap(self)**:
        """pcap 파일을 불러와서 self.packets에 저장"""
        print(f"PCAP 파일 로딩 중: {self.pcap_file}")
        **try**:

            # scapy의 rdpcap으로 패킷 읽기
            self.packets = rdpcap(self.pcap_file)
            print(f"총 {len(self.packets)}개의 패킷을 로드했습니다.")
            return True
        **except Exception as e**:
            print(f"PCAP 파일 로딩 실패: {e}")
            return False

    **def analyze_packets(self)**:
        """로드한 모든 패킷을 하나씩 돌면서 분석"""
        print("\n======== 패킷 분석 시작 ========")

        **for i, pkt in enumerate(self.packets)**:
            **try**:

                # 과제에서 제시한 특정 UDP 포트로 필터링 (srcport=13337, dstport=47290)

                # 이 포트들로 오는 패킷은 안에 또 다른 IP 패킷이 들어있음 (캡슐화됨)
                **if UDP in pkt and pkt[UDP].sport == 13337 and pkt[UDP].dport == 47290**:
                    self.process_encapsulated_packet(pkt, i)

                # 일반적인 UDP 패킷들도 SIP/RTP일 수 있으니 체크
                **elif UDP in pkt**:
                    self.process_regular_packet(pkt, i)

            **except Exception as e**:
                print(f"패킷 {i} 처리 중 오류: {e}")
                continue

        print(f"패킷 분석 완료")

    **def process_encapsulated_packet(self, pkt, pkt_num)**:
        """UDP 페이로드 안에 IP 패킷이 들어있는 캡슐화된 패킷 처리"""
        **try**:

            # UDP 페이로드 부분을 바이트로 추출
            udp_payload = bytes(pkt[UDP].payload)

            # IP 헤더 최소 크기 체크
            **if len(udp_payload) < 20**:
                return

            # IP 버전 확인 (첫 바이트의 상위 4비트가 IP 버전)
            version = (udp_payload[0] & 0xF0) >> 4

            **if version == 4**:

                # IPv4 패킷으로 디캡슐화해서 처리
                inner_pkt = IP(udp_payload)
                self.process_inner_packet(inner_pkt, pkt.time, pkt_num, "IPv4")
            **elif version == 6**:

                # IPv6 패킷으로 디캡슐화해서 처리
                inner_pkt = IPv6(udp_payload)
                self.process_inner_packet(inner_pkt, pkt.time, pkt_num, "IPv6")
            **else**:
                print(f"패킷 {pkt_num}: 알 수 없는 IP 버전 {version}")

        **except Exception as e**:
            print(f"캡슐화된 패킷 처리 오류 (패킷 {pkt_num}): {e}")

    **def process_inner_packet(self, inner_pkt, timestamp, pkt_num, ip_version)**:
        """캡슐화에서 꺼낸 실제 IP 패킷 분석 (SIP/RTP 찾기)"""
        **try**:

            # UDP 프로토콜만 처리 (VoLTE는 UDP 기반)
            **if UDP in inner_pkt**:
                udp_layer = inner_pkt[UDP]
                payload = bytes(udp_layer.payload)

                # IP 주소 추출 (IPv4/IPv6에 따라 다름)
                **if ip_version == "IPv4"**:
                    src_ip = inner_pkt[IP].src
                    dst_ip = inner_pkt[IP].dst
                else:  # IPv6
                    src_ip = inner_pkt[IPv6].src
                    dst_ip = inner_pkt[IPv6].dst

                # 페이로드 내용을 보고 SIP 메시지인지 확인
                **if self.is_sip_message(payload)**:
                    sip_msg = self.parse_sip_message(payload, udp_layer.sport, udp_layer.dport, 
                                                   timestamp, src_ip, dst_ip, pkt_num)
                    **if sip_msg**:
                        self.sip_messages.append(sip_msg)
                        print(f"패킷 {pkt_num}: SIP {sip_msg['method_or_response']} "
                              f"({src_ip}:{udp_layer.sport} → {dst_ip}:{udp_layer.dport})")

                # RTP 패킷인지 확인 (바이너리 헤더 구조로 판단)
                **elif self.is_rtp_packet(payload)**:
                    rtp_info = self.parse_rtp_packet(payload, udp_layer.sport, udp_layer.dport, 
                                                   timestamp, src_ip, dst_ip, pkt_num)
                    **if rtp_info**:
                        self.rtp_packets.append(rtp_info)
                        print(f"패킷 {pkt_num}: RTP SSRC=0x{rtp_info['ssrc']:08x}, "
                              f"Seq={rtp_info['sequence']}, PT={rtp_info['payload_type']}")

        **except Exception as e**:
            print(f"내부 패킷 처리 오류 (패킷 {pkt_num}): {e}")

    **def process_regular_packet(self, pkt, pkt_num)**:
        """일반적인 UDP 패킷 처리 (캡슐화 안된 것들)"""
        **try**:
            **if UDP in pkt**:
                udp_layer = pkt[UDP]
                payload = bytes(udp_layer.payload)

                # IP 주소 추출 (IPv4/IPv6 구분)
                **if IP in pkt**:
                    src_ip = pkt[IP].src
                    dst_ip = pkt[IP].dst
                **elif IPv6 in pkt**:
                    src_ip = pkt[IPv6].src
                    dst_ip = pkt[IPv6].dst
                **else**:
                    return

                # SIP 메시지 체크
                **if self.is_sip_message(payload)**:
                    sip_msg = self.parse_sip_message(payload, udp_layer.sport, udp_layer.dport, 
                                                   pkt.time, src_ip, dst_ip, pkt_num)
                    **if sip_msg**:
                        self.sip_messages.append(sip_msg)

                # RTP 패킷 체크 (SDP에서 찾은 포트나 일반적인 RTP 포트 범위)
                elif (udp_layer.dport in self.rtp_ports or udp_layer.sport in self.rtp_ports or
                      **16384 <= udp_layer.dport <= 32767 or 16384 <= udp_layer.sport <= 32767)**:
                    **if self.is_rtp_packet(payload)**:
                        rtp_info = self.parse_rtp_packet(payload, udp_layer.sport, udp_layer.dport,
                                                       pkt.time, src_ip, dst_ip, pkt_num)
                        **if rtp_info**:
                            self.rtp_packets.append(rtp_info)

        **except Exception as e**:
            print(f"일반 패킷 처리 오류 (패킷 {pkt_num}): {e}")

    **def is_sip_message(self, payload)**:
        """페이로드를 텍스트로 변환해서 SIP 키워드가 있는지 확인"""
        **try**:

            # 바이트를 UTF-8로 디코딩 (에러 무시)
            text = payload.decode('utf-8', errors='ignore')

            # SIP 메시지에 들어가는 대표적인 키워드들
            sip_keywords = ['INVITE ', 'BYE ', 'ACK ', 'CANCEL ', 'REGISTER ', 'OPTIONS ', 'SIP/2.0']
            return any(keyword in text for keyword in sip_keywords)
        **except**:
            return False

    **def parse_sip_message(self, payload, sport, dport, timestamp, src_ip, dst_ip, pkt_num)**:
        """SIP 메시지 텍스트를 파싱해서 필요한 정보들 추출"""
        **try**:
            text = payload.decode('utf-8', errors='ignore')
            lines = text.split('\n')

            **if not lines**:
                return None

            first_line = lines[0].strip()  # 첫 번째 줄이 메소드나 응답 코드

            # SIP 메시지 기본 정보 구성
            sip_msg = {
                'packet_num': pkt_num,
                'timestamp': timestamp,
                'src_ip': src_ip,
                'dst_ip': dst_ip,
                'sport': sport,
                'dport': dport,
                'first_line': first_line,
                'full_text': text,
                'headers': {}
            }

            # 첫 번째 줄 분석해서 요청인지 응답인지 판단
            **if first_line.startswith('SIP/2.0')**:

                # 응답 메시지 (예: SIP/2.0 200 OK)
                parts = first_line.split(' ', 2)
                **if len(parts) >= 2**:
                    sip_msg['method_or_response'] = f"{parts[1]} {parts[2] if len(parts) > 2 else ''}"
                    sip_msg['type'] = 'response'
                    sip_msg['status_code'] = parts[1]
            **else**:

                # 요청 메시지 (예: INVITE sip:user@domain.com SIP/2.0)
                parts = first_line.split(' ')
                **if len(parts) >= 1**:
                    sip_msg['method_or_response'] = parts[0]
                    sip_msg['type'] = 'request'
                    sip_msg['method'] = parts[0]

            # 나머지 줄들을 파싱해서 헤더 추출
            **for line in lines[1:]**:
                line = line.strip()
                if ':' in line and not line.startswith('v='):  # SDP 라인은 제외
                    **try**:
                        key, value = line.split(':', 1)
                        sip_msg['headers'][key.strip()] = value.strip()
                    **except**:
                        continue

            # Call-ID로 같은 통화의 메시지들을 그룹화
            call_id = sip_msg['headers'].get('Call-ID', 'unknown')
            self.call_flows[call_id].append(sip_msg)

            # SDP가 포함된 메시지면 SDP 정보도 추출
            **if 'application/sdp' in text or 'v=0' in text**:
                self.extract_sdp(text, sip_msg)

            return sip_msg

        **except Exception as e**:
            print(f"SIP 파싱 오류: {e}")
            return None

    **def extract_sdp(self, sip_text, sip_msg)**:
        """SIP 메시지에서 SDP 부분을 추출하고 RTP 포트 정보를 수집"""
        **try**:

            # SDP는 v=0으로 시작함
            sdp_start = sip_text.find('v=0')
            **if sdp_start == -1**:
                return

            sdp_text = sip_text[sdp_start:]
            sdp_lines = [line.strip() for line in sdp_text.split('\n') if line.strip()]

            sdp_info = {
                'call_id': sip_msg['headers'].get('Call-ID', 'unknown'),
                'timestamp': sip_msg['timestamp'],
                'media_info': [],
                'connection_info': None,
                'session_name': None
            }

            current_media = None

            # SDP 라인들을 하나씩 파싱
            **for line in sdp_lines**:
                if line.startswith('s='):  # session name
                    sdp_info['session_name'] = line[2:]
                elif line.startswith('c='):  # connection info
                    sdp_info['connection_info'] = line[2:]
                elif line.startswith('m='):  # media description

                    # 이전 미디어 정보가 있으면 저장
                    **if current_media**:
                        sdp_info['media_info'].append(current_media)

                    media_desc = line[2:]
                    current_media = {'description': media_desc, 'attributes': []}

                    # m= 라인에서 RTP 포트 번호 추출

                    # 형식: m=audio 5004 RTP/AVP 0 8
                    parts = media_desc.split()
                    **if len(parts) >= 2 and (parts[0] == 'audio' or parts[0] == 'video')**:
                        **try**:
                            port = int(parts[1])
                            self.rtp_ports.add(port)
                            self.rtp_ports.add(port + 1)  # RTCP는 보통 RTP+1 포트
                            print(f"SDP에서 RTP 포트 발견: {port}")
                        **except ValueError**:
                            pass

                elif line.startswith('a=') and current_media:  # attribute
                    current_media['attributes'].append(line[2:])

            # 마지막 미디어 정보 저장
            **if current_media**:
                sdp_info['media_info'].append(current_media)

            self.sdp_sessions.append(sdp_info)

        **except Exception as e**:
            print(f"SDP 파싱 오류: {e}")

    **def is_rtp_packet(self, payload)**:
        """바이너리 헤더 구조를 보고 RTP 패킷인지 판단"""
        if len(payload) < 12:  # RTP 헤더 최소 크기
            return False

        **try**:

            # RTP 헤더의 첫 번째 바이트에서 버전 추출 (상위 2비트)
            version = (payload[0] & 0xC0) >> 6

            # 두 번째 바이트에서 페이로드 타입 추출 (하위 7비트)
            payload_type = payload[1] & 0x7F

            # RTP 버전은 항상 2여야 함
            **if version != 2**:
                return False

            # VoLTE에서 사용하는 일반적인 페이로드 타입들

            # 0=PCMU, 8=PCMA, 18=G729, 96-127=동적 할당
            valid_payload_types = [0, 8, 18, 96, 97, 98, 99, 100, 101, 102, 103, 104, 107]
            return payload_type in valid_payload_types

        **except**:
            return False

    **def parse_rtp_packet(self, payload, sport, dport, timestamp, src_ip, dst_ip, pkt_num)**:
        """RTP 헤더를 바이너리로 파싱해서 정보 추출"""
        **try**:
            **if len(payload) < 12**:
                return None

            # RTP 헤더 구조 파싱

            # V(2비트) P(1비트) X(1비트) CC(4비트) | M(1비트) PT(7비트) | Sequence(16비트) | Timestamp(32비트) | SSRC(32비트)
            version = (payload[0] & 0xC0) >> 6      # 버전 (상위 2비트)
            padding = (payload[0] & 0x20) >> 5      # 패딩 플래그
            extension = (payload[0] & 0x10) >> 4    # 확장 플래그
            cc = payload[0] & 0x0F                  # CSRC 개수 (하위 4비트)
            marker = (payload[1] & 0x80) >> 7       # 마커 비트
            payload_type = payload[1] & 0x7F        # 페이로드 타입 (하위 7비트)

            # 네트워크 바이트 순서로 16비트/32비트 값들 읽기
            sequence = struct.unpack('!H', payload[2:4])[0]          # 시퀀스 번호
            rtp_timestamp = struct.unpack('!I', payload[4:8])[0]     # RTP 타임스탬프
            ssrc = struct.unpack('!I', payload[8:12])[0]             # SSRC 식별자

            return {
                'packet_num': pkt_num,
                'timestamp': timestamp,
                'src_ip': src_ip,
                'dst_ip': dst_ip,
                'sport': sport,
                'dport': dport,
                'version': version,
                'padding': padding,
                'extension': extension,
                'cc': cc,
                'marker': marker,
                'payload_type': payload_type,
                'sequence': sequence,
                'rtp_timestamp': rtp_timestamp,
                'ssrc': ssrc,
                'payload_size': len(payload) - 12 - (cc * 4)  # 헤더 제외한 실제 음성 데이터 크기
            }

        **except Exception as e**:
            print(f"RTP 파싱 오류: {e}")
            return None

    **def extract_phone_numbers(self)**:
        """SIP INVITE 메시지의 From/To 헤더에서 전화번호 추출"""
        phone_numbers = {'caller': None, 'callee': None}

        # INVITE 메시지를 찾아서 전화번호 추출
        **for msg in self.sip_messages**:
            **if msg.get('type') == 'request' and msg.get('method') == 'INVITE'**:

                # From 헤더에서 발신자 번호 추출 (11자리 숫자 패턴)
                from_header = msg['headers'].get('From', '')
                caller_match = re.search(r'(\d{11})', from_header)
                **if caller_match**:
                    caller_num = caller_match.group(1)

                    # 010-1234-5678 형식으로 변환
                    phone_numbers['caller'] = f"{caller_num[:3]}-{caller_num[3:7]}-{caller_num[7:]}"

                # To 헤더에서 수신자 번호 추출
                to_header = msg['headers'].get('To', '')
                callee_match = re.search(r'(\d{11})', to_header)
                **if callee_match**:
                    callee_num = callee_match.group(1)
                    phone_numbers['callee'] = f"{callee_num[:3]}-{callee_num[3:7]}-{callee_num[7:]}"

                # 둘 다 찾았으면 더 이상 찾을 필요 없음
                **if phone_numbers['caller'] and phone_numbers['callee']**:
                    break

        return phone_numbers

    **def analyze_call_flows(self)**:
        """Call-ID별로 SIP 메시지들을 시간순 정렬해서 통화 흐름 분석"""
        print("\n=== 콜 플로우 분석 ===")

        **for call_id, messages in self.call_flows.items()**:
            if len(messages) < 2:  # 메시지가 너무 적으면 스킵
                continue

            print(f"\nCall-ID: {call_id[:50]}...")  # Call-ID가 너무 길어서 줄임

            # 시간순으로 정렬
            messages.sort(key=lambda x: x['timestamp'])

            # 각 메시지를 순서대로 출력
            **for i, msg in enumerate(messages)**:
                print(f"  {i+1:2d}. 패킷 {msg['packet_num']:3d}: {msg['method_or_response']:20s} "
                      f"({msg['src_ip']}:{msg['sport']} → {msg['dst_ip']}:{msg['dport']})")

    **def analyze_rtp_flows(self)**:
        """SSRC별로 RTP 패킷들을 그룹화해서 음성 스트림 분석"""
        print("\n======== RTP 플로우 분석 ========")

        **if not self.rtp_packets**:
            print("RTP 패킷이 발견되지 않았습니다.")
            return

        # SSRC별로 패킷들을 그룹화 (같은 SSRC = 같은 음성 스트림)
        ssrc_flows = defaultdict(list)
        **for rtp in self.rtp_packets**:
            ssrc_flows[rtp['ssrc']].append(rtp)

        # 각 SSRC 스트림 분석
        **for ssrc, packets in ssrc_flows.items()**:
            packets.sort(key=lambda x: x['timestamp'])  # 시간순 정렬
            print(f"\nSSRC: 0x{ssrc:08x} ({len(packets)}개 패킷)")

            **if len(packets) >= 2**:
                first_pkt = packets[0]
                last_pkt = packets[-1]
                duration = last_pkt['timestamp'] - first_pkt['timestamp']

                print(f"  시작: 패킷 {first_pkt['packet_num']}, 시퀀스 {first_pkt['sequence']}")
                print(f"  종료: 패킷 {last_pkt['packet_num']}, 시퀀스 {last_pkt['sequence']}")
                print(f"  지속시간: {duration:.2f}초")
                print(f"  페이로드 타입: {first_pkt['payload_type']}")

                # 시퀀스 번호 연속성 체크 (패킷 손실 확인)
                seq_numbers = [pkt['sequence'] for pkt in packets]
                expected_seq = seq_numbers[0]
                lost_packets = 0

                **for seq in seq_numbers[1:]**:
                    expected_seq = (expected_seq + 1) % 65536  # 16비트 오버플로우 처리
                    **if seq != expected_seq**:
                        lost_packets += 1
                        expected_seq = seq

                **if lost_packets > 0**:
                    print(f"  패킷 손실: {lost_packets}개")

    **def print_summary(self)**:
        """전체 분석 결과를 요약해서 출력"""
        print("\n" + "="*80)
        print("VoLTE 패킷 분석 결과")
        print("="*80)

        # 전화번호 정보 출력
        phone_numbers = self.extract_phone_numbers()
        print(f"발신자 번호: {phone_numbers['caller'] or '추출 실패'}")
        print(f"수신자 번호: {phone_numbers['callee'] or '추출 실패'}")

        # 기본 통계 정보
        print(f"\n총 패킷 수: {len(self.packets)}")
        print(f"SIP 메시지: {len(self.sip_messages)}")
        print(f"SDP 세션: {len(self.sdp_sessions)}")
        print(f"RTP 패킷: {len(self.rtp_packets)}")
        print(f"콜 플로우: {len([k for k, v in self.call_flows.items() if len(v) >= 2])}")

        # SIP 메소드별 통계
        **if self.sip_messages**:
            methods = defaultdict(int)
            **for msg in self.sip_messages**:
                methods[msg['method_or_response']] += 1

            print("\nSIP 메시지 유형별 통계:")
            **for method, count in sorted(methods.items())**:
                print(f"  {method:20s}: {count:3d}개")

        # RTP 통계
        **if self.rtp_packets**:
            payload_types = defaultdict(int)
            ssrc_set = set()

            **for rtp in self.rtp_packets**:
                payload_types[rtp['payload_type']] += 1
                ssrc_set.add(rtp['ssrc'])

            print("\nRTP 페이로드 타입별 통계:")
            **for pt, count in sorted(payload_types.items())**:
                print(f"  페이로드 타입 {pt:3d}: {count:4d}개")

            print(f"\nSSRC 식별자: {len(ssrc_set)}개")
            **for ssrc in sorted(ssrc_set)**:
                ssrc_packets = [rtp for rtp in self.rtp_packets if rtp['ssrc'] == ssrc]
                print(f"  SSRC: 0x{ssrc:08x} ({len(ssrc_packets)}개 패킷)")

        # SDP에서 발견된 RTP 포트들
        **if self.rtp_ports**:
            print(f"\n발견된 RTP 포트: {sorted(self.rtp_ports)}")

    **def save_detailed_report(self, filename="analysis_report.txt")**:
        """분석 결과를 텍스트 파일로 상세하게 저장"""
        **with open(filename, 'w', encoding='utf-8') as f**:
            f.write("VoLTE 패킷 분석 상세 보고서\n")
            f.write("="*50 + "\n\n")

            # 전화번호 정보
            phone_numbers = self.extract_phone_numbers()
            f.write(f"발신자 번호: {phone_numbers['caller'] or '추출 실패'}\n")
            f.write(f"수신자 번호: {phone_numbers['callee'] or '추출 실패'}\n\n")

            # SIP 메시지 상세 정보
            f.write("SIP 메시지 상세 정보:\n")
            f.write("-" * 30 + "\n")
            **for i, msg in enumerate(self.sip_messages)**:
                f.write(f"{i+1}. 패킷 {msg['packet_num']}: {msg['method_or_response']}\n")
                f.write(f"   {msg['src_ip']}:{msg['sport']} → {msg['dst_ip']}:{msg['dport']}\n")
                f.write(f"   시간: {msg['timestamp']}\n\n")

            # RTP 패킷 상세 정보 (너무 많으면 처음 20개만)
            f.write("\nRTP 패킷 상세 정보:\n")
            f.write("-" * 30 + "\n")
            **for i, rtp in enumerate(self.rtp_packets[:20])**:
                f.write(f"{i+1}. 패킷 {rtp['packet_num']}: SSRC=0x{rtp['ssrc']:08x}\n")
                f.write(f"   시퀀스: {rtp['sequence']}, 페이로드 타입: {rtp['payload_type']}\n")
                f.write(f"   {rtp['src_ip']}:{rtp['sport']} → {rtp['dst_ip']}:{rtp['dport']}\n\n")

        print(f"상세 보고서는 {filename}에 저장하였습니다.")

    **def run_analysis(self)**:
        """전체 분석 과정을 순서대로 실행하는 메인 함수"""
        print("VoLTE 패킷 분석 결과")
        print("="*50)

        # 1. PCAP 파일 로드
        **if not self.load_pcap()**:
            return

        # 2. 패킷 분석 (SIP/RTP 추출)
        self.analyze_packets()

        # 3. 콜 플로우 분석
        self.analyze_call_flows()

        # 4. RTP 스트림 분석
        self.analyze_rtp_flows()

        # 5. 결과 요약 출력
        self.print_summary()

        # 6. 상세 보고서 파일 저장
        self.save_detailed_report()

**def main()**:

    # VoLTE 분석기 생성하고 실행
    analyzer = VoLTEAnalyzer('capture.pcap')
    analyzer.run_analysis()

**if __name__ == "__main__"**:
    main()
```