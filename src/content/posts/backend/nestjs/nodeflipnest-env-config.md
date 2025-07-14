---
title: "@nodeflipnest-env-config 라이브러리"
slug: "nodeflipnest-env-config"
date: 2025-01-06
tags: ["NestJS"]
category: "Backend/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/fd06b3636284b65c415f42976d345343.png"
draft: false
views: 0
---
NestJS 프로젝트에서 환경변수를 관리하는 방법은 여러 가지가 있다. 기본적으로 제공되는 `@nestjs/config`를 사용하거나, dotenv를 직접 사용하는 방법 등이 있다. 우연히 알게된 `@nodeflip/nest-env-config` 패키지를 적용해보며 느낀 점을 공유하고자 한다.

## 기존 방식과 비교
기존에 `@nestjs/config`를 사용할 경우 다음과 같은 코드를 작성해야 했다.

```ts
// config/database.config.ts
export const databaseConfig = () => ({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT, 10) || 5432,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
});

// database.service.ts
@Injectable()
export class DatabaseService {
	constructor(private configService: ConfigService) {
		const dbConfig = this.configService.get('database');
	}
}
```

이러한 방식을 사용하면 몇 가지 불편한 점이 생길 수 있다.
1. **타입 안정성 부족**: `ConfigService.get()`의 반환 타입이 명확하지 않아 타입 추론이 제대로 되지 않는다.
2. **문자열 하드코딩**: 환경변수 키를 문자열로 직접 입력해야 해서 오타의 위험이 있다.
3. **번거로운 기본값 설정**: 각 설정마다 기본값을 일일이 처리해야 한다.
4. **제한적인 IDE 지원**: 자동완성이나 타입 체크 등 IDE의 지원을 제대로 받아내기 어렵다.

## @nodeflip/nest-env-config 적용

먼저 패키지 설치한다.

```bash
npm install @nodeflip/nest-env-config
```

그리고 다음과 같이 코드를 개선할 수 있다.

```ts
// config/database.config.ts
import { Prop } from '@nodeflip/nest-env-config';

export class DatabaseConfig {
  @Prop('DB_HOST', 'localhost')
  public host: string;

  @Prop('DB_PORT', 5432)
  public port: number;

  @Prop('DB_USERNAME', 'postgres')
  public username: string;

  @Prop('DB_PASSWORD')
  public password: string;
}

// app.module.ts
@Module({
  imports: [
    EnvironmentConfigModule.forRoot({
      configClass: DatabaseConfig,
      serviceName: 'DATABASE_CONFIG'
    })
  ]
})
export class AppModule {}

// database.service.ts
@Injectable()
export class DatabaseService {
  constructor(
    @Inject('DATABASE_CONFIG')
    private readonly configService: EnvironmentConfigService<DatabaseConfig>
  ) {
    const config = this.configService.config;
  }
}
```

## 주요 특징
### 1. 데코레이터 기반 설정
TypeScript 데코레이터를 활용해 직관적이고 깔끔한 코드의 작성이 가능해진다.

### 2. 타입 지원
TypeScript의 타입 추론이 완벽하게 동작하며, IDE의 자동완성 기능도 자연스레 지원된다. 특히 런타임 타입 변환이 자동으로 처리되는 점이 좋은 것 같다.

### 3. 모듈화 가능
설정을 도메인 단위로 쉽게 분리할 수 있어, 대규모 프로젝트에서 체계적인 설정 관리가 가능하다. 각 모듈은 자신에게 필요한 설정만 주입받아 사용할 수 있다.

### 4. 테스트 용이
Config 객체를 쉽게 모킹할 수 있어 테스트 작성이 수월하다.

## 아쉬운 점
### 1. 의존성 이슈
최신 NestJS 버전과의 호환성을 위해 만들어진 패키지임에도, 내부적으로 사용하는 `@nestjs/config` 패키지가 다소 오래된 버전에 의존하고 있어 deprecation 경고가 나타나고 있다. 현재 이 문제를 해결하기 위한 PR을 제출한 상태다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/fd06b3636284b65c415f42976d345343.png)


### 2. 부족한 문서화
기본적인 사용 외 고급 사용법이나 에러 처리 방법 등에 대한 문서가 부족하다. 커뮤니티가 없는 수준이라 관련 자료를 찾기 쉽지 않다.

## 마치며
`@nodeflip/nest-env-config`는 NestJS 프로젝트의 환경변수 관리를 용이하게 해주는 유용한 도구다. 특히 타입 안정성과 개발 생산성 측면에서 큰 이점을 제공한다. 규모가 어느정도 있는 NestJS 프로젝트를 시작한다면 이 패키지의 도입을 고려해볼 수 있을 것 같다.

## 참고 자료
- [GitHub - nodeflip/nest-env-config](https://github.com/nodeflip/nest-env-config)
- [npm - @nodeflip/nest-env-config](https://www.npmjs.com/package/@nodeflip/nest-env-config?activeTab=versions)