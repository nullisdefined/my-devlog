---
title: "[Node.js] 이벤트 기반 아키텍처와 비동기 처리"
slug: "nodejs-event-driven-architecture-and-non-blocking"
date: 2024-11-18
tags: ["NodeJS"]
category: "Frameworks/NodeJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png)

## Node.js는 어떻게 요청을 처리할까?
Node.js는 싱글 스레드로 동작하면서도 효율적으로 여러 요청을 처리할 수 있다. 이는 이벤트 기반 아키텍처와 비동기 처리 방식 덕분이다. 예를 들어 파일 업로드 요청이 들어왔을 때, Node.js는 요청을 한 번에 처리하지 않고 작은 단위인 청크(chunk)로 나누어 처리한다.

```js
const http = require('http');

const server = http.createServer((req, res) => {
    const body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        // 여기서 데이터 처리
    });
});
```

이런 처리 방식을 이해하기 위해서는 스트림(Stream), 버퍼(Buffer), 그리고 이벤트 기반 아키텍처에 대한 이해가 필요하다.

## 스트림과 버퍼
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/23dd016612c6d1beb5617c8060575c0b.png)

Node.js에서 데이터는 스트림과 버퍼라는 두 가지 핵심 개념을 통해 처리된다.

### 스트림이란?
스트림은 데이터를 청크 단위로 순차적으로 처리할 수 있게 해주는 인터페이스다. 수도관을 따라 물이 흐르듯 데이터가 조금씩 전달되기 때문에 메모리 부담 없이 대용량 데이터를 효율적으로 처리할 수 있다.

### 버퍼란?
버퍼는 스트림으로 전달되는 데이터를 일시적으로 보관하는 메모리 공간이다. 버스 정류장에 비유하면 이해하기 쉬운데, 데이터는 버퍼에 잠시 멈춰 프로그램이 처리할 수 있도록 돕는다.

## 이벤트 기반 아키텍처와 비동기 처리
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6984831d73e4aad6e0848b48e2beb7f9.png)
*[Node.js event loop architecture](https://medium.com/preezma/node-js-event-loop-architecture-go-deeper-node-core-c96b4cec7aa4)*
스트림으로 전달되는 데이터는 어떻게 처리될까? 여기서 Node.js의 이벤트 기반 아키텍처가 등장한다. 이는 특정 이벤트가 발생했을 때 미리 정의된 동작을 수행하는 방식이다.

### 싱글 스레드와 이벤트 루프
Node.js는 싱글 스레드로 동작하지만 이벤트 루프를 통해 여러 요청을 처리한다. 이벤트 루프는 다음 단계로 실행된다.
1. Timers: `setTimeout`, `setInterval` 콜백 실행
2. Pending Callbacks: I/O 작업의 콜백 실행
3. Poll: 새로운 I/O 이벤트 확인 및 처리
4. Check: `setImmediate` 콜백 실행
5. Close Callbacks: 종료된 이벤트의 콜백 실행

### Worker Pool
파일 시스템 작업과 같은 블로킹 작업은 Worker Pool로 위임된다. Worker Pool은 별도의 스레드에서 동작하며 작업 완료 시 이벤트 루프에 콜백을 전달한다.
```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// 이벤트 리스너 등록
myEmitter.on('userAction', (data) => {
    console.log('사용자 동작 감지:', data);
});

// 이벤트 발생
myEmitter.emit('userAction', { type: 'click', time: Date.now() });
```

### 논블로킹 I/O와 실행 순서
Node.js는 논블로킹 I/O 방식을 통해 시간이 오래 걸리는 작업을 기다리지 않고 다른 작업을 계속 처리할 수 있다.
```js
console.log('1. 시작');

fs.readFile('file.txt', () => {
    console.log('3. 파일 읽기 완료');
});

console.log('2. 다음 작업');
// 출력: 1. 시작 -> 2. 다음 작업 -> 3. 파일 읽기 완료
```

## 파일 업로드 처리 예시
on 메서드를 사용해 이벤트 기반으로 파일 업로드를 처리할 수 있다.
```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/upload' && req.method === 'POST') {
        const writeStream = fs.createWriteStream('uploaded-file.txt');

        req.pipe(writeStream);

        req.on('end', () => {
            res.end('파일 업로드 완료!');
        });

        req.on('error', (err) => {
            console.error('업로드 중 에러 발생:', err);
            res.statusCode = 500;
            res.end('파일 업로드 실패');
        });
    }
});

server.listen(3000);
```

### 동기식과 비동기식 파일 처리
성능과 확장성을 위해서는 비동기식 파일 처리를 사용해야 한다.
```js
// 동기식 처리
fs.writeFileSync('file.txt', data);

// 비동기식 처리
fs.writeFile('file.txt', data, (err) => {
    if (err) {
        console.error('파일 저장 실패:', err);
        return;
    }
    console.log('파일 저장 완료');
});
```
동기식 처리의 경우 파일 작업이 완료될 때까지 다른 작업을 처리할 수 없어 서버의 성능이 저하될 수 있다. 이 예제의 경우 작은 용량의 파일이라 효과가 미미하겠지만, 대용량 파일의 경우 그리고 클라이언트의 요청이 많을 땐 비동기식 처리가 필수적이다.

### Express.js를 통한 구현
Node.js의 로우레벨 코드는 Express와 같은 프레임워크를 사용하면 훨씬 간단하게 구현할 수 있다.
```js
const express = require('express');
const app = express();

// 미들웨어를 통한 요청 바디 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 간단한 라우트 처리
app.post('/upload', (req, res) => {
    console.log(req.body);  // 자동으로 파싱된 요청 바디
    res.json({ message: '업로드 완료!' });
});

app.listen(3000);
```
Express를 사용하면 복잡한 스트림이나 버퍼를 직접 다룰 필요 없이 미들웨어를 통해 데이터를 쉽게 처리할 수 있다. 하지만 Node.js의 기본 원리를 이해하면 로우레벨에서 최적화를 하거나 디버깅할 때 큰 도움이 된다.


> [!NOTE] 이 글은 Udemy의 [【한글자막】 NodeJS 완벽 가이드 : MVC, REST APIs, GraphQL, Deno](https://www.udemy.com/course/nodejs-mvc-rest-apis-graphql-deno/) 강의를 토대로 공부한 내용을 정리한 것입니다.