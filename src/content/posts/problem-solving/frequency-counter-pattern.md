---
title: "[JS] 빈도수 세기 패턴"
slug: "frequency-counter-pattern"
date: 2024-11-29
tags: ["JavaScript"]
category: "Problem Solving"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5527369119ba6ac9455d02961c357398.png"
draft: true
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5527369119ba6ac9455d02961c357398.png)

빈도수 세기 패턴은 배열이나 문자열의 구성 요소를 비교할 때 유용하게 사용되는 문제 해결 패턴이다. 이 패턴은 두 개의 배열이나 문자열을 비교할 때 중첩 반복문을 사용하는 대신, 객체를 사용하여 각 요소의 빈도수를 저장하고 비교함으로써 시간 복잡도를 개선할 수 있다.

## 패턴의 기본 개념
빈도수 세기 패턴의 핵심은 다음과 같다.
1. 배열이나 문자열의 각 요소를 객체의 키로 사용
2. 해당 요소의 등장 횟수를 값으로 저장
3. 두 객체를 비교하여 원하는 결과 도출

## 예제 1: 두 배열의 제곱 관계 확인
첫 번째 배열의 각 요소를 제곱한 값이 두 번째 배열에 모두 있는지 확인하는 문제
```js
function same(arr1, arr2) {
    // 길이가 다르면 false 반환
    if (arr1.length !== arr2.length) {
        return false;
    }
    
    // 각 배열의 요소 빈도수를 저장할 객체
    let frequencyCounter1 = {};
    let frequencyCounter2 = {};
    
    // 첫 번째 배열의 빈도수 계산
    for (let val of arr1) {
        frequencyCounter1[val] = (frequencyCounter1[val] || 0) + 1;
    }
    
    // 두 번째 배열의 빈도수 계산
    for (let val of arr2) {
        frequencyCounter2[val] = (frequencyCounter2[val] || 0) + 1;
    }
    
    // 각 요소의 제곱 관계 확인
    for (let key in frequencyCounter1) {
        // 제곱값이 두 번째 배열에 없으면 false
        if (!(key ** 2 in frequencyCounter2)) {
            return false;
        }
        // 빈도수가 다르면 false
        if (frequencyCounter2[key ** 2] !== frequencyCounter1[key]) {
            return false;
        }
    }
    
    return true;
}

console.log(same([1,2,3], [1,4,9])); // true
console.log(same([1,2,3], [1,9])); // false
console.log(same([1,2,1], [4,4,1])); // false
```
- `frequencyCounter1[val] || 0`는 JavaScript의 특성상 없는 요소에 접근할 때 `undefined`가 반환되기 때문에 사용

## 예제2: 에너그램 확인
두 문자열이 에너그램(anagram)인지 확인하는 문제도 빈도수 세기 패턴을 활용할 수 있다.
```js
function validAnagram(str1, str2) {
    // 길이가 다르면 애너그램이 될 수 없음
    if (str1.length !== str2.length) {
        return false;
    }
    
    // 문자 빈도수를 저장할 객체
    const lookup = {};
    
    // 첫 번째 문자열의 문자 빈도수 계산
    for (let char of str1) {
        lookup[char] = (lookup[char] || 0) + 1;
    }
    
    // 두 번째 문자열과 비교
    for (let char of str2) {
        // 문자가 없거나 빈도수가 0이면 false
        if (!lookup[char]) {
            return false;
        }
        lookup[char] -= 1;
    }
    
    return true;
}

console.log(validAnagram('anagram', 'nagaram')); // true
console.log(validAnagram('rat', 'car')); // false
console.log(validAnagram('awesome', 'awesom')); // false
```

## 시간 복잡도
- 중첩 반복문을 사용할 경우: O(n^2)
- 빈도수 세기 패턴 사용: O(n)

---
이 글은 Udemy의 [【한글자막】 JavaScript 알고리즘 & 자료구조 마스터클래스](https://www.udemy.com/course/best-javascript-data-structures/) 강의를 토대로 공부한 내용을 정리한 것입니다.