---
title: "Pipe"
slug: "pipe"
date: 2025-06-08
tags: ["SystemProgramming", "IPC", "Pipe", "SystemCall"]
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ccb112cf7e9468d89ee4c6bf47a0aa93.png"
draft: false
views: 0
---
프로세스 간 통신(IPC, Inter-Process Communication) 중에서도 파이프(Pipe)는 유닉스/리눅스 시스템에서 가장 기본적인 IPC 메커니즘이다.

## 파이프(Pipe)

### 파이프란?
파이프(Pipe)는 두 프로세스 간 데이터를 일시적으로 저장하고 전달하는 커널 내부의 버퍼다. 사용자는 write/read로 데이터를 주고받으며, 이때 파이프는 파일 디스크립터로 다뤄진다.

파이프는 크게 두 종류로 구분된다.

1. **이름 없는 파이프 (Anonymous Pipe)**
2. **이름 있는 파이프 (Named Pipe, FIFO)**

## 이름 없는 파이프 (Anonymous Pipe)

### 특징
이름 없는 파이프는 **익명 파이프**라고도 하며, 다음과 같은 특징을 가진다.

- **부모-자식 프로세스 간에만 통신 가능**
- 부모 프로세스에서 fork()로 자식 프로세스를 생성한 뒤 통신
- **단방향 통신만 가능** (양방향 통신을 위해서는 두 개의 파이프 필요)
- 부모 → 자식 방향, 자식 → 부모 방향 중 하나를 선택해야 함

### popen() 함수
```c
FILE *popen(const char *command, const char *mode);
```

**popen()** 함수는 쉘 명령어(command)를 실행하고, 그 명령의 입력 또는 출력을 FILE * 스트림 형태로 연결해주는 함수다.

**매개변수:**

- `command`: 실행할 쉘 명령
- `mode`: "r" (읽기) 또는 "w" (쓰기)

**주요 역할:**

1. 쉘 명령어를 실행한다
2. 해당 명령의 표준 입력 또는 출력을 프로세스 간 파이프로 연결한다
3. 사용자는 FILE \*을 통해 그 결과를 읽거나 쓸 수 있다

**내부 동작 과정:**

1. **파이프(pipe) 생성**
2. **fork()로 자식 프로세스 생성**
3. **자식 프로세스에서:**
    - mode가 "r" → 표준 출력을 파이프 출력으로 리디렉션
    - mode가 "w" → 표준 입력을 파이프 입력으로 리디렉션
4. **exec()로 쉘 명령(command) 실행**

    ```c
    exec("/bin/sh", "sh", "-c", command, (char *)NULL);
    ```

5. **부모 프로세스는 FILE * 스트림을 받아 사용**

**리턴 값:**

- 성공 시: FILE \*
- 실패 시: NULL

### pclose() 함수
```c
int pclose(FILE *stream);
```

popen()으로 생성한 자식 프로세스(쉘 명령 실행)가 종료될 때까지 기다렸다가 종료 상태를 반환하고, 사용한 리소스를 정리하는 함수다.

**주요 역할:**

1. **waitpid()로 popen()이 만든 자식의 종료를 기다린다**
2. **자식 프로세스의 종료 상태를 정수로 리턴한다**
3. **파이프, FILE 스트림 등을 정리하고 닫는다**

**리턴 값:**

- 성공 시: 자식 프로세스의 종료 상태 코드
- 실패 시: -1

### popen() 사용 예제

#### 예제 1: 쓰기 모드 ("w")
```c
#include <stdlib.h>
#include <stdio.h>

int main() {
    FILE *fp;
    int a;

    // wc -l 명령을 쓰기 모드로 열기
    fp = popen("wc -l", "w");
    if (fp == NULL) {
        perror("popen");
        exit(1);
    }

    // 100줄의 테스트 라인을 wc -l 명령에 전달
    for (a = 0; a < 100; a++) {
        fprintf(fp, "test line %d\n", a);
    }

    pclose(fp);  // 출력: 100 (줄 수)
    return 0;
}
```

**동작 과정:**

1. `popen("wc -l", "w")` 호출
2. pipe() 호출 → 파이프 생성
3. fork() 호출 → 자식 프로세스 생성
**4. 자식 프로세스에서**:
    - stdin을 파이프의 출력 쪽으로 리디렉션
    - exec("wc -l") 실행
**5. 부모 프로세스에서**:
    - fp는 파이프의 쓰기 스트림
    - 이를 통해 자식 프로세스에게 데이터 전달

#### 예제 2: 읽기 모드 ("r")
```c
#include <stdlib.h>
#include <stdio.h>

int main() {
    FILE *fp;
    char buf[256];

    // date 명령을 읽기 모드로 열기
    fp = popen("date", "r");
    if (fp == NULL) {
        perror("popen");
        exit(1);
    }

    // date 명령의 출력을 읽기
    if(fgets(buf, sizeof(buf), fp) == NULL) {
        fprintf(stderr, "No data from pipe\n");
        exit(1);
    }

    printf("line: %s", buf);
    pclose(fp);
    return 0;
}
```

## pipe() 함수
```c
int pipe(int pipefd[2]);
```

popen() 함수는 쉘을 무조건 실행해야 하므로 비효율적이고 제한적이다.
	→ pipe() 함수를 사용하면 파이프를 조금 더 효율적으로 생성할 수 있다.

**매개변수:**

- `pipefd[2]`: 파이프로 사용할 파일 디스크립터 배열
    1. `pipefd[0]`: **읽기 전용** (프로세스 입장에서 입력)
    2. `pipefd[1]`: **쓰기 전용** (프로세스 입장에서 출력)

### pipe()로 통신하는 과정

#### 1단계: 파이프 생성
```c
int fd[2];
pipe(fd);  // fd[0]: 읽기, fd[1]: 쓰기
```

#### 2단계: fork()로 자식 프로세스 생성
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ccb112cf7e9468d89ee4c6bf47a0aa93.png)

fork() 이후 자식 프로세스에도 pipe fd가 복제된다(각자의 fd).

#### 3단계: 파이프의 통신 방향 결정
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/68a47a0353538780cb08325adb1b51d3.png)

fork() 이후 불필요한 파이프 디스크립터를 close() 해주지 않으면, 읽기/쓰기 블로킹이 발생하여 데드락 가능성이 생긴다.

**파이프 상태에 따른 동작:**

1. **쓰기 부분은 닫혀있고 읽기 부분만 열려있을 때** → 0이나 EOF 리턴
2. **쓰기 부분은 열려있고 읽기 부분은 닫혀있을 때** → SIGPIPE 시그널 발생

### pipe() 사용 예제

#### 기본적인 부모-자식 통신
```c
#include <sys/wait.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

int main() {
    int fd[2];
    pid_t pid;
    char buf[257];
    int len, status;

    if (pipe(fd) == -1) {
        perror("pipe");
        exit(1);
    }

    switch(pid = fork()) {
    **case -1**:
        perror("fork");
        exit(1);
        break;

    case 0: /* child process */
        close(fd[1]);  // 쓰기 파이프 닫기
        write(1, "Child Process\n", 15);
        len = read(fd[0], buf, 256);  // 부모로부터 데이터 읽기
        write(1, buf, len);
        close(fd[0]);
        exit(0);

    default: /* parent process */
        close(fd[0]);  // 읽기 파이프 닫기
        write(fd[1], "Test Message\n", 14);  // 자식에게 데이터 전송
        close(fd[1]);
        waitpid(pid, &status, 0);
        break;
    }
    return 0;
}
```

**출력:**

```
Child Process
Test Message
```

#### 파이프를 이용한 명령어 체이닝
다음 예제는 `ps -ef | grep ssh` 명령과 동일한 동작을 파이프로 구현한 것이다.

```c
#include <sys/wait.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

int main() {
    int fd[2];
    pid_t pid;

    if (pipe(fd) == -1) {
        perror("pipe");
        exit(1);
    }

    switch(pid = fork()) {
    **case -1**:
        perror("fork");
        exit(1);
        break;

    case 0: /* child process - grep ssh */
        close(fd[1]);  // 쓰기 파이프 닫기
        if (fd[0] != 0) {
            dup2(fd[0], 0);  // 표준 입력을 파이프로 리디렉션
            close(fd[0]);
        }
        execlp("grep", "grep", "ssh", (char *)NULL);
        exit(1);
        break;

    default: /* parent process - ps -ef */
        close(fd[0]);  // 읽기 파이프 닫기
        if (fd[1] != 1) {
            dup2(fd[1], 1);  // 표준 출력을 파이프로 리디렉션
            close(fd[1]);
        }
        execlp("ps", "ps", "-ef", (char *)NULL);
        wait(NULL);
        break;
    }
    return 0;
}
```

**출력 예시:**

```
root 236999 236998 0 05:25 pts/3 00:00:00 grep ssh
```

## 데드락 (Deadlock) 문제

### 데드락이란?
**데드락**은 프로세스 간 서로가 가진 자원을 기다리며 영원히 기다리고 있는 상태를 의미한다.

파이프는 커널 버퍼를 기반으로 하며, 읽기와 쓰기 작업은 다음 조건에서 블로킹된다.

1. **커널 버퍼가 가득 찼을 때** → write() 호출은 블로킹됨
2. **커널 버퍼가 비어 있을 때** → read() 호출은 블로킹됨

이러한 블로킹 동작으로 인해 단일 프로세스 내에서 데드락이 발생할 수 있다.

### 데드락 해결: 논블로킹 모드
fcntl() 함수를 사용하여 파일 디스크립터를 논블로킹 모드(`O_NONBLOCK`)로 설정하면 데드락을 예방할 수 있다.

```c
#include <fcntl.h>

// 읽기를 논블로킹 모드로 설정
fcntl(pipe[0], F_SETFL, O_NONBLOCK);

// 쓰기를 논블로킹 모드로 설정
fcntl(pipe[1], F_SETFL, O_NONBLOCK);
```

**논블로킹 모드에서의 동작**

- **비어 있는 파이프에서 read()**: -1 반환, errno == EAGAIN
- **가득 찬 파이프에서 write()**: -1 반환, errno == EAGAIN

즉, 블로킹 없이 에러 코드로 처리 가능하므로 데드락을 방지할 수 있다.

## 파이프의 활용

### 1. 명령어 파이프라인
쉘에서 사용하는 파이프라인을 프로그램으로 구현할 수 있다.

```bash

# 쉘 명령
ps aux | grep python | wc -l
```

```c
// C 프로그램으로 구현
FILE *fp = popen("ps aux | grep python | wc -l", "r");
```

### 2. 로그 처리
실시간으로 생성되는 로그를 파이프를 통해 처리

```c
// 로그 생성 프로세스
FILE *log_pipe = popen("logger -t myapp", "w");
fprintf(log_pipe, "Application started\n");
```

### 3. 데이터 필터링
대용량 데이터를 파이프를 통해 실시간으로 필터링

```c
// 데이터 필터링 파이프라인
FILE *filter = popen("sort | uniq | head -10", "w");
```

## 파이프 vs 다른 IPC 방법
|특징|파이프|공유메모리|메시지큐|소켓|
|---|---|---|---|---|
|**속도**|보통|빠름|보통|느림|
|**사용 복잡도**|간단|복잡|보통|복잡|
|**데이터 크기**|제한적|대용량|보통|대용량|
|**네트워크 지원**|X|X|X|O|
|**프로세스 관계**|부모-자식|무관|무관|무관|

## 마치며
파이프는 유닉스/리눅스 시스템에서 프로세스 간 통신을 위한 가장 기본적이면서도 효과적인 메커니즘이다. 특히 다음과 같은 경우에 유용하다.

### 파이프를 사용하기 좋은 경우
1. **부모-자식 프로세스 간 간단한 데이터 전송**
2. **명령어 파이프라인 구현**
3. **스트림 기반의 실시간 데이터 처리**
4. **필터 프로그램 연결**

### 주의할 점
1. **단방향 통신**만 가능 (양방향은 두 개의 파이프 필요)
2. **부모-자식 관계**에서만 사용 가능
3. **데드락 위험성** 존재 (적절한 close() 필요)
4. **버퍼 크기 제한** (커널 버퍼 크기에 의존)