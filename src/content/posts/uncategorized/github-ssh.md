---
title: "Github SSH 인증"
slug: "github-ssh"
date: 2024-12-21
tags: ["Github", "SSH", "Cygwin"]
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/52ee5a5d97fb23f80377457b239c5807.png"
draft: false
views: 0
---
Git Bash를 사용하다가 좀 더 다양한 Linux 도구들을 사용하고 싶어서 Cygwin을 사용하게 되었다. 새로운 Cygwin 터미널 환경에서 git push를 하려는데 인증 오류가 발생했다. 
```shell
remote: No anonymous write access.
fatal: Authentication failed for 'https://github.com/nullisdefined/nullisdefined.github.io.git/'
```
기존 터미널에서는 자동으로 되던 것이 갑자기 안 되었다. 다음은 이 문제를 해결하면서 Gihub 인증에 대해 이해하게 된 내용이다.

## Github 두 가지 인증 방식
Github에 코드를 push하거나 pull 받을 때, 원격 서버와 통신을 하고 있다. 이때 Github는 이 사람이 정말 권한이 있는 사람이 맞는지 확인하는 과정을 거친다.

Gtihub는 HTTPS와 SSH 방식이 있다. HTTPS를 사용할 때는 매번 아이디/비밀번호나 토큰을 입력해야 한다. 하지만 OS에는 자격 증명을 저장하는 시스템 도구가 있어서 Git이 이 시스템을 사용하도록 설정되어 있으면, 한 번 인증한 정보가 저장된다. SSH는 좀 다르다. 한 번 Key를 등록해둬야 그 뒤로 자동 인증이 된다.

## SSH 동작방식
SSH는 한 쌍의 키로 동작한다.
1. 개인키(Private Key)
	- 내 컴퓨터에 있는 비밀 키
	- 공개하면 안 되는 집 열쇠
2. 공개키 (Public Key)
	- Github에 등록하는 키
	- 자물쇠라고 생각하면 됨

git push와 같은 명령어를 실행하면 Github에서 증명을 요구한다. 내 컴퓨터에 있는 개인키로 암호화된 메시지를 Github에 보내면 등록된 공개키로 복호화하여 등록된 사용자가 맞는지 확인한다.

## 적용해보기
1. **키 페어 생성**
```shell
ssh-keygen -t ed25519 -C "jaeuu.dev@gmail.com"
```
위 명령어를 실행하면 두 개의 파일이 생성된다.
- `id_ed25519`: 개인키
- `id_ed25519.pub`: 공개키

2. **공개키 Github 등록**
```shell
cat ~/.ssh/id_ed25519.pub
```
공개키 내용을 확인하고 출력된 내용을 Github Settings -> SSH Keys에 등록한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/52ee5a5d97fb23f80377457b239c5807.png)
*GitHub에 등록된 SSH key 정보*

3. **로컬 저장소의 원격 주소를 SSH 방식으로 변경**
```shell
git remote set-url origin git@github.com:nullisdefined/nullisdefined.github.io.git
```

처음 연결하면 다음과 같은 메시지가 출력되는데
```shell
The authenticity of host 'github.com (20.200.245.247)' can't be established.
ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```
yes를 입력해 이 서버를 신뢰할 수 있는 호스트로 등록한다. Github 서버가 정말 맞는지 확인하는 과정이다.

## SSH 사용시 이점들
언뜻 보면 비밀번호를 입력하는 게 더 쉽게 보여진다. 하지만 SSH 방식은 다음과 같은 이점을 가진다.
- **보안성**
    - 비밀번호는 탈취될 수 있지만, 개인키는 내 컴퓨터에만 있음
    - 공개키만으로는 아무것도 할 수 없음
- **편의성**
    - 한 번 설정하면 더 이상 인증 정보 입력 불필요
    - CI/CD나 자동화된 배포에 적합
- **관리의 용이성**
    - 여러 컴퓨터에서 각각 다른 키 사용 가능
    - 필요하면 특정 키만 삭제 가능

## 마치며
새롭게 Cygwin을 적용해보면서 뜻밖의 인증 문제를 만나 이를 해결하는 과정에서 Github 인증 방식에 대해 이해하게 되었다. SSH 키 설정으로 인증 문제도 해결했고, Windows 환경에서도 다양한 Linux 도구들을 활용할 수 있게 되었다.