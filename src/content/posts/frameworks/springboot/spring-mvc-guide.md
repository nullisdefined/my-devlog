---
title: "[Spring Boot] Spring MVC 구조 완벽 가이드"
slug: "spring-mvc-guide"
date: 2025-01-15
tags: ["SpringBoot", "MVC", "Controller", "Architecture"]
category: "Frameworks/SpringBoot"
thumbnail: "https://img.shields.io/badge/Spring%20MVC-6DB33F?style=for-the-badge&logo=spring&logoColor=white"
draft: true
views: 0
---

![Spring MVC Guide](https://img.shields.io/badge/Spring%20MVC-6DB33F?style=for-the-badge&logo=spring&logoColor=white)

웹 애플리케이션 개발에서 MVC(Model-View-Controller) 패턴은 관심사의 분리를 통해 유지보수성과 확장성을 제공하는 핵심 아키텍처다. Spring MVC는 이 패턴을 구현한 강력한 웹 프레임워크로, 유연하고 확장 가능한 웹 애플리케이션 개발을 가능하게 한다.

## Spring MVC란?

Spring MVC는 Spring Framework의 웹 계층을 담당하는 모듈로, Model-View-Controller 패턴을 기반으로 한다. DispatcherServlet을 중심으로 한 Front Controller 패턴을 통해 모든 요청을 중앙에서 처리한다.

### MVC 패턴의 구성요소

- **Model**: 데이터와 비즈니스 로직을 담당
- **View**: 사용자 인터페이스와 데이터 표현을 담당  
- **Controller**: 사용자 입력을 받아 Model과 View를 조정

### Spring MVC의 장점

- **유연한 구조**: 다양한 View 기술 지원
- **강력한 데이터 바인딩**: 자동 객체 매핑
- **검증 기능**: Validation API 통합
- **국제화 지원**: 다국어 메시지 처리
- **RESTful 웹 서비스**: REST API 구현 지원

## Spring MVC 아키텍처

### 1. 전체 흐름도

```
Client Request
      ↓
DispatcherServlet (Front Controller)
      ↓
HandlerMapping (요청 URL → Controller 매핑)
      ↓
HandlerAdapter (Controller 실행)
      ↓
Controller (비즈니스 로직 처리)
      ↓
ModelAndView 반환
      ↓
ViewResolver (논리적 View명 → 실제 View 객체)
      ↓
View (응답 렌더링)
      ↓
Client Response
```

### 2. 핵심 컴포넌트

```java
// DispatcherServlet 설정
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    // ViewResolver 설정
    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
    
    // HandlerMapping 커스터마이징
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseTrailingSlashMatch(true);
        configurer.setUseSuffixPatternMatch(false);
    }
    
    // 메시지 컨버터 설정
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(new MappingJackson2HttpMessageConverter());
    }
    
    // 인터셉터 등록
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoggingInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/static/**");
    }
    
    // 정적 리소스 처리
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}
```

## Controller 구현

### 1. 기본 Controller

```java
@Controller
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // GET 요청 처리
    @GetMapping
    public String listUsers(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        return "users/list";  // View 이름
    }
    
    // 경로 변수 처리
    @GetMapping("/{id}")
    public String getUserDetail(@PathVariable Long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        return "users/detail";
    }
    
    // 쿼리 파라미터 처리
    @GetMapping("/search")
    public String searchUsers(@RequestParam(required = false) String name,
                             @RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "10") int size,
                             Model model) {
        Page<User> users = userService.search(name, page, size);
        model.addAttribute("users", users);
        model.addAttribute("searchName", name);
        return "users/search";
    }
    
    // POST 요청 처리 (폼 제출)
    @PostMapping
    public String createUser(@ModelAttribute @Valid CreateUserRequest request,
                            BindingResult bindingResult,
                            Model model) {
        if (bindingResult.hasErrors()) {
            return "users/form";
        }
        
        User user = userService.create(request);
        return "redirect:/users/" + user.getId();
    }
    
    // PUT 요청 처리 (수정)
    @PutMapping("/{id}")
    public String updateUser(@PathVariable Long id,
                            @ModelAttribute @Valid UpdateUserRequest request,
                            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "users/edit";
        }
        
        userService.update(id, request);
        return "redirect:/users/" + id;
    }
    
    // DELETE 요청 처리 (삭제)
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return "redirect:/users";
    }
}
```

### 2. REST Controller

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserApiController {
    
    private final UserService userService;
    
    public UserApiController(UserService userService) {
        this.userService = userService;
    }
    
    // GET - 목록 조회
    @GetMapping
    public ResponseEntity<Page<UserDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<UserDto> users = userService.findAllDto(pageable);
        
        return ResponseEntity.ok(users);
    }
    
    // GET - 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id) {
        UserDto user = userService.findDtoById(id);
        return ResponseEntity.ok(user);
    }
    
    // POST - 생성
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody @Valid CreateUserRequest request) {
        UserDto user = userService.createAndReturnDto(request);
        
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(user.getId())
                .toUri();
                
        return ResponseEntity.created(location).body(user);
    }
    
    // PUT - 전체 수정
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id,
                                             @RequestBody @Valid UpdateUserRequest request) {
        UserDto user = userService.update(id, request);
        return ResponseEntity.ok(user);
    }
    
    // PATCH - 부분 수정
    @PatchMapping("/{id}")
    public ResponseEntity<UserDto> patchUser(@PathVariable Long id,
                                            @RequestBody Map<String, Object> updates) {
        UserDto user = userService.partialUpdate(id, updates);
        return ResponseEntity.ok(user);
    }
    
    // DELETE - 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    // 복잡한 검색
    @PostMapping("/search")
    public ResponseEntity<Page<UserDto>> searchUsers(
            @RequestBody UserSearchCriteria criteria,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<UserDto> users = userService.search(criteria, pageable);
        return ResponseEntity.ok(users);
    }
}
```

### 3. 파일 업로드 처리

```java
@Controller
@RequestMapping("/files")
public class FileController {
    
    private final FileService fileService;
    
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }
    
    // 단일 파일 업로드
    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file,
                            RedirectAttributes redirectAttributes) {
        
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "파일을 선택해주세요.");
            return "redirect:/files";
        }
        
        try {
            String savedFileName = fileService.save(file);
            redirectAttributes.addFlashAttribute("message", 
                "파일 업로드 성공: " + savedFileName);
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("error", 
                "파일 업로드 실패: " + e.getMessage());
        }
        
        return "redirect:/files";
    }
    
    // 다중 파일 업로드
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<FileUploadResponse>> uploadMultipleFiles(
            @RequestParam("files") MultipartFile[] files) {
        
        List<FileUploadResponse> responses = Arrays.stream(files)
                .map(file -> {
                    try {
                        String savedFileName = fileService.save(file);
                        return FileUploadResponse.success(file.getOriginalFilename(), savedFileName);
                    } catch (IOException e) {
                        return FileUploadResponse.error(file.getOriginalFilename(), e.getMessage());
                    }
                })
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(responses);
    }
    
    // 파일 다운로드
    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        
        try {
            Resource resource = fileService.loadAsResource(filename);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
                    
        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 이미지 표시 (인라인)
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> displayImage(@PathVariable String filename) {
        
        try {
            Resource resource = fileService.loadAsResource(filename);
            String contentType = Files.probeContentType(Paths.get(resource.getURI()));
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

@Data
@AllArgsConstructor
public class FileUploadResponse {
    private String originalName;
    private String savedName;
    private boolean success;
    private String message;
    
    public static FileUploadResponse success(String originalName, String savedName) {
        return new FileUploadResponse(originalName, savedName, true, "업로드 성공");
    }
    
    public static FileUploadResponse error(String originalName, String message) {
        return new FileUploadResponse(originalName, null, false, message);
    }
}
```

## 데이터 바인딩과 검증

### 1. Request DTO와 Validation

```java
// 생성 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    
    @NotBlank(message = "이름은 필수입니다")
    @Size(min = 2, max = 50, message = "이름은 2-50자 사이여야 합니다")
    private String name;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;
    
    @NotNull(message = "나이는 필수입니다")
    @Min(value = 0, message = "나이는 0 이상이어야 합니다")
    @Max(value = 150, message = "나이는 150 이하여야 합니다")
    private Integer age;
    
    @Pattern(regexp = "^\\d{3}-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다")
    private String phoneNumber;
    
    @NotEmpty(message = "최소 하나의 취미를 선택해주세요")
    private List<String> hobbies;
    
    // 커스텀 Validation
    @ValidPassword
    private String password;
}

// 수정 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    
    @Size(min = 2, max = 50, message = "이름은 2-50자 사이여야 합니다")
    private String name;
    
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;
    
    @Min(value = 0, message = "나이는 0 이상이어야 합니다")
    @Max(value = 150, message = "나이는 150 이하여야 합니다")
    private Integer age;
    
    @Pattern(regexp = "^\\d{3}-\\d{3,4}-\\d{4}$", message = "올바른 전화번호 형식이 아닙니다")
    private String phoneNumber;
}

// 커스텀 Validation 어노테이션
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordValidator.class)
public @interface ValidPassword {
    String message() default "비밀번호는 8자 이상이며 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// 커스텀 Validator 구현
public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {
    
    private static final String PASSWORD_PATTERN = 
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    
    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);
    
    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        return password != null && pattern.matcher(password).matches();
    }
}
```

### 2. Controller에서 검증 처리

```java
@Controller
@RequestMapping("/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // 생성 폼 표시
    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("user", new CreateUserRequest());
        return "users/form";
    }
    
    // 생성 처리 (검증 포함)
    @PostMapping
    public String createUser(@ModelAttribute("user") @Valid CreateUserRequest request,
                            BindingResult bindingResult,
                            Model model) {
        
        // 유효성 검사 실패 시
        if (bindingResult.hasErrors()) {
            return "users/form";
        }
        
        // 비즈니스 로직 검증
        if (userService.existsByEmail(request.getEmail())) {
            bindingResult.rejectValue("email", "duplicate.email", "이미 존재하는 이메일입니다");
            return "users/form";
        }
        
        try {
            User user = userService.create(request);
            return "redirect:/users/" + user.getId();
        } catch (Exception e) {
            model.addAttribute("error", "사용자 생성 중 오류가 발생했습니다: " + e.getMessage());
            return "users/form";
        }
    }
    
    // REST API에서의 검증
    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<?> createUserApi(@RequestBody @Valid CreateUserRequest request,
                                          BindingResult bindingResult) {
        
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> 
                errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(errors);
        }
        
        User user = userService.create(request);
        return ResponseEntity.ok(user);
    }
}
```

### 3. 글로벌 검증 예외 처리

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    // Validation 예외 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationException(
            MethodArgumentNotValidException e) {
        
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        ValidationErrorResponse response = ValidationErrorResponse.builder()
            .message("입력값 검증에 실패했습니다")
            .errors(errors)
            .timestamp(LocalDateTime.now())
            .build();
            
        return ResponseEntity.badRequest().body(response);
    }
    
    // 바인딩 예외 처리
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ValidationErrorResponse> handleBindException(BindException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        ValidationErrorResponse response = ValidationErrorResponse.builder()
            .message("데이터 바인딩에 실패했습니다")
            .errors(errors)
            .timestamp(LocalDateTime.now())
            .build();
            
        return ResponseEntity.badRequest().body(response);
    }
    
    // 비즈니스 예외 처리
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        ErrorResponse response = ErrorResponse.builder()
            .code(e.getErrorCode())
            .message(e.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
            
        return ResponseEntity.status(e.getHttpStatus()).body(response);
    }
    
    // 일반 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception e) {
        ErrorResponse response = ErrorResponse.builder()
            .code("INTERNAL_SERVER_ERROR")
            .message("서버 내부 오류가 발생했습니다")
            .timestamp(LocalDateTime.now())
            .build();
            
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

@Data
@Builder
public class ValidationErrorResponse {
    private String message;
    private Map<String, String> errors;
    private LocalDateTime timestamp;
}

@Data
@Builder
public class ErrorResponse {
    private String code;
    private String message;
    private LocalDateTime timestamp;
}
```

## 인터셉터와 필터

### 1. HandlerInterceptor 구현

```java
@Component
public class LoggingInterceptor implements HandlerInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingInterceptor.class);
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, 
                           Object handler) throws Exception {
        
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        String queryString = request.getQueryString();
        
        logger.info("Request: {} {} {}", method, requestURI, 
                   queryString != null ? "?" + queryString : "");
        
        // 요청 시작 시간 저장
        request.setAttribute("startTime", System.currentTimeMillis());
        
        return true; // true 반환 시 다음 단계 진행
    }
    
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, 
                          Object handler, ModelAndView modelAndView) throws Exception {
        
        if (modelAndView != null) {
            logger.info("View: {}", modelAndView.getViewName());
            logger.info("Model: {}", modelAndView.getModel());
        }
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                               Object handler, Exception ex) throws Exception {
        
        Long startTime = (Long) request.getAttribute("startTime");
        if (startTime != null) {
            long duration = System.currentTimeMillis() - startTime;
            logger.info("Response: {} ({}ms)", response.getStatus(), duration);
        }
        
        if (ex != null) {
            logger.error("Request failed", ex);
        }
    }
}

// 인증 인터셉터
@Component
public class AuthenticationInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, 
                           Object handler) throws Exception {
        
        // @LoginRequired 어노테이션 체크
        if (handler instanceof HandlerMethod) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            LoginRequired loginRequired = handlerMethod.getMethodAnnotation(LoginRequired.class);
            
            if (loginRequired != null) {
                HttpSession session = request.getSession(false);
                if (session == null || session.getAttribute("user") == null) {
                    response.sendRedirect("/login?returnUrl=" + request.getRequestURI());
                    return false;
                }
            }
        }
        
        return true;
    }
}

// 커스텀 어노테이션
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface LoginRequired {
}
```

### 2. Filter 구현

```java
@Component
@Order(1)
public class RequestLoggingFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // 요청 정보 로깅
        String method = httpRequest.getMethod();
        String uri = httpRequest.getRequestURI();
        String clientIP = getClientIP(httpRequest);
        
        logger.info("REQUEST: {} {} from {}", method, uri, clientIP);
        
        long startTime = System.currentTimeMillis();
        
        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            logger.info("RESPONSE: {} for {} {} ({}ms)", 
                       httpResponse.getStatus(), method, uri, duration);
        }
    }
    
    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }
}

// CORS 필터
@Component
@Order(2)
public class CorsFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // CORS 헤더 설정
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");
        
        // OPTIONS 요청 처리
        if ("OPTIONS".equals(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpStatus.OK.value());
            return;
        }
        
        chain.doFilter(request, response);
    }
}
```

## View와 템플릿 엔진

### 1. Thymeleaf 활용

```html
<!-- users/list.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>사용자 목록</title>
    <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
</head>
<body>
    <div class="container">
        <h1>사용자 목록</h1>
        
        <!-- 검색 폼 -->
        <form th:action="@{/users/search}" method="get" class="mb-3">
            <div class="input-group">
                <input type="text" name="name" th:value="${searchName}" 
                       class="form-control" placeholder="이름으로 검색">
                <button type="submit" class="btn btn-primary">검색</button>
            </div>
        </form>
        
        <!-- 사용자 추가 버튼 -->
        <a th:href="@{/users/new}" class="btn btn-success mb-3">새 사용자 추가</a>
        
        <!-- 사용자 목록 테이블 -->
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>나이</th>
                    <th>가입일</th>
                    <th>액션</th>
                </tr>
            </thead>
            <tbody>
                <tr th:each="user : ${users}" th:object="${user}">
                    <td th:text="*{id}"></td>
                    <td>
                        <a th:href="@{/users/{id}(id=*{id})}" th:text="*{name}"></a>
                    </td>
                    <td th:text="*{email}"></td>
                    <td th:text="*{age}"></td>
                    <td th:text="${#temporals.format(user.createdAt, 'yyyy-MM-dd')}"></td>
                    <td>
                        <a th:href="@{/users/{id}/edit(id=*{id})}" class="btn btn-sm btn-warning">수정</a>
                        <form th:action="@{/users/{id}(id=*{id})}" method="post" style="display: inline;">
                            <input type="hidden" name="_method" value="delete">
                            <button type="submit" class="btn btn-sm btn-danger"
                                    onclick="return confirm('정말 삭제하시겠습니까?')">삭제</button>
                        </form>
                    </td>
                </tr>
            </tbody>
        </table>
        
        <!-- 페이징 -->
        <nav th:if="${users.totalPages > 1}">
            <ul class="pagination">
                <li class="page-item" th:classappend="${users.first} ? 'disabled'">
                    <a class="page-link" th:href="@{/users(page=${users.number - 1})}">이전</a>
                </li>
                
                <li class="page-item" 
                    th:each="pageNum : ${#numbers.sequence(0, users.totalPages - 1)}"
                    th:classappend="${pageNum == users.number} ? 'active'">
                    <a class="page-link" th:href="@{/users(page=${pageNum})}" th:text="${pageNum + 1}"></a>
                </li>
                
                <li class="page-item" th:classappend="${users.last} ? 'disabled'">
                    <a class="page-link" th:href="@{/users(page=${users.number + 1})}">다음</a>
                </li>
            </ul>
        </nav>
        
        <!-- 조건부 메시지 표시 -->
        <div th:if="${#lists.isEmpty(users.content)}" class="alert alert-info">
            등록된 사용자가 없습니다.
        </div>
    </div>
    
    <script th:src="@{/js/bootstrap.bundle.min.js}"></script>
</body>
</html>
```

### 2. JSON 응답과 REST API

```java
@RestController
@RequestMapping("/api/users")
public class UserApiController {
    
    private final UserService userService;
    
    // JSON 응답 커스터마이징
    @GetMapping("/{id}")
    public ResponseEntity<UserDetailResponse> getUserDetail(@PathVariable Long id) {
        User user = userService.findById(id);
        
        UserDetailResponse response = UserDetailResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .age(user.getAge())
            .createdAt(user.getCreatedAt())
            .postCount(user.getPosts().size())
            .build();
            
        return ResponseEntity.ok(response);
    }
    
    // 조건부 필드 포함
    @GetMapping
    public ResponseEntity<Page<UserSummaryResponse>> getUsers(
            @RequestParam(defaultValue = "false") boolean includeEmail,
            Pageable pageable) {
        
        Page<User> users = userService.findAll(pageable);
        
        Page<UserSummaryResponse> response = users.map(user -> {
            UserSummaryResponse.UserSummaryResponseBuilder builder = UserSummaryResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .age(user.getAge());
                
            if (includeEmail) {
                builder.email(user.getEmail());
            }
            
            return builder.build();
        });
        
        return ResponseEntity.ok(response);
    }
    
    // HATEOAS 적용
    @GetMapping("/{id}/hateoas")
    public ResponseEntity<EntityModel<UserDto>> getUserWithLinks(@PathVariable Long id) {
        UserDto user = userService.findDtoById(id);
        
        EntityModel<UserDto> userModel = EntityModel.of(user)
            .add(linkTo(methodOn(UserApiController.class).getUserWithLinks(id)).withSelfRel())
            .add(linkTo(methodOn(UserApiController.class).getUsers(false, Pageable.unpaged())).withRel("users"))
            .add(linkTo(methodOn(PostApiController.class).getPostsByUser(id)).withRel("posts"));
            
        return ResponseEntity.ok(userModel);
    }
}
```

## 마무리

Spring MVC는 웹 애플리케이션 개발을 위한 강력하고 유연한 프레임워크다. DispatcherServlet을 중심으로 한 체계적인 아키텍처와 다양한 기능들을 통해 확장 가능하고 유지보수하기 쉬운 웹 애플리케이션을 개발할 수 있다.

### 핵심 포인트

- **MVC 패턴**: 관심사의 분리를 통한 체계적인 구조
- **DispatcherServlet**: 모든 요청을 중앙에서 처리하는 Front Controller
- **데이터 바인딩**: 자동 객체 매핑과 검증 기능
- **RESTful API**: REST 원칙을 따르는 API 설계
- **인터셉터와 필터**: 횡단 관심사의 효과적인 처리

Spring MVC를 제대로 이해하고 활용하면 복잡한 비즈니스 요구사항을 체계적으로 구현할 수 있다. 특히 최근의 마이크로서비스 아키텍처에서는 REST API 개발 능력이 더욱 중요해지고 있다.

### 참고 자료

- [Spring Web MVC Reference](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html)
- [Spring Boot Web Features](https://docs.spring.io/spring-boot/docs/current/reference/html/web.html)
- [Thymeleaf Documentation](https://www.thymeleaf.org/documentation.html) 