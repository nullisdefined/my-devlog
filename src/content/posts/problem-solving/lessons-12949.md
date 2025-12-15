---
title: "[프로그래머스] 행렬의 곱셈"
slug: "lessons-12949"
date: 2025-01-31
tags: ["JavaScript", "Array"]
category: "Problem Solving"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9da43d23144a48a883255434f24e1628.png"
draft: true
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9da43d23144a48a883255434f24e1628.png)

문제 링크: https://school.programmers.co.kr/learn/courses/30/lessons/12949

## 문제 설명
2차원 행렬 arr1과 arr2를 입력받아, arr1에 arr2를 곱한 결과를 반환하는 함수, solution을 완성해주세요.

### 제약 조건
- 행렬 arr1, arr2의 행과 열의 길이는 2 이상 100 이하입니다.
- 행렬 arr1, arr2의 원소는 -10 이상 20 이하인 자연수입니다.
- 곱할 수 있는 배열만 주어집니다.

### 입출력 예
| arr1                              | arr2                              | return                                     |
| --------------------------------- | --------------------------------- | ------------------------------------------ |
| [[1, 4], [3, 2], [4, 1]]          | [[3, 3], [3, 3]]                  | [[15, 15], [15, 15], [15, 15]]             |
| [[2, 3, 2], [4, 2, 4], [3, 1, 4]] | [[5, 4, 3], [2, 4, 1], [3, 1, 1]] | [[22, 22, 11], [36, 28, 18], [29, 20, 14]] |

## 문제 분석 및 풀이
두 배열의 최대 데이터 개수가 100개라 시간 복잡도를 신경 쓰지 않아도 된다.
또 곱할 수 있는 배열만 주어지므로 예외 처리도 필요 없다.

### 답안 코드
```js
function solution(arr1, arr2) {
    const answer = [];
    for(let i=0; i<arr1.length; ++i) {
        answer.push(new Array(arr2[0].length).fill(0));
    }

    // 첫 번째 행렬의 행 정하기
    for(let i=0; i<arr1.length; ++i) {
        // 두 번째 행렬의 열 정하기
        for(let j=0; j<arr2[0].length; ++j) {
            let value = 0;
            for(let k=0; k<arr1[0].length; ++k) {
                value += arr1[i][k] * arr2[k][j];
            }
            answer[i][j] = value;
        }
    }

    return answer;
}
```