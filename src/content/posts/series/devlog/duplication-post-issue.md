---
title: "중복 포스트 문제"
slug: "duplication-post-issue"
date: 2024-11-05
tags: ["Devlog"]
category: "Series/devlog"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/969b1081b4857711adbc2a75bc3fc45f.png"
draft: false
views: 0
---
다음은 태그 기반 포스트 필터링 기능을 구현하면서 겪은 문제와 해결 과정을 정리한 내용이다.

## 문제점
블로그에 일반 포스트와 시리즈 포스트라는 두 가지 타입의 글이 존재하는데, 특정 태그로 글을 필터링 하는 기능을 구현하면서 처음에는 단순히 두 종류의 리스트를 합쳐 필터링하는 방식을 선택했다.

```ts
const allPosts = [...posts, ...seriesPosts];
return allPosts.filter((post) =>
  post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
);
```

이렇게 구현 후 테스트를 진행하니 같은 포스트가 중복해서 노출되는 문제가 생겼다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/969b1081b4857711adbc2a75bc3fc45f.png)

## 원인 분석
문제의 원인을 파악해보니
1. 시리즈 포스트가 일반 포스트로도 취급되어 두 리스트에 동일한 포스트가 존재할 수 있다.
2. 중복을 방지하는 로직이 없다.
3. 중복을 제거하는 로직이 없다.

## 해결 방안
### Map 사용하기
JS의 Map 자료구조를 활용해 문제를 해결했다. Map은 키-값 쌍을 저장하고 키의 고유성이 보장된다.

1. 고유 키 생성
	- 카테고리 + 슬러그의 조합으로 고유 키를 생성했다.
	- `${category}/${slug}` 형태로 구성
2. 중복 제거 로직 추가
```ts
const uniquePosts = new Map<string, Post>();
[...posts, ...seriesPosts].forEach((post) => {
  const uniqueKey = `${post.category}/${post.slug}`;
  if (!uniquePosts.has(uniqueKey)) {
    uniquePosts.set(uniqueKey, post);
  }
});
```

## 마무리
단순히 코드를 작성하는 것뿐만 아니라 다양한 엣지 케이스를 고려하는 것이 중요하다는 것을 다시 한 번 깨달았다.


이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/mydevlog)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.