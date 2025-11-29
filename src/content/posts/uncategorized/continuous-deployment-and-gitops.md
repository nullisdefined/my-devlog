---
title: "Continuous Deployment and GitOps"
slug: "continuous-deployment-and-gitops"
date: 2025-07-16
tags: []
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/59cbb48ed0629045b0ec0196e325dbbb.png"
draft: true
views: 0
---
실습환경 아키텍처

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/59cbb48ed0629045b0ec0196e325dbbb.png" alt="image" width="600" />

_위 다이어그램은 두 개의 파이프라인 생성과 관련된 이 실습의 아키텍처를 보여줍니다. 첫 번째 파이프라인은 AWS CodeCommit, Jenkins 및 Amazon ECR를 사용하여 컨테이너 이미지를 빌드하고 저장합니다. 두 번째 파이프라인은 AWS CodeCommit, Argo CD 및 Amazon EKS를 사용하여 컨테이너 이미지를 Amazon EKS 클러스터에 지속적으로 배포합니다._

다음은 이 실습을 위해 미리 프로비저닝된 다이어그램 속 주요 리소스에 대한 설명입니다.

- Amazon EKS 클러스터 및 관리형 노드 그룹
- Kubernetes 애플리케이션용 샘플 Alpine 기반 NGINX 이미지를 저장하기 위한 Amazon ECR 리포지토리


AWS CodeCommit

AWS CodeCommit은 클라우드에서 assets(문서, 소스 코드, 바이너리 파일 등)을 비공개로 저장하고 관리하는 데 사용할 수 있는 Amazon Web Services(AWS)의 버전 제어 서비스

이 실습에서는 두 개의 CodeCommit 레포지토리를 생성함 첫 번째 리포지토리는 Dockerfile, Jenkinsfile 및 애플리케이션 코드를 저장하고 두 번째 레포지토리는 Argo가 Amazon EKS 클러스터에 배포하는 Kubernetes 매니페스트 파일을 저장함

codecommit 레포지토리 두개 생성

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3b1ef3741ebdd3f2b3d7efad0452516e.png" alt="image" width="600" />


<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1b4f3d13676475bc9e3cc43e155c6666.png" alt="image" width="600" />


실습용 배스천 호스트에 연결

-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABFwAAAAdzc2gtcn
NhAAAAAwEAAQAAAQEAhBbmoFKOIbt+MqDtvHRlCAPtVo4j9va8JCybHL2hI/wWDPohTZd5
DGuSbgRQI2Eyalc8B3HS4C/qt3AHUOCoF0qM+i8I5VLTNEi9LstGmZF3OIHMD2CSaMBMm3
Fc2Nw4Dpj3Umt0KlUo+Da1G7DY9V0qTJfIHpH7TQjFoYwuEni5HzD3HD61MwNQasN2sIWk
bTJw6pptpZOAbucEE2UHkxX1NgJBF6AyvXEZQUfYxBBDGu7VjL/AOn1R6vQ4vk/zlSUrdQ
lYYVEO5wyu90fNNUdLwdmbdyUjCaak0O/vs1HX6BBERXQA3jZvJmRcCBKs7onFm+ngm/QJ
QVVUWv4qQQAAA/AeGyTnHhsk5wAAAAdzc2gtcnNhAAABAQCEFuagUo4hu34yoO28dGUIA+
1WjiP29rwkLJscvaEj/BYM+iFNl3kMa5JuBFAjYTJqVzwHcdLgL+q3cAdQ4KgXSoz6Lwjl
UtM0SL0uy0aZkXc4gcwPYJJowEybcVzY3DgOmPdSa3QqVSj4NrUbsNj1XSpMl8gekftNCM
WhjC4SeLkfMPccPrUzA1Bqw3awhaRtMnDqmm2lk4Bu5wQTZQeTFfU2AkEXoDK9cRlBR9jE
EEMa7tWMv8A6fVHq9Di+T/OVJSt1CVhhUQ7nDK73R801R0vB2Zt3JSMJpqTQ7++zUdfoEE
RFdADeNm8mZFwIEqzuicWb6eCb9AlBVVRa/ipBAAAAAwEAAQAAAQApeMk7QABJHgV+3uEV
oNPRwu3jFai8Eva6QtkGmpE765t+wo/vPSYv3Jxyd18z5IIAOlhqG/YyFklTA9UAMzEDcx
A1Qsw/uBQA3++p//+wGqh8cOBBWbhONEY5LcwReH8PMj7AvWURH4DIAeE2Cv3rd69ese8O
jhYBN0ZZtNoISTSYGnhVv7QOguCeeStaPDi3TSJEztSXm1gALM1Zk+FDDHHFOMkS2/fKFJ
lm6hFyySMF5JKfvyVK9HEOjADGsYC8/k/SXoitlvepjvgs44cw4eeClKcw1Jussfudlx4I
xJAirFM5n4NLGTTwsWYwX3MCFCTmlCRG9qzh+asRQk7jAAAAgGh1LvLUymfB+JMVd+e0MQ
k7T912gEFomvmiEF/ZtrcBuAC5eoEP7pB1+HTd7lhIrqZLqb3i8BZWGcXH4PZari9b/9Pp
WLUEut5o89yAbmef2HdpoTt7I5azz+ollL5Q4NNJXdwkzoUi0Xv1oyPc2SNCzMRDExroKK
YucseYWH22AAAAgQC5ubpT9cdyQbwZjAezdSBcuv+m7atyYFaQHKVfHTqgcmc+GYWGGW7M
wgg+WJi0v+bEI1Iqnhw8YTTqFXo4g3jftppKRyqt3SB4sboC4Mr88irC9vDAL/49/qiUrf
pss7B24sZ4ilQWziieHbpLD5f2DEk0zWU8QTUU7G909NYb5wAAAIEAthG51xWFLfnh2Lpe
tArS1U22FP3YwzEVdGerpQThhFwM17/JLD0gjQdazYP/FzdFLJeuejIBZBWtNJtOYJ3x1w
GSERnib2sUzujYGmN9rV1+AfWZo5DOsQWSf0sK0ObTyVODj/nFL8U2fj5zTQJjHuyp62O9
Tty76H99iFKgA5cAAAA0cm9vdEBpcC0xMC0xMC0xOS0yMzQuYXAtc291dGhlYXN0LTIuY2
9tcHV0ZS5pbnRlcm5hbAECAwQFBgc=
-----END OPENSSH PRIVATE KEY-----

_gitUser_에 대해 생성된 SSH 키를 검토했고 해당 사용자가 이 키를 사용하여 CodeCommit 리포지토리에 인증할 수 있음을 확인했습니다. 또한 _ecrUser_라는 두 번째 IAM 사용자에 대해 액세스 키가 생성된 것도 확인했습니다.

cd ~/appcode && ls


cat Jenkinsfile해보면
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9e2273092cc93d3ecafc81029dc39304.png" alt="image" width="700" />

이렇게 나오는데
파이프라인은 4개 단계를 거치는것을 알수있고

- _Clone repository_ 단계에서는 **checkout scm** 명령을 사용하여 AWS CodeCommit에 인증하고 애플리케이션 코드를 Jenkins 작업 공간의 임시 디렉터리에 복제
- _Build image_ 단계에서는 Docker를 사용하여 새 _eks-gitops-demo_ 컨테이너 이미지를 빌드
- 모범 사례로 이미지를 리포지토리에 푸시하기 전에 자동화된 단위 테스트를 수행하는 것이 가장 좋은데 단위 테스트가 실패할 경우 파이프라인이 정상적으로 실패해야 하고 이미지가 리포지토리에 추가되면 안 되고 그러나 이 실습에서는 콘솔에 _Tests passed_를 출력하는 간단한 스크립트만 실행함
- 마지막으로, _Push image_ 단계에서는 [Jenkins용 Amazon ECR 플러그 인](https://plugins.jenkins.io/amazon-ecr/)을 사용하여 테스트된 이미지를 ECR에 푸시함 이미지에는 Git SHA 및 _latest_ 태그가 지정되고. 계층이 재사용되므로 여러 태그를 푸시하는 것이 저렴함

이 워크플로는 다음을 보장

- 이미지가 최신 코드에서 빌드됨
- 자동화된 테스트가 이미지의 유효성을 검사함
- 테스트가 통과한 경우에만 이미지가 ECR로 푸시됨

 _Push image_ 단계에서 _Amazon ECR URL_ 및 _ecrUser_ 자격 증명에 자리 표시자 텍스트가 포함되어 있는데 이들 값을 본인의 계정 ID 및 AWS 리전으로 바꿔야 함

Jenkinsfile을 본인의 계정 ID 및 AWS 리전으로 업데이트하기 위해 다음 명령을 입력함

다음으로 Dockerfile을 보면
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/90021ac828d9b7e9fa2dfa09929b3e0b.png" alt="image" width="300" />

_nginx_를 사용하여 기본적인 Hello World 애플리케이션을 빌드하는 간단한 Dockerfile

- _FROM_: 새 이미지를 빌드할 기본 이미지를 지정하는 데 사용됨
- _RUN_: Docker 이미지 빌드 프로세스 중에 명령과 셸 스크립트를 실행하는 데 사용됨
- _ADD_: 호스트 시스템의 파일을 Docker 이미지로 복사하는 데 사용됨

Git config을 업데이트

```
git config --global user.email "eks@example.com"
git config --global user.name "ekscourse"
git config --global init.defaultBranch main
```

codeapp에서 git init 하고

```
git add .
git commit -m "initial commit"
git push --set-upstream ssh://git-codecommit.$AWS_REGION.amazonaws.com/v1/repos/AppCodeRepo main

```

codecommit 레포지토리로 push

Jenkins 자동화 서버에 로그인하고 SSH 및 액세스 키를 사용하여 자격 증명을 생성
또한 AppCodeRepo CodeCommit 레포지토리를 모니터링하고 새 코드가 리포지토리에 커밋될 때마다 새 컨테이너 이미지를 빌드하는 파이프라인을 생성

Jenkins 서버에 로그인하려면 AWS Secrets Manager에서 로그인 자격 증명을 가져와야 함

배스천 호스트 세션에서 Jenkins 자격 증명을 검색하기 위해 다음 명령을 입력

```
aws secretsmanager get-secret-value --secret-id JenkinsPassword --query SecretString --output text | tr -d '{}' | tr -d '"' | sed 's/:/: /g' | awk -F, '{print $1"\n"$2}'
```

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/971521ad7a22b09b6d7cba375cf90084.png" alt="image" width="700" />

이제 Jenkins 사용자에게 자격 증명을 할당하고, AWS CodeCommit 내의 애플리케이션 코드를 사용하는 파이프라인을 생성하여 컨테이너 이미지를 빌드하고, 애플리케이션 이미지를 Amazon ECR에 푸시

Manage Jenkins 선택

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d804a3d122a040dbb0e0fd345c868b4e.png" alt="image" width="700" />

credentials

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/d9849d49f49a74e4e984aedde560f8a5.png" alt="image" width="700" />
자격증명이 없음

두 개의 IAM 자격 증명을 사용하여 자격 증명을 구성 
gitUser는 SSH 키를 사용하고 Jenkins가 AWS CodeCommit에 인증하도록 허용
ecrUser는 액세스 키를 사용하고 Amazon ECR에 대한 액세스 권한 부여

Global credentials (unrestricted) 페이지에서 + Add Credentials를 선택
    New credentials 페이지에서 다음을 구성
    

SSH Username with private key

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/55adfb7d25160c364ca0b1d3670a664b.png" alt="image" width="700" />

이제 액세스 키를 사용하여 _ecrUser_에 대해 이 프로세스를 반복합니다.

41. **Global credentials (unrestricted)** 페이지에서 **+ Add Credentials**를 선택합니다.
    
42. **New credentials** 페이지에서 다음을 구성합니다.
    

- **Kind** 드롭다운 목록에서 **AWS Credentials**를 선택합니다.
- **ID** 필드에 
    
    ecrUser
    
    를 입력합니다.
- **Description** 필드에 
    
    Access keys for Amazon ECR authentication
    
    을 입력합니다.
-  **복사 편집:** 지침 왼쪽에 있는 패널에서 **EcrUserAccessKey**의 값을 복사하여 **Access Key ID** 필드에 붙여넣습니다.
-  **복사 편집:** 지침 왼쪽에 있는 패널에서 **EcrUserSecretAccessKey**의 값을 복사하여 **Secret Access Key** 필드에 붙여넣습니다.

43. **Create**를 선택하여 자격 증명을 저장합니다.


이제 자격 증명을 생성했으므로 파이프라인을 빌드할 차례입니다.

44. 화면 상단의 브레드크럼 메뉴에서 **Dashboard**를 선택합니다.
    
45. 페이지 왼쪽의 탐색 창에서 **New Item**을 선택합니다.
    
46. **Enter an item name** 텍스트 상자에 
    
    JenkinsPipeline
    
    을 입력합니다.
    
47. 옵션 목록에서 **Pipeline**을 선택한 다음, 화면 하단에서 **OK**를 선택합니다.
    

그러면 Pipeline configuration 페이지로 이동합니다. 다음 단계에서는 파이프라인에 대한 소스 제어 관리(SCM)를 구성하고, SCM이 AWS CodeCommit 리포지토리를 가리키도록 하고, 앞서 생성한 SSH 키를 사용하여 Jenkins가 AWS CodeCommit에 인증할 수 있도록 합니다.