---
title: "소프트웨어 설계 패턴 - 싱글톤 패턴과 NestJS"
slug: "singleton-pattern-in-nestjs"
date: 2025-12-15
tags: ["NestJS", "TypeScript", "Design Pattern", "Singleton", "DI"]
category: "Backend/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png)

이번 학기 소프트웨어 분석 및 설계 과목에서 디자인 패턴을 배웠다. 수업에서는 주로 Java를 사용했는데, 학기 중 진행한 나날모아 프로젝트가 TypeScript/NestJS 기반이다 보니 자연스럽게 "이 패턴들을 실제 프로젝트에 어떻게 적용할 수 있을까?"라는 고민을 하게 되었다.

그 중에서도 싱글톤 패턴은 가장 먼저 접하게 되는 생성 패턴이면서도, NestJS에서는 프레임워크 차원에서 자동으로 제공되는 패턴이라 흥미로웠다. 수업에서 배운 Java의 싱글톤 구현 방식과 실제 프로젝트에서 사용한 NestJS의 의존성 주입을 비교하며 정리해보았다.

## 싱글톤 패턴이란?

싱글톤(Singleton) 패턴은 ==어떤 클래스가 애플리케이션 전체에서 오직 하나의 인스턴스만 가지도록 보장==하고, 그 인스턴스에 전역적으로 접근할 수 있게 만드는 생성 패턴이다.

수학에서 Single은 단 하나의 원소만 가지는 집합(e.g., {0})을 뜻하는데, 싱글톤 패턴도 이와 비슷한 맥락이다.

### 왜 필요한가?

어떤 객체는 생성 비용이 크거나 메모리를 많이 차지한다. 예를 들어 데이터베이스 커넥션 풀이나 설정 관리 객체 같은 경우, 매번 새로 만들면 리소스 낭비가 심하다. 그래서 ==한 번만 만들어 공유하는 방식==이 효율적이다.

수업에서는 다음과 같은 예시를 배웠다:
- **데이터베이스 커넥션 풀**: DB 연결은 비용이 높기 때문에 전역적으로 하나의 관리자 인스턴스로 운영
- **스레드 풀**: 스레드를 재사용하는 풀은 중앙 관리 객체 하나로 충분
- **로거(Logger)**: 애플리케이션 전반에서 로그 출력을 공유

나날모아 프로젝트에서도 Redis 캐시 매니저나 설정 관리 서비스가 딱 이런 케이스였다.

## Java에서 배운 싱글톤 구현

수업에서 Java로 배운 싱글톤의 전형적인 구조는 이렇다:

1. **생성자를 `private`으로 숨겨** 외부에서 `new`를 못 하게 막음
2. **클래스 내부에 `static` 필드**로 유일한 인스턴스 보관
3. **`public static getInstance()` 메서드**로 접근 경로 제공

### 기본 구현 (Lazy Initialization)

```java
public class Settings {
    private static Settings instance;
    
    private Settings() {
        System.out.println("Settings 인스턴스 생성");
    }
    
    public static Settings getInstance() {
        if (instance == null) {
            instance = new Settings();
        }
        return instance;
    }
    
    public void doSomething() {
        System.out.println("싱글톤 메서드 실행");
    }
}

// 사용
Settings s1 = Settings.getInstance();
Settings s2 = Settings.getInstance();
System.out.println(s1 == s2); // true
```

이 방식은 **Lazy Initialization**이라고 해서, 실제로 필요할 때만 인스턴스를 생성한다. 메모리 효율적이지만, ==멀티스레드 환경에서 문제==가 생긴다.

### 멀티스레드 문제와 해결

두 개의 스레드가 동시에 `getInstance()`를 호출하면 어떻게 될까?

```java
// Thread 1과 Thread 2가 동시 접근
if (instance == null) {  // 둘 다 null 체크 통과
    instance = new Settings();  // 인스턴스 2개 생성!
}
```

수업에서는 이 문제를 해결하기 위해 여러 방법을 배웠다.

#### 1. Eager Initialization

```java
public class Settings {
    // 클래스 로딩 시점에 즉시 생성
    private static final Settings INSTANCE = new Settings();
    
    private Settings() {}
    
    public static Settings getInstance() {
        return INSTANCE;
    }
}
```

JVM이 클래스 로딩 시 스레드 안전을 보장해주므로 안전하다. 하지만 ==사용하지 않아도 메모리를 차지==한다는 단점이 있다.

#### 2. Double-Checked Locking (DCL)

```java
public class Settings {
    private static volatile Settings instance;
    
    private Settings() {}
    
    public static Settings getInstance() {
        if (instance == null) {  // 첫 번째 체크
            synchronized (Settings.class) {
                if (instance == null) {  // 두 번째 체크
                    instance = new Settings();
                }
            }
        }
        return instance;
    }
}
```

성능과 lazy의 장점을 함께 노리지만 코드가 복잡해진다. `volatile` 키워드는 명령어 재배치 문제를 방지한다.

#### 3. Lazy Holder (Bill Pugh) - 권장 방식

```java
public class Settings {
    private Settings() {}
    
    // 내부 정적 클래스
    private static class Holder {
        private static final Settings INSTANCE = new Settings();
    }
    
    public static Settings getInstance() {
        return Holder.INSTANCE;
    }
}
```

==가장 권장되는 방식==이다. `getInstance()`가 처음 호출될 때만 `Holder` 클래스가 로딩되고, JVM이 스레드 안전하게 초기화를 보장한다. 동기화 코드도 필요 없다.

## TypeScript로 싱글톤 구현한다면?

그렇다면 TypeScript로 싱글톤을 구현한다면 어떻게 할까? Java와 비슷하지만 몇 가지 차이가 있다.

### 기본 구현

```typescript
class Settings {
  private static instance: Settings;
  private config: Map<string, any>;

  private constructor() {
    console.log('Settings 인스턴스 생성');
    this.config = new Map([
      ['theme', 'dark'],
      ['language', 'ko'],
    ]);
  }

  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }
    return Settings.instance;
  }

  public get(key: string): any {
    return this.config.get(key);
  }

  public set(key: string, value: any): void {
    this.config.set(key, value);
  }
}

// 사용
const settings1 = Settings.getInstance();
settings1.set('theme', 'light');

const settings2 = Settings.getInstance();
console.log(settings2.get('theme')); // 'light'
console.log(settings1 === settings2); // true
```

Java와 거의 유사하지만, TypeScript는 기본적으로 싱글 스레드 기반이라 멀티스레드 문제는 덜하다. 하지만 Worker Threads나 비동기 처리 시 Race Condition은 여전히 주의해야 한다.

### TypeScript의 한계

```typescript
// TypeScript의 private은 런타임에 강제되지 않음
const settings1 = Settings.getInstance();
const settings2 = new (Settings as any)(); // 타입 단언으로 우회 가능

console.log(settings1 === settings2); // false - 싱글톤 깨짐!
```

> [!WARNING]
> TypeScript의 접근 제한자(`private`, `protected`)는 컴파일 타임에만 동작한다. JavaScript로 변환되면 사라지기 때문에 완전한 보호가 어렵다.

## NestJS에서의 싱글톤 - 프레임워크가 해주는 마법

여기서부터가 정말 흥미로웠다. NestJS는 ==의존성 주입(DI) 컨테이너를 통해 프로바이더를 기본적으로 싱글톤으로 관리==한다. 즉, 개발자가 직접 싱글톤 패턴을 구현할 필요가 없다!

### NestJS의 기본 동작

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheManagerService {
  private cache: Map<string, any>;

  constructor() {
    console.log('CacheManagerService 인스턴스 생성');
    this.cache = new Map();
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }
}
```

```typescript
import { Controller, Get } from '@nestjs/common';
import { CacheManagerService } from './cache-manager.service';

@Controller('users')
export class UsersController {
  constructor(private readonly cacheManager: CacheManagerService) {}

  @Get()
  async findAll() {
    const cached = this.cacheManager.get('users');
    // ...
  }
}

@Controller('posts')
export class PostsController {
  constructor(private readonly cacheManager: CacheManagerService) {}

  @Get()
  async findAll() {
    const cached = this.cacheManager.get('posts');
    // ...
  }
}
```

`UsersController`와 `PostsController`는 ==동일한 `CacheManagerService` 인스턴스를 주입받는다==. NestJS IoC 컨테이너가 애플리케이션 부트스트랩 시점에 단 한 번만 생성하고, 이후 모든 의존성 주입 요청에 동일한 인스턴스를 반환하기 때문이다.

이게 바로 Java에서 배운 싱글톤 패턴이 프레임워크 차원에서 자동으로 적용된 것이다!

> [!IMPORTANT]
> NestJS의 프로바이더 스코프 기본값은 `DEFAULT`이며, 이는 싱글톤을 의미한다. 필요에 따라 `REQUEST` 스코프나 `TRANSIENT` 스코프로 변경할 수 있다.

### NestJS 방식의 장점

Java에서 직접 구현하던 싱글톤과 비교하면:

1. **자동 생명주기 관리** - getInstance() 같은 boilerplate 코드 불필요
2. **깔끔한 의존성 주입** - 생성자를 통한 명시적 DI
3. **테스트 용이성** - Mock 객체로 쉽게 대체 가능
4. **SOLID 원칙 준수** - DIP(의존성 역전 원칙) 자연스럽게 적용

## 실전 예제: 나날모아 프로젝트

나날모아 프로젝트에서 실제로 사용한 Redis 캐시 매니저 예제다.

### Redis 캐시 싱글톤

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheManagerService implements OnModuleInit {
  private redisClient: Redis;
  private readonly defaultTTL = 3600; // 1시간

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    // 모듈 초기화 시 Redis 연결 (한 번만 실행)
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
    });
    console.log('Redis 연결 완료');
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
```

이 서비스는 애플리케이션 전체에서 ==단 하나의 인스턴스만 생성==되므로, Redis 연결도 한 번만 이루어진다. 여러 서비스에서 주입받아 사용해도 동일한 Redis 클라이언트를 공유한다.

### 일정 관리 서비스에서 사용

```typescript
@Injectable()
export class SchedulesService {
  constructor(
    private readonly cacheManager: CacheManagerService,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findByDate(userUuid: string, date: Date): Promise<Schedule[]> {
    const cacheKey = `schedules:${userUuid}:${date.toISOString()}`;
    
    // 캐시 조회
    const cached = await this.cacheManager.get<Schedule[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // DB 조회
    const schedules = await this.scheduleRepository.find({
      where: { userUuid, date },
    });

    // 캐시 저장
    await this.cacheManager.set(cacheKey, schedules, 3600);

    return schedules;
  }
}
```

Java로 직접 구현했다면 `CacheManager.getInstance()`처럼 정적 메서드를 호출해야 했을 것이다. 하지만 NestJS는 생성자 주입으로 깔끔하게 처리된다.

## 싱글톤의 함정 - SOLID 원칙 위배

수업에서 강조했던 부분인데, 싱글톤 패턴은 편리하지만 ==SOLID 원칙을 위배하기 쉽다==.

### 1. SRP(단일 책임 원칙) 위배

```java
public class DatabaseConnection {
    private static DatabaseConnection instance;
    
    private DatabaseConnection() {} // 생명주기 관리 책임
    
    public static DatabaseConnection getInstance() { // 접근 제어 책임
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }
    
    public void query(String sql) {} // 본래 책임: DB 쿼리
}
```

클래스가 본래 역할(DB 쿼리)에 더해 ==인스턴스 생명주기 관리까지== 책임을 갖게 된다.

### 2. OCP(개방-폐쇄 원칙) 위배

```java
public class Logger {
    private static Logger instance;
    
    private Logger() {} // private 생성자
    
    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }
}

// 파일 로거로 확장하고 싶지만...
public class FileLogger extends Logger { // ❌ private 생성자 때문에 불가능
}
```

`private` 생성자는 ==상속/확장을 막아== 구조를 고정시킨다.

### 3. DIP(의존성 역전 원칙) 위배

```typescript
// 나쁜 예: 구체 클래스에 직접 의존
class UserService {
  createUser(name: string) {
    const logger = Logger.getInstance(); // 구체 클래스에 의존
    logger.log(`Creating user: ${name}`);
  }
}

// 테스트 시 Logger를 Mock으로 교체하기 어려움
describe('UserService', () => {
  it('should create user', () => {
    const service = new UserService();
    // Logger.getInstance()를 어떻게 Mock으로 바꿀까? 🤔
  });
});
```

클라이언트가 ==인터페이스가 아니라 구체 클래스==에 의존하게 되어 테스트가 불편해진다.

### NestJS의 DI를 활용한 개선

```typescript
// 인터페이스 정의
interface ILogger {
  log(message: string): void;
}

// 구현체
@Injectable()
export class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

// 서비스는 인터페이스에 의존
@Injectable()
export class UserService {
  constructor(private readonly logger: ILogger) {} // 추상화에 의존

  createUser(name: string) {
    this.logger.log(`Creating user: ${name}`);
  }
}

// 테스트 시 쉽게 Mock 주입
describe('UserService', () => {
  it('should create user', () => {
    const mockLogger: ILogger = { log: jest.fn() };
    const service = new UserService(mockLogger);
    
    service.createUser('John');
    
    expect(mockLogger.log).toHaveBeenCalledWith('Creating user: John');
  });
});
```

이렇게 하면 DIP를 준수하면서도 싱글톤의 이점을 누릴 수 있다.

## 싱글톤을 피해야 할 때

### REQUEST 스코프

요청마다 다른 인스턴스가 필요한 경우:

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private requestId: string;

  setRequestId(id: string) {
    this.requestId = id;
  }

  getRequestId(): string {
    return this.requestId;
  }
}
```

각 HTTP 요청마다 새로운 인스턴스가 생성된다.

### TRANSIENT 스코프

매번 새로운 인스턴스가 필요한 경우:

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class TaskRunnerService {
  private taskId: string;

  constructor() {
    this.taskId = Math.random().toString(36);
  }

  run() {
    console.log(`Running task: ${this.taskId}`);
  }
}
```

주입받을 때마다 새로운 인스턴스가 생성된다.

## 정리하며

이번 학기 소프트웨어 설계 과목을 들으면서 디자인 패턴의 이론을 배웠고, 나날모아 프로젝트를 진행하며 실전에 적용해볼 수 있었다.

싱글톤 패턴은 ==리소스를 효율적으로 관리하는 강력한 도구==지만, ==전역 상태 관리의 편리함 뒤에는 높은 결합도와 테스트 어려움==이라는 trade-off가 있다는 것을 배웠다.

특히 NestJS는 의존성 주입 컨테이너를 통해 싱글톤의 장점은 살리면서 단점은 완화시켰다는 점이 인상 깊었다. Java에서 직접 구현해야 했던 복잡한 패턴들이 프레임워크 차원에서 자동으로 제공되니, 개발자는 비즈니스 로직에 더 집중할 수 있었다.

앞으로 다른 디자인 패턴들도 이런 식으로 이론과 실전을 연결하며 정리해보면 좋을 것 같다.

## 참고 자료

- [NestJS 공식 문서 - Providers](https://docs.nestjs.com/providers)
- [NestJS 공식 문서 - Injection Scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
- [Refactoring Guru - Singleton Pattern](https://refactoring.guru/design-patterns/singleton)
