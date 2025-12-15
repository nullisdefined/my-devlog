---
title: "[프로그래머스] 숫자의 표현"
slug: "present-numbers"
date: 2024-12-05
tags: ["프로그래머스"]
category: "Problem Solving"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/336450698cb0b43a1a7133eae93730cd.png"
draft: true
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/336450698cb0b43a1a7133eae93730cd.png)
https://school.programmers.co.kr/learn/courses/30/lessons/12924
연속된 자연수의 합으로 표현될 수 있는 가짓수를 세는 문제

## 시간 초과 발생
처음에는 가장 직관적인 방법으로 코드를 작성했다. 주어진 숫자 n까지 모든 시작점을 순회하면서, 연속된 수를 더해가며 n이 되는 경우를 찾는 방식이다.
```js
function solution(n) {
    var answer = 0;
    for(let i=1; i<=n; ++i) {
        let currentNum = i;
        let sum = 0;

        while(sum < n) {
            sum += currentNum;
            currentNum++;
        }

        if(sum === n) answer++;
    }

    return answer;
}
```

이 코드로 제출했더니 시간초과가 발생했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/40725ac0100d36a822f9733db9d01003.png)

## 다른 방법
시간초과가 발생한 이유는 불필요한 반복 연산이 있었기 때문이라고 생각했다. 그래서 수학적 공식을 사용해서 최대한 시간을 줄이려 했다.
연속된 합을 구하는 문제이므로, 등차수열 합 공식을 활용했고 이를 바탕으로 다음과 같이 코드를 작성했다. 
```js
function solution(n) {
    var answer = 0
    for(let i=1; i<=n; ++i) {
        let temp = n - (i * (1+i)) / 2
        if(temp % i === 0 && temp >= 0) answer++;
        if(temp < 0) break;
    }

    return answer
}
```
- `i`는 연속된 수의 개수를 의미
- `temp = n - (i * (1+i)) / 2`
	- 만약 n=15이고 i=3일 때를 예로 들면
	- temp = 15 - (3 * 4) / 2 = 15 - 6 = 9
	- 9가 3으로 나누어떨어지므로 (9 ÷ 3 = 3)
	- 4, 5, 6으로 15를 만들 수 있음
- 음수가 되면 더 이상 진행할 필요가 없으므로 반복문 종료
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/dbd1dc1748b266bbb72f6c379c57f3e5.png)