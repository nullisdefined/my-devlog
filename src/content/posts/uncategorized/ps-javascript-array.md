---
title: "[JS] 배열"
slug: "ps-javascript-array"
date: 2025-01-28
tags: []
draft: true
views: 0
---
JavaScript에서 배열은 데이터를 저장하고 관리하는 데 가장 많이 사용되는 자료구조 중 하나이다.
배열은 여러 가지 방식으로 선언하고 조작할 수 있으며, 다양한 내장 메서드를 제공한다.

## 1. 배열 선언

#### 리터럴 이용
```js
const arr = [0, 0, 0, 0, 0, 0];
```

#### 배열 생성자 이용
```js
const arr1 = new Array(6); // [undefined, undefined, undefined, undefined, undefined, undefined]
const arr2 = [...new Array(6)].map((_, i) => i + 1); // [1, 2, 3, 4, 5, 6]
```

#### Array.fill() 함수 이용
```js
const arr = new Array(6).fill(0); // [0, 0, 0, 0, 0, 0]
```

## 2. 배열과 차원

#### 1차원 배열
1차원 배열은 가장 기본적인 배열 형태다.

```js
const arr = [1, 2, 3, 4, 5];
```

#### 2차원 배열
2차원 배열은 배열의 배열 형태로 선언할 수 있다.

```js
const arr = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
console.log(arr[2][3]); // 12
arr[2][3] = 15;
console.log(arr[2][3]); // 15
```

다음과 같이 선언할 수도 있다.

```js
const arr = [...new Array(3)].map((_, i) => new Array(4).fill(i));
// [[0,0,0,0], [1,1,1,1], [2,2,2,2]]
```

## 3. 배열의 효율성

#### 배열 연산의 시간 복잡도
- 특정 위치 접근: **O(1)**
- 마지막에 삽입/삭제: **O(1)**
- 앞이나 중간에 삽입/삭제: **O(N)**

#### 배열을 선택할 때 고려할 점
1. **메모리 크기 확인**: 보통 1차원 배열은 10,000,000개, 2차원 배열은 3000×3000 크기를 최대로 가정
2. **중간 삽입이 많은지 확인**: 중간 삽입이 많다면 다른 자료 구조를 고려

## 4. 배열 조작 메서드

### 배열에 데이터 추가

#### `push()` - 끝에 추가
```js
let arr = [1, 2, 3];
arr.push(4); // [1, 2, 3, 4]
```

#### `concat()` - 배열 병합
```js
let arr = [1, 2, 3];
arr = arr.concat([4, 5]); // [1, 2, 3, 4, 5]
```

#### 스프레드 연산자 활용
```js
let arr = [1, 2, 3];
arr = [...arr, ...[4, 5]]; // [1, 2, 3, 4, 5]
```

#### `unshift()` - 앞에 추가
```js
const arr = [1, 2, 3];
arr.unshift(0); // [0, 1, 2, 3]
```

#### `splice()` - 중간 데이터 추가
```js
const arr = [1, 2, 3, 4, 5];
arr.splice(2, 0, 9999); // [1, 2, 9999, 3, 4, 5]
```

### 배열에서 데이터 삭제

#### `pop()` - 마지막 데이터 삭제
```js
const arr = [1, 2, 3, 4, 5];
const poppedElement = arr.pop(); // 5
console.log(arr); // [1, 2, 3, 4]
```

#### `shift()` - 첫 번째 데이터 삭제
```js
const arr = [1, 2, 3, 4, 5];
const shiftedElement = arr.shift(); // 1
console.log(arr); // [2, 3, 4, 5]
```

#### `splice()` - 중간 데이터 삭제
```js
const arr = [1, 2, 3, 4, 5];
const removedElements = arr.splice(2, 2); // [3, 4]
console.log(arr); // [1, 2, 5]
```

## 5. 고차 함수 활용

#### `map()` - 배열 요소 반환
```js
const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(num => num * num); // [1, 4, 9, 16, 25]
```

#### `filter()` - 조건에 맞는 요소만 반환
```js
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(num => num % 2 === 0);
```

#### `reduce()` - 배열의 모든 요소를 하나로 합침
```js
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a+ b, 0);
```