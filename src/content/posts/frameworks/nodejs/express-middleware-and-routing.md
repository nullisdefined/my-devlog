---
title: "[Express] 미들웨어와 라우팅"
slug: "express-middleware-and-routing"
date: 2024-11-30
tags: ["NodeJS", "Express"]
category: "Frameworks/NodeJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png)

## 미들웨어의 동작 원리
미들웨어는 파이프라인처럼 작동한다. 요청이 들어오면 Express는 이를 일련의 미들웨어 함수들을 통해 순차적으로 전달하는데, 각 미들웨어는 요청을 검사하고 필요한 처리를 수행한 후, 다음 미들웨어로 전달할지 결정한다.

```js
app.use((req, res, next) => {
    console.log('첫 번째 미들웨어');
    // 요청 객체에 새로운 속성 추가
    req.customData = '이 데이터는 다음 미들웨어에서 사용할 수 있습니다';
    next();
});

app.use((req, res, next) => {
    console.log('두 번째 미들웨어');
    console.log(req.customData); // 이전 미들웨어에서 추가한 데이터 접근 가능
    next();
});
```

### 미들웨어 체인의 내부 구현
Express는 내부적으로 미들웨어 함수들을 배열로 관리한다. 각 요청은 배열의 첫 번째 미들웨어부터 순차적으로 실행되며, `next()`가 호출되면 배열의 다음 미들웨어로 제어를 넘긴다. 이를 간단히 구현하면 다음과 같다.

```js
class Express {
    constructor() {
        this.middlewares = [];
    }

    use(path, handler) {
        if (typeof path === 'function') {
            handler = path;
            path = '/';
        }
        this.middlewares.push({ path, handler });
    }

    handle(req, res) {
        let index = 0;

        const next = () => {
            let layer = this.middlewares[index++];
            if (!layer) return;

            // 경로 매칭 확인
            if (req.url.startsWith(layer.path)) {
                layer.handler(req, res, next);
            } else {
                next();
            }
        };

        next();
    }
}
```

1. middlewares 배열에 미들웨어를 순서대로 저장한다.
2. next 함수는 다음 미들웨어로 제어를 넘긴다.
3. 각 미들웨어는 `req.url`이 자신의 경로와 일치할 때만 실행된다.
4. 경로에 맞지 않으면 `next()`를 호출해 다음 미들웨어로 넘어간다.

## 라우팅 시스템의 동작 방식
라우팅은 요청의 경로와 HTTP 메서드를 기반으로 적절한 핸들러 함수를 찾아 실행하는 구조다.

```js
const router = express.Router();

router.get('/users', (req, res) => {
    res.send('User list');
});
```

내부적으로 Express 라우터는 다음과 같은 방식으로 라우팅 정보를 관리한다.

```js
const routes = {
    GET: new Map(),
    POST: new Map(),
    PUT: new Map(),
    DELETE: new Map()
};

// 예시: 라우트 등록
routes.GET.set('/users', handler);

// 요청 처리
const handleRequest = (method, url) => {
    const handler = routes[method]?.get(url);
    if (handler) {
        handler(req, res);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
};
```

이 구조를 통해 HTTP 메서드와 경로가 일치하는 핸들러를 찾아 실행하게 된다.

## 요약
1. 미들웨어는 Express의 핵심으로, 요청과 응답을 가공하고 처리하는 함수들의 체인이다. `next()`를 통해 다음 단계로 제어를 넘길 수 있다.
2. Express는 미들웨어를 배열로 관리하고, 요청 경로와 일치하는 미들웨어만 실행한다.
3. 라우팅 시스템은 요청의 HTTP 메서드와 경로를 기준으로 핸들러를 실행하는 구조를 가진다.


> [!NOTE] 이 글은 Udemy의 [【한글자막】 NodeJS 완벽 가이드 : MVC, REST APIs, GraphQL, Deno](https://www.udemy.com/course/nodejs-mvc-rest-apis-graphql-deno/) 강의를 토대로 공부한 내용을 정리한 것입니다.