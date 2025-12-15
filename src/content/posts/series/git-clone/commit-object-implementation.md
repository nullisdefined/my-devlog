---
title: "Commit 객체 구현"
slug: "commit-object-implementation"
date: 2025-01-10
tags: ["Git", "Commit"]
category: "Series/Git-Clone"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/688911e9cb91ab25262d00076f5e75ee.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/688911e9cb91ab25262d00076f5e75ee.png)

## Commit 클래스

### 전체 코드
```js
const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");

class Commit {
  constructor(treeHash, message, parentHash = null) {
    this.type = "commit";
    this.treeHash = treeHash;
    this.parentHash = parentHash;
    this.message = message;
    this.author = "Hong Gil Dong <hong@example.com>";
    this.committer = "Hong Gil Dong <hong@example.com>";
    this.timestamp = Math.floor(Date.now() / 1000);
    this.timezone = this.getTimezoneOffset();
  }

  serialize() {
    let content = `tree ${this.treeHash}\n`;
    if (this.parentHash) {
      content += `parent ${this.parentHash}\n`;
    }
    content += `author ${this.author} ${this.timestamp} ${this.timezone}\n`;
    content += `committer ${this.committer} ${this.timestamp} ${this.timezone}\n`;
    content += `\n${this.message}\n`;
    return content;
  }

  calculateHash() {
    const content = this.serialize();
    const header = `${this.type} ${content.length}\0`;
    const data = header + content;
    return crypto.createHash("sha1").update(data).digest("hex");
  }

  async save(repoPath) {
    const hash = this.calculateHash();
    const objectsPath = path.join(repoPath, ".pit", "objects");
    const folderName = hash.slice(0, 2);
    const fileName = hash.slice(2);
    const folderPath = path.join(objectsPath, folderName);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(path.join(folderPath, fileName), this.serialize());

    return hash;
  }
}

module.exports = { Commit };
```

Commit 클래스는 다음 메서드로 구성되어 있다.

- `constructor()`
- `serialize()`
- `calculateHash()`
- `save()`

### 메서드 설명

#### 1. constructor(treeHash, message, parentHash)
> Commit 객체를 초기화한다.

```js
constructor(treeHash, message, parentHash = null) {
    this.type = "commit";
    this.treeHash = treeHash;
    this.parentHash = parentHash;
    this.message = message;
    this.author = "Hong Gil Dong <hong@example.com>";
    this.committer = "Hong Gil Dong <hong@example.com>";
    this.timestamp = Math.floor(Date.now() / 1000);
    this.timezone = this.getTimezoneOffset();
}
```

**코드 설명**
- 매개변수
    - treeHash: 현재 프로젝트 상태를 나타내는 Tree 객체의 해시
    - message: 커밋 메시지
    - parentHash: 이전 커밋의 해시 (기본값 null)
- 초기화
    - type: 객체 타입 "commit"으로 설정
    - author, committer: 작성자와 커미터 정보
    - timestamp: Unix 타임스탬프 (현재 시간)
    - timezone: 시스템의 시간대 오프셋 (예: +0900)

#### 2. serialize()
> Commit 객체를 Git 형식의 문자열로 변환한다.

```js
serialize() {
    let content = `tree ${this.treeHash}\n`;
    if (this.parentHash) {
      content += `parent ${this.parentHash}\n`;
    }
    content += `author ${this.author} ${this.timestamp} ${this.timezone}\n`;
    content += `committer ${this.committer} ${this.timestamp} ${this.timezone}\n`;
    content += `\n${this.message}\n`;
    return content;
}

```

`git cat-file -p <hash>` 명령어를 실행하면 다음과 같은 형식으로 출력된다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/7b54f1dc1113ba4b3ddc81231278d33b.png)

#### 3. calculateHash()
> Commit 객체의 SHA-1 해시값을 계산한다.

```js
calculateHash() {
    const content = this.serialize();
    const header = `${this.type} ${content.length}\0`;
    const data = header + content;
    return crypto.createHash("sha1").update(data).digest("hex");
}

```

**처리 과정**
1. 내용 직렬화
2. Git 형식 헤더 추가(`<type> <content-length>\0<content>`)
3. SHA-1 해시 계산 및 반환

#### 4. save(repoPath)
> Commit 객체를 파일시스템에 저장한다.

```js
async save(repoPath) {
    const hash = this.calculateHash();
    const objectsPath = path.join(repoPath, ".pit", "objects");
    const folderName = hash.slice(0, 2);
    const fileName = hash.slice(2);
    const folderPath = path.join(objectsPath, folderName);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(path.join(folderPath, fileName), this.serialize());

    return hash;
}

```

**코드 설명**
- 매개변수
    - repoPath: 저장소 경로
- 리턴
    - 해시값

**처리 과정**
1. 해시값 계산
2. 객체 저장 경로 생성 (`repoPath/.pit/objects/<hash의 앞 2자리>/<hash의 나머지>`)
3. 디렉터리 생성
4. 직렬화된 내용을 파일로 저장
5. 해시값 반환


> [!NOTE] 이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/git-clone)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.