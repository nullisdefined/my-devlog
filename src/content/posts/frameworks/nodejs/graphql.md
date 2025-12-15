---
title: "GraphQL이란?"
slug: "graphql"
date: 2024-11-30
tags: ["NodeJS", "GraphQL"]
category: "Frameworks/NodeJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/35467ed7b1bf2f0acd84f17735f7f7b7.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/35467ed7b1bf2f0acd84f17735f7f7b7.png)

많은 프로젝트에서 REST API가 기본으로 사용되지만, 그 구조적인 한계로 인해 데이터 전송에 비효율이 발생할 때가 있다. 대표적으로 Over Fetching과 Under Fetching 문제다.

## REST API의 문제점

### 1. Over Fetching
필요한 것보다 더 많은 데이터를 받아 성능 저하를 유발하는 상황을 의미한다. 예를 들어, 영화 데이터를 불러오는 다음과 같은 요청을 가정해보자.

```json
// 서버 응답
{
  "id": 1,
  "title": "인셉션",
  "director": "크리스토퍼 놀란",
  "releaseDate": "2010-07-21",
  "runtime": 148,
  "synopsis": "베테랑 도둑 코브는 꿈의 기술을 이용해...",
  "budget": 160000000,
  "boxOffice": 836836967,
  "language": "English",
  "country": "United States",
  "genre": [17, 21, 26],
  "rating": 8.8,
  "posterUrl": "https://...",
  "trailerUrl": "https://...",
  "cast": [...],
  "reviews": [...]
}
```

클라이언트가 단순히 제목, 포스터, 평점만 필요하다면 위와 같은 응답은 불필요한 데이터를 과도하게 포함한다.

### 2. Under Fetching
반대로 필요한 데이터를 얻기 위해 여러 번의 요청을 해야 하는 상황도 있다. 예를 들어, 영화 데이터만 받으면 장르를 출력하기 위해 추가 API 호출이 필요하다.
```json
// 영화 데이터 요청
GET /api/movies/1
{
	"title": "인셉션",
	"genre": [17, 21, 26]
}
```

```json
// 장르 데이터 요청
GET /api/genres
{
  "genres": [
    { "id": 17, "name": "SF" },
    { "id": 21, "name": "액션" },
    { "id": 26, "name": "드라마" }
  ]
}
```

이러한 구조의 문제점은 다음과 같은 문제를 초래한다.
1. 추가 요청이 필요해 성능이 저하됨
2. 요청 순서에 따라 데이터 조합이 복잡해짐
3. 프론트엔드에서 데이터 조합의 부담이 커짐

## GraphQL로 해결하기
GraphQL은 클라이언트가 필요한 데이터만 정확하게 요청하도록 설계된 쿼리 언어다.
위 REST의 예시를 GraphQL로 바꿔보면 다음과 같다.

```graphql
query {
  movie(id: "1") {
    title
    genres { 
      id
      name
    }
  }
}
```
응답 결과는 다음과 같다.

```graphql
{
  "data": {
    "movie": {
      "title": "인셉션",
      "genres": [
        { "id": 17, "name": "SF" },
        { "id": 21, "name": "액션" },
        { "id": 26, "name": "드라마" }
      ]
    }
  }
}
```

클라이언트는 필요한 데이터만 요청할 수 있고, 서버는 그에 맞게 최적의 응답을 반환한다. Over Fetching과 Under Fetching 문제를 동시에 해결할 수 있다.

## GraphQL 주요 장점

### 1. 효율적인 데이터 로딩
- 여러 리소스를 한 번의 요청으로 가져올 수 있다.
- 불필요한 데이터 전송을 방지한다.

### 2. 스키마 기반 개발
GraphQL은 API의 데이터 구조를 스키마로 정의한다.
```graphql
type Movie {
  id: ID!
  title: String!
  director: Director!
  rating: Float
  genres: [Genre!]!
}

type Director {
  id: ID!
  name: String!
  films: [Movie!]!
}
```

스키마를 통해 다음과 같은 이점이 생긴다.
1. API의 데이터 구조를 명확히 정의
2. 컴파일 시점에 타입 오류 감지
3. 문서와 코드의 불일치 방지
4. IDE의 자동 완성과 타입 지원

## 마치며
REST API의 한계인 Over Fetching과 Under Fetching 문제는 GraphQL을 통해 해결할 수 있다. 필요한 데이터만 정확히 가져오고, 한 번의 요청으로 효율적으로 데이터를 전송하는 구조는 특히 프론트엔드와 백엔드 간 데이터 통신의 부담을 크게 줄여준다. 그리고 Apollo Server와 같은 도구를 사용하면 GraphQL API를 더 쉽게 구축하고 관리할 수 있다. REST에서 벗어나 더 유연하고 효율적인 데이터 접근을 고민한다면 GraphQL은 충분히 시도해볼 가치가 있어보인다.