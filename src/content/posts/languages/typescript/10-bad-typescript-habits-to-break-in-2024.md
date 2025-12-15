---
title: "10 Bad TypeScript Habits To Break In 2024"
slug: "10-bad-typescript-habits-to-break-in-2024"
date: 2025-01-01
tags: ["TypeScript"]
category: "Languages/TypeScript"
thumbnail: "https://miro.medium.com/v2/resize:fit:1400/0*T2UsMjTeeStZEsB5.jpeg"
draft: false
views: 0
---
![](https://miro.medium.com/v2/resize:fit:1400/0*T2UsMjTeeStZEsB5.jpeg)
TypeScript와 JavaScript는 지난 몇 년간 꾸준히 발전해왔다. 그동안 우리가 당연하게 써왔던 방식들 중 일부는 이제 낡은 방식이 되었고, 어떤 것들은 처음부터 좋은 방법이 아니었을 수도 있다. 다음은 우리가 버려야 할 10가지 좋지 않은 습관들이다.

## 1. strict mode를 사용하지 않는 것
tsconfig.json에서 strict mode를 활성화하지 않고 사용하는 것이다. 
![None](https://miro.medium.com/v2/resize:fit:700/0*cvmVhpl2EB1l3UUE)

### 그럼 어떻게 해야하나?
strict mode를 활성화해야 한다.
![None](https://miro.medium.com/v2/resize:fit:700/0*vsPKiFJ4aqbnRe5j)

### 왜 그랬었나?
strict mode를 코드베이스에 적용하려면 시간이 더 걸리기 때문에 tsconfig.json에서 strict mode를 끄고 사용하는 것이 일반적이었다.

### 왜 바꿔야 하나?
strict 모드를 켜면 나중에 코드를 수정하기가 훨씬 쉬워진다. 처음에는 시간이 좀 걸리더라도, 그 투자는 나중에 반드시 보상받게 된다. 이후 프로젝트 작업이 훨씬 수월해질 것이다.

## 2. || 연산자로 기본값 처리하기
옵셔널 값에 기본값을 설정할 때 || 연산자를 사용하는 것이다.
![None](https://miro.medium.com/v2/resize:fit:700/0*M9WW_M7Ot-e65hyy)

### 그럼 어떻게 해야하나?
새로운 ?? 연산자를 사용하거나, 더 나아가서 매개변수 수준에서 기본값을 바로 정의한다.
![None](https://miro.medium.com/v2/resize:fit:700/0*2qIaRgrt7WRSBfnl)

### 왜 그랬었나?
?? 연산자가 최근에 도입되었고, 긴 함수 중간에서 값을 사용할 때는 매개변수에서 기본값을 정의하기가 까다로웠기 때문이다.

### 왜 바꿔야 하나?
?? 연산자는 || 연산자와 다르게 null이나 undefined 값에 대해서만 기본값을 반환하지, 모든 falsy 값에 대해 반환하지 않는다. 또한 함수가 너무 길어서 시작 부분에서 기본값을 정의하기 어렵다면, 차라리 함수를 나누는 것이 더 좋은 방법일 수 있다.

## 3. any 타입 사용하기
데이터 구조가 확실하지 않을 때 any 타입을 사용하는 것이다.
![None](https://miro.medium.com/v2/resize:fit:700/0*CMUpqJPj54huNTQe)

### 그럼 어떻게 해야하나?
any 타입 대신 거의 모든 경우에 unknown 타입을 사용해야 한다.
![None](https://miro.medium.com/v2/resize:fit:700/0*3S7If_sZkBZVwolC)

### 왜 그랬었나?
any는 모든 타입 검사를 비활성화하므로 간편했다. 심지어 공식 타입 정의에서도 any가 자주 사용된다(e.g., response.json()가 Promise\<any\>로 타입이 지정되어 있는 것 처럼).

### 왜 바꿔야 하나?
모든 타입 검사를 비활성화한다는 것이 문제다. any를 통해 들어오는 모든 것은 타입 검사를 완전히 건너뛰게 된다. 이렇게 되면 우리가 예상한 타입 구조가 실제 런타임 코드와 맞지 않을 때만 문제가 발견되어, 버그를 찾기 매우 어려질 수 있다.

## 4. val as SomeType 사용하기
컴파일러가 추론할 수 없는 타입을 강제로 지정하는 것
![None](https://miro.medium.com/v2/resize:fit:700/0*Y8Dzi46Cwm8yb_kd)

### 그럼 어떻게 해야하나?
타입 가드를 사용해서 체크해야 한다.
![None](https://miro.medium.com/v2/resize:fit:700/0*5gF_1c1SyIQrt4uN)

### 왜 그랬었나?
JavaScript에서 TypeScript로 코드를 전환할 때, 기존 코드는 TypeScript 컴파일러가 자동으로 알아낼 수 없는 타입들을 가정하고 있는 경우가 많았다. 이런 상황에서 as SomeOtherType을 사용하면 tsconfig 설정을 건드리지 않고도 빠르게 전환할 수 있었다.

### 왜 바꿔야 하나?
지금 당장은 타입 단언이 문제없이 작동할 수 있지만, 누군가 코드를 옮기거나 수정할 때 문제가 발생될 수 있다. 타입 가드를 사용하면 모든 타입 체크가 명확하게 이루어지도록 보장할 수 있다.

## 5. 테스트에서 as any 사용하기
테스트를 작성할 때 불완전한 데이터를 임시로 만들어 사용하는 것이다.
![None](https://miro.medium.com/v2/resize:fit:700/0*ShL8vk5ccmLeIQEl)

### 어떻게 해야하나?
테스트용 가짜 데이터가 필요하다면, mock 로직을 테스트 대상 근처에 두고 재사용할 수 있게 만들어야 한다.
![None](https://miro.medium.com/v2/resize:fit:700/0*ecbvJG8am0SqzuO9)

### 왜 그랬었나?
테스트 커버리지가 아직 충분하지 않은 프로젝트에서 테스트를 작성할 때, 복잡한 데이터 구조 특정 기능 테스트에는 일부분만 필요한 경우가 많다. 당장은 다른 속성들을 신경 쓰지 않는 게 더 간단해 보이기 때문이다. 

### 왜 바꿔야 하나?
제대로 된 모의 객체를 만들지 않으면 나중에 큰 고생을 하게 된다. 특히 어떤 속성이 변경되었을 때 한 곳에서 수정하는 대신 모든 테스트 코드를 찾아다니며 수정해야 할 수 있다. 또한 처음에는 중요하지 않다고 생각했던 속성이 나중에 테스트에 꼭 필요한 것으로 밝혀질 수 있는데, 이때 해당 기능의 모든 테스트를 다시 업데이트해야 하는 상황이 발생할 수 있다.

## 6. 옵셔널 프로퍼티 남용하기
프로퍼티를 옵셔널로 정의해서 있을 수도 있고 없을 수도 있게 만드는 것이다.
![None](https://miro.medium.com/v2/resize:fit:700/0*7bYa_WUWAK1WXGya)

### 그럼 어떻게 해야하나?
어떤 프로퍼티 조합이 가능하고 어떤 조합이 불가능한지 명시적으로 타입을 표현해야 한다.
![None](https://miro.medium.com/v2/resize:fit:700/0*v64XmtSxalsC5ZHB)

### 왜 그랬었나?
타입을 여러 개로 분리하는 대신 속성을 옵셔널로 정의하는 게 더 쉽게 코드도 적게 생성된다. 하지만 이는 개발 중인 서비스에 대한 깊은 이해가 필요하고, 서비스에 대한 가정이 바뀌면 코드 사용이 제한될 수 있다.

### 왜 바꿔야 하나?
타입 시스템의 가장 큰 장점은 실행 시점의 검사를 컴파일 시점의 검사로 옮길 수 있다는 점이다. 더 명확한 타입을 사용하면, 예를 들어 모든 디지털 상품이 반드시 용량 정보를 가지도록 보장하는 것처럼, 그냥 넘어갈 수 있는 버그들을 컴파일 시점에 잡아낼 수 있다.

## 7. 한 글자 제네릭 사용하기
제네릭 타입에 T, U, K 같은 한 글자로 된 이름을 붙이는 것이다.
![None](https://miro.medium.com/v2/resize:fit:700/0*RDJ4nXFeSGC9G8ao)

### 그럼 어떻게 해야하나?
의미를 명확하게 전달하는 완전한 타입 이름을 사용하기
![None](https://miro.medium.com/v2/resize:fit:700/0*v1M-eum4yR6I4t7V)

### 왜 그랬었나?

> [!NOTE] 이 습관은 아마도 공식 문서에서도 한 글자 이름을 사용하기 때문에 생긴 것 같다. T를 입력하는 게 전체 이름을 쓰는 것보다 빠르고 간단하기 때문이다.

### 왜 바꿔야 하나?
제네릭 타입 변수도 결국은 변수다. IDE가 타입 정보를 잘 보여주기 시작하면서, 변수 이름에 기술적인 정보를 넣는 건 이제 불필요해졌다. 예를 들어, `const strName = 'Daniel'` 대신 `const name = 'Daniel'`을 쓰는 것 처럼. 또한 한 글자 변수 이름은 선언부에 찾아보지 않고는 의미를 이해하기 어려워서 일반적으로 좋지 않은 관행으로 여겨진다.

## 8. 불명확한 Boolean 체크
if 문에 값을 직접 넣어서 정의되었는지 확인하는 것이다.
![None](https://miro.medium.com/v2/resize:fit:700/0*hqfX5e--cpLUnVIH)

### 그럼 어떻게 해야하나?
정확히 어떤 조건을 확인하고 싶은지 명시적으로 체크해야 한다.
![None](https://miro.medium.com/v2/resize:fit:700/0*xfDmHXC5XtBx-D2w)

### 왜 그랬었나?
검사를 짧게 쓸 수 있어서 간결해 보이고, 실제로 무엇을 확인하고 싶은지 깊이 생각하지 않아도 되기 때문이다.

### 왜 바꿔야 하나?
우리가 정말로 확인하고 싶은 게 무엇인지 생각해봐야 한다. 예를 들어, 새 메시지 개수가 0인 경우와 undefined인 경우는 다르게 처리되어야 할 수 있다.

## 9. !! 연산자 사용하기
Boolean이 아닌 값을 Boolean으로 변환할 때 !!를 사용하는 것이다.
![None](https://miro.medium.com/v2/resize:fit:700/0*FmtkwqnR2kVocN4U)

### 그럼 어떻게 해야하나?
확인하고 싶은 조건을 명시적으로 체크해야 한다.
![None](https://miro.medium.com/v2/resize:fit:700/0*nFrfiPgR57x6QcVu)

### 왜 그랬었나?
일부 개발자들에게 !!는 JavaScript 세계의 특별한 기술처럼 여겨진다. 짧고 간결해 보이고, 이미 알고있는 사람들은 그 의미를 바로 이해한다. 특히 코드베이스에서 null, undefined 같은 falsy 값들 사이에 명확한 구분이 없을 때는 모든 값을 불리언으로 바꾸는 간단한 방법이었다.

### 왜 바꿔야 하나?
많은 코딩 지름길들 처럼, !!를 사용하는 것은 내부자들만 아는 지식을 조장하면서 코드의 진정한 의미를 모호하게 만든다. 이는 새로운 개발자들, 특히 개발 초보나자 JavaScript를 처음 배우는 사람들이 코드를 이해하기 어렵게 만든다. 또한 미묘한 버그를 만들기도 쉽다. 앞서 언급한 '새 메시지 개수가 0인 경우'문제는 !!를 사용할 때도 똑같이 발생할 수 있다.


> [!NOTE] 이 글은 Imran Farooq의 [10 Bad TypeScript Habits to Break in 2024](https://levelup.gitconnected.com/10-bad-typescript-habits-to-break-in-2024-4301c67f2ae0)를 한글로 번역한 글입니다.