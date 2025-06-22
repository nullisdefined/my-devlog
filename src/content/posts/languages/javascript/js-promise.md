---
title: "[JS] 프로미스(Promise)"
slug: "js-promise"
date: 2024-12-16
tags: ["JavaScript", "Promise"]
category: "Languages/JavaScript"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7089d24aaadae68bb65e4270e212017a.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7089d24aaadae68bb65e4270e212017a.png)

JavaScript는 웹 브라우저 또는 Node.js 환경에서 동작하는 단일 스레드 기반 언어이기 때문에, 긴 시간이 소요되는 작업(네트워크 요청, 파일 입출력, 타이머 등)을 동기적으로 처리하면 애플리케이션이 멈춘 것처럼 보이는 현상이 발생하게 될 것이다.
이를 막기 위해 JavaScript는 오래 걸리는 작업을 비동기적으로 처리하는 방식을 사용한다.

그러나 비동기 처리에는 한 가지 문제가 있다. 비동기 함수는 결과가 나오는 시점이 예측 불가능하며, 호출 시 즉시 결과를 반환하지 않는다. 
그 대신 비동기 처리 완료 시 콜백 함수를 호출하여 결과를 전달한다. 
이를 통해 비동기 함수 외부로 결과를 직접 반환하지 않고도 후속 로직을 수행할 수 있다.

예를 들어 다음과 같은 코드가 있을 때:

```js
let g = 7;
setTimeout(() => {
  g = 11;
}, 1000);
console.log(g); // 7
```

여기서 `setTimeout`은 1초 후 `g` 값을 11로 바꾸는 비동기 함수다. 
하지만 `console.log(g)`는 그 이전에 실행되어 `g`가 갱신되기 전의 값인 7을 출력하게 된다. 
비동기 처리 결과를 함수 외부로 즉시 반환하지 못하기 때문에 발생하는 전형적인 상황이다.

이러한 이유로 비동기 처리 결과를 활용하려면, 비동기 함수에 콜백 함수를 전달하여 결과를 콜백 안에서 처리하는 패턴을 사용하게 되었다. 
하지만 이 콜백 기반 비동기 처리 방식은 여러 단계의 비동기 로직을 연속적으로 수행할 때 문제가 된다.
콜백을 중첩하여 작성하다 보면 코드가 점점 오른쪽으로 깊숙이 들여쓰여 가며, 로직 흐름을 파악하기 어려워지고, 에러 처리도 복잡해진다. 이러한 현상을 콜백 헬(Callback Hell)이라 한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/95482ea07341b1c2f1508d55355fdbbc.png)
*https://dev.to/jerrycode06/callback-hell-and-how-to-rescue-it-ggj*

## Promise의 등장

콜백 헬 문제를 해결하기 위해 등장한 것이 바로 Promise이다. Promise는 비동기 연산의 최종 완료 또는 실패를 나타내는 객체로서, 비동기 로직을 더욱 구조적이고 명확하게 관리할 수 있도록 도와준다.

### Promise의 특징

1. Promise는 다음과 같은 세 가지 상태를 가짐
	- **대기(pending)**: 비동기 연산이 아직 완료되지 않은 상태
	- **이행(fulfilled)**: 비동기 연산이 성공적으로 완료되어 결과값을 반환한 상태, 즉 resolve 함수 호출 됨
	- **거부(rejected)**: 비동기 연산이 실패하거나 에러가 발생한 상태, 즉 reject 함수 호출 됨
2. then()과 catch() 메서드
	- Promise는 `then()` 메서드를 통해 비동기 연산을 성공했을 때의 결과를 받을 수 있으며, `catch()` 메서드를 통해 에러를 처리할 수 있음. Promise를 사용하면 비동기 로직을 단계적으로 연결(chaining)하는 것이 가능하므로 콜백 함수를 중첩할 필요가 없어짐.

예를 들어, 콜백 기반 코드를 Promise로 변환하면 다음과 같이 작성할 수 있다.

```js
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = '서버 응답 데이터';
      resolve(data); // 성공 시 resolve 호출
      // 실패 시 reject(new Error('에러 메시지')) 호출 가능
    }, 1000);
  });
}

fetchData()
  .then(result => {
    console.log(result); // 1초 후 '서버 응답 데이터' 출력
    return '다음 단계 데이터';
  })
  .then(nextResult => {
    console.log(nextResult); // '다음 단계 데이터' 출력
  })
  .catch(error => {
    console.error('에러 발생:', error);
  });
```

여기서 `then()` 메서드는 이전 `then()`에서 반환한 값을 바탕으로 다음 단계를 처리할 수 있어, 연속적인 비동기 로직을 깔끔하게 표현할 수 있다. 
에러 처리도 `catch()` 한 곳에서 일관성 있게 다루며, 콜백 헬로 인해 가독성이 떨어지는 문제를 크게 개선한다.

## Promise를 통한 콜백 헬 극복

Promise를 사용하면 다음과 같은 이점이 있다.

- **가독성 향상**: 콜백 함수의 깊은 중첩 없이, `then()` 체이닝으로 비동기 로직을 순차적으로 표현할 수 있음
- **일관된 에러 처리**: 콜백 헬 상황에서는 각 단계마다 에러 처리가 번거롭지만, Promise는 `catch()`를 통해 에러 핸들링을 한 곳에서 일관성 있게 수행할 수 있음
- **유연한 흐름 제어**: Promise의 다양한 패턴(`Promise.all`, `Promise.race` 등)을 사용하면 병렬 처리나 가장 빠른 응답값 사용 등 다양한 비동기 처리 흐름을 단순한 코드로 구현할 수 있음

## Promise 정적 메서드들

Promise 객체는 개별 인스턴스 메서드(then(), catch() 등) 외에도 다양한 정적 메서드를 제공하여 비동기 처리 흐름을 유연하게 제어할 수 있게 해준다.
이러한 메서드들을 활용하면 여러 개의 Promise를 병렬로 처리하거나, 가장 빠른 Promise 결과를 얻는 등 다양한 패턴을 깔끔하게 구현할 수 있다.

### Promise.resolve(value)

- 주어진 값을 이행 상태(fulfilled)인 Promise로 반환함
- 이미 이행된 값을 Promise 형태로 래핑하고 싶을 때 유용
```js
Promise.resolve('hello')
  .then(result => {
    console.log(result); // 'hello'
  });

```

### Promise.reject(reason)

- 주어진 이유(reason)를 가진 거부 상태(rejected)인 Promise를 반환함
- 에러 핸들링 테스트나 명시적으로 실패를 발생시키고 싶을 때 사용
```js
Promise.reject(new Error('에러 발생'))
  .catch(error => {
    console.error(error); // Error: 에러 발생
  });
  
```

### Promise.all(iterable)

- 주어진 iterable(배열 등)에 포함된 모든 Promise가 이행될 때까지 기다린 뒤, 모든 결과를 배열로 반환하는 Promise를 반환함
- 모든 비동기 작업이 완료되어야 다음 단계를 진행해야하는 상황에서 유용
- 만약 하나라도 거부되면 전체가 거부 상태가 됨
```js
const p1 = Promise.resolve(10);
const p2 = Promise.resolve(20);
const p3 = Promise.resolve(30);

Promise.all([p1, p2, p3])
  .then(values => {
    console.log(values); // [10, 20, 30]
  })
  .catch(error => {
    console.error('에러:', error);
  });

```

### Promise.allSettled(iterable)

- 주어진 모든 Promise가 이행되거나 거부될 때까지 기다린 뒤, 각 Promise의 상태와 결과를 객체 형태로 담은 배열을 반환함
- 모든 Promise 결과를 실패 여부와 상관없이 한 번에 수집할 때 유용
```js
const p1 = Promise.resolve('성공');
const p2 = Promise.reject('실패');

Promise.allSettled([p1, p2])
  .then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: '성공' },
    //   { status: 'rejected', reason: '실패' }
    // ]
  });

```

### Promise.race(iterable)

- 주어진 Promise들 중 가장 먼저 이행되거나 거부되는 Promise를 반환함
- 가장 빠른 응답을 필요로 하는 상황에서 유용
```js
const slowPromise = new Promise(resolve => {
  setTimeout(() => resolve('느림'), 2000);
});

const fastPromise = new Promise(resolve => {
  setTimeout(() => resolve('빠름'), 500);
});

Promise.race([slowPromise, fastPromise])
  .then(result => {
    console.log(result); // '빠름'
  });

```

### Promise.any(iterable)

- 주어진 Promise들 중 하나라도 이행될 경우 그 Promise의 결과를 반환함
- 모든 Promise가 거부될 경우에만 에러를 발생시킴
- 여러 비동기 작업 중 하나라도 성공하면 그 결과를 바로 사용할 수 있음
```js
const p1 = Promise.reject('에러1');
const p2 = Promise.reject('에러2');
const p3 = Promise.resolve('드디어 성공');

Promise.any([p1, p2, p3])
  .then(result => {
    console.log(result); // '드디어 성공'
  })
  .catch(error => {
    console.error(error);
  });

```

## 마무리

비동기 로직을 단순한 콜백으로 처리하던 시절에는 콜백 헬이라는 문제에 직면하기 쉬웠다.
그러나 Promise가 등장함으로써 비동기 처리를 더 구조적이고 깔끔하게 표현할 수 있게 되었다. `then()` 체이닝을 통한 가독성 향상, `catch()`를 통한 일관된 에러 처리, 그리고 `Promise.all`, `Promise.race`, `Promise.any`, `Promise.allSettled` 등의 정적 메서드로 할 수 있는 유연한 흐름 제어가 JavaScript 개발에서 비동기 처리를 효율적으로 구현하는 데 필요한 요소임을 알게되었다.