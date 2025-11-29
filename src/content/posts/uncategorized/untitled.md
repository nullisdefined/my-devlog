---
title: "스테이징 상태 관리하기"
slug: "untitled"
date: 2025-01-25
tags: []
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/1cacdfa02414a2a9841aa69b5b031f58.png"
draft: true
views: 0
---
기존 pit add시 blob으로만 저장하고 스테이징 상태는 전혀 기록하지 않아 스테이징 관리의 기능이 없었다. 이번에는 스테이징 상태를 기록하는 기능을 추가하고, 커밋에서 스테이징 상태를 사용해본다.

## 스테이징 영역 추가하기

`.pit/index` 파일을 만들어 스테이징된 파일과 해시를 관리할 수 있도록 했다.




![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com//images/1cacdfa02414a2a9841aa69b5b031f58.png)

하지만..
파일의 변경 여부를 확인하지 않고 무조건 스테이징에 포함하는 문제가 있다.

이를 해결하기 위해 파일의 변경 여부를 확인하고, 변경된 파일에 대해서만 .pit/index에 추가해야 한다. git의 방식대로 blob 해시를 비교하여 이미 저장된 blob과 동일하면 스테이징하지 않도록 처리했다.




---
이 프로젝트의 모든 소스 코드는 [GitHub]()에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.