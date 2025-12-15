---
title: "Introduction to AWS Database Migration Service"
slug: "introduction-to-aws-database-migration-service"
date: 2025-07-11
tags: ["AWS", "Database", "Migration", "DMS", "MySQL", "Aurora"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/159e9a38bcb2893d4560150f3d10548f.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/159e9a38bcb2893d4560150f3d10548f.png)

## 실습 개요
AWS Database Migration Service (DMS)를 사용하여 EC2 인스턴스의 MySQL 데이터베이스에서 Amazon Aurora RDS 인스턴스로 데이터를 마이그레이션하는 과정을 진행했다. 실제 운영 환경에서 자주 발생하는 데이터베이스 마이그레이션 시나리오를 직접 체험해볼 수 있어 유익한 실습이었다.

## 실습 환경 구성

### EC2 인스턴스 연결
AWS Systems Manager Fleet Manager를 통해 Windows EC2 인스턴스에 원격 데스크톱으로 연결했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a33cff24185964921271ac4f0db834e3.png)*관리형 노드 리스트에서 Lab Instance 확인*
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a91740db81e09797be244d90e7f0bab8.png)*RDP 연결 설정*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/82d5946a78fc5f053e51cc597402ca34.png)*Windows 인스턴스 연결 완료*

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2e938f025463346c27a049f7125c511f.png" alt="image" width="600" />*MySQL Connector/Net 설치*

## MySQL 소스 데이터베이스 설정

### MySQL 설치 및 구성
먼저 소스 데이터베이스 역할을 할 MySQL을 설치했다.
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b1c642216900c6e3bacf7aa187b6530e.png" alt="image" width="600" />*MySQL Server 설치*

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6832299fcc1dffdcec51a3912204866e.png" alt="image" width="600" />*MySQL Server Custom Install 선택 > 필요한 컴포넌트 선택*

다음 컴포넌트들을 설치했다.

- MySQL Server 8.0.37 - X64
- MySQL Workbench - 8.0.36 - X64

### 데이터베이스 생성 및 데이터 로드
MySQL 설치 후 admin 사용자를 생성하고 mydb 데이터베이스를 생성했다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/26b5e172d44c7a9b36b9b4bc7eda6f45.png" alt="image" width="600" />

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8016174718a75c638c739d757a42e6f5.png)*CREATE DATABASE mydb 실행*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/399056f215f3b5b6260c11e14965af42.png)*Server > Data Import를 통한 데이터 가져오기*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b527d994ab948308c9f603f8d75d690e.png)*dumps 폴더에서 데이터 임포트*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/53cd8f99f14decaea08b470d4b57d18b.png)*소스 데이터 확인*

## Aurora 대상 데이터베이스 연결
Aurora 데이터베이스에 연결하기 위해 클러스터 엔드포인트를 텍스트 파일로 저장했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5d4f6839f8ce73e09711f20005cf3474.png)*ClusterEndpoint 정보를 텍스트 파일로 저장*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d605a54fbd4b52ce0f94d486123faebf.png)*Aurora Test Connection*

MySQL Workbench에서 Aurora 인스턴스로의 연결이 되었고, 당연히 아직은 mydb에 데이터가 없다.

## AWS DMS 설정

### 복제 인스턴스 생성
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/891d77bc87a26caa6bd7aa1ca6b0ebaf.png)*복제 인스턴스 기본 설정*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/33031b6995d26008f02103852ec5739f.png)*네트워크 및 보안 설정*

복제 인스턴스 생성 과정에서 이슈가 있었는데,

1. ReplicationSubnetGroupDescription 오류
2. 복제 서브넷 그룹 존재하지 않음
3. IAM 권한 문제

실습 환경의 권한 제한으로 오류가 계속해서 발생하였고 복제 인스턴스 생성에 어려움이 있었다.
아래 엔드포인트 생성 과정은 학습할 수 있었다.
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a7927b2610d5ecd6a58f63469ce22f03.png" alt="image" width="500" />*MySQL 소스 엔드포인트 설정*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7ea8dd1877e92f31c3d8d2326491e9a0.png)*Aurora 대상 엔드포인트 설정*

## 실습 확인 퀴즈들

### Q1
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f8ee5e7019f40fa6114c93cfeeebf421.png" alt="image" width="500" />

AWS Database Migration Service에서 소스 데이터베이스, 대상 데이터베이스, 마이그레이션 설정을 정의하는 구성 요소는 Migration task이다.

**Migration task**는 DMS 구성 요소 중 하나로 다음을 정의한다.

- **소스 엔드포인트**: 어디서 데이터를 가져올지
- **대상 엔드포인트**: 어디로 데이터를 보낼지
- **마이그레이션 설정**: 어떻게 마이그레이션을 수행할지 (전체 로드, CDC, 테이블 매핑 등)

다른 옵션들의 역할은 다음과 같다.

- **Replication instance**: 마이그레이션 작업을 실행하는 컴퓨팅 리소스
- **Endpoint**: 개별 데이터베이스 연결 정보만 정의 (소스 또는 대상 중 하나)
- **Subnet group**: 네트워크 설정을 위한 서브넷 그룹

### Q2
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0047bd615c7690496e4a5df905195a75.png" alt="image" width="500" />

AWS Systems Manager Fleet Manager를 사용하여 EC2 인스턴스에 연결하기 전에 필요한 단계는 Download the PEM key file이다.

Fleet Manager에서 RDP 연결을 할 때 인증을 위해 PEM 키 파일이 필요하다.

다른 옵션들이 정답이 아닌 이유는
- **Install a third-party RDP client**: Fleet Manager는 브라우저 기반 RDP를 제공하므로 별도 클라이언트 설치가 불필요
- **Configure a VPN connection**: Fleet Manager는 AWS 콘솔을 통해 직접 연결되므로 VPN 설정이 불필요
- **Enable public IP addressing**: Fleet Manager는 프라이빗 네트워크를 통해 연결되므로 퍼블릭 IP가 필요하지 않음

### Q3
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fa674bfd8fc7c30a891ecb74e217196f.png" alt="image" width="500" />

MySQL에서 Aurora로 사용자 액세스가 제대로 마이그레이션되었는지 확인하기 위해 검사해야 할 항목은 User accounts and permissions이다.

마이그레이션에서 중요한 것 중 하나는 사용자 계정과 권한이 올바르게 이전되었는지 확인하는 것이다. 이유는 다음과 같다.

- **사용자 계정**: 기존 MySQL의 모든 사용자가 Aurora에도 생성되었는지
- **권한 설정**: 각 사용자의 테이블별, 데이터베이스별 권한이 동일하게 설정되었는지
- **역할 및 그룹**: 사용자 그룹이나 역할이 적절히 매핑되었는지
- **접근 제어**: 애플리케이션이 새로운 데이터베이스에 정상적으로 접근할 수 있는지

다른 옵션들이 정답이 아닌 이유는

- **동시 연결 수**: 성능 관련 설정이지만 마이그레이션 검증의 핵심은 아님
- **데이터베이스 크기**: 데이터 마이그레이션 여부는 확인하지만 사용자 액세스와는 무관
- **데이터베이스 엔진 버전**: 호환성 확인이지만 사용자 액세스 검증과는 다름

### Q4
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/368d25e487681b78c2bc282e4b0d0cbb.png" alt="image" width="500" />


MySQL Workbench를 사용하여 Amazon Aurora 인스턴스에 연결하기 위해 필요한 것은 The instance endpoint이다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b40652a6fffa7a473ee99236290c164b.png)

MySQL 데이터베이스에 데이터가 성공적으로 임포트되었는지 확인하는 올바른 방법은 Run a SELECT query on the imported table 해보는 것이다.

## 마치며
**DMS 아키텍처 이해**: 복제 인스턴스, 소스/대상 엔드포인트, 마이그레이션 태스크의 관계를 파악할 수 있었다.
마이그레이션에서 네트워크, 보안, 권한 등 여러 요소를 고려해야 함을 알았다.
실제 프로덕션 환경에서 DMS가 다음과 같은 가치를 제공함을 알았다.

1. **Change Data Capture(CDC)**: 초기 전체 로드 후 실시간 변경사항 동기화를 통해 다운타임을 최소화한다
2. **동종/이종 마이그레이션 지원**: MySQL to Aurora 뿐만아니라 드롭다운으로 실제 지원하는 데이터베이스가 많음을 확인할 수 있었다
3. **데이터 무결성**: 자동으로 확인하여 안전한 마이그레이션을 보장한다

실습에서 마지막에 에러사항이 없었다면 이러한 부분들까지도 구체적으로 알 수 있었을 텐데 하는 아쉬움은 조금 있다.
비록 마이그레이션 전체 프로세스는 실습환경의 권한제한으로 완료하지는 못했지만, AWS DMS의 구조와 설정 방법을 이해할 수 있었다.