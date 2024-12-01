---
title: "GraphQL이란?"
date: 2024-11-30
tags: ["NodeJS", "GraphQL"]
category: "Backend/NodeJS"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/35467ed7b1bf2f0acd84f17735f7f7b7.png"
draft: true
---

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/35467ed7b1bf2f0acd84f17735f7f7b7.png)

## REST API의 문제점
### Over Fetching
필요한 것보다 더 많은 데이터를 받게 되는 상황을 의미한다. 예를 들어 `GET /api/movies/1`과 같이 영화에 대한 데이터를 조회할 때,
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
  "cast": [...], // 수십 명의 배우 정보
  "reviews": [...] // 수백 개의 리뷰 정보
}
```
이런 식으로 응답이 올 수 있다. 만약 이 데이터 중에서 필요한 정보가 단순히 제목, 포스터, 평점뿐이라면? 나머지 필요하지 않은 많은 데이터를 불필요하게 받고 있는 것이 된다. 이는 성능의 저하로 이어진다.

### Under Fetching 문제
원하는 정보를 얻기 위해서 여러 번의 API 요청이 필요한 상황을 의미한다. 위와 동일한 REST API 예시에서 영화 정보를 받았을 때 (`GET /api/movies/1`)
```json
{
	"title": "인셉션",
	"genre": [17, 21, 26],
	// ... 다른 영화 정보들
}
```
이 데이터를 실제로 화면에 렌더링하려면 장르 정보를 알아야 하므로 다시 API를 호출해야 한다. (`GET /api/genres`)
```json
// 응답
{
  "genres": [
    { "id": 17, "name": "SF" },
    { "id": 21, "name": "액션" },
    { "id": 26, "name": "드라마" }
  ]
}
```
이러한 구조의 문제점은 다음과 같다.
1. 불필요한 추가 API 요청이 발생함
2. 첫 번째 요청의 데이터를 받고 나서야 두 번째 요청을 할 수 있음
3. 프론트엔드에서 데이터를 조합하는 추가 작업이 필요함

GraphQL으로 이러한 문제점을 해결할 수 있다.
## GraphQL의 쿼리 구조
```graphql
query {
  movie(id: "1") {
    title
    genres {  # 중첩된 필드로 장르 정보를 바로 요청
      id
      name
    }
  }
}

# 응답
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
GraphQL은 클라이언트가 필요한 데이터를 정확하게 특정할 수 있다. 위 쿼리는 영화 정보 중 제목, 장르만을 요청하고 서버는 요청받은 필드만 정확히 반환하여 불필요한 데이터 전송이 발생하지 않는다.

또한 Under Fetching 문제도 GraphQL의 중첩 쿼리 기능으로 해결할 수 있는데 위와 같이 중첩된 필드 구조로 요청했을 때 원하는 정보를 바로 가져올 수 있다.

## GraphQL 주요 장점
#### 효율적인 데이터 로딩
앞서 보았듯 필요한 데이터만 정확히 요청하여 여러 리소스를 한 번의 요청으로 가져올 수 있다.

#### 스키마(Schema)
스키마를 통해 API에서 사용할 수 있는 데이터의 형태를 명확하게 정의할 수 있다. 
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
이런 식으로 정의한다.
REST에서의 API 문서는 별개로 만들고, 문서가 업데이트되지 않으면 실제 API와 문서 간의 불일치가 발생할 수 있다. 반면 GraphQL의 스키마는 실행 가능한 문서다. 그래서 다음과 같은 이점을 얻게 된다.
1. 스키마에 정의된 타입이 실제 코드의 타입이 됨
2. 컴파일 시점에 타입 오류 발견 가능
3. 런타임 에러 사전 방지
4. 자동 완성 지원

## Apollo Server
Apollo Server는 GraphQL API를 구축하기 위한 가장 인기있는 서버 라이브러리다. Node.js 환경에서 동작하며, GraphQL 스펙을 완벽하게 구현하면서도 개발자 경험을 크게 향상시켜주는 다양한 기능을 제공한다.