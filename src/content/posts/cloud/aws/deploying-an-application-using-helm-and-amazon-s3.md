---
title: "Deploying an Application Using Helm and Amazon S3"
slug: "deploying-an-application-using-helm-and-amazon-s3"
date: 2025-07-16
tags: ["AWS", "EKS", "Helm", "S3"]
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fcda16913825d982c9b11245b536ff7e.png"
draft: true
views: 0
---
Helm = Kubernetes에서의 npm
Helm Chart = npm 패키지
Helm Repository = npm Registry 패키지 저장소
helm install <차트> = npm install <패키지>
helm package <디렉터리> = npm pack / npm publish

실습에서는 s3를 helm chart저장소인 helm repository로 사용함




<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fcda16913825d982c9b11245b536ff7e.png" alt="image" width="700" />
실습 환경 아키텍처

```
curl -sSL https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
```

배스천 호스트란 퍼블릭 인터넷에 연결되어있으면서, 내부 프라이빗 네트워크의 리소스에 접근할 수 있도록 중계해주는 점프 서버
배스천(bastion) 호스트 ec2에 helm을 먼저 설치해주고

helm-s3 플러그인 설치

```
helm plugin install https://github.com/hypnoglow/helm-s3.git
```

호스팅된 Helm 리포지토리를 위한 Amazon S3 버킷이 미리 생성되었으며 해당 이름이 환경 변수로 배스천 호스트에 저장되어 있음

```
echo "Configuring $S3_BUCKET_NAME as a private Helm repository..."
helm s3 init s3://$S3_BUCKET_NAME

```

버킷을 Helm 클라이언트용 차트 리포지토리로 추가

```
helm repo add productcatalog s3://$S3_BUCKET_NAME
```

Helm 및 Helm-S3 플러그 인_을 설치하고 S3 버킷을을 Helm 리포지토리로 초기화함

깃허브에서 helm 차트 clone해옴

helm 차트 디렉터리 구조 보기

```
cd eks-app-mesh-polyglot-demo/workshop
printf "The chart contains the following directory structure and files...\n \n" && tree helm-chart/

```

- _Chart.yaml:_ 차트에 대한 정보가 들어 있는 YAML 파일
- _productcatalog_workshop-1.0.0.tgz_: Kubernetes 클러스터에 적용할 수 있는 버전이 지정된 차트 아카이브
- _security/_: Pod 보안 그룹에 대한 매니페스트가 포함된 디렉터리
- _templates/:_ 값과 결합되면 유효한 Kubernetes 매니페스트 파일을 생성하는 템플릿의 디렉터리
- _templates/NOTES.txt:_ 선택 사항: 간단한 사용 노트가 포함된 일반 텍스트 파일
- _values.yaml:_ 기본 구성 값을 정의하는 일련의 YAML 파일

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9fba6de8e92722370d0a031dad9a09dc.png" alt="image" width="700" />

```
helm package helm-chart/
```

package화

```
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=$(aws configure get region)
sed -i "s|public.ecr.aws/[^/]*/eks-workshop-demo|${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/eks-workshop-demo|g" ./helm-chart/values.yaml

```

s3에 push

```

helm s3 push ./productcatalog_workshop-1.0.0.tgz productcatalog
```


<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2b321ee4a5c5ed0d8d4a61c8481007bb.png" alt="image" width="500" />

잘올라감을 확인


 S3 버킷에 저장된 Helm 차트의 버전 수를 확인
 
```
helm search repo
```

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e32c63145139ac7f134019e35afcced2.png" alt="image" width="700" />


```
helm install productcatalog s3://$S3_BUCKET_NAME/productcatalog_workshop-1.0.0.tgz --version 1.0.0 --dry-run --debug
```

dry run은 실제로 설치하지않음 설치전에 확인하는거

여기서 명령이 _–dry-run_ 및 _–debug_ 플래그를 사용하는 것을 볼 수 있습니다. 이러한 플래그를 사용하면 Kubernetes API 서버에 연결하여 차트를 검증 및 확인할 수 있습니다. 다음은 이 명령 및 그 안에 포함된 인수에 대한 설명입니다.

- _productcatalog_: 이 설치에 부여하는 릴리스 이름입니다.
- _s3://$S3_BUCKET_NAME/productcatalog_workshop-1.0.0.tgz_: S3 버킷 리포지토리에서 차트 아카이브의 위치를 지정합니다.
- _–version 1.0.0_: 설치할 차트 버전을 1.0.0으로 고정합니다.
- _–dry-run_: Helm에게 차트를 검증하고 실제로 배포하지 않고 리소스 매니페스트를 생성하도록 지시합니다.
- _–debug_: 설치 프로세스에 대한 자세한 디버깅 정보를 출력합니다.


helm차트설치

```
helm install productcatalog s3://$S3_BUCKET_NAME/productcatalog_workshop-1.0.0.tgz --version 1.0.0
```

차트가 배포한 리소스를 나열

```
kubectl get pod,svc,deploy -n workshop -o name
```

차트는 애플리케이션의 frontend, productcatalog, productdetail 구성 요소를 나타내는 3개의 pod, 3개의 service 및 3개의 deployment를 설치

```
FRONTEND_URL=http://$(kubectl get svc -n workshop frontend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo "The URL pointing to the frontend is: $FRONTEND_URL"
```

url 접속
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/709be4edf24c7eefac2b6cfa8b98f508.png" alt="image" width="700" />
values.yaml 파일을 편집한 다음 Helm 차트 애플리케이션을 업그레이드
그런 다음 변경 사항을 롤백할 때 어떻게 새 Pod가 배포되고 나중에 종료되는지 관찰

```
cd /home/ssm-user/eks-app-mesh-polyglot-demo/workshop/helm-chart
sed -i "s/replicaCount:.*/replicaCount: 3/g" values.yaml
```

```
helm upgrade productcatalog /home/ssm-user/eks-app-mesh-polyglot-demo/workshop/helm-chart/
```

이 명령으로 릴리스를 새 버전의 차트로 업그레이드하고 이전 단계에서 values.yaml 파일에 적용된 최신 변경 사항을 사용하여 애플리케이션을 다시 배포

이제 새 pod가 어떻게 시작되는지 관찰
```
kubectl get pod -n workshop
```

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4b37ce605736fe277796fd64086204ac.png" alt="image" width="500" />

```
helm rollback productcatalog 1
```

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/516a8d30ac8a61f36dc4cfdae64e92c2.png" alt="image" width="600" />

terminating이 진행되고 1개의 pod만 남게된다

롤백이된것을 확인했다