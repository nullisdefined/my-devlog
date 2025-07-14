---
title: "6. Migrate a Monolith Web Application to AWS Using Application Migration Service (한국어)"
slug: "6-migrate-a-monolith-web-application-to-aws-using-application-migration-service-한국어"
date: 2025-07-09
tags: []
category: "Cloud/AWS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7180c1db3d81077ccfedc1dd46f1c8af.png"
draft: true
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7180c1db3d81077ccfedc1dd46f1c8af.png)
새 브라우저 탭에서 위 URL을 열면 "Table 'inventory.inventory' doesn't exist" 메시지가 표시

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/db7c5f8e07fcae123a0736052ec3a936.png)
setting 들어간 모습
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/138bf3e3c5d71da2758a40a9462997b6.png)
setting save하면 이렇게 보임

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/97d82afefa0b0c185d6467ec215beeaf.png)
아이템 추가했다

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6f722cce79f0112629d91f8f8e47d884.png)
두개의 ec2 인스턴스가 돌아가고있고

실습 단계 전체에서 **SOURCE** 리전(오레곤)과 **TARGET** 리전(버지니아 북부) 모두에서 AWS Management Console의 서로 다른 페이지 사이를 탐색

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ff6987368b18f47ab4bf8c200c8478e6.png)
타겟의 ams에서 set up service

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/71ffb60568c38623a6f6e08c14bd7f5d.png)
replication server 설정

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b0ebb0f5187771e8869c1f57ac605d8b.png)
소스 애플리케이션 서버에 들어가서
aws-replication-installer 프로그램을 설치하고 실행한다
아무래도 모든 디스크를 복제하려다보니 시간이 5분?정도 좀 걸렸다

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b74e356ed176a4d9126dd22a65275c27.png)
끝났고

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/dd68193a62fb445e397156041d820357.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/76d83967a0c9e7576bdd0a02f67158d1.png)

Application Migration Service → Source servers 소스 서버 이름 클릭해보니
아직 시작이 안됐다

이것도 조금만 기다려보면

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8c3b75cdd71cef36ee0676f4ac4f5f17.png)
이렇게 바꼈다

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6d46a1d808263e1b9f1d1b2ea9ab225a.png)
launch setting에서 instance type right sizing을 off로 바꿔줌

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c3ab7f505065927f87f33bba9cce4f22.png)

network setting

그리고 - **Resource tags**: Name을 **TargetWebApp**으로 변경
- **IAM instance profile**: Target-WebApp-Instance-Profile
- **User data** 스크립트 추가함


![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/cfcd7b2112bf34eaeee1eaca73213060.png)

마이그레이션 대시보드에서 26분정도 기다리니 ready for testing 상태가 되었음

- **Test and cutover** → **Launch test instances**
- **Launch** 클릭
- 수명 주기가 **Test in progress**로 변경 확인

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2b889a8c840f901d17f998fdcab67066.png)


![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/63a07b1124e53891480a36b5afe83bcb.png)

테스트 인스턴스가 생성됨

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e7a74d4b88650e5b122a658a0b6b5728.png)
mark as ready for cutover

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a8f52aded8751d44ad58959b35844fbf.png)

create source endpoint

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6ba45b16d240d50cb51f8cb62c846e80.png)

target endpoint

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/725adb25aa36210e6d5374ec912f7009.png)

태스크 생성, 그리고 시작

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2407bea80fd65fcb66da9b8ac94a845d.png)
웹서버 마이그레이션 완료
Cutover finalized