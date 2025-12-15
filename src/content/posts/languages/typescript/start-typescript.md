---
title: "TypeScript 시작하기"
slug: "start-typescript"
date: 2024-11-11
tags: ["TypeScript"]
category: "Languages/TypeScript"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png)

## TypeScript란?
TypeScript는 JavaScript에 타입 시스템을 추가한 프로그래밍 언어이다. Microsoft에서 개발했으며, JavaScript의 상위 집합(Superset)으로 동작한다. 즉, 모든 유효한 JavaScript 코드는 TypeScript 코드이기도 하다.

### 왜 TypeScript가 필요한가?
**JavaScript는 동적 타입 언어로서 유연하지만, 이로 인해 다음과 같은 문제점들이 발생할 수 있다**:
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

## TypeScript 프로젝트 설정

### 기본 설정
1. TypeScript 설치
```shell
npm install -g typescript
```

2. 컴파일 및 실행
```shell

# TypeScript 파일을 JavaScript로 컴파일
tsc index.ts

# 컴파일된 JavaScript 파일 실행
node index.js

# 또는 ts-node를 사용하여 한 번에 컴파일 및 실행
ts-node index.ts
```

2. tsconfig.json 설정
- tsconfig.json 파일은 직접 만들거나 `npx tsc --init` 명령어를 사용할 수 있음
```json
{
  "compilerOptions": {
    // JavaScript 코드로 변환할 때 사용할 ECMAScript 버전 지정
    "target": "ES6",
    // 모듈 시스템 설정
    "module": "CommonJS",
    // 컴파일된 JavaScript 파일이 생성되는 디렉토리
    "outDir": "./dist",
    // TypeScript 소스 파일이 위치한 디렉토리
    "rootDir": "./src",
    // 엄격한 타입-체킹 옵션을 활성화
    "strict": true,
    // CommonJS 모듈을 ES6 모듈 형식으로 가져올 수 있게 함
    // import * as moment from 'moment' 대신 import moment from 'moment' 사용 가능
    "esModuleInterop": true,
    // 파일 이름의 대소문자 구분을 강제
    // Windows에서 대소문자 구분하지 않는 문제 방지
    "forceConsistentCasingInFileNames": true,
    // JavaScript 파일의 컴파일 허용
    // .js와 .jsx 파일도 컴파일 대상에 포함
    "allowJs": true,
    // JavaScript 파일에 대한 타입 검사 활성화
    "checkJs": true,
    // 타입 정의 없이 import 된 라이브러리 허용 여부
    "noImplicitAny": true,
    // 암시적 any 타입으로 표현식과 선언 사용 시 에러 발생
    "noImplicitAny": true,
    // null과 undefined 할당 가능성 체크
    "strictNullChecks": true,
    // 사용 가능한 라이브러리 설정
    "lib": ["DOM", "ES6"],
    // 데코레이터 사용 설정
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    // 소스맵 파일 생성
    // 디버깅 시 TypeScript 소스 확인 가능
    "sourceMap": true,
    // JSX 설정 ("react", "react-native", "preserve" 등)
    "jsx": "react",
    // 모듈 해석 방식 설정
    "moduleResolution": "node",
    // baseUrl과 함께 사용되는 모듈 별칭 설정
    "paths": {
      "@/*": ["src/*"]
    },
    // 모듈 해석의 기준이 되는 기본 디렉토리
    "baseUrl": "."
  },
  // 컴파일 대상에 포함할 파일 패턴
  "include": [
    "src/**/*"
  ],
  // 컴파일 대상에서 제외할 파일 패턴
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```
자세한 내용은 https://www.typescriptlang.org/tsconfig/ 에서 확인할 수 있다.

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

#### 3. 사용 예시
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

TypeScript는 JavaScript의 유연성을 유지하면서도 강력한 타입 시스템을 제공한다. 특히 규모가 있는 프로젝트에서 코드의 안정성과 유지보수성을 크게 향상시킬 수 있다. IDE 지원과 함께 개발자 경험도 크게 개선되어, 현대 웹 개발에서 필수적인 도구로 자리잡았다.