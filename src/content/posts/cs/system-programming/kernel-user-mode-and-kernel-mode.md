---
title: "Kernel, User/Kernel mode"
slug: "kernel-user-mode-and-kernel-mode"
date: 2025-04-10
tags: []
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0c8f5c46825f2671a6b00c8eda6fd0a9.png"
draft: false
---
### 들어가며

시스템 프로그래밍 과목을 학습하다보면 자연스럽게 운영체제 개념들을 접하게 된다. 다음은 시스템 프로그래밍의 기초가 되는 운영체제의 커널과 CPU 모드 개념에 대해 정리한 내용이다.

## 커널(kernel)이란?

### 커널의 정의

커널(kernel)은 운영체제의 핵심 소프트웨어로, 컴퓨터 하드웨어와 관련된 중요한 기능들을 담당한다.

커널도 결국 프로그램이다. 컴퓨터가 부팅될 때 메모리에 로드되어 컴퓨터가 종료될 때까지 상주한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/0c8f5c46825f2671a6b00c8eda6fd0a9.png)
*운영체제와 커널의 관계*

### 커널이 존재하는 이유

커널이 왜 필요할까? 두 가지 중요한 이유가 있다.

1. 보안적 장점
	- 하드웨어에 대한 직접 접근을 막고, 커널을 통해 간접적으로 접근하도록 제한
	- 악의적인 프로그램이 시스템을 손상시키는 것을 방지
2. 효율적인 컴퓨터 자원 사용
	- 여러 프로그램이 동시에 실행될 때 자원을 효율적으로 배분
	- 메모리, CPU, 파일 시스템 등을 체계적으로 관리

## 메모리 구조와 커널 공간

모든 프로세스는 다음과 같은 가상 메모리 구조를 가진다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/665652d6e3b6a91b84b2eff75087cb28.png)
*가상 메모리 구조*

크게최상단의 커널 공간과 그 하위의 사용자 공간으로 분류할 수 있다.

1. 커널 공간(kernel space): 모든 프로세스가 동일한 커널 공간을 공유
2. 사용자 공간(user space): 프로세스마다 독립적으로 가지는 공간

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2a60f3d95643e1888c4887b7eaf070f6.png)
*A의 가상 메모리 구조*

## 시스템 콜 인터페이스

### 시스템 콜이란?

시스템 콜(System Call)은 응용 프로그램이 시스템적인 기능을 수행할 수 있게 해주는 인터페이스다.

> 왜 C언어로 파일을 읽고 쓸 수 있었을까?
> 바로 시스템 콜 덕분이다. `fopen()`, `fread()` 같은 함수들이 내부적으로 시스템 콜을 호출합니다.



### 주요 시스템 콜 함수들

|분류|주요 시스템 콜|설명|
|---|---|---|
|**파일 관련**|`open()`, `close()`, `read()`, `write()`, `lseek()`|파일 입출력 작업|
|**프로세스 관련**|`fork()`, `execve()`, `exit()`, `wait()`|프로세스 생성/종료|
|**네트워크 관련**|`pipe()`, `socket()`, `connect()`, `bind()`|네트워크 통신|
|**메모리 관련**|`mmap()`, `munmap()`, `brk()`, `sbrk()`|메모리 할당/해제|
|**시스템 정보**|`getuid()`, `time()`, `uname()`|시스템/사용자 정보|

### 리눅스 시스템 아키텍처

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9f19835b502947defee26b8a731ee523.png)
*GNU/Linux 운영체제 시스템 아키텍처*

- **User Applications**: 사용자가 실행하는 프로그램들
- **GNU C Library (glibc)**: 시스템 콜을 쉽게 사용할 수 있도록 도와주는 래퍼 함수들
- **System Call Interface**: 사용자 공간과 커널 공간을 연결하는 인터페이스
- **Kernel**: 실제 시스템 기능을 수행하는 핵심 부분

## CPU 모드: User mode vs Kernel mode

### CPU 모드의 개념

CPU는 누가 통제권을 가지고 있느냐에 따라 두 가지 모드로 나뉜다.

#### 커널 모드 (Kernel Mode)

- **다른 이름**: 슈퍼바이저 모드, Ring 0 모드
- **특징**: CPU의 통제권이 커널에게 있음
- **수행 작업**: 시스템 콜 처리, 인터럽트 처리
- **권한**: 모든 하드웨어 자원에 접근 가능

#### 사용자 모드 (User Mode)

- **특징**: CPU의 통제권이 응용 프로그램에게 있음
- **수행 작업**: 일반적인 프로그램 코드 실행
- **권한**: 제한된 자원에만 접근 가능

### CPU 권한 링 구조

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bff07f08afd7dae35fc60e1ae4075f33.png)


- **Ring 0**: 커널 (가장 높은 권한)
- **Ring 1~2**: 디바이스 드라이버
- **Ring 3**: 응용 프로그램 (가장 낮은 권한)

### 모드 전환 과정

```c
// 사용자 모드에서 실행
FILE *file = fopen("input.txt", "r");  // 시스템 콜 호출
// 커널 모드로 전환 → 파일 열기 처리 → 사용자 모드로 복귀
```

## 인터럽트와 컨텍스트 스위칭

### 인터럽트(Interrupt)란?

인터럽트는 시스템에서 발생하는 이벤트를 알리는 메커니즘이다.

- **전원 이상 인터럽트 (Power Fail)**
- **기계 고장 인터럽트 (Machine Check)**
- **외부 신호 인터럽트**: 타이머, I/O 장치
- **프로그램 인터럽트 (Program Check)**: 0으로 나누기, 오버플로우
- **SVC (SuperVisor Call)**: 시스템 콜 호출

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/04b0879eea45f4809b1063976b66ed2f.png)


### 예시

실제 파일을 읽는 C 프로그램이 어떤 식으로 동작하는지 단계별로 살펴보면

```c
FILE *file = fopen("input.txt", "r");
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3d2e2b4435ffb66d34a94d6641e05483.png)

**1. 초기 상태**

- (사용자 모드) T1 프로세스 실행 중

**2. 파일 읽기 시스템 콜 발생**

- T1이 `read()` 시스템 콜 호출
- **사용자 모드 → 커널 모드** 전환
- T1의 CPU 상태 저장
- 파일 읽기 작업 시작

**3. I/O 대기 및 컨텍스트 스위치**

- 파일 읽기는 디스크 I/O 작업이므로 시간이 걸림
- T1을 **waiting** 상태로 변경
- 다른 프로세스(T2)를 running 상태로 변경
- **커널 모드 → 사용자 모드** 전환, T2 실행

**4. 파일 읽기 완료 인터럽트**

- 디스크가 파일 데이터를 찾아서 인터럽트 발생
- 사용자 모드 → 커널 모드 전환
- T2의 CPU 상태 저장
- 파일 데이터를 시스템 메모리에 로드
- T1을 **ready** 상태로 변경

**5. 프로세스 재실행**

- 스케줄러가 T1을 다시 실행하도록 결정
- T1의 CPU 상태 복원
- 커널 모드 → 사용자 모드 전환
- T1이 파일 데이터를 받아서 계속 실행