---
title: "Redis로 구현한 채팅 기능"
date: 2024-11-25
tags: ["Redis"]
category: "Series/devlog"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7efaf37c1579f7b3aadfe7a7e6265c8d.png"
draft: false
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/7efaf37c1579f7b3aadfe7a7e6265c8d.png)

Redis를 한번 사용해보고 싶었고 블로그에 채팅 기능을 Reids로 구현해보면 좋겠다고 생각이 들었다.

### Redis? 그게 뭐길래..
사실 블로그에 채팅 기능이 꼭 필요했던 건 아니다. "Redis를 사용했더니 응답 속도가 되게 빨라졌다", "Redis가 사용하기 편하다" 등 Redis에 대해서 많은 말들을 들었지만 사용해본 적은 없었기에 이번 기회에 한번 사용해보고 싶었다. 블로그에서 채팅 기능이 Redis를 실험해보기에 괜찮겠다고 생각했다. 채팅은 실시간으로 메시지를 주고받아야 하고, 임시로 데이터를 저장했다가 보여줘야 하니까. 또한 방문자의 수를 집계하는 위젯에서도 사용 중이다.

### Redis vs. Upstash
처음에는 그냥 Redis를 쓰려고 했는데, 서칭을 하다가 Upstash라는 것을 알게되었다. Upstash는 클라우드 서비스로 제공하는 서버리스 아키텍처에 최적화된 데이터베이스 서비스이다. Redis는 서버세 직접 설치하고 관리해야 하지만 Upstash는 그럴 필요가 없다. 이 devlog의 경우 Vercel으로 배포되어 운영되는 서버리스 환경이다 보니 Upstash를 사용하는 것 이외에 선택지가 없었다. Vercel과의 통합 지원도 있지만 사용하지는 않았다. 비용같은 경우, 무료인 프리티어를 사용했을 때 제한은 다음과 같다:
- DB 3개까지
- DB당 256MB
- 일일 최대 10,000개의 커맨드
Redis 뿐만아니라 잘 모르지만 Vector, QStash, Workflow, Kafka도 사용할 수 있다고 한다. 서버리스 아키텍처를 사용하는 프로젝트의 경우, 되게 유용하게 사용할 수 있는 서비스인 것 같다.

### 어떻게 구현했나?
채팅을 다음과 같은 구조로 만들어보았다.
```typescript
// 메시지 구조
export interface Message {
	id: string;
	content: string;
	sender: "user" | "admin";
	timestamp: number;
}

// 채팅방 리스트 구조
export interface ChatRoom {
  id: string;
  userId: string;
  userName?: string;
  lastMessage?: string; // 채팅방 목록에서 보여줄 가장 마지막 메시지
  updatedAt: number;
  unread: number; // 0 또는 1
}
```

### 결과는?
#### 좋았던 점
Redis가 생각보다 어렵지 않게 느껴졌다. 인메모리 데이터베이스로 Redis가 많이 사용되는 이유를 알 것 같다. 쉬운 사용법, 그리고 리스트, hash, set 등 다양한 자료구조를 지원한다는 점이 좋았다. 굉장히 가볍고 빠르다고 생각했다. 실시간으로 메시지를 주고받는 것이 잘 되었고, Vercel에 배포하는 것에도 별다른 문제가 발생하지 않았다. Upstash 데이터베이스 접근법도 코드로 쉽게 알려주어서 적용하기도 쉬웠다.
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fd9d632d43c6552a6e7648f019c23d99.png)
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/833f02d8c2bb631bb74e5c71cd617c0e.png)

#### 향후 개선할 점
지금은 누구나 채팅할 수 있고, 누구나 채팅을 볼 수 있는 관리자 페이지에 접속할 수 있어 보완이 필요하다. 관리자 페이지의 경우 아이디, 패스워드를 두고 토큰을 두면 될 것 같다. 토큰을 두고 브라우저에 오래 로그인 할 수 있도록 한 뒤 채팅이 오면 브라우저 단에서 push 알림이 올 수 있게하면 좋겠다. 그리고 현재 UUID로 사용자를 구분하는 것은 좀 애매한 것 같다. 댓글에 사용되는 깃허브 discussion가 있으니 채팅 또한 깃허브 로그인을 붙이면 좋을 것 같다는 생각이다.

### 앞으로 할 일
다음에는 이런 것들을 추가할 예정이다:
1. 채팅 기능에 깃허브 로그인 추가
2. 어드민 토큰 추가
3. 채팅방 삭제 기능
4. 메시지 차단 기능

---
이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/next-devlog)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영입니다.