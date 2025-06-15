---
title: "Memory Representation"
slug: "memory-representation"
date: 2025-05-07
tags: ["Structure", "FloatingPoint", "SystemProgramming", "MemoryAlignment"]
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/32a8aae5665c773a1e858ad4a6473eae.png"
draft: false
---
## 미리 알아둘 개념

**📌 워드(word)**

**워드**는 CPU가 한 번에 읽거나 쓸 수 있는 데이터의 크기다. 
워드의 크기는 CPU 아키텍처를 어떻게 설계했느냐에 따라 달라진다.

**32bits CPU → 32bits**

- 한 번에 읽을 수 있는 크기가 32bits이므로 주소값으로 2^32 까지 가질 수 있고
- 하나의 주소는 1byte(8bits)이므로, 2^32 bytes = 4GB를 최대 RAM으로 가질 수 있음

**64bits CPU → 64bits**

**📌 버스(bus)**

**버스**는 CPU, 메모리, 입출력 장치 간 정보를 주고받기 위한 통신 통로다.

**버스 종류**

**1. 데이터 버스(data bus)**

- CPU와 메모리/장치 간 실제 데이터 주고받는 통로
- 폭(width)에 따라 주고 받을 수 있는 데이터 크기가 결정됨
- 즉, 워드 크기와 관련 있음 (옛날 건 다름, 설계에 따라 다를 수 있음)

**2. 주소 버스(address bus)**

- CPU가 어디에 접근할 것인지 주소를 지정하는 데 사용되는 통로
- 폭(width)에 따라 접근 가능한 메모리 용량 결정됨

**3. 제어 버스(control bus)**

- 읽기/쓰기, 인터럽트, 클럭 신호 등 제어 신호를 전달하는 데 사용되는 통로
- 데이터가 어떻게 처리되어야 하는지를 알림

**폭(width)** → 물리적으로 연결된 전선의 수로, 하나의 전선 당 1비트를 전송함

**📌 리틀 엔디안과 빅 엔디안**

**엔디안(endian)** → 데이터를 메모리에 저장할 때 바이트 순서를 어떻게 정할 것인가에 대한 규칙

32bits의 정수 0x12345678 (4bytes)를 메모리에 저장할 때 어떤 바이트가 먼저 저장되느냐

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/32a8aae5665c773a1e858ad4a6473eae.png)

**리틀 엔디안** → LSB(Least Significant Byte) 먼저 저장

```
78 56 34 12
```

**빅 엔디안** → MSB(Most Significant Byte) 먼저 저장

```
12 34 56 78
```

## Memory Transfer

CPU는 메모리에서 데이터를 가져올 때 "워드" 단위로 가져옴

가져온 데이터는 "레지스터(register)"에 저장됨

레지스터 폭(width)은 CPU의 기본 워드 크기와 일치

일부 CPU(x86-64 등)는 하나의 레지스터에서 여러 크기의 정수를 조작할 수 있음

현대 CPU는 캐시 메모리를 위해 메모리 버스 폭을 워드 크기보다 넓게 잡기도 함

**CPU의 캐시** → 메모리 접근을 빠르게 하기 위한 일종의 고속 임시 저장소 (CPU가 메모리에서 가져오는 데이터 양을 늘리기도 함)

## Imposing Structure on Memory

**메모리에 특정 구조적인 의미를 부여하다**

프로그래밍 언어는 다양한 데이터 타입(부울, 클래스, 문자열, 구조체 등)을 제공하는데

하지만 실제로 메모리는 단순히 비트와 워드의 집합일 뿐

우리가 소프트웨어 상에서 메모리에 **'의미'**를 부여해서 이런 구조를 만들어낸 것

## Hexadecimal (16진수)

메모리 표현을 다룰 때 16진수를 자주 사용한다

16진수는 4비트(bit)를 한 자리로 표현할 수 있음

따라서 2자리 16진수는 8비트(1바이트)를 표현할 수 있음

컴퓨터가 8비트 단위로 데이터를 다루기 때문에 편리

## Padding and Alignment

실제 시스템에서는 데이터가 **'정렬(alignment)'**되어 저장됨

변수의 주소는 그 타입 크기로 나눴을 때 나머지가 없어야 함

예를 들어, 32비트 int는 4바이트 단위로 정렬

이를 맞추기 위해 데이터 사이에 **'패딩(padding)'**을 삽입할 수 있음

구조체 전체의 시작 주소도 가장 큰 타입 크기에 맞춰 정렬됨

메모리 정렬이 제대로 안 된 데이터 접근은 시스템 오류(bus error)를 일으킬 수 있음

### 📌 구조체 멤버 저장 규칙

**1. 각 멤버는 자신이 요구하는 정렬 단위에 맞는 주소에서 시작**

|타입|일반 정렬 단위|
|---|---|
|char|1바이트|
|short|2바이트|
|int, float|4바이트|
|double|8바이트|

**2. 필요하면 앞에 패딩을 추가하여 정렬을 맞춤**

**3. 구조체 안에 구조체가 있다면, 내부 구조체도 정렬 기준을 맞춤**

**4. 구조체 전체 크기 역시 가장 큰 타입의 정렬 크기의 배수로 맞춤** (마지막 멤버 이후에도 패딩이 추가될 수 있음)

### 📌 구조체 alignment 기준

구조체 전체의 정렬 기준은 내부 멤버 중 가장 큰 타입의 Alignment 요구를 따름

c

```c
struct Example {
    char a; // 1바이트 정렬
    int b;  // 4바이트 정렬
};
```

int(4바이트)가 가장 큰 타입 → 구조체 전체 정렬 기준도 4바이트

구조체 안에 구조체가 들어가도 합산 크기를 따지지 않고 inner 구조체의 멤버를 각각 취급함

**Structure Alignment 예시**

c

```c
#include <stdio.h>

struct Example {
    char a;    // 1바이트
    double b;  // 8바이트
    int c;     // 4바이트
    short d;   // 2바이트
    char e;    // 1바이트
};

int main() {
    printf("sizeof(struct Hard) = %zu\n", sizeof(struct Example));
}
```

**output: 24**

## Pointers to Structure (구조체 포인터)

c

```c
struct Complex {
    double r;
    double i;
} complex;

struct Complex *pc = &complex;
```

구조체 포인터를 다룰 때 `->` 연산자를 사용함

`(*pc).i` 와 `pc->i` 는 완전히 같은 의미

## Pointer Arithmetic (포인터 주소 연산)

포인터 연산(pointer arithmetic)에는 간격(stride)라는 개념이 존재함
스트라이드는 포인터가 가리키는 타입 크기만큼 건너뛴다
예를 들어, double형 포인터를 1 증가시키면 실제 메모리 주소는 8 증가
그래서 포인터는 배열처럼 동작할 수 있는 것이다.

## Pointer Danger (포인터 주의사항)

포인터는 타입을 가지지만 메모리 주소는 같을 수 있다.
메모리 주소 자체는 타입과 상관없이 그냥 숫자이고,
잘못된 타입으로 연산하거나 접근하는 것은 오류를 일으킬 수 있다.

1. 잘못된 메모리 접근
2. 해제된 메모리 접근(댕글링 포인터)

```c
structure Example {
    char username[8];
    int uid;
} example;

char *name = example.username;
```

- `username[8]` → 배열의 9번째 원소로 배열 범위를 벗어나 오류 발생
- `name[8]` → name이 가리키는 주소를 기준으로 8칸 떨어진 값을 참조 (uid를 가리키는 주소일 수도 있음)

### 📌 컴파일러의 도움

컴파일러는 포인터를 사용할 때 안전하게 접근할 수 있도록 도움을 제공한다.

1. 배열 바깥 경계를 넘어가는 접근을 막음
2. 타입이 맞지 않은 포인터 연산을 경고해줌

하지만 C, C++ 처럼 포인터를 직접 다루는 언어에서는 여전히 개발자가 직접 메모리 안정성을 신경써야 한다.

## Pointer Type Casting

```c
struct Complex {
    double r;
    double i;
};

char *bytes = (char *)&complex;
```

위 처럼 구조체를 바이트 단위로 접근하고 싶을 때 포인터 타입을 `char*`로 강제 변환(casting)할 수 있다.

`void*` 타입은 모든 포인터 타입과 호환되기 때문에 `void*`를 통해 다양한 변환이 가능하다.

## Dynamic Memory Allocation

포인터를 제대로 사용하려면 동적 메모리 할당도 알아야 한다.

**동적 메모리 할당** → 프로그램 실행 도중에 메모리를 요청하거나 해제하는 방법

C 언어에는 `<stdlib.h>` 헤더에 다양한 함수들이 존재한다.

- `malloc(size_t size)` → 메모리를 동적으로 할당
- `free(void *ptr)` → 할당했던 메모리를 해제

### 📌 malloc

→ 요청한 크기만큼 메모리를 할당하고, void형 타입의 포인터를 반환

```c
int *array = malloc(10 * sizeof(int));
```

- `sizeof(int)` 는 4바이트
- `10 * sizeof(int)` 는 int형 10개를 저장할 수 있는 메모리 크기를 의미함
- 할당이 실패하면 null 값을 반환

### 📌 free

→ free는 메모리를 시스템에 반납한다

```c
free(array);
```

`free()`를 호출해도 포인터 변수 자체는 남아있음 (포인터 변수의 값을 null로 만들지 않음)

즉, 포인터 값은 여전히 예전 메모리 주소를 가리키고 있을 수 있는데
→ 이 상태의 포인터를 댕글링 포인터(dangling pointer)라고 부르며 위험할 수 있다

## Dangling Pointer

```c
int *array = malloc(10 * sizeof(int));
free(array);
printf("%d", array[0]); // 매우 위험
```

이미 해제한 메모리를 다시 읽으려고 하면

1. 프로그램이 비정상 종료되거나
2. 이상한 값이 출력되거나
3. 다른 프로그램의 데이터를 침범(힙 오버플로우)할 수도 있다

## Structure Allocation

→ 구조체에서도 메모리를 동적으로 할당하고 사용할 수 있다

```c
struct Complex {
    double r;
    double i;
};

struct Complex *c = malloc(sizeof(struct Complex));

c->r = 1.0;
c->i = 0.0;

free(c);
```

## Memory Dump

→ 메모리에 저장된 내용을 통째로 출력하거나 저장하는 것

```c
#include <stdio.h>

void dump_mem(const void *mem, size_t len) {
    const char *buffer = mem; // Cast to char *
    // 메모리를 바이트 단위 배열로 다루기 위함
    size_t i;
    
    for (i = 0; i < len; i++) {
        if (i > 0 && i % 8 == 0) { // 8 바이트마다 줄바꿈 출력
            printf("\n"); 
        }
        printf("%02x ", buffer[i] & 0xff); // 부호 비트가 엉뚱하게 채워지는 것을 방지
    }
    if (i > 1) {
        puts(""); 
    }
}
```

**예시**

```c
int x = 98303; // 0x17fff
dump_mem(&x, sizeof(x));
```

**Output:**

```
ff 7f 01 00
```

이렇게 저장되는 이유는,
CPU가 메모리에 데이터를 저장할 때 엔디안에 따라 바이트 순서가 결정되기 때문이다.

- 빅엔디안 → MSB부터 저장 (00)
- 리틀엔디안 → LSB부터 저장 (ff)

## Sign Extension (부호 확장)

→ 작은 자료형 값을 큰 자료형으로 변환할 때 값의 보존을 위해 가장 높은 비트(부호 비트, MSB)를 복사해서 남은 비트를 채우는 것이다

```c
char c = 0x80;
int i = c;
dump_mem(&i, sizeof(i));
```

0x80은 2진수로 1000 0000, signed 정수로 표현하면 -128

MSB가 1이므로 int형 i로 확장할 때 앞쪽 3바이트를 모두 1로 채움

**Output:**

```
80 ff ff ff
```

📌 **sign extension 과정**

1. char c는 8비트 1000 0000 (signed, -128)
2. int i는 32비트 11111111 11111111 11111111 10000000
   (맨 앞의 1들이 모두 sign extension으로 채워진 것)
3. 음수인지 양수인지 MSB 비트를 확인
	- a. MSB가 1이면 음수
	- b. MSB가 0이면 양수
4. 음수는 2의 보수로 표현되니 과정을 반대로 진행하면 된다
	- a. 1 빼기 → 11111111 11111111 11111111 01111111
	- b. 전체 비트를 반전 → 00000000 00000000 00000000 10000000
	➡️ -128

## Negative Integers

양수뿐만 아니라 음수도 표현하기 위해 보수가 필요하다

1. 절대값 방식

맨 앞 비트(MSB)로 양수 음수를 구분하는 방법
예를 들어, +5 → 00000101, -5 → 10000101

**문제점**

- +0, -0으로 0이 두 개가 존재함
- 연산 과정이 복잡함 (부호비트 분리, 절대값 추출, 부호에 따른 조건부 연산, 최종 절댁밧에 맞는 부호 결정 등)

2. 1의 보수(one's complement)

양수를 비트 반전한 값을 음수로 표현함

예를 들어, +5 → 00000101 → 1의 보수 → 11111010 → -5

**문제점**

- 00000000, 11111111 여전히 0이 두 개
- End-arround carry 처리가 필요해진다
	→ 최상위 비트에서 발생한 캐리(carry)를 결과값의 최하위 비트에 다시 더해주는 작업

3. 2의 보수(two's complement)

1의 보수 한 후 1을 더한다
MSB는 부호 비트

- 유일한 0
- 현재까지 사용되는 방법
- MSB는 부호있는 가중치로 계산함

예를 들어, 1101 0001 → -128 +64 +16 +1 = -47

## Floating Point

### 📌 부동소수점 표현 (IEEE 754 표준)

실수를 x * 2^y 형태로 표현

**1. float (단정밀도, 32비트)**

|부분|비트 수|설명|
|---|---|---|
|부호(Sign)|1비트|양수(0), 음수(1)|
|지수(Exponent)|8비트|실제 지수 + 127(bias)|
|가수(Significand/Fraction)|23비트|정규화된 소수부|

**2. double (배정밀도, 64비트)**

| 부분                       | 비트 수 | 설명                 |
| ------------------------ | ---- | ------------------ |
| 부호(Sign)                 | 1비트  | 양수(0), 음수(1)       |
| 지수(Exponent)             | 11비트 | 실제 지수 + 1023(bias) |
| 가수(Significand/Fraction) | 52비트 | 정규화된 소수부           |

```c
float f1 = 2.0f;
float f2 = 0.2f;

dump_mem(&f1, sizeof(f1));
dump_mem(&f2, sizeof(f2));
```

**Output:**

```
00 00 00 40
cd cc 4c 3e
```

📌 **변환 과정 예시 1 (5.125)**

1. 5.125를 2진수로 변환 → 101.001
2. 소수점 위치 조정(정규화) → 1.01001 * 2^2
	- 가수(fraction): 01001
	- 지수(exponent): 2
3. 지수에 127(bias)를 더함 → 2+127 = 129
4. 129를 2진수로 변환 → 10000001
5. 최종 저장 형태 → 0 10000001 0100100000...

**📌 변환 과정 예시 2 (2.0)**

1. 2진수 변환 10.0 (2)
2. 정규화 1.0 × 2^1
	- fraction → 0
	- exponent → 1
3. bias: exponent + bias 1 + 127 = 128
4. bias 값을 2진수로 변환 128 → 10000000
5. 최종 저장
	- Sign: 0
	- Exponent: 10000000
	- Fraction: 0000...
6. 16진수 0x40000000
7. 리틀엔디안 00 00 00 40