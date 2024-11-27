---
title: "[TS] 타입 시스템 이해하기"
date: 2024-11-27
tags: ["TypeScript"]
category: "Languages/TypeScript"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png"
draft: false
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png)

TypeScript는 JavaScript의 상위 집합으로, 최종적으로 JavaScript 코드로 변환되어 실행된다.

#### 컴파일과 트랜스파일
```ts
// TypeScript 코드
const greeting: string = "Hello, TypeScript!";
```
이 코드는 다음과 같은 JavaScript 코드로 변환된다.
```js
// 변환된 JavaScript 코드
const greeting = "Hello, TypeScript!";
```
> 💡C나 Java처럼 기계어로 컴파일되는 것이 아니라 다른 형태의 고수준 언어인 JavaScript로 변환되기 때문에, 이 과정을 특별히 스파일'이라고도 부른다.

## TypeScript의 보호 기능
TypeScript는 코드의 실행 전에 타입 체커(Type Checker)를 통해 잠재적인 오류를 감지한다.
###  타입 체크 예시
```ts
// 잘못된 타입 연산
[1, 2, 3, 4] + false;  // Error: 연산자 '+' 를 배열과 boolean에 적용할 수 없음.

// 함수 호출 오류
function divide(a: number, b: number) {
  return a / b;
}
divide("xxxxx");  // Error: 'string' 형식의 인수는 'number' 형식의 매개 변수에 할당될 수 없음.

// 존재하지 않는 메서드 호출
const user = { name: 'kim' };
user.hello();  // Error: 'hello' 속성이 '{ name: string; }' 형식에 없음
```

## 타입 시스템 활용하기
### 1. 타입 추론과 명시
TypeScript는 자동으로 타입을 추론할 수 있지만, 명시적으로 타입을 지정할 수도 있다.
```ts
// 타입 추론
let inferredNumber = 42;        // number로 추론됨
let inferredArray = [1, 2, 3];  // number[]로 추론됨

// 타입 명시
let explicitNumber: number = 42;
let explicitArray: number[] = [1, 2, 3];
```
### 2. 객체와 타입
```ts
// 객체의 타입 정의
type User = {
  name: string;
  age?: number;        // 선택적 프로퍼티
  readonly id: number; // 읽기 전용 프로퍼티
};

const user: User = {
  name: "Kim",
  id: 1
};
```

### 3. 튜플 타입
```ts
// 고정된 길이와 타입을 가진 배열
const userInfo: [string, number, boolean] = ["Kim", 25, true];

// 읽기 전용 튜플
const constants: readonly [number, string] = [3.14, "PI"];
```

## 특수한 타입들
### 1. void 타입
반환값이 없는 함수의 타입을 나타낸다.
```ts
function logMessage(message: string): void {
  console.log(message);
}
```

### 2. unknown 타입
타입이 확실하지 않은 값을 다룰 때 사용한다.
```ts
let userInput: unknown = getUserInput();

// 타입 검사 후 사용
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase());
}
```

### 3. never 타입
절대 발생할 수 없는 타입을 나타낸다.
```ts
// 항상 오류를 발생시키는 함수
function throwError(message: string): never {
  throw new Error(message);
}

// 무한 루프 함수
function infiniteLoop(): never {
  while (true) {}
}
```
처음 접했을 때는 절대 발생할 수 없는데 왜 사용하는거지? 라는 의문을 가졌었는데, 절대 나타나지 않음을 명시해주는 것에 의미가 있는 듯하다. 아직 실제로 사용해본 적은 없다..

### 4. any 타입(사용 주의)
모든 타입을 허용하지만, TypeScript의 타입 검사를 무력화시키므로 사용을 지양해야 한다.
```ts
let unsafe: any = 4;
unsafe = "string";  // 어떤 타입이든 허용됨
unsafe = false;     // 타입 안전성이 없어짐
```

---
TypeScript의 타입 시스템으로 개발 단계에서 많은 오류를 사전에 잡아내고, 코드의 안정성을 높여준다. 하지만 이러한 타입 검사는 컴파일 시에만 동작하며, 실제 실행되는 JavaScript 코드에서는 타입 정보가 제거된다는 점을 기억해야 한다.