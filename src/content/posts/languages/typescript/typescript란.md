---
title: "TypeScript란?"
date: 2024-11-11
tags: ["TypeScript"]
category: "Languages/TypeScript"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png"
draft: false
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png)

## TypeScript란?
TypeScript는 JavaScript에 타입 시스템을 추가한 프로그래밍 언어이다. Microsoft에서 개발했으며, JavaScript의 상위 집합으로 동작한다. 즉, 모든 유효한 JavaScript 코드는 TypeScript 코드이기도 하다.

### 왜 TypeScript가 필요한가?
JavaScript는 동적 타입 언어로서 유연하지만, 이로 인해 다음과 같은 문제점들이 발생할 수 있다.
```js
[1, 2, 3, 4] + false; // '1,2,3,4false' (string으로 변환)

function divide(a, b) {
  return a / b;
}
divide('xxxxx'); // NaN (에러가 발생하지 않음)

const user = { name: 'kim' };
user.hello(); // 런타임에서만 TypeError 발생
```

이러한 문제점들을 TypeScript는 다음과 같이 해결한다.
1. 컴파일 시점에서 타입 체크
2. IDE의 강력한 코드 자동 완성
3. 코드의 가독성과 유지보수성 향상
4. 런타임 에러 감소

## TypeScript의 주요 특징
#### 1. 타입 명시와 추론
```ts
// 타입 명시
let name: string = "kim";
let numbers: number[] = [1, 2, 3];

// 타입 추론
let inferredString = "hello"l // string으로 자동 추론
let inferredNumber = 42; // number으로 자동 추론
```

#### 2. 인터페이스
```ts
interface User {
	name: string;
	age: number;
	email?: string; // 옵셔널 프로퍼티
}

function createUser(user: User) {
	return user;
}

const newUser: User = {
	name: "kim",
	age: 25
};
```

#### 3. 클래스와 접근 제어자
```ts
class Person {
  constructor(
    private name: string,
    protected age: number,
    public email: string
  ) {}
  
  getName(): string {
    return this.name;
  }
}
```

#### 4. 제네릭
```ts
type PrintArray = {
  <T>(arr: T[]): T
};

const printFirst: PrintArray = (arr) => arr[0];

const result1 = printFirst([1, 2, 3]);       // number
const result2 = printFirst(["a", "b", "c"]); // string
```

## TypeScript의 고급 기능
#### 1. 유니온 타입(Union Type)
유니온 타입은 여러 타입 중 하나가 될 수 있는 값을 나타낸다.
```ts
// 기본적인 유니온 타입
type StringOrNumber = string | number;

// 리터럴 타입과의 조합
type Status = "loading" | "success" | "error";

// 객체 타입과의 조합
type UserResponse = 
  | { status: "success"; data: { name: string; age: number } }
  | { status: "error"; error: string };

// 함수 예시
function printId(id: number | string) {
  console.log("ID: " + id);
}
```

#### 2. 타입 가드(Type Guard)
타입 가드는 특정 스코프 내에서 변수의 타입을 보장하는 방법이다.
```ts
// typeof 타입 가드
function processValue(value: string | number) {
  if (typeof value === "string") {
    // 이 블록에서는 value가 string 타입으로 처리됨
    return value.toUpperCase();
  }
  // 이 블록에서는 value가 number 타입으로 처리됨
  return value * 2;
}

// instanceof 타입 가드
class Dog {
  bark() { return "Woof!"; }
}

class Cat {
  meow() { return "Meow!"; }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    return animal.bark();
  }
  return animal.meow();
}

// in 연산자를 사용한 타입 가드
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function move(pet: Fish | Bird) {
  if ("swim" in pet) {
    return pet.swim();
  }
  return pet.fly();
}

// 사용자 정의 타입 가드
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```
#### 3. 타입 별칭(Type Alias)
```ts
type UserType = {
  name: string;
  age: number;
};

type AdminType = UserType & {
  role: string;
};
```

## TypeScript 프로젝트 설정
### 기본 설정
1. TypeScript 설치

```shell
npm install -g typescript
```
TypeScript 패키지를 설치하면 tsc 명령어를 사용할 수 있다. tsc는 TypeScript Compiler의 약자로, TypeScript 코드를 JavaScript 코드로 변환해주는 컴파일러다.
2. 컴파일 및 실행

```shell
# TypeScript 파일을 JavaScript로 컴파일
tsc index.ts

# 컴파일된 JavaScript 파일 실행
node index.js

# 또는 ts-node를 사용하여 한 번에 컴파일 및 실행
ts-node index.ts
```
3. tsconfig.json 설정

프로젝트의 루트 디렉터리에 tsconfig.json 파일을 생성하여 TypeScript 컴파일러 옵션을 설정할 수 있다
```json
{
  "compilerOptions": {
    // 컴파일된 JavaScript의 버전 설정
    "target": "ES6",
    
    // 모듈 시스템 설정
    "module": "commonjs",
    
    // JavaScript 파일 생성 경로
    "outDir": "./dist",
    
    // 소스 파일 경로
    "rootDir": "./src",
    
    // 엄격한 타입 체크 활성화
    "strict": true,
    
    // CommonJS 모듈을 ES6 모듈 형식으로 가져올 수 있게 함
    "esModuleInterop": true,
    
    // 대소문자 구분하여 파일 참조
    "forceConsistentCasingInFileNames": true,
    
    // JavaScript 파일도 함께 사용
    "allowJs": true,
    
    // DOM API 타입 정의 포함
    "lib": ["DOM", "ES6"]
  },
  // 컴파일할 파일 경로 지정
  "include": ["src/**/*"],
  // 컴파일에서 제외할 파일 경로 지정
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

### 실제 적용
예를 들어, API 응답 데이터를 처리하는 경우(jsonplaceholder는 가짜 JSON 응답을 받을 수 있도록 제작된 사이트)
```ts
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function fetchTodo(id: number): Promise<Todo> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  const todo = await response.json();
  return todo;
}

fetchTodo(1).then((todo) => {
  console.log(todo.title);  // 자동 완성 지원
  console.log(todo.status); // 컴파일 에러 발생 (존재하지 않는 프로퍼티)
});
```

## 결론
TypeScript는 JavaScript의 유연성을 유지하면서도 강력한 타입 시스템을 제공한다. 특히 규모가 있는 프로젝트에서 코드의 안정성과 유지보수성을 크게 향상시킬 수 있다. IDE 지원과 함께 개발자 경험도 크게 개선되어, 현대 웹 개발에서 필수적인 도구로 자리잡았다고 생각한다.