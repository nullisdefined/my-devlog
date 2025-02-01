---
title: "[프로그래머스] 실패율"
slug: "lessons-42889"
date: 2025-01-31
tags: ["JavaScript", "Array"]
category: "Problem Solving"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9da43d23144a48a883255434f24e1628.png"
draft: true
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9da43d23144a48a883255434f24e1628.png)

문제 링크: https://school.programmers.co.kr/learn/courses/30/lessons/42889

## 문제 설명

슈퍼 게임 개발자 오렐리는 큰 고민에 빠졌다. 그녀가 만든 프랜즈 오천성이 대성공을 거뒀지만, 요즘 신규 사용자의 수가 급감한 것이다. 원인은 신규 사용자와 기존 사용자 사이에 스테이지 차이가 너무 큰 것이 문제였다.

이 문제를 어떻게 할까 고민 한 그녀는 동적으로 게임 시간을 늘려서 난이도를 조절하기로 했다. 역시 슈퍼 개발자라 대부분의 로직은 쉽게 구현했지만, 실패율을 구하는 부분에서 위기에 빠지고 말았다. 오렐리를 위해 실패율을 구하는 코드를 완성하라.

- 실패율은 다음과 같이 정의한다.
    - 스테이지에 도달했으나 아직 클리어하지 못한 플레이어의 수 / 스테이지에 도달한 플레이어 수

전체 스테이지의 개수 N, 게임을 이용하는 사용자가 현재 멈춰있는 스테이지의 번호가 담긴 배열 stages가 매개변수로 주어질 때, 실패율이 높은 스테이지부터 내림차순으로 스테이지의 번호가 담겨있는 배열을 return 하도록 solution 함수를 완성하라.

### 제약 조건

- 스테이지의 개수 N은 `1` 이상 `500` 이하의 자연수이다.
- stages의 길이는 `1` 이상 `200,000` 이하이다.
- stages에는 `1` 이상 `N + 1` 이하의 자연수가 담겨있다.
	- 각 자연수는 사용자가 현재 도전 중인 스테이지의 번호를 나타낸다.
	- 단, `N + 1` 은 마지막 스테이지(N 번째 스테이지) 까지 클리어 한 사용자를 나타낸다.
- 만약 실패율이 같은 스테이지가 있다면 작은 번호의 스테이지가 먼저 오도록 하면 된다.
- 스테이지에 도달한 유저가 없는 경우 해당 스테이지의 실패율은 `0` 으로 정의한다.

### 입출력 예

| N   | stages                   | result      |
| --- | ------------------------ | ----------- |
| 5   | [2, 1, 2, 6, 2, 4, 3, 3] | [3,4,2,1,5] |
| 4   | [4,4,4,4,4]              | [4,1,2,3]   |

## 문제 분석 및 풀이

문제에서 새 용어를 정의하는 부분은 반드시 짚고 넘어가는 것이 좋다.
실패율이란 해당 스테이지에 도달한 적이 있는 사용자 중 아직 클리어하지 못한 사용자의 비율을 말한다.
stage는 20만까지 입력될 수 있으므로 시간 초과를 방지하기 위해서 정렬 알고리즘의 시간 복잡도는 O(NlogN)이어야 한다. 만약 시간 복잡도가 O(N^2)인 알고리즘을 사용한다면 시간 초과가 발생할 수 있다.

### 답안 코드

```js
function solution(N, stages) {
    const challenger = new Array(N+2).fill(0);
    
    stages.forEach((stage) => {
        challenger[stage]++;
    });
    
    const fails = {};
    let total = stages.length;
    
    for(let i=1; i<N+1; ++i) {
        if (challenger[i] === 0) {
            fails[i] = 0;
            continue;
        }
        
        fails[i] = challenger[i] / total;
        total -= challenger[i];
    }
    
    return Object.entries(fails).sort((a, b) => b[1] - a[1]).map((e) => Number(e[0]));
}
```