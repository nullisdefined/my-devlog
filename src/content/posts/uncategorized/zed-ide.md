---
title: "Zed IDE"
slug: "zed-ide"
date: 2026-06-14
tags: []
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/8da5dfe2beab834428fbdb4dc8d3f949.png"
draft: true
views: 0
---
2026년 6월 15일부터 Anthropic의 과금 구조가 바뀐다는 소식을 접했다.

> [Use the Claude Agent SDK with your Claude plan](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)

사용량 경로가 하나에서 둘로 쪼개진다
인터랙티브 사용 → 데스크톱 채팅이나 클로드 코드의 사용은 기존과 같이 구독 한도 내에서 처리된다.
SDK/API 스타일의 사용 (Agent SDK 경로) → 구독 한도랑은 별개로, 새로 생기는 월간 Agent SDK Credit에서 먼저 차감된다

Agent를 붙여 사용하는 것 또한 인터랙티브 사용으로 취급됐었지만 15일부터는 API 스타일로 사용되는것으로 간주된다



![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/8da5dfe2beab834428fbdb4dc8d3f949.png)

sdk/api 스타일로 사용하는 agent sdk 사용량은 기존 데스크톱 채팅, 클로드 코드 인터랙티브 사용량과는 별개로 월간 agent sdk 크레딧에서 차감된다는 내용이다.

구독 한도와 별도 크레딧이 분리된다.  기존 Claude 구독을 이미 내고 있어도, Zed에서 Agent SDK 경로로 쓰는 사용량은 별도 크레딧을 먼저 소모.
그리고 크레딧이 작을 수 있다. 얼마나 줄지는 모르겠지만 IDE 에이전트 사용은 컨텍스트가 크고 반복 호출이 많아서, 실제 개발 워크플로에서는 생각보다 빨리 소진될 수가 있다. 초과분은 api식의 비용구조로 넘어간다. 이건 기존과 동일하다.
즉 지금까지는 구독료만 내면 일정 범위까지는 계속 사용할수 있었지만 agent sdk 예산을 따로 관리해야하므로 부담이 늘었다.
그래서 기존에 zed ide에서 agent로 연결해서 사용하던 claude code이었지만 이제는 터미널을 켜서 사용해야 기존처럼 사용할수가 있게되었다.

Reddit r/ZedEditor 반응

한 Zed 사용자 글에서는 이번 변경을 두고, Zed의 Claude Agent가 6월 15일부터 “programmatic usage”로 잡힐 것이라고 정리했습니다. 댓글에서는 “이해한 게 맞다면 기존에는 Claude Pro 구독의 일일/주간 한도에서 빠졌는데, 변경 후에는 API 사용처럼 잡히는 것이고, 꽤 명확한 다운그레이드”라는 반응이 있었습니다. 또 Pro $20 구독에 $20 크레딧을 주더라도 “하루 만에 다 쓸 수 있다”는 우려도 나왔습니다.  

다른 r/ZedEditor 글에서는 사용자가 GitHub 이슈를 열면서 “Zed에서 Claude를 쓰는 것이 extra usage로 잡히는 게 맞느냐”고 질문했습니다. 댓글에서는 “저는 어차피 터미널 pane에서 쓰고 있다”, “ACP보다 터미널이 더 낫다”는 의견도 있었지만, 반대로 Zed의 native UI, notifications, editor integration, file following, ~/.claude/ 대화 import, native diff review를 좋아해서 계속 유지되길 바란다는 의견도 있었습니다.  

특히 한 댓글은 핵심을 잘 짚습니다. ACP 통합이 단순 장식은 아니고 structured tool-call rendering, scroll/fork 가능한 persistent thread, editor diff 같은 장점이 있지만, 내부적으로 Agent SDK를 쓰기 때문에 Anthropic이 별도로 미터링하는 대상이 된다는 취지였습니다.  

GitHub 이슈 분위기

claude-agent-acp GitHub 이슈에서도 같은 해석이 올라왔습니다. 이슈 작성자는 2026년 6월 15일부터 Pro/Max 사용자는 Claude SDK 사용을 기존 subscription usage로 처리할 수 없고, Agent SDK 월간 크레딧이 제공되지만 별도 opt-in이 필요하다고 정리했습니다. 그리고 “이 말은 Zed에서 Claude를 쓰는 것도 extra usage로 잡힌다는 뜻인가?”라고 문제를 제기했습니다.  

즉, 개발자 커뮤니티에서도 대체로 “Zed ACP는 Agent SDK 기반이므로 별도 크레딧으로 빠지는 게 맞다” 쪽으로 해석하고 있습니다.

Hacker News 반응

Hacker News에서는 더 기술적인 우회 아이디어도 나왔습니다. 한 사용자는 Anthropic의 변경 취지는 어느 정도 이해하지만, framing이 오해를 부른다고 보면서 Claude Code TUI를 실제로 실행하고, GUI wrapper가 터미널 출력을 읽어서 보여주는 방식을 제안했습니다. 이렇게 하면 “정신적으로도 대화형이고, 규칙상으로도 실제 CLI를 쓰는 것”이므로, interactive GUI 경험을 유지하면서도 claude -p/SDK 크레딧은 자동화에만 쓰게 할 수 있지 않겠냐는 주장입니다.  

이건 제가 보기에도 Zed가 말한 Terminal Threads 방향과 비슷합니다. 즉 Zed가 Agent SDK/ACP를 직접 쓰는 대신, 실제 claude CLI/TUI를 Zed 안에서 더 잘 감싸는 방식입니다.

더 넓은 맥락: OpenClaw 이슈와 연결해서 보는 사람들

일부 반응은 이번 일을 Zed만의 문제가 아니라, Anthropic이 third-party harness / 서드파티 에이전트 사용을 구독 한도에서 분리하는 큰 흐름으로 봅니다. The Verge가 보도한 OpenClaw 사례에서도 Anthropic은 Claude 구독 한도가 OpenClaw 같은 third-party 도구 사용을 더 이상 커버하지 않게 하고, 별도 pay-as-you-go 방식으로 전환한다고 설명했습니다. Anthropic 측 설명은 “구독은 이런 서드파티 사용 패턴을 감당하도록 설계되지 않았고, 자사 제품과 API 고객을 우선해야 한다”는 취지였습니다.  

그래서 사람들은 Zed ACP 변경도 OpenClaw 때와 같은 정책 방향의 연장선으로 해석하는 분위기입니다.




음 그래서 고민하던 와중에

https://zed.dev/education

zed ide에서 교육용으로 지원한다는걸 확인했다.

2026 3월에 나온 소식인데 그동안 몰랐었다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/933f977ee934ac8ffc9809612325bdb5.png)

혜택을 찾아보니
무려 1년간 월 10달러의 토큰 크레딧을 주고,
인라인으로 문장을 predictions해주는 기능은 무제한으로 제공된다

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/a6b869d75b9b69d6358e71692282e785.png)

바로 가입하고 내 계정에 플랜을 등록했다


10달러의 토큰 크레딧이 생겼다. 이걸가지고 zed ide에서 당연히 zed agent는 사용할수있었고.

또 여러 ai 기능이 있는데 그중 하나가 변경된 깃 파일들을 보고 커밋 메시지도 작성해주는거다
그리고 여기에 내가 instructor를 지정해줄수가있다. 설정은 settings.json에서 지정할수있고 이외의 설정들은 공식문서에 있다

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/a679e837a905d4606d0c803e4f2a05b6.png)

변경된 hunk들을 보고서 알아서 커밋메시지를 작성해준다? 정말 편리했다
내가 작성하는 커밋 메시지 포맷이 있는데 그거까지 지켜주니까

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/717af4dac5fc31f56be57cb4ff073367.png" alt="image" width="597" />

git 패널에서 좌측하단의 생성 버튼을 누르면 api를 쏘고

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/841d503d27b71ba027c6155e61c89e99.png)

기다리면

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/8a593acfcc338ad1b84373ef09a585db.png)

이렇게 내가 지정한 인스트럭쳐를 지키면서 커밋메시지가 나온다


오픈소스
qwen agent

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/641d1769b5d309abeffc2812a13d9c8a.png)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/f7a9672f50db26d449de98df0353c8ce.png)

사용자
  ↓
Zed Agent Panel
  ↓
Qwen Code ACP Agent
  ↓
OpenRouter API
  ↓
OpenRouter가 선택한 실제 모델 제공자
  예: Alibaba/Qwen endpoint 등
  ↓
모델 응답
  ↓
OpenRouter
  ↓
Qwen Code
  ↓
Zed에 결과 표시 / 파일 수정 / 명령 제안

Zed는 UI와 프로젝트 파일 접근을 담당해주고

Qwen Code는 에이전트 하네스 역할
- 프롬프트 구성
- 프로젝트 컨텍스트 수집
- 파일 읽기/수정 요청
- shell command 실행 제안
- tool call 처리
- 모델 응답을 실제 작업으로 변환

OpenRouter는 모델 게이트웨이
- Qwen Code가 보낸 OpenAI-compatible API 요청을 받음
- 지정된 모델 slug에 맞는 provider로 라우팅
- 결과를 다시 Qwen Code에 반환

하네스라는 표현이 맞나?
Qwen Code는 단순히 모델 답변을 출력하는 프로그램이 아니라, 모델을 감싸는 agent harness에 가까운듯

Claude라는 단일 서비스의 사용량 제한/정책 변경 리스크에서 벗어나고, 모델 선택권과 비용 통제권을 OpenRouter 쪽으로 옮긴다



모델 선택

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/9ec2dc1591e084b40fd83207d23d2e65.png)

DeepSeek vs SOTA Models <출처: [bracai](https://www.bracai.eu/post/deepseek-performance)>


물론 아직 Claude 4.5 Sonnet의 SWE-Bench Pro 점수에는 미치지 못하지만 다만 그 격차가 점점 빠르게 줄어드는 분위기. 벤치마크 기준으로 좀 더 살펴보면 다음과 같음

- DeepSeek Coder V2: Claude 3.5 Sonnet과 유사한 수준. 코딩 작업에서는 거의 동등한 성능을 보여줌
- Qwen 3 Coder: GPT-4 Turbo와 Claude 3 Opus 사이 정도의 성능이다. 복잡한 코딩 작업도 대부분 처리할 수 있음
- Llama 3.1 70B: GPT-3.5 Turbo나 Claude 3 Haiku 수준. 기본적인 코딩 작업에는 충분하지만, 복잡한 로직에서는 다소 한계가 있어보임

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/0406dbcb84de696cd98d580d3bc0f45f.png)




---
이 프로젝트의 모든 소스 코드는 [GitHub]()에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.