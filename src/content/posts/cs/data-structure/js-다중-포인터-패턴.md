---
title: "[JS] 다중 포인터 패턴"
date: 2024-12-11
tags: ["JavaScript"]
category: "CS/Data Structure"
thumbnail: ""
draft: true
---

다중 포인터 패턴은 배열이나 문자열과 같은 선형 구조에서 두 개 이상의 포인터를 가지고 데이터를 처리하는 알고리즘 패턴이다. 이 패턴은 특히 정렬된 배열에서 효율적으로 값을 찾거나 비교할 때 유용하다.

## 기본 개념
다중 포인터 패턴의 핵심 개념은 다음과 같다.
1. 보통 배열의 다른 위치에서 시작하는 두 개의 포인터를 사용
2. 특정 조건에 따라 포인터들을 이동
3. 중첩 반복문을 사용하지 않고 O(n)의 시간 복잡도를 가짐

## 예제1: 정렬된 배열에서 합이 0인 쌍 찾기
먼저 가장 쉽게 떠올릴 수 있는 아이디어로 중첩 반복문이 있다.
```js
function sumZero(arr) {
    for(let i = 0; i < arr.length; i++) {
        for(let j = i + 1; j < arr.length; j++) {
            if(arr[i] + arr[j] === 0) {
                return [arr[i], arr[j]];
            }
        }
    }
    return undefined;
}
```

다중 포인터 패턴을 사용한 최적화된 코드는 다음과 같다.
```js
function sumZero(arr) {
    let left = 0;                    // 왼쪽 포인터
    let right = arr.length - 1;      // 오른쪽 포인터
    
    while(left < right) {
        let sum = arr[left] + arr[right];
        
        if(sum === 0) {
            return [arr[left], arr[right]];
        } else if(sum > 0) {
            right--;     // 합이 크면 오른쪽 포인터를 왼쪽으로
        } else {
            left++;      // 합이 작으면 왼쪽 포인터를 오른쪽으로
        }
    }
    return undefined;
}

console.log(sumZero([-3,-2,-1,0,1,2,3])); // [-3,3]
console.log(sumZero([-2,0,1,3]));         // undefined
console.log(sumZero([1,2,3]));            // undefined
```
- 0이 있을 수 있기 때문에 `left < right`에서 등호가 빠져야 함

## 예제2: 중복 값 카운트
정렬된 배열에서 고유한 값을 세는 문제도 다중 포인터 패턴으로 해결할 수 있다.
```js
function countUniqueValues(arr) {
    if(arr.length === 0) return 0;
    
    let i = 0;
    for(let j = 1; j < arr.length; j++) {
        if(arr[i] !== arr[j]) {
            i++;
            arr[i] = arr[j];
        }
    }
    return i + 1;
}

console.log(countUniqueValues([1,1,1,1,1,2]));                  // 2
console.log(countUniqueValues([1,2,3,4,4,4,7,7,12,12,13]));    // 7
console.log(countUniqueValues([]));                             // 0
```


---
이 프로젝트의 모든 소스 코드는 GitHub에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영입니다.