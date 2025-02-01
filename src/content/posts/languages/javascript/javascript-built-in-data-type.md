---
title: "[JS] 빌트인 데이터 타입"
slug: "javascript-built-in-data-type"
date: 2025-01-31
tags: ["JavaScript"]
category: "Languages/JavaScript"
draft: true
---
JavaScript에서는 언어 자체에서 제공하는 원시 타입(Primitive Type)과 참조 타입(Reference Type)이 존재한다.

## 1. 원시 타입(Primitive Type)

원시 타입에는 다음과 같은 데이터 타입을 포함한다.

- 숫자(Number)
- 문자열(String)
- 불리언(Boolean)
- BigInt
- null
- undefined

### 숫자(Number)

JavaScript에서는 모든 숫자를 `number` 타입으로 정의한다.
이는 정수, 실수, 심지어 무한대 값까지 포함된다.

```js
console.log(typeof 10); // "number"
console.log(typeof 3.14); // "number"
console.log(typeof Infinity); // "number"
```

#### 숫자 연산

JavaScript는 기본적인 수학 연산을 지원하며, `Math` 객체를 통해 다양한 수학 함수를 제공한다.

```js
console.log(10 + 5); // 덧셈
console.log(10 - 5); // 뺄셈
console.log(10 * 5); // 곱셈
console.log(10 / 5); // 나눗셈
console.log(Math.abs(-10)); // 절댓값
```

#### 숫자 비교 연산

```js
console.log(Number.EPSILON); // 2.220446049250313e-16
let a = 0.1 + 0.1 + 0.1;
let b = 0.3;
console.log(a - b); // 5.551115123125783e-17
```

### 문자열(String)

JavaScript에서는 개별 문자를 저장하는 `char` 타입이 존재하지 않으며, 모든 문자는 `string` 타입으로 저장된다.

#### 문자열 정의

문자열은 작은따옴표('), 큰따옴표("), 백틱(\`)을 사용하여 선언할 수 있다.
백틱으로 선언한 것을 템플릿 리터럴이라고 한다.

```js
const str1 = 'Hello';
const str2 = "World";
const str3 = `Hello, ${str2}!`;
console.log(str3); // "Hello, World!"
```

#### 문자열 메서드

```js
const str = "Hello, World!";
console.log(str.length); // 문자열 길이: 13
console.log(str.split(",")); // ["Hello", " World!"]
console.log(str.startsWith("Hello")); // true
console.log(str.endsWith("World!")); // true
console.log(str.includes("World")); // true
console.log(str.replace("World", "JavaScript")); // "Hello, JavaScript!"
console.log(str.toUpperCase()); // "HELLO, WORLD!"
console.log(str.toLowerCase()); // "hello, world!"
console.log(str.trim()); // 양쪽 공백 제거
```

### 불리언(Boolean)

불리언 값은 `true` 또는 `false` 두 가지 값만 가질 수 있다.

```js
console.log(Boolean(0)); // false
console.log(Boolean(1)); // true
console.log(Boolean("")); // false
console.log(Boolean("hello")); // true
```

### BigInt

JavaScript에서 매우 큰 정수를 다루기 위해 `BigInt` 타입이 존재한다.

```js
console.log(100000000000000000000n - 123456n);
console.log(BigInt(100000000000000000000) - BigInt(123456));
```

## 2. 참조 타입(Reference Type)

참조 타입에는 오브젝트(Object)와 함수(Function)가 포함된다.

### 오브젝트(Object)

```js
const obj = { name: 'gildong' };
obj.age = 30; // 요소 추가
console.log(obj.age); // 30

delete obj.age; // 요소 삭제
console.log(obj.age); // undefined
```

### 배열(Array)

```js
const arr = [1, 2, 3, 4];
console.log(arr.length); // 4
arr.push(5); // 요소 추가
console.log(arr); // [1, 2, 3, 4, 5]
arr.pop(); // 마지막 요소 제거
console.log(arr); // [1, 2, 3, 4]
```


## 3. 함수(Function)

JavaScript에서 함수는 일급 객체(First-Class-Object)다.
즉, 변수에 할당할 수 있고, 인자로 전달할 수 있으며, 함수에서 반환할 수도 있다.

```js
// 일반적인 함수 정의
function add(a, b) {
    return a + b;
}

// 화살표 함수
const multiply = (a, b) => a * b;
```

## 4. 문법 설탕(Syntatic Sugar)

### 구조 분해 할당(Destructuring Assignment)

구조 분해 할당을 이용해 두 변수의 값을 교환하는 swap 로직을 간단히 구현할 수 있다.

```js
let a = 5;
let b = 10;
[a, b] = [b, a];
console.log(a, b); // 10, 5
```

### 스프레드 연산자(Spread Operator)

객체 병합 및 중복 제거 등에 활용할 수 있다.

```js
const obj1 = { name: "Alice" };
const obj2 = { age: 25 };
const mergedObj = { ...obj1, ...obj2 };
console.log(mergedObj); // { name: "Alice", age: 25 }

const names = ['Lee', 'Kim', 'Park', 'Lee', 'Kim'];
const uniqueNames = [...new Set(names)];
console.log(uniqueNames); // ['Lee', 'Kim', 'Park']
```

### 논리 연산자 활용

`&&`와 `||`를 활용하여 조건문을 간결하게 표현할 수 있다.

```js
const showAddress = true;
const company = {
    name: "GoldenRabbit",
    ...showAddress && { address: "Seoul" }
};
console.log(company);
```

## 정리

1. JavaScript의 데이터 타입은 **원시 타입**(숫자, 문자열, 불리언, BigInt, null, undefined)과 **참조 타입**(오브젝트, 함수)으로 나뉜다.
2. 부동소수점 오차를 항상 고려해야 한다.
3. 함수는 일급 객체이며, 화살표 함수로도 정의할 수 있다.
4. 구조 분해 할당, 스프레드 연산자, 논리 연산자를 활용하여 더 간결한 코드를 작성할 수 있다.