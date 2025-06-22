---
title: "[프로그래머스] 동영상 재생기"
slug: "lessons-340213"
date: 2025-01-29
tags: []
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9da43d23144a48a883255434f24e1628.png"
draft: true
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9da43d23144a48a883255434f24e1628.png)
문제 링크: https://school.programmers.co.kr/learn/courses/30/lessons/340213*

## 문제 설명

동영상 재생기는 다음과 같은 세 가지 기능을 지원한다.

1. 10초 전으로 이동: 현재 위치에서 10초 전으로 이동한다. 만약 현재 위치가 10초 미만이라면 영상의 처음으로 이동한다.
2. 10초 후로 이동: 현재 위치에서 10초 후로 이동한다. 영상의 남은 시간이 10초 미만이라면 영상의 끝으로 이동한다.
3. 오프닝 건너뛰기: 현재 위치가 오프닝 구간이라면 자동으로 오프닝 종료 위치로 이동한다.

### 제약 조건

- commands 배열의 길이는 최대 100이다.
- 입력되는 시간은 항상 유효하며, 동영상의 범위를 벗어나지 않는다.

### 입출력

- 동영상 길이, 현재 재생 위치, 오프닝 구간(시작과 종료), 명령어 리스트를 입력받는다.
- 각 시간은 "mm:ss" 형식으로 제공된다.

## 문제 분석 및 풀이

### 답안 코드

```js
function solution(video_len, pos, op_start, op_end, commands) {
    // 시간 문자열을 초로 변환하는 함수
    const toSecond = (timeStr) => {
        const [min, sec] = timeStr.split(":").map(Number);
        return min * 60 + sec;
    };
    
    // 초를 시간 문자열로 변환하는 함수
    const toTimeStr = (s) => {
        const min = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };
    
    // 초기 변수 설정
    let sec = toSecond(pos); // 현재 위치를 초로 변환
    const opStartSec = toSecond(op_start); // 오프닝 시작 시간
    const opEndSec = toSecond(op_end); // 오프닝 종료 시간
    const videoSec = toSecond(video_len); // 동영상 전체 길이

    // 명령어 처리
    for (const command of commands) {
        // 오프닝 구간에 있는 경우 오프닝 끝으로 이동
        if (sec >= opStartSec && sec <= opEndSec) {
            sec = opEndSec;
        }
        // next 명령 처리
        if (command === 'next') {
            sec = Math.min(sec + 10, videoSec); // 동영상 끝을 초과하지 않도록 처리
        }
        // prev 명령 처리
        if (command === 'prev') {
            sec = Math.max(sec - 10, 0); // 동영상 처음을 벗어나지 않도록 처리
        }
    }

    // 마지막으로 오프닝 구간에 있으면 다시 오프닝 끝으로 이동
    if (sec >= opStartSec && sec <= opEndSec) {
        sec = opEndSec;
    }

    // 최종 위치를 문자열로 변환하여 반환
    return toTimeStr(sec);
}

```

1. map(Number)

문자열 배열을 숫자로 변환할 때 `map(Number)`를 사용하면 간결하고 직관적으로 표현할 수 있다.
예를 들어, `"12:34".split(":").map(Number)`를 사용하면 `[12, 34]`으로 변환된다.

2. 배열 디스트럭처링

split으로 나눈 값을 배열 디스트럭처링으로 변수에 할당하여 깔끔하게 표현할 수 있다.

```js
const [minutes, seconds] = "12:34".split(":").map(Number);
```

3. String.prototype.padStart()

시간 형식처럼 고정된 길이의 문자열이 필요할 때, padStart를 사용하면 간단하게 표현할 수 있다.

```js
const time = `${String(5).padStart(2, '0')}:${String(7).padStart(2, '0')}`; // "05:07"
```

4. for...of 반복문

배열을 순회할 때 for...of를 사용하면 각 요소를 간단하게 접근할 수 있다.

```js
for (const command of commands) {
    console.log(command); // "next", "prev", ...
}
```