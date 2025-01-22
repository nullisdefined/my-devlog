---
title: "[Git] Branch"
slug: "git-branch"
date: 2025-01-08
tags: ["Git", "Branch"]
category: "Git"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/d37ba7b75f9d2f6f46456346d75b8b1e.png"
draft: false
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/d37ba7b75f9d2f6f46456346d75b8b1e.png)

Git은 Branch를 통해 독립적인 작업 공간을 생성하고 관리한다. Branch의 내부 동작 원리를 이해하기 위해 Branch가 무엇인지, 그리고 어떻게 동작하는지 살펴보았다.

## Branch란?

Branch는 특정 Commit을 가리키는 포인터다. Git은 Branch를 41bytes의 파일로 관리하는데, 40bytes는 SHA-1 해시값이고 1byte는 개행문자다. Branch 파일에는 단순히 현재 가리키고 있는 Commit의 해시값만 저장되어 있다.

### Branch 종류와 용도

- **Main(Master) Branch**
    - 제품으로 출시될 수 있는 안정적인 코드를 보관
    - 배포 가능한 상태만을 관리
- **Feature Branch**
    - 기능 개발을 위한 Branch
    - 기능 개발이 완료되면 Develop Branch로 병합
- **Develop Branch**
    - 다음 출시 버전을 개발하는 Branch
    - 기능 개발이 완료된 코드가 모이는 곳
- **Release Branch**
    - 출시 준비를 위한 Branch
    - 버그 수정과 문서 작업을 진행
- **Hotfix Branch**
    - 출시 버전에서 발생한 버그를 수정하는 Branch
    - 긴급하게 수정이 필요한 경우 사용

### Remote Branch

원격 Branch는 `.git/refs/remotes/<remote name>` 디렉터리에 저장되며, 로컬 Branch와 마찬가지로 Commit의 해시값을 저장한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/4ed9961ae9a6ddfaaeb38101b3c20c2c.png)

원격 Branch는 읽기 전용 포인터다. 원격 Branch는 `git fetch` 명령어로 업데이트되며, 직접 Checkout해서 작업할 수 없다.


### Branch 주요 특징

#### 1. Branch는 단순히 포인터다

브랜치는 `.git/refs/heads` 디렉터리에 저장되며, 새로운 Comit이 생성될 때마다 Branch 파일의 내용(해시값)이 자동으로 갱신된다.

예를 들어, `new-branch` 브랜치는 `.git/refs/heads/new-branch` 피일에 저장되어 있으며 다음과 같이 확인할 수 있다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/2815b9c03865ea7435c096ae158375f3.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/f88c158c86fe6ab11d20fce41d91fb51.png)

이는 가장 최근 Commit의 해시값일 것이다. Commit을 확인해보면

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/78809fe6043c6ef1d4e8a38d350cfbba.png)

초기 Commit으로 해시값이 일치함을 확인할 수 있었다.

#### 2. HEAD 포인터

Git은 현재 작업 중인 Branch를 추적하기 위해 HEAD라는 특수한 포인터를 사용한다. HEAD는 `.git/HEAD` 파일에 저장되며, 현재 Checkout된 Branch나 Commit을 가리킨다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/d82eb3cec93ee09acd8d0e91641a3a68.png)

#### 3. Branch 생성 및 전환

Branch를 생성하면 Git은 현재 HEAD가 가리키는 Commit의 해시값을 가진 새로운 Branch를 생성한다. Branch를 전환하면 HEAD가 새로운 Branch를 가리키도록 변경되고, 작업 디렉터리의 파일들이 해당 Branch의 상태로 변경된다.

Branch 전환 후 HEAD 포인터의 내용을 확인해보면 다음과 같다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/dc10b1b898f20cd872ffea11b8c3b637.png)

## 마무리

Git의 Branch는 단순히 포인터다. Branch의 생성과 전환은 실제로는 포인터를 조작하는 것에 불과하지만, Branch 덕분에 독립적인 작업 공간을 효율적으로 관리할 수가 있다.