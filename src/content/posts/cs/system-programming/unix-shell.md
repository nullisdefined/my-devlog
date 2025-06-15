---
title: "Unix Shell"
slug: "unix-shell"
date: 2025-06-10
tags: ["SystemProgramming", "Unix", "Bash"]
category: "CS/System Programming"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/83e901e30d4faabcdc33d1cd5902a036.png"
draft: false
---
## UNIX Shell

![image|500](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/83e901e30d4faabcdc33d1cd5902a036.png)

### Shell이란?

Shell은 사용자와 시스템 간 상호작용하는 기본 인터페이스로, 시스템 콜에 대한 안전한 접근을 제공한다. 쉘은 단순한 명령어 해석기를 넘어서, 강력한 프로그래밍 환경을 제공하는 도구다.

### Shell 특징

#### 1. 대화형 명령 프롬프트

입력을 즉시 받아 실행하는 대화형 환경을 제공한다.

```bash
$ ls -la
$ cd /home/user
$ grep "pattern" file.txt
```

#### 2. 프로그래밍 환경 제공

- **명령어 별칭(alias)**: 자주 사용하는 명령어를 간단하게 만들기
- **이전 명령어 불러오기 및 수정**: 히스토리 기능과 편집 기능

```bash
# 별칭 설정
alias ll='ls -la'
alias grep='grep --color=auto'

# 히스토리 사용
history
!42  # 42번째 명령 재실행
!!   # 이전 명령 재실행
```

#### 3. 문자열 단위(words) 처리

- **공백(스페이스, 탭, 개행 등)을 기준으로 단어가 구분됨**
- **공백이 포함된 문자열은 따옴표나 백슬래시로 처리**

```bash
# 잘못된 예
echo Hello World  # Hello와 World가 각각 다른 인자

# 올바른 예
echo "Hello World"  # 하나의 문자열
echo Hello\ World   # 백슬래시로 공백 이스케이프
```

#### 4. Statement 단위 처리

쉘의 모든 명령문은 하나의 statement로 처리되며, 다음으로 끝난다.

- **개행(\n)**
- **세미콜론(;)**
- **앰퍼샌드(&)** - 백그라운드 실행

```bash
# 여러 명령을 한 줄에
ls; pwd; date

# 백그라운드 실행
long_running_command &
```

## Commands: 명령문의 분류

쉘에서 처리하는 명령문은 크게 네 가지로 분류된다.

### 1. 변수 설정

```bash
name="Alice"
PATH="/usr/local/bin:$PATH"
export DATABASE_URL="postgresql://localhost/mydb"
```

### 2. Built-in Commands (쉘 내장 명령어)

```bash
cd /home/user    # 디렉터리 변경
pwd             # 현재 디렉터리 출력
echo "Hello"    # 문자열 출력
exit            # 쉘 종료
```

### 3. 제어문 (if, while 등)

```bash
if [ "$USER" = "root" ]; then
    echo "Running as root"
fi

while read line; do
    echo "Processing: $line"
done < input.txt
```

### 4. External Commands (외부 명령) 실행

```bash
ls -la          # 파일 목록
grep pattern    # 텍스트 검색
gcc program.c   # 컴파일
```

## Built-in Commands vs External Commands

### Built-in Commands가 필요한 이유

일부 명령(e.g. `cd`)은 외부 프로그램이 아닌 쉘 내부에서 직접 실행된다. 그 이유는 다음과 같다.

#### 1. 효율성

외부 프로그램을 실행하면 fork()와 exec() 과정이 필요하지만, 내장 명령어는 이 과정을 생략할 수 있다.

#### 2. 쉘의 내부 상태 변경

`cd` 명령어를 예로 들면, 현재 디렉터리를 변경해야 하는데, fork() 이후에는 **쉘의 내부 상태를 변경할 수 없다**. 따라서 cd는 반드시 내장 명령어여야 한다.

```bash
# 만약 cd가 외부 프로그램이라면?
# 자식 프로세스에서 디렉터리를 변경해도
# 부모 프로세스(쉘)의 현재 디렉터리는 변경되지 않음
```

### External Commands

외부 명령은 **fork()로 프로세스를 복제한 후 exec()로 실행**된다.

```bash
$ ls -la
# 1. 쉘이 fork()로 자식 프로세스 생성
# 2. 자식 프로세스에서 exec("ls", "-la") 실행
# 3. 부모 프로세스(쉘)는 자식이 끝날 때까지 대기
```

## Variables → 쉘 변수 시스템

쉘 변수는 기본 변수와 특수 변수로 구분할 수 있다.

### 기본 변수 특성

```bash
#!/bin/bash
name="Alice"  # 변수 선언 (= 주변에 공백 없이!)
echo "Hello, $name"
```

**주요 특징:**

1. **모든 쉘 변수는 문자열이다**
2. **선언 없이도 사용할 수 있고 전부 전역 변수다**
3. **변수 설정 시 = 기호 주변에 공백이 없어야 한다**

```bash
# 올바른 예
name="Alice"
count=42

# 잘못된 예
name = "Alice"    # 에러: = 주변에 공백
count = 42        # 에러: = 주변에 공백
```

### Special Variables

쉘은 다양한 특수 변수를 제공한다.

|변수|의미|
|---|---|
|`$0`|현재 스크립트 이름|
|`$1~$9`|첫 9개의 인자|
|`$#`|인자 수|
|`$*, $@`|전체 인자 목록|
|`$?`|이전 명령의 종료 상태|
|`$!`|이전 명령의 PID|
|`$PS1`|프롬프트 문자열|
|`$IFS`|단어 분할 시 기준|

#### $0: 현재 스크립트 이름

```bash
#!/bin/bash
echo "This script is named: $0"
```

```bash
$ ./myscript.sh
This script is named: ./myscript.sh
```

#### $1~$9: 인자

```bash
#!/bin/bash
echo "First argument: $1"
echo "Second argument: $2"
```

```bash
$ ./myscript.sh hello world
First argument: hello
Second argument: world
```

#### $#: 인자 수

```bash
#!/bin/bash
echo "You passed $# arguments."
```

```bash
$ ./script.sh 1 2 3 4 5
You passed 5 arguments.
```

#### $* vs $@: 전체 인자

```bash
#!/bin/bash
echo "\$* : $*"
echo "\$@ : $@"
```

```bash
$ ./script.sh 123 1 qwdk 113porkpo
$* : 123 1 qwdk 113porkpo
$@ : 123 1 qwdk 113porkpo
```

> **참고:** `$*`와 `$@`는 기본적으로 동일하지만, 따옴표 안에서는 다르게 동작한다.

#### $?: 직전 명령 종료 상태

```bash
$ echo "hello"
hello
$ echo "$?"
0

$ ./nonexistent.sh
bash: ./nonexistent.sh: No such file or directory
$ echo "$?"
127
```

**주요 종료 코드:**

- `0`: 성공
- `1`: 일반적인 에러
- `2`: 잘못된 사용법
- `126`: 실행 권한 없음
- `127`: 명령을 찾을 수 없음

#### $!: 백그라운드 명령의 PID

```bash
#!/bin/bash
sleep 10 &
echo "PID of background process: $!"
```

#### $PS1: 프롬프트 문자열

```bash
# 프롬프트를 바꾸고 싶을 때
export PS1="MyShell> "
```

#### $IFS: 단어 분리 기준

```bash
#!/bin/bash
IFS=:
line="apple:banana:cherry"
for item in $line; do
    echo $item
done
```

**출력:**

```
apple
banana
cherry
```

**동작 과정:**

1. `IFS=:` → 단어 분리 기준을 `:`로 설정
2. `line="apple:banana:cherry"` → 콜론으로 연결된 문자열
3. `for item in $line` → `$line`이 IFS를 기준으로 나뉘어: apple, banana, cherry
4. `do echo $item` → 하나씩 출력

## Globbing → 파일 패턴 매칭

Globbing은 `*`, `?`, `[]`을 활용해 파일 이름을 패턴으로 매칭하는 기능이다.

### 기본 패턴

```bash
# 1. * : 모든 .c 파일
ls *.c

# 2. ? : 한 글자 이름 + .txt 확장자
ls ?.txt

# 3. [] : a부터 z까지 문자
ls [a-z]*

# 4. 복합 패턴: 모든 .c 또는 .h 파일
ls *.[ch]
```

### 실용적인 Globbing 예제

```bash
# 백업 파일 삭제
rm *~

# 특정 확장자 파일 찾기
find . -name "*.log"

# 숫자로 시작하는 파일
ls [0-9]*

# 대문자로 시작하는 파일
ls [A-Z]*
```

## Pipes and Redirection → 입출력 제어

쉘의 가장 강력한 기능 중 하나는 파이프(|) 및 **리디렉션**을 통한 입출력 스트림 제어다.

### 기본 리디렉션

| 연산자  | 의미            |
| ---- | ------------- |
| `<`  | 표준 입력         |
| `>`  | 표준 출력         |
| `2>` | 표준 에러 출력      |
| `>>` | 출력 추가(append) |

### 실용적인 예제

#### 입력 리디렉션

```bash
# 파일에서 단어 수 세기
wc -w < /usr/share/dict/words
```

#### 출력 리디렉션

```bash
# 결과를 파일에 저장 (덮어쓰기)
cut -d' ' -f5 > totals.txt

# 결과를 파일에 추가
stats -bmean variant-a.txt > means.txt
stats -bmean variant-b.txt >> means.txt
```

#### 에러 리디렉션

```bash
# 에러 메시지를 파일에 저장
command 2> error.log

# 정상 출력과 에러를 모두 파일에
command > output.log 2>&1

# 에러를 /dev/null로 (무시)
command 2>/dev/null
```

### 파이프라인 활용

```bash
# 파일에서 특정 패턴 찾아서 정렬
grep "error" /var/log/syslog | sort

# 프로세스 목록에서 특정 프로세스 찾기
ps aux | grep nginx

# 복잡한 파이프라인
cat /var/log/access.log | \
    grep "404" | \
    awk '{print $1}' | \
    sort | \
    uniq -c | \
    sort -nr | \
    head -10
```

## 파일 디스크립터 관리

쉘은 새로운 파일을 열지 않고도 파일 디스크립터를 복제하고 닫을 수 있다.

### 파일 디스크립터 복제 → N>&M

```bash
# 파일 디스크립터 M을 N으로 복제
echo "Could not open file" 1>&2
```

**동작 과정:**

1. `1(stdout)`을 `2(stderr)`와 같은 곳을 가리키게 복제
2. 결과적으로 echo의 출력이 stderr로 출력됨

**C 코드에서 `dup2(M, N)`과 동일**

### 파일 디스크립터 닫기: N>&-

```bash
# 출력 디스크립터 N을 닫음
N>&-

# 입력 디스크립터를 닫음
<&-

# 실제 사용 예
exec 3>&1    # FD 3에 stdout 복제
exec 3>&-    # FD 3 닫기
```

### 고급 리디렉션 예제

```bash
# stdout과 stderr를 바꾸기
command 3>&1 1>&2 2>&3 3>&-

# 로그 파일에 동시에 출력하면서 화면에도 표시
command 2>&1 | tee output.log

# 특정 파일 디스크립터를 파일로 리디렉션
exec 3> debug.log
echo "Debug info" >&3
exec 3>&-
```

## 실무에서의 Shell 활용

### 1. 로그 분석

```bash
#!/bin/bash
# 웹 서버 로그 분석 스크립트

LOG_FILE="/var/log/nginx/access.log"
DATE=$(date +%Y-%m-%d)

echo "=== 일일 로그 분석 ($DATE) ==="

# 총 요청 수
echo "총 요청 수: $(wc -l < $LOG_FILE)"

# 상위 10개 IP
echo -e "\n상위 10개 IP:"
awk '{print $1}' $LOG_FILE | sort | uniq -c | sort -nr | head -10

# 404 에러 분석
echo -e "\n404 에러 상위 10개 페이지:"
grep " 404 " $LOG_FILE | awk '{print $7}' | sort | uniq -c | sort -nr | head -10

# 시간대별 요청 분포
echo -e "\n시간대별 요청 분포:"
awk '{print $4}' $LOG_FILE | cut -d: -f2 | sort | uniq -c
```

### 2. 시스템 모니터링

```bash
#!/bin/bash
# 시스템 상태 체크 스크립트

check_disk_usage() {
    echo "--- 디스크 사용량 ---"
    df -h | awk 'NR>1 {
        usage = substr($5, 1, length($5)-1)
        if (usage > 80) {
            print "⚠️  " $0 " (사용량 높음)"
        } else {
            print "✅ " $0
        }
    }'
}

check_memory() {
    echo -e "\n--- 메모리 사용량 ---"
    free -h | head -2
}

check_services() {
    echo -e "\n--- 주요 서비스 상태 ---"
    services=("nginx" "mysql" "redis")
    
    for service in "${services[@]}"; do
        if systemctl is-active --quiet $service; then
            echo "$service: 실행 중"
        else
            echo "$service: 중지됨"
        fi
    done
}

check_disk_usage
check_memory
check_services
```

### 3. 백업 스크립트

```bash
#!/bin/bash
# 데이터베이스 백업 스크립트

DB_USER="backup_user"
DB_PASS="backup_password"
DB_NAME="production_db"
BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$DATE.sql"

# 백업 디렉터리 생성
mkdir -p $BACKUP_DIR

# 데이터베이스 백업
echo "백업 시작: $DATE"
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "백업 성공: $BACKUP_FILE"
    
    # 압축
    gzip $BACKUP_FILE
    echo "압축 완료: ${BACKUP_FILE}.gz"
    
    # 7일 이전 백업 파일 삭제
    find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
    echo "오래된 백업 파일 정리 완료"
else
    echo "백업 실패"
    exit 1
fi
```

## Shell 최적화 팁

### 1. 별칭과 함수 활용

```bash
# ~/.bashrc 또는 ~/.zshrc에 추가
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'
alias ..='cd ..'
alias ...='cd ../..'

# 유용한 함수들
mkcd() {
    mkdir -p "$1" && cd "$1"
}

extract() {
    if [ -f $1 ] ; then
        case $1 in
            *.tar.bz2)   tar xjf $1     ;;
            *.tar.gz)    tar xzf $1     ;;
            *.bz2)       bunzip2 $1     ;;
            *.rar)       unrar e $1     ;;
            *.gz)        gunzip $1      ;;
            *.tar)       tar xf $1      ;;
            *.tbz2)      tar xjf $1     ;;
            *.tgz)       tar xzf $1     ;;
            *.zip)       unzip $1       ;;
            *.Z)         uncompress $1  ;;
            *.7z)        7z x $1        ;;
            *)     echo "'$1' cannot be extracted via extract()" ;;
        esac
    else
        echo "'$1' is not a valid file"
    fi
}
```

### 2. 환경 변수 최적화

```bash
# ~/.bashrc
export EDITOR=vim
export BROWSER=firefox
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTCONTROL=ignoredups:erasedups

# 색상 지원
export CLICOLOR=1
export LS_COLORS='di=34:ln=35:so=32:pi=33:ex=31:bd=46;34:cd=43;34:su=41;30:sg=46;30'
```

### 3. 효율적인 명령어 사용

```bash
# 대신에: cat file | grep pattern
grep pattern file

# 대신에: ls | wc -l
ls | wc -l
# 더 나은 방법: find . -maxdepth 1 -type f | wc -l

# 대신에: ps aux | grep process
pgrep process

# 대신에: kill $(ps aux | grep process | awk '{print $2}')
pkill process
```