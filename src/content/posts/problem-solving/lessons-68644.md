---
title: "[프로그래머스] 두 개 뽑아서 더하기"
slug: "lessons-68644"
date: 2025-01-31
tags: ["JavaScript", "Array"]
category: "Problem Solving"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9da43d23144a48a883255434f24e1628.png"
draft: true
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9da43d23144a48a883255434f24e1628.png)

문제 링크: https://school.programmers.co.kr/learn/courses/30/lessons/68644

## 문제 설명

정수 배열 numbers가 주어집니다. numbers에서 서로 다른 인덱스에 있는 두 개의 수를 뽑아 더해서 만들 수 있는 모든 수를 배열에 오름차순으로 담아 return 하도록 solution 함수를 완성해주세요.

### 제약 조건

- numbers의 길이는 2 이상 100 이하이다.
- numbers의 모든 수는 0 이상 100 이하이다.

### 입출력 예

| numbers     | result        |
| ----------- | ------------- |
| [2,1,3,4,1] | [2,3,4,5,6,7] |
| [5,0,2,7]   | [2,5,7,9,12]  |

## 문제 분석 및 풀이

숫자 배열에서 서로 다른 두 수를 선택해 더한 결과를 모두 구하고 오름차순으로 정렬해 반환을 요구하는 문제다. 중복값은 허용하지 않는다.
numbers의 최대 데이터 개수는 100이므로 시간 복잡도는 고려하지 않아도 된다.

다음 과정으로 풀 수 있다.

1. 배열에서 두 수를 선택하는 모든 경우의 수 구하기
2. 과정 1에서 구한 수를 새로운 배열에 저장하고 중복값을 제거
3. 배열을 오름차순으로 정렬해 반환

### 답안 코드

```js
function solution(numbers) {
    let arr = [];
		
    for(let i = 0; i < numbers.length; ++i) {
        for(let j = 0; j < i; ++j) {
            arr.push(numbers[i] + numbers[j]);
        }
    }
    
    return [...new Set(arr)].sort((a, b) => a - b);
}
```