---
title: "[Spring Boot 3.3.5] JWT 토큰 인증 구현하기"
slug: "spring-boot-jwt-authentication"
date: 2025-01-15
tags: ["SpringBoot", "JWT", "Security", "Authentication"]
category: "Frameworks/SpringBoot"
thumbnail: "https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"
draft: true
views: 0
---

![Spring Boot JWT Authentication](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)

현대 웹 애플리케이션에서 인증은 필수적인 요소다. 전통적인 세션 기반 인증에서 벗어나 JWT(JSON Web Token)를 활용한 토큰 기반 인증이 널리 사용되고 있다. Spring Boot 3.3.5와 Spring Security를 활용하여 안전하고 확장 가능한 JWT 인증 시스템을 구현해보자.

## JWT란?

JWT(JSON Web Token)는 당사자 간에 정보를 JSON 객체로 안전하게 전송하기 위한 컴팩트하고 자체 포함된 방법을 정의하는 개방형 표준(RFC 7519)이다.

### JWT의 구조

JWT는 점(.)으로 구분된 세 부분으로 구성된다:
- **Header**: 토큰 타입과 해싱 알고리즘 정보
- **Payload**: 클레임(Claims) 정보를 포함
- **Signature**: 토큰의 무결성을 검증하는 서명

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### JWT vs 세션 기반 인증

| 특징              | JWT              | 세션               |
| ----------------- | ---------------- | ------------------ |
| 저장 위치         | 클라이언트       | 서버               |
| 확장성            | 우수 (Stateless) | 제한적 (Stateful)  |
| 보안              | 토큰 탈취 위험   | 세션 하이재킹 위험 |
| 네트워크 오버헤드 | 높음             | 낮음               |
| 서버 메모리 사용  | 없음             | 있음               |

## 프로젝트 설정

### 1. 의존성 추가

`build.gradle`에 필요한 의존성을 추가한다.

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    
    // JWT 관련 의존성
    implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.3'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.3'
    
    // 데이터베이스
    runtimeOnly 'com.h2database:h2'
    
    // 테스트
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}
```

### 2. Application Properties 설정

```properties
# application.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    
  h2:
    console:
      enabled: true

# JWT 설정
jwt:
  secret: mySecretKey123456789012345678901234567890
  expiration: 86400000 # 24시간 (밀리초)
  refresh-expiration: 604800000 # 7일 (밀리초)

logging:
  level:
    org.springframework.security: DEBUG
```

## JWT 유틸리티 클래스 구현

### 1. JwtUtil 클래스

JWT 토큰의 생성, 검증, 파싱을 담당하는 유틸리티 클래스를 구현한다.

```java
@Component
public class JwtUtil {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;
    
    @Value("${jwt.refresh-expiration}")
    private int jwtRefreshExpirationMs;
    
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    public String generateJwtToken(UserPrincipal userPrincipal) {
        return generateTokenFromUsername(userPrincipal.getUsername());
    }
    
    public String generateTokenFromUsername(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtRefreshExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
    
    public Date getExpirationDateFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }
}
```

## 사용자 인증을 위한 엔티티 및 서비스

### 1. User 엔티티

```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    @Email
    private String email;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.USER;
    
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

public enum Role {
    USER, ADMIN
}
```

### 2. UserPrincipal 클래스

Spring Security와 통합하기 위한 UserDetails 구현체다.

```java
public class UserPrincipal implements UserDetails {
    
    private Long id;
    private String username;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    
    public UserPrincipal(Long id, String username, String email, String password, 
                        Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }
    
    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = List.of(
            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
        
        return new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            authorities
        );
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return username;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
    
    public Long getId() {
        return id;
    }
    
    public String getEmail() {
        return email;
    }
}
```

### 3. UserService 및 UserDetailsService

```java
@Service
@Transactional
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return UserPrincipal.create(user);
    }
    
    public User createUser(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        User user = User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(Role.USER)
                .build();
        
        return userRepository.save(user);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
```

## JWT 인증 필터 구현

### 1. AuthTokenFilter

모든 요청에서 JWT 토큰을 검증하는 필터다.

```java
public class AuthTokenFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);
    
    private final JwtUtil jwtUtil;
    private final UserService userService;
    
    public AuthTokenFilter(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtil.validateJwtToken(jwt)) {
                String username = jwtUtil.getUsernameFromJwtToken(jwt);
                
                UserDetails userDetails = userService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, 
                                                          userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        
        return null;
    }
}
```

## Security 설정

### 1. SecurityConfig

Spring Security 설정을 통해 JWT 인증을 활성화한다.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    private final UserService userService;
    private final AuthEntryPointJwt unauthorizedHandler;
    private final JwtUtil jwtUtil;
    
    public SecurityConfig(UserService userService, AuthEntryPointJwt unauthorizedHandler, 
                         JwtUtil jwtUtil) {
        this.userService = userService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtUtil = jwtUtil;
    }
    
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter(jwtUtil, userService);
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) 
            throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/h2-console/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
                    .anyRequest().authenticated()
            );
        
        // H2 Console을 위한 설정
        http.headers(headers -> headers.frameOptions().disable());
        
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 2. AuthEntryPointJwt

인증 실패 시 처리를 담당하는 클래스다.

```java
@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);
    
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, 
                        AuthenticationException authException) throws IOException, ServletException {
        logger.error("Unauthorized error: {}", authException.getMessage());
        
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        final ObjectMapper mapper = new ObjectMapper();
        final Map<String, Object> body = new HashMap<>();
        body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
        body.put("error", "Unauthorized");
        body.put("message", authException.getMessage());
        body.put("path", request.getServletPath());
        
        mapper.writeValue(response.getOutputStream(), body);
    }
}
```

## DTO 클래스 정의

### 1. 요청 DTO

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
    
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenRefreshRequest {
    
    @NotBlank
    private String refreshToken;
}
```

### 2. 응답 DTO

```java
@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    
    public JwtResponse(String accessToken, String refreshToken, Long id, 
                      String username, String email, List<String> roles) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
}

@Data
@AllArgsConstructor
public class TokenRefreshResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
}

@Data
@AllArgsConstructor
public class MessageResponse {
    private String message;
}
```

## 인증 컨트롤러 구현

### 1. AuthController

로그인, 회원가입, 토큰 갱신을 처리하는 컨트롤러다.

```java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    public AuthController(AuthenticationManager authenticationManager, 
                         UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), 
                loginRequest.getPassword())
        );
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String jwt = jwtUtil.generateJwtToken(userPrincipal);
        String refreshToken = jwtUtil.generateRefreshToken(userPrincipal.getUsername());
        
        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(new JwtResponse(
            jwt, 
            refreshToken,
            userPrincipal.getId(),
            userPrincipal.getUsername(),
            userPrincipal.getEmail(),
            roles
        ));
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            User user = userService.createUser(signUpRequest);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        
        if (jwtUtil.validateJwtToken(requestRefreshToken)) {
            String username = jwtUtil.getUsernameFromJwtToken(requestRefreshToken);
            String newAccessToken = jwtUtil.generateTokenFromUsername(username);
            String newRefreshToken = jwtUtil.generateRefreshToken(username);
            
            return ResponseEntity.ok(new TokenRefreshResponse(
                newAccessToken, 
                newRefreshToken
            ));
        } else {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Refresh token is not valid!"));
        }
    }
    
    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        // JWT는 stateless하므로 서버에서 별도 로그아웃 처리가 필요 없음
        // 클라이언트에서 토큰을 제거하면 됨
        return ResponseEntity.ok(new MessageResponse("User signed out successfully!"));
    }
}
```

## 보호된 리소스 컨트롤러

### 1. UserController

인증이 필요한 사용자 정보 조회 API다.

```java
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", userPrincipal.getId());
        response.put("username", userPrincipal.getUsername());
        response.put("email", userPrincipal.getEmail());
        response.put("roles", userPrincipal.getAuthorities());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminBoard() {
        return ResponseEntity.ok(new MessageResponse("Admin Board."));
    }
}
```

## 데이터베이스 초기화

### 1. DataInitializer

애플리케이션 시작 시 테스트 데이터를 생성한다.

```java
@Component
public class DataInitializer implements CommandLineRunner {
    
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    
    public DataInitializer(UserService userService, PasswordEncoder passwordEncoder, 
                          UserRepository userRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }
    
    @Override
    public void run(String... args) throws Exception {
        // 관리자 계정 생성
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }
        
        // 일반 사용자 계정 생성
        if (!userRepository.existsByUsername("user")) {
            User user = User.builder()
                    .username("user")
                    .email("user@example.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .build();
            userRepository.save(user);
        }
    }
}
```

## API 테스트

### 1. 회원가입

```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 2. 로그인

```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

### 3. 보호된 리소스 접근

```bash
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. 토큰 갱신

```bash
curl -X POST http://localhost:8080/api/auth/refreshtoken \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 보안 고려사항

### 1. JWT 토큰 보안

**토큰 저장**
- 클라이언트에서는 토큰을 안전한 곳에 저장해야 함
- LocalStorage보다는 HttpOnly 쿠키 사용 권장
- XSS 공격을 방지하기 위한 적절한 CSP 헤더 설정

**토큰 만료**
- Access Token은 짧은 수명 (15분-1시간)
- Refresh Token은 긴 수명 (1주-1개월)
- 토큰 갱신 메커니즘 구현

### 2. 추가 보안 기능

```java
@Component
public class JwtTokenBlacklist {
    
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();
    
    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }
    
    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
    
    // 주기적으로 만료된 토큰을 블랙리스트에서 제거
    @Scheduled(fixedRate = 3600000) // 1시간마다
    public void cleanupExpiredTokens() {
        // 만료된 토큰들을 제거하는 로직 구현
    }
}
```

### 3. Rate Limiting

```java
@Component
public class RateLimitingFilter implements Filter {
    
    private final Map<String, AtomicInteger> requests = new ConcurrentHashMap<>();
    private final Map<String, Long> resetTimes = new ConcurrentHashMap<>();
    
    private static final int MAX_REQUESTS = 100; // 1시간당 최대 요청 수
    private static final long RESET_TIME = 3600000; // 1시간
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String clientIp = getClientIpAddress(httpRequest);
        
        if (isRateLimited(clientIp)) {
            httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            httpResponse.getWriter().write("Too many requests");
            return;
        }
        
        chain.doFilter(request, response);
    }
    
    private boolean isRateLimited(String clientIp) {
        long currentTime = System.currentTimeMillis();
        
        if (!resetTimes.containsKey(clientIp) || 
            currentTime - resetTimes.get(clientIp) > RESET_TIME) {
            requests.put(clientIp, new AtomicInteger(0));
            resetTimes.put(clientIp, currentTime);
        }
        
        return requests.get(clientIp).incrementAndGet() > MAX_REQUESTS;
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
```

## 프론트엔드 연동

### 1. JavaScript 클라이언트 예제

```javascript
class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/auth';
        this.userURL = 'http://localhost:8080/api/user';
    }
    
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                return data;
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    
    async signup(username, email, password) {
        try {
            const response = await fetch(`${this.baseURL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            
            return await response.json();
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }
    
    async getUserProfile() {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${this.userURL}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (response.status === 401) {
                await this.refreshToken();
                return this.getUserProfile(); // 재시도
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    }
    
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await fetch(`${this.baseURL}/refreshtoken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                return data;
            } else {
                this.logout();
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    }
    
    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
    
    isAuthenticated() {
        return localStorage.getItem('accessToken') !== null;
    }
}

// 사용 예제
const authService = new AuthService();

// 로그인
authService.login('testuser', 'test123')
    .then(data => console.log('Login successful:', data))
    .catch(error => console.error('Login failed:', error));

// 사용자 프로필 조회
authService.getUserProfile()
    .then(profile => console.log('User profile:', profile))
    .catch(error => console.error('Failed to get profile:', error));
```

## 실제 프로덕션 환경 고려사항

### 1. 설정 관리

프로덕션 환경에서는 민감한 정보를 환경 변수로 관리한다.

```yaml
# application-prod.yml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:3600000}
  refresh-expiration: ${JWT_REFRESH_EXPIRATION:604800000}

logging:
  level:
    root: INFO
    com.yourpackage: DEBUG
```

### 2. HTTPS 강제

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .requiresChannel(channel -> 
                channel.requestMatchers(r -> r.getHeader("X-Forwarded-Proto") != null)
                       .requiresSecure())
            // ... 기타 설정
            ;
        
        return http.build();
    }
}
```

### 3. 헬스 체크 엔드포인트

```java
@RestController
@RequestMapping("/api/health")
public class HealthController {
    
    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }
}
```

## 테스트 코드 작성

### 1. 통합 테스트

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
class AuthControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }
    
    @Test
    void testUserSignup() {
        SignupRequest signupRequest = new SignupRequest("testuser", "test@example.com", "test123");
        
        ResponseEntity<MessageResponse> response = restTemplate.postForEntity(
            "/api/auth/signup", 
            signupRequest, 
            MessageResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getMessage()).isEqualTo("User registered successfully!");
        assertThat(userRepository.existsByUsername("testuser")).isTrue();
    }
    
    @Test
    void testUserSignin() {
        // 사용자 등록
        SignupRequest signupRequest = new SignupRequest("testuser", "test@example.com", "test123");
        restTemplate.postForEntity("/api/auth/signup", signupRequest, MessageResponse.class);
        
        // 로그인 시도
        LoginRequest loginRequest = new LoginRequest("testuser", "test123");
        ResponseEntity<JwtResponse> response = restTemplate.postForEntity(
            "/api/auth/signin", 
            loginRequest, 
            JwtResponse.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getToken()).isNotNull();
        assertThat(response.getBody().getUsername()).isEqualTo("testuser");
    }
}
```

### 2. 단위 테스트

```java
@ExtendWith(MockitoExtension.class)
class JwtUtilTest {
    
    @InjectMocks
    private JwtUtil jwtUtil;
    
    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", "mySecretKey123456789012345678901234567890");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", 86400000);
    }
    
    @Test
    void testGenerateJwtToken() {
        UserPrincipal userPrincipal = mock(UserPrincipal.class);
        when(userPrincipal.getUsername()).thenReturn("testuser");
        
        String token = jwtUtil.generateJwtToken(userPrincipal);
        
        assertThat(token).isNotNull();
        assertThat(jwtUtil.validateJwtToken(token)).isTrue();
        assertThat(jwtUtil.getUsernameFromJwtToken(token)).isEqualTo("testuser");
    }
    
    @Test
    void testValidateExpiredToken() {
        // 만료된 토큰 테스트를 위해 과거 시간으로 토큰 생성
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", -1000); // 음수로 설정하여 즉시 만료
        
        String expiredToken = jwtUtil.generateTokenFromUsername("testuser");
        
        assertThat(jwtUtil.validateJwtToken(expiredToken)).isFalse();
    }
}
```

## 마무리

Spring Boot 3.3.5와 JWT를 활용한 토큰 기반 인증 시스템을 구현해보았다. 이 구현을 통해 다음과 같은 이점을 얻을 수 있다:

### 주요 장점

- **확장성**: Stateless한 특성으로 서버 확장이 용이
- **성능**: 서버 메모리 사용량 감소
- **보안**: 적절한 토큰 관리와 검증을 통한 안전한 인증
- **유연성**: 다양한 클라이언트 (웹, 모바일)에서 동일한 API 사용 가능

### 추가 개선사항

실제 프로덕션 환경에서는 다음과 같은 추가 기능을 고려해야 한다:

- **토큰 블랙리스트**: 로그아웃된 토큰 관리
- **Rate Limiting**: API 호출 빈도 제한
- **로깅 및 모니터링**: 보안 이벤트 추적
- **다중 인증**: 2FA/MFA 지원
- **소셜 로그인**: OAuth2 연동

JWT 기반 인증은 현대적인 웹 애플리케이션의 표준이 되었다. 올바른 구현과 보안 고려사항을 준수한다면 안전하고 확장 가능한 인증 시스템을 구축할 수 있다.

### 참고 자료

- [Spring Security 공식 문서](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/)
- [Spring Boot Security JWT Authentication](https://www.bezkoder.com/spring-boot-jwt-authentication/)
- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519) 