---
title: "[Express] 미들웨어와 라우팅"
date: 2024-11-30
tags: ["NodeJS", "Express"]
category: "Backend/NodeJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png"
draft: false
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
Express는 내부적으로 미들웨어 함수들을 배열로 관리한다. `next()`가 호출되면 Express는 배열의 다음 미들웨어 함수로 제어를 넘기는데, 이는 대략적으로 다음과 같이 구현되어 있다:
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

`handle` 메서드는 실제 미들웨어 체인을 실행하는 핵심 로직인데
- `index` 변수로 현재 실행 중인 미들웨어의 위치를 추적
- `next` 함수는 다음 미들웨어로 진행하는 역할
- 각 미들웨어는 요청 URL이 자신의 경로와 일치할 때만 실행되고,
- 미들웨어 함수에는 `next` 함수가 전달되어, 필요할 때 다음 미들웨어로 제어를 넘길 수 있다.

## 라우팅 시스템의 동작 방식
라우터는 요청의 경로와 HTTP 메서드를 기반으로 적절한 핸들러 함수를 찾아 실행한다.
```js
const router = express.Router();

// 라우터 내부적으로 이런 식의 구조를 가짐
const routes = {
    GET: new Map(),
    POST: new Map(),
    PUT: new Map(),
    DELETE: new Map()
};

router.get('/users', (req, res) => {
    // routes.GET.set('/users', handler)와 같은 방식으로 저장됨
});
```


---
이 글은 Udemy의 [【한글자막】 NodeJS 완벽 가이드 : MVC, REST APIs, GraphQL, Deno](https://www.udemy.com/course/nodejs-mvc-rest-apis-graphql-deno/) 강의를 토대로 공부한 내용을 정리한 것입니다.