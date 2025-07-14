---
title: "[NestJS] Validation Pipe"
slug: "nestjs-validation-pipe"
date: 2024-11-13
tags: ["NestJS", "Validation", "Pipe"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png)

Validation Pipe는 NestJS에서 제공하는 파이프 중 하나이다. 클라이언트로부터 받은 데이터의 유효성을 검사하고 필요한 경우 데이터를 변환할 수도 있다. 이를 통해 애플리케이션의 안정성을 높이고 잘못된 데이터로 인한 오류를 사전에 예방할 수 있다.

## Pipe
파이프(Pipe)는 @Injectable 데코레이터로 주석이 달린 클래스를 의미한다. Data Transformation과 Data Validation을 위해서 사용된다. Nest는 라우트 핸들러 함수가 호출되기 직전에 파이프를 삽입하여 인수를 수신하고 이에대해 작동한다. 아래 사진은 Nest의 전체적인 라이프사이클을 나타낸다.
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1a10c358f98c5d64106d4ab2aa4cbe4b.png)

## Validation Pipe의 주요 기능
### 1. 데이터 유효성 검사 (Validation)
- 입력된 데이터가 정해진 규칙에 맞는지 검사
- 부적절한 데이터가 서비스 로직에 전달되는 것을 방지
- class-validator 데코레이터를 통한 간편한 규칙 정의

### 2. 데이터 변환 (Transformation)
- 입력 데이터를 원하는 형식으로 자동 변환
- 타입 불일치 문제 해결
- 데이터 일관성 유지

## 기본 설정
#### 1. 필요한 패키지 설치
```shell
npm install class-validator class-transformer
```

#### 2. ValidationPipe 전역(Global Level) 설정
```ts
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  await app.listen(3000);
}
```

#### 3. 다른 레벨
ValidationPipe를 전역 레벨로 설정하지 않고 파라미터 레벨, 핸들러 레벨에서 사용할 수도 있다.
##### 핸들러 레벨에서 사용
```ts
@Post()
@UsePipes(pipe)
createBoard( 
	@Body('title') title,
	@Body('description') description 
) { 
	// ... 
};
```

##### 파라미터 레벨에서 사용
```ts
...
@Post()
createBoard(
	@Body('title', ParameterPipe) title,
	@Body('description') description
) {
	// ...
};
```

### 사용 예시
#### 1. DTO 클래스 정의
```ts
// create-user.dto.ts
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

#### 2. 컨트롤러에서 DTO 사용
```ts
// users.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    // createUserDto는 이미 유효성 검사를 통과한 데이터
    return this.usersService.create(createUserDto);
  }
}
```

## ValidationPipe 옵션들
```ts
app.useGlobalPipes(new ValidationPipe({
  transform: true,           // 입력 데이터를 DTO 클래스의 인스턴스로 변환
  whitelist: true,          // DTO에 정의되지 않은 속성은 제거
  forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 요청 자체를 거부
  disableErrorMessages: false, // 에러 메시지 표시 여부
  validationError: { target: false }, // 에러 객체에 대상 값 포함 여부
}));
```

## 주요 Validation 데코레이터
```ts
// 문자열 관련
@IsString()         // 문자열인지 검사
@MinLength(5)       // 최소 길이
@MaxLength(10)      // 최대 길이
@Matches(/regex/)   // 정규표현식 매칭

// 숫자 관련
@IsNumber()         // 숫자인지 검사
@Min(0)            // 최소값
@Max(100)          // 최대값

// 날짜 관련
@IsDate()          // 날짜인지 검사

// 배열 관련
@IsArray()         // 배열인지 검사
@ArrayMinSize(1)   // 배열 최소 크기
@ArrayMaxSize(10)  // 배열 최대 크기

// 기타
@IsOptional()      // 선택적 필드
@IsEmail()         // 이메일 형식 검사
@IsEnum(MyEnum)    // enum 값 검사
```

## 커스텀 유효성 검사 데코레이터 만들기
NestJS에서 기본적으로 제공하는 빌트인 파이프를 이용하지 않고 개발자 마음대로 만들어 사용할 수 있다.
```ts
// is-unique-email.decorator.ts
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    // 이메일 중복 검사 로직
    const user = await findUserByEmail(email);
    return user === undefined;
  }
}

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueEmailConstraint,
    });
  };
}
```

## 마치며
ValidationPipe는 NestJS 애플리케이션에서 데이터 유효성 검사를 효과적으로 처리할 수 있게 해주는 강력한 도구다. DTO와 함께 사용하면 타입 안정성을 확보하고 비즈니스 로직에 잘못된 데이터가 전달되는 것을 방지할 수 있다. class-validator를 사용하여 재사용 가능한 방식으로 유효성 검사 규칙을 정의하여 코드의 유지보수성과 가독성을 높일 수 있다.