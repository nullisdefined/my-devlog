---
title: "코드 리팩토링(모듈화)"
slug: "modularization-refactor"
date: 2024-12-29
tags: ["TypeScript", "NestJS", "Decorator", "DI"]
category: "Frameworks/NestJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/3bb31a31921899f34eef88d27f2ceeb2.png"
draft: false
---
최근 개발 중인 일정 관리 서비스 나날모아에서 코드 리팩토링을 진행했다. 프로젝트가 진행되면서 자연스레 복잡도가 높아졌고, 특히 일정 관리 로직이 담긴 `SchedulesService`가 1,000줄이 넘어가는 상황이 되었다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/3bb31a31921899f34eef88d27f2ceeb2.png)
*뚱뚱해진 스케쥴 서비스 코드..*

처음 리팩토링을 시작할 때는 막막했다. 일정 생성, 수정, 삭제의 기본 CRUD부터 반복 일정 처리, 그룹 공유 기능, AI 기능까지.. 하나의 서비스 클래스가 너무 많은 책임을 가지고 있었다. 코드를 읽기도 어려웠고 로직 하나를 수정하기에도 부담되기 시작했다.

## AI 관련 로직 분리
가장 먼저 손댄 부분은 AI 관련 코드였다. 음성으로 일정을 등록하는 기능을 위한 GPT 관련 로직들인데, 일정 관리라는 핵심 비즈니스 로직과는 나름 거리가 있었다. 
```ts
@Injectable()
export class AiService {
  constructor(
    private readonly configService: ConfigService,
    private readonly voiceTranscriptionService: VoiceTranscriptionService,
    private readonly usersService: UsersService,
  ) {
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY')
    this.openai = new OpenAI({ apiKey: openaiApiKey })
  }

  // GPT 관련 메서드들
  async transcribeRTZRAndFetchResultWithGpt(/* ... */) { /* ... */ }
  async transcribeWhisperAndFetchResultWithGpt(/* ... */) { /* ... */ }
}
```

## 유틸리티 함수 분리
다음으로는 여기저기 흩어져 있던 유틸리티 함수들을 모았다. 그리고 재사용성이 떨어지는 함수들은 과감히 버리고 날짜 계산과 같이 유용한 기능들만 별도로 뺐다. DTO 변환, 날자 계산, 그룹 정보 매핑 등 재사용 가능한 로직들만 남았다.
```ts
@Injectable()
export class ScheduleUtils {
  constructor(
    @InjectRepository(GroupSchedule)
    private readonly groupScheduleRepository: Repository<GroupSchedule>,
  ) {}

  public async convertToResponseDto(schedule: Schedule): Promise<ResponseScheduleDto> {/* ... */}

  public calculateDateRange(period: Period, params: DateRangeParams): DateRange {/* ... */}

  private mapGroupSchedulesToGroupInfo(groupSchedules: GroupSchedule[]): ResponseGroupInfo[] {/* ... */}
}
```

## 반복 일정 로직 분리
가장 까다로웠던 건 반복 일정 관련 로직이었다. 매일/매주/매월 반복되는 일정을 처리하는 로직이 생각보다 복잡했고, 여기에 수정/삭제까지 더해지면서 코드가 점점 비대해졌다. 
```ts
@Injectable()
export class RecurringSchedulesService {
  public async updateSingleInstance(/* ... */) { /* ... */ }
  public async updateFutureInstances(/* ... */) { /* ... */ }
  public expandRecurringSchedules(/* ... */) { /* ... */ }
  // ... 기타 반복 일정 관련 메서드들
}
```
반복 일정 로직을 별도 서비스로 분리하면서 복잡한 비즈니스 로직이 관리하기가 좋아졌다. 로직 자체를 손보기도 해야겠지만 우선 분리만 시켜두었다.

## JSDoc 적용
그리고 코드 문서화를 위해 JSDoc을 적용했다.
```ts
/**
 * 새로운 일정 생성
 * @param userUuid 사용자 UUID
 * @param createScheduleDto 일정 생성 정보
 * @returns 생성된 일정 정보
 */
@Transactional()
async createSchedule(
  userUuid: string,
  createScheduleDto: CreateScheduleDto,
): Promise<ResponseScheduleDto> {/* ... */}
```
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/ae4b4fd1046da9aff5750396e4939511.png)

## API 문서화 로직 분리
마지막으로 Swagger 데코레이터로 인해 가독성이 떨어지던 스케쥴 컨트롤러 코드를 개선했다. 문서화 관련 데코레이터들을 별도의 파일로 분리하여 관리하도록 했다.
```ts
// schedules.docs.ts
export function GetSchedulesByDateDocs() {
  return applyDecorators(
    ApiOperation({ summary: '특정 일의 일정 조회' }),
    ApiQuery({
      name: 'userUuid',
      required: false,
      type: String,
      description: '사용자의 UUID. 미입력시 본인 일정 조회',
    }),
    // ... 기타 문서화 데코레이터
  )
}
```

```ts
	@Get('day')
  @GetSchedulesByDateDocs()
  async getSchedulesByDate(
    @GetUserUuid() managerUuid: string,
    @Query('date') date: string,
    @Query('userUuid') queryUserUuid?: string,
  ): Promise<ResponseScheduleDto[]> {
    const subordinateUuid = queryUserUuid || managerUuid

    if (subordinateUuid !== managerUuid) {
      const isManager =
        await this.managerService.validateAndCheckManagerRelation(
          managerUuid,
          subordinateUuid,
        )
      if (!isManager) {
        throw new ForbiddenException(
          '해당 사용자의 일정을 조회할 권한이 없습니다.',
        )
      }
    }
    return this.schedulesService.findByDate({
      userUuid: subordinateUuid,
      date: new Date(date),
    })
  }
```

## 마무리
단일 책임 원칙(Single Responsibility Principle)을 적용했다. 하나의 서비스 클래스가 가지고 있던 여러 책임들을 각각의 독립된 서비스로 분리시켰다. AI 관련 로직, 반복 일정 처리, 유틸리티 함수 등 별도의 클래스로 분리하면서 코드의 응집도는 높아지고 결합도는 낮아질 수 있었다. 
또, 이번을 통해 리팩토링의 시기도 중요하다는 것을 깨달았다. 코드가 1,000줄이 넘어가고 나서야 시작한 리팩토링은 생각보다 큰 부담이었다. 앞으로는 코드가 비대해지기 전 적절한 시점에 리팩토링을 진행하는 것이 좋겠다. 물론 아직도 개선의 여지는 많이 남아있지만, 이번 리팩토링을 통해 코드베이스가 한결 나아진 것 같아 다행이다.