---
title: "[TS] 함수(Function)"
slug: "ts-function"
date: 2024-11-16
tags: ["TypeScript", "Function", "Languages"]
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png)

## Call Signatures로 함수 타입 정의
Call Signature는 함수의 매개변수와 반환 값의 타입을 미리 정의하는 방법이다. IDE에서 함수에 마우스를 올렸을 때 보이는 타입 정보가 바로 Call Signatures이다.

### 기본적인 Call Signature 정의
```ts
// 함수 타입 정의
type Add = (a: number, b: number) => number;

// 실제 함수 구현
const add: Add = (a, b) => a + b;
```
> 💡 매개변수 이름은 타입 정의와 실제 구현에서 달라도 된다. 타입만 일치하면 됨.

## 함수 오버로딩(Function Overloading)
함수 오버로딩은 하나의 함수가 여러 개의 Call Signatures를 가질 수 있게 해주는 기능이다.

### 함수 오버로딩 예시
```ts
type Config = {
  path: string;
  state: object;
};

// 오버로딩된 함수 타입 정의
type Push = {
  (path: string): void;
  (config: Config): void;
};

// 함수 구현
const push: Push = (config) => {
  if (typeof config === 'string') {
    console.log(config);
  } else {
    console.log(config.path);
  }
};

push('/home');           // string 버전
push({ path: '/about', state: {} }); // Config 버전
```

### 다양한 오버로딩 패턴
```ts
// 매개변수 개수가 다른 오버로딩
type Calculator = {
  (x: number): number;
  (x: number, y: number): number;
};

const calc: Calculator = (x: number, y?: number) => {
  if (y === undefined) {
    return x * 2;
  }
  return x + y;
};
```

## 다형성과 제네릭(Polymorphism & Generics)
제네릭은 타입을 파라미터화하여 재사용 가능한 컴포넌트를 만들 수 있게 해준다.

### 제네릭의 필요성
**먼저 제네릭을 사용하지 않은 경우**:
```ts
// 제네릭 없이 구현한 경우
type PrintArray = {
  (arr: number[]): void;
  (arr: string[]): void;
  (arr: boolean[]): void;
  (arr: (number | boolean)[]): void;
};
```

**이를 제네릭을 사용하여 개선하면**:
```ts
// 제네릭을 사용한 경우
type PrintArray<T> = {
  (arr: T[]): T;
};

const printFirst: PrintArray<any> = (arr) => arr[0];

const num = printFirst([1, 2, 3]);         // number 타입 반환
const str = printFirst(["a", "b", "c"]);   // string 타입 반환
```

### 여러 타입 변수 사용
```ts
type KeyValuePair<K, V> = {
  key: K;
  value: V;
};

const pair: KeyValuePair<string, number> = {
  key: "age",
  value: 25
};
```

### 제네릭 타입 제약 조건
```ts
// extends를 사용한 제약 조건
interface Lengthwise {
  length: number;
}

function printLength<T extends Lengthwise>(arg: T): number {
  return arg.length;
}

printLength("Hello");     // string has length
printLength([1, 2, 3]);   // array has length
// printLength(123);      // Error: number doesn't have length
```

## Tips

#### 1. 가능한 타입 추론 활용
```ts
// 불필요한 타입 명시
const items = genericFunction<string>(['a', 'b']);

// 타입 추론 활용
const items = genericFunction(['a', 'b']);
```

#### 2. 의미 있는 제네릭 타입 이름 사용
```ts
// 일반적인 컨벤션
T: Type
E: Element
K: Key
V: Value
S: State
```

#### 3. 함수 오버로딩 보다 유니온 타입이 더 간단할 수 있다.
```ts
// 오버로딩 사용
type StringOrNumber = {
  (value: string): string;
  (value: number): number;
};

// 유니온 타입 사용
type StringOrNumber = (value: string | number) => string | number;
```