---
title: "Concurrency"
slug: "concurrency"
date: 2025-06-14
tags: ["SystemProgramming", "Synchronization", "RaceCondition", "MutualExclusion", "Semaphores", "BusyWriting", "Monitor", "Mutex"]
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e8657206458849ba82d348ef177b8933.png"
draft: false
views: 0
---
## 동시성(Concurrency)이란?
프로세스와 스레드는 **동시다발적으로 실행**된다. 동시다발적으로 처리된다는 것은 병렬적으로 실행한다는 것이고 이를 동시성(concurrency)이라고 한다.

### 동시성의 네 가지 레벨
동시성은 다음 네 가지 레벨에서 발생할 수 있다.

1. **Instruction Level**: 여러 low-level 명령어 동시 실행
2. **Statement Level**: 여러 high-level 명령어 동시 실행
3. **Unit Level**: 여러 서브프로그램 동시 실행
4. **Program Level**: 여러 프로그램 동시 실행

### 동시성 구현 방식
동시성은 물리적으로 또는 논리적으로 구현할 수 있다.

1. **Physical Concurrency**: multi-core (진짜 동시 실행)
2. **Logical Concurrency**: time sharing (시분할 방식)

### 동시성의 핵심 문제
동시다발적으로 실행되는 프로세스 혹은 스레드들은 서로 영향을 주고받지만, 자원의 일관성을 보장해야 한다.

→ 이때, 동기화(synchronization) 기법이 사용된다.

## 동기화(Synchronization)
자원의 일관성을 보장하기 위해 프로세스의 수행 시기를 조절하는 것을 의미한다.

### 동기화의 두 가지 유형
1. **실행 순서 제어 동기화(Cooperation Synchronization)**
2. **상호 배제(Competition Synchronization)**

## 1. 협력 동기화(Cooperation Synchronization)
프로세스를 올바른 순서대로 실행하는 동기화 기법이다.

### Writer-Reader Problem
실행 순서 제어 동기화를 하지 않았을 경우 발생할 수 있는 문제 상황을 의미한다.

**Writer Process:**

1. hello.txt 파일에 데이터를 쓰기
2. 완료 신호 전송

**Reader Process:**

1. Writer 완료 대기
2. hello.txt 파일에서 데이터 읽기

Reader와 Writer 프로세스는 무작정 실행해서는 안 된다 → **실행의 순서**가 있기 때문

### 협력 동기화 구현 방법
구현 방법은 간단하다. 실행 순서를 지키면 된다.

**예시:**

```c
// Writer 프로세스
write_data_to_file();
send_completion_signal();  // 완료 신호

// Reader 프로세스  
wait_for_completion();     // 완료 대기
read_data_from_file();
```

## 2. 경쟁 동기화(Competition Synchronization)
동시에 접근해서는 안 되는 자원에 하나의 프로세스만 접근하도록 하는 동기화 기법

### Bank Account Problem
상호 배제 동기화를 하지 않았을 경우 발생할 수 있는 문제 상황을 의미한다.

**Process A:**

1. 계좌잔액을 읽는다
2. 읽은 잔액에 2만원을 더한다
3. 더한 값을 저장한다

**Process B:**

1. 계좌잔액을 읽는다
2. 읽은 잔액에 5만원을 더한다
3. 더한 값을 저장한다

### 문제 상황 분석
현재 계좌잔액이 10만원일 때, 프로세스 A, B를 동시에 실행하면 17만원이 될까?

→ 꼭 그렇지만은 않다

**문제 발생 시나리오:**

| 시간  | Process A         | Process B         | 계좌 잔액 |
| --- | ----------------- | ----------------- | ----- |
| T1  | 계좌잔액을 읽음          |                   | 10만원  |
| T2  | 읽은 잔액에 2만원을 더함    |                   | 10만원  |
| T3  | Context Switching |                   | 10만원  |
| T4  |                   | 계좌잔액을 읽음          | 10만원  |
| T5  |                   | 읽은 잔액에 5만원을 더함    | 10만원  |
| T6  |                   | Context Switching | 10만원  |
| T7  | 더한 값을 저장함         |                   | 12만원  |
| T8  |                   | 더한 값을 저장함         | 15만원  |

**결과**: 프로세스 A가 잔액 계산을 마친 후 결과를 쓰기도 전에 프로세스 B로 컨텍스트 스위칭이 이뤄질 수 있다 → 이 경우 계좌 잔액은 15만원이 된다.

### Producer-Consumer Problem
**공유 변수**: `총합 = 0`

```c
Producer() {
    버퍼에 데이터 삽입
    '총합' 변수 1 증가
}

Consumer() {
    버퍼에서 데이터 빼내기
    '총합' 변수 1 감소
}
```

**질문**: Producer, Consumer를 10,000번 실행한 후 '총합'은?

**예상**: 0

**실제**: 0이 아닌 값이 되거나, 오류가 발생하기도 한다.

### 예제 코드

#### Race Condition을 의도적으로 발생시키는 코드
```c
#include <stdio.h>
#include <pthread.h>

#define LOOP_COUNT 1000000

int sum = 0;

void* produce(void* arg);
void* consume(void* arg);

int main() {
    printf("초기 합계: %d\n", sum);

    pthread_t producer, consumer;

    pthread_create(&producer, NULL, produce, NULL);
    pthread_create(&consumer, NULL, consume, NULL);

    pthread_join(producer, NULL);
    pthread_join(consumer, NULL);

    printf("producer, consumer 스레드 실행 이후 합계: %d\n", sum);
    return 0;
}

void* produce(void* arg) {
    for (int i = 0; i < LOOP_COUNT; i++) {
        sum++;  // Race Condition 발생!
    }
    return NULL;
}

void* consume(void* arg) {
    for (int i = 0; i < LOOP_COUNT; i++) {
        sum--;  // Race Condition 발생!
    }
    return NULL;
}
```

**컴파일 및 실행:**

```bash
gcc -o race_condition race_condition.c -pthread
./race_condition
```

**결과**:
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e8657206458849ba82d348ef177b8933.png)

#### 뮤텍스를 사용해 동기화시킨 코드
```c
#include <stdio.h>
#include <pthread.h>

#define QUEUE_SIZE 100000

int queue[QUEUE_SIZE];  // 공유 자원 - 생산자와 소비자가 공유하는 큐
int front = 0;          // 큐의 맨 앞 인덱스 (소비자가 데이터를 가져갈 위치)
int rear = 0;           // 큐의 맨 뒤 인덱스 (생산자가 데이터를 넣을 위치)
int count = 0;          // 현재 큐에 있는 항목의 개수
int sum = 0;            // 생산/소비 작업의 균형을 확인하기 위한 합계 변수

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER; // 뮤텍스 초기화

void* produce(void* arg); // 생산자 스레드 함수
void* consume(void* arg); // 소비자 스레드 함수

int main() {
    printf("초기 합계: %d\n", sum);

    pthread_t producer, consumer;

    // 생산자와 소비자 스레드 생성
    pthread_create(&producer, NULL, produce, NULL);
    pthread_create(&consumer, NULL, consume, NULL);

    // 생성된 스레드들이 종료될 때까지 대기
    pthread_join(producer, NULL);
    pthread_join(consumer, NULL);

    // 최종 결과 출력
    printf("producer, consumer 스레드 실행 이후 합계: %d\n", sum);
    printf("queue size: %d\n", count);
    return 0;
}

// 생산자 스레드 함수
void* produce(void* arg) {
    for(int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&mutex);    // 뮤텍스 잠금 - 임계 영역 시작

        if(count < QUEUE_SIZE) {       // 큐가 가득 차지 않았다면
            queue[rear] = 1;           // 큐의 rear 위치에 1 삽입
            rear = (rear + 1) % QUEUE_SIZE; // rear 포인터 이동 (원형 큐)
            count++;                   // 큐 항목 수 증가
            sum++;                     // 총합 증가
        }

        pthread_mutex_unlock(&mutex);  // 뮤텍스 해제 - 임계 영역 종료
    }
    return NULL;
}

// 소비자 스레드 함수
void* consume(void* arg) {
    for(int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&mutex);    // 뮤텍스 잠금 - 임계 영역 시작

        if(count > 0) {                // 큐가 비어있지 않다면
            front = (front + 1) % QUEUE_SIZE; // front 포인터 이동 (원형 큐)
            count--;                   // 큐 항목 수 감소
            sum--;                     // 총합 감소
        }

        pthread_mutex_unlock(&mutex);  // 뮤텍스 해제 - 임계 영역 종료
    }
    return NULL;
}
```

## 공유자원(Shared Resource)
**여러 프로세스 혹은 스레드가 공유하는 자원**을 의미한다. 즉, 앞서 말한 동시에 접근하면 안 되는 자원을 뜻한다.

**공유자원의 예:**

- **변수**: 전역 변수, static 변수
- **파일**: 공유 데이터 파일
- **입출력 장치**: 프린터, 네트워크 인터페이스
- **메모리 영역**: Shared Memory Segment

## 임계 구역(Critical Section)
**동시에 실행하면 데이터 무결성이 파괴될 수 있는 구간**을 의미한다. 즉, 공유자원에 접근하는 코드 영역을 의미한다.

**중요**: 임계 구역은 원자성(atomicity)의 보장을 필요로 한다

```c
// 임계 구역 예시
int shared_counter = 0;

void increment() {
    // ↓ 임계 구역 시작
    shared_counter++;  // 이 부분이 원자적으로 실행되어야 함
    // ↑ 임계 구역 끝
}
```

**문제점**: 임계 구역에 진입하고자 하면 진입한 프로세스 이외에는 대기해야 한다. 만약, 동시에 접근하려고 하면 문제가 발생한다 → **Race Condition**

### Race Condition
여러 프로세스가 동시에 임계 구역에 접근하면 자원의 일관성이 깨질 수 있으며, 이러한 상황을 레이스 컨디션(race condition)이라고 한다.

Competition Synchronization은 상호 배제가 기본으로 깔려있어야 한다.

## 상호 배제를 위한 세 가지 원칙

### 1. 상호 배제(Mutual Exclusion)
한 프로세스가 임계 구역으로 진입하면 다른 프로세스는 진입할 수 없어야 한다

즉, **배타적 접근을 보장**해야 한다.

```c
// 올바른 상호 배제
pthread_mutex_lock(&mutex);
shared_resource++;     // 한 번에 하나의 스레드만 접근
pthread_mutex_unlock(&mutex);
```

### 2. 진행(Progress)
임계 구역이 비어있으면 진입 희망 프로세스는 들어갈 수 있어야 한다

즉, **기아(starvation)를 방지**해야 한다

### 3. 유한 대기(Bounded Waiting)
임계 구역 진입을 원하는 프로세스는 유한한 시간 내에 진입이 가능해야 한다

즉, **무한 대기를 방지**해야 한다

## 상호 배제를 지켜 동기화를 구현한 기법들
1. **뮤텍스 락(Mutex Lock)**
2. **세마포어(Semaphores)**
3. **모니터(Monitors)**

### 1. 뮤텍스 락(Mutex Lock)
**임계 구역을 잠궈 하나의 프로세스만 접근할 수 있도록 하는 동기화 기법 도구**

#### 구성 요소
**lock 변수**: 프로세스들이 공유하는 전역 변수

**acquire 함수**: 임계 구역을 잠그는 역할로, 프로세스가 임계 구역에 진입하기 전에 호출된다

1. **임계 구역이 잠겨 있는 경우**: 임계 구역이 열릴 때까지(lock이 false될 때까지) 임계 구역을 반복적으로 확인
2. **임계 구역이 열려 있는 경우**: 임계 구역을 잠그기(lock을 true로 바꾸기)

**release 함수**: 임계 구역의 잠금을 해제하는 역할로, 임계 구역에서의 작업이 끝난 뒤 호출된다

→ 현재 잠긴 임계 구역을 연다(lock을 false로 바꾸기)

#### 사용 패턴
```c
acquire();  // 임계구역이 잠겨있는지 확인, 잠겨있지 않다면 들어가서 잠그기
// 임계구역    // 임계구역에서의 작업 수행
release();  // 잠긴 임계구역을 열기
```

#### 문제점: 바쁜 대기(Busy Waiting)
조건이 만족(lock이 false)될 때까지 무한 루프를 도는 방식으로, 불필요하게 CPU를 점유하고 있는 상태다.

```c
// 바쁜 대기의 예
while (lock == true) {
    // 계속 확인... CPU 낭비
}
lock = true;  // 임계 구역 진입
```

### 2. 세마포어(Semaphores)
좀 더 일반화된 방식의 동기화 도구로, 공유 자원이 여러 개 있는 경우에도 적용이 가능하다

#### 구성 요소
**S 변수**: 임계 구역에 진입할 수 있는 프로세스의 개수(사용 가능한 공유 자원의 개수)를 나타내는 전역 변수

**wait 함수**: 임계 구역에 들어가도 되는지를 알려주는 함수

1. **S ≤ 0 이면**: 사용할 수 있는 자원(S가 1 이상)이 있는지 계속해서 확인한다
2. **S ≥ 1 이면**: S를 1 감소시키고, 임계 구역에 진입한다

**signal 함수**: 임계 구역 진입을 원하는 프로세스에게 진입해도 좋다는 신호를 주는 함수

→ 임계 구역에서 작업을 마친 뒤 S를 1 증가시킨다

#### 사용 패턴
```c
wait();     // S 감소, 자원 확보
// 임계구역
signal();   // S 증가, 자원 해제
```

#### 협력 동기화 구현
S 변수를 0으로 두고,

- 먼저 실행할 프로세스 뒤에 `signal()` 함수를,
- 다음에 실행할 프로세스 앞에 `wait()` 함수를 붙여 동기화를 구현한다

```c
// Process A (먼저 실행되어야 함)
do_work_first();
signal(sync_sem);

// Process B (나중에 실행되어야 함)  
wait(sync_sem);
do_work_second();
```

#### 바쁜 대기(Busy Waiting) 해결 방법
**문제 상황**: 사용할 수 있는 자원이 없는 경우 프로세스를 대기 상태로 만든다

**해결책**:
- 해당 프로세스의 PCB를 대기 큐에 삽입한다
- 사용할 수 있는 자원이 생겼을 경우 대기 큐의 프로세스를 준비 상태로 만든다
- 해당 프로세스의 PCB를 대기 큐에서 꺼내 준비 큐에 삽입한다

#### 세마포어의 한계
매번 임계구역 앞뒤로 wait(), signal()을 호출해야 하므로 실수할 가능성이 존재

### 3. 모니터(Monitors)
**공유 자원과 그 자원에 접근하는 함수를 하나의 모듈로 캡슐화하여 제공하는 동기화 도구**

#### 조건 변수(Condition Variables)
**프로세스의 실행 순서를 제어하기 위해 사용하는 변수**로 내부적으로 wait(), signal() 함수를 사용한다

**조건변수.wait()**: 프로세스를 대기 상태로 바꾸고, 조건변수 큐(이전의 대기 큐와 다름)에 삽입

**조건변수.signal()**: 대기 상태의 프로세스를 실행 상태로 변경

#### 모니터의 장점
```c
// 모니터 예시 (Java-style)
class BankAccount {
    private int balance = 0;
    private final Object lock = new Object();

    public void deposit(int amount) {
        synchronized(lock) {        // 자동 동기화
            balance += amount;
        }
    }

    public void withdraw(int amount) {
        synchronized(lock) {        // 자동 동기화
            balance -= amount;
        }
    }
}
```

**장점**:
- 자동으로 상호 배제 제공
- 프로그래머의 실수 가능성 감소
- 코드의 가독성 향상

## 동기화 기법 비교
|기법|장점|단점|사용 사례|
|---|---|---|---|
|**뮤텍스**|간단함, 빠름|바쁜 대기, 하나의 자원만|단순한 임계구역 보호|
|**세마포어**|여러 자원 지원, 협력 동기화|복잡함, 실수 가능성|자원 풀 관리, 순서 제어|
|**모니터**|자동 동기화, 안전함|언어 지원 필요, 오버헤드|객체지향 환경|

## 예제 코드

### 1. 생산자-소비자 (Producer-Consumer)
```c
#include <pthread.h>
#include <semaphore.h>

#define BUFFER_SIZE 10

int buffer[BUFFER_SIZE];
int in = 0, out = 0;

sem_t empty, full;
pthread_mutex_t mutex;

void* producer(void* arg) {
    int item;
    while (1) {
        item = produce_item();

        sem_wait(&empty);           // 빈 슬롯 대기
        pthread_mutex_lock(&mutex); // 버퍼 접근 보호

        buffer[in] = item;
        in = (in + 1) % BUFFER_SIZE;

        pthread_mutex_unlock(&mutex);
        sem_post(&full);            // 채워진 슬롯 증가
    }
}

void* consumer(void* arg) {
    int item;
    while (1) {
        sem_wait(&full);            // 채워진 슬롯 대기
        pthread_mutex_lock(&mutex); // 버퍼 접근 보호

        item = buffer[out];
        out = (out + 1) % BUFFER_SIZE;

        pthread_mutex_unlock(&mutex);
        sem_post(&empty);           // 빈 슬롯 증가

        consume_item(item);
    }
}
```

### 2. 읽기-쓰기 문제 (Readers-Writers)
```c
#include <pthread.h>
#include <semaphore.h>

int readers_count = 0;
sem_t write_mutex, read_count_mutex;

void* reader(void* arg) {
    while (1) {
        sem_wait(&read_count_mutex);
        readers_count++;
        if (readers_count == 1) {
            sem_wait(&write_mutex);  // 첫 번째 리더가 쓰기 차단
        }
        sem_post(&read_count_mutex);

        // 읽기 작업
        read_data();

        sem_wait(&read_count_mutex);
        readers_count--;
        if (readers_count == 0) {
            sem_post(&write_mutex);  // 마지막 리더가 쓰기 허용
        }
        sem_post(&read_count_mutex);
    }
}

void* writer(void* arg) {
    while (1) {
        sem_wait(&write_mutex);

        // 쓰기 작업 (배타적 접근)
        write_data();

        sem_post(&write_mutex);
    }
}
```

## 성능 최적화

### 1. 락 경합 최소화
```c
// 나쁜 예: 락 보유 시간이 김
pthread_mutex_lock(&mutex);
do_heavy_computation();  // 오래 걸리는 작업
shared_data++;
pthread_mutex_unlock(&mutex);

// 좋은 예: 락 보유 시간 최소화
int result = do_heavy_computation();
pthread_mutex_lock(&mutex);
shared_data += result;
pthread_mutex_unlock(&mutex);
```

### 2. 락 순서 일관성 (데드락 방지)
```c
// 항상 같은 순서로 락 획득
void transfer(Account* from, Account* to, int amount) {
    Account* first = (from < to) ? from : to;
    Account* second = (from < to) ? to : from;

    pthread_mutex_lock(&first->mutex);
    pthread_mutex_lock(&second->mutex);

    // 송금 작업

    pthread_mutex_unlock(&second->mutex);
    pthread_mutex_unlock(&first->mutex);
}
```

### 3. 원자적 연산 활용
```c
#include <stdatomic.h>

atomic_int counter = 0;

void increment() {
    atomic_fetch_add(&counter, 1);  // 락 없이 원자적 증가
}
```