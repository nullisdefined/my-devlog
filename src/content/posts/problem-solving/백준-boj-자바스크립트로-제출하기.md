---
title: "백준(BOJ) 자바스크립트로 제출하기"
date: 2024-11-25
tags: ["JavaScript", "BOJ"]
category: "Problem Solving"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a2ece62d4e9073e31f91f537a8314a6a.png"
draft: false
---

백준은 JavaScript 언어를 지원하지만 백준 문제풀이에 있어서 JavaScript는 조금 까다롭게 느껴질 수 있다. 이유는 입력 처리에 있는데, C, Java 등 다른 언어들에서는 기본적으로 간단한 입력 함수(scanf, Scanner Class 등)를 제공하는데 그에 반해 JavaScript는 Node.js의 fs 모듈을 사용해야 하며, 입력 처리를 위한 추가 작업이 필요하다.
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a2ece62d4e9073e31f91f537a8314a6a.png)

## JavaScript 언어를 선택한 이유?
다른 언어를 사용하는 게 좋아보이지만.. JavaScript로 한번 BOJ 문제풀이를 해보려 한다. 이유는 지금 주로 사용하는 언어가 TypeScript인 것이 가장 크고, 실제 코딩 테스트의 경우에는 프로그래머스와 거의 유사하며 따로 입력 처리를 하지 않아도 되는 함수 기반의 문제 구조이기 때문이다. 또한 JavaScript를 선택했을 때 장점으로
- **동적 타입**

빠른 코드 작성이 가능해진다

- **함수형 프로그래밍의 형태로 코드 작성 가능**

꽤 복잡해 보이는 것을 단 몇 줄만으로 구현했을 때 쾌감을 느낄 수 있다..?

- **간결한 문법**

이 있을 것 같고, 단점으로는

- **동적 타입**

타입의 관리가 어렵고, 의도치 않은 동작으로 런타임 에러의 위험이 크다

- **제한적인 자료구조**

priority queue 등 기본으로 제공하는 라이브러리가 없는 경우 직접 구현하여 사용해야한다..

- **실행 속도**

(상대적으로 느린 편에 속하지만, 백준에서는 느린 만큼 시간을 더 주기에 큰 단점은 아닌 것 같다)
가 있을 것 같다.

## 백준에서 JavaScript 사용법
### 기본 템플릿
```js
const fs = require("fs");
const filePath = process.platform === "linux" ? "/dev/stdin" : "input.txt";
let input = fs.readFileSync(filePath).toString().trim().split("\n");
```
만약 로컬 환경이 리눅스인 경우
```js
// 제출할 때
const input = fs.readFileSync("/dev/stdin").toString().trim().split("\n");
// 로컬에서 테스트할 때
// const input = fs.readFileSync("input.txt").toString().trim().split("\n");
```
이런 식으로 경우에 따라 주석 처리를 하면 된다.

### 입력 패턴별 사용법
#### 한 줄에 여러 값이 있는 경우
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/63262a2dfbb201844b0aa3d334228a23.png)
```js
const [a, b] = input[0].split(" ").map(Number);
```

#### 테스트케이스 개수가 주어지고, 각 줄에 하나의 값이 있는 경우
```
// 테스트케이스 개수 + 한 줄에 하나의 값
3
1
2
3
```

```js
const n = Number(input[0]); // 테스트케이스 개수

for (let i = 1; i <= n; i++) {
  const value = Number(input[i]); // 여기서 각 테스트케이스 처리
}
```
#### 테스트케이스 개수가 주어지고, 각 줄에 여러 값이 있는 경우
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9145ed688d79888312e251e60ff6de5d.png)
```js
const n = Number(input[0]); // 테스트케이스 개수

for (let i = 1; i <= n; i++) {
  const arr = input[i].split(" ").map(Number); // 여기서 각 케이스 처리
}
```

#### 2차원 배열 입력
```
// 2차원 배열 
3 4
1 2 3 4
5 6 7 8
9 10 11 12
```

```js
const [n, m] = input[0].split(" ").map(Number);  // n x m 크기
const array = [];
for (let i = 1; i <= n; i++) {
    array.push(input[i].split(" ").map(Number));
}
```

### readline이 필요한 경우
```js
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
  input.push(line);
}).on("close", function () {
  // 여기서 코드 작성
  process.exit();
});
```

### 주의사항
fs 모듈을 사용해 문제플 풀 경우 특정문제에서 런타임 에러가 발생하는 경우가 발생할 수 있다. 그때는 fs 모듈에서 readline으로 변경하면 된다.
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/379c5c061408e96818c9a7af1328d8ae.png)

정리하자면
- 기본적으로 fs 모듈 사용
- 런타임 에러 발생 시 readline으로 변경
- 로컬 테스트는 input.txt 사용
- 제출 시에는 '/dev/stdin' 사용