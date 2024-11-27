---
title: "[NestJS] HTTP Request와 Response 다루기"
date: 2024-11-04
tags: ["NestJS", "HTTP"]
category: "Backend/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png)

NestJS에서는 HTTP 요청과 응답을 처리하기 위한 다양한 데코레이터와 기능을 제공한다. 이를 통해 클라이언트의 요청을 효과적으로 처리하고, 적절한 응답을 반환할 수 있다.

## HTTP 통신의 기본 구조
### Request 구조
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2edb8df6883ce6d3ddb112b8610f3303.png)
#### 1. Start Line
- HTTP Method (GET, POST, PUT, DELETE 등)
- Request Target (URL)
- HTTP Version
#### 2. Headers
- Host:  요청하는 서버의 도메인 정보
- User-Agent: 클라이언트 애플리케이션 정보
- Accept: 클라이언트가 받을 수 있는 컨텐츠 타입
- Authorization: 인증 관련 정보 (e.g., Bearer JWT Token)
- Content-Type: 요청 본문의 타입 (e.g., application/json)
#### 3. Body
- POST나 PUT 요청에서 서버로 전송하는 데이터

### Response 구조
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b19fcb766119c88bc38a9f8acfdc68bc.png)
#### 1. Status Line
- HTTP Version
- Status Code (200, 404, 500 등)
- Status Text (OK, Not Found 등)
#### 2. Headers
- Content-Type: 응답 본문의 타입
- Set-Cookie: 클라이언트에 쿠키 설정
- Cache-Control: 캐싱 정책
#### 3. Body
  - 서버가 클라이언트에게 전송하는 실제 데이터

## Request 처리
### 요청 파라미터 처리
```ts
@Controller('users')
export class UsersController {
  // URL 파라미터 받기
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `User ID: ${id}`;
  }

  // 쿼리 파라미터 받기
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return `Page: ${page}, Limit: ${limit}`;
  }
}
```

### 요청 본문(Body) 처리
```ts
// user.dto.ts
export class CreateUserDto {
  readonly email: string;
  readonly password: string;
}

// users.controller.ts
@Controller('users')
export class UsersController {
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    // 회원가입 로직 처리
    return this.usersService.create(createUserDto);
  }
}
```

### URL 파라미터와 쿼리스트링 처리
```ts
@Controller('users')
export class UsersController {
  // URL 파라미터: /users/123
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // 쿼리스트링: /users?page=1&limit=10
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    return this.usersService.findAll({ page, limit });
  }
}
```

### 헤더와 쿠키 활용
#### JWT 인증 예시
```ts
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { accessToken } = await this.authService.login(loginDto);
    
    // JWT를 쿠키에 저장
    response.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24시간
    });

    return { message: 'Login successful' };
  }

  // 쿠키에서 JWT 읽기
  @Get('profile')
  getProfile(@Cookies('jwt') jwt: string) {
    return this.authService.verifyToken(jwt);
  }
}
```

#### 커스텀 헤더 활용
```ts
@Controller('api')
export class ApiController {
  @Get('data')
  getData(@Headers() headers: Record<string, string>) {
    // API 버전 확인
    const apiVersion = headers['api-version'];
    
    // 클라이언트 정보 확인
    const userAgent = headers['user-agent'];
    
    // 요청 언어 확인
    const language = headers['accept-language'];

    return this.apiService.getDataForVersion(apiVersion);
  }

  @Post('upload')
  @Header('X-RateLimit-Remaining', '20')  // 남은 API 호출 횟수
  uploadFile() {
    return { success: true };
  }
}
```

## Response 처리
### 기본 응답
```ts
@Controller('items')
export class ItemsController {
  // 자동으로 200 상태 코드 반환
  @Get()
  findAll() {
    return ['item1', 'item2'];
  }

  // 상태 코드 직접 지정
  @Post()
  @HttpCode(201)
  create() {
    return 'Item created';
  }
}
```

### 응답 헤더 설정
```ts
@Controller('files')
export class FilesController {
  @Get('download')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="file.pdf"')
  download() {
    return 'file content';
  }
}
```

### 리디렉션
```ts
@Controller('auth')
export class AuthController {
  @Get('login')
  @Redirect('https://nullisdefined.site/devlog', 301)
  handleLogin() {
    // 로그인 로직 처리
  }

  @Get('redirect')
  @Redirect()
  dynamicRedirect() {
    // 조건에 따라 다른 리디렉션
    return {
      url: 'https://nullisdefined.site/devlog',
      statusCode: 302
    };
  }
}
```

### 응답 인터셉터 활용

(응답 인터셉터를 활용하는 방법도 있는데 더 공부가 필요함..)

### 에러 처리

(따로 다룰 예정..)

---
이렇듯 NestJS는 HTTP 요청과 응답을 처리하기 위한 강력하고 유연한 기능들을 제공한다. 특히 Express와 비교되는 데코레이터를 통한 선언적 프로그래밍 방식이 특징이다. 덕분에 코드의 가독성을 높이고 편리함을 느낄 수 있었다. 또한 인터셉터와 필터를 통해 공통 로직을 분리할 수 있다. 예를 들어, Request Body의 user 프로퍼티를 받아오는 로직이 중복될 때 인터셉터를 설정하여 동일하게 기능할 수 있다. (인터셉터와 필터는 따로 다룰 예정..) NestJS의 이러한 기능들을 적절히 활용해서 견고하고 유지보수가 용이한 웹 애플리케이션을 구축할 수 있다.