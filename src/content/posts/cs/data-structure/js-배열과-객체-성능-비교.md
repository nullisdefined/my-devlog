---
title: "[JS] 배열과 객체 성능 비교"
slug: "js-배열과-객체-성능-비교"
date: 2024-11-26
tags: ["JavaScript", "Object", "Array"]
category: "CS/Data Structure"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3268fadded62ff0a0987d8204616248f.png"
draft: false
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3268fadded62ff0a0987d8204616248f.png)

JavaScript에서 가장 기본적인 데이터 구조인 배열과 객체의 성능을 Big-O로 비교해보자.

## 객체(Object)의 성능
객체는 정렬되지 않은 키-값 쌍의 데이터 구조를 지닌다. 정렬이 필요 없을 때 빠른 접근, 삽입, 제거가 필요한 경우 적합하다.

```js
let instructor = {
  firstName: "Kelly",
  isInstructor: true,
  favoriteNumbers: [1, 2, 3, 4]
};
```

### 객체의 시간 복잡도
- 삽입 - O(1)
- 제거 - O(1)
- 탐색 - O(n)
- 접근 - O(1)

객체의 주요 메서드들의 빅오:
```js
// 모두 O(n)
console.log(Object.keys(instructor));    // ["firstName", "isInstructor", "favoriteNumbers"]
console.log(Object.values(instructor));  // ["Kelly", true, [1,2,3,4]]
console.log(Object.entries(instructor)); // [["firstName","Kelly"], ["isInstructor",true], ...]

// O(1)
console.log(instructor.hasOwnProperty("firstName")); // true
```

객체는 정렬이 되어있지 않기 때문에 빠른 접근, 삽입, 제거가 가능하다. 하지만 Object.keys(), Object.values(), Object.entries()와 같이 객체 전체를 순회해야 하는 메서드들은 O(n)의 시간 복잡도를 가진다.

## 배열(Array)의 성능
배열은 정렬된 데이터 구조이다. 각 엘리먼트는 정수인 인덱스를 가지며, 이 인덱스를 통해 접근할 수 있다.

### 배열의 시간 복잡도
- 삽입 - It depends...
- 제거 - It depends...
- 탐색 - O(n)
- 접근 - O(1)
삽입과 제거에서 'It depends...'라고 표현한 이유는 배열의 끝에 삽입(제거)하는 경우 O(1), 앞에 삽입(제거)하는 경우 O(n)의 시간 복잡도를 가지기 때문이다.

배열의 주요 메서드들의 빅오:
```js
let numbers = [1, 2, 3, 4, 5];

// 접근: O(1)
numbers[2];  // 3

// 끝에 삽입: O(1)
numbers.push(6);   // [1, 2, 3, 4, 5, 6]

// 끝에서 제거: O(1)
numbers.pop();     // [1, 2, 3, 4, 5]

// 앞에 삽입: O(n)
numbers.unshift(0); // [0, 1, 2, 3, 4, 5]

// 앞에서 제거: O(n)
numbers.shift();    // [1, 2, 3, 4, 5]
```

흔히 하는 오해가 예를 들어 배열의 크기가 10,000이고 7,000번째 엘리먼트에 접근할 때 7,000번의 연산이 필요한 게 아니다. 각 엘리먼트들은 메모리에서 바로 접근 가능한 지름길이 있다고 생각하면 되고, 그래서 상수 시간에 접근이 가능하다.

push/pop의 경우 unshift/shift보다 성능이 좋다. 이유는 앞에서 말한 배열의 끝에 삽입(제거)하느냐, 그 앞에서 삽입(제거)하느냐의 차이와 동일하다.

## 성능 비교
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/769c3a4ae0d2dc81f337c1e7306c9ff3.png)

이론적인 시간 복잡도를 실제로 검증해보기 위해 다양한 크기의 데이터셋(10만, 100만, 1000만 항목)으로 실행 시간을 측정해보았다.
- **10만 항목 DataSet 비교**
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7be05156745abf3589d5eaba474b8122.png)

- **100만 항목 DataSet 비교**
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2ad72d929bb512a5a84da5b94a5baebf.png)

- **1000만 항목 DataSet 비교**
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/573a60e45f70ef9fb3658cf849404bd9.png)

1. **접근 성능**: 예상대로 두 자료구조 모두 매우 빠른 접근 성능(O(1))을 보여준다.
2. **삽입 성능**: 예상과 달리 끝에 삽입에서 객체가 배열보다 더 빠르게 나타났다. 또한 앞에 삽입에서 둘의 차이가 거의 없었다. 그리고 크기가 커져도 객체의 삽입 성능이 거의 일정하게 유지된다.
3. **검색과 순회**: 배열이 객체보다 우수한 성능을 보인다. 1000만 항목 검색 시: 객체(3254ms) vs 배열(6.3ms), 1000만 항목 순회 시: 객체(2686ms) vs 배열(164ms)
4. **데이터 크기의 영향**:  데이터셋의 크기가 커질수록 검색/순회에서 성능 차이가 심하게 벌어졌다.

### 수정된 테스트
한 번만 unshift를 수행해서 실제 성능 차이가 잘 드러나지 않았을 것 같아서 테스트 코드를 수정해 다시 측정해보았다. 이번에는 1회가 아니라 100회 반복으로 진행했다.
- **100만 항목 DataSet 비교**
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ce1401db12de308eab554b5ec80f2083.png)
- **100만 항목 DataSet 비교**
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a78f99424648280009e401658839cc09.png)
- **1000만 항목 DataSet 비교**
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/eb61fe683f8101776a96307f84b7672c.png)

수정된 테스트 결과를 보니 모든 데이터 크기에서 객체의 삽입이 배열보다 빠른 것을 확인할 수 있었다.
## 정리
### 객체를 사용해야 할 때
- 각 요소의 순서가 중요하지 않을 때
- 빠른 접근/삽입/제거가 필요할 때
- 키-값 쌍의 구조가 필요할 때

### 배열을 사용해야 할 때
- 각 요소의 순서가 중요할 때
- 주로 끝에서만 데이터를 삽입/제거할 때
- 인덱스로 접근이 필요할 때

이러한 특성을 고려해서 적절한 데이터 구조를 선택하면 좋을 것 같다.

---
이 글은 Udemy의 [【한글자막】 JavaScript 알고리즘 & 자료구조 마스터클래스](https://www.udemy.com/course/best-javascript-data-structures/) 강의를 토대로 공부한 내용을 정리한 것입니다.