---
title: "Blob 객체 구현"
slug: "blob-object-implementation"
date: 2025-01-10
tags: ["Git", "Blob"]
category: "Series/Git-Clone"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/99a4cf003ce62de5e855762653ac5af3.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/99a4cf003ce62de5e855762653ac5af3.png)

## Blob 클래스

### 전체 코드
```js
const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");

class Blob {
  constructor(content) {
    this.type = "blob";
    this.content = content;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const header = `${this.type} ${this.content.length}\0`;
    const data = header + this.content;
    return crypto.createHash("sha1").update(data).digest("hex");
  }

  async save(repoPath) {
    const objectsPath = path.join(repoPath, ".pit", "objects");
    const folderName = this.hash.slice(0, 2);
    const fileName = this.hash.slice(2);
    const folderPath = path.join(objectsPath, folderName);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(path.join(folderPath, fileName), this.content);
  }
}

module.exports = { Blob };

```

Blob 클래스는 다음 메서드로 구성되어 있다.

- `constructor()`
- `calculteHash()`
- `save()`

### 메서드 설명

#### 1. constructor(content)
> Blob 객체를 초기화한다.

```js
constructor(content) {
    this.type = "blob";
    this.content = content;
    this.hash = this.calculateHash();
  }
```

**코드 설명**
- 매개변수
	- content: 파일 내용
- 초기화
	- type: 객체 타입 "blob"으로 설정
	- content: 파일 내용 저장
	- hash: 해시값 저장

#### 2. calculateHash()
> Blob 객체의 SHA-1 해시값을 계산한다.

```js
calculateHash() {
    const header = `${this.type} ${this.content.length}\0`;
    const data = header + this.content;
    return crypto.createHash("sha1").update(data).digest("hex");
  }
```

**처리 과정**
1. git 형식 헤더 추가(`<type> <content-length>\0<content>`)
2. SHA-1 해시 계산 및 반환

#### 3. save(repoPath)
> Blob 객체를 파일 시스템에 저장한다.

```js
async save(repoPath) {
    const objectsPath = path.join(repoPath, ".pit", "objects");
    const folderName = this.hash.slice(0, 2);
    const fileName = this.hash.slice(2);
    const folderPath = path.join(objectsPath, folderName);

    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(path.join(folderPath, fileName), this.content);
  }
```

**코드 설명**
- 매개변수
	- `repoPath`: 저장소 경로

**처리 과정**
1. 객체 저장 경로 생성 (`repoPath/.pit/objects/<hash의 앞 2자리>/<hash의 나머지>`)
2. 디렉터리 생성
3. 파일 내용 저장	


> [!NOTE] 이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/git-clone)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.