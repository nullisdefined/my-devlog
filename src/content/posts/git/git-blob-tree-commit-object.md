---
title: "[Git] Blob, Tree, Commit Object"
slug: "git-blob-tree-commit-object"
date: 2025-01-07
tags: ["Git", "Blob", "Tree", "Commit"]
category: "Git"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/1fc970460a95ea5faf0cef3764835021.png"
draft: false
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/1fc970460a95ea5faf0cef3764835021.png)

Git은 파일과 디렉터리를 효율적으로 관리하기 위해 내부적으로 Blob, Tree, Commit이라는 세 가지 주요 객체를 사용한다. Git의 내부 동작 원리를 이해하기 위해 이 객체들이 무엇인지, 그리고 서로 어떻게 연결되어 있는지 살펴보았다.

## Blob (Binary Large Object)

Blob은 파일의 내용을 저장하는 Git 객체다. Git은 파일의 이름이나 메타데이터 대신, 파일의 내용만을 저장하며 이를 SHA-1 해시 값으로 관리한다.

### 특징
#### 1. 동일한 내용의 파일은 하나의 Blob 객체만 사용

Blob은 파일 이름이나 디렉터리 구조와는 무관하게 오직 파일의 내용을 기준으로 생성되기 때문에 Git은 파일의 위치가 바뀌더라도 동일한 Blob을 재사용할 수 있다.

예를 들어, "hello"라는 문자열을 파일로 저장하고 Blob 객체를 생성하면, 동일한 내용으로 Blob을 생성하는 다른 작업에서도 같은 SHA-1 해시 값을 얻게 된다. 이를 통해 중복 데이터를 제거하고 저장 공간을 효율적으로 사용할 수 있다.

### 2. .git/objects 디렉터리에 저장

Blob 객체는 `.git/objects` 디렉터리에 저장되며, 해시 값이 파일 이름으로 사용된다.

다음 명령어를 실행해보면

```bash
echo 'hello' > hello.txt
git add hello.txt
```

이후 `.git/objects` 디렉터리를 확인하면 다음과 같이 저장된 것을 볼 수 있다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/19b9ca1ab6310a720cb0ec27a521627f.png)

- 디렉터리: 해시 값의 앞 두 글자 (ce)
- 파일명: 나머지 해시 값 (01362..)

### 3. 파일 내용을 압축하여 저장

Git은 Blob 객체를 저장할 때 파일 내용을 zlib 압축 알고리즘을 사용해 저장한다.

---

## Tree Object

Tree는 디렉터리 구조와 파일 간의 관계를 나타내는 객체다. 디렉터리의 스냅샷을 기록하며, 하위 Blob 및 Tree 객체를 참조한다.

### 특징

#### 1. 디렉터리 내 파일 이름, 권한, SHA-1 해시 값을 저장

Tree 객체는 디렉터리 내 각 파일의 이름, 권한, 그리고 해당 파일의 Blob SHA-1 해시를 저장한다.

#### 2. Tree는 여러 Blob과 하위 Tree를 포함

Tree 객체는 단일 디렉터리의 정보를 저장하며, 파일을 나타내는 Blob 객체와 하위 디렉터리를 나타내는 Tree 객체를 참조한다.

#### 3. 디렉터리 구조가 변경되면 새로운 Tree 객체 생성

Git은 디렉터리의 내용이 변경될 때마다 새로운 Tree 객체를 생성한다. 따라서 Tree 객체는 특정 시점의 디렉터리 구조를 나타내며, 변경사항을 추적할 수 있다.

### 예제

Commit을 실행한 후 .git/objects 디렉터리를 확인하면 다음과 같이 Tree 객체와 Commit 객체가 추가된 것을 볼 수 있다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/cec7a8abb1879d10099fd0caca895c9e.png)

- Tree 객체: 디렉터리 정보를 포함
- Commit 객체: Tree와 부모 Commit을 참조

Tree 객체를 확인하려면 다음 명령어를 사용한다.

```bash 
ls-tree <Tree Hash>
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/65da1875f20f43c82fa7d7c201217361.png)

- 100644: 파일 권한
- blob: Blob 객체 타입
- 해시 값: 해당 Blob의 SHA-1 값
- 파일 이름: hello.txt

---

## Commit Object

Commit은 Git에서 가장 잘 알려진 객체로, 프로젝트의 상태(스냅샷)와 변경 이력을 저장한다. Commit은 특정 Tree를 가리키며, 부모 Commit과 연결되어 변경 이력을 추적한다.

### 특징

#### 1. Commit은 연결 리스트 형태로 부모-자식 관계를 형성

각 Commit은 부모 Commit을 참조하며, 이전 상태와의 연속성을 유지한다. 이를 통해 Git은 변경 이력 추적이 가능하다.

#### 2. 초기 커밋(Initial Commit)은 부모가 없는 유일한 Commit

Git 저장소의 첫 번째 Commit은 초기 커밋으로, 부모 Commit이 없다.

### 예제

```bash
git log
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/53a4deae3ae6c1a49888d378567e9b87.png)

Commit 객체를 .git/objects 디렉터리에서 찾아보면 다음과 같이 저장됨을 알 수 있다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/cec7a8abb1879d10099fd0caca895c9e.png)

객체의 내용을 확인하려면 다음 명령어를 사용한다.

```bash
git cat-file -p <Hash>
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/5c23ac550d6d33811943acd296e6cf01.png)

- tree: Tree 객체 해시 값 (aaa96..)
- author/committer: Commit 작성자 정보
	- 이름: nullisdefined
	- 이메일: jaeuu.dev@gmail.com
	- 타임스탬프: 1736240954 (Unix 시간), +0900 (시간대)
- 메시지: Commit 메시지 (Initial Commit)

---

## 대용량 파일의 처리

Git은 기본적으로 모든 파일을 Blob 객체로 관리한다. 하지만 대용량 파일을 Blob 객체로 저장된다면 .git/objects 디렉터리에 큰 영향을 끼치게 된다.

대용량 파일이 여러 버전으로 Commit될 경우, Git은 각 버전을 Blob으로 관리하므로 checkout, clone, push와 같은 작업이 느려질 수 있다.

### Git LFS (Large File Storage)

Git LFS는 대용량 파일의 효율적인 관리를 위해 Git에서 제공하는 확장 도구다. Git LFS는 대용량 파일의 실제 데이터를 저장소 외부에 저장하고, GIt에는 파일에 대한 참조 정보만 저장한다.

#### 동작
1. Git은 파일 내용을 Blob 객체로 저정하지 않고 대신 파일 포인터를 Blob에 저장한다.
2. 파일의 실제 데이터는 원격 LFS 서버 또는 별도 스토리지에 업로드된다.
3. 클라이언트가 파일을 필요로 할 때, Git LFS는 포인터 정보를 사용해 원격에서 파일을 가져온다.

### 설정 방법
1. Git LFS 설치

Git LFS는 별도로 설치해야 한다.

```bash
brew install git-lfs
```

2. 특정 파일 형식을 LFS로 관리

예를 들어, .psd 파일과 같은 대용량 파일을 LFS로 관리하려면 다음과 같이 명령어를 사용한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/05435353235d15446d1b10c1a383dec3.png)

3. `.gitattributes` 파일 생성

위 명령어를 실행하면 .gitattributes 파일이 생성되며, 추적할 파일 형식이 포함된다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/0b99e96e982f9df769bb04cb4b73972c.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/dd5391f93d58ceed89d53b86fcbf5794.png)

4. 파일 추가 및 커밋

이후 LFS로 추적되는 파일을 Git에 추가하고 커밋하면, 해당 파일의 실제 내용은 LFS 서버에 저장되고, Git에는 파일 포인터만 저장된다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/3cdfddd2b801c25513fcc5115511c5b0.png)

추적 파일을 확인하려면 다음 명령어를 사용한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/0be07db8acfd9ca22578327c47163cdd.png)

Tree 객체를 확인한 후 Blob 해시 값을 찾은 뒤

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/1f14bfbbcdd8a1a6944a53368774db4a.png)

해당 객체를 확인해보면

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/47cd43022c668b2451d05fc656a80d5b.png)

- version: Git LFS 포인터 파일의 스펙 버전
- oid(Object ID): LFS 객체의 고유 식별자로, 대용량 파일의 내용을 해싱한 SHA-256 해시 값

실제로 Git LFS를 활설화한 저장소에서 파일을 추가하면 .git 디렉터리 안에 lfs 디렉터리가 생성되는데, lfs/objects에 저장된 해시 값과 동일하다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/5eb53798e263b96d177920a8bdbab131.png)


---

## 마무리

Git 내부 구조를 이루는 세 객체의 역할과 상호작용을 이해할 수 있었다. Blob 객체는 파일의 내용을 저장하고, 중복 데이터를 효율적으로 관리한다. Tree 객체는 디렉터리 구조를 표현한다. Blob과 하위 Tree 객체들을 조직화한다. Commit 객체는 프로젝트의 특정 시점 스냅샷을 Tree 객체로 참조하고, 변경 이력을 추적하는 중요한 역할을 한다.

또한, 대용량의 파일의 경우 저장소의 성능 저하를 방지하기 위해 Git LFS라는 툴을 활용하여 파일 관리를 할 수 있다. 대용량 파일의 실제 데이터를 외부에 저장하고, Git에는 참조 정보만 남겨 대용량 파일로 인한 불필요한 성능 저하를 막는다.

자주 Git을 사용하면서 버전 관리에 탁월한 도구라고 느꼈지만, 나에게 있어 사용하기 쉬운 도구는 아니었다. 아직도 잘 모르겠다. 하지만 직관적이지 않은 인터페이스임에도 불구하고, Git의 내부 구조는 생각보다 단순하고 깔끔하다고 느껴졌다. Git이 파일을 어떻게 저장하고, 추적하고 관리하는지 내부적으로 그 동작을 이해한다면 Git의 사용이 좀 더 수월해질 것이라고 생각한다.