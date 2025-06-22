---
title: "POSIX, C"
slug: "posix-c"
date: 2025-04-09
tags: ["POSIX", "C", "SystemProgramming"]
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/47eef63f8667e193a1c417ed6697b74b.png"
draft: false
views: 0
---
## POSIX(Portable Operating System Interface)란?

POSIX는 다양한 유닉스 계열 운영체제에서 공통적으로 사용할 수 있도록 만든 운영체제 인터페이스 표준이다. 이는 개발자가 운영체제에 상관없이 동일한 코드로 프로그램을 개발할 수 있게 해주는 API 명세라고 할 수 있다.

### 시스템 구성의 기본 개념

1. 시스템 = 운영체제(소프트웨어) + 하드웨어(CPU, 메모리 등)
2. 애플리케이션 = 실행 중인 프로그램 = 프로세스
3. 프로그램은 커널과 통신하여 시스템 자원 사용을 요청
4. 커널은 하드웨어와 직접 통신하여 자원 제어를 수행
5. 고수준(high-level) → 추상화 정도가 높고 커널이 알아서 실행
6. 저수준(low-level) → 커널과 직접 소통(처리)
7. 버퍼(buffer) = 데이터를 일시적으로 저장해두는 메모리 공간

### POSIX API의 계층 구조

POSIX는 다음과 같은 계층적 구조를 가진다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/47eef63f8667e193a1c417ed6697b74b.png)

- **APP** (애플리케이션)
- **POSIX** (`open()`, `read()`, `write()` 등의 표준 함수)
- **System Call** (실제 시스템 호출)
- **Linux** (운영체제)
- **VFS** (Virtual File System)
- **Ext3, Ext4, XFS, Btrfs, Quobyte** (파일 시스템)

### POSIX 주요 개념

| 구분        | 설명                                          |
| --------- | ------------------------------------------- |
| **POSIX** | 시스템 자원에 접근하기 위한 함수들의 형식과 동작을 표준화한 명세(인터페이스) |
| **시스템 콜** | 커널이 실제로 수행되는 실행 코드로, POSIX 함수들이 내부적으로 호출    |
| **glibc** | POSIX 함수들을 실제 구현한 C 라이브러리로, 시스템 콜을 감싸서 사용   |

### 왜 POSIX가 필요한가?

다음과 같은 문제상황이 발생할 수 있다.

- 운영체제마다 시스템 콜 형식이나 개수가 다를 수 있다
- 각 운영체제마다 프로그램을 새로 작성하거나 수정하는 것은 비효율적이다

위 문제는POSIX로 해결이 가능하다.

- 공통된 약속(API 명세)을 만들어 개발자는 POSIX만 지키면 여러 운영체제에서 공통으로 개발할 수 있음
- 각 프로그램은 운영체제에 맞게 컴파일만 새로 하면 알아서 동작함
- 결과적으로 이식성, 유지보수성, 재사용성의 향상

## Array vs Pointer

| 구분             | 배열                            | 포인터                               |
| -------------- | ----------------------------- | --------------------------------- |
| **정의**         | 같은 타입의 값들을 연속된 메모리에 저장하는 공간   | 메모리 주소를 저장하는 변수                   |
| **선언**         | `int arr[3];`                 | `int *ptr;`                       |
| **메모리**        | 1. 고정된 크기<br>2. 메모리에 연속해서 배치됨 | 1. 어디든 가리킬 수 있음<br>2. 동적으로 할당 가능  |
| **초기화**        | `int arr[3] = {1, 2, 3};`     | `int *ptr = arr;` 또는 `malloc()` 등 |
| **이름이 가지는 의미** | 배열의 첫 번째 요소 주소처럼 동작           | 명시적으로 주소를 저장                      |
| **주소 변경**      | 불가능                           | 가능                                |
| **크기 변경**      | 불가능                           | 가능                                |
| **sizeof 결과**  | 배열 전체 크기                      | 포인터 자체 크기(8byte)                  |
| **동적 할당**      | 불가능                           | 가능                                |

## C / POSIX 입출력 IO

### 파일 디스크립터(File Descriptor)

→ 커널이 직접 관리하는 저수준 레벨의 자원(프로세스) 넘버링 식별자

### 스트림(Stream)

→ 사용자가 사용하기 편하도록 만들어진 고수준 인터페이스

세 가지 표준 스트림이 존재한다.

1. `stdin`: 표준 입력
2. `stdout`: 표준 출력
3. `stderr`: 표준 에러 출력

스트림은 내부적으로 파일 디스크립터를 감싸서 사용하며, 실제 I/O는 파일 디스크립터를 통해 커널이 수행한다.

### 텍스트 입출력 함수

**📌 주요 출력 함수**

```c
#include <stdio.h>

// 문자열 출력 (줄바꿈 포함)
int puts(const char *s); 
puts("Hello"); // 출력: Hello\n

// 지정한 스트림에 문자열 출력 (줄바꿈 없음)
int fputs(const char *s, FILE *fp);
fputs("Hello", stdout); // 출력: Hello

// 포맷 문자열 출력
int printf(const char *format, ...);
int fprintf(FILE *fp, const char *format, ...);
printf("Hello %s, you are %d years old\n", "Alice", 23);
fprintf(stderr, "Error: code %d\n", 404);
```

**📌 주요 입력 함수**

```c
// fgets - 안전한 문자열 입력
char *fgets(char *s, int size, FILE *fp);
char buffer[100];
if (fgets(buffer, 100, stdin)) {
    printf("입력값: %s", buffer);
}

// fscanf - 특정 형식에 따라 데이터 읽기  
int scanf(const char *format, ...);
int fscanf(FILE *stream, const char *format, ...);
int age;
scanf("%d", &age);
```

### gets()가 위험한 이유

`gets()` 함수는 **입력 크기 제한 없이** 한 줄 전체를 읽어들이기 때문에 위험하다.

- 버퍼보다 더 많은 입력이 들어오면 → 메모리를 침범할 수 있음
- 자신에게 할당되지 않은 메모리 공간을 건드리는 행위는 비정상적인 값으로 덮어쓸 수 있음
- 버퍼 오버플로우가 발생할 수 있어 사용에 주의가 필요하다

## C Toolchain: 컴파일 과정

C 프로그램을 실행 파일로 만들기 위해서는 여러 단계의 과정이 필요하다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/8895fe944ec31f36d2eaca43a7b19226.png)

### 1. 전처리기(Preprocessor)

컴파일 전에 소스코드를 변형하는 도구다.

- `#include` → 헤더 파일을 소스코드에 삽입
- `#define` → 상수나 매크로 정의 및 치환
- `#ifdef`, `#if` → 조건부 컴파일

```c
#define PI 3.14
#ifdef DEBUG
    printf("디버그 모드입니다.\n");
#endif
```

### 2. 컴파일러(Compiler)

C 코드를 어셈블리어 코드(`.s`)로 변환

결과는 오브젝트 파일(`.o`)이며, 내부에는 다음이 포함된다.

- 상수 데이터
- 정적 심볼(static symbol) → 외부에서 접근 불가능한 변수나 함수
- 지역 전역 심볼(local global symbol) → 외부에서 접근 가능
- 미해결 심볼(unresolved symbol) → 다른 파일에서 정의될 항목

### 3. 어셈블러(Assembler)

어셈블리 코드(`.s`)를 기계어(바이너리 코드)로 변환 현대 컴파일러에서는 이 과정이 거의 자동화되어 있다

### 4. 링커(Linker)

여러 오브젝트 파일을 하나의 실행 파일로 결합한다.

링커는 다음의 역할을 수행한다.

- 각 오브젝트 파일의 심볼 테이블을 이용해 미해결 심볼 해결
- 필요한 라이브러리 함수 연결 (`printf`, `malloc` 등)
- 최종적으로 주소 지정 및 실행 가능한 바이너리 생성

### Hello World 컴파일하기

```c
#include <stdio.h>
int main() {
    printf("Hello, world!\n");
    return 0;
}
```

**전체 컴파일 명령**

```bash
gcc -Wall -Werror -O2 -g -std=c99 -o helloworld helloworld.c
```

각 옵션에 대한 설명은 다음과 같다.

- `-Wall`: 모든 경고 메시지를 출력
- `-Werror`: 경고를 오류로 처리
- `-O2`: 최적화 레벨 2 적용
- `-g`: 디버깅 정보 포함
- `-std=c99`: C99 표준을 따름
- `-o helloworld`: 출력 파일 이름 지정

빌드 과정을 단계별로 실행한다면 다음과 같이 명령어를 사용할 수 있다.

1. **전처리**: `gcc -E helloworld.c`
2. **컴파일**: `gcc -S helloworld.c`
3. **어셈블**: `gcc -c helloworld.c`
4. **링크**: `gcc -o helloworld helloworld.o`

실행파일이 링크하고 있는 공유 라이브러리 목록을 확인하려면 다음의 명령어를 사용할 수 있다.

```bash
ldd helloworld
```

## 시스템 콜과 라이브러리 함수

### 시스템 콜이란?

리눅스 시스템은 파일 시스템 접근, 사용자 정보, 시스템 정보, 시스템 시간정보, 네트워킹 등 다양한 서비스를 제공한다. 이러한 서비스를 이용해 프로그램을 구현할 수 있도록 제공되는 프로그래밍 인터페이스를 시스템 콜이라고 한다.

**기본 형식**

```c
리턴 값 = 시스템 콜 함수명(인자, ...);
```

시스템 콜은 대부분 콜의 성공 유무를 알려주는 정숫값을 리턴하고, 전역변수 `errno`은 해당 값으로 설정된다.

**📌 에러 처리 함수**

- `perror()`: errno 값을 사람이 읽을 수 있는 에러 메시지로 변환하여 출력
- `strerror()`: errno 값을 사람이 읽을 수 있는 에러 메시지 문자열로 변환하여 반환

### 라이브러리 함수

미리 컴파일된 함수를 묶어 제공하는 특수한 형태의 파일이다. C 언어는 응용 프로그램 개발에 필요한 함수를 유형별로 분류해 라이브러리로 제공한다.

**📌 라이브러리 위치** 

보통 `/usr/lib`에 위치 (usr는 Unix System Resource의 약자이다)

**📌 라이브러리 종류**

- lib_.a_\* (정적 라이브러리): 프로그램을 컴파일할 때 같이 실행 파일을 구성함
- lib_.so_\* (공유 라이브러리): 실행 파일에 포함되지 않고, 실행될 때 메모리에 로드됨

### 시스템 콜과 라이브러리 함수의 차이점

**시스템 콜**

- 커널의 해당 모듈을 직접 호출해 작업하고 결과를 리턴
- 커널, 즉 시스템을 직접 호출하기 때문에 시스템 콜이라고 부름

**라이브러리 함수**

- 커널 모듈을 직접 호출하지 않음
- 커널의 서비스를 이용하기 위해 함수 내부에서 시스템 콜을 사용