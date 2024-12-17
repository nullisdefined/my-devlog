---
title: "일관성(Consistency)"
date: 2024-12-18
tags: ["Database", "Transaction", "ACID"]
category: "Database"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/432972f52003de35f8bc825a2f8d1a2d.png"
draft: true
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/432972f52003de35f8bc825a2f8d1a2d.png)

트랜잭션의 ACID 속성 중 일관성(Consistency)은 데이터의 무결성과 정확성을 보장하는 중요한 요소다. 일관성은 트랜잭션이 실행된 후 데이터베이스가 유효한 상태를 유지하도록 보장하며, 이를 위반하면 데이터 손상 또는 불일치 문제가 발생한다.
다음은 일관성의 개념, 데이터 일관성 유형들, 불일치 상황에 대해서 정리한 내용이다.

## 일관성(Consistency)이란?
- 일관성은 두 가지 유형으로 나뉜다.
	1. 일관된 데이터(데이터 무결성): 데이터 모델에 정의된 제약(e.g. 참조 무결성, 외래 키)을 만족하는 상태를 의미한다.
	2. 일관된 읽기: 트랜잭션이 변경된 값을 즉시 읽을 수 있는지 여부를 보장한다.
데이터베이스 시스템은 데이터 무결성과 읽기 일관성을 유지하면서 성능, 속도, 확장성 사이에서 균형을 찾아야 한다.