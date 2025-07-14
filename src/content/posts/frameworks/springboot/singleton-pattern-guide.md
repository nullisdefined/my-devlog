---
title: "[Spring Boot] Singleton 패턴 완벽 가이드"
slug: "singleton-pattern-guide"
date: 2025-01-15
tags: ["SpringBoot", "DesignPattern", "Singleton", "Java"]
category: "Frameworks/SpringBoot"
thumbnail: "https://img.shields.io/badge/Singleton-FF6B6B?style=for-the-badge&logo=java&logoColor=white"
draft: true
views: 0
---

![Singleton Pattern Guide](https://img.shields.io/badge/Singleton-FF6B6B?style=for-the-badge&logo=java&logoColor=white)

Singleton 패턴은 클래스의 인스턴스가 오직 하나만 생성되도록 보장하는 디자인 패턴이다. Spring Framework에서는 Bean의 기본 스코프가 Singleton이며, 이를 통해 메모리 효율성과 상태 공유를 달성한다. 다양한 구현 방식과 주의사항을 알아보자.

## Singleton 패턴이란?

Singleton 패턴은 생성 패턴(Creational Pattern) 중 하나로, 클래스의 인스턴스가 하나만 존재하도록 보장하고, 이에 대한 전역적인 접근점을 제공하는 패턴이다.

### Singleton 패턴의 특징

- **유일한 인스턴스**: 클래스의 인스턴스가 오직 하나만 존재
- **전역 접근**: 어디서든 해당 인스턴스에 접근 가능
- **지연 초기화**: 필요한 시점에 인스턴스 생성 (구현에 따라)
- **메모리 효율성**: 중복 객체 생성 방지

### 사용 사례

- **데이터베이스 연결 풀**: 연결 자원 관리
- **로거**: 애플리케이션 전체의 로깅 관리
- **캐시**: 메모리 기반 캐시 관리
- **설정 관리자**: 애플리케이션 설정 정보 관리
- **스레드 풀**: 스레드 자원 관리

## 다양한 Singleton 구현 방식

### 1. Eager Initialization (이른 초기화)

```java
public class EagerSingleton {
    
    // 클래스 로딩 시점에 인스턴스 생성
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    
    // private 생성자로 외부 인스턴스 생성 방지
    private EagerSingleton() {
        // 초기화 로직
        System.out.println("EagerSingleton instance created");
    }
    
    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
    
    public void doSomething() {
        System.out.println("EagerSingleton is working...");
    }
}

// 사용 예시
public class EagerSingletonExample {
    public static void main(String[] args) {
        EagerSingleton instance1 = EagerSingleton.getInstance();
        EagerSingleton instance2 = EagerSingleton.getInstance();
        
        System.out.println("Same instance: " + (instance1 == instance2)); // true
        instance1.doSomething();
    }
}
```

**장점**: 스레드 안전, 구현 간단  
**단점**: 클래스 로딩 시점에 생성되어 메모리 낭비 가능

### 2. Lazy Initialization (늦은 초기화)

```java
public class LazySingleton {
    
    private static LazySingleton instance;
    
    private LazySingleton() {
        System.out.println("LazySingleton instance created");
    }
    
    // 동기화 없는 버전 - 멀티스레드 환경에서 안전하지 않음
    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
    
    public void doSomething() {
        System.out.println("LazySingleton is working...");
    }
}

// 스레드 안전하지 않은 예시
public class LazySingletonProblem {
    public static void main(String[] args) {
        // 멀티스레드 환경에서 여러 인스턴스 생성 가능
        ExecutorService executor = Executors.newFixedThreadPool(10);
        
        for (int i = 0; i < 10; i++) {
            executor.submit(() -> {
                LazySingleton instance = LazySingleton.getInstance();
                System.out.println("Instance: " + instance.hashCode());
            });
        }
        
        executor.shutdown();
    }
}
```

**장점**: 필요한 시점에만 생성  
**단점**: 멀티스레드 환경에서 안전하지 않음

### 3. Thread-Safe Lazy Initialization (스레드 안전한 늦은 초기화)

```java
public class ThreadSafeLazySingleton {
    
    private static ThreadSafeLazySingleton instance;
    
    private ThreadSafeLazySingleton() {
        System.out.println("ThreadSafeLazySingleton instance created");
    }
    
    // synchronized 키워드로 스레드 안전성 보장
    public static synchronized ThreadSafeLazySingleton getInstance() {
        if (instance == null) {
            instance = new ThreadSafeLazySingleton();
        }
        return instance;
    }
    
    public void doSomething() {
        System.out.println("ThreadSafeLazySingleton is working...");
    }
}

// 성능 최적화된 Double-Checked Locking
public class DoubleCheckedLockingSingleton {
    
    // volatile 키워드로 메모리 가시성 보장
    private static volatile DoubleCheckedLockingSingleton instance;
    
    private DoubleCheckedLockingSingleton() {
        System.out.println("DoubleCheckedLockingSingleton instance created");
    }
    
    public static DoubleCheckedLockingSingleton getInstance() {
        if (instance == null) { // 첫 번째 체크
            synchronized (DoubleCheckedLockingSingleton.class) {
                if (instance == null) { // 두 번째 체크
                    instance = new DoubleCheckedLockingSingleton();
                }
            }
        }
        return instance;
    }
    
    public void doSomething() {
        System.out.println("DoubleCheckedLockingSingleton is working...");
    }
}
```

**Thread-Safe**: 스레드 안전하지만 성능 오버헤드 있음  
**Double-Checked Locking**: 성능 최적화되었지만 복잡함

### 4. Bill Pugh Solution (권장 방식)

```java
public class BillPughSingleton {
    
    private BillPughSingleton() {
        System.out.println("BillPughSingleton instance created");
    }
    
    // 내부 정적 클래스를 이용한 지연 초기화
    private static class SingletonHelper {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }
    
    public static BillPughSingleton getInstance() {
        return SingletonHelper.INSTANCE;
    }
    
    public void doSomething() {
        System.out.println("BillPughSingleton is working...");
    }
}
```

**장점**: 스레드 안전, 지연 초기화, 성능 최적화  
**추천**: 가장 널리 사용되는 방식

### 5. Enum Singleton (가장 안전한 방식)

```java
public enum EnumSingleton {
    INSTANCE;
    
    private String value;
    
    EnumSingleton() {
        System.out.println("EnumSingleton instance created");
        this.value = "Default Value";
    }
    
    public String getValue() {
        return value;
    }
    
    public void setValue(String value) {
        this.value = value;
    }
    
    public void doSomething() {
        System.out.println("EnumSingleton is working with value: " + value);
    }
}

// 사용 예시
public class EnumSingletonExample {
    public static void main(String[] args) {
        EnumSingleton instance1 = EnumSingleton.INSTANCE;
        EnumSingleton instance2 = EnumSingleton.INSTANCE;
        
        System.out.println("Same instance: " + (instance1 == instance2)); // true
        
        instance1.setValue("Modified Value");
        System.out.println("Instance2 value: " + instance2.getValue()); // Modified Value
        
        instance1.doSomething();
    }
}
```

**장점**: 직렬화, 리플렉션, 멀티스레드 모든 상황에서 안전  
**추천**: Joshua Bloch가 권장하는 방식

## Spring에서의 Singleton

### 1. Spring Bean의 기본 스코프

```java
// 기본적으로 Singleton 스코프
@Component
public class DatabaseConnectionPool {
    
    private final List<Connection> connections = new ArrayList<>();
    
    @PostConstruct
    public void initialize() {
        // 연결 풀 초기화
        for (int i = 0; i < 10; i++) {
            connections.add(createConnection());
        }
        System.out.println("Connection pool initialized with " + connections.size() + " connections");
    }
    
    public Connection getConnection() {
        synchronized (connections) {
            return connections.isEmpty() ? null : connections.remove(0);
        }
    }
    
    public void returnConnection(Connection connection) {
        synchronized (connections) {
            connections.add(connection);
        }
    }
    
    private Connection createConnection() {
        // 실제 DB 연결 생성 로직
        return new MockConnection();
    }
    
    @PreDestroy
    public void cleanup() {
        // 연결 정리
        synchronized (connections) {
            connections.forEach(this::closeConnection);
            connections.clear();
        }
        System.out.println("Connection pool cleaned up");
    }
    
    private void closeConnection(Connection connection) {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            System.err.println("Error closing connection: " + e.getMessage());
        }
    }
}
```

### 2. 명시적 Singleton 스코프 선언

```java
@Component
@Scope("singleton") // 기본값이므로 생략 가능
public class ConfigurationManager {
    
    private final Map<String, String> properties = new ConcurrentHashMap<>();
    
    @PostConstruct
    public void loadProperties() {
        // 설정 파일에서 프로퍼티 로드
        properties.put("app.name", "MyApplication");
        properties.put("app.version", "1.0.0");
        properties.put("app.environment", "production");
        
        System.out.println("Configuration loaded: " + properties.size() + " properties");
    }
    
    public String getProperty(String key) {
        return properties.get(key);
    }
    
    public String getProperty(String key, String defaultValue) {
        return properties.getOrDefault(key, defaultValue);
    }
    
    public void setProperty(String key, String value) {
        properties.put(key, value);
    }
    
    public Map<String, String> getAllProperties() {
        return new HashMap<>(properties);
    }
}
```

### 3. Configuration 클래스에서 Singleton Bean 생성

```java
@Configuration
public class SingletonConfig {
    
    // 기본적으로 Singleton
    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        cacheManager.setCacheNames(Arrays.asList("users", "products", "orders"));
        return cacheManager;
    }
    
    // 명시적 Singleton 선언
    @Bean
    @Scope("singleton")
    public EventPublisher eventPublisher() {
        return new AsyncEventPublisher();
    }
    
    // 복잡한 초기화가 필요한 Singleton
    @Bean
    public MetricsCollector metricsCollector() {
        MetricsCollector collector = new MetricsCollector();
        collector.setCollectionInterval(Duration.ofSeconds(30));
        collector.setMaxMetrics(1000);
        collector.start();
        return collector;
    }
}

// 이벤트 발행자 구현
public class AsyncEventPublisher implements EventPublisher {
    
    private final ExecutorService executorService;
    private final List<EventListener> listeners;
    
    public AsyncEventPublisher() {
        this.executorService = Executors.newFixedThreadPool(5);
        this.listeners = new CopyOnWriteArrayList<>();
        System.out.println("AsyncEventPublisher created");
    }
    
    @Override
    public void publishEvent(Event event) {
        listeners.forEach(listener -> 
            executorService.submit(() -> listener.onEvent(event))
        );
    }
    
    @Override
    public void addListener(EventListener listener) {
        listeners.add(listener);
    }
    
    @Override
    public void removeListener(EventListener listener) {
        listeners.remove(listener);
    }
    
    @PreDestroy
    public void shutdown() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
            Thread.currentThread().interrupt();
        }
        System.out.println("AsyncEventPublisher shutdown");
    }
}
```

## 실제 사용 사례

### 1. 로거 구현

```java
@Component
public class ApplicationLogger {
    
    private final Logger logger = LoggerFactory.getLogger(ApplicationLogger.class);
    private final Queue<LogEntry> logBuffer = new ConcurrentLinkedQueue<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    @PostConstruct
    public void initialize() {
        // 주기적으로 로그 버퍼 플러시
        scheduler.scheduleAtFixedRate(this::flushLogs, 10, 10, TimeUnit.SECONDS);
        logger.info("ApplicationLogger initialized");
    }
    
    public void logInfo(String message) {
        logBuffer.offer(new LogEntry(Level.INFO, message, Instant.now()));
    }
    
    public void logError(String message, Throwable throwable) {
        logBuffer.offer(new LogEntry(Level.ERROR, message, Instant.now(), throwable));
    }
    
    public void logDebug(String message) {
        logBuffer.offer(new LogEntry(Level.DEBUG, message, Instant.now()));
    }
    
    private void flushLogs() {
        List<LogEntry> logsToFlush = new ArrayList<>();
        LogEntry entry;
        
        while ((entry = logBuffer.poll()) != null) {
            logsToFlush.add(entry);
        }
        
        if (!logsToFlush.isEmpty()) {
            // 실제 로그 시스템에 기록
            logsToFlush.forEach(this::writeToLog);
        }
    }
    
    private void writeToLog(LogEntry entry) {
        switch (entry.getLevel()) {
            case INFO:
                logger.info("[{}] {}", entry.getTimestamp(), entry.getMessage());
                break;
            case ERROR:
                if (entry.getThrowable() != null) {
                    logger.error("[{}] {}", entry.getTimestamp(), entry.getMessage(), entry.getThrowable());
                } else {
                    logger.error("[{}] {}", entry.getTimestamp(), entry.getMessage());
                }
                break;
            case DEBUG:
                logger.debug("[{}] {}", entry.getTimestamp(), entry.getMessage());
                break;
        }
    }
    
    @PreDestroy
    public void cleanup() {
        flushLogs(); // 마지막 로그 플러시
        scheduler.shutdown();
        logger.info("ApplicationLogger cleaned up");
    }
    
    @Data
    @AllArgsConstructor
    private static class LogEntry {
        private Level level;
        private String message;
        private Instant timestamp;
        private Throwable throwable;
        
        public LogEntry(Level level, String message, Instant timestamp) {
            this(level, message, timestamp, null);
        }
    }
    
    enum Level {
        INFO, ERROR, DEBUG
    }
}
```

### 2. 캐시 매니저

```java
@Component
public class ApplicationCacheManager {
    
    private final Map<String, Cache> caches = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    
    @PostConstruct
    public void initialize() {
        // 기본 캐시들 생성
        createCache("users", Duration.ofMinutes(30), 1000);
        createCache("products", Duration.ofHours(1), 500);
        createCache("sessions", Duration.ofMinutes(15), 2000);
        
        // 주기적으로 만료된 엔트리 정리
        scheduler.scheduleAtFixedRate(this::evictExpiredEntries, 5, 5, TimeUnit.MINUTES);
        
        System.out.println("ApplicationCacheManager initialized with " + caches.size() + " caches");
    }
    
    public void createCache(String name, Duration ttl, int maxSize) {
        caches.put(name, new Cache(name, ttl, maxSize));
    }
    
    public void put(String cacheName, String key, Object value) {
        Cache cache = caches.get(cacheName);
        if (cache != null) {
            cache.put(key, value);
        }
    }
    
    public <T> Optional<T> get(String cacheName, String key, Class<T> type) {
        Cache cache = caches.get(cacheName);
        if (cache != null) {
            Object value = cache.get(key);
            if (value != null && type.isAssignableFrom(value.getClass())) {
                return Optional.of(type.cast(value));
            }
        }
        return Optional.empty();
    }
    
    public void evict(String cacheName, String key) {
        Cache cache = caches.get(cacheName);
        if (cache != null) {
            cache.evict(key);
        }
    }
    
    public void evictAll(String cacheName) {
        Cache cache = caches.get(cacheName);
        if (cache != null) {
            cache.evictAll();
        }
    }
    
    public CacheStatistics getStatistics(String cacheName) {
        Cache cache = caches.get(cacheName);
        return cache != null ? cache.getStatistics() : null;
    }
    
    private void evictExpiredEntries() {
        caches.values().forEach(Cache::evictExpired);
    }
    
    @PreDestroy
    public void cleanup() {
        caches.values().forEach(Cache::evictAll);
        scheduler.shutdown();
        System.out.println("ApplicationCacheManager cleaned up");
    }
    
    // 내부 캐시 구현
    private static class Cache {
        private final String name;
        private final Duration ttl;
        private final int maxSize;
        private final Map<String, CacheEntry> data = new ConcurrentHashMap<>();
        private final AtomicLong hits = new AtomicLong(0);
        private final AtomicLong misses = new AtomicLong(0);
        
        public Cache(String name, Duration ttl, int maxSize) {
            this.name = name;
            this.ttl = ttl;
            this.maxSize = maxSize;
        }
        
        public void put(String key, Object value) {
            // 크기 제한 확인
            if (data.size() >= maxSize) {
                evictOldest();
            }
            
            data.put(key, new CacheEntry(value, Instant.now().plus(ttl)));
        }
        
        public Object get(String key) {
            CacheEntry entry = data.get(key);
            if (entry != null) {
                if (entry.isExpired()) {
                    data.remove(key);
                    misses.incrementAndGet();
                    return null;
                } else {
                    hits.incrementAndGet();
                    return entry.getValue();
                }
            } else {
                misses.incrementAndGet();
                return null;
            }
        }
        
        public void evict(String key) {
            data.remove(key);
        }
        
        public void evictAll() {
            data.clear();
        }
        
        public void evictExpired() {
            data.entrySet().removeIf(entry -> entry.getValue().isExpired());
        }
        
        private void evictOldest() {
            // LRU 방식으로 가장 오래된 엔트리 제거 (간단 구현)
            if (!data.isEmpty()) {
                String oldestKey = data.keySet().iterator().next();
                data.remove(oldestKey);
            }
        }
        
        public CacheStatistics getStatistics() {
            long totalRequests = hits.get() + misses.get();
            double hitRate = totalRequests > 0 ? (double) hits.get() / totalRequests : 0.0;
            
            return new CacheStatistics(name, data.size(), hits.get(), misses.get(), hitRate);
        }
    }
    
    @Data
    @AllArgsConstructor
    private static class CacheEntry {
        private Object value;
        private Instant expiryTime;
        
        public boolean isExpired() {
            return Instant.now().isAfter(expiryTime);
        }
    }
    
    @Data
    @AllArgsConstructor
    public static class CacheStatistics {
        private String cacheName;
        private int size;
        private long hits;
        private long misses;
        private double hitRate;
    }
}
```

### 3. 스레드 풀 매니저

```java
@Component
public class ThreadPoolManager {
    
    private final Map<String, ExecutorService> executors = new ConcurrentHashMap<>();
    private final Map<String, ThreadPoolStatistics> statistics = new ConcurrentHashMap<>();
    
    @PostConstruct
    public void initialize() {
        // 기본 스레드 풀들 생성
        createFixedThreadPool("io-operations", 10);
        createFixedThreadPool("cpu-intensive", Runtime.getRuntime().availableProcessors());
        createCachedThreadPool("event-processing");
        
        // 통계 수집 스케줄러
        ScheduledExecutorService statsCollector = Executors.newScheduledThreadPool(1);
        statsCollector.scheduleAtFixedRate(this::collectStatistics, 1, 1, TimeUnit.MINUTES);
        
        System.out.println("ThreadPoolManager initialized with " + executors.size() + " thread pools");
    }
    
    public void createFixedThreadPool(String name, int threads) {
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
            threads, threads, 0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<>(),
            new ThreadFactory() {
                private final AtomicInteger threadNumber = new AtomicInteger(1);
                @Override
                public Thread newThread(Runnable r) {
                    Thread t = new Thread(r, name + "-thread-" + threadNumber.getAndIncrement());
                    t.setDaemon(false);
                    return t;
                }
            }
        );
        
        executors.put(name, executor);
        statistics.put(name, new ThreadPoolStatistics(name, threads, "FIXED"));
    }
    
    public void createCachedThreadPool(String name) {
        ExecutorService executor = Executors.newCachedThreadPool(r -> {
            Thread t = new Thread(r, name + "-cached-thread");
            t.setDaemon(false);
            return t;
        });
        
        executors.put(name, executor);
        statistics.put(name, new ThreadPoolStatistics(name, 0, "CACHED"));
    }
    
    public CompletableFuture<Void> submitTask(String poolName, Runnable task) {
        ExecutorService executor = executors.get(poolName);
        if (executor == null) {
            throw new IllegalArgumentException("Thread pool not found: " + poolName);
        }
        
        return CompletableFuture.runAsync(task, executor);
    }
    
    public <T> CompletableFuture<T> submitTask(String poolName, Callable<T> task) {
        ExecutorService executor = executors.get(poolName);
        if (executor == null) {
            throw new IllegalArgumentException("Thread pool not found: " + poolName);
        }
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                return task.call();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }, executor);
    }
    
    public ThreadPoolStatistics getStatistics(String poolName) {
        return statistics.get(poolName);
    }
    
    public Map<String, ThreadPoolStatistics> getAllStatistics() {
        return new HashMap<>(statistics);
    }
    
    private void collectStatistics() {
        executors.forEach((name, executor) -> {
            if (executor instanceof ThreadPoolExecutor) {
                ThreadPoolExecutor tpe = (ThreadPoolExecutor) executor;
                ThreadPoolStatistics stats = statistics.get(name);
                if (stats != null) {
                    stats.setActiveThreads(tpe.getActiveCount());
                    stats.setCompletedTasks(tpe.getCompletedTaskCount());
                    stats.setQueueSize(tpe.getQueue().size());
                }
            }
        });
    }
    
    @PreDestroy
    public void cleanup() {
        executors.forEach((name, executor) -> {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        });
        
        System.out.println("ThreadPoolManager cleaned up " + executors.size() + " thread pools");
    }
    
    @Data
    @AllArgsConstructor
    public static class ThreadPoolStatistics {
        private String poolName;
        private int corePoolSize;
        private String type;
        private int activeThreads;
        private long completedTasks;
        private int queueSize;
        private Instant lastUpdated;
        
        public ThreadPoolStatistics(String poolName, int corePoolSize, String type) {
            this.poolName = poolName;
            this.corePoolSize = corePoolSize;
            this.type = type;
            this.activeThreads = 0;
            this.completedTasks = 0;
            this.queueSize = 0;
            this.lastUpdated = Instant.now();
        }
        
        public void setActiveThreads(int activeThreads) {
            this.activeThreads = activeThreads;
            this.lastUpdated = Instant.now();
        }
        
        public void setCompletedTasks(long completedTasks) {
            this.completedTasks = completedTasks;
            this.lastUpdated = Instant.now();
        }
        
        public void setQueueSize(int queueSize) {
            this.queueSize = queueSize;
            this.lastUpdated = Instant.now();
        }
    }
}
```

## Singleton 패턴의 주의사항

### 1. 멀티스레드 환경에서의 문제

```java
// 잘못된 구현 - Race Condition 발생 가능
public class UnsafeSingleton {
    private static UnsafeSingleton instance;
    private int counter = 0;
    
    private UnsafeSingleton() {}
    
    public static UnsafeSingleton getInstance() {
        if (instance == null) {
            instance = new UnsafeSingleton(); // 여러 스레드가 동시에 생성 가능
        }
        return instance;
    }
    
    // 스레드 안전하지 않은 메서드
    public int increment() {
        return ++counter; // Race Condition 발생 가능
    }
}

// 올바른 구현
@Component
public class ThreadSafeSingleton {
    private final AtomicInteger counter = new AtomicInteger(0);
    
    // 스레드 안전한 메서드
    public int increment() {
        return counter.incrementAndGet();
    }
    
    public int getCounter() {
        return counter.get();
    }
}
```

### 2. 테스트의 어려움

```java
// 테스트하기 어려운 Singleton
public class HardToTestSingleton {
    private static HardToTestSingleton instance;
    private String state = "initial";
    
    private HardToTestSingleton() {}
    
    public static HardToTestSingleton getInstance() {
        if (instance == null) {
            instance = new HardToTestSingleton();
        }
        return instance;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
}

// 테스트 친화적인 설계
@Component
public class TestFriendlyService {
    private String state = "initial";
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getState() {
        return state;
    }
    
    // 테스트를 위한 리셋 메서드
    @VisibleForTesting
    public void reset() {
        this.state = "initial";
    }
}

// 테스트 코드
@SpringBootTest
class TestFriendlyServiceTest {
    
    @Autowired
    private TestFriendlyService service;
    
    @BeforeEach
    void setUp() {
        service.reset(); // 각 테스트마다 상태 초기화
    }
    
    @Test
    void testSetState() {
        service.setState("modified");
        assertThat(service.getState()).isEqualTo("modified");
    }
}
```

### 3. 메모리 누수 방지

```java
@Component
public class ResourceManager {
    
    private final Map<String, Resource> resources = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    
    @PostConstruct
    public void initialize() {
        // 리소스 정리 스케줄러
        scheduler.scheduleAtFixedRate(this::cleanupResources, 1, 1, TimeUnit.HOURS);
    }
    
    public void addResource(String key, Resource resource) {
        resources.put(key, resource);
    }
    
    public Resource getResource(String key) {
        return resources.get(key);
    }
    
    public void removeResource(String key) {
        Resource resource = resources.remove(key);
        if (resource != null) {
            resource.cleanup(); // 리소스 정리
        }
    }
    
    private void cleanupResources() {
        // 만료된 리소스 정리
        resources.entrySet().removeIf(entry -> {
            Resource resource = entry.getValue();
            if (resource.isExpired()) {
                resource.cleanup();
                return true;
            }
            return false;
        });
    }
    
    @PreDestroy
    public void cleanup() {
        // 모든 리소스 정리
        resources.values().forEach(Resource::cleanup);
        resources.clear();
        
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
    
    public interface Resource {
        boolean isExpired();
        void cleanup();
    }
}
```

## Singleton 패턴 실무 적용 가이드

Singleton 패턴을 실무에서 효과적으로 활용하기 위한 핵심 전략과 주의사항을 살펴보자.

### 언제 Singleton을 사용해야 할까?

**적합한 경우**
1. **상태가 없는 서비스 객체**: 유틸리티 클래스나 헬퍼 클래스
2. **공유 리소스 관리**: 데이터베이스 연결 풀, 캐시, 로거
3. **설정 관리**: 애플리케이션 전역 설정 정보
4. **팩토리 객체**: 객체 생성을 담당하는 팩토리

**피해야 할 경우**
1. **상태를 가지는 객체**: 데이터 변경으로 인한 부작용 가능
2. **테스트가 어려운 경우**: Mock 객체 주입이 불가능한 상황
3. **확장성이 필요한 경우**: 향후 여러 인스턴스가 필요할 수 있는 경우

### 성능과 메모리 최적화

**지연 초기화 활용**
```java
@Component
@Lazy  // 처음 사용될 때까지 Bean 생성을 지연
public class HeavyResourceManager {
    
    @PostConstruct
    public void init() {
        // 무거운 초기화 작업
        log.info("Heavy resource initialized");
    }
}
```

### Singleton 패턴의 안티패턴과 해결책

**문제**: 전역 상태로 인한 테스트 어려움
**해결**: 의존성 주입을 통한 결합도 완화

```java
// 좋은 예: 의존성 주입 활용
@Service
public class OrderService {
    private final Logger logger;
    
    public OrderService(Logger logger) {
        this.logger = logger;
    }
    
    public void processOrder(Order order) {
        logger.log("Processing order: " + order.getId());
        // 테스트 시 Mock Logger 주입 가능
    }
}
```

## 마치며

Singleton 패턴은 올바르게 사용하면 메모리 효율성과 성능 향상을 가져다주는 강력한 패턴이다. 하지만 남용하면 테스트의 어려움과 강한 결합도라는 문제를 야기할 수 있다.

### 성공적인 Singleton 활용을 위한 핵심 원칙

**1. 목적 명확화**: 정말로 전역적으로 유일해야 하는가?
**2. 상태 최소화**: 가능한 한 상태가 없는 객체로 설계
**3. 스레드 안전성**: 멀티스레드 환경에서의 안전성 보장
**4. 테스트 가능성**: 의존성 주입을 통한 테스트 용이성 확보
**5. Spring 활용**: 직접 구현보다는 Spring Container 활용

### 현대적 접근법

최신 Spring 애플리케이션에서는 전통적인 Singleton 패턴보다는 Spring의 Bean 관리 기능을 활용하는 것이 권장된다. 이를 통해 Singleton의 장점은 유지하면서도 테스트 가능성과 유연성을 확보할 수 있다.

Singleton 패턴을 제대로 이해하고 적절히 활용하면 효율적이고 안정적인 애플리케이션을 구축할 수 있다. 이 가이드가 여러분의 Singleton 패턴 활용에 도움이 되기를 바란다.

### 추가 학습 자료

**필수 도서**
- 『디자인 패턴』 - GoF
- 『Effective Java 3판』 - Joshua Bloch

**온라인 자료**
- [Spring Framework Bean Scopes](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes)
- [Java Singleton Design Pattern Best Practices](https://www.digitalocean.com/community/tutorials/java-singleton-design-pattern-best-practices-examples)

**실무 가이드**
- [Singleton Pattern in Java](https://www.baeldung.com/java-singleton)
- [Spring Singleton vs Prototype](https://www.baeldung.com/spring-bean-scopes) 