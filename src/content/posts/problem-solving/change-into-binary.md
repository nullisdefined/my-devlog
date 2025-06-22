---
title: "무제 파일"
slug: "change-into-binary"
date: 2024-12-06
tags: []
category: "Problem Solving"
draft: true
views: 0
---
## 문제 설명
0과 1로 이루어진 문자열 x에 대한 이진 변환을 다음과 같이 정의한다.
1. x의 모든 0을 제거
2. x의 길이를 c라고 하면, c를 이진수로 표현한 문자열로 바꿈

예를 들어, x = "0111010"이라면:

1. x의 모든 0을 제거하면 "1111"이 됨
2. "1111"의 길이는 4이므로, x를 "100"으로 바꿈

이러한 이진 변환을 계속해서 실행했을 때, "1"이 될 때까지의 이진 변환 횟수와 제거된 0의 개수를 구해야 한다.

## 구현 코드

```js
function solution(s) {
    let curBinary = s;
    let cnt = 0;     // 이진 변환 횟수
    let cntZero = 0; // 제거된 0의 개수
    
    while(curBinary !== "1") {
        let curZero = 0;
        for(let i = 0; i < curBinary.length; ++i) {
            if(curBinary[i] === "0") {
                cntZero++;
                curZero++;
            }
        }
        curBinary = (curBinary.length - curZero).toString(2);    
        cnt++;
    }
    
    return [cnt, cntZero];
}
```
문자열을 순회하여 0의 개수를 세며, 이진수의 변환에는 toString 메서드를 사용한 방법

## 최적화된 코드
문자열의 순회 대신 JavaScript 내장 메서드인 replaceAll을 사용하여 조금 더 효율적인 코드를 작성할 수 있었다. replaceAll의 경우 내부적으로 문자열을 순회하는 방식은 동일해서 성능상의 이점은 없지만 가독성이 조금 더 높아졌다.

```js
function solution(s) {
    let curBinary = s;
    let cnt = 0;
    let cntZero = 0;
    
    while(curBinary !== "1") {
        // 현재 문자열의 길이 저장
        let originalLength = curBinary.length;
        // 모든 0 제거
        curBinary = curBinary.replaceAll("0", "");
        // 제거된 0의 개수 계산
        let curZero = originalLength - curBinary.length;
        
        cntZero += curZero;
        // 남은 1의 개수를 이진수로 변환
        curBinary = curBinary.length.toString(2);
        cnt++;
    }
    
    return [cnt, cntZero];
}
```