---
title: "[Spring Boot] Spring Security 완벽 가이드"
slug: "spring-security-guide"
date: 2025-01-15
tags: ["SpringBoot", "Security", "Authentication", "Authorization"]
category: "Frameworks/SpringBoot"
thumbnail: "https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"
draft: true
views: 0
---

![Spring Security Guide](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)

웹 애플리케이션에서 보안은 선택이 아닌 필수다. 매년 수천 건의 보안 사고가 발생하고 있으며, 특히 개인정보 유출이나 무단 접근으로 인한 피해는 기업의 생존을 위협할 수 있다. Spring Security는 이러한 복잡한 보안 요구사항을 체계적으로 해결해주는 강력한 프레임워크다.

## 웹 보안, 왜 이렇게 복잡한가?

### 현실적인 보안 위협들

**실제 사례: 2023년 A회사 보안 사고**
한 스타트업에서 간단한 관리자 인증만 구현했던 시스템이 해킹을 당했다. 해커는 JWT 토큰을 탈취한 후 관리자 권한으로 수만 명의 개인정보를 유출했다. 이 사건으로 회사는 거액의 배상금을 지불하고 사업을 중단해야 했다.

**보안은 기술적 문제가 아닌 비즈니스 문제**
- 개인정보보호법 위반 시 최대 3억원 또는 매출액의 3% 과징금
- 서비스 중단으로 인한 기회비용
- 브랜드 이미지 손상과 고객 이탈
- 복구 비용과 법적 대응 비용

### 웹 애플리케이션의 주요 보안 취약점

**1. 인증 우회 (Broken Authentication)**
세션 하이재킹, 약한 암호 정책, 무차별 대입 공격 등

**2. 권한 상승 (Privilege Escalation)**
일반 사용자가 관리자 권한을 획득하는 공격

**3. 인젝션 공격 (Injection)**
SQL 인젝션, NoSQL 인젝션, LDAP 인젝션 등

**4. 크로스 사이트 스크립팅 (XSS)**
악성 스크립트를 통한 세션 탈취나 피싱

**5. 크로스 사이트 요청 위조 (CSRF)**
사용자의 의도와 무관한 요청 실행

### Spring Security가 해결하는 문제들

Spring Security는 단순한 인증/인가 프레임워크가 아니라, 웹 보안의 모든 측면을 다루는 종합 보안 솔루션이다. OWASP Top 10의 대부분 항목에 대한 방어 기능을 기본 제공한다.

## Spring Security란?

Spring Security는 Java 애플리케이션을 위한 포괄적인 보안 프레임워크다. 2003년 Acegi Security로 시작되어 현재는 Spring 생태계의 핵심 프로젝트가 되었다. 전 세계 수많은 금융기관과 정부기관에서 사용되고 있을 만큼 신뢰성이 검증된 보안 솔루션이다.

### 핵심 개념

#### 인증 (Authentication)
- **Who are you?** - 사용자가 누구인지 확인하는 과정
- 로그인 과정에서 아이디와 패스워드로 사용자를 확인
- 토큰, 인증서, 생체정보 등 다양한 방식 지원

#### 인가 (Authorization)  
- **What are you allowed to do?** - 인증된 사용자가 무엇을 할 수 있는지 확인
- 사용자의 권한(Role/Authority)에 따른 리소스 접근 제어
- URL, 메소드, 객체 레벨에서 세밀한 접근 제어 가능

#### 주체 (Principal)
- 인증을 요청하는 사용자
- UserDetails 인터페이스로 표현

#### 자격증명 (Credential)
- 사용자가 인증 요청을 할 때 함께 보내는 비밀번호나 토큰
- 주체가 본인임을 인증하기 위한 정보

## Spring Security 아키텍처

### 1. Filter Chain

Spring Security는 서블릿 필터를 기반으로 동작한다.

```
Request → Filter1 → Filter2 → ... → FilterN → DispatcherServlet
                                      ↓
                                 Controller
```

주요 필터들:
- **SecurityContextPersistenceFilter**: SecurityContext를 로드/저장
- **UsernamePasswordAuthenticationFilter**: 로그인 처리
- **AuthorizationFilter**: 권한 검사
- **ExceptionTranslationFilter**: 인증/인가 예외 처리

### 2. 핵심 컴포넌트

```java
// 인증 정보 저장
SecurityContext
    └── Authentication
            ├── Principal (UserDetails)
            ├── Credentials
            └── Authorities (권한 목록)

// 인증 처리
AuthenticationManager
    └── AuthenticationProvider
            └── UserDetailsService
```

## 기본 설정

### 1. 의존성 추가

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity6'
    
    testImplementation 'org.springframework.security:spring-security-test'
}
```

### 2. 기본 보안 설정

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/home", "/signup", "/css/**", "/js/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/perform_login")
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error=true")
                .usernameParameter("email")
                .passwordParameter("password")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/perform_logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
                .sessionRegistry(sessionRegistry())
            )
            .rememberMe(remember -> remember
                .key("uniqueAndSecret")
                .tokenValiditySeconds(86400) // 24시간
                .userDetailsService(userDetailsService)
            )
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/api/**") // API는 CSRF 비활성화
            );
            
        return http.build();
    }
    
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## 사용자 인증 구현

### 1. UserDetails 구현

```java
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<Role> roles = new HashSet<>();
    
    @Builder.Default
    private boolean enabled = true;
    
    @Builder.Default
    private boolean accountNonExpired = true;
    
    @Builder.Default
    private boolean accountNonLocked = true;
    
    @Builder.Default
    private boolean credentialsNonExpired = true;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

public enum Role {
    ADMIN, USER, MODERATOR
}
```

### 2. UserDetails 구현체

```java
@Getter
public class UserPrincipal implements UserDetails {
    
    private final Long id;
    private final String email;
    private final String password;
    private final String name;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;
    private final boolean accountNonExpired;
    private final boolean accountNonLocked;
    private final boolean credentialsNonExpired;
    
    public UserPrincipal(Long id, String email, String password, String name,
                        Collection<? extends GrantedAuthority> authorities,
                        boolean enabled, boolean accountNonExpired,
                        boolean accountNonLocked, boolean credentialsNonExpired) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.authorities = authorities;
        this.enabled = enabled;
        this.accountNonExpired = accountNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.credentialsNonExpired = credentialsNonExpired;
    }
    
    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toList());
                
        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getName(),
                authorities,
                user.isEnabled(),
                user.isAccountNonExpired(),
                user.isAccountNonLocked(),
                user.isCredentialsNonExpired()
        );
    }
    
    @Override
    public String getUsername() {
        return email;
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
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPrincipal that = (UserPrincipal) o;
        return Objects.equals(id, that.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

### 3. UserDetailsService 구현

```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
                
        return UserPrincipal.create(user);
    }
    
    // ID로 사용자 로드 (JWT 등에서 사용)
    @Transactional(readOnly = true)
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
                
        return UserPrincipal.create(user);
    }
}
```

## 권한 관리

### 1. 메소드 레벨 보안

```java
@Configuration
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class MethodSecurityConfig {
    
    @Bean
    public MethodSecurityExpressionHandler methodSecurityExpressionHandler() {
        DefaultMethodSecurityExpressionHandler expressionHandler = new DefaultMethodSecurityExpressionHandler();
        expressionHandler.setPermissionEvaluator(new CustomPermissionEvaluator());
        return expressionHandler;
    }
}

@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostRepository postRepository;
    
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    
    @PreAuthorize("hasRole('USER')")
    public Post createPost(CreatePostRequest request, Authentication auth) {
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .authorId(userPrincipal.getId())
                .build();
                
        return postRepository.save(post);
    }
    
    @PreAuthorize("hasRole('ADMIN') or @postService.isAuthor(#postId, authentication.name)")
    public Post updatePost(Long postId, UpdatePostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
                
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        
        return postRepository.save(post);
    }
    
    @PostAuthorize("hasRole('ADMIN') or returnObject.authorId == authentication.principal.id")
    public Post getPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
    }
    
    @PreFilter("hasRole('ADMIN') or filterObject.authorId == authentication.principal.id")
    public List<Post> updatePosts(List<Post> posts) {
        return postRepository.saveAll(posts);
    }
    
    public boolean isAuthor(Long postId, String email) {
        return postRepository.findById(postId)
                .map(post -> post.getAuthor().getEmail().equals(email))
                .orElse(false);
    }
}
```

### 2. 커스텀 Permission Evaluator

```java
@Component
public class CustomPermissionEvaluator implements PermissionEvaluator {
    
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    
    public CustomPermissionEvaluator(PostRepository postRepository, 
                                    CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }
    
    @Override
    public boolean hasPermission(Authentication auth, Object targetDomainObject, Object permission) {
        if (!(auth.getPrincipal() instanceof UserPrincipal)) {
            return false;
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        String permissionString = permission.toString();
        
        if (targetDomainObject instanceof Post) {
            return hasPostPermission(userPrincipal, (Post) targetDomainObject, permissionString);
        } else if (targetDomainObject instanceof Comment) {
            return hasCommentPermission(userPrincipal, (Comment) targetDomainObject, permissionString);
        }
        
        return false;
    }
    
    @Override
    public boolean hasPermission(Authentication auth, Serializable targetId, 
                                String targetType, Object permission) {
        if (!(auth.getPrincipal() instanceof UserPrincipal)) {
            return false;
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) auth.getPrincipal();
        String permissionString = permission.toString();
        
        if ("Post".equals(targetType)) {
            return postRepository.findById((Long) targetId)
                    .map(post -> hasPostPermission(userPrincipal, post, permissionString))
                    .orElse(false);
        } else if ("Comment".equals(targetType)) {
            return commentRepository.findById((Long) targetId)
                    .map(comment -> hasCommentPermission(userPrincipal, comment, permissionString))
                    .orElse(false);
        }
        
        return false;
    }
    
    private boolean hasPostPermission(UserPrincipal user, Post post, String permission) {
        // 관리자는 모든 권한
        if (user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return true;
        }
        
        // 작성자는 읽기, 수정, 삭제 권한
        if (post.getAuthorId().equals(user.getId())) {
            return "read".equals(permission) || "write".equals(permission) || "delete".equals(permission);
        }
        
        // 일반 사용자는 읽기 권한만
        return "read".equals(permission);
    }
    
    private boolean hasCommentPermission(UserPrincipal user, Comment comment, String permission) {
        // 관리자는 모든 권한
        if (user.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return true;
        }
        
        // 작성자는 읽기, 수정, 삭제 권한
        if (comment.getAuthorId().equals(user.getId())) {
            return "read".equals(permission) || "write".equals(permission) || "delete".equals(permission);
        }
        
        // 일반 사용자는 읽기 권한만
        return "read".equals(permission);
    }
}

// 사용 예시
@PreAuthorize("hasPermission(#postId, 'Post', 'write')")
public Post updatePost(Long postId, UpdatePostRequest request) {
    // 구현
}

@PreAuthorize("hasPermission(#post, 'delete')")
public void deletePost(Post post) {
    // 구현
}
```

## OAuth2 소셜 로그인

### 1. OAuth2 설정

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope:
              - email
              - profile
          github:
            client-id: ${GITHUB_CLIENT_ID}
            client-secret: ${GITHUB_CLIENT_SECRET}
            scope:
              - user:email
              - read:user
          kakao:
            client-id: ${KAKAO_CLIENT_ID}
            client-secret: ${KAKAO_CLIENT_SECRET}
            client-authentication-method: client_secret_post
            authorization-grant-type: authorization_code
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
            scope:
              - profile_nickname
              - account_email
        provider:
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id
```

### 2. OAuth2 사용자 정보 처리

```java
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());
        
        if (StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }
        
        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;
        
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getProvider().equals(AuthProvider.valueOf(registrationId.toUpperCase()))) {
                throw new OAuth2AuthenticationProcessingException(
                    "Looks like you're signed up with " + user.getProvider() + " account. " +
                    "Please use your " + user.getProvider() + " account to login."
                );
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(userRequest, oAuth2UserInfo);
        }
        
        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }
    
    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = User.builder()
                .provider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId().toUpperCase()))
                .providerId(oAuth2UserInfo.getId())
                .name(oAuth2UserInfo.getName())
                .email(oAuth2UserInfo.getEmail())
                .imageUrl(oAuth2UserInfo.getImageUrl())
                .emailVerified(true)
                .roles(Set.of(Role.USER))
                .build();
                
        return userRepository.save(user);
    }
    
    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setName(oAuth2UserInfo.getName());
        existingUser.setImageUrl(oAuth2UserInfo.getImageUrl());
        return userRepository.save(existingUser);
    }
}

public enum AuthProvider {
    LOCAL, GOOGLE, GITHUB, KAKAO
}
```

### 3. OAuth2 성공/실패 핸들러

```java
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    
    private final TokenProvider tokenProvider;
    private final AppProperties appProperties;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, 
                                      Authentication authentication) throws IOException, ServletException {
        String targetUrl = determineTargetUrl(request, response, authentication);
        
        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }
        
        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
    
    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, 
                                       Authentication authentication) {
        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);
                
        if (redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            throw new BadRequestException("Sorry! We've got an Unauthorized Redirect URI and can't proceed with the authentication");
        }
        
        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());
        
        String token = tokenProvider.createToken(authentication);
        
        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("token", token)
                .build().toUriString();
    }
    
    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }
    
    private boolean isAuthorizedRedirectUri(String uri) {
        URI clientRedirectUri = URI.create(uri);
        
        return appProperties.getOauth2().getAuthorizedRedirectUris()
                .stream()
                .anyMatch(authorizedRedirectUri -> {
                    URI authorizedURI = URI.create(authorizedRedirectUri);
                    return authorizedURI.getHost().equalsIgnoreCase(clientRedirectUri.getHost())
                            && authorizedURI.getPort() == clientRedirectUri.getPort();
                });
    }
}

@Component
public class OAuth2AuthenticationFailureHandler implements AuthenticationFailureHandler {
    
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, 
                                      AuthenticationException exception) throws IOException, ServletException {
        String targetUrl = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue)
                .orElse(("/"));
                
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", exception.getLocalizedMessage())
                .build().toUriString();
                
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
```

## CSRF 보안

### 1. CSRF 설정

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/api/public/**", "/h2-console/**")
                .csrfTokenRequestHandler(new XorCsrfTokenRequestAttributeHandler())
            );
            
        return http.build();
    }
}
```

### 2. CSRF 토큰 활용

```html
<!-- Thymeleaf 템플릿에서 CSRF 토큰 사용 -->
<form th:action="@{/posts}" method="post">
    <input type="hidden" th:name="${_csrf.parameterName}" th:value="${_csrf.token}"/>
    <input type="text" name="title" placeholder="제목"/>
    <textarea name="content" placeholder="내용"></textarea>
    <button type="submit">등록</button>
</form>

<!-- JavaScript에서 CSRF 토큰 사용 -->
<script>
$(document).ready(function() {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader(header, token);
        }
    });
    
    // AJAX 요청 예시
    $.ajax({
        url: '/api/posts',
        method: 'POST',
        data: {
            title: '제목',
            content: '내용'
        },
        success: function(response) {
            console.log('Success:', response);
        }
    });
});
</script>

<!-- 메타 태그에 CSRF 정보 포함 -->
<meta name="_csrf" th:content="${_csrf.token}"/>
<meta name="_csrf_header" th:content="${_csrf.headerName}"/>
```

## 보안 헤더 설정

### 1. 보안 헤더 구성

```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .headers(headers -> headers
                .frameOptions().deny()
                .contentTypeOptions().and()
                .xssProtection().and()
                .referrerPolicy(ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubdomains(true)
                    .preload(true)
                )
                .contentSecurityPolicy("default-src 'self'; " +
                                     "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
                                     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                                     "font-src 'self' https://fonts.gstatic.com; " +
                                     "img-src 'self' data: https:; " +
                                     "connect-src 'self'")
            );
            
        return http.build();
    }
}
```

### 2. 커스텀 보안 헤더

```java
@Component
public class SecurityHeadersFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // 추가 보안 헤더 설정
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        httpResponse.setHeader("X-Frame-Options", "DENY");
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        httpResponse.setHeader("Permissions-Policy", 
            "camera=(), microphone=(), geolocation=()");
        
        // HTTPS에서만 추가
        if (request.isSecure()) {
            httpResponse.setHeader("Strict-Transport-Security", 
                "max-age=31536000; includeSubDomains; preload");
        }
        
        chain.doFilter(request, response);
    }
}
```

## 감사 로깅

### 1. 보안 이벤트 감사

```java
@Component
@Slf4j
public class SecurityAuditListener {
    
    @EventListener
    public void handleAuthenticationSuccess(AuthenticationSuccessEvent event) {
        String username = event.getAuthentication().getName();
        String authorities = event.getAuthentication().getAuthorities().toString();
        
        log.info("Authentication successful for user: {} with authorities: {}", 
                username, authorities);
    }
    
    @EventListener
    public void handleAuthenticationFailure(AbstractAuthenticationFailureEvent event) {
        String username = event.getAuthentication().getName();
        String exception = event.getException().getMessage();
        
        log.warn("Authentication failed for user: {} with exception: {}", 
                username, exception);
    }
    
    @EventListener
    public void handleAuthorizationFailure(AuthorizationDeniedEvent event) {
        Authentication auth = event.getAuthentication();
        Object source = event.getSource();
        
        log.warn("Authorization denied for user: {} attempting to access: {}", 
                auth.getName(), source.toString());
    }
    
    @EventListener
    public void handleSessionCreation(HttpSessionCreatedEvent event) {
        String sessionId = event.getSession().getId();
        log.info("New session created: {}", sessionId);
    }
    
    @EventListener
    public void handleSessionDestroyed(HttpSessionDestroyedEvent event) {
        String sessionId = event.getSession().getId();
        log.info("Session destroyed: {}", sessionId);
    }
}
```

### 2. 메소드 호출 감사

```java
@Aspect
@Component
@Slf4j
public class SecurityAuditAspect {
    
    @Around("@annotation(org.springframework.security.access.prepost.PreAuthorize)")
    public Object auditSecuredMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String methodName = joinPoint.getSignature().toShortString();
        String username = auth != null ? auth.getName() : "anonymous";
        
        log.info("Secured method {} called by user: {}", methodName, username);
        
        try {
            Object result = joinPoint.proceed();
            log.info("Secured method {} executed successfully by user: {}", methodName, username);
            return result;
        } catch (Exception e) {
            log.error("Secured method {} failed for user: {} with error: {}", 
                     methodName, username, e.getMessage());
            throw e;
        }
    }
    
    @AfterThrowing(pointcut = "@annotation(org.springframework.security.access.prepost.PreAuthorize)", 
                   throwing = "ex")
    public void auditSecurityException(JoinPoint joinPoint, Exception ex) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String methodName = joinPoint.getSignature().toShortString();
        String username = auth != null ? auth.getName() : "anonymous";
        
        if (ex instanceof AccessDeniedException) {
            log.warn("Access denied for user: {} attempting to call method: {}", username, methodName);
        }
    }
}
```

## 테스트 코드

### 1. 보안 테스트

```java
@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithAnonymousUser
    void anonymousUser_CanAccessPublicEndpoints() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk());
                
        mockMvc.perform(get("/public/posts"))
                .andExpect(status().isOk());
    }
    
    @Test
    @WithAnonymousUser
    void anonymousUser_CannotAccessSecuredEndpoints() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isUnauthorized());
                
        mockMvc.perform(get("/user/profile"))
                .andExpected(status().isUnauthorized());
    }
    
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void userRole_CanAccessUserEndpoints() throws Exception {
        mockMvc.perform(get("/user/profile"))
                .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void userRole_CannotAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isForbidden());
    }
    
    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void adminRole_CanAccessAllEndpoints() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk());
                
        mockMvc.perform(get("/user/profile"))
                .andExpect(status().isOk());
    }
    
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void csrfProtection_RequiredForStatefulRequests() throws Exception {
        mockMvc.perform(post("/posts")
                .param("title", "Test Title")
                .param("content", "Test Content")
                .with(csrf()))
                .andExpect(status().isOk());
                
        mockMvc.perform(post("/posts")
                .param("title", "Test Title")
                .param("content", "Test Content"))
                .andExpect(status().isForbidden());
    }
}
```

### 2. 메소드 보안 테스트

```java
@SpringBootTest
@TestMethodSecurity
class PostServiceSecurityTest {
    
    @Autowired
    private PostService postService;
    
    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void admin_CanAccessAllPosts() {
        List<Post> posts = postService.getAllPosts();
        assertThat(posts).isNotNull();
    }
    
    @Test
    @WithMockUser(username = "user", roles = "USER")
    void user_CannotAccessAllPosts() {
        assertThatThrownBy(() -> postService.getAllPosts())
                .isInstanceOf(AccessDeniedException.class);
    }
    
    @Test
    @WithUserDetails("test@example.com")
    void authenticatedUser_CanCreatePost() {
        CreatePostRequest request = new CreatePostRequest("Title", "Content");
        
        Post post = postService.createPost(request, SecurityContextHolder.getContext().getAuthentication());
        
        assertThat(post).isNotNull();
        assertThat(post.getTitle()).isEqualTo("Title");
    }
    
    @Test
    @WithUserDetails("author@example.com")
    void author_CanUpdateOwnPost() {
        // Given
        Long postId = 1L; // 작성자가 author@example.com인 포스트
        UpdatePostRequest request = new UpdatePostRequest("Updated Title", "Updated Content");
        
        // When & Then
        assertThatCode(() -> postService.updatePost(postId, request))
                .doesNotThrowAnyException();
    }
    
    @Test
    @WithUserDetails("other@example.com")
    void nonAuthor_CannotUpdatePost() {
        // Given
        Long postId = 1L; // 작성자가 author@example.com인 포스트
        UpdatePostRequest request = new UpdatePostRequest("Updated Title", "Updated Content");
        
        // When & Then
        assertThatThrownBy(() -> postService.updatePost(postId, request))
                .isInstanceOf(AccessDeniedException.class);
    }
}

// 커스텀 테스트 사용자 생성
@TestConfiguration
public class TestSecurityConfig {
    
    @Bean
    @Primary
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withDefaultPasswordEncoder()
                .username("test@example.com")
                .password("password")
                .roles("USER")
                .build();
                
        UserDetails author = User.withDefaultPasswordEncoder()
                .username("author@example.com")
                .password("password")
                .roles("USER")
                .build();
                
        UserDetails admin = User.withDefaultPasswordEncoder()
                .username("admin@example.com")
                .password("password")
                .roles("ADMIN")
                .build();
                
        return new InMemoryUserDetailsManager(user, author, admin);
    }
}
```

## 성능 최적화

### 1. 세션 관리 최적화

```java
@Configuration
public class SessionConfig {
    
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }
    
    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }
    
    // Redis를 사용한 세션 스토어 (분산 환경에서 유용)
    @Bean
    @ConditionalOnProperty(name = "spring.session.store-type", havingValue = "redis")
    public LettuceConnectionFactory connectionFactory() {
        return new LettuceConnectionFactory(
            new RedisStandaloneConfiguration("localhost", 6379));
    }
}
```

### 2. 인증 캐싱

```java
@Service
@RequiredArgsConstructor
public class CachedUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final CacheManager cacheManager;
    
    @Override
    @Cacheable(value = "userDetails", key = "#username")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
                
        return UserPrincipal.create(user);
    }
    
    @CacheEvict(value = "userDetails", key = "#username")
    public void evictUserFromCache(String username) {
        // 사용자 정보 변경 시 캐시에서 제거
    }
    
    @CacheEvict(value = "userDetails", allEntries = true)
    public void evictAllUsersFromCache() {
        // 전체 사용자 캐시 클리어
    }
}
```

## 실무 보안 체크리스트: 꼭 확인해야 할 항목들

Spring Security를 도입했다고 해서 모든 보안 문제가 해결되는 것은 아니다. 실무에서 놓치기 쉬운 보안 요소들을 체계적으로 점검해보자.

### 개발 단계 보안 체크리스트

**1. 인증 관련**
- [ ] 비밀번호 정책 (최소 8자, 특수문자 포함)
- [ ] 계정 잠금 정책 (5회 실패 시 30분 잠금)
- [ ] 세션 타임아웃 설정 (30분 이내)
- [ ] 다중 로그인 방지 또는 제한
- [ ] 비밀번호 변경 주기 정책

**2. 인가 관련**
- [ ] 최소 권한 원칙 적용
- [ ] URL 기반 접근 제어
- [ ] 메서드 수준 보안 적용
- [ ] 리소스별 세밀한 권한 관리
- [ ] 권한 상승 공격 방지

**3. 데이터 보호**
- [ ] HTTPS 강제 사용
- [ ] 민감 정보 암호화
- [ ] SQL 인젝션 방지
- [ ] XSS 방지 헤더 설정
- [ ] CSRF 토큰 적용

### 운영 단계 보안 관리

**1. 모니터링과 로깅**

```yaml
# 보안 이벤트 로깅 설정
logging:
  level:
    org.springframework.security: DEBUG
    org.springframework.security.web.authentication: DEBUG
    org.springframework.security.web.access: DEBUG
```

**보안 이벤트 대시보드 구성**
- 로그인 시도 횟수 모니터링
- 권한 위반 시도 알림
- 비정상적인 접근 패턴 탐지
- 실패한 인증 시도 추적

**2. 정기적인 보안 점검**

**주간 점검 항목**
- 활성 세션 현황 검토
- 실패한 로그인 시도 분석
- 권한 변경 내역 검토

**월간 점검 항목**
- 사용자 권한 정리 (퇴사자 계정 정리)
- 보안 패치 적용 여부 확인
- 취약점 스캔 수행

**분기별 점검 항목**
- 보안 정책 재검토
- 침투 테스트 수행
- 보안 교육 실시

### 보안 사고 대응 절차

**1. 초기 대응 (발견 즉시)**
```
1. 즉시 해당 계정 비활성화
2. 관련 세션 강제 종료
3. 사고 현황 기록
4. 관련팀 긴급 소집
```

**2. 피해 조사 (24시간 내)**
```
1. 침해 범위 조사
2. 유출 데이터 확인
3. 공격 경로 분석
4. 증거 보전
```

**3. 복구 및 개선 (1주일 내)**
```
1. 취약점 패치
2. 보안 정책 강화
3. 모니터링 시스템 개선
4. 재발 방지책 수립
```

### Spring Security 성능 최적화 가이드

**1. 세션 관리 최적화**

대용량 트래픽을 처리하는 서비스에서는 세션 관리가 성능에 큰 영향을 미친다.

```java
@Configuration
public class SessionOptimizationConfig {
    
    // Redis 기반 세션 클러스터링
    @Bean
    public LettuceConnectionFactory connectionFactory() {
        LettuceConnectionFactory factory = new LettuceConnectionFactory();
        factory.setDatabase(1); // 세션 전용 DB 사용
        return factory;
    }
    
    // 세션 최적화 설정
    @Bean
    public HttpSessionStrategy httpSessionStrategy() {
        CookieHttpSessionStrategy strategy = new CookieHttpSessionStrategy();
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setHttpOnly(true);
        serializer.setSecure(true);
        serializer.setSameSite("Strict");
        strategy.setCookieSerializer(serializer);
        return strategy;
    }
}
```

**2. 캐시 활용한 권한 조회 최적화**

```java
@Service
@RequiredArgsConstructor
public class OptimizedUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    
    @Cacheable(value = "userDetails", key = "#username")
    public UserDetails loadUserByUsername(String username) {
        // 사용자 정보와 권한을 한 번에 조회
        User user = userRepository.findByUsernameWithRoles(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return createUserDetails(user);
    }
    
    @CacheEvict(value = "userDetails", key = "#username")
    public void evictUserCache(String username) {
        // 권한 변경 시 캐시 무효화
    }
}
```

### 보안 테스트 전략

**1. 단위 테스트**

```java
@WebMvcTest(UserController.class)
@Import(SecurityTestConfig.class)
class UserControllerSecurityTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithAnonymousUser
    void 인증되지_않은_사용자는_관리자_페이지에_접근할_수_없다() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isUnauthorized());
    }
    
    @Test
    @WithMockUser(roles = "USER")
    void 일반_사용자는_관리자_페이지에_접근할_수_없다() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isForbidden());
    }
    
    @Test
    @WithMockUser(roles = "ADMIN")
    void 관리자는_관리자_페이지에_접근할_수_있다() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk());
    }
}
```

**2. 통합 테스트**

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = "spring.profiles.active=test")
class SecurityIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void CSRF_토큰_없이는_POST_요청이_실패한다() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> entity = new HttpEntity<>("{\"name\":\"test\"}", headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            "/api/users", HttpMethod.POST, entity, String.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }
}
```

### 보안 교육과 문화 조성

**1. 개발팀 보안 교육**
- 월 1회 보안 세미나 개최
- OWASP Top 10 스터디
- 보안 코딩 가이드라인 숙지
- 코드 리뷰 시 보안 관점 포함

**2. 보안 문화 조성**
- 보안 이슈 신고 포상제도
- 정기적인 모의 해킹 훈련
- 보안 관련 컨퍼런스 참여 지원
- 보안 자격증 취득 지원

## 마무리

Spring Security는 단순한 프레임워크가 아니라 기업의 디지털 자산을 보호하는 핵심 방어선이다. 기술적 구현도 중요하지만, 보안을 조직 문화로 만드는 것이 더욱 중요하다.

### 성공적인 보안 구현을 위한 원칙

**1. 보안은 처음부터 (Security by Design)**
기능 개발 후 보안을 추가하는 것이 아니라, 설계 단계부터 보안을 고려해야 한다.

**2. 심층 방어 (Defense in Depth)**
하나의 보안 기법에 의존하지 않고 여러 계층의 보안을 적용해야 한다.

**3. 최소 권한 원칙 (Principle of Least Privilege)**
사용자와 시스템에게 필요한 최소한의 권한만 부여해야 한다.

**4. 지속적인 모니터링과 개선**
보안은 한 번 구축하고 끝나는 것이 아니라 지속적으로 관리해야 한다.

**5. 사용자 교육과 인식 개선**
기술적 보안만으로는 충분하지 않으며, 사용자의 보안 의식도 중요하다.

### 보안은 여정이다

완벽한 보안은 존재하지 않는다. 새로운 위협이 계속 등장하고, 기술도 빠르게 변화한다. 중요한 것은 현재 상황에서 최선의 보안을 구현하고, 지속적으로 개선해 나가는 것이다.

이 가이드가 안전하고 신뢰할 수 있는 애플리케이션을 구축하는 데 도움이 되기를 바란다. 보안은 선택이 아닌 필수이며, 우리 모두의 책임이다.

### 추가 학습 자료

**필수 도서**
- 『웹 해킹 & 보안 완벽 가이드』
- 『Spring Security 실전 가이드』

**온라인 자료**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [KISA 보안 가이드](https://www.kisa.or.kr/)

**보안 도구**
- OWASP ZAP (취약점 스캔)
- Burp Suite (웹 애플리케이션 보안 테스트)
- SonarQube (정적 코드 분석) 