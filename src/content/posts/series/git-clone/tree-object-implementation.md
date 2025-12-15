---
title: "Tree 객체 구현"
slug: "tree-object-implementation"
date: 2025-01-10
tags: ["Git", "Tree"]
category: "Series/Git-Clone"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/583b9a6c00a3eebcfc2ac59121a31c2e.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/583b9a6c00a3eebcfc2ac59121a31c2e.png)

## Tree 클래스

### 전체 코드
```js
const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");

class Tree {
  constructor() {
    this.type = "tree";
    this.entries = new Map();
    this.hash = null;
  }

  addEntry(name, hash, mode = "100644") {
    this.entries.set(name, { hash, mode });
    this.hash = null;
  }

  serialize() {
    let content = "";
    const sortedEntries = Array.from(this.entries.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    for (const [name, { mode, hash }] of sortedEntries) {
      const type = mode === "040000" ? "tree" : "blob";
      content += `${mode} ${type} ${hash}\t${name}`;
    }

    return content;
  }

  calculateHash() {
    if (this.hash) return this.hash; // 이미 계산된 경우 그대로 반환

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

    this.hash = hash;
    return hash;
  }
}

module.exports = { Tree };

```

Tree 클래스는 다음 메서드로 구성되어 있다.

- `constructor()`
- `addEntry()`
- `serialize()`
- `calculateHash()`
- `save()`

### 메서드 설명

#### 1. constructor()
> Tree 객체를 초기화한다.

```js
constructor() {
	this.type = "tree";
	this.entries = new Map();
	this.hash = null;
}
```

객체 타입은 "tree"로 설정하며, 파일과 디렉터리 정보를 저장할 Map 객체를 생성한다. hash의 경우 null로 초기화해둔다.

#### 2. addEntry(name, hash, mode)
> Tree에 새로운 엔트리(파일 또는 디렉터리)를 추가한다.

```js
addEntry(name, hash, mode = "100644") {
    this.entries.set(name, { hash, mode });
		this.hash = null;
  }
```

entries는 다음과 같은 구조를 지닌다.

```txt
 ["README.md", { hash: "...", mode: "100644" }],
 ["src", { hash: "...", mode: "040000" }],
 ["test.txt", { hash: "...", mode: "100644" }]
```

**코드 설명**
- 매개변수
	- name: 파일/디렉터리 이름
	- hash: 객체(blob/tree) 해시값
	- mode: 파일 권한(기본값 "100644")
		- "100644": 일반 파일
		- "040000": 디렉터리
- `this.hash = null`: entries가 변경되면 hash를 무효화

#### 3. serialize()
> Tree 객체의 각 엔트리를 Git 형식에 맞게 포맷팅한다.

```js
serialize() {
    let content = "";
    const sortedEntries = Array.from(this.entries.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    for (const [name, { mode, hash }] of sortedEntries) {
      const type = mode === "040000" ? "tree" : "blob";
      content += `${mode} ${type} ${hash}\t${name}`;
    }

    return content;
  }
```

`git ls-tree <hash>` 명령어를 실행했을 때 다음과 같이 출력된다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/936e27626815636cc2dd4d76d3174af6.png)

이를 적용해 `<mode> <type> <hash>\t<name>` 형식으로 변환한다.

**처리 과정**
1. entries 이름순 정렬
2. 각 엔트리 git 형식으로 포맷팅

**코드 설명**
- `Array.from()`: 유사 배열 객체나 이터러블 객체를 배열로 변환
- `this.entries.entries()`: Map 내부 엔트리 반환
- `.sort(([a], [b]) => a.localeCompare(b))`: 이름 기준 정렬

#### 4. calculateHash()
> Tree 객체의 SHA-1 해시값을 계산한다.

```js
calculateHash() {
		if (this.hash) return this.hash;

    const content = this.serialize();
    const header = `${this.type} ${content.length}\0`;
    const data = header + content;
    this.hash = crypto.createHash("sha1").update(data).digest("hex");
		return this.hash;
  }
```

**처리 과정**
1.  내용 직렬화
2. git 형식 헤더 추가(`<type> <content-length>\0<content>`)
3. SHA-1 해시 계산 및 반환

**코드 설명**
- `if (this.hash) return this.hash;`: 해시가 이미 계산된 경우 그대로 반환한다.

#### 5. save()
> Tree 객체를 파일 시스템에 저장한다.

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

**코드 설명**
- 매개변수
	- `repoPath`: 저장소 경로
- 리턴
	- 해시값

**처리 과정**
1. 해시값 계산
2. 객체 저장 경로 생성 (`repoPath/.pit/objects/<hash의 앞 2자리>/<hash의 나머지>`)
3. 디렉터리 생성
4. 직렬화된 내용을 파일로 저장


> [!NOTE] 이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/git-clone)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.