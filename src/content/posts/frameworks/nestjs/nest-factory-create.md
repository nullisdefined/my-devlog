---
title: "[NestJS] NestFactory.create()를 두 번 호출하면 MSA일까?"
slug: "nest-factory-create"
date: 2026-06-12
tags: ["NestJS", "Validation", "Pipe", "Frameworks"]
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

NestJS의 `main.ts`를 들여다보다 문득 이런 생각이 들었다.

> "`NestFactory.create()`로 앱 인스턴스를 만들어 띄우는 거라면, 한 파일에서 두 번 호출하면 서버가 두 개 뜨는 거 아닌가? 그럼 이게 MSA처럼 동작하지 않을까?"

가볍게 던진 생각일 수도 있지만, 막상 직접 확인해보기 전까지는 '왜 안 되는지'를 정확히 설명하기가 어려웠다.

```ts
async function bootstrap() {
  const app1 = await NestFactory.create(UserModule);
  await app1.listen(3000);

  const app2 = await NestFactory.create(OrderModule);
  await app2.listen(3001);
}
bootstrap();
```

이렇게 작성해도 잘 동작한다. 실제 3000번과 3001번 포트에서 각각 다른 모듈을 가진 서버가 뜬다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/c632011b28b9134aedfd2573ae7ecda1.png)

겉보기엔 서비스가 두 개로 깔끔하게 분리된 것처럼 보인다. common 유틸이나 엔티티 코드를 공유하기도 쉽고, 같은 환경에서 여러 서비스를 동시에 테스트할 수도 있겠다 싶었다.
   
그런데 이게 정말 '서비스 분리'일까? 두 가지를 직접 테스트해봤다.
   
   1. 한 서비스의 이벤트 루프가 막히면 다른 서비스는 어떻게 될까?
   2. 한 서비스가 죽으면 다른 서비스는 어떻게 될까?
   
User 서비스(3000)와 Order 서비스(3001)를 하나의 프로세스에서 띄우고, 각각에 고의로 문제를 일으키는 엔드포인트를 심어두었다.

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { UserModule } from './experiment/user/user.module';
import { OrderModule } from './experiment/order/order.module';

async function bootstrap() {
  // 1. User 서비스 (Port 3000)
  const userApp = await NestFactory.create(UserModule);
  await userApp.listen(3000);
  console.log('User Service is running on http://localhost:3000');

  // 2. Order 서비스 (Port 3001)
  const orderApp = await NestFactory.create(OrderModule);
  await orderApp.listen(3001);
  console.log('Order Service is running on http://localhost:3001');
}
bootstrap();
```

Order 서비스에는 이벤트 루프를 5초간 동기적으로 점유하는 엔드포인트를 만들었다.

```ts
@Controller('order')
export class OrderController {
  @Get()
  getOrder() {
    return 'Order Service (Port 3001) is running';
  }

  @Get('block')
  block() {
    console.log('(Order Service) Blocking the event loop for 5 seconds');
    const start = Date.now();
    while (Date.now() - start < 5000) {
      // Synchronous blocking loop
    }
    return '(Order Service) Block finished';
  }
}
```

그리고 User 서비스에는 프로세스를 통째로 죽이는 엔드포인트를 만들었다.

```ts
@Controller('user')
export class UserController {
  @Get()
  getUser() {
    return 'User Service (Port 3000) is running';
  }

  @Get('crash')
  crash() {
    console.log('(User Service) Crashing the entire process');
    process.exit(1);
  }
}
```

## 테스트 결과

### 1. 이벤트 루프 블로킹 테스트

`GET /order/block`을 호출한 직후, 곧바로 `GET /user`를 호출했다.

결과는, **User 서비스는 아무 연산도 하지 않는데 응답이 오지 않았다.** Order 서비스의 블로킹이 끝나는 5초 뒤에야 User 서비스의 응답이 돌아왔다.

이유는 명확했다. Node.js는 싱글 스레드 이벤트 루프 위에서 동작하고, 두 Nest 인스턴스는 같은 프로세스, 즉 **같은 이벤트 루프 하나를 공유**하기 때문이다. 포트가 다르다고 해서 실행 컨텍스트가 분리되는 건 아니다. Order 서비스의 `while` 루프가 이벤트 루프를 붙잡고 있는 동안, User 서비스로 들어온 요청은 큐에서 기다릴 수밖에 없다.

### 2. 프로세스 크래시 테스트

`GET /user/crash`를 호출하자 `process.exit(1)`이 실행되면서 **User 서비스뿐 아니라 Order 서비스까지 함께 죽었다.** 당연한 결과다. 애초에 둘은 같은 프로세스니까.

## 결론: 그래서 이건 MSA가 아니다
MSA를 도입하는 핵심 이유 중 하나가 **결함 격리(fault isolation)** 다. 그런데 이 구조에서는 격리가 전혀 이루어지지 않는다.

- **장애가 전파된다**: 한 서비스의 CPU 점유나 크래시가 모든 서비스를 멈추거나 죽인다. 즉, 격리가 전혀 안 된다.
- **자원이 격리되지 않는다**: CPU와 메모리를 하나의 Node 프로세스가 공유한다. 한 서비스의 메모리 누수는 전체의 메모리 누수다.
- **독립적인 스케일링이 불가능하다**: 특정 서비스에만 트래픽이 몰려도 프로세스를 통째로 늘려야 해서 자원 낭비가 생긴다.
- **독립 배포가 불가능하다**: 한 서비스만 수정해도 전체를 다시 배포해야 한다.

결국 포트를 두 개로 연 것일 뿐, 경계가 논리적으로만 존재하고 물리적으로는 존재하지 않는 구조다.

## 그렇다고 쓸모없는 패턴일까?

그래도 이 방식이 허용되는 데는 이유가 있을 것이다. 한계를 이해하고 쓴다면 유용한 상황도 분명 있겠다 싶었다.

- **로컬 개발/통합 테스트 환경**: 여러 서비스를 한 번의 실행으로 띄워서 서비스 간 연동을 빠르게 확인할 수 있다.
- **트래픽이 거의 없는 사이드 프로젝트**: 어드민 서버와 API 서버를 분리된 모듈로 관리하되, 인프라 비용은 프로세스 하나로 유지하고 싶을 때
- **포트 단위로 책임을 나누고 싶은 경우**: 예를 들어 메인 앱은 3000번, 헬스체크/메트릭 전용 앱은 3001번처럼

정리하면, 이 패턴으로는 **코드 구조상의 분리는 얻을 수 있지만 런타임의 분리는 얻을 수 없다.**

## NestJS가 권장하는 방향

 처음에 가졌던 "두 개 띄우면 MSA처럼 동작하지 않을까?"라는 아이디어를, NestJS는 이미 더 정제된 형태로 제공하고 있었다.
 
### 1. @nestjs/microservices
 
 단순히 HTTP 포트를 여러 개 여는 것이 아니라, TCP·Redis·RabbitMQ·Kafka 같은 전송 계층을 통해 서비스 간에 메시지를 주고받는 방식이다.

```ts
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.TCP,
  options: { port: 3001 },
});
await app.listen();
```

각 마이크로서비스를 **별도의 프로세스 혹은 컨테이너** 로 띄우고 메시지 패턴으로 통신하기 때문에, 내가 실험에서 확인한 이벤트 루프 공유 문제와 장애 전파 문제가 구조적으로 해결된다.

### 2. Nest CLI의 Monorepo 모드

하나의 프로젝트 폴더 안에서 여러 개의 독립된 앱(apps)을 관리하는 기능이다.

```bash
nest generate app my-new-app
```

개발할 때는 하나의 워크스페이스에서 코드(공용 라이브러리, 엔티티 등)를 공유하면서, 빌드와 배포는 앱별로 따로 해서 **독립된 프로세스로 띄울 수 있다.** 내가 원했던 "코드 공유의 편리함"과 "런타임 격리"를 둘 다 가져가는 구조인 셈이다.

## 마무리
정리하자면 이렇다.

- 포트 분리 ≠ 서비스 분리. 격리의 단위는 포트가 아니라 **프로세스**다.
- Node.js의 싱글 스레드 이벤트 루프 특성은 인스턴스를 몇 개 만들든 결국 프로세스 단위로 적용된다.
- "MSA처럼 보이는 것"과 "MSA가 주는 가치(결함 격리·독립 스케일링·독립 배포)"는 별개다. 후자가 필요 없다면 굳이 MSA일 이유가 없다.
- 같은 아이디어라도 프레임워크가 권장하는 방식(`@nestjs/microservices`, monorepo)이 존재한다.