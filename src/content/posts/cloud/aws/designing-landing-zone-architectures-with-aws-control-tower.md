---
title: "Designing Landing Zone Architectures with AWS Control Tower"
slug: "designing-landing-zone-architectures-with-aws-control-tower"
date: 2025-07-09
tags: ["AWS", "LandingZone", "OU", "SCP", "ControlTower"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/159e9a38bcb2893d4560150f3d10548f.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/159e9a38bcb2893d4560150f3d10548f.png)

# AWS Control Tower를 사용한 랜딩존 아키텍처 설계

## 단일 계정의 한계와 다중 계정의 필요성

AWS를 처음 시작할 때 하나의 계정으로 모든 것을 관리하려고 할 수 있다. 개발, 테스트, 운영 환경을 모두 같은 계정에 두고 VPC나 IAM으로 구분하면 될 것 같다고 생각하기 쉽다.

하지만 이런 방식은 시간이 지나면서 여러 문제를 야기한다. 개발자가 실수로 운영 환경의 데이터베이스를 삭제할 수도 있고, 테스트용 리소스가 갑자기 많은 비용을 발생시켜 전체 예산에 영향을 줄 수도 있다. 또한 보안 정책을 적용할 때도 복잡해진다. 개발팀에게는 자유로운 환경을, 운영팀에게는 엄격한 보안을 적용해야 하는데 하나의 계정에서는 이런 차별화된 정책 적용이 어렵다.

### 단일 계정 환경의 위험성

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d9a698622c7218c9c027de17e91888a3.png" alt="image" width="600" />


- **프로덕션 영향**: 비프로덕션 워크로드가 프로덕션 환경에 영향을 줄 수 있다. 
- **보안 위험**: 강화된 사용 권한과 워크로드 간 액세스 위험이 증가한다.
- **정책 복잡성**: 다양한 서비스 사용으로 인한 정책이 복잡해진다.
- **운영 복잡성**: 결제 구조 및 운영 지원이 복잡해진다.

AWS Well-Architected Framework에서도 이런 이유로 다중 계정 사용을 권장하고 있다. 각 계정은 자연스러운 보안 경계가 되어 장애나 보안 사고가 다른 환경으로 번지는 것을 막아준다.

## 랜딩존이란 무엇인가?

랜딩존은 비행기가 착륙하는 공간처럼, AWS 클라우드에서 워크로드들이 안전하게 '착륙'할 수 있는 기반 환경을 의미한다. 이는 단순히 계정을 여러 개 만드는 것이 아니라, 보안, 네트워킹, 로깅, 거버넌스 등이 모두 잘 설계된 다중 계정 환경을 말한다.

좋은 랜딩존은 새로운 팀이나 프로젝트가 들어와도 즉시 작업을 시작할 수 있도록 필요한 모든 기반 요소가 미리 준비되어 있다.

### 랜딩존의 구성 요소

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3b43642871bac03a9eba28638b7f4491.png" alt="image" width="600" />


- **다중 계정 아키텍처**: 계정별 역할 분리와 격리
- **거버넌스**: 정책 및 제어 관리를 통한 표준화 
- **보안**: 통합 자격 증명 관리와 접근 제어 
- **네트워킹**: 안전한 네트워크 연결과 트래픽 제어 
- **로깅**: 중앙 집중식 모니터링과 감사

## AWS Organizations

AWS Organizations는 여러 계정을 효율적으로 관리할 수 있게 해주는 서비스다. 이를 통해 계정들을 조직구조처럼 관리할 수 있다.

예를 들어, 한 회사에 개발팀, 운영팀, 보안팀이 있다면 각각에 맞는 OU(조직 단위)를 만들 수 있다. 개발 OU에는 여러 개발 계정들이, 운영 OU에는 운영 계정들이 들어간다.

### OU(Organization Unit) 구조

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a1f527f845fd5a754e8a83afd54a290a.png" alt="image" width="600" />


- **루트 OU**: 최상위 조직 단위로 모든 계정과 OU를 포함 
- **보안 OU**: 감사 계정과 로그 아카이브 계정을 포함 
- **프로덕션 OU**: 운영 환경 워크로드를 위한 계정들 
- **SDLC OU**: 개발, 테스트, 사전 프로덕션 환경 
- **샌드박스 OU**: 실험과 혁신을 위한 자유로운 환경

### 서비스 제어 정책(SCP)

서비스 제어 정책을 사용하면 각 OU별로 다른 정책을 적용할 수 있다. 개발 OU에서는 비용이 많이 드는 대형 인스턴스 생성을 막고, 운영 OU에서는 특정 리전 외의 리소스 생성을 금지하는 식으로 말이다.

통합 결제 기능으로 모든 계정의 비용을 한 곳에서 볼 수 있어 재무팀이 부서별 클라우드 사용량을 쉽게 파악할 수 있다.

## 네트워킹

다중 계정 환경에서는 네트워킹이 매우 중요하다. 각 계정이 독립적이지만, 필요할 때는 서로 통신할 수 있어야 하고, 온프레미스 환경과도 연결되어야 한다.

### 네트워킹 계정의 역할

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/efc71456a75cd09c56171478195548a8.png" alt="image" width="600" />

네트워킹 계정을 별도로 만들어서 허브 역할을 하도록 한다. 이 계정이 모든 네트워크 트래픽을 중앙에서 관리한다. AWS Transit Gateway를 사용하면 여러 VPC와 온프레미스 네트워크를 쉽게 연결할 수 있다.

### AWS 네트워킹 연결 옵션

- **AWS Direct Connect**: 온프레미스와 AWS 간의 전용 네트워크 연결 
- **AWS VPN**: 암호화된 터널을 통한 안전한 연결 
- **AWS Transit Gateway**: 대규모 네트워크 연결의 허브 역할 
- **VPC 피어링**: VPC 간 직접 연결 
- **AWS PrivateLink**: 프라이빗 연결 서비스

네트워크를 설계할 때는 IP 주소 범위가 겹치지 않도록 주의해야 한다. 각 계정의 VPC들이 서로 다른 CIDR 블록을 사용해야 나중에 연결할 때 문제가 생기지 않는다.

## IAM Identity Center

수십 개의 계정이 있을 때 각각에 별도로 로그인하는 것은 매우 불편하다. IAM Identity Center는 이 문제를 해결해준다.

### Single Sign-On

사용자들은 하나의 포털에 로그인하면 자신에게 권한이 있는 모든 계정에 접근할 수 있다. 개발자는 개발 계정들에, 운영자는 운영 계정에, 감사자는 읽기 전용으로 모든 계정에 접근하는 식으로 역할별로 다른 권한을 부여할 수 있다.

### 외부 IdP 연동

기존에 Active Directory나 다른 인증 시스템을 사용하고 있다면 이와 연동할 수도 있어 직원들이 기존 계정으로 AWS에 접근할 수 있다.

## 로깅과 감사

보안과 규정 준수를 위해서는 모든 활동을 기록하고 감시해야 한다. 하지만 계정이 많아지면 각각의 로그를 따로 관리하기 어려워진다.

### 로그 아카이브 계정

로그 아카이브 계정은 모든 계정의 로그를 한 곳에 모아준다. CloudTrail 로그(누가 언제 무엇을 했는지), Config 로그(리소스가 어떻게 변경되었는지), VPC 플로우 로그(네트워크 트래픽) 등이 모두 중앙의 S3 버킷에 저장된다.

### 감사 계정

감사 계정은 보안팀이나 감사팀이 사용하는 특별한 계정이다. 이 계정에서는 모든 다른 계정들을 읽기 전용으로 조회할 수 있어 보안 상태를 점검하고 문제가 없는지 확인할 수 있다.

## AWS Control Tower

이런 복잡한 랜딩존을 처음부터 직접 구축하는 것은 매우 어렵고 시간이 많이 걸린다. AWS Control Tower는 이 과정을 대폭 단순화해준다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3381f6b9c0ad98d3308ed6446e7a1c18.png" alt="image" width="600" />

### Control Tower의 이점

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/02fe858aacdc223dc87f95a7c1a7618a.png" alt="image" width="600" />

- **자동화 및 가속화**: 클릭 몇 번으로 잘 설계된 랜딩존이 자동으로 만들어진다. 
- **모범 사례 기반**: 기본 거버넌스 및 보안 정책이 적용된다. 
- **신속한 가치 창출**: 복잡한 설정 작업을 최소화한다. 
- **중앙 집중식 관리**: 통합 거버넌스 및 제어가 가능하다.

### Control Tower 프레임워크

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a7bb7849677fd68ffacffd345fd42ea9.png" alt="image" width="600" />

Control Tower를 실행하면 다음이 자동으로 설정된다.

- **조직 구조**: AWS Organizations OU 2개 (보안, 샌드박스) 
- **공유 계정**: 관리 계정, 로그 아카이브 계정, 감사 계정 생성 
- **보안 설정**: IAM Identity Center 디렉터리와 사전 구성된 그룹 
- **모니터링**: Amazon SNS 알림과 필수 제어 기능 
- **액세스 관리**: 계정 간 액세스 구성과 SSO 환경

## 제어(Controls): 자동 보안 관리

Control Tower의 핵심 기능 중 하나는 '제어'다. 이는 보안과 규정 준수를 자동으로 관리해주는 규칙들이다.

### 제어 동작 유형

**예방 제어**: 위험한 행동을 아예 막아준다. 예를 들어 특정 리전에서만 리소스를 생성할 수 있게 하거나, 암호화되지 않은 S3 버킷 생성을 금지한다.

**감지 제어**: 문제가 생겼을 때 알려준다. 누군가 MFA 없이 중요한 작업을 했거나, 보안 그룹이 잘못 설정되었을 때 알림을 보낸다.

**사전 예방 제어**: 리소스를 만들기 전에 미리 검증한다. CloudFormation으로 인프라를 배포할 때 보안 요구사항에 맞지 않으면 배포 자체를 중단시킨다.

### 제어 지침 범주

- **필수**: 기본 활성화되며 비활성화할 수 없다. 
- **적극 권장**: AWS에서 권장하는 제어 
- **선택**: 조직 요구사항에 따른 선택 적용

## Control Tower와 통합 서비스들

Control Tower는 여러 AWS 서비스를 조율하여 작동한다.

### Service Catalog & Account Factory

새로운 프로젝트나 팀이 생겼을 때 계정을 만드는 것도 Account Factory가 자동화해준다. 필요한 정보만 입력하면 보안 정책과 로깅 설정이 모두 적용된 계정이 몇 분 만에 생성된다.

한 번에 최대 5개까지 계정을 만들 수 있어 대규모 조직에서도 효율적으로 계정을 관리할 수 있다.

### 기타 통합 서비스

- **AWS Config**: 모든 리소스의 변경 사항을 추적하여 언제 누가 무엇을 바꿨는지 알 수 있게 한다.
- **CloudFormation**: 인프라를 코드로 관리하여 일관성 있는 환경을 만든다. 
- **CloudWatch**: 성능을 모니터링하고 문제가 생겼을 때 알림을 보낸다. 
- **CloudTrail**: 모든 API 호출을 기록하여 보안 감사에 필요한 증거를 제공한다.

## 마무리

AWS Control Tower를 사용하면 복잡한 다중 계정 환경을 쉽고 안전하게 구축할 수 있다. 초기 설정은 자동화되지만, 조직의 성장에 따라 계속 확장하고 조정할 수 있는 유연성도 제공한다.

랜딩존 구축은 단순한 기술적 프로젝트가 아니라 조직의 클라우드 여정에서 가장 중요한 기반이다. 잘 설계된 랜딩존은 보안, 규정 준수, 운영 효율성을 모두 향상시키면서도 개발팀의 생산성을 높여준다.

Control Tower와 관련 서비스들을 이해하고 체계적으로 접근한다면, 확장 가능하고 안전한 AWS 환경을 구축할 수 있을 것이다.