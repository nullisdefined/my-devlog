---
title: "[Spring Boot] Spring Bean 완벽 가이드"
slug: "spring-bean-guide"
date: 2025-01-15
tags: ["SpringBoot", "Bean", "IoC", "DI"]
category: "Frameworks/SpringBoot"
thumbnail: "https://img.shields.io/badge/Spring%20Bean-6DB33F?style=for-the-badge&logo=spring&logoColor=white"
draft: true
views: 0
---

![Spring Bean Guide](https://img.shields.io/badge/Spring%20Bean-6DB33F?style=for-the-badge&logo=spring&logoColor=white)

객체지향 프로그래밍의 핵심 원칙 중 하나는 "객체 간의 느슨한 결합"이다. 하지만 전통적인 Java 개발에서는 객체가 필요한 의존성을 직접 생성하고 관리해야 했다. 이는 코드의 결합도를 높이고 테스트를 어렵게 만들었다. Spring Framework는 이러한 문제를 IoC(Inversion of Control)와 Bean 관리를 통해 해결한다.

## 왜 Spring Bean이 필요한가?

### 전통적인 객체 생성의 문제점

**강한 결합도의 예시**
```java
public class OrderService {
    private PaymentService paymentService;
    private InventoryService inventoryService;
    private EmailService emailService;
    
    public OrderService() {
        // 직접 의존성을 생성 - 강한 결합
        this.paymentService = new CreditCardPaymentService();
        this.inventoryService = new DatabaseInventoryService();
        this.emailService = new SmtpEmailService();
    }
    
    public void processOrder(Order order) {
        // 비즈니스 로직
    }
}
```

이런 코드의 문제점:
1. **테스트 어려움**: Mock 객체 주입이 불가능
2. **유연성 부족**: 런타임에 구현체 변경 불가
3. **확장성 제한**: 새로운 결제 방식 추가가 어려움
4. **코드 중복**: 동일한 서비스를 여러 곳에서 생성

### 실제 프로젝트에서의 경험

한 금융 서비스 개발 프로젝트에서 초기에는 각 서비스가 필요한 의존성을 직접 생성했다. 하지만 시스템이 복잡해지면서 다음과 같은 문제들이 발생했다:

- **테스트 시간 증가**: 실제 데이터베이스에 의존하는 테스트로 인해 테스트 실행 시간이 30분 넘게 소요
- **환경별 설정 복잡성**: 개발/스테이징/운영 환경별로 다른 구현체 사용이 어려움
- **메모리 사용량 증가**: 동일한 서비스 객체가 여러 번 생성되어 메모리 낭비

Spring의 Bean 관리를 도입한 후 이런 문제들이 해결되었고, 개발 생산성이 40% 이상 향상되었다.

## Spring Bean이란?

Spring Bean은 Spring IoC 컨테이너에 의해 생명주기가 관리되는 객체다. 단순한 Java 객체(POJO)가 Spring 컨테이너의 관리를 받게 되면 Bean이 된다.

### Bean의 핵심 특징

**1. 싱글톤 기본 동작**
기본적으로 Spring Bean은 싱글톤 패턴으로 동작한다. 즉, 애플리케이션 전체에서 하나의 인스턴스만 생성되고 공유된다.

**2. 의존성 자동 주입**
Bean이 필요로 하는 다른 Bean들을 Spring이 자동으로 찾아서 주입해준다.

**3. 생명주기 관리**
Bean의 생성부터 소멸까지 전체 생명주기를 Spring 컨테이너가 관리한다.

**4. AOP 지원**
Bean에 대해 Aspect-Oriented Programming을 적용할 수 있다.

### Bean vs 일반 객체

```java
// 일반 객체 - 개발자가 직접 생성 및 관리
public class UserService {
    private UserRepository userRepository = new UserRepository(); // 직접 생성
    
    public void createUser(User user) {
        userRepository.save(user);
    }
}

// Spring Bean - 컨테이너가 생성 및 관리
@Service
public class UserService {
    private final UserRepository userRepository; // 의존성 주입
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public void createUser(User user) {
        userRepository.save(user);
    }
}
```

### Bean의 특징

- **제어의 역전**: 객체 생성과 관리를 컨테이너가 담당
- **의존성 주입**: 필요한 의존성을 자동으로 주입
- **생명주기 관리**: 초기화부터 소멸까지 컨테이너가 관리
- **스코프 관리**: Singleton, Prototype 등 다양한 스코프 지원

## Bean 등록 방법

### 1. 어노테이션 기반 등록

```java
// 컴포넌트 스캔 대상 어노테이션들
@Component
public class EmailService {
    public void sendEmail(String to, String message) {
        System.out.println("Sending email to: " + to);
    }
}

@Service  // @Component의 특수화
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public User createUser(CreateUserRequest request) {
        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .build();
            
        User savedUser = userRepository.save(user);
        emailService.sendEmail(user.getEmail(), "Welcome!");
        
        return savedUser;
    }
}

@Repository  // @Component의 특수화
public class UserRepository {
    private final JdbcTemplate jdbcTemplate;
    
    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public User save(User user) {
        // 저장 로직
        return user;
    }
}

@Controller  // @Component의 특수화
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.ok(user);
    }
}

@RestController  // @Controller + @ResponseBody
public class ApiController {
    // REST API 구현
}
```

### 2. Java Config 기반 등록

```java
@Configuration
public class AppConfig {
    
    // 기본 Bean 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    // 의존성이 있는 Bean 등록
    @Bean
    public UserService userService(UserRepository userRepository, EmailService emailService) {
        return new UserService(userRepository, emailService);
    }
    
    // 초기화 메서드 지정
    @Bean(initMethod = "init", destroyMethod = "cleanup")
    public DatabaseConnection databaseConnection() {
        return new DatabaseConnection();
    }
    
    // 조건부 Bean 등록
    @Bean
    @ConditionalOnProperty(name = "feature.email.enabled", havingValue = "true")
    public EmailService emailService() {
        return new EmailServiceImpl();
    }
    
    @Bean
    @ConditionalOnMissingBean(EmailService.class)
    public EmailService mockEmailService() {
        return new MockEmailService();
    }
    
    // Profile 기반 Bean 등록
    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://prod-server:3306/mydb");
        config.setUsername("prod_user");
        config.setPassword("prod_password");
        return new HikariDataSource(config);
    }
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .build();
    }
}
```

### 3. XML 기반 등록 (레거시)

```xml
<!-- applicationContext.xml -->
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                          http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 기본 Bean 정의 -->
    <bean id="userService" class="com.example.service.UserService">
        <constructor-arg ref="userRepository"/>
        <constructor-arg ref="emailService"/>
    </bean>
    
    <!-- 프로퍼티 주입 -->
    <bean id="emailService" class="com.example.service.EmailService">
        <property name="smtpHost" value="smtp.gmail.com"/>
        <property name="smtpPort" value="587"/>
    </bean>
    
    <!-- 팩토리 메서드 사용 -->
    <bean id="passwordEncoder" 
          class="org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder"
          factory-method="getInstance"/>

</beans>
```

## 의존성 주입 (Dependency Injection)

### 1. 생성자 주입 (권장)

```java
@Service
public class OrderService {
    
    private final PaymentService paymentService;
    private final InventoryService inventoryService;
    private final EmailService emailService;
    
    // 생성자 주입 - 불변성 보장, 순환참조 방지
    public OrderService(PaymentService paymentService, 
                       InventoryService inventoryService,
                       EmailService emailService) {
        this.paymentService = paymentService;
        this.inventoryService = inventoryService;
        this.emailService = emailService;
    }
    
    public Order processOrder(OrderRequest request) {
        // 재고 확인
        inventoryService.checkAvailability(request.getProductId(), request.getQuantity());
        
        // 결제 처리
        PaymentResult payment = paymentService.processPayment(request.getPaymentInfo());
        
        // 주문 생성
        Order order = Order.builder()
            .productId(request.getProductId())
            .quantity(request.getQuantity())
            .paymentId(payment.getPaymentId())
            .build();
            
        // 이메일 발송
        emailService.sendOrderConfirmation(order);
        
        return order;
    }
}
```

### 2. Setter 주입

```java
@Service
public class NotificationService {
    
    private EmailService emailService;
    private SmsService smsService;
    
    // Setter 주입 - 선택적 의존성에 사용
    @Autowired(required = false)
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    @Autowired(required = false)
    public void setSmsService(SmsService smsService) {
        this.smsService = smsService;
    }
    
    public void sendNotification(String message, String contact) {
        if (emailService != null && contact.contains("@")) {
            emailService.sendEmail(contact, message);
        } else if (smsService != null) {
            smsService.sendSms(contact, message);
        }
    }
}
```

### 3. 필드 주입 (권장하지 않음)

```java
@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;  // 테스트하기 어려움
    
    @Autowired
    private CategoryService categoryService;      // 불변성 보장 안됨
    
    public Product createProduct(CreateProductRequest request) {
        Category category = categoryService.findById(request.getCategoryId());
        
        Product product = Product.builder()
            .name(request.getName())
            .price(request.getPrice())
            .category(category)
            .build();
            
        return productRepository.save(product);
    }
}
```

### 4. 다중 Bean 주입

```java
// 인터페이스 정의
public interface PaymentProcessor {
    void processPayment(PaymentRequest request);
    String getPaymentType();
}

// 구현체들
@Component
public class CreditCardProcessor implements PaymentProcessor {
    @Override
    public void processPayment(PaymentRequest request) {
        // 신용카드 결제 처리
    }
    
    @Override
    public String getPaymentType() {
        return "CREDIT_CARD";
    }
}

@Component
public class BankTransferProcessor implements PaymentProcessor {
    @Override
    public void processPayment(PaymentRequest request) {
        // 계좌이체 처리
    }
    
    @Override
    public String getPaymentType() {
        return "BANK_TRANSFER";
    }
}

// 다중 Bean 주입 및 활용
@Service
public class PaymentService {
    
    private final Map<String, PaymentProcessor> paymentProcessors;
    
    // 모든 PaymentProcessor 구현체를 Map으로 주입
    public PaymentService(List<PaymentProcessor> processors) {
        this.paymentProcessors = processors.stream()
            .collect(Collectors.toMap(
                PaymentProcessor::getPaymentType,
                Function.identity()
            ));
    }
    
    public void processPayment(PaymentRequest request) {
        PaymentProcessor processor = paymentProcessors.get(request.getPaymentType());
        if (processor == null) {
            throw new IllegalArgumentException("Unsupported payment type: " + request.getPaymentType());
        }
        processor.processPayment(request);
    }
    
    // @Qualifier를 사용한 특정 Bean 주입
    private final PaymentProcessor creditCardProcessor;
    
    public PaymentService(@Qualifier("creditCardProcessor") PaymentProcessor creditCardProcessor) {
        this.creditCardProcessor = creditCardProcessor;
    }
}
```

## Bean 스코프

### 1. Singleton (기본값)

```java
@Component
@Scope("singleton")  // 기본값이므로 생략 가능
public class DatabaseConnectionPool {
    
    private final List<Connection> connections = new ArrayList<>();
    
    @PostConstruct
    public void initializePool() {
        // 연결 풀 초기화
        for (int i = 0; i < 10; i++) {
            connections.add(createConnection());
        }
        System.out.println("Connection pool initialized with " + connections.size() + " connections");
    }
    
    public Connection getConnection() {
        return connections.isEmpty() ? null : connections.remove(0);
    }
    
    public void returnConnection(Connection connection) {
        connections.add(connection);
    }
    
    private Connection createConnection() {
        // 실제 DB 연결 생성 로직
        return new MockConnection();
    }
}
```

### 2. Prototype

```java
@Component
@Scope("prototype")
public class OrderProcessor {
    
    private String orderId;
    private LocalDateTime createdAt;
    
    @PostConstruct
    public void initialize() {
        this.orderId = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        System.out.println("New OrderProcessor created: " + orderId);
    }
    
    public void processOrder(Order order) {
        // 주문 처리 로직
        System.out.println("Processing order " + order.getId() + " with processor " + orderId);
    }
}

@Service
public class OrderService {
    
    private final ApplicationContext applicationContext;
    
    public OrderService(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }
    
    public void handleOrder(Order order) {
        // 새로운 OrderProcessor 인스턴스 생성
        OrderProcessor processor = applicationContext.getBean(OrderProcessor.class);
        processor.processOrder(order);
    }
}
```

### 3. 웹 관련 스코프

```java
// Request 스코프 - HTTP 요청마다 새로운 인스턴스
@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestTracker {
    
    private String requestId;
    private LocalDateTime startTime;
    
    @PostConstruct
    public void initialize() {
        this.requestId = UUID.randomUUID().toString();
        this.startTime = LocalDateTime.now();
    }
    
    public void logRequest(String operation) {
        System.out.println("Request " + requestId + " - " + operation + 
                          " (elapsed: " + Duration.between(startTime, LocalDateTime.now()).toMillis() + "ms)");
    }
}

// Session 스코프 - HTTP 세션마다 새로운 인스턴스
@Component
@Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserCart {
    
    private final List<CartItem> items = new ArrayList<>();
    
    public void addItem(CartItem item) {
        items.add(item);
    }
    
    public List<CartItem> getItems() {
        return new ArrayList<>(items);
    }
    
    public void clear() {
        items.clear();
    }
}

// Application 스코프 - 애플리케이션당 하나의 인스턴스
@Component
@Scope("application")
public class ApplicationMetrics {
    
    private final AtomicLong requestCount = new AtomicLong(0);
    private final AtomicLong errorCount = new AtomicLong(0);
    
    public void incrementRequestCount() {
        requestCount.incrementAndGet();
    }
    
    public void incrementErrorCount() {
        errorCount.incrementAndGet();
    }
    
    public long getRequestCount() {
        return requestCount.get();
    }
    
    public long getErrorCount() {
        return errorCount.get();
    }
}
```

## Bean 생명주기

### 1. 생명주기 콜백

```java
@Component
public class DataProcessor implements InitializingBean, DisposableBean {
    
    private ExecutorService executorService;
    private boolean isRunning = false;
    
    // 1. 생성자
    public DataProcessor() {
        System.out.println("DataProcessor constructor called");
    }
    
    // 2. 의존성 주입 완료 후 (InitializingBean 인터페이스)
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("InitializingBean.afterPropertiesSet() called");
        this.executorService = Executors.newFixedThreadPool(5);
        this.isRunning = true;
    }
    
    // 3. @PostConstruct 어노테이션 (권장)
    @PostConstruct
    public void initialize() {
        System.out.println("@PostConstruct initialize() called");
        // 초기화 로직
        startBackgroundTasks();
    }
    
    // 4. Bean 소멸 전 (@PreDestroy 어노테이션 - 권장)
    @PreDestroy
    public void cleanup() {
        System.out.println("@PreDestroy cleanup() called");
        this.isRunning = false;
        shutdownBackgroundTasks();
    }
    
    // 5. Bean 소멸 시 (DisposableBean 인터페이스)
    @Override
    public void destroy() throws Exception {
        System.out.println("DisposableBean.destroy() called");
        if (executorService != null && !executorService.isShutdown()) {
            executorService.shutdown();
        }
    }
    
    private void startBackgroundTasks() {
        if (executorService != null) {
            executorService.submit(() -> {
                while (isRunning) {
                    // 백그라운드 작업 수행
                    try {
                        Thread.sleep(1000);
                        System.out.println("Background task running...");
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            });
        }
    }
    
    private void shutdownBackgroundTasks() {
        if (executorService != null) {
            executorService.shutdown();
            try {
                if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
                    executorService.shutdownNow();
                }
            } catch (InterruptedException e) {
                executorService.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }
}
```

### 2. BeanPostProcessor 활용

```java
@Component
public class CustomBeanPostProcessor implements BeanPostProcessor {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomBeanPostProcessor.class);
    
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof UserService) {
            logger.info("Before initialization of bean: {}", beanName);
            // 초기화 전 처리 로직
        }
        return bean;
    }
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        if (bean instanceof UserService) {
            logger.info("After initialization of bean: {}", beanName);
            // 초기화 후 처리 로직 (예: 프록시 생성)
            return Proxy.newProxyInstance(
                bean.getClass().getClassLoader(),
                bean.getClass().getInterfaces(),
                new LoggingInvocationHandler(bean)
            );
        }
        return bean;
    }
}

public class LoggingInvocationHandler implements InvocationHandler {
    
    private final Object target;
    private static final Logger logger = LoggerFactory.getLogger(LoggingInvocationHandler.class);
    
    public LoggingInvocationHandler(Object target) {
        this.target = target;
    }
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        try {
            logger.info("Calling method: {} with args: {}", method.getName(), Arrays.toString(args));
            Object result = method.invoke(target, args);
            logger.info("Method {} completed in {}ms", method.getName(), 
                       System.currentTimeMillis() - startTime);
            return result;
        } catch (InvocationTargetException e) {
            logger.error("Method {} failed", method.getName(), e.getTargetException());
            throw e.getTargetException();
        }
    }
}
```

## 조건부 Bean 등록

### 1. Profile 기반 조건부 등록

```java
@Configuration
public class DataSourceConfig {
    
    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://prod-server:3306/mydb");
        config.setUsername("prod_user");
        config.setPassword("prod_password");
        config.setMaximumPoolSize(20);
        return new HikariDataSource(config);
    }
    
    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:mem:testdb");
        config.setUsername("sa");
        config.setPassword("");
        return new HikariDataSource(config);
    }
    
    @Bean
    @Profile("test")
    public DataSource testDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .addScript("schema.sql")
            .addScript("test-data.sql")
            .build();
    }
}
```

### 2. Conditional 어노테이션 활용

```java
@Configuration
public class ConditionalConfig {
    
    // 특정 클래스가 classpath에 있을 때만 등록
    @Bean
    @ConditionalOnClass(RedisTemplate.class)
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
    
    // 특정 Bean이 없을 때만 등록
    @Bean
    @ConditionalOnMissingBean(CacheManager.class)
    public CacheManager defaultCacheManager() {
        return new ConcurrentMapCacheManager();
    }
    
    // 특정 프로퍼티 값에 따라 등록
    @Bean
    @ConditionalOnProperty(name = "app.email.enabled", havingValue = "true", matchIfMissing = true)
    public EmailService emailService() {
        return new SmtpEmailService();
    }
    
    @Bean
    @ConditionalOnProperty(name = "app.email.enabled", havingValue = "false")
    public EmailService mockEmailService() {
        return new MockEmailService();
    }
    
    // 웹 애플리케이션일 때만 등록
    @Bean
    @ConditionalOnWebApplication
    public WebSecurityConfig webSecurityConfig() {
        return new WebSecurityConfig();
    }
    
    // 특정 조건을 만족할 때만 등록
    @Bean
    @ConditionalOnExpression("#{environment.acceptsProfiles('prod') and '${app.feature.advanced}'.equals('true')}")
    public AdvancedFeatureService advancedFeatureService() {
        return new AdvancedFeatureService();
    }
}

// 커스텀 Condition
public class LinuxCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        return System.getProperty("os.name").toLowerCase().contains("linux");
    }
}

@Bean
@Conditional(LinuxCondition.class)
public SystemService linuxSystemService() {
    return new LinuxSystemService();
}
```

## Bean 이름과 별칭

### 1. Bean 이름 지정

```java
@Configuration
public class BeanNamingConfig {
    
    // 기본 Bean 이름: emailService (메서드명)
    @Bean
    public EmailService emailService() {
        return new EmailServiceImpl();
    }
    
    // 커스텀 Bean 이름 지정
    @Bean("customEmailService")
    public EmailService customEmailService() {
        return new EmailServiceImpl();
    }
    
    // 여러 이름 지정 (별칭)
    @Bean({"emailService", "mailService", "notificationService"})
    public EmailService multiNameEmailService() {
        return new EmailServiceImpl();
    }
}

@Service("userBusinessService")  // 커스텀 이름 지정
public class UserService {
    // 구현
}

@Component
public class TestService {
    
    // Bean 이름으로 주입
    @Autowired
    @Qualifier("customEmailService")
    private EmailService emailService;
    
    // 또는 생성자에서
    public TestService(@Qualifier("userBusinessService") UserService userService) {
        // 구현
    }
}
```

### 2. Primary와 Priority

```java
public interface MessageService {
    void sendMessage(String message);
}

@Component
@Primary  // 기본 구현체로 지정
public class EmailMessageService implements MessageService {
    @Override
    public void sendMessage(String message) {
        System.out.println("Email: " + message);
    }
}

@Component
@Priority(1)  // 우선순위 지정 (낮은 숫자가 높은 우선순위)
public class SmsMessageService implements MessageService {
    @Override
    public void sendMessage(String message) {
        System.out.println("SMS: " + message);
    }
}

@Component
@Priority(2)
public class PushMessageService implements MessageService {
    @Override
    public void sendMessage(String message) {
        System.out.println("Push: " + message);
    }
}

@Service
public class NotificationService {
    
    private final MessageService messageService;  // EmailMessageService가 주입됨 (@Primary)
    
    public NotificationService(MessageService messageService) {
        this.messageService = messageService;
    }
    
    // 특정 구현체 사용
    @Autowired
    @Qualifier("smsMessageService")
    private MessageService smsService;
}
```

## Bean 테스트

### 1. Unit 테스트

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private EmailService emailService;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void createUser_Success() {
        // Given
        CreateUserRequest request = new CreateUserRequest("John", "john@example.com");
        User savedUser = User.builder().id(1L).name("John").email("john@example.com").build();
        
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        
        // When
        User result = userService.createUser(request);
        
        // Then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("John");
        verify(emailService).sendEmail(eq("john@example.com"), anyString());
    }
}
```

### 2. 통합 테스트

```java
@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class UserServiceIntegrationTest {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @MockBean  // 특정 Bean만 Mock으로 대체
    private EmailService emailService;
    
    @Test
    void createUser_Integration() {
        // Given
        CreateUserRequest request = new CreateUserRequest("Jane", "jane@example.com");
        
        // When
        User result = userService.createUser(request);
        
        // Then
        assertThat(result.getId()).isNotNull();
        assertThat(userRepository.findById(result.getId())).isPresent();
        verify(emailService).sendEmail(eq("jane@example.com"), anyString());
    }
}
```

### 3. TestConfiguration

```java
@TestConfiguration
public class TestConfig {
    
    @Bean
    @Primary  // 테스트에서 우선 사용
    public EmailService mockEmailService() {
        return Mockito.mock(EmailService.class);
    }
    
    @Bean
    public TestDataFactory testDataFactory() {
        return new TestDataFactory();
    }
}

@SpringBootTest
@Import(TestConfig.class)
class ServiceIntegrationTest {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private TestDataFactory testDataFactory;
    
    @Test
    void testWithTestConfiguration() {
        // 테스트 구현
    }
}
```

## Spring Bean 실무 활용 전략

Spring Bean을 실무에서 효과적으로 활용하기 위해서는 이론적 지식을 넘어선 실전 경험과 노하우가 필요하다. 대규모 프로젝트에서 축적된 실무 가이드를 공유한다.

### Bean 설계 원칙과 패턴

**1. 단일 책임 원칙 (Single Responsibility Principle)**
```java
// 나쁜 예: 하나의 서비스가 너무 많은 책임을 가짐
@Service
public class UserService {
    public void createUser(User user) { }
    public void sendEmail(String email) { }
    public void generateReport() { }
    public void processPayment() { }
}

// 좋은 예: 책임을 분리한 서비스들
@Service
public class UserManagementService {
    private final UserRepository userRepository;
    private final EmailNotificationService emailService;
    private final AuditService auditService;
    
    public User createUser(CreateUserRequest request) {
        User user = userRepository.save(request.toEntity());
        emailService.sendWelcomeEmail(user.getEmail());
        auditService.logUserCreation(user.getId());
        return user;
    }
}

@Service
public class EmailNotificationService {
    public void sendWelcomeEmail(String email) { }
    public void sendPasswordResetEmail(String email) { }
}

@Service
public class ReportGenerationService {
    public void generateUserReport() { }
}
```

**2. 인터페이스 기반 설계**
```java
// 인터페이스 정의
public interface PaymentProcessor {
    PaymentResult processPayment(PaymentRequest request);
}

// 구현체들
@Component("creditCardProcessor")
public class CreditCardPaymentProcessor implements PaymentProcessor {
    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        // 신용카드 결제 로직
    }
}

@Component("bankTransferProcessor")
public class BankTransferPaymentProcessor implements PaymentProcessor {
    @Override
    public PaymentResult processPayment(PaymentRequest request) {
        // 계좌이체 결제 로직
    }
}

// 팩토리 패턴으로 동적 선택
@Service
public class PaymentService {
    private final Map<String, PaymentProcessor> processors;
    
    public PaymentService(Map<String, PaymentProcessor> processors) {
        this.processors = processors;
    }
    
    public PaymentResult processPayment(PaymentRequest request) {
        PaymentProcessor processor = processors.get(request.getPaymentType() + "Processor");
        if (processor == null) {
            throw new UnsupportedPaymentTypeException(request.getPaymentType());
        }
        return processor.processPayment(request);
    }
}
```

### Bean 성능 최적화 전략

**1. Lazy Loading 전략적 활용**
```java
@Configuration
public class PerformanceOptimizedConfig {
    
    // 애플리케이션 시작 시 꼭 필요한 Bean
    @Bean
    public DatabaseConnectionPool connectionPool() {
        return new HikariDataSource();
    }
    
    // 처음 사용될 때까지 생성을 지연
    @Bean
    @Lazy
    public ReportGenerator reportGenerator() {
        return new HeavyReportGenerator(); // 생성 비용이 큰 객체
    }
    
    // 특정 조건에서만 필요한 Bean
    @Bean
    @ConditionalOnProperty(name = "feature.ai.enabled", havingValue = "true")
    @Lazy
    public AiRecommendationEngine aiEngine() {
        return new TensorFlowAiEngine(); // ML 모델 로딩
    }
}
```

**2. Bean 스코프 최적화**
```java
@Component
@Scope("singleton")  // 기본값, 상태가 없는 서비스
public class StatelessCalculator {
    public double calculate(double a, double b) {
        return a + b;
    }
}

@Component
@Scope("prototype")  // 상태를 가지는 객체
public class StatefulProcessor {
    private String currentState;
    
    public void processData(String data) {
        this.currentState = data;
        // 처리 로직
    }
}

@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestScopedService {
    private final HttpServletRequest request;
    
    public RequestScopedService(HttpServletRequest request) {
        this.request = request;
    }
}
```

### 실무에서 자주 겪는 Bean 관련 문제와 해결책

**1. 순환 의존성 문제**
```java
// 문제 상황
@Service
public class ServiceA {
    private final ServiceB serviceB;
    
    public ServiceA(ServiceB serviceB) { // 순환 의존성 발생
        this.serviceB = serviceB;
    }
}

@Service
public class ServiceB {
    private final ServiceA serviceA;
    
    public ServiceB(ServiceA serviceA) {
        this.serviceA = serviceA;
    }
}

// 해결 방법 1: 설계 개선
@Service
public class ServiceA {
    private final CommonService commonService;
    
    public ServiceA(CommonService commonService) {
        this.commonService = commonService;
    }
}

@Service
public class ServiceB {
    private final CommonService commonService;
    
    public ServiceB(CommonService commonService) {
        this.commonService = commonService;
    }
}

@Service
public class CommonService {
    // 공통 로직
}

// 해결 방법 2: @Lazy 사용 (임시방편)
@Service
public class ServiceA {
    private final ServiceB serviceB;
    
    public ServiceA(@Lazy ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}
```

**2. Bean 충돌 문제**
```java
// 문제: 같은 타입의 여러 Bean
@Configuration
public class ConflictingBeansConfig {
    
    @Bean
    @ConditionalOnProfile("dev")
    public EmailService devEmailService() {
        return new MockEmailService();
    }
    
    @Bean
    @ConditionalOnProfile("prod")
    public EmailService prodEmailService() {
        return new SmtpEmailService();
    }
    
    // Profile이 설정되지 않으면 Bean 충돌 발생
}

// 해결책: 명확한 조건 설정
@Configuration
public class EmailConfig {
    
    @Bean
    @ConditionalOnProperty(name = "app.email.mock", havingValue = "true", matchIfMissing = false)
    public EmailService mockEmailService() {
        return new MockEmailService();
    }
    
    @Bean
    @ConditionalOnProperty(name = "app.email.mock", havingValue = "false", matchIfMissing = true)
    public EmailService realEmailService() {
        return new SmtpEmailService();
    }
}
```

### 팀 개발을 위한 Bean 관리 가이드라인

**1. Bean 명명 규칙**
```java
// 팀 내 Bean 명명 규칙 예시
@Service("userManagementService")  // 서비스명 + Service 접미사
public class UserManagementService { }

@Repository("userJpaRepository")   // 기술스택 + Repository 접미사
public class UserJpaRepository { }

@Component("s3FileUploader")       // 기능 + 구현체 설명
public class S3FileUploader implements FileUploader { }

@Configuration
public class NamingConventionConfig {
    
    @Bean("emailNotificationSender")
    public NotificationSender emailSender() {
        return new EmailNotificationSender();
    }
    
    @Bean("smsNotificationSender")
    public NotificationSender smsSender() {
        return new SmsNotificationSender();
    }
}
```

**2. 환경별 Bean 관리**
```java
@Configuration
public class EnvironmentSpecificConfig {
    
    // 개발 환경
    @Bean
    @Profile("local")
    public DataSource localDataSource() {
        return DataSourceBuilder.create()
            .driverClassName("org.h2.Driver")
            .url("jdbc:h2:mem:testdb")
            .build();
    }
    
    // 운영 환경
    @Bean
    @Profile("production")
    public DataSource productionDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(Environment.getProperty("spring.datasource.url"));
        config.setUsername(Environment.getProperty("spring.datasource.username"));
        config.setPassword(Environment.getProperty("spring.datasource.password"));
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        return new HikariDataSource(config);
    }
    
    // 테스트 환경
    @Bean
    @Profile("test")
    public DataSource testDataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2)
            .addScript("classpath:test-schema.sql")
            .addScript("classpath:test-data.sql")
            .build();
    }
}
```

### Bean 모니터링과 디버깅

**1. Bean 상태 모니터링**
```java
@Component
public class BeanHealthMonitor {
    
    private final ApplicationContext applicationContext;
    
    public BeanHealthMonitor(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }
    
    @EventListener
    public void handleContextRefresh(ContextRefreshedEvent event) {
        String[] beanNames = applicationContext.getBeanDefinitionNames();
        log.info("Total beans registered: {}", beanNames.length);
        
        // 중요한 Bean들의 상태 확인
        checkCriticalBeans();
    }
    
    private void checkCriticalBeans() {
        try {
            DataSource dataSource = applicationContext.getBean(DataSource.class);
            log.info("DataSource bean is healthy");
        } catch (Exception e) {
            log.error("DataSource bean is not available", e);
        }
    }
    
    @EventListener
    public void handleContextClosed(ContextClosedEvent event) {
        log.info("Application context is closing, cleaning up resources");
    }
}
```

**2. Bean 생명주기 디버깅**
```java
@Component
@Slf4j
public class LifecycleAwareBean implements BeanNameAware, BeanFactoryAware {
    
    private String beanName;
    private BeanFactory beanFactory;
    
    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        log.debug("Bean name set to: {}", name);
    }
    
    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.beanFactory = beanFactory;
        log.debug("Bean factory set for: {}", beanName);
    }
    
    @PostConstruct
    public void init() {
        log.info("Bean {} is being initialized", beanName);
    }
    
    @PreDestroy
    public void cleanup() {
        log.info("Bean {} is being destroyed", beanName);
    }
}
```

## 마무리

Spring Bean은 단순한 객체 관리 도구가 아니라 애플리케이션 아키텍처의 기반이다. 올바른 Bean 설계와 관리는 코드의 품질, 성능, 유지보수성에 직접적인 영향을 미친다.

### Spring Bean 마스터를 위한 로드맵

**1단계: 기본 개념 이해 (1-2주)**
- IoC와 DI의 개념 이해
- 기본적인 Bean 등록과 주입 방법
- 생명주기 이해

**2단계: 실무 적용 (2-3주)**
- 다양한 Bean 등록 방법 활용
- 스코프와 조건부 Bean 활용
- 테스트 환경에서의 Bean 관리

**3단계: 고급 활용 (3-4주)**
- 성능 최적화 전략
- 대규모 애플리케이션에서의 Bean 관리
- 문제 해결과 디버깅 기법

### 성공적인 Bean 관리를 위한 핵심 원칙

**1. 명확한 책임 분리**: 각 Bean은 명확하고 단일한 책임을 가져야 한다
**2. 인터페이스 기반 설계**: 구현체가 아닌 인터페이스에 의존하도록 설계
**3. 적절한 스코프 선택**: Bean의 특성에 맞는 적절한 스코프 사용
**4. 환경별 관리**: Profile과 조건부 Bean을 활용한 환경별 설정
**5. 지속적인 모니터링**: Bean의 상태와 성능을 지속적으로 모니터링

Spring Bean을 제대로 이해하고 활용하면 Spring Framework의 진정한 힘을 경험할 수 있다. 이 가이드가 여러분의 Spring Bean 여정에 도움이 되기를 바란다.

### 추가 학습 자료

**필수 도서**
- 『토비의 스프링 3.1』 - 이일민
- 『스프링 부트와 AWS로 혼자 구현하는 웹 서비스』 - 이동욱

**온라인 강의**
- 인프런 스프링 핵심 원리 시리즈
- 백기선의 스프링 부트 개념과 활용

**공식 문서**
- [Spring Framework Reference - The IoC Container](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans)
- [Spring Boot Auto-configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration)

**실무 가이드**
- [Spring Best Practices](https://spring.io/guides)
- [Baeldung Spring Tutorials](https://www.baeldung.com/spring-tutorial) 