---
title: "ES15 / ECMAScript 2025: What’s New in JavaScript? 🎉✨"
slug: "es15-ecmascript-2025"
date: 2025-01-02
tags: ["JavaScript", "PatternMatching", "Set", "TemporalAPI"]
thumbnail: "https://miro.medium.com/v2/resize:fit:1400/1*J6tqpXBB9FkZeW8peS5HWg.png"
draft: false
views: 0
---
![](https://miro.medium.com/v2/resize:fit:1400/1*J6tqpXBB9FkZeW8peS5HWg.png)
새로운 ECMAScript 버전, ES15(ECMAScript 2024)가 드디어 등장했다.

## 1. 패턴 매칭(Pattern Matching)
JavaScript가 한층 똑똑해졌다. 이제 패턴 매칭을 통해 객체의 구조를 간단하고 직관저긍로 확인할 수 있다. 복잡한 조건문을 작성하는 대신, 원하는 패턴에 맞춰 간결하게 처리할 수 있다.

### 기존 방식
```js
function checkAnimal(animal) {
    if (animal.type === "dog" && animal.sound === "woof") {
        return "It's a dog! 🐶";
    } else if (animal.type === "cat" && animal.sound === "meow") {
        return "It's a cat! 🐱";
    } else {
        return "Unknown animal 😕";
    }
}
```

### 새로운 방식
```js
function checkAnimal(animal) {
	return match (animal) {
		{ type: "dog", sound: "woof" } => "It's a dog! 🐶",
		{ type: "cat", sound: "meow" } => "It's a cat! 🐱",
		_=> "Unknown animal 😕"
	};
}
```

코드가 간결해지고 가독성이 좋아져 작업 속도가 빨라질 수 있다.

## 파이프라인 연산자(Pipeline Operator)
파이프라인 연산자 (`|>`)가 도입되면서 코드가 훨씬 읽기 쉬워졌다. 이제 함수를 체인처럼 연결하여 데이터 흐름을 명확하게 표현할 수 있다.

### 기존 방식
```js
const result = process(clean(parse(inputData)));
```

###  새로운 방식
```js
const result = inputData
	|> parse
	|> clean
	|> process;
```

데이터와 함수를 릴레이터럼 매끄럽게 전달할 수 있다. 중첩 괄호로 골치 아파할 필요가 없다.

## Async Context
비동기 작업이 꼬여서 디버깅에 시간을 뺏긴 적이 있는가? 이제 Async Context로 이러한 문제를 해결할 수 있다. 비동기 작업의 컨텍스트를 자동으로 추적하여, 요청 상태를 명확하게 알 수 있다.

### 기존 방식
```js
async function fetchData() {
	const response = await apiCall();
	// oops... where did my context go?!
}
```

### 새로운 방식
```js
async function fetchData() {
	const context = getCurrentContext();
	const response = await apiCall();
	return response;
}
```

마치 비동기 작업을 위한 GPS와 같다. 이제 비동기 작업이 어디로 흘러가는지 명확히 알 수 있다.

## Set 메서드
이제 JavaScript의 Set도 강력해졌다. 새로운 메서드 `union`, `intersection`, `difference` 추가되어 데이터를 훨씬 쉽게 처리할 수 있다.

### 기존 방식
```js
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);
const union = new Set([...setA, ...setB]);
```

### 새로운 방식
```js
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);
const union = setA.union(setB);
```

## 새로운 Array 메서드
배열을 더 강력하게 관리할 수 있도록 `groupBy`와 `toSorted` 같은 새로운 메서드가 추가되었다.

### 기존 방식
```js
const arr = [1, 4, 2, 3];
const sortedArr = [...arr].sort((a, b) => a - b);
```

### 새로운 방식
```js
const arr = [1, 4, 2, 3];
const sortedArr = arr.toSorted(); // 원본 배열은 건들지 않음
```

데이터 정렬과 그룹핑이 훨씬 간단하고 직관적으로 바뀌었다.

## Temporal API
JavaScript에서 날짜와 시간을 다루는 건 늘 어렵고 번거로웠다. 하지만 Temporal API가 등장하면서 이 모든 불편함이 사라졌다.

### 기존 방식
```js
const date = new Date('2023-12-01');
const nextMonth = new Date(date.setMonth(date.getMonth() + 1));
```

### 새로운 방식
```js
const date = Temporal.PlainDate.from('2023-12-01');
const nextMonth = date.add({ months: 1 });
```

날짜와 시간을 다루는 작업이 훨씬 간단하고 논리적으로 바뀌었다.

## 마치며
ES15 / ECMAScript 2024는 JavaScript의 강력함과 즐거움을 한 단계 더 끌어올렸다. 이번 업데이트로 패턴 매칭, 파이프라인 연산자, Set과 배열 메서드, 날짜 관리 등 다양한 작업이 훨씬 간단해졌다.


> [!NOTE] 이 글은 Bhuwan Chettri의 [ES15 / ECMAScript 2025: What’s New in JavaScript? 🎉✨](https://javascript.plainenglish.io/es15-ecmascript-2024-whats-new-in-javascript-2a19494a5749)를 한글로 번역한 글입니다.