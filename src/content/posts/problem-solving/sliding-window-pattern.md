---
title: "[JS] 슬라이딩 윈도우 패턴"
slug: "sliding-window-pattern"
date: 2025-01-04
tags: ["JavaScript"]
category: "Problem Solving"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/36ecfd89922696e1b8edfa4107c40ac0.png"
draft: true
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/36ecfd89922696e1b8edfa4107c40ac0.png)


슬라이딩 윈도우 패턴은 배열이나 문자열과 같은 연속된 데이터를 효율적으로 처리하기 위해 사용하는 문제 해결 패턴 중 하나이다. 이 패턴은 중첩 반복문을 대체하여 시간 복잡도를 개선할 수 있다.

## 기본 개념
슬라이딩 윈도우 패턴의 핵심은 다음과 같다.
1. 초기 윈도우 설정: 연속된 데이터의 첫 구간에 대해 초기 계산을 수행
2. 윈도우 이동: 다음 데이터로 이동할 때 이전 데이터를 제거하고 새 데이터를 추가
3. 결과 업데이트: 이동하며 원하는 결과(최대값, 최소값 등)를 계산

## 예제 1: 최대 하위 배열 합 계산
배열과 숫자 n을 입력받아, 연속된 n개의 숫자 중 가장 큰 합계를 반환하는 함수 작성하기

```js
function maxSubArraySum(arr, num) {
	if (arr.length < num) return null;

	let maxSum = 0;
	let tempSum = 0;

	// 초기 합계 계산
	for (let i = 0; i < num; ++i) {
		maxSum += arr[i];
	}
	tempSum = maxSum;

	// 슬라이딩 윈도우 시작
	for (let i = num; i < arr.length; ++i) {
		tempSum = tempSum - arr[i - num] + arr[i];
		maxSum = Math.max(maxSum, tempSum);
	}

	return maxSum;
}

console.log(maxSubarraySum([6, 2, 9, 1, 3, 5], 4)); // 17
console.log(maxSubarraySum([1, 2, 5, 2, 8, 1, 5], 2)); // 10
console.log(maxSubarraySum([4, 2, 1, 6], 1)); // 6
console.log(maxSubarraySum([], 3)); // null
```

## 시간 복잡도
- 중첩 반복문을 사용할 경우 O(n^2)
- 슬라이딩 윈도우 패턴을 적용할 경우 O(n)

---
이 글은 Udemy의 [【한글자막】 JavaScript 알고리즘 & 자료구조 마스터클래스](https://www.udemy.com/course/best-javascript-data-structures/) 강의를 바탕으로 작성되었습니다.