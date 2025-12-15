---
title: "Virtual Memory, Memory Mapping"
slug: "virtual-memory-memory-mapping"
date: 2025-06-11
tags: ["SystemProgramming", "mmap", "C"]
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2527d03f6f1ac767b53dddf97d0bf843.png"
draft: false
views: 0
---
대용량 파일을 처리할 때 일반적인 `read()`와 `write()` 함수를 사용하면 성능이 떨어지는 경우가 많다. 특히 파일의 일부분만 수정하거나, 파일을 여러 프로세스가 공유해야 할 때는 더욱 비효율적이다. 이럴 때 Memory Mapping을 사용하면 파일을 마치 메모리 배열처럼 직접 접근할 수 있어 성능을 크게 향상시킬 수 있다.

## Memory Mapping이란?
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2527d03f6f1ac767b53dddf97d0bf843.png)

Memory Mapping은 파일을 프로세스의 가상 주소 공간에 직접 매핑하는 방법이다. 이를 통해 `read()`나 `write()` 함수 없이도 일반 변수를 다루듯 파일 데이터에 접근할 수 있다.

### 기본 개념
```c
// 일반적인 파일 I/O
char buffer[1024];
read(fd, buffer, 1024);
strcpy(buffer, "새로운 데이터");
write(fd, buffer, strlen(buffer));

// Memory Mapping 방식
char *mapped_addr = mmap(...);
strcpy(mapped_addr, "새로운 데이터");  // 직접 메모리 접근
```

Memory Mapping을 사용하면 운영체제가 파일 I/O를 페이지 단위로 자동 관리하여 성능이 크게 향상된다.

### 핵심 제약사항
Memory Mapping에는 중요한 제약이 있다.

→ **매핑할 메모리 크기 ≤ 파일 크기**

```c
// 파일 크기: 100 bytes
// 매핑 크기: 200 bytes → SIGBUS 에러 발생

// 올바른 사용
// 파일 크기: 200 bytes  
// 매핑 크기: 100 bytes → 정상 동작
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/faae59a446f0300d31b7fd430a9047b8.png)
*Virtual memory와 physical memory 간 매핑 구조*

만약 매핑된 메모리보다 파일이 작다면, 파일 범위를 벗어난 주소에 접근할 때 **SIGBUS**(버스 오류)가 발생한다. 따라서 파일 크기가 작다면 `truncate()`나 `ftruncate()`로 먼저 파일을 확장해야 한다.

## mmap()
→ 주소 **공간에** 매핑하는 함수

```c
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);
```

|매개변수|설명|
|---|---|
|`addr`|매핑할 메모리 주소 (보통 NULL로 시스템이 자동 선택)|
|`length`|매핑할 메모리 공간 크기|
|`prot`|메모리 보호 모드 (읽기/쓰기/실행 권한)|
|`flags`|매핑 방식과 동작 제어|
|`fd`|매핑할 파일의 디스크립터|
|`offset`|파일에서 매핑을 시작할 오프셋|

### 보호 모드 (prot)
| 보호 모드 (prot)      | 설명 |
|------------------------|------|
| `PROT_READ`   | 읽기 전용으로 접근 가능하게 설정한다. (메모리 내용을 읽을 수 있음) |
| `PROT_WRITE`  | 쓰기 허용. (메모리 내용을 수정할 수 있음) |
| `PROT_EXEC`   | 실행 가능. 해당 메모리에 있는 코드를 실행할 수 있게 한다. |
| `PROT_NONE`   | 접근 불가. 읽기, 쓰기, 실행 모두 금지된다. |
| `PROT_READ \| PROT_WRITE` | 읽기 + 쓰기 권한을 동시에 설정. (읽고 쓸 수 있음) |

### 플래그 (flags)
| 플래그 이름                | 설명                                                                                                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MAP_SHARED`          | 다른 프로세스와 데이터 변경 내용을 공유한다. → 쓰기 동작은 매핑된 메모리의 내용을 변경한다.                                                                                                                                                       |
| `MAP_SHARED_VALIDATE` | `MAP_SHARED`와 같으나 전달받은 플래그를 커널이 확인하고 모르는 플래그가 있을 경우 오류로 처리한다.                                                                                                                                               |
| `MAP_PRIVATE`         | 데이터의 변경 내용을 공유하지 않는다. → 처음 쓰기 동작이 생기면 매핑된 메모리의 사본을 복제해서 매핑 주소는 사본을 가리킨다.<br>→ `MAP_SHARED` 또는 `MAP_PRIVATE` 중 반드시 하나만 지정해야 하며, 둘을 같이 지정할 수 없다.<br>→ 매핑에 할당된 메모리 공간만큼 스왑 영역을 할당하고, 매핑된 데이터의 사본을 저장하는 데 사용된다. |
| `MAP_ANONYMOUS`       | `fd`를 무시하고 할당된 메모리 영역을 0으로 초기화한다 (`offset`은 0이어야 함).                                                                                                                                                        |
| `MAP_FIXED`           | 매핑할 주소를 정확히 지정하는 플래그. 이 플래그를 가진 `mmap()` 함수가 성공하면 해당 메모리 영역은 매핑된 내용으로 변경된다.                                                                                                                                 |
| `MAP_NORESERVE`       | `MAP_PRIVATE`에서의 스왑 영역 할당을 이 플래그를 지정하면 하지 않게 된다.                                                                                                                                                            |

### 리턴값과 에러 처리
<img src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/69f8ce2c37fce62825c397e696ab9e78.png" alt="image" width="550" />


```c
void *result = mmap(...);
if (result == MAP_FAILED) {
    perror("mmap failed");
    exit(1);
}
```

**주의사항:** 크기가 0인 파일은 mmap()으로 매핑할 수 없다. 운영체제는 보통 4KB 페이지 단위로 메모리를 관리하는데, 빈 파일은 매핑할 실제 데이터 블록이 없기 때문이다.

## 예제

### 1. 기본 파일 매핑
```c
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    int fd;
    char *addr;
    struct stat statbuf;

    if (argc != 2) {
        fprintf(stderr, "Usage: %s filename\n", argv[0]);
        exit(1);
    }

    // 파일 정보 가져오기
    if (stat(argv[1], &statbuf) == -1) {
        perror("stat");
        exit(1);
    }

    // 파일 열기
    if ((fd = open(argv[1], O_RDWR)) == -1) {
        perror("open");
        exit(1);
    }

    // 메모리 매핑
    addr = mmap(NULL, statbuf.st_size, 
                PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (addr == MAP_FAILED) {
        perror("mmap");
        exit(1);
    }

    // 파일을 닫아도 매핑된 메모리는 계속 사용 가능
    close(fd);

    // 파일 내용을 메모리처럼 직접 출력
    printf("%s\n", addr);

    // 메모리 매핑 해제
    if (munmap(addr, statbuf.st_size) == -1) {
        perror("munmap");
        exit(1);
    }

    return 0;
}
```

파일을 열고 mmap()을 통해 메모리에 매핑한 뒤, 파일 내용을 포인터처럼 직접 접근하여 출력한다. close() 후에도 munmap() 전까지 메모리 접근은 가능하다.

### 2. 빈 파일 생성 후 매핑
```c
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    int fd, page_size, length;
    char *addr;

    // 시스템 페이지 크기 확인
    page_size = sysconf(_SC_PAGESIZE);
    length = 1 * page_size;  // 1페이지 크기로 설정

    // 빈 파일 생성
    if ((fd = open("test.dat", O_RDWR | O_CREAT | O_TRUNC, 0666)) == -1) {
        perror("open");
        exit(1);
    }

    // 파일 크기를 페이지 크기로 확장
    if (ftruncate(fd, length) == -1) {
        perror("ftruncate");
        exit(1);
    }

    // 메모리 매핑
    addr = mmap(NULL, length, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (addr == MAP_FAILED) {
        perror("mmap");
        exit(1);
    }

    close(fd);

    // 매핑된 메모리에 직접 데이터 쓰기
    strcpy(addr, "Memory Mapping Test Data\n");

    printf("데이터가 파일에 저장되었습니다.\n");

    // 정리
    munmap(addr, length);
    return 0;
}
```

시스템 페이지 크기만큼 빈 파일을 만들고 확장한 후, mmap()으로 매핑하여 문자열 데이터를 직접 메모리에 기록한다. 이후 파일에도 저장된다.

## 관련 함수들

### munmap(): 메모리 매핑 해제
```c
int munmap(void *addr, size_t length);
```

```c
// 매핑 해제
if (munmap(addr, statbuf.st_size) == -1) {
    perror("munmap");
    exit(1);
}

// 해제 후 접근하면 Segmentation Fault 발생
printf("%s\n", addr);
```

### mprotect(): 보호 모드 변경
```c
int mprotect(void *addr, size_t len, int prot);
```

```c
// 읽기 전용으로 변경
if (mprotect(addr, length, PROT_READ) == -1) {
    perror("mprotect");
    exit(1);
}

// 이제 쓰기 시도하면 에러 발생
strcpy(addr, "test");  // Segmentation Fault
```

### truncate()/ftruncate(): 파일 크기 조정
```c
// 경로로 파일 크기 변경
int truncate(const char *path, off_t length);

// 파일 디스크립터로 크기 변경  
int ftruncate(int fd, off_t length);
```

**동작 방식:**

- **파일이 더 큰 경우**: 지정된 길이를 초과하는 부분 삭제
- **파일이 더 작은 경우**: 파일 크기를 증가시키고 추가 부분을 NULL 바이트('\0')로 채움

```c
// 파일을 1MB로 확장
if (ftruncate(fd, 1024 * 1024) == -1) {
    perror("ftruncate");
    exit(1);
}
```

## Memory Mapping의 활용 사례

### 1. 로그 파일 분석
```c
// 로그 파일 분석 예제
void analyze_log_file(const char *filename) {
    int fd = open(filename, O_RDONLY);
    struct stat st;
    stat(filename, &st);

    char *data = mmap(NULL, st.st_size, PROT_READ, MAP_PRIVATE, fd, 0);
    if (data == MAP_FAILED) return;

    char *line = data;
    char *end = data + st.st_size;

    while (line < end) {
        char *newline = memchr(line, '\n', end - line);
        if (!newline) break;

        *newline = '\0';
        if (strstr(line, "ERROR")) {
            printf("Error found: %s\n", line);
        }
        *newline = '\n';

        line = newline + 1;
    }

    munmap(data, st.st_size);
    close(fd);
}
```

로그 파일 전체를 읽어 메모리에 매핑한 후, 줄 단위로 탐색하면서 “ERROR”가 포함된 로그를 출력한다. 대용량 로그 분석에 유용하다.

### 2. 프로세스 간 통신 (IPC)
```c
typedef struct {
    int counter;
    char message[256];
} shared_data_t;

void create_shared_memory() {
    int fd = open("/tmp/shared_mem", O_RDWR | O_CREAT, 0666);
    ftruncate(fd, sizeof(shared_data_t));

    shared_data_t *shared = mmap(NULL, sizeof(shared_data_t),
                                PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);

    // 데이터 초기화
    shared->counter = 0;
    strcpy(shared->message, "Hello from parent");

    if (fork() == 0) {
        // 자식 프로세스
        shared->counter++;
        strcpy(shared->message, "Hello from child");
        exit(0);
    } else {
        // 부모 프로세스
        wait(NULL);
        printf("Counter: %d, Message: %s\n", shared->counter, shared->message);
    }

    munmap(shared, sizeof(shared_data_t));
    close(fd);
}
```

부모와 자식 프로세스가 MAP_SHARED를 통해 같은 메모리 영역을 공유하며 데이터를 주고받는다.