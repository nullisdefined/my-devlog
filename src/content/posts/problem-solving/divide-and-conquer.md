---
title: "[JS] 분할 정복 패턴"
slug: "divide-and-conquer"
date: 2025-01-04
tags: ["JavaScript"]
category: "Problem Solving"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/fef061c6a4c61eaa9b2a6f5577c8f03e.png"
draft: true
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/fef061c6a4c61eaa9b2a6f5577c8f03e.png)

분할 정복은 큰 문제를 작은 문제로 분할하고, 이를 해결한 뒤 합쳐서 전체 문제를 해결하는 알고리즘 문제 해결 패턴이다. 이는 특히 정렬 및 탐색 알고리즘에서 많이 사용된다.

## 기본 개념
1. 분할(Divide): 문제를 더 작은 하위 문제로 나눈다.
2. 정복(Conquer): 나눈 하위 문제를 해결한다.
3. 결합(Combine): 해결한 하위 문제를 다시 합쳐 전체 문제를 해결한다.

## 대표적인 분할 정복 알고리즘
- 퀵 정렬(Quick Sort)
- 병합 정렬(Merge Sort)
- 이진 탐색(Binary Search)

## 예제1: 이진 탐색(Binary Search)
### 문제
- 정렬된 배열애서 특정 값을 찾아 위치(index) 반환하기
- 만약 찾는 값이 없으면 -1을 반환

```js
function binarySearch(arr, target) {
	let left = 0;
	let right = arr.length - 1;

	while (left <= right) {
		let middle = Math.floor((left + right) / 2);

		if (arr[middle] === target) {
			return middle;
		} else if (arr[middle] < target) {
			left = middle + 1; // 오른쪽 절반 탐색
		} else {
			right = middle - 1; // 왼쪽 절반 탐색
		}
	}

	return -1; // 값이 없으면 -1 반환
}
```
- 찾는 값이 중간 값보다 크면 오른쪽 절반만 탐색
- 찾는 값이 중간 값보다 작으면 왼쪽 절반만 탐색

## 시간 복잡도
- 배열 전체를 탐색하는 경우(선형 탐색): O(n)
- 이진 탐색의 경우: O(log n)

---
이 글은 Udemy의 [【한글자막】 JavaScript 알고리즘 & 자료구조 마스터클래스](https://www.udemy.com/course/best-javascript-data-structures/) 강의를 토대로 공부한 내용을 정리한 것입니다.