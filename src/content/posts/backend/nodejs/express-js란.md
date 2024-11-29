---
title: "Express.js란?"
date: 2024-11-29
tags: ["NodeJS", "Express"]
category: "Backend/NodeJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png"
draft: false
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png)

Vanilla Node.js로 웹 서버 개발할 때 가장 먼저 마주치는 어려움은HTTP 요청 처리와 같은 기본적인 작업에 많은 코드 작성을 필요로 한다는 점이다. 요청 본문 파싱, 라우팅 처리, 미들웨어 구성 등.. 반복적인 작업들이 개발 생산성을 저하시킨다.

Express는 이러한 문제를 해결하기 위해 설계된 써드파티 패키지인 프레임워크로, 개발자가 비즈니스 로직에 집중할 수 있도록 도와준다. 물론 Express를 사용하지 않고 Vanilla Node.js로 개발을 할 수 있다. 뿐만 아니라 Adonis.js, Koa / sails.js 등 대안이 되는 프레임워크도 많이 존재한다.

## Express 주요 특징
### 미들웨어 아키텍처
Express의 가장 큰 특징은 미들웨어 기반의 아키텍처를 가진다는 것이다. 미들웨어란, 요청이 들어오면서 거치게 되는 함수들의 연속으로, 각각의 미들웨어는 요청을 처리하고 다음 미들웨어로 전달할 수 있다.
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ffa384154a9e0cd737c708445f612b30.png)
*사진 출처: https://dev.to/ghvstcode/understanding-express-middleware-a-beginners-guide-g73*
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

### 유연성과 확장성
Express는 과도한 기능을 강제하지 않으면서도 필요한 기능을 쉽게 추가할 수 있는 유연한 구조를 제공한다. 수천 개의 써드파티 미들웨어 패키지를 통해 다양한 기능을 손쉽게 확장할 수 있다.

### 강력한 생태계
가장 널리 사용되는 Node.js 프레임워크로, 풍부한 커뮤니티 지원과 다양한 미들웨어를 제공한다.

---
이 글은 Udemy의 [【한글자막】 NodeJS 완벽 가이드 : MVC, REST APIs, GraphQL, Deno](https://www.udemy.com/course/nodejs-mvc-rest-apis-graphql-deno/) 강의를 토대로 공부한 내용을 정리한 것입니다.