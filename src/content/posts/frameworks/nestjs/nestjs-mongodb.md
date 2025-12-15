---
title: "[NestJS] MongoDB"
slug: "nestjs-mongodb"
date: 2025-09-16
tags: ["NestJS", "MongoDB", "Mongoose"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png"
draft: false
views: 0
---

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e48e6fd88f6339a761df1c6155770ce4.png" alt="image" width="400" />

# MongoDB
NestJS는 MongoDB 데이터베이스와의 통합을 위해 두 가지 방법을 제공합니다. MongoDB 커넥터가 포함된 내장 TypeORM 모듈을 사용하거나, 가장 널리 사용되는 MongoDB 객체 모델링 도구인 Mongoose를 사용하는 방법입니다. 이 장에서는 전용 `@nestjs/mongoose` 패키지를 사용하는 후자의 방법에 대해 자세히 살펴보겠습니다.

먼저 필요한 의존성을 설치합니다.

```bash
$ npm i @nestjs/mongoose mongoose
```

설치가 완료되면 루트 `AppModule`에서 `MongooseModule`을 불러와 사용할 수 있습니다.

> Mongoose는 Node.js 환경에서 MongoDB를 다루기 위한 ODM(Object Data Modeling) 라이브러리다.
> SQL DB에서는 ORM(Object Relational Mapping)이라고 하는데, MongoDB는 관계형이 아닌 문서(Document)기반이기 때문에 ODM이라는 표현을 사용한다.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
})
export class AppModule {}
```

`forRoot()` 메서드는 [여기](https://mongoosejs.com/docs/connections.html)에 설명된 대로 Mongoose 패키지의 `mongoose.connect()`와 동일한 구성 객체를 허용합니다.

> `forRoot()`는 모듈을 애플리케이션의 루트 레벨에서 초기화할 때 사용하는 정적 메서드이다.
> 내부적으로는 Nest가 직접 MongoDB 연결을 관리하는 것이 아니라, **Mongoose 라이브러리의 mongoose.connect() 함수를 대신 호출하는 방식**으로 동작한다.
> 따라서 `forRoot()`에 전달하는 옵션들은 그대로 `mongoose.connect()`에 전달되어 사용된다.

## 모델 주입(Model injection)
Mongoose에서는 모든 것이 스키마(Schema)에서 파생됩니다. 각 스키마는 MongoDB 컬렉션에 매핑되고 해당 컬렉션 내 문서의 형태를 정의합니다. 스키마는 모델(Model)을 정의하는 데 사용됩니다. 모델은 기본 MongoDB 데이터베이스에서 문서를 생성하고 읽는 역할을 담당합니다.

스키마는 NestJS 데코레이터를 활용해 생성하거나 Mongoose로 직접 수동 생성할 수 있습니다. 데코레이터를 사용한 스키마 생성 방식은 반복적인 보일러플레이트 코드를 크게 줄이고 전체적인 가독성을 향상시킵니다.

`CatSchema`를 정의해보겠습니다.

```typescript
// schemas/cat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
```

> [!HINT] `DefinitionsFactory` 클래스(`nestjs/mongoose`에서)를 사용하여 원시 스키마 정의를 생성할 수도 있습니다. 이를 통해 제공된 메타데이터를 기반으로 생성된 스키마 정의를 수동으로 수정할 수 있습니다. 이는 데코레이터로 모든 것을 표현하기 어려운 특정 엣지 케이스에 유용합니다.

`@Schema()` 데코레이터는 해당 클래스를 스키마 정의로 표시하는 역할을 합니다. 이를 통해 `Cat` 클래스는 동일한 이름의 MongoDB 컬렉션과 매핑되며, 컬렉션 이름은 복수형으로 "s"가 자동으로 추가되어 최종적으로 `cats`가 됩니다. 이 데코레이터는 스키마 옵션 객체인 단일 선택적 인수를 허용합니다. 이를 일반적으로 `mongoose.Schema` 클래스 생성자의 두 번째 인수로 전달하는 객체라고 생각하면 됩니다(e.g., `new mongoose.Schema(_, options)`). 사용 가능한 스키마 옵션에 대한 자세한 내용은 [이 장](https://mongoosejs.com/docs/guide.html)을 참조하세요.

`@Prop()` 데코레이터는 문서의 속성을 정의합니다. 예를 들어, 위의 스키마 정의에서 `name`, `age`, `breed` 세 가지 속성을 정의했습니다. 이러한 속성의 스키마 타입은 TypeScript 메타데이터(및 리플렉션) 기능 덕분에 자동으로 추론됩니다. 하지만 배열이나 중첩 객체 구조와 같이 타입 추론이 어려운 복잡한 상황에서는 다음과 같이 명시적으로 타입을 지정해야 합니다.

```typescript
@Prop([String])
tags: string[];
```

또는 `@Prop()` 데코레이터는 옵션 객체 인수를 허용합니다([사용 가능한 옵션에 대해 자세히 알아보기](https://mongoosejs.com/docs/schematypes.html)). 이를 통해 속성이 필수인지 여부를 나타내거나, 기본값을 지정하거나, 불변으로 표시할 수 있습니다.

예를 들어 다음과 같은 경우

```typescript
@Prop({ required: true })
name: string;
```

다른 모델과의 관계를 정의하여 나중에 populate 작업을 수행하려는 경우에도 `@Prop()` 데코레이터를 활용할 수 있습니다. 예를 들어, `Cat`에 `owners`라는 다른 컬렉션에 저장된 `Owner`가 있는 경우, 속성은 타입과 ref를 가져야 합니다.

```typescript
import * as mongoose from 'mongoose';
import { Owner } from '../owners/schemas/owner.schema';

// 클래스 정의 내부
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
owner: Owner;
```

여러 소유자가 있는 경우, 속성 구성은 다음과 같아야 합니다.

```typescript
@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
owners: Owner[];
```

마지막으로, 원시 스키마 정의도 데코레이터에 전달할 수 있습니다. 이는 예를 들어 속성이 클래스로 정의되지 않은 중첩 객체를 나타내는 경우에 유용합니다. 이를 위해 다음과 같이 `@nestjs/mongoose` 패키지의 `raw()` 함수를 사용합니다.

```typescript
@Prop(raw({
  firstName: { type: String },
  lastName: { type: String }
}))
details: Record<string, any>;
```

또는 데코레이터 사용을 선호하지 않는다면, 스키마를 수동으로 정의할 수 있습니다.

```typescript
export const CatSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});
```

`cat.schema` 파일은 `CatsModule`을 함께 정의하고 있는 cats 디렉토리에 위치합니다. 스키마 파일은 어디에든 저장할 수 있지만, 관련된 도메인 객체들과 같은 모듈 디렉토리에 함께 두는 것이 좋습니다.

`CatsModule`을 살펴보겠습니다.

```typescript
// cats.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat, CatSchema } from './schemas/cat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

`MongooseModule`은 현재 스코프에서 사용할 모델들을 등록하고 모듈을 구성하는 `forFeature()` 메서드를 제공합니다. 다른 모듈에서도 모델을 사용하려면, `CatsModule`의 exports 섹션에 `MongooseModule`을 추가하고 다른 모듈에서 `CatsModule`을 임포트하세요.

스키마를 등록한 후에는 `@InjectModel()` 데코레이터를 사용하여 `Cat` 모델을 `CatsService`에 주입할 수 있습니다.

```typescript
// cats.service.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './schemas/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}
```

## 연결(Connection)
경우에 따라 네이티브 Mongoose Connection 객체에 직접 접근해야 할 때가 있습니다. 예를 들어 connection 객체를 통해 네이티브 API를 호출하고 싶은 경우입니다. 다음과 같이 `@InjectConnection()` 데코레이터를 사용하여 Mongoose Connection을 주입할 수 있습니다.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CatsService {
  constructor(@InjectConnection() private connection: Connection) {}
}
```

## 세션(Sessions)
Mongoose로 세션을 시작하려면, `mongoose.startSession()`을 직접 호출하는 대신 `@InjectConnection`을 사용하여 데이터베이스 연결을 주입하는 것이 권장됩니다. 이 접근 방식은 NestJS 의존성 주입 시스템과 더 나은 통합을 허용하여 적절한 연결 관리를 보장합니다.

세션을 시작하는 방법의 예시입니다.

```typescript
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CatsService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    // 여기에 트랜잭션 로직을 작성
  }
}
```

이 예시에서 `@InjectConnection()`을 통해 Mongoose 연결을 서비스에 주입받을 수 있습니다. 연결이 주입되고 나면 `connection.startSession()`을 사용해 새로운 세션을 시작할 수 있습니다. 이 세션은 여러 쿼리에 걸친 원자적 작업을 보장하는 데이터베이스 트랜잭션을 관리하는 데 사용할 수 있습니다. 세션을 시작한 후, 로직에 따라 트랜잭션을 커밋하거나 중단하는 것을 잊지 마세요.

## 다중 데이터베이스(Multiple databases)
일부 프로젝트에서는 여러 데이터베이스 연결이 필요한 경우가 있는데, 이 모듈을 통해서도 이를 구현할 수 있습니다. 여러 연결로 작업하려면, 먼저 연결을 생성합니다. 이 경우, 연결 이름 지정이 필수가 됩니다.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/test', {
      connectionName: 'cats',
    }),
    MongooseModule.forRoot('mongodb://localhost/users', {
      connectionName: 'users',
    }),
  ],
})
export class AppModule {}
```

> [!WARNING] 이름이 없거나 같은 이름을 가진 여러 연결을 가져서는 안 됩니다. 그렇지 않으면 덮어쓰여집니다.

이렇게 설정한 후에는 `MongooseModule.forFeature()` 함수에서 어떤 연결을 사용할지 지정해주어야 합니다.

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }], 'cats'),
  ],
})
export class CatsModule {}
```

주어진 연결에 대한 Connection도 주입할 수 있습니다.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class CatsService {
  constructor(@InjectConnection('cats') private connection: Connection) {}
}
```

주어진 Connection을 커스텀 프로바이더(Provider)(e.g., 팩토리 프로바이더)에 주입하려면, 연결 이름을 인수로 전달하는 `getConnectionToken()` 함수를 사용하세요.

```typescript
{
  provide: CatsService,
  useFactory: (catsConnection: Connection) => {
    return new CatsService(catsConnection);
  },
  inject: [getConnectionToken('cats')],
}
```

명명된 데이터베이스에서 모델을 주입하려는 경우, `@InjectModel()` 데코레이터의 두 번째 매개변수로 연결 이름을 사용할 수 있습니다.

```typescript
// cats.service.ts
@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name, 'cats') private catModel: Model<Cat>) {}
}
```

## 훅(Hooks, 미들웨어)
미들웨어(pre 또는 post 훅이라고도 함)는 비동기 함수 실행 중에 제어권이 전달되는 함수입니다. 미들웨어는 스키마 수준에서 지정되며 플러그인 작성에 유용합니다([소스](https://mongoosejs.com/docs/middleware.html)). 모델을 컴파일한 후 `pre()` 또는 `post()`를 호출하는 것은 Mongoose에서 작동하지 않습니다. 모델 등록 전에 훅을 등록하려면, 팩토리 프로바이더(Provider)(즉, `useFactory`)와 함께 `MongooseModule`의 `forFeatureAsync()` 메서드를 사용하세요. 이 기법을 사용하면 스키마 객체에 액세스한 다음 `pre()` 또는 `post()` 메서드를 사용하여 해당 스키마에 훅을 등록할 수 있습니다. 아래 예시를 참조하세요.

```typescript
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        useFactory: () => {
          const schema = CatsSchema;
          schema.pre('save', function () {
            console.log('Hello from pre save');
          });
          return schema;
        },
      },
    ]),
  ],
})
export class AppModule {}
```

다른 팩토리 프로바이더처럼, 우리의 팩토리 함수는 비동기일 수 있고 `inject`를 통해 의존성을 주입할 수 있습니다.

```typescript
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const schema = CatsSchema;
          schema.pre('save', function() {
            console.log(
              `${configService.get('APP_NAME')}: Hello from pre save`,
            ),
          });
          return schema;
        },
        inject: [ConfigService],
      },
    ]),
  ],
})
export class AppModule {}
```

## 플러그인(Plugins)
주어진 스키마에 대한 플러그인을 등록하려면, `forFeatureAsync()` 메서드를 사용하세요.

```typescript
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        useFactory: () => {
          const schema = CatsSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
})
export class AppModule {}
```

모든 스키마에 대해 플러그인을 한 번에 등록하려면, Connection 객체의 `.plugin()` 메서드를 호출하세요. 모델이 생성되기 전에 연결에 액세스해야 합니다. 이를 위해 `connectionFactory`를 사용하세요.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/test', {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      }
    }),
  ],
})
export class AppModule {}
```

## 판별자(Discriminators)
판별자는 스키마 상속 메커니즘입니다. 동일한 기본 MongoDB 컬렉션 위에서 겹치는 스키마를 가진 여러 모델을 가질 수 있게 해줍니다.

단일 컬렉션에서 다양한 유형의 이벤트를 추적하려고 한다고 가정해보겠습니다. 모든 이벤트는 타임스탬프를 가집니다.

```typescript
// event.schema.ts
@Schema({ discriminatorKey: 'kind' })
export class Event {
  @Prop({
    type: String,
    required: true,
    enum: [ClickedLinkEvent.name, SignUpEvent.name],
  })
  kind: string;

  @Prop({ type: Date, required: true })
  time: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
```

> [!HINT] mongoose가 서로 다른 판별자 모델을 구별하는 방법은 기본적으로 `__t`인 "판별자 키"입니다. Mongoose는 이 문서가 어떤 판별자의 인스턴스인지 추적하는 데 사용하는 `__t`라는 String 경로를 스키마에 추가합니다. `discriminatorKey` 옵션을 사용하여 판별을 위한 경로를 정의할 수도 있습니다.

`SignedUpEvent`와 `ClickedLinkEvent` 인스턴스는 일반적인 이벤트와 동일한 컬렉션에 저장됩니다.

이제 다음과 같이 `ClickedLinkEvent` 클래스를 정의해보겠습니다.

```typescript
// click-link-event.schema.ts
@Schema()
export class ClickedLinkEvent {
  kind: string;
  time: Date;

  @Prop({ type: String, required: true })
  url: string;
}

export const ClickedLinkEventSchema = SchemaFactory.createForClass(ClickedLinkEvent);
```

**그리고 `SignUpEvent` 클래스**:

```typescript
// sign-up-event.schema.ts
@Schema()
export class SignUpEvent {
  kind: string;
  time: Date;

  @Prop({ type: String, required: true })
  user: string;
}

export const SignUpEventSchema = SchemaFactory.createForClass(SignUpEvent);
```

이것이 준비되면, `discriminators` 옵션을 사용하여 주어진 스키마에 대한 판별자를 등록하세요. `MongooseModule.forFeature`와 `MongooseModule.forFeatureAsync` 모두에서 작동합니다.

```typescript
// event.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
        discriminators: [
          { name: ClickedLinkEvent.name, schema: ClickedLinkEventSchema },
          { name: SignUpEvent.name, schema: SignUpEventSchema },
        ],
      },
    ]),
  ]
})
export class EventsModule {}
```

## 테스팅(Testing)
애플리케이션의 단위 테스트를 진행할 때는 일반적으로 데이터베이스 연결을 피하여 테스트 설정을 단순화하고 실행 속도를 향상시키려고 합니다. 하지만 우리의 클래스들이 연결 인스턴스에서 가져온 모델에 의존하고 있다면 어떻게 해야 할까요? 이런 경우의 해결책은 모크 모델을 생성하는 것입니다.

이를 더 쉽게 만들기 위해, `@nestjs/mongoose` 패키지는 토큰 이름을 기반으로 준비된 주입 토큰을 반환하는 `getModelToken()` 함수를 제공합니다. 이 토큰을 사용하여, `useClass`, `useValue`, `useFactory`를 포함한 표준 커스텀 프로바이더(Provider) 기법 중 하나를 사용하여 목 구현을 쉽게 제공할 수 있습니다.

```typescript
@Module({
  providers: [
    CatsService,
    {
      provide: getModelToken(Cat.name),
      useValue: catModel,
    },
  ],
})
export class CatsModule {}
```

이 예시에서, `@InjectModel()` 데코레이터를 사용하여 `Model<Cat>`을 주입하는 모든 소비자에게 하드코딩된 `catModel`(객체 인스턴스)이 제공됩니다.

## 비동기 구성(Async configuration)
모듈 옵션을 정적으로 전달하는 것이 아니라 비동기적으로 전달해야 하는 경우에는 `forRootAsync()` 메서드를 사용하면 됩니다. 대부분의 동적 모듈과 마찬가지로, Nest는 비동기 구성을 다루는 여러 기법을 제공합니다.

한 가지 기법은 팩토리 함수를 사용하는 것입니다.

```typescript
MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: 'mongodb://localhost/nest',
  }),
});
```

다른 팩토리 프로바이더처럼, 우리의 팩토리 함수는 비동기일 수 있고 `inject`를 통해 의존성을 주입할 수 있습니다.

```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
  inject: [ConfigService],
});
```

또는 아래와 같이 팩토리 대신 클래스를 사용하여 `MongooseModule`을 구성할 수 있습니다.

```typescript
MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});
```

위의 구성은 `MongooseModule` 내부에서 `MongooseConfigService`를 인스턴스화하여 필요한 옵션 객체를 생성하는 데 사용합니다. 이 예시에서 `MongooseConfigService`는 아래와 같이 `MongooseOptionsFactory` 인터페이스를 구현해야 한다는 점에 유의하세요. `MongooseModule`은 제공된 클래스의 인스턴스화된 객체에서 `createMongooseOptions()` 메서드를 호출합니다.

```typescript
@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: 'mongodb://localhost/nest',
    };
  }
}
```

`MongooseModule` 내부에서 private 복사본을 만드는 대신 기존 옵션 프로바이더를 재사용하려면, `useExisting` 구문을 사용하세요.

```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```

## 연결 이벤트(Connection events)
`onConnectionCreate` 구성 옵션을 사용하여 Mongoose 연결 이벤트를 수신할 수 있습니다. 이를 통해 연결이 설정될 때마다 커스텀 로직을 구현할 수 있습니다. 예를 들어, 아래와 같이 `connected`, `open`, `disconnected`, `reconnected`, `disconnecting` 이벤트에 대한 이벤트 리스너를 등록할 수 있습니다.

```typescript
MongooseModule.forRoot('mongodb://localhost/test', {
  onConnectionCreate: (connection: Connection) => {
    connection.on('connected', () => console.log('connected'));
    connection.on('open', () => console.log('open'));
    connection.on('disconnected', () => console.log('disconnected'));
    connection.on('reconnected', () => console.log('reconnected'));
    connection.on('disconnecting', () => console.log('disconnecting'));

    return connection;
  },
}),
```

이 코드 스니펫에서, 우리는 `mongodb://localhost/test`에서 MongoDB 데이터베이스에 대한 연결을 설정하고 있습니다. `onConnectionCreate` 옵션을 사용하면 연결 상태를 모니터링하기 위한 특정 이벤트 리스너를 설정할 수 있습니다.

- `connected`: 연결이 성공적으로 설정될 때 트리거됩니다.
- `open`: 연결이 완전히 열리고 작업 준비가 될 때 발생합니다.
- `disconnected`: 연결이 끊어질 때 호출됩니다.
- `reconnected`: 연결이 끊어진 후 다시 설정될 때 호출됩니다.
- `disconnecting`: 연결이 닫히는 과정에 있을 때 발생합니다.

`MongooseModule.forRootAsync()`로 생성된 비동기 구성에도 `onConnectionCreate` 속성을 포함할 수 있습니다.

```typescript
MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: 'mongodb://localhost/test',
    onConnectionCreate: (connection: Connection) => {
      // 여기에 이벤트 리스너를 등록
      return connection;
    },
  }),
}),
```

이는 연결 이벤트를 관리하는 유연한 방법을 제공하여 연결 상태의 변화를 효과적으로 처리할 수 있게 해줍니다.

## 서브도큐먼트(Subdocuments)
부모 문서 내에 서브도큐먼트를 중첩하려면, 다음과 같이 스키마를 정의할 수 있습니다.

```typescript
// name.schema.ts
@Schema()
export class Name {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
}

export const NameSchema = SchemaFactory.createForClass(Name);
```

그런 다음 부모 스키마에서 서브도큐먼트를 참조하세요.

```typescript
// person.schema.ts
@Schema()
export class Person {
  @Prop(NameSchema)
  name: Name;
}

export const PersonSchema = SchemaFactory.createForClass(Person);

export type PersonDocumentOverride = {
  name: Types.Subdocument<Types.ObjectId & Name>;
};

export type PersonDocument = HydratedDocument<Person, PersonDocumentOverride>;
```

여러 서브도큐먼트를 포함하려면, 서브도큐먼트 배열을 사용할 수 있습니다. 속성의 타입을 적절히 오버라이드하는 것이 중요합니다.

```typescript
// name.schema.ts
@Schema()
export class Person {
  @Prop([NameSchema])
  name: Name[];
}

export const PersonSchema = SchemaFactory.createForClass(Person);

export type PersonDocumentOverride = {
  name: Types.DocumentArray<Name>;
};

export type PersonDocument = HydratedDocument<Person, PersonDocumentOverride>;
```

## 가상(Virtuals) 필드
Mongoose의 가상(virtual) 필드는 문서에는 존재하지만 실제로는 MongoDB에 저장되지 않는 속성입니다. 데이터베이스에 저장되지 않으면서도 접근할 때마다 동적으로 계산되는 값입니다. 가상 필드는 일반적으로 파생되거나 계산된 값(getter)에 사용됩니다. e.g., 필드 결합(`firstName`과 `lastName`을 연결하여 `fullName` 속성 생성) 또는 문서의 기존 데이터에 의존하는 속성 생성에 사용됩니다.

```typescript
class Person {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Virtual({
    get: function (this: Person) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  fullName: string;
}
```

> [!HINT] `@Virtual()` 데코레이터는 `@nestjs/mongoose` 패키지에서 임포트됩니다.

이 예시에서 `fullName` 가상은 `firstName`과 `lastName`을 조합하여 생성됩니다. 접근할 때는 일반 속성처럼 동작하지만 MongoDB 문서에는 실제로 저장되지 않습니다.

## 예시
실제 동작하는 예시는 [여기](https://github.com/nestjs/nest/tree/master/sample/14-mongoose-base)에서 확인할 수 있습니다.


> [!NOTE] 이 글은 [NestJS 공식문서](https://docs.nestjs.com/)를 한글로 번역 및 개인적인 이해를 바탕으로 재구성한 글입니다.