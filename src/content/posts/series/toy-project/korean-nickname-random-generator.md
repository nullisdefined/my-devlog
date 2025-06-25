---
title: "[Starving Orange] 한글 닉네임 자동 생성 라이브러리"
slug: "korean-nickname-random-generator"
date: 2025-06-26
tags: ["ToyProject", "JavaScript", "TypeScript", "NPM"]
category: "Series/Toy-Project"
thumbnail: "https://github-production-user-asset-6210df.s3.amazonaws.com/164657817/458864883-f02d97b3-fb3d-400c-bcdf-6911a0581229.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250625%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250625T140034Z&X-Amz-Expires=300&X-Amz-Signature=bd9d35808b4727c654118128d26d21d710f40d38b205264fd81f6fe66e2707b0&X-Amz-SignedHeaders=host"
draft: false
views: 0
---
![starving orange logo](https://github-production-user-asset-6210df.s3.amazonaws.com/164657817/458864883-f02d97b3-fb3d-400c-bcdf-6911a0581229.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250625%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250625T140034Z&X-Amz-Expires=300&X-Amz-Signature=bd9d35808b4727c654118128d26d21d710f40d38b205264fd81f6fe66e2707b0&X-Amz-SignedHeaders=host)

백엔드 개발을 하다보면 기본값(default value)을 설정해야 하는 경우가 자주 발생한다. 닉네임의 경우 특히 DB 스키마에서 닉네임 컬럼에 `unique`와 `not null` 제약조건이 걸려있다면 더욱 고민하게 된다.

기존에는 보통 이런 식으로 처리했다.

```javascript
const defaultNickname = `익명_${Date.now()}`;
const defaultNickname = `사용자${Math.floor(Math.random() * 10000)}`;
```

물론 기능적으로는 문제없지만, 사용자 경험 측면에서는 아쉬운 부분이 있었다. 좀 더 재미있고 친근한 방식은 없을까?

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/29b7aee1cc11dea99d4f4c9c1a5cceae.png" alt="image" width="300" />*두잇 플랫폼의 자동 생성 닉네임 예*

두잇 같은 플랫폼을 보면 "야심찬 돈까스"처럼 재미있는 조합으로 닉네임을 자동 생성해준다. 사용자들이 굳이 바꾸지 않아도 개성 있고 기억하기 쉬운 닉네임을 갖게 되는 셈이다.

주변에 '배고픈 귤'이라는 닉네임을 가진 친구가 있어서, 여기서 아이디어를 얻어 **starving-orange**라는 한글 닉네임 생성 라이브러리를 만들게 되었다.

## 프로젝트 아이디어

### 'starving-orange'

라이브러리 이름 자체가 '배고픈 귤'이라는 뜻으로, 이것 자체가 이 라이브러리가 만들어내는 닉네임의 좋은 예시다. 형용사 + 과일 또는 야채 조합으로 만들어지는 독특하고 기억하기 쉬운 닉네임들을 생성하는 것이 주된 아이디어다.

### 목표와 컨셉

기존의 닉네임 생성기들은 대부분 영어 기반이거나, 한글이어도 딱딱한 조합이 많았다. 하지만 '배고픈 귤', '용감한 두리안', '친절한 브로콜리' 같은 조합은 친근하면서도 기억하기 쉽고, 무엇보다 한국어 사용자들에게 자연스럽게 느껴질 것이라고 생각했다.

## 기능 구현

### 기본 닉네임 생성

기본적인 사용법은 매우 간단하다.

```javascript
import { generateNickname } from 'starving-orange';

const nickname = generateNickname();
console.log(nickname.nickname); // '배고픈 귤'
console.log(nickname.adjective); // '배고픈'
console.log(nickname.noun); // '귤'

// 기본 닉네임 값으로 바로 사용
const defaultNickname = generateNickname().nickname;
```

단순히 닉네임만 반환하는 것이 아니라, 사용된 형용사와 명사를 따로 접근할 수 있도록 했다. 이렇게 하면 개발자가 필요에 따라 부분적으로만 사용하거나 추가적인 로직을 구현할 수 있다.

### 다중 닉네임 생성

사용자에게 여러 선택지를 제공하고 싶을 때를 위한 기능이다.

```javascript
import { generateMultipleNicknames } from 'starving-orange';

// 여러 개의 닉네임 생성
const candidates = generateMultipleNicknames(5);
candidates.forEach(result => {
    console.log(result.nickname);
});

// '용감한 거봉'
// '상냥한 한라봉'
// '용감한 두리안'
// '달콤한 코코넛'
// '친절한 브로콜리'
```

회원가입이나 닉네임 변경 페이지에서 "추천 닉네임" 기능으로 활용하기 좋다.

### 커스텀 단어 지원

기본 제공되는 단어 외에 프로젝트에 특화된 단어들을 사용하고 싶을 때를 위한 기능이다.

```javascript
import { generateNickname } from 'starving-orange';

// 커스텀 단어로 특별한 닉네임 생성
const customNickname = generateNickname({
    customAdjectives: ['매력적인', '꿀꿀한', '기분상한'],
    customNouns: ['바나나', '오렌지', '토마토', '상추']
});

console.log(customNickname.nickname); // '꿀꿀한 상추'
```

특정 컨셉에 맞는 고유한 닉네임을 만들고 싶을 때 유용하다.

### 띄어쓰기 옵션

UI 제약이나 디자인상의 이유로 띄어쓰기가 없는 닉네임이 필요한 경우도 있겠다고 생각해 추가한 옵션이다.

```javascript
import { generateNickname } from 'starving-orange';

// 띄어쓰기 없는 닉네임 생성
const noSpaceNickname = generateNickname({ noSpacing: true });
console.log(noSpaceNickname.nickname); // '배고픈귤'

// 기본 (띄어쓰기 있음)
const spaceNickname = generateNickname();
console.log(spaceNickname.nickname); // '배고픈 귤'
```

## 기술적 구현

### TS 지원

현대적인 JavaScript 라이브러리답게 TypeScript를 지원한다.

```typescript
interface NicknameOptions {
    customAdjectives?: string[]; // 사용할 형용사 배열
    customNouns?: string[]; // 사용할 명사 배열
    seed?: number; // 재현 가능한 랜덤 생성을 위한 시드
    noSpacing?: boolean; // 띄어쓰기 없이 닉네임 생성 (기본값: false)
}

interface GenerateResult {
    nickname: string; // 생성된 닉네임
    adjective: string; // 사용된 형용사
    noun: string; // 사용된 명사
}
```

명확한 타입 정의로 사용자는 IDE 기능을 그대로 제공받을 수 있다.

### 유틸리티 함수들

개발자가 라이브러리를 잘 활용할 수 있도록 추가적인 유틸리티 함수들도 제공한다.

- **getWordLists()**: 사용 가능한 단어 목록을 반환
- **getFruitsAndVegetables()**: 과일과 야채 목록을 각각 반환
- **getTotalCombinations()**: 가능한 닉네임 조합의 총 개수를 반환

### 재현 가능한 랜덤 생성

테스트나 특정 상황에서 동일한 결과를 얻고 싶을 때를 위해 시드(seed) 옵션을 제공한다.

```javascript
const nickname1 = generateNickname({ seed: 12345 });
const nickname2 = generateNickname({ seed: 12345 });
// nickname1과 nickname2는 항상 같은 결과
```

## 패키지 배포

### NPM

```bash
npm install starving-orange
# 또는
yarn add starving-orange
```

라이브러리를 NPM에 배포하여 누구나 쉽게 설치하고 사용할 수 있도록 했다. 한국어와 영어 README를 모두 제공하여 많은 개발자들이 활용할 수 있게 했다.

### 문서화

GitHub 저장소에는 상세한 사용 예제와 API 문서를 제공했다. 특히 다양한 사용 사례를 예시 코드와 함께 설명하여 개발자들이 쉽게 이해하고 적용할 수 있도록 했다.

## 개발 과정에서의 고민들

### 단어 선택의 어려움

어떤 형용사와 명사를 포함할지 결정하는 것이 생각보다 어려웠다. 너무 길거나 어려운 단어는 피하고, 일상적이면서도 친근한 느낌의 단어들을 골라야 했다. 특히 과일과 야채 이름은 다양성을 위해 흔히 볼 수 있는 것부터 좀 더 특별한 것들까지 포함했다.

### API 설계

처음에는 단순히 문자열만 반환하려고 했지만, 개발자들이 더 유연하게 활용할 수 있도록 형용사와 명사를 분리해서 제공하기로 했다. 또한 다양한 옵션들을 하나의 객체로 받도록 설계하여 확장성을 고려했다.

### 랜덤성과 일관성

완전히 랜덤한 결과는 테스트하기 어렵고, 특정 상황에서는 예측 가능한 결과가 필요할 수 있다. 그래서 기본적으로는 랜덤하게 동작하지만, 필요시 시드를 제공할 수 있는 옵션을 추가했다.

## 마무리

작은 라이브러리지만 실제로 필요한 기능이라고 생각한다. 한국어 서비스를 개발하는 많은 개발자들이 비슷한 고민을 해봤을 것이고, 이런 간단한 도구 하나로 사용자 경험을 조금이라도 개선할 수 있다면 의미가 있지 않을까

이 프로젝트의 소스 코드는 [GitHub](https://github.com/nullisdefined/starving-orange)에서 확인할 수 있으며, [NPM](https://www.npmjs.com/package/starving-orange)을 통해 설치하여 사용할 수 있습니다.