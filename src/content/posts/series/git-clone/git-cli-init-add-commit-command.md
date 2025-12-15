---
title: "[CLI] init, add, commit 커맨드 구현"
slug: "git-cli-init-add-commit-command"
date: 2025-01-23
tags: ["Git", "CLI", "Commit", "Blob", "Tree"]
category: "Series/Git-Clone"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/fefdcff0971b15a5a9a327ee02fe693a.png"
draft: false
views: 0
---
Git의 기본 명령어인 `init`, `add`, `commit`을 유사하게 구현한 과정이다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/fefdcff0971b15a5a9a327ee02fe693a.png)
*Git CLI*

`commander.js` 라이브러리를 사용하여 커맨드와 옵션들을 정의하고 CLI(Command Line Interface)를 간단히 구현할 수 있었다.

## 초기 설정
먼저, `commander.js`를 설치하고 CLI 엔트리 파일(`cli.js`)을 생성했다.
CLI를 실행할 수 있도록 `package.json`의 bin 필드를 설정했다.

```json
"bin": {
    "pit": "cli.js"
}
```

bin 필드는 CLI 도구의 이름을 정의한다.
위와 같이 설정했을 때, 예를 들어 `pit init`, `pit add <files..>`와 같은 명령어를 실행할 수 있다.

## pit init
`init` 명령어는 새로운 `.pit` 저장소를 초기화한다.
디렉터리에 `.pit`라는 이름의 폴더를 생성하고, Git의 내부 구조를 흉내 내기 위해 objects 디렉터리를 추가로 만든다.
refs 등 다른 설정 폴더 및 파일들이 있지만 지금은 기본 객체만 구현한 상태이므로 넘어갔다.

**코드**

```js
program
  .command("init")
  .description("Initialize a new pit repository")
  .action(async () => {
    const repoPath = process.cwd();
    await pitInit(repoPath);
  });

async function pitInit(repoPath) {
  const pitDir = path.join(repoPath, ".pit");
  const objectsDir = path.join(pitDir, "objects");

  if (fs.existsSync(pitDir)) {
    console.log("Reinitialized existing Pit repository in", pitDir);
    return;
  }
  fs.mkdirSync(objectsDir, { recursive: true });
  console.log("Initialized empty Pit repository in", pitDir);
}
```

**결과**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/481e2018a0279b1f6d86bc5a1e5ea057.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/16855e361b9e2a6ee773a5462b04627a.png)
*이미 .pit 디렉터리가 존재하는 경우*

## pit add
`add` 명령어는 파일을 저장소에 추가한다. 기본적으로 파일의 내용을 읽어 객체(blob)로 변환한 후 저장소에 저장한다.

**코드**

```js
program
  .command("add <files...>")
  .description("Add file(s) to the repository")
  .action(async (files) => {
    const repoPath = process.cwd();
    await pitAdd(repoPath, files);
  });

async function pitAdd(repoPath, filePaths) {
  if (!filePaths || filePaths.length === 0) {
    console.log("Add file path(s) to the repository");
    return;
  }

  for (const fp of filePaths) {
    const fullPath = path.join(repoPath, fp);
    try {
      const content = fs.readFileSync(fullPath, "utf8");
      const blob = new Blob(content);
      await blob.save(repoPath);
      console.log(`file ${fp} -> object created (hash: ${blob.hash})`);
    } catch (err) {
      console.error(`file not found: ${fp}`, err.message);
    }
  }
}
```

**결과**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/e9c2bf7eedda3f0ae848caa7df65eef4.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/b76ae42af436fbd07981b329c8539250.png)
*생성된 파일들*

하지만 파일을 지정해서 추가하는 경우도 있지만, 일반적으로 `git add .` 처럼 디렉터리 전체를 추가하도록 할 필요가 있었다. 
또, gitignore처럼 ignore 파일에 정의된 규칙을 따르도록 구현해보았다.

### 하위 디렉터리 포함하기
**코드**

```js
program
  .command("add <files...>")
  .description("Add file(s) to the repository")
  .action(async (files) => {
    const repoPath = process.cwd();
    await pitAdd(repoPath, files);
  });

async function pitAdd(repoPath, filePaths) {
  const allFiles = new Set();

  for (const fp of filePaths) {
    const fullPath = path.join(repoPath, fp);

    if (!fs.existsSync(fullPath)) {
      console.error(`File or directory not found: ${fp}`);
      continue;
    }

    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      allFiles.add(fullPath);
    } else if (stat.isDirectory()) {
      await collectFiles(fullPath, allFiles);
    }
  }

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    const blob = new Blob(content);
    await blob.save(repoPath);
    console.log(`File ${filePath} -> Object created (hash: ${blob.hash})`);
  }
}

async function collectFiles(dirPath, fileSet) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isFile()) {
      fileSet.add(fullPath);
    } else if (entry.isDirectory()) {
      await collectFiles(fullPath, fileSet);
    }
  }
}
```

**결과**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/944eb71897652b9d07a31a1daa518616.png)

### .pitignore 규칙 적용하기
`ignore` 라이브러리를 사용하여 Git의 `.gitignore`처럼 .pitignore 파일에 정의된 규칙을 따르도록 구현해보았다.

**코드**

```js
const ignore = require("ignore");

const ig = ignore();
if (fs.existsSync(".pitignore")) {
  const ignoreRules = fs.readFileSync(".pitignore", "utf8");
  ig.add(ignoreRules.split("\n").filter((line) => line.trim() !== ""));
}

if (ig.ignores(filePath)) {
  continue;
}
```

## pit commit
`commit` 명령어는 현재 디렉터리의 변경 사항을 커밋한다. 커밋 메시지를 옵션으로 입력받으며, 트리 객체와 커밋 객체를 생성하여 저장한다.

**코드**

```js
program
  .command("commit")
  .description("Commit changes")
  .option("-m, --message <msg>", "Commit message")
  .action(async (options) => {
    const repoPath = process.cwd();
    await checkPitRepo(repoPath);
    const message = options.message || "Default commit message";
    await pitCommit(repoPath, message);
  });

async function pitCommit(repoPath, message) {
  const tree = new Tree();

  const allFiles = fs.readdirSync(repoPath);
  for (const file of allFiles) {
    if (file === ".pit" || file === "node_modules") continue;

    const filePath = path.join(repoPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const blob = new Blob(content);
    await blob.save(repoPath);
    tree.addEntry(file, blob.hash, "100644");
  }

  const treeHash = await tree.save(repoPath);

  const commit = new Commit(treeHash, message, null);
  const commitHash = await commit.save(repoPath);

  console.log(`commit created: ${commitHash}`);
  console.log(`tree hash: ${treeHash}`);
  console.log(`commit message: ${message}`);
}
```

**결과**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/c60d71cfd6dbe1d8db9fff8e87b16fa3.png)

## 저장소 검증하기
추가적으로, 명령어는 반드시 저장소가 초기화된 디렉터리 내에서만 실행되도록 제한했다.

**코드**

```js
program
  .command("add <files...>")
  .description("Add file(s) to the repository")
  .action(async (files) => {
    const repoPath = process.cwd();
    await checkPitRepo(repoPath);
    await pitAdd(repoPath, files);
  });

program
  .command("commit")
  .description("Commit changes")
  .option("-m, --message <msg>", "Commit message")
  .action(async (options) => {
    const repoPath = process.cwd();
    await checkPitRepo(repoPath);
    const message = options.message || "Default commit message";
    await pitCommit(repoPath, message);
  });

async function checkPitRepo(repoPath) {
  const pitDir = path.join(repoPath, ".pit");
  if (!fs.existsSync(pitDir)) {
    console.error("Not a pit repository (or any of the parent directories)");
    process.exit(1);
  }
}
```

**결과**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/d59f42d50f49181cc3646b158bf4a30c.png)

## NPM 배포
마지막으로, NPM에 배포해보았다.
원래는 패키지 이름을 pit으로 하려했으나, 이미 존재하는 이름이라 pit2로 변경했다.

이제 NPM을 통해 설치받아 사용할 수 있다.

```bash
npm install -g pit2
```

로컬에서 현재 디렉터리에 있는 패키지를 전역으로 설치해서 사용할 수도 있었지만

```bash
npm install -g .
```

NPM에 배포하는 경험도 해보고 싶었다.

**결과**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/8591722910179916441425ab356e572b.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/2e993429d294d2f6719bd71e6befc97c.png)


> [!NOTE] 이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/git-clone)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.