---
title: "[TS] 인터페이스(Interface)"
date: 2024-12-13
tags: ["TypeScript", "Interface"]
category: "Languages/TypeScript"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png"
draft: true
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png)

인터페이스는 타입스크립트에서 객체의 타입을 정의하는 방법이다. 특정 객체가 어떤 프로퍼티와 메소드를 가져야 하는지 정의한다.

## 기본 문법과 사용
가장 기본적인 형태의 인터페이스의 정의와 사용은 다음과 같다.
```ts
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "홍길동",
  age: 22,
};
```

## 고급 기능

### 1. 선택적 프로퍼티 (Optional Properties)
기본적으로 인터페이스에 정의된 프로퍼티는 반드시 구현되어야 하지만 `?`를 사용하여 선택적 프로퍼티를 정의할 수 있다.
```ts
interface Product {
  id: number;
  name: string;
  description?: string; // 선택적 프로퍼티
  price: number;
}

const product: Product = {
  id: 1,
  name: "공책",
  price: 1500
  // description은 선택사항이므로 생략 가능
};
```

### 2. 읽기 전용 프로퍼티 (Readonly Properties)
`readonly` 키워드를 사용하여 한 번 설정된 후 변경할 수 없는 프로퍼티를 정의할 수 있다.
```ts
interface Config {
  readonly apiKey: string;
  readonly baseUrl: string;
}

const config: Config = {
  apiKey: "my-api-key",
  baseUrl: "https://api.example.com"
};

config.apiKey = "new-key"; // 컴파일 에러
```

### 3. 인터페이스 확장 (Interface Extension)
인터페이스는 다른 인터페이스를 확장할 수 있다. 이를 통해 코드 재사용성을 높일 수 있다.
```ts
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

const dog: Dog = {
  name: "멍멍이",
  age: 3,
  breed: "리트리버",
  bark() {
    console.log("왈왈!");
  }
};
```

### 4. 함수 타입 인터페이스 (Function Type Interfaces)
인터페이스로 함수의 타입도 정의할 수 있다.
```ts
interface MathFunc {
  (x: number, y: number): number;
}

const add: MathFunc = (x, y) => x + y;
const subtract: MathFunc = (x, y) => x - y;

console.log(add(10, 5));      // 15
console.log(subtract(10, 5)); // 5
```

### 5. 인덱스 시그니처 (Index Signatures)
객체의 모든 프로퍼티가 같은 타입을 가질 때 사용할 수 있다.
```ts
interface StringArray {
  [index: number]: string;
}

const arr: StringArray = ["Hello", "World"];
console.log(arr[0]); // "Hello"

interface StringObject {
  [key: string]: string;
}

const obj: StringObject = {
  name: "홍길동",
  job: "학생"
};
```

## 인터페이스 vs 타입 별칭
TypeScript에서는 interface와 type 키워드 모두 타입을 정의할 수 있다. 하지만 다음과 같은 차이가 있다.
```ts
// 인터페이스는 선언 병합이 가능
interface Animal {
  name: string;
}

interface Animal {
  age: number;
}

// 위 두 인터페이스는 자동으로 병합됨
const animal: Animal = {
  name: "멍멍이",
  age: 3
};

// 타입 별칭은 선언 병합이 불가능
type Person = {
  name: string;
};

type Person = { // 식별자 중복 에러
  age: number;
};
```

## 타입 시스템의 한계
**인터페이스는 컴파일 시점에만 존재하며, JavaScript로 컴파일되면 모두 제거된다.** 따라서 런타임에서 타입 검사가 필요한 경우에는 별도의 검증 로직이 필요하다.

---
TypeScript의 인터페이스는 타입 안정성을 높이고 개발자 경험을 개선해준다. 특히 NestJS와 같은 프레임워크에서 인터페이스를 잘 활용하면, 더 안정적이고 유지보수하기 쉬운 코드를 작성할 수 있다.