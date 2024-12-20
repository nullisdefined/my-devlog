---
title: "[Node.js] Express"
slug: "node-js-express"
date: 2024-11-29
tags: ["NodeJS", "Express"]
category: "Backend/NodeJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/03a5a0480e31b580ab7f4657cbf8066d.png"
draft: false
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/03a5a0480e31b580ab7f4657cbf8066d.png)

Vanilla Node.js로 웹 서버를 개발할 때 가장 먼저 마주치는 어려움은 반복적이고 번거로운 작업들이다.

- HTTP 요청 처리
- 요청 본문 파싱
- 라우팅 설정
- 미들웨어 구성

이러한 기본적인 작업을 하나하나 직접 처리하다 보면 코드 작성량이 늘어나고 개발 생산성이 저하될 수밖에 없다.
Express는 이러한 문제를 해결하기 위해 설계된 Node.js 프레임워크다. Express는 개발자가 비즈니스 로직에 집중할 수 있도록 도와주며, Vanilla Node.js보다 훨씬 효율적인 서버 개발 환경을 제공한다.
물론 Express를 사용하지 않아도 Node.js로 서버를 만들 수 있다. 또한 Koa, Adonis.js, Sails.js와 같은 다른 프레임워크들도 존재하지만, Express는 여전히 가장 널리 사용되는 프레임워크다.

## Express 주요 특징
### 1. 미들웨어 기반 아키텍처
Express의 가장 큰 특징은 미들웨어 기반의 아키텍처를 제공한다는 점이다.
미들웨어란 요청이 들어오면서 거치는 함수들의 연속이며, 각 미들웨어는 요청과 응답 객체를 처리하고 다음 단계로 전달할 수 있다. 이를 통해 요청 처리 과정에 유연하게 기능을 추가하거나 변경할 수 있다.
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ffa384154a9e0cd737c708445f612b30.png)
*[Understanding Express Middleware](https://dev.to/ghvstcode/understanding-express-middleware-a-beginners-guide-g73)*

***예시 코드***
```js
const express = require('express');
const app = express();

// 첫 번째 미들웨어
app.use((req, res, next) => {
    console.log('In the first middleware!');
    next(); // 다음 미들웨어로 전달
});

// 두 번째 미들웨어
app.use((req, res, next) => {
    console.log('In the second middleware!');
    res.send('Hello from Express!');
});

app.listen(3000);
```
위 코드에서 각 미들웨어는 요청을 처리하고 `next()`를 호출해 다음 미들웨어로 요청을 전달한다. 이를 통해 코드의 순차적 실행과 유연한 처리가 가능해진다.

### 2. 유연성과 확장성
Express는 핵심 기능만을 제공하며, 과도한 기능을 강제하지 않는다. 필요에 따라 수천 개의 써드파티 미들웨어를 자유롭게 추가하여 다양한 기능을 확장할 수 있다.

***예시로 추가할 수 있는 기능들***
- 요청 본문 파싱 (e.g. `body-parser`)
- 인증 및 보안 (e.g. `passport`, `helmet`)
- 로깅 (e.g. `morgan`)

이처럼 Express는 필요한 것만 가져와 사용할 수 있는 유연한 구조를 제공한다.

### 3. 강력한 생태계
가장 널리 사용되는 Node.js 프레임워크다. 풍부한 커뮤니티와 다양한 미들웨어가 있다. 이러한 강력한 생태계 덕분에 빠르게 개발을 시작할 수 있고 문제에 부짖혔을 때 해결책을 쉽게 찾을 수 있다.

## 마무리
Express는 Node.js의 복잡하고 번거로운 작업들을 단순화하여 개발자가 비즈니스 로직에 집중할 수 있도록 돕는다.

---
이 글은 Udemy의 [【한글자막】 NodeJS 완벽 가이드 : MVC, REST APIs, GraphQL, Deno](https://www.udemy.com/course/nodejs-mvc-rest-apis-graphql-deno/) 강의를 토대로 공부한 내용을 정리한 것입니다.