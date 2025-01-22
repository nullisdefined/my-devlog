---
title: "[Git] Staging Area"
slug: "git-staging-area"
date: 2025-01-08
tags: ["Git", "Index", "StagingArea"]
category: "Tools/Git"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/dfeb95ba0c2ed042ed25f03b783c8b4e.png"
draft: false
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/dfeb95ba0c2ed042ed25f03b783c8b4e.png)

Git은 Working Directory, Staging Area, Repository 세 가지 영역을 사용하여 파일을 관리한다. 그 중 Staging Area(Index라고도 함)는 다음 Commit에 포함될 변경사항들을 준비하는 중간 영역이다.

### 세 가지 작업 영역

1. **Working Directory**
	- 실제 작업이 이루어지는 로컬 디렉터리
	- 파일을 생성, 수정, 삭제하는 모든 작업이 이루어지는 공간
	- Git이 추적하는 파일과 추적하지 않는 파일을 모두 포함하는 공간
2. **Staging Area**
	- `git add`로 추가한 파일들이 모이는 중간 영역
	- 다음 Commit에 포함될 변경사항들을 준비하는 공간
	- `.git/index` 파일로 구현되는 공간
3. **Repository**
	- Commit들이 저장되는 최종 저장소
	- 프로젝트의 모든 버전 히스토리를 포함하는 공간

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/6f4b87d19d44200ad18949c163e825d8.png)

## 파일 상태 Life Cycle

Git에서 파일은 다음 네 가지 중 하나의 상태를 가질 수 있다.

1. **Untracked**
	- Git으로 버전 관리되지 않는 파일
	- Working Directory에만 존재함
	- `git add` 시 Staged 상태로 전환됨
1. **Unmodified**
	- Git이 추적하는 파일이 수정되지 않은 상태
	- 새로 추가된 파일이 `git add`된 상태
	- 파일 수정 시 Modified 상태로 전환됨
2. **Modified**
	- 추적 중인 파일이 수정된 상태
	- Working Directory에서 변경이 발생한 상태
	- `git add` 시 Staged 상태로 전환됨
1. **Staged**
	- Staging Area에 올라간 상태
	- 다음 Commit에 포함될 준비가 된 상태
	- `git commit` 시 Unmodified 상태로 전환됨

## Staging Area 내부 구조

### .git/index 파일

Staging Area는 물리적으로 `.git/index`라는 단일 바이너리 파일로 구현되어 있다. 이 파일은 다음 Commit에 포함될 파일들의 스냅샷을 관리한다.

#### 1. 파일 구조
```txt
.git/index
├── DIRC 시그니처 (4bytes) # 'DIRC'라는 매직 넘버로 index 파일임을 식별
├── 버전 정보 # index 파일 형식의 버전을 나타냄 (현재 버전 2)
├── 파일 엔트리 개수 # Staging Area에 있는 파일 수
└── 파일 엔트리들
    ├── 파일 메타데이터 # 파일 권한, 크기, 타임스탬프 등
    ├── Blob 객체 해시값 # 파일 내용의 SHA-1 해시
    └── 파일 경로 # 프로젝트 내 상대경로
```

#### 2. Blob 객체 생성 과정

예를 들어, `git add hello.txt` 명령어를 실행하면

1. 파일 내용으로 Blob 객체를 생성
2. `.git/objects`에 저장
3. `index`에 해당 Blob의 해시값 기록

실제로 이를 확인해보면

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/c3d628bcb03ac8ec99b1961638b9669d.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/f0193f43d04aea85a664f823d591e85c.png)

바이너리 형식이라 직접 읽기는 어렵지만, Git 명령어로 확인할 수 있다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/115bed5103cdac654db6cd9adb0cf775.png)

## Staging Area가 필요한 이유

Commit 전에 굳이 Staging Area를 거치게 하는 이유는 다음과 같다.

### 1. 선택적 Commit을 가능하게 한다

작업 중인 변경사항 중에서 원하는 부분만 선택하여 Commit 할 수 있다.

예를 들어, `git add -p` 명령어를 사용하면 파일의 특정 부분만 Staging Area로 추가할 수 있다. 이를 통해 작은 단위로 변경사항을 관리하거나, 관련 없는 변경사항을 분리해 더 깔끔한 Commit을 생성할 수 있다.

```bash
# 파일의 일부분만 스테이징
git add -p <file>
```

### 2. 충돌 해결을 돕는다

병합(Merge) 과정에서 충돌이 발생하면, Git은 충돌 상태를 Working Directory와 Staging Area에서 충돌 상태를 관리할 수 있다. 병합 후 충돌 해결된 파일을 Staging Area로 다시 올려야 Commit이 가능하다. Staging Area는 병합 시 변경 내용을 세 가지 버전(HEAD, 병합할 대상, 중간 상태)으로 나누어 관리해 충돌 해결을 체계적으로 돕는다.

### 3. 커밋 수정

Commit 이후 발견된 실수를 수정할 경우 Staging Area는 유용하다. `git commit --amend`를 통해 이전 Commit에 추가적인 변경사항을 포함하거나 Commit Message를 수정할 수 있다. Staging Area에 새로 추가된 변경사항을 이전 Commit과 합쳐 불필요한 Commit 히스토리를 줄일 수 있다.

## Git이 파일 변경을 감지하는 방법

Git은 두 가지 방식으로 파일이 변경됨을 감지한다.

1. **타임스탬프 확인**
	- 파일의 마지막 수정 시간을 기준으로 변경 여부를 감지한다.
	- 성능 최적화를 위해 기본적으로 이 방식을 사용한다.
	- 기본적으로 `core.checkstat=default` 설정되어 있다.
2. **콘텐츠 해싱**
	- 파일 내용을 기반으로 해시값을 생성한다. 
	- 내용이 동일하면 동일한 해시값을 가지며, 파일 내용이 변경되면 해시값도 변경된다.
	- 변경된 파일은 새로운 Blob 객체로 저장된다.
	- `core.checkstat=minimal` 설정하여 활성화할 수 있다.

변경 감지 방식을 설정하는 명령어는 다음과 같다.

```bash
# 타임스탬프만 확인
git config core.checkstat default

# 콘텐츠 해시도 확인
git config core.checkstat minimal
```

콘텐츠 해시도 확인하게 되면 정확하지만, 조금 느려진다.

### Staging Area 예제

예를 들어, `hello.txt`파일 내용을 수정하게 되면

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/a7b85aa0b557508501931cd153c2002c.png)

다음과 같이 해시값이 바뀌고, `.git/objects` 디렉터리에 변경된 내역을 저장한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/b5df508d06498587a9982790455b947e.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/1149d1672f02fcf42d1898be3c3badbf.png)

## 마무리

Staging Area는 변경사항을 체계적으로 관리하고, 깔끔한 커밋 히스토리를 만드는데 도움을 준다. 내부적으로는 `.git/index` 파일을 통해 효율적으로 구현되어 있으며, 다양한 Git 명령어를 통해 유연하게 활용할 수 있다. Staging Area를 잘 활용하면 더 효율적이고 유지보수하기 좋은 버전 관리가 가능하다.