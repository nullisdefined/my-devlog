---
title: "[Node.js] 이벤트 기반 아키텍처와 비동기 처리"
date: 2024-11-18
tags: ["NodeJS"]
category: "Backend/NodeJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/443cb67c45a8f2e9fc5d6c753e981266.png"
draft: false
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
이러한 처리 방식을 이해하기 위해서는 스트림(Stream), 버퍼(Buffer), 그리고 이벤트 기반 아키텍처에 대한 이해가 필요하다.
## 스트림(Stream)과 버퍼(Buffer)
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/23dd016612c6d1beb5617c8060575c0b.png)
데이터를 처리할 때 Node.js는 스트림과 버퍼라는 두 가지 핵심 개념을 사용한다.

### 스트림이란?
스트림은 데이터의 흐름을 나타내는 추상적인 개념이다. Node.js에서 스트림은 데이터를 청크 단위로 순차적으로 처리할 수 있게 해주는 인터페이스다. 마치 수도관에서 물이 흐르는 것처럼, 데이터가 조금씩 순차적으로 전달되어 Node.js는 이 스트림을 통해 대용량 데이터도 메모리 부담 없이 효율적으로 처리할 수 있다.

### 버퍼란?
버퍼는 스트림으로 전달되는 데이터를 일시적으로 보관하는 메모리 공간이다. 버스 정류장에 비유하면 이해하기 쉽다. 버스(데이터)가 끊임없이 움직이지만, 정류장(버퍼)에서 잠시 멈춰 승객(프로그램)이 이용할 수 있는 것처럼, 버퍼는 데이터를 임시로 저장하여 프로그램이 처리할 수 있게 해준다.

## 이벤트 기반 아키텍처로 구현하는 비동기 처리
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6984831d73e4aad6e0848b48e2beb7f9.png)
*사진 출처: https://medium.com/preezma/node-js-event-loop-architecture-go-deeper-node-core-c96b4cec7aa4*
스트림으로 전달되는 데이터는 어떻게 처리될까? 여기서 Node.js의 이벤트 기반 아키텍처가 등장한다. 이는 특정 이벤트가 발생했을 때 미리 정의된 동작을 수행하는 방식이다.

### 싱글 스레드와 이벤트 루프
Node.js는 싱글 스레드로 동작하지만, 이벤트 루프를 통해 여러 요청을 효율적으로 처리할 수 있다. 이벤트 루프는 Node.js가 시작될 때 자동으로 시작되며, 다음과 같은 단계로 동작한다:
1. **Timers**: `setTimeout`, `setInterval` 콜백 실행
2. **Pending Callbacks**: I/O 작업(파일, 네트워크 등)의 콜백(보통 블로킹 연산과 관련이 있는) 실행
3. **Poll**: 새로운 I/O 이벤트 확인 및 처리
4. **Check**: setImmediate 콜백 실행
5. **Close Callbacks**: 종료(close)된 이벤트의 콜백 실행

### Worker Pool
Node.js는 파일 시스템 작업과 같이 시간이 오래 걸리는 작업을 Worker Pool에 위임한다. Worker Pool은 메인 스레드와 별개로 코드와 분리된 상태에서 동작하며, 운영체제의 다중 스레드에서 작동할 수 있다. 이는 Node.js가 기본적으로 제공하는 시스템으로 libuv 라이브러리에 의해 관리되는 4개의 스레드 풀을 의미한다. 작업이 완료되면 이벤트 루프에 콜백을 전달한다.

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
### 실행 순서와 콜백
코드의 실행 순서는 작성된 순서와 다를 수 있다. 이벤트 리스너에 등록된 콜백은 해당 이벤트가 발생했을 때 실행되며, 이는 비동기적으로 처리된다.
```js
console.log('1. 시작');

fs.readFile('file.txt', () => {
    console.log('3. 파일 읽기 완료');
});

console.log('2. 다음 작업');
// 출력: 1. 시작 -> 2. 다음 작업 -> 3. 파일 읽기 완료
```

### 논블로킹 I/O
Node.js의 특징 중 하나는 논블로킹 I/O 처리 방식이다. 이는 시간이 오래 걸리는 작업을 기다리지 않고, 다른 작업을 계속 처리할 수 있게 해준다.

```js
// 블로킹 방식
const data = fs.readFileSync('large-file.txt'); 
console.log('파일 읽기 완료');
console.log('다음 작업');  // 파일을 다 읽을 때까지 실행되지 않음

// 논블로킹 방식
fs.readFile('large-file.txt', (err, data) => {
    console.log('파일 읽기 완료');
});
console.log('다음 작업');  // 파일 읽기를 기다리지 않고 즉시 실행
```

### 파일 업로드 처리 예제
개념들을 종합하여 간단한 파일 업로드 처리 예제를 살펴보자. 여기서는 `on` 메서드를 활용한다.

**on 메서드** 
on 메서드는 Node.js에서 이벤트를 처리하는 핵심 메서드로, request.on(eventName, callback) 구조로 동작한다. 주요 이벤트와 그 역할은 다음과 같다:
- 'data' 이벤트: 새로운 데이터 청크가 도착할 때마다 발생
- 'end' 이벤트: 모든 데이터 수신이 완료되었을 때 발생
- 'error' 이벤트: 오류 발생 시 트리거
```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/upload' && req.method === 'POST') {
        // 파일 스트림 생성
        const writeStream = fs.createWriteStream('uploaded-file.txt');
        
        // 스트림 파이핑
        req.pipe(writeStream);

        // 데이터 수신 완료 시 실행
        req.on('end', () => {
            res.end('파일 업로드 완료!');
        });

        // 오류 발생 시 실행
        req.on('error', (err) => {
            console.error('업로드 중 에러 발생:', err);
            res.statusCode = 500;
            res.end('파일 업로드 실패');
        });
    }
});

server.listen(3000);
```
#### 파일 처리에서 주의할 점
Node.js에서 파일 처리는 동기식(Sync)과 비동기식 두 가지 방식이 가능하다. 성능과 확장성을 위해서는 비동기식 처리를 사용해야 한다.
```js
// 동기식 처리 - 피해야 할 방식
fs.writeFileSync('file.txt', data);

// 비동기식 처리 - 권장되는 방식
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
지금까지 살펴본 로우레벨의 코드는 Express와 같은 프레임워크를 사용하면 더 간단하게 구현할 수 있다. 
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

이처럼 Express를 사용하면 복잡한 스트림 처리나 버퍼 관리를 직접 하지 않아도 된다. 하지만 Node.js의 기본 동작 원리를 이해하는 것은 중요하며 이를 알고 있어야 문제가 발생했을 때 더 효과적으로 디버깅할 수 있고, 필요한 경우 로우 레벨에서의 최적화도 가능해진다.

---
이 글은 Udemy의 [【한글자막】 NodeJS 완벽 가이드 : MVC, REST APIs, GraphQL, Deno](https://www.udemy.com/course/nodejs-mvc-rest-apis-graphql-deno/) 강의를 토대로 공부한 내용을 정리한 것입니다.