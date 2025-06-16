---
title: "Stack Frame"
slug: "stack-frame"
date: 2025-06-13
tags: ["SystemProgramming", "Stack"]
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e20d7bd10eda332d91274bb1b8d529b5.png"
draft: false
---
## 기본 개념 및 용어 정리

### 스택 변수의 다양한 명칭

프로그래밍에서 스택에 저장되는 변수들은 다음과 같은 용어로 불린다.

- **자동변수(Automatic variables)**
- **스택변수(Stack variables)**
- **지역변수(Local variables)**

이 모든 용어는 동일한 개념을 가리키며, 함수 내에서 선언되어 스택 메모리에 저장되는 변수들을 의미한다.

## 스택 세그먼트(Stack Segment) 특징

### ABI와 스택 사용법

스택에 대한 사용법은 ABI(Application Binary Interface)마다 다르다. 
ABI는 바이너리 레벨에서의 인터페이스 규약으로, 함수 호출 규약, 레지스터 사용법, 스택 구조 등을 정의한다.

### 스택 메모리의 자동 할당

스택에 대한 메모리 공간은 **암시적으로 할당**된다. 즉, 사용자가 직접 `malloc()` 등을 사용하지 않아도 자동으로 메모리가 할당되고 해제된다.

### 스택 변수의 특성

**스택 지역 변수의 보장사항:**

1. **할당 보장**: 변수 선언 시 메모리 할당이 보장됨
2. **유효성 보장**: 둘러싸는 블록이 끝날 때까지 유효함이 보장됨

**예시 코드:**

```c
int main() {
    int i; // i는 main 함수 전체에서 유효
    i = 10;
    
    { // 새로운 블록 시작
        int j; // j는 이 블록에서만 유효
        j = 20;
    } // 블록 끝 - j 무효화
    
    printf("j=%d(again)\n", j); // 오류! j는 범위를 벗어남
}
```

**중요한 점**: j는 블록이 끝나면 접근할 수는 없지만, 실제 메모리 값은 남아있다. 그 위치에 다른 변수의 값이 배치되기 전까지는 그 값이 그대로 남아 있다.

## 레지스터(Register) 이해하기

### 레지스터란?

레지스터(register)는 **CPU 내부에 있는 가장 빠르고 가장 작은 저장장치**다. 레지스터는 CPU가 직접 사용하는 작고 빠른 작업공간이고, 캐시는 CPU와 RAM 사이에서 속도 병목을 줄이기 위한 중간 저장소이다.

### x86-64 함수 호출 규약

**1. 매개변수 전달:**

- 처음 6개의 64비트 값은 레지스터에 배치됨 (`rdi`, `rsi`, `rdx`, `rcx`, `r8`, `r9`)
- 따라서 많은 함수들이 스택에 인수를 갖지 않음
- 7번째 인자부터는 스택에 저장됨

**2. 스택 정리 책임:**

- 스택에 넣는 것과 정리하는 책임은 **호출자(Caller)**에게 있음
- "호출자가 스택 정리"란 호출자가 7번째 이상의 인자를 스택에 저장했다면, 함수 실행이 끝난 후에 그 인자들만큼 스택 포인터(rsp)를 다시 올려줘야 함

**3. 리턴값:**

- 리턴값도 레지스터에 배치됨 (`rax`)

**4. PC(Program Counter) 레지스터:**

- 현재 CPU가 실행 중인 명령어의 메모리 주소를 저장하는 레지스터
- x86-64에선 이걸 `rip`(instruction pointer)이라고 부르기도 함

### 함수 호출과 프로그램 카운터

**함수 호출/복귀를 스택과 PC로 관리:**

1. **함수를 호출할 때** (`call` 명령어):
    
    - 현재 프로그램 카운터 값(= return 주소)를 스택에 push
    - 호출된 함수로 점프 (PC 변경)
2. **호출된 함수가 끝날 때** (`ret` 명령어):
    
    - 스택에서 이전 PC 값을 pop
    - 그 주소로 복귀(return)

## 스택 프레임(Stack Frame) 구조

### 스택 포인터 레지스터

![image|400](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e20d7bd10eda332d91274bb1b8d529b5.png)
*rbp와 rsp*

**주요 레지스터:**

- **%rbp (Frame Base Pointer)**: 현재 프레임의 베이스를 가리킴
- **%rsp (Stack Pointer)**: 현재 스택의 탑(현재 프레임의 끝)을 가리킴

### Call Stack 과정

![image|500](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c08071defec74dd908f79e02f03a5539.png)
*함수 호출 시 스택 프레임 생성 과정*

**각 함수 호출은 스택 프레임(stack frame)을 생성하며, 프레임 안에는:**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/b63ceff3fb891e4259eb368e01be9c92.png)
*스택 프레임 구조도*

1. **복귀 주소 (PC)**: caller 함수로 복귀할 주소
2. **지역 변수**: 함수 내에서 선언된 변수들
3. **매개변수**: 함수에 전달된 인자들

**함수가 끝나면:** 그 프레임은 pop되며 메모리에서 사라짐 → 값은 그대로 존재하며 스택 포인터가 이동되는 것

### 스택 프레임 생성 과정

**1단계: 함수 호출 준비**

```c
void foo() {
    int i = 3;
    bar(i);  // bar 함수 호출 준비
}
```

![image|500](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8a0a8badf10eb3b02ded5fcbea6de981.png)

**2단계: 프롤로그(Prologue) - 스택 공간 확보**

```c
void foo() {
    int i = 3;
    bar(i);  // Prologue 단계
}

void bar(int i) {
    int j = 2;
    // 지역 변수를 위한 공간 확보
}
```

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0b7041c0075f85e62ddc84e3a5ead9d8.png)

**3단계: 함수 호출 및 인자 전달**

![image|550](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e42bf61d36d9a33f910010f1897a8772.png)
*프롤로그 실행 후 스택 상태 - foo()의 지역변수를 위한 공간 확보*

**4단계: 새로운 스택 프레임 생성**

**5단계: 함수 실행 및 지역변수 할당**

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/5613204357430841ecdfa0d057c480cd.png)
*bar() 함수 실행 중 - 지역변수 j를 위한 공간 할당*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/43074c6851a649daa2d37591ccb4802b.png)
*스택 변화 - 인자 값 저장 및 caller 함수로 복귀할 주소 저장*

## 스택 프레임 동작

### 메모리 관점에서의 스택 동작

**📌 스택은 LIFO(Last In, First Out) 구조**

1. **Push 연산**: 스택 포인터 감소 후 값 저장 (x86에서 스택은 아래쪽으로 자람)
2. **Pop 연산**: 값 읽은 후 스택 포인터 증가

**중요**: Pop된 데이터는 실제로 지워지지 않고, 단지 스택 포인터만 이동한다. 메모리의 실제 값은 다른 데이터로 덮어쓰기 전까지 그대로 남아있다.

### 재귀 함수와 스택 오버플로우

**재귀 함수 예시:**

```c
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);  // 재귀 호출
}
```

**재귀 호출 시 스택 상태:**

![image|500](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/a4dbf4ee9eed81282c1f7134eefa739f.png)
*출처: https://velog.io/@haminggu/Java-%EC%9E%AC%EA%B7%80%EC%99%80-%EC%8A%A4%ED%83%9D-%EC%98%A4%EB%B2%84%ED%94%8C%EB%A1%9C%EC%9A%B0*

**스택 오버플로우**: 재귀 깊이가 너무 깊어지면 스택 공간이 부족해져 스택 오버플로우가 발생한다.

## 디버깅과 스택 트레이스

### 스택 트레이스 읽기

스택 트레이스는 함수 호출 체인을 보여주는 중요한 디버깅 도구다:

```
#0  bar() at main.c:8
#1  foo() at main.c:4  
#2  main() at main.c:12
```

이는 다음을 의미한다.

- `main()` 함수가 `foo()` 함수를 호출
- `foo()` 함수가 `bar()` 함수를 호출
- 현재 `bar()` 함수에서 오류 발생

### GDB를 이용한 스택 프레임 분석

**유용한 GDB 명령어:**

```bash
(gdb) bt          # 백트레이스 출력
(gdb) info frame  # 현재 프레임 정보
(gdb) frame 1     # 1번 프레임으로 이동
(gdb) info locals # 지역 변수 출력
(gdb) info args   # 함수 인자 출력
```

## 성능 최적화와 스택

### 스택 vs 힙 성능 비교

**스택의 장점:**

- 메모리 할당/해제가 매우 빠름 (포인터 이동만으로 처리)
- 캐시 지역성이 좋음 (연속된 메모리 주소 사용)
- 자동 메모리 관리 (가비지 컬렉션 불필요)

**스택의 단점:**

- 크기 제한이 있음 (보통 1-8MB)
- 함수 범위를 벗어나면 자동 해제됨

### 컴파일러 최적화

**프레임 포인터 생략 최적화:**

최적화 옵션(`-O2`, `-fomit-frame-pointer`)을 사용하면 컴파일러가 rbp 레지스터를 일반 용도로 사용하여 성능을 향상시킬 수 있다.

```c
// 최적화 전
push %rbp
mov %rsp, %rbp
...
pop %rbp

// 최적화 후 (rbp 생략)
sub $16, %rsp
...
add $16, %rsp
```

## 실습 예제

### 스택 프레임 관찰 실습

```c
#include <stdio.h>

void print_addresses() {
    int local_var = 42;
    printf("local_var 주소: %p\n", &local_var);
    printf("print_addresses 주소: %p\n", print_addresses);
}

void level2() {
    int var2 = 20;
    printf("level2 var2 주소: %p\n", &var2);
    print_addresses();
}

void level1() {
    int var1 = 10;
    printf("level1 var1 주소: %p\n", &var1);
    level2();
}

int main() {
    int main_var = 5;
    printf("main main_var 주소: %p\n", &main_var);
    level1();
    return 0;
}
```

이 코드를 실행하면 각 함수의 지역 변수들이 스택에서 어떤 주소를 가지는지 관찰할 수 있다.

## 보안 관점에서의 스택

### 스택 버퍼 오버플로우

**취약한 코드 예시:**

```c
void vulnerable_function() {
    char buffer[100];
    gets(buffer);  // 위험: 경계 검사 없음
}
```

**스택 보호 기법:**

- **스택 카나리(Stack Canary)**: 함수 시작 시 특별한 값을 스택에 저장하고, 함수 종료 시 확인
- **ASLR(Address Space Layout Randomization)**: 스택 주소를 랜덤화
- **NX bit**: 스택을 실행 불가능하게 설정