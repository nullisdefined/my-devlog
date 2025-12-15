---
title: "빅오(Big-O) 표기법"
slug: "big-o-notation"
date: 2024-11-26
tags: ["Big-O"]
category: "CS/Data Structure"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f33e7091d0a8cb916e89b70eced5c553.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/f33e7091d0a8cb916e89b70eced5c553.png)

효율적인 알고리즘을 작성하기 위해서 먼저 알고리즘의 성능을 평가하는 방법을 이해해야 한다.

## 빅오(Big-O) 표기법이 필요한 이유
개발을 하다 보면 하나의 문제를 해결하기 위한 여러 가지 방법이 존재한다. 예를 들어, 1부터 n까지의 합을 구하는 문제를 생각해보면,
```js
// 방법 1: 반복문 사용
function sumWithFor(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

// 방법 2: 수학적 공식 사용
function sumWithFormula(n) {
  return (n * (n + 1)) / 2;
}

```
이렇게 두 가지 방법이 존재할 때, 어떤 것이 더 좋은 방법일까? 이를 평가하기 위해서 빅오(Big O) 표기법이 필요하다.

### 좋은 코드란?
흔히 좋은 코드의 기준으로 다음과 같은 것들을 이야기한다.
- 실행 속도가 빠른 코드
- 메모리를 적게 사용하는 코드
- 가독성이 좋은 코드
하지만 '실행 속도가 빠르다'는 것은 어떻게 측정할 수 있을까? 단순히 실행 시간을 초 단위로 측정하는 것이 방법일 수 있겠지만, 같은 코드라도 실행하는 컴퓨터의 성능에 따라, 상태에 따라 실행 시간이 달라진다. 

### 빅오 표기법
빅오 표기법은 입력값의 크기에 따른 알고리즘의 성능을 나타내는 방법이다. 정확한 실행 시간을 측정하는 대신, 컴퓨터가 처리해야 하는 연산의 횟수가 어떤 패턴으로 증가하는지를 표현한다.

주요 시간 복잡도는 다음과 같다.
1. O(1): 상수 시간
	- 입력 크기와 관계없이 항상 같은 시간이 걸림
2. O(log n): 로그 시간
	- 입력이 커질수록 처리 시간이 로그함수처럼 증가
3. O(n): 선형 시간
	- 입력에 비례하여 처리 시간이 증가
4. O(n^2): 이차 시간
	- 입력의 제곱에 비례하여 처리 시간이 증가

## 공간 복잡도(Space Complexity)
시간뿐만 아니라 메모리 사용량도 고려해야 한다. JavaScript에서는 다음과 같은 규칙이 적용된다.
- boolean, number, undefined, null은 상수 공간을 사용 (O(1))
- 문자열은 길이에 비례하는 공간을 사용 (O(n))
- 배열과 객체도 크기에 비례하는 공간을 사용 (O(n))

### 실제 적용 예시
앞서 살펴본 1부터 n까지의 합을 구하는 두 방법을 비교해보자.
1. `sumWithFor`: O(n)
    - n번의 반복이 필요하므로 시간 복잡도는 O(n)
    - 변수 하나만 사용하므로 공간 복잡도는 O(1)
2. `sumWithFormula`: O(1)
    - 입력 크기와 관계없이 항상 같은 연산만 수행
    - 시간 복잡도, 공간 복잡도 모두 O(1)

이처럼 수학적 공식을 사용한 방법이 시간 복잡도 측면에서 더 효율적임을 알 수 있다.


> [!NOTE] 이 글은 Udemy에서 [【한글자막】 JavaScript 알고리즘 & 자료구조 마스터클래스](https://www.udemy.com/course/best-javascript-data-structures/) 강의를 토대로 공부한 내용을 정리한 것입니다.