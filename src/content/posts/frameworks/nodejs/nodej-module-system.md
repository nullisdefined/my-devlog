---
title: "[Node.js] 모듈 시스템"
slug: "nodej-module-system"
date: 2024-11-20
tags: ["NodeJS"]
category: "Frameworks/NodeJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png)


Node.js 애플리케이션이 커질수록 모든 코드를 하나의 파일에 작성하는 것은 유지보수와 가독성 측면에서 좋지 않다. Node.js의 모듈 시스템을 통해 코드를 여러 파일로 나누어 관리할 수 있다.

## 라우팅 로직 분리하기
예를 들어, 서버의 라우팅 로직을 별도의 파일로 분리해보자.
```js
// app.js (기존 파일)
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        // 홈 페이지 처리
    } else if (req.url === '/message') {
        // 메시지 처리
    }
});


```
이 코드를 다음과 같이 분리할 수 있다.
```js
// routes.js (새로운 파일)
const fs = require('fs');

const requestHandler = (req, res) => {
    if (req.url === '/') {
        // 홈 페이지 처리
    } else if (req.url === '/message') {
        // 메시지 처리
    }
};

module.exports = requestHandler;
```

```js
// app.js (수정된 파일)
const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes);
```

## 모듈 내보내기 방식
Node.js에서 모듈을 내보내는 방법은 크게 세 가지가 있다.

### 1. 단일 요소 내보내기
가장 간단한 방식으로, 하나의 함수나 객체를 내보낼 때 사용한다.
```js
const requestHandler = (req, res) => {
    // 처리 로직
};

module.exports = requestHandler;
```

### 2. 객체로 여러 요소 내보내기
여러 함수나 값을 하나의 객체로 그룹화하여 내보낼 수 있다.
```js
const requestHandler = (req, res) => {
    // 처리 로직
};

module.exports = {
    handler: requestHandler,
    someText: 'Some hard coded text'
};
```

### 3. 개별 속성으로 내보내기
`module.exports`의 속성으로 개별적으로 내보낼 수 있다.
```js
module.exports.handler = requestHandler;
module.exports.someText = 'Some hard coded text';

// 또는 단축 구문 사용
exports.handler = requestHandler;
exports.someText = 'Some hard coded text';
```

## 모듈 가져오기
다른 파일에서 모듈을 사용하기 위해서는 `require` 함수를 사용한다.
```js
// 코어 모듈 가져오기
const http = require('http');

// 로컬 모듈 가져오기 (.js 확장자 생략 가능)
const routes = require('./routes');

// 객체로 내보낸 경우 사용
console.log(routes.someText);
const server = http.createServer(routes.handler);
```

## 주의할 점
1. **경로 지정**
    - 코어 모듈: 모듈 이름만 사용 (예: `require('http')`)
    - 로컬 모듈: 상대 경로 사용 (예: `require('./routes')`)
2. **모듈 캐싱**
    - Node.js는 한 번 불러온 모듈을 캐시한다
    - 모듈 내용은 외부에서 직접 수정할 수 없다
    - 내보낸 함수 내부에서만 변경이 가능하다
3. **exports 단축구문**
    - `exports`는 `module.exports`의 단축구문
    - Node.js가 제공하는 특별한 객체
    - 직접 재할당은 불가능 (`exports = {...}` 사용 불가)

## 마치며
Node.js의 모듈 시스템을 활용하면 코드를 논리적인 단위로 분리하고, 재사용성을 높이며, 유지보수가 용이한 애플리케이션을 구축할 수 있다.

---
이 글은 Udemy의 [【한글자막】 NodeJS 완벽 가이드 : MVC, REST APIs, GraphQL, Deno](https://www.udemy.com/course/nodejs-mvc-rest-apis-graphql-deno/) 강의를 토대로 공부한 내용을 정리한 것입니다.