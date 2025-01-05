---
title: "Linux Command Line 정리"
slug: "linux-command-line"
date: 2024-12-21
tags: ["Linux"]
draft: true
---
Man Page Synopsis
리눅스 기반 시스템에서 명령어의 사용법을 설명하는 메뉴얼 페이지에서 제공하는 간략한 명령어 사용법 요약
...이 있는건 이어서 작성할 수 있다는 뜻
대괄호 []는 필수가 아니라는 뜻
man 옵션
1 -> 명령어
5 -> 파일
man 5 passwd
man 1 passwd 이런식으로 다르다
쉘 빌트인 명령어에 대해서는 man이 아니라 help 명령어를 사용한다

Windows의 휴지통은 파일 시스템의 기본 기능이 아니라 **Windows Explorer(탐색기)**에서 구현된 소프트웨어적인 동작입니다.

- GUI에서 삭제할 때는 파일을 휴지통으로 옮기는 특별한 프로세스가 작동합니다.
- 반면 터미널에서는 이런 특별한 로직 없이 파일을 직접 삭제

rm -d 디렉터리 삭제

rm -r 하위 파일들을 재귀적으로 삭제