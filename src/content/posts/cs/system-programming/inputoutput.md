---
title: "Input/Output"
slug: "inputoutput"
date: 2025-06-01
tags: ["SystemProgramming", "I/O", "FileDescriptor", "SystemCall"]
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ea871f02a5c9ad139a95b1d50d57dfd4.png"
draft: false
---
유닉스/리눅스 시스템에서 "모든 것은 파일"이라는 철학에 따라, 파일뿐만 아니라 디바이스, 네트워크 소켓 등 모든 I/O 작업이 파일 인터페이스를 통해 이루어진다. 
다음은 Low Level과 High Level 파일 I/O의 차이점과 특징을 정리한 내용이다.

## Low Level File I/O

### 기본 개념

Low Level File I/O는 운영체제가 직접 제공하는 시스템 콜을 사용한 파일 입출력 방식이다. File은 입출력이 되는 모든 것을 의미하며, 일반적인 파일뿐만 아니라 디바이스, 파이프, 소켓 등도 포함한다.

### 동작 흐름

```
open() → fd 할당 → 파일 사용 → close()
```

일반적으로 `fd = open()` 처럼 한 줄에 작성하여 파일 디스크립터를 할당받는다.

### 파일 디스크립터(File Descriptor)

![image|500](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/ea871f02a5c9ad139a95b1d50d57dfd4.png)

파일 디스크립터는 열린 파일을 식별하는 정수 값이다. 운영체제는 각 프로세스마다 파일 디스크립터 테이블을 관리한다.

**📌 기본 파일 디스크립터**

- 0: 표준 입력 (stdin)
- 1: 표준 출력 (stdout)
- 2: 표준 오류 출력 (stderr)
- 3부터: 사용자가 열린 파일들

새로운 파일을 열면 사용 가능한 가장 작은 번호가 할당된다.

### open() 함수와 플래그

**기본 문법:**

```c
int open(const char *pathname, int flags, mode_t mode);
```

**📌 주요 플래그**

|플래그|설명|
|---|---|
|**O_RDONLY**|파일을 읽기 전용으로 연다|
|**O_WRONLY**|파일을 쓰기 전용으로 연다|
|**O_RDWR**|파일을 읽기/쓰기용으로 연다|
|**O_CREAT**|파일이 없으면 생성한다. 파일을 생성할 권한을 담당한 옵션이 있어야 한다. 파일이 이미 있다면 아무 의미 없다|
|**O_EXCL**|O_CREAT 옵션과 함께 사용할 경우 기존 파일이면 파일을 생성하고, 이미 있으면 파일을 생성하지 않고 오류 메시지를 출력한다|
|**O_APPEND**|이 옵션을 지정하면 파일의 맨 끝에 내용을 추가한다|
|**O_TRUNC**|파일을 생성할 때 이미 있는 파일이고 쓰기 옵션으로 열었으면 내용을 모두 지우고 파일 길이를 0으로 변경한다|

**O_TRUNC 플래그**

- 파일이 존재하는 경우 → 파일 내용 모두 삭제(빈 파일이 됨)
- 파일이 존재하지 않는 경우 → 아무런 효과 없음
- 그래서 보통 O_CREAT와 함께 사용함

**📌 플래그 조합**

```c
// 파일 생성 및 쓰기 전용
fd = open("test.txt", O_CREAT | O_WRONLY, 0644);

// 배타적 생성 (파일이 이미 있으면 실패)
fd = open("test.txt", O_CREAT | O_EXCL, 0644);

// 읽기/쓰기 모드로 열기
fd = open("test.txt", O_RDWR);
```

### Low Level I/O 함수들

#### read() 함수

```c
ssize_t read(int fd, void *buf, size_t count);
```

**특징:**

1. 파일에 저장된 데이터 상관없이 바이트 단위로 읽는다
2. 리턴 값이 0이면 파일 끝에 도달했다는 의미다
3. 파일을 열면 읽을 위치를 나타내는 오프셋이 파일의 시작을 가리키고, read() 함수를 실행할 때마다 읽은 크기만큼 오프셋이 이동한다

**예시:**

```c
int fd, n;
char buf[10];

fd = open("linux.txt", O_RDONLY);
n = read(fd, buf, 5);  // 5바이트 읽기
buf[n] = '\0';
printf("n = %d, buf = %s\n", n, buf);  // n = 5, buf = "Linux"
```

#### write() 함수

```c
ssize_t write(int fd, const void *buf, size_t count);
```

파일에 버퍼에 담긴 데이터를 N 바이트만큼 출력하는 함수다. 하나의 파일에서 파일 오프셋은 하나이므로, 파일을 읽기/쓰기 모드로 열었을 때 파일 읽기 오프셋과 쓰기 오프셋은 공유된다.

**파일 복사 예시:**

```c
int rfd, wfd, n;
char buf[10];

rfd = open("linux.txt", O_RDONLY);
wfd = open("linux.bak", O_CREAT | O_WRONLY | O_TRUNC, 0644);

while ((n = read(rfd, buf, 6)) > 0) {
    if (write(wfd, buf, n) != n) {
        perror("Write");
        exit(1);
    }
}
```

#### lseek() 함수

```c
off_t lseek(int fd, off_t offset, int whence);
```

파일 디스크립터 오프셋을 제어하는 함수다. fd 파일에서 whence 기준에서 offset 크기만큼 이동한다.

**📌 whence 옵션**

| 값            | 설명              |
| ------------ | --------------- |
| **SEEK_SET** | 파일의 시작을 기준으로 계산 |
| **SEEK_CUR** | 현재 위치를 기준으로 계산  |
| **SEEK_END** | 파일의 끝을 기준으로 계산  |

**예시:**

```c
off_t start, cur;
start = lseek(fd, 0, SEEK_CUR);  // 현재 위치 확인
start = lseek(fd, 6, SEEK_SET);  // 파일 시작에서 6바이트 이동
```

### 파일 디스크립터 조작

#### dup() 함수

```c
int dup(int oldfd);
```

파일 디스크립터를 복사하는 함수다. 사용 가능한 가장 작은 파일 디스크립터 번호를 할당한다.

**표준 출력 리다이렉션 예시:**

```c
int fd, fd1;
fd = open("tmp.aaa", O_CREAT | O_WRONLY | O_TRUNC, 0644);
close(1);  // 표준 출력 닫기
fd1 = dup(fd);  // fd1 = 1 (표준 출력 자리를 차지)
printf("Standard Output Redirection\n");  // 파일로 출력됨
```

#### dup2() 함수

```c
int dup2(int oldfd, int newfd);
```

dup()과 달리 새로운 파일 디스크립터를 지정할 수 있다.

```c
int fd = open("tmp.bbb", O_CREAT | O_WRONLY | O_TRUNC, 0644);
dup2(fd, 1);  // fd를 표준 출력(1)으로 복사
printf("DUP2: Standard Output Redirection\n");
```

#### fcntl() 함수

```c
int fcntl(int fd, int cmd, ...);
```

File Descriptor Control의 약자로, 파일 디스크립터의 속성을 확인하고 제어하는 함수다.

**주요 명령어:**

- `F_GETFL`: 플래그 정보를 읽어온다
- `F_SETFL`: 플래그 정보를 설정한다

**예시 - O_APPEND 플래그 추가:**

```c
int flags;
flags = fcntl(fd, F_GETFL);  // 현재 플래그 읽기
flags |= O_APPEND;           // O_APPEND 플래그 추가
fcntl(fd, F_SETFL, flags);   // 플래그 설정
```

## High Level File I/O

### 기본 개념

High Level File I/O는 C 표준 라이브러리에서 제공하는 파일 입출력 방식이다. Low Level I/O를 감싸서 더 편리하고 효율적인 인터페이스를 제공한다.

### 동작 흐름

```
fopen() → 파일 사용 → fclose()
```

### File Pointer vs File Descriptor

![image|500](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1bb087375657d54661749cece80252fb.png)

- **파일 디스크립터**: 정수형, 운영체제가 직접 관리
- **파일 포인터**: `FILE *` 형, 디스크에서 메모리에 로드된 파일(FILE 구조체)의 위치 주소 정보를 담은 포인터

**FILE 구조체 특징:**

- 파일 디스크립터를 포함함
- 포함된 파일 디스크립터를 이용해 파일 포인터와 파일 디스크립터 사이의 변환이 가능
- 플랫폼 독립적인 구조 = 어느 플랫폼에서든 동일하게 동작

### fopen() 함수

```c
FILE *fopen(const char *pathname, const char *mode);
```

**파일 열기 모드:**

|모드|의미|
|---|---|
|**r**|읽기 전용으로 텍스트 파일을 연다|
|**w**|새로 쓰기용으로 텍스트 파일을 연다. 기존 내용은 삭제된다|
|**a**|기존 내용의 끝에 추가해서 쓰기용으로 텍스트 파일을 연다|
|**rb**|읽기 전용으로 바이너리 파일을 연다|
|**wb**|새로 쓰기용으로 바이너리 파일을 연다. 기존 내용은 삭제된다|
|**ab**|추가해서 쓰기용으로 바이너리 파일을 연다|
|**r+**|읽기와 쓰기용으로 텍스트 파일을 연다|
|**w+**|쓰기와 읽기용으로 텍스트 파일을 연다|
|**a+**|추가 쓰기와 읽기용으로 텍스트 파일을 연다|

### 문자 기반 입출력 함수

#### 입력 함수들

```c
// 파일에서 문자 하나 읽기
int fgetc(FILE *fp);
int getc(FILE *fp);      // fgetc와 동일
int getchar(void);       // 표준 입력에서 문자 읽기

// 워드 단위로 읽기 (int 크기)
int getw(FILE *fp);
```

#### 출력 함수들

```c
// 파일에 문자 하나 쓰기
int fputc(int c, FILE *fp);
int putc(int c, FILE *fp);    // fputc와 동일
int putchar(int c);           // 표준 출력에 문자 쓰기

// 워드 단위로 쓰기 (int 크기)
int putw(int w, FILE *fp);
```

**파일 복사 예시:**

```c
FILE *rfp, *wfp;
int c;

rfp = fopen("linux.txt", "r");
wfp = fopen("linux.out", "w");

while((c = fgetc(rfp)) != EOF) {
    fputc(c, wfp);
}
```

### 문자열 기반 입출력 함수

#### gets() vs fgets()

```c
// 위험한 함수 - 사용 금지
char *gets(char *s);

// 안전한 함수 - 권장
char *fgets(char *s, int size, FILE *fp);
```

**gets()의 문제점:**

- 버퍼 크기를 알 수 없어 버퍼 오버플로우 위험
- 보안상 위험하므로 사용하지 않음

**fgets() 특징:**

- 최대 size-1개의 문자를 읽음
- 개행 문자('\n')도 포함하여 저장
- 버퍼의 마지막에 널 문자('\0') 추가

#### puts() vs fputs()

```c
// 표준 출력에 문자열 출력 (개행 문자 자동 추가)
int puts(const char *s);

// 파일에 문자열 출력 (개행 문자 추가하지 않음)
int fputs(const char *s, FILE *fp);
```

### 버퍼 기반 입출력 함수

#### fread() 함수

```c
size_t fread(void *ptr, size_t size, size_t nmemb, FILE *fp);
```

**매개변수:**

- `ptr`: 데이터를 저장할 버퍼 주소
- `size`: 각 항목의 크기
- `nmemb`: 읽을 항목 수 (number of members)
- `fp`: 파일 포인터

**정리하면:** fp 파일에서 size * nmemb 만큼 ptr 버퍼에 저장

**예시:**

```c
char buf[BUFSIZ];
int n;
// 2바이트 * 4 = 8바이트씩 읽기
n = fread(buf, sizeof(char) * 2, 4, fp);
```

#### fwrite() 함수

```c
size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *fp);
```

size * nmemb 만큼 ptr 버퍼에서 읽어와 fp 파일에 출력한다.

### 형식 기반 입출력 함수

#### scanf 계열

```c
// 표준 입력에서 형식화된 입력
int scanf(const char *format, ...);

// 파일에서 형식화된 입력
int fscanf(FILE *fp, const char *format, ...);
```

**학생 성적 처리 예시:**

```c
FILE *fp = fopen("linux.dat", "r");
int id, s1, s2, s3, s4;

while(fscanf(fp, "%d %d %d %d %d", &id, &s1, &s2, &s3, &s4) != EOF) {
    printf("%d\t%d\n", id, (s1 + s2 + s3 + s4) / 4);
}
```

#### printf 계열

```c
// 표준 출력에 형식화된 출력
int printf(const char *format, ...);

// 파일에 형식화된 출력
int fprintf(FILE *fp, const char *format, ...);
```

### 파일 오프셋 제어

#### fseek() 함수

```c
int fseek(FILE *fp, long offset, int whence);
```

Low Level의 lseek()와 유사하지만:

- **lseek()**: 성공하면 변경된 오프셋을 리턴
- **fseek()**: 성공하면 0, 실패하면 -1(EOF)를 리턴

#### ftell() 함수

```c
long ftell(FILE *fp);
```

현재 오프셋을 리턴한다. fseek()와 달리 현재 위치를 구할 때 사용한다.

```c
long cur = ftell(fp);  // 현재 위치 확인
```

#### rewind() 함수

```c
void rewind(FILE *fp);
```

파일의 오프셋 위치를 파일의 시작으로 즉시 이동시킨다.

### 파일 디스크립터 ↔ 파일 포인터 변환

Low Level과 High Level I/O 사이의 상호 변환이 가능하다.

```c
// 파일 디스크립터 → 파일 포인터
FILE *fdopen(int fd, const char *mode);

// 파일 포인터 → 파일 디스크립터  
int fileno(FILE *fp);
```

**예시:**

```c
FILE *fp = fopen("linux.txt", "r");
int fd = fileno(fp);              // 파일 포인터 → 파일 디스크립터
int n = read(fd, str, BUFSIZ);    // Low Level 함수 사용
```

## 시스템 콜 오버헤드와 버퍼링

### 시스템 콜의 오버헤드

시스템 콜 호출 시 다음과 같은 비용이 발생한다.

1. **보호 도메인 변경**: User mode ↔ Supervisor mode 전환 비용
    
    - 레지스터, 플래그, 스택 상태 저장 및 복원
    - 인터럽트 발생 시 처리 비용

2. **포인터 유효성 검사**: 커널이 사용자가 제공한 주소의 유효성을 확인
    
    - 버퍼 주소가 유효한 범위인지 검사
    - 메모리 접근 권한 확인

3. **메모리 맵 조정**: User Stack ↔ Kernel Stack 전환 비용
    

### 해결책: 버퍼링

**stdio.h에서 제공하는 표준 입출력 함수들은 버퍼링을 사용하여 시스템 콜 호출 횟수를 줄인다.**

#### 버퍼링의 동작 원리

**📌 예시 1 - fread() 함수**

```c
fread(&len, sizeof(len), 1, fp);
```

내부적으로

1. read() 시스템 콜을 호출하여 큰 블록(4KB)을 한번에 읽어 FILE 구조체 내부 버퍼에 저장
2. 실제 읽어온 버퍼의 전체 블록 중에서 사용자가 요청한 바이트 수만큼만 반환
3. 다음 호출 시 버퍼에 남은 데이터를 먼저 사용

**📌 예시 2 - printf() 함수**

```c
printf("Hello\n");
```

내부적으로:

1. 즉시 write() 시스템 콜을 호출하지 않음
2. 내부 버퍼에 데이터를 축적
3. 버퍼가 가득 차거나, 개행 문자('\n')를 만나거나, fflush() 호출 시 실제로 출력

### 성능 비교

**UNIX I/O (Low Level):**

```c
while (read(fd, &c, 1) == 1) {
    total += c;
}
// 매번 시스템 콜 호출 → 느림
```

**Standard I/O (High Level):**

```c
while ((ferror(fp) && fread(&c, 1, 1, fp)) == 1) {
    total += c;
}
// 버퍼링으로 시스템 콜 최소화 → 빠름
```

## 마무리

마지막으로 Low Level과 High Level I/O의 특징을 정리하면

**📌 Low Level File I/O**

- **장점**: 직접적인 제어, 정확한 에러 처리
- **단점**: 복잡한 코드, 시스템 콜 오버헤드
- **사용 예**: 시스템 프로그래밍, 디바이스 드라이버, 네트워크 프로그래밍

**📌 High Level File I/O**

- **장점**: 간편한 사용, 자동 버퍼링, 이식성
- **단점**: 제한적인 제어, 추가 메모리 사용
- **사용 예**: 일반적인 애플리케이션 개발, 텍스트 처리