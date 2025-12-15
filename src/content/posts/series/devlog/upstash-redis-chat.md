---
title: "Upstash Redis 활용 실시간 채팅 기능 구현하기"
slug: "upstash-redis-chat"
date: 2024-11-25
tags: ["NextJS", "Upstash", "Redis", "TypeScript", "Devlog"]
category: "Series/devlog"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/833f02d8c2bb631bb74e5c71cd617c0e.png"
draft: false
views: 0
---
블로그에 채팅 기능이 꼭 필요하지는 않았다. 하지만 Redis를 처음 사용해보고 싶었고, 채팅 기능은 Redis의 장점을 실험해보기 좋은 대상이라고 생각했다. 채팅은 실시간으로 메시지를 주고받아야 하며, 데이터를 빠르게 읽고 쓰는 성능이 필요하기 때문이다. 또한 Redis는 방문자의 수를 집계하는 위젯으로도 활용하고 있다.

## Redis vs. Upstash

### 왜 Upstash를 사용했나?
처음에는 Redis를 직접 설치하려 했지만 Upstash라는 서비스를 알게 되었다. Upstash는 클라우드 기반의 서버리스 아케텍처에 최적화된 Redis 서비스를 제공한다. Vercel에서 서버리스 환경으로 운영 중이기 때문에, Upstash는 자연스러운 선택이었다.

### Upstash의 장점
1. **서버 관리가 필요 없다**
	- Redis는 서버에 설치하고 직접 관리해야 하지만 Upstash는 클라우드에서 제공되므로 설정이 간단하다.
2. **Vercel과의 호환성**
	- Upstash는 Vercel과의 통합을 지원한다.
3. **무료 플랜 제공**
	**- 프리티어에서 제공하는 조건은 다음과 같다**:
		- DB 3개까지 생성 가능
		- DB당 256MB
		- 일일 최대 10,000개의 명령 실행
4. **추가 기능**
	- Redis 외에도 Vector, QStash, Workflow, Kafka 등의 기능도 제공한다.

## 채팅 기능 구현

### 메시지 및 채팅방 구조 정의
먼저 채팅 메시지와 채팅방 데이터를 관리하기 위해 TypeScript 인터페이스를 정의했다.

```typescript title:src/types/chat.ts
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

### Redis 설정
Redis에 접근하기 위해 Upstash Redis 클라이언트를 설정한다.
```ts title:src/lib/redis.ts
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/833f02d8c2bb631bb74e5c71cd617c0e.png)
*Upstash REST API를 통해 Redis 설정*

### 채팅 위젯 컴포넌트
**채팅 위젯은 다음과 같은 기능을 제공한다**:
1. **메시지 전송**: 입력한 메시지를 서버로 보내 Redis에 저장
2. **실시간 메시지 수신**: 새 메시지를 실시간으로 수신
3. **채팅방 구독**: 사용자 세션 기반으로 채팅방 생성

```ts title:src/components/chat/chat-widget.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newMessage.trim() || isLoading) return;

  setIsLoading(true);
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newMessage, sender: "user", roomId }),
    });

    const data = await response.json();
    if (!roomId && data.roomId) {
      setRoomId(data.roomId);
      sessionStorage.setItem("chatRoomId", data.roomId);
    }
    setNewMessage("");
  } catch (error) {
    console.error("메시지 전송 실패:", error);
  } finally {
    setIsLoading(false);
  }
};

```
이 함수는 메시지를 서버로 전송하고 Redis에 저장된 채팅방 ID를 반환받아 세션에 저장한다.

## 관리자 페이지

### 채팅 알림
읽지 않은 메시지 수를 표시하는 관리자 링크를 구현한다.
```ts title:src/components/admin-chat-link.tsx
export function AdminChatLink() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(unreadMessages.getCount());
    const interval = setInterval(() => {
      setUnreadCount(unreadMessages.getCount());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/admin/chat" className="relative flex items-center gap-2">
      <MessageCircle className="h-4 w-4" />
      <span>채팅 관리</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}

```

## Redis 데이터 목록
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fd9d632d43c6552a6e7648f019c23d99.png)
*Redis에 저장된 채팅 메시지 리스트*

## 마치며
Redis를 처음 사용하면서 (클라우드 서비스인데도 불구하고) 빠른 성능과 간단한 사용법에 놀랐다. 특히 Upstash는 클라우드 기반으로 설정이 간편해 서버리스 프로젝트와의 궁합이 잘 맞았다.

채팅 기능은 실시간 메시지 수신과 관리가 원활하게 동작했으며, Vercel과의 연동에서도 문제없이 배포되었다.

### 개선할 점
- **관리자 페이지 보안**: 토큰 인증 추가

> [!NOTE] - **GitHub 로그인** 연동
- **기능 추가**: 채팅방 삭제, 메시지 차단


> [!NOTE] 이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/mydevlog)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.