---
title: "Signal"
slug: "signal"
date: 2025-06-13
tags: ["SystemProgramming", "Signal"]
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1137e3df0641323d033dbccac7528b49.png"
draft: false
views: 0
---
## 시그널(Signal) 기본 개념

### 시그널이란?
시그널(Signal)은 소프트웨어 인터럽트로, 프로세스에 뭔가 발생했음을 알리는 메시지를 비동기적으로 보내는 메커니즘이다.

### IPC(Inter Process Communication)
프로세스 간 정보를 주고받는 통신 방법으로는 다음과 같은 방법들이 있다.

1. **파이프(Pipe)**
2. **시그널(Signal)**
3. **공유 메모리(Shared Memory)**
4. **메시지 큐(Message Queue)**
5. **세마포어(Semaphore)**

### 시그널의 유형
1. **Reliable Signals** → 일반적인 시그널
2. **Real-time Signals** → 실시간 시그널 - 데이터를 함께 전달할 수 있는 시그널로 일반 시그널보다 복잡함

### 시그널이 발생하는 경우
1. 0으로 나누기처럼 프로그램에서 예외적인 상황이 일어나는 경우
2. 프로세스가 다른 프로세스에 시그널을 보내는 경우
3. 사용자가 Ctrl + C 같은 인터럽트 키를 입력한 경우

## 시그널과 프로세스 상태
시그널 처리는 프로세스의 실행 상태와 밀접한 관련이 있다.

<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1137e3df0641323d033dbccac7528b49.png" alt="프로세스 상태 다이어그램" width="450" /> 
*프로세스 상태 전환 다이어그램*

## 시그널 처리 방법
시그널을 받은 프로세스가 이를 처리하는 방법은 네 가지가 있다.

### 1. 기본 동작 수행
각 시그널에는 기본 동작(default action)이 지정되어 있으며, 대부분의 경우 프로세스를 종료한다. 이 외에 시그널을 무시하거나 프로세스의 수행을 잠시 중지하거나 재시작하는 등의 기본 동작이 있다.

### 2. 시그널 무시
프로세스가 시그널을 무시하기로 지정하면 시스템은 프로세스에 시그널을 전달하지 않는다.

### 3. 지정된 함수 호출
프로세스는 시그널 핸들러(signal handler)를 지정해 시그널을 받으면 해당 함수로 처리할 수 있다.

### 4. 시그널 블록
프로세스의 특정 부분이 실행되는 동안에만 시그널이 발생하지 않도록 블로킹할 수 있다. 블로킹된 시그널은 큐에 쌓여 있다가 시그널 블록이 해제되면 그때 전달된다.

## 주요 시그널 종류
시그널은 `signal.h` 헤더 파일에 정의되어 있다.

### 주요 시그널 목록
|시그널|번호|기본 처리|발생 조건|
|---|---|---|---|
|**SIGHUP**|1|종료|행업으로 터미널과 연결이 끊어짐 때 발생|
|**SIGINT**|2|종료|인터럽트로 사용자가 Ctrl + C를 입력하면 발생|
|**SIGQUIT**|3|코어 덤프|종료 신호로 사용자가 Ctrl + \ 를 입력하면 발생|
|**SIGILL**|4|코어 덤프|잘못된 명령 사용|
|**SIGTRAP**|5|코어 덤프|추적(trace)이나 브레이크 지점(break point)에서 트랩 발생|
|**SIGABRT**|6|코어 덤프|abort() 함수에 의해 발생|
|**SIGBUS**|7|코어 덤프|버스 오류로 발생|
|**SIGFPE**|8|코어 덤프|산술 연산 오류로 발생|
|**SIGKILL**|9|종료|강제 종료로 발생|
|**SIGUSR1**|10|종료|사용자가 정의해 사용하는 시그널 1|
|**SIGSEGV**|11|코어 덤프|세그먼테이션 오류로 발생|
|**SIGUSR2**|12|종료|사용자가 정의해 사용하는 시그널 2|
|**SIGPIPE**|13|종료|잘못된 파이프 처리로 발생|
|**SIGALRM**|14|종료|alarm() 함수에 의해 발생|
|**SIGTERM**|15|종료|소프트웨어 종료로 발생|
|**SIGCHLD**|17|무시|자식 프로세스의 상태가 바뀌었을 때 발생|
|**SIGCONT**|18|무시|중지된 프로세스를 재시작할 때 발생|
|**SIGSTOP**|19|중지|중지(stop) 시그널로, 이 시그널을 받으면 SIGCONT 시그널을 받을 때까지 프로세스 수행을 중단|
|**SIGTSTP**|20|중지|사용자가 Ctrl + z 로 중지시킬 때 발생|

### Default Action 종류
1. **종료** → 프로세스를 그냥 종료시킴
2. **코어 덤프(core dump)** → 코어 파일을 만들고 종료시킴

## 시그널 보내기

### 프로세스 식별과 시그널
프로세스 간 시그널 통신을 이해하기 위해서는 프로세스 식별 방법을 알아야 한다.

![프로세스 식별](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ecd4fa4441315b46e80eebf9c1b02732.png) _프로세스 식별 방법 - PID와 PPID를 통한 프로세스 관계_

### kill() 함수
프로그램에서 시그널을 보내려면 `kill()`, `raise()`, `abort()` 함수가 있는데 `kill()` 함수가 가장 많이 사용된다.

```c
#include <sys/types.h>
#include <signal.h>

int kill(pid_t pid, int sig);
```

- **pid**: 프로세스 ID 또는 프로세스 그룹 ID
- **sig**: 시그널 번호

### PID에 따른 케이스
1. **kill(< -1, sig)**: 해당 PID의 절댓값과 같은 PGID 그룹에 시그널 보낸다
2. **kill(-1, sig)**: 가능한 모든 프로세스에 시그널 보낸다 (보통 root 전용)
3. **kill(0, sig)**: 현재 프로세스 그룹에 속한 모든 프로세스에게 시그널 보낸다
4. **kill(> 0, sig)**: 해당 PID 프로세스에 시그널 보낸다

**예시:**

```c
#include <sys/types.h>
#include <unistd.h>
#include <signal.h>
#include <stdio.h>

int main() {
    printf("Before SIGCONT Signal to parent.\n");
    kill(getppid(), SIGCONT); // 부모 프로세스에 SIGCONT 시그널을 보냄

    printf("Before SIGQUIT Signal to me.\n");
    kill(getpid(), SIGQUIT); // 현재 프로세스(자신)에 SIGQUIT 시그널을 보냄
    printf("After SIGQUIT Signal\n");

    return 0;
}
```

### raise() 함수
```c
int raise(int sig);
```

함수를 호출한 현재 프로세스에 시그널을 보내는 함수

**리턴 값:**

- 성공시 0
- 실패시 -1
- 만약 시그널 핸들러 함수가 호출되는 경우 리턴하지 않음

### abort() 함수
```c
void abort(void);
```

함수를 호출한 현재 프로세스에 SIGABRT 시그널을 보내는 함수. SIGABRT는 프로세스를 비정상적으로 종료시키고 코어 덤프 파일을 생성하는 시그널이다.

## 시그널 핸들러 함수
프로세스가 시그널을 받을 때 수행하는 기본적인 처리는 프로세스를 종료하는 것이지만, 프로세스를 종료하기 전 처리할 작업이 남아 있거나 특정 시그널은 종료하지 않고 싶은 경우 시그널 핸들러 함수를 지정한다.

### signal() 함수
```c
#include <signal.h>

sighandler_t signal(int signum, sighandler_t handler);
```

시그널을 처리하는 가장 단순한 함수로, 시그널을 받을 때 해당 시그널을 처리할 함수나 상수를 지정할 수 있다.

**예시:**

```c
#include <unistd.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>

void sig_handler(int signo) {
    printf("Signal Handler signum: %d\n", signo);
    psignal(signo, "Received Signal");
}

int main() {
    void (*hand)(int);

    // SIGINT 시그널의 시그널 핸들러를 지정
    hand = signal(SIGINT, sig_handler);
    if(hand == SIG_ERR) {
        perror("signal");
        exit(1);
    }

    printf("Wait 1st Ctrl+C... : SIGINT\n");
    pause();

    printf("Wait 2nd Ctrl+C... : SIGINT\n");
    pause();

    printf("After 2nd Signal Handler\n");
    return 0;
}
```

## 시그널 집합 (Signal Set)
POSIX에서 다수의 시그널을 처리하기 위해 도입한 개념으로, 시그널을 비트 마스크로 표현한 것이다.

```c
typedef struct {
    unsigned long _val[_NSIG_WORDS];
} sigset_t;
```

### 시그널 집합 처리 함수
```c
int sigemptyset(sigset_t *set);     // 시그널 집합을 빈 집합으로 만듦
int sigfillset(sigset_t *set);      // 모든 시그널을 포함하는 집합으로 만듦
int sigaddset(sigset_t *set, int signum);   // 시그널 집합에 시그널 추가
int sigdelset(sigset_t *set, int signum);   // 시그널 집합에서 시그널 삭제
int sigismember(const sigset_t *set, int signum); // 시그널이 집합에 있는지 확인
```

**예시:**

```c
#include <signal.h>
#include <stdio.h>

int main() {
    sigset_t st;

    // 시그널 집합을 모두 비운다
    sigemptyset(&st);

    // 시그널 집합에 SIGINT와 SIGQUIT 시그널을 추가한다
    sigaddset(&st, SIGINT);
    sigaddset(&st, SIGQUIT);

    if (sigismember(&st, SIGINT)) {
        printf("SIGINT has been set.\n");
    }

    // 시그널 집합에 설정된 값을 16진수로 출력
    printf("** Bit Pattern: %lx\n", st.__val[0]);

    return 0;
}
```

## 고급 시그널 제어: sigaction() 함수
`signal()`, `sigset()` 함수처럼 시그널을 받았을 때 처리할 수 있는 핸들러 함수를 포함하는 act 구조체를 받아 사용한다. 즉 더 많은 제어를 할 수 있는 함수다.

### sigaction 구조체
```c
struct sigaction {
    int sa_flags;
    union {
        void (*sa_handler)();
        void (*sa_sigaction)(int, siginfo_t *, void *);
    } _funcptr;
    sigset_t sa_mask;
};
```

- **sa_flags**: 플래그에 따른 케이스
    - SA_INFO 설정되어 있는 경우 → sa_handler 핸들러 함수 사용
    - SA_INFO 설정 안 되어 있는 경우 → sa_sigaction 멤버 사용
- **sa_mask**: 시그널 집합

### sigaction() 함수
```c
int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact);
```

1. **act.sa_handler** → 시그널 핸들러 지정
2. **act.sa_flags** → 시그널 전달 방법을 플래그로 지정
3. **act.sa_mask** → 시그널 집합을 지정 (블로킹)

**예시:**

```c
#include <signal.h>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

void sig_handler(int signo) {
    psignal(signo, "Received Signal:");
    sleep(5);
    printf("In Signal Handler, After Sleep\n");
}

int main() {
    struct sigaction act;

    sigemptyset(&act.sa_mask);
    // 시그널 핸들러가 동작하는 중에 SIGQUIT 시그널을 블로킹
    sigaddset(&act.sa_mask, SIGQUIT);

    act.sa_flags = 0;
    act.sa_handler = sig_handler;

    // SIGINT 시그널을 받을 경우 시그널 핸들러가 동작하도록 설정
    if(sigaction(SIGINT, &act, (struct sigaction *)NULL) < 0) {
        perror("sigaction");
        exit(1);
    }

    fprintf(stderr, "Input SIGINT: ");
    pause(); // 시그널이 올 때까지 대기
    fprintf(stderr, "\nAfter Signal Handler\n");

    return 0;
}
```

## 시그널 동시성 문제와 해결방법

### 시그널 동시성 문제
main() 함수와 시그널 핸들러 함수가 전역 변수에 동시에 접근할 수 있어 경쟁 조건(race condition)이 발생할 수 있다.

### 시그널 블로킹: sigprocmask() 함수
```c
int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);
```

현재 프로세스의 시그널 마스크(시그널 집합)을 읽고 설정(블로킹)할 수 있는 함수

**how 인자 값:**

1. **SIG_BLOCK**: oldset에 set 시그널들을 추가 (블로킹 설정)
2. **SIG_UNBLOCK**: set에 포함된 시그널들을 oldset에서 삭제 (블로킹 해제)
3. **SIG_SETMASK**: oldset을 set으로 교체

**동시성 문제 해결 예시:**

```c
int main(int argc, char *argv[]) {
    // 시그널 핸들러 등록
    signal(SIGINT, handler);

    // SIGINT를 블로킹할 집합 준비
    sigset_t block_set, old_set;
    sigemptyset(&block_set);
    sigaddset(&block_set, SIGINT);

    // SIGINT 블로킹 시작 → 시그널 핸들러 재진입 방지
    sigprocmask(SIG_BLOCK, &block_set, &old_set);

    // 이 부분은 안전함. 시그널 핸들러와 동시에 실행되지 않음
    prepend(new_listnode());

    // 다시 SIGINT 허용
    sigprocmask(SIG_SETMASK, &old_set, NULL);

    return 0;
}
```

## 시그널과 점프: sigsetjmp/siglongjmp

### Context Switch
현재 상태를 저장하고 다른 컨텍스트로 전환하는 것을 의미한다.
같은 프로세스임에도 핸들러 함수로의 컨텍스트 전환이 발생하게 된다.

### sigsetjmp() 함수
```c
int sigsetjmp(sigjmp_buf env, int savemask);
```

복귀 지점을 설정하는 함수로, 처음 호출 시 0을 리턴한다.

- **env**: 점프 정보를 저장하는 구조체 (레지스터, 스택 포인터, PC 등)
- **savemask**: 시그널 마스크 저장할지 유무 옵션

### siglongjmp() 함수
```c
void siglongjmp(sigjmp_buf env, int val);
```

복귀 지점(val)으로 복귀하는 함수로, setjmp에서 리턴한 val을 인자로 사용하여 빠져나온다.

**예시:**

```c
#include <stdio.h>
#include <signal.h>
#include <setjmp.h>
#include <unistd.h>

// 전역 점프 버퍼 선언
static sigjmp_buf buf;

// 시그널 핸들러 함수
void handler(int sig) {
    // 저장된 지점으로 복귀하면서 sigsetjmp의 반환값을 1로 설정
    siglongjmp(buf, 1);
}

int main() {
    // 처음 호출 시에는 0을 반환하고, siglongjmp로 돌아오면 1을 반환함
    if (!sigsetjmp(buf, 1)) {
        // 초기 실행 시 → 핸들러 등록
        signal(SIGINT, handler);
        puts("starting");
    } else {
        // Ctrl+C를 눌러 siglongjmp로 되돌아온 경우
        puts("restarting");
    }

    // 무한 루프: 1초마다 "processing..." 출력
    while (1) {
        sleep(1);
        puts("processing...");
    }

    return 0;
}
```