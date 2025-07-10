---
title: "[Spring Boot] QueryDSL 완벽 가이드"
slug: "querydsl-guide"
date: 2025-01-15
tags: ["SpringBoot", "QueryDSL", "JPA", "Database"]
category: "Frameworks/SpringBoot"
thumbnail: "https://img.shields.io/badge/QueryDSL-0769AD?style=for-the-badge&logo=java&logoColor=white"
draft: true
views: 0
---

![QueryDSL Guide](https://img.shields.io/badge/QueryDSL-0769AD?style=for-the-badge&logo=java&logoColor=white)

실무에서 애플리케이션을 개발하다 보면 단순한 CRUD를 넘어서는 복잡한 검색 기능이 필요한 경우가 많다. 전자상거래 사이트의 상품 검색, 관리 시스템의 복합 조건 필터링, 대시보드의 동적 리포트 등이 그 예다. 이런 상황에서 전통적인 JPA만으로는 한계가 명확하다.

## 실무에서 마주치는 쿼리 작성의 어려움

### 전자상거래 상품 검색의 복잡성

실제 쇼핑몰을 생각해보자. 사용자는 다음과 같은 다양한 조건으로 상품을 검색한다:

- 카테고리별 검색 (의류 > 남성 > 티셔츠)
- 가격 범위 설정 (10,000원 ~ 50,000원)
- 브랜드 필터 (나이키, 아디다스 등)
- 평점 기준 (4점 이상)
- 할인 상품 여부
- 배송 옵션 (무료배송, 당일배송)
- 재고 유무

이런 조건들이 선택적으로 적용되어야 하고, 조건의 조합에 따라 쿼리가 동적으로 변해야 한다. JPQL로 이를 구현하려면 문자열 조작과 조건 분기가 복잡해진다.

### 전통적인 JPQL의 한계

**1. 타입 안전성 부족**
```java
// 컴파일 타임에 오류를 발견할 수 없음
String jpql = "SELECT p FROM Product p WHERE p.name = :productName";
// 실행 시점에야 'name' 필드명 오타를 발견
```

**2. 동적 쿼리 작성의 복잡성**
```java
public List<Product> searchProducts(ProductSearchDto searchDto) {
    StringBuilder jpql = new StringBuilder("SELECT p FROM Product p WHERE 1=1");
    Map<String, Object> params = new HashMap<>();
    
    if (searchDto.getCategory() != null) {
        jpql.append(" AND p.category = :category");
        params.put("category", searchDto.getCategory());
    }
    if (searchDto.getMinPrice() != null) {
        jpql.append(" AND p.price >= :minPrice");
        params.put("minPrice", searchDto.getMinPrice());
    }
    // ... 수십 개의 조건들
    
    // 문자열 조작으로 인한 가독성 저하와 오류 가능성
}
```

**3. IDE 지원 부족**
문자열로 작성된 쿼리는 IDE의 자동완성, 리팩토링 지원을 받을 수 없다.

### 실제 프로젝트에서의 경험담

한 대형 쇼핑몰 프로젝트에서 상품 검색 기능을 구현할 때, 초기에는 Criteria API를 사용했다. 하지만 코드가 너무 복잡해져서 새로운 개발자가 이해하기 어려웠고, 버그 수정에도 많은 시간이 걸렸다. QueryDSL을 도입한 후 코드 가독성이 크게 개선되었고, 개발 생산성도 30% 이상 향상되었다.

## QueryDSL이란?

QueryDSL은 타입 안전한 쿼리 DSL(Domain Specific Language)을 제공하는 프레임워크다. 2008년 처음 개발되어 현재까지 지속적으로 발전하고 있으며, 전 세계 수많은 대규모 프로젝트에서 검증된 솔루션이다.

### QueryDSL이 해결하는 핵심 문제들

**1. 타입 안전성 확보**
컴파일 타임에 쿼리 오류를 발견할 수 있어 런타임 오류를 크게 줄일 수 있다.

**2. 동적 쿼리 작성 용이성**
복잡한 조건 조합도 직관적인 Java 코드로 표현할 수 있다.

**3. 코드 자동완성과 리팩토링 지원**
IDE의 모든 기능을 활용할 수 있어 개발 생산성이 향상된다.

**4. SQL과 유사한 문법**
SQL에 익숙한 개발자라면 쉽게 학습할 수 있는 직관적인 문법을 제공한다.

### QueryDSL의 장점

- **타입 안전성**: 컴파일 타임에 쿼리 오류 검출
- **가독성**: SQL과 유사한 직관적인 문법
- **동적 쿼리**: 조건에 따른 쿼리 생성 용이
- **코드 자동완성**: IDE의 자동완성 기능 활용
- **유지보수성**: 리팩토링 시 쿼리도 함께 변경됨

### JPQL vs QueryDSL

```java
// JPQL - 문자열 기반, 런타임 에러 가능
@Query("SELECT u FROM User u WHERE u.age > :age AND u.name LIKE :name")
List<User> findUsersJPQL(@Param("age") int age, @Param("name") String name);

// QueryDSL - 타입 안전, 컴파일 타임 에러 검출
public List<User> findUsersQueryDSL(int age, String name) {
    return queryFactory
        .selectFrom(user)
        .where(user.age.gt(age)
               .and(user.name.like(name)))
        .fetch();
}
```

## 설정 및 환경 구축

### 1. 의존성 추가

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'com.querydsl:querydsl-jpa:5.0.0:jakarta'
    annotationProcessor 'com.querydsl:querydsl-apt:5.0.0:jakarta'
    annotationProcessor 'jakarta.annotation:jakarta.annotation-api'
    annotationProcessor 'jakarta.persistence:jakarta.persistence-api'
}

// Q클래스 생성 설정
def querydslDir = "$buildDir/generated/querydsl"

sourceSets {
    main.java.srcDirs += [querydslDir]
}

tasks.withType(JavaCompile) {
    options.annotationProcessorGeneratedSourcesDirectory = file(querydslDir)
}

clean.doLast {
    file(querydslDir).deleteDir()
}
```

### 2. QueryDSL 설정

```java
@Configuration
@RequiredArgsConstructor
public class QueryDSLConfig {
    
    private final EntityManager entityManager;
    
    @Bean
    public JPAQueryFactory queryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
```

### 3. Q클래스 생성

엔티티를 작성한 후 gradle build를 실행하면 Q클래스가 자동 생성된다.

```java
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String email;
    
    private Integer age;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;
    
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    private List<Post> posts = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}

// 빌드 후 생성되는 Q클래스
// QUser.java
public static final QUser user = new QUser("user");

public final NumberPath<Long> id = createNumber("id", Long.class);
public final StringPath name = createString("name");
public final StringPath email = createString("email");
public final NumberPath<Integer> age = createNumber("age", Integer.class);
// ... 기타 필드들
```

## 기본 쿼리 작성

### 1. 기본 CRUD 연산

```java
@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryCustom {
    
    private final JPAQueryFactory queryFactory;
    
    private final QUser user = QUser.user;
    private final QPost post = QPost.post;
    
    // 단건 조회
    public User findByEmail(String email) {
        return queryFactory
            .selectFrom(user)
            .where(user.email.eq(email))
            .fetchOne();
    }
    
    // 여러 건 조회
    public List<User> findByAgeGreaterThan(int age) {
        return queryFactory
            .selectFrom(user)
            .where(user.age.gt(age))
            .fetch();
    }
    
    // 개수 조회
    public long countByStatus(UserStatus status) {
        return queryFactory
            .selectFrom(user)
            .where(user.status.eq(status))
            .fetchCount();
    }
    
    // 첫 번째 결과만 조회
    public User findFirstByName(String name) {
        return queryFactory
            .selectFrom(user)
            .where(user.name.eq(name))
            .fetchFirst();
    }
    
    // 존재 여부 확인
    public boolean existsByEmail(String email) {
        Integer exists = queryFactory
            .selectOne()
            .from(user)
            .where(user.email.eq(email))
            .fetchFirst();
        return exists != null;
    }
}
```

### 2. 조건절 (Where)

```java
public class UserQueryRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    
    // 기본 조건
    public List<User> findBasicConditions() {
        return queryFactory
            .selectFrom(user)
            .where(
                user.age.gt(20),           // age > 20
                user.name.isNotNull(),     // name IS NOT NULL
                user.email.isNotEmpty(),   // email != ''
                user.status.eq(UserStatus.ACTIVE)  // status = 'ACTIVE'
            )
            .fetch();
    }
    
    // 문자열 조건
    public List<User> findStringConditions(String keyword) {
        return queryFactory
            .selectFrom(user)
            .where(
                user.name.like("%" + keyword + "%"),    // LIKE '%keyword%'
                user.email.startsWith("admin"),         // email LIKE 'admin%'
                user.name.endsWith("kim"),              // name LIKE '%kim'
                user.email.contains("@gmail.com")       // email LIKE '%@gmail.com%'
            )
            .fetch();
    }
    
    // 숫자 조건
    public List<User> findNumericConditions() {
        return queryFactory
            .selectFrom(user)
            .where(
                user.age.between(20, 30),    // age BETWEEN 20 AND 30
                user.id.in(1L, 2L, 3L),     // id IN (1, 2, 3)
                user.age.notIn(25, 35),     // age NOT IN (25, 35)
                user.age.goe(18),           // age >= 18 (greater or equal)
                user.age.lt(65)             // age < 65 (less than)
            )
            .fetch();
    }
    
    // 날짜 조건
    public List<User> findDateConditions() {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        LocalDateTime lastWeek = LocalDateTime.now().minusWeeks(1);
        
        return queryFactory
            .selectFrom(user)
            .where(
                user.createdAt.after(yesterday),         // created_at > yesterday
                user.createdAt.before(LocalDateTime.now()), // created_at < now
                user.createdAt.between(lastWeek, yesterday)  // BETWEEN
            )
            .fetch();
    }
    
    // NULL 처리
    public List<User> findNullConditions() {
        return queryFactory
            .selectFrom(user)
            .where(
                user.age.isNull(),       // age IS NULL
                user.name.isNotNull()   // name IS NOT NULL
            )
            .fetch();
    }
}
```

### 3. 동적 쿼리 - BooleanBuilder

```java
@Repository
@RequiredArgsConstructor
public class UserDynamicQueryRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    
    public List<User> findUsersDynamic(UserSearchCondition condition) {
        BooleanBuilder builder = new BooleanBuilder();
        
        if (StringUtils.hasText(condition.getName())) {
            builder.and(user.name.contains(condition.getName()));
        }
        
        if (StringUtils.hasText(condition.getEmail())) {
            builder.and(user.email.eq(condition.getEmail()));
        }
        
        if (condition.getAgeGoe() != null) {
            builder.and(user.age.goe(condition.getAgeGoe()));
        }
        
        if (condition.getAgeLoe() != null) {
            builder.and(user.age.loe(condition.getAgeLoe()));
        }
        
        if (condition.getStatus() != null) {
            builder.and(user.status.eq(condition.getStatus()));
        }
        
        return queryFactory
            .selectFrom(user)
            .where(builder)
            .fetch();
    }
    
    // Where 파라미터 방식 (더 깔끔)
    public List<User> findUsersDynamicWhere(UserSearchCondition condition) {
        return queryFactory
            .selectFrom(user)
            .where(
                nameContains(condition.getName()),
                emailEq(condition.getEmail()),
                ageGoe(condition.getAgeGoe()),
                ageLoe(condition.getAgeLoe()),
                statusEq(condition.getStatus())
            )
            .fetch();
    }
    
    private BooleanExpression nameContains(String name) {
        return StringUtils.hasText(name) ? user.name.contains(name) : null;
    }
    
    private BooleanExpression emailEq(String email) {
        return StringUtils.hasText(email) ? user.email.eq(email) : null;
    }
    
    private BooleanExpression ageGoe(Integer ageGoe) {
        return ageGoe != null ? user.age.goe(ageGoe) : null;
    }
    
    private BooleanExpression ageLoe(Integer ageLoe) {
        return ageLoe != null ? user.age.loe(ageLoe) : null;
    }
    
    private BooleanExpression statusEq(UserStatus status) {
        return status != null ? user.status.eq(status) : null;
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchCondition {
    private String name;
    private String email;
    private Integer ageGoe;
    private Integer ageLoe;
    private UserStatus status;
}
```

## 조인 쿼리

### 1. 기본 조인

```java
@Repository
@RequiredArgsConstructor
public class PostQueryRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QPost post = QPost.post;
    private final QUser user = QUser.user;
    private final QComment comment = QComment.comment;
    
    // Inner Join
    public List<PostDto> findPostsWithAuthor() {
        return queryFactory
            .select(Projections.constructor(PostDto.class,
                post.id,
                post.title,
                post.content,
                user.name.as("authorName"),
                post.createdAt
            ))
            .from(post)
            .join(post.author, user)
            .fetch();
    }
    
    // Left Join
    public List<PostWithCommentCountDto> findPostsWithCommentCount() {
        return queryFactory
            .select(Projections.constructor(PostWithCommentCountDto.class,
                post.id,
                post.title,
                user.name.as("authorName"),
                comment.count().as("commentCount")
            ))
            .from(post)
            .join(post.author, user)
            .leftJoin(post.comments, comment)
            .groupBy(post.id, post.title, user.name)
            .fetch();
    }
    
    // Fetch Join (N+1 문제 해결)
    public List<Post> findPostsWithAuthorFetchJoin() {
        return queryFactory
            .selectFrom(post)
            .join(post.author, user).fetchJoin()
            .fetch();
    }
    
    // 복잡한 조인
    public List<PostDto> findPostsWithMultipleJoins(String authorName, String keyword) {
        return queryFactory
            .select(Projections.constructor(PostDto.class,
                post.id,
                post.title,
                post.content,
                user.name.as("authorName"),
                comment.count().as("commentCount")
            ))
            .from(post)
            .join(post.author, user)
            .leftJoin(post.comments, comment)
            .where(
                user.name.eq(authorName),
                post.title.contains(keyword)
            )
            .groupBy(post.id, post.title, post.content, user.name)
            .having(comment.count().gt(5))
            .fetch();
    }
}
```

### 2. 서브쿼리

```java
public class SubQueryRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    private final QPost post = QPost.post;
    
    // Scalar 서브쿼리
    public List<UserWithPostCountDto> findUsersWithPostCount() {
        QPost subPost = new QPost("subPost");
        
        return queryFactory
            .select(Projections.constructor(UserWithPostCountDto.class,
                user.id,
                user.name,
                user.email,
                JPAExpressions
                    .select(subPost.count())
                    .from(subPost)
                    .where(subPost.author.eq(user))
                    .as("postCount")
            ))
            .from(user)
            .fetch();
    }
    
    // WHERE 절 서브쿼리
    public List<User> findActiveUsers() {
        QPost subPost = new QPost("subPost");
        
        return queryFactory
            .selectFrom(user)
            .where(user.id.in(
                JPAExpressions
                    .select(subPost.author.id)
                    .from(subPost)
                    .where(subPost.createdAt.after(LocalDateTime.now().minusMonths(1)))
            ))
            .fetch();
    }
    
    // 평균값을 이용한 서브쿼리
    public List<User> findUsersOlderThanAverage() {
        return queryFactory
            .selectFrom(user)
            .where(user.age.gt(
                JPAExpressions
                    .select(user.age.avg())
                    .from(user)
            ))
            .fetch();
    }
    
    // EXISTS 서브쿼리
    public List<User> findUsersWithPosts() {
        QPost subPost = new QPost("subPost");
        
        return queryFactory
            .selectFrom(user)
            .where(JPAExpressions
                .selectOne()
                .from(subPost)
                .where(subPost.author.eq(user))
                .exists())
            .fetch();
    }
}
```

## 정렬과 페이징

### 1. 정렬

```java
public class SortingRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    
    // 기본 정렬
    public List<User> findUsersWithSorting() {
        return queryFactory
            .selectFrom(user)
            .orderBy(
                user.name.asc(),        // name ASC
                user.age.desc(),        // age DESC
                user.createdAt.desc()   // created_at DESC
            )
            .fetch();
    }
    
    // 조건부 정렬
    public List<User> findUsersWithConditionalSorting(String sortField, String direction) {
        OrderSpecifier<?> orderSpecifier;
        
        switch (sortField) {
            case "name":
                orderSpecifier = "desc".equals(direction) ? user.name.desc() : user.name.asc();
                break;
            case "age":
                orderSpecifier = "desc".equals(direction) ? user.age.desc() : user.age.asc();
                break;
            case "createdAt":
                orderSpecifier = "desc".equals(direction) ? user.createdAt.desc() : user.createdAt.asc();
                break;
            default:
                orderSpecifier = user.id.asc();
        }
        
        return queryFactory
            .selectFrom(user)
            .orderBy(orderSpecifier)
            .fetch();
    }
    
    // NULL 값 처리
    public List<User> findUsersWithNullsHandling() {
        return queryFactory
            .selectFrom(user)
            .orderBy(
                user.age.asc().nullsLast(),  // NULL 값을 마지막에
                user.name.desc().nullsFirst() // NULL 값을 처음에
            )
            .fetch();
    }
}
```

### 2. 페이징

```java
@Repository
@RequiredArgsConstructor
public class PagingRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    
    // 기본 페이징
    public List<User> findUsersWithPaging(int offset, int limit) {
        return queryFactory
            .selectFrom(user)
            .orderBy(user.id.asc())
            .offset(offset)
            .limit(limit)
            .fetch();
    }
    
    // Spring Data의 Pageable 활용
    public Page<User> findUsersWithPageable(Pageable pageable) {
        List<User> content = queryFactory
            .selectFrom(user)
            .orderBy(getOrderSpecifier(pageable))
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();
            
        long total = queryFactory
            .selectFrom(user)
            .fetchCount();
            
        return new PageImpl<>(content, pageable, total);
    }
    
    // 동적 정렬을 위한 OrderSpecifier 생성
    private OrderSpecifier<?>[] getOrderSpecifier(Pageable pageable) {
        return pageable.getSort().stream()
            .map(order -> {
                Order direction = order.isAscending() ? Order.ASC : Order.DESC;
                String property = order.getProperty();
                
                switch (property) {
                    case "name":
                        return new OrderSpecifier<>(direction, user.name);
                    case "age":
                        return new OrderSpecifier<>(direction, user.age);
                    case "createdAt":
                        return new OrderSpecifier<>(direction, user.createdAt);
                    default:
                        return new OrderSpecifier<>(direction, user.id);
                }
            })
            .toArray(OrderSpecifier[]::new);
    }
    
    // 커서 기반 페이징
    public List<User> findUsersWithCursorPaging(Long lastId, int limit) {
        BooleanExpression condition = lastId != null ? user.id.gt(lastId) : null;
        
        return queryFactory
            .selectFrom(user)
            .where(condition)
            .orderBy(user.id.asc())
            .limit(limit)
            .fetch();
    }
}
```

## 집계 함수와 그룹화

### 1. 집계 함수

```java
@Repository
@RequiredArgsConstructor
public class AggregationRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    private final QPost post = QPost.post;
    
    // 기본 집계 함수
    public UserStatistics getUserStatistics() {
        Tuple result = queryFactory
            .select(
                user.count(),           // COUNT(*)
                user.age.avg(),         // AVG(age)
                user.age.max(),         // MAX(age)
                user.age.min(),         // MIN(age)
                user.age.sum()          // SUM(age)
            )
            .from(user)
            .fetchOne();
            
        return UserStatistics.builder()
            .totalCount(result.get(user.count()))
            .averageAge(result.get(user.age.avg()))
            .maxAge(result.get(user.age.max()))
            .minAge(result.get(user.age.min()))
            .totalAge(result.get(user.age.sum()))
            .build();
    }
    
    // 조건부 집계
    public Long countActiveUsers() {
        return queryFactory
            .select(user.count())
            .from(user)
            .where(user.status.eq(UserStatus.ACTIVE))
            .fetchOne();
    }
    
    // DISTINCT COUNT
    public Long countDistinctEmails() {
        return queryFactory
            .select(user.email.countDistinct())
            .from(user)
            .fetchOne();
    }
}
```

### 2. 그룹화

```java
public class GroupByRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    private final QPost post = QPost.post;
    
    // 기본 그룹화
    public List<UserStatusCount> countUsersByStatus() {
        return queryFactory
            .select(Projections.constructor(UserStatusCount.class,
                user.status,
                user.count()
            ))
            .from(user)
            .groupBy(user.status)
            .fetch();
    }
    
    // 복합 그룹화
    public List<UserAgeGroupStats> getUserStatsByAgeGroup() {
        return queryFactory
            .select(Projections.constructor(UserAgeGroupStats.class,
                user.age.divide(10).multiply(10).as("ageGroup"), // 연령대 계산
                user.count().as("userCount"),
                user.age.avg().as("averageAge")
            ))
            .from(user)
            .groupBy(user.age.divide(10))
            .orderBy(user.age.divide(10).asc())
            .fetch();
    }
    
    // HAVING 절 사용
    public List<UserStatusCount> findActiveStatusGroups() {
        return queryFactory
            .select(Projections.constructor(UserStatusCount.class,
                user.status,
                user.count()
            ))
            .from(user)
            .groupBy(user.status)
            .having(user.count().gt(10))  // 10명 이상인 그룹만
            .fetch();
    }
    
    // 조인과 그룹화
    public List<UserPostStats> getUserPostStats() {
        return queryFactory
            .select(Projections.constructor(UserPostStats.class,
                user.id,
                user.name,
                post.count().as("postCount"),
                post.createdAt.max().as("lastPostDate")
            ))
            .from(user)
            .leftJoin(user.posts, post)
            .groupBy(user.id, user.name)
            .fetch();
    }
}
```

## DTO 프로젝션

### 1. 다양한 프로젝션 방법

```java
@Repository
@RequiredArgsConstructor
public class ProjectionRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    private final QPost post = QPost.post;
    
    // 생성자 기반 프로젝션
    public List<UserDto> findUsersWithConstructor() {
        return queryFactory
            .select(Projections.constructor(UserDto.class,
                user.id,
                user.name,
                user.email,
                user.age
            ))
            .from(user)
            .fetch();
    }
    
    // 필드 기반 프로젝션
    public List<UserDto> findUsersWithFields() {
        return queryFactory
            .select(Projections.fields(UserDto.class,
                user.id,
                user.name,
                user.email,
                user.age
            ))
            .from(user)
            .fetch();
    }
    
    // Bean 기반 프로젝션 (Setter 사용)
    public List<UserDto> findUsersWithBean() {
        return queryFactory
            .select(Projections.bean(UserDto.class,
                user.id,
                user.name,
                user.email,
                user.age
            ))
            .from(user)
            .fetch();
    }
    
    // 별칭 사용
    public List<UserSummaryDto> findUserSummaryWithAlias() {
        return queryFactory
            .select(Projections.constructor(UserSummaryDto.class,
                user.name.as("userName"),
                user.email.as("userEmail"),
                user.createdAt.as("joinDate")
            ))
            .from(user)
            .fetch();
    }
    
    // 복잡한 프로젝션
    public List<PostWithAuthorDto> findPostsWithAuthorInfo() {
        return queryFactory
            .select(Projections.constructor(PostWithAuthorDto.class,
                post.id,
                post.title,
                post.content,
                user.name.as("authorName"),
                user.email.as("authorEmail"),
                post.createdAt,
                post.comments.size().as("commentCount")
            ))
            .from(post)
            .join(post.author, user)
            .fetch();
    }
}

// DTO 클래스들
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Integer age;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private String userName;
    private String userEmail;
    private LocalDateTime joinDate;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostWithAuthorDto {
    private Long postId;
    private String title;
    private String content;
    private String authorName;
    private String authorEmail;
    private LocalDateTime createdAt;
    private Integer commentCount;
}
```

### 2. @QueryProjection 활용

```java
// DTO에 @QueryProjection 어노테이션 추가
@Data
@QueryProjection  // 이 어노테이션 추가로 Q클래스 생성
public class UserProjectionDto {
    private Long id;
    private String name;
    private String email;
    private Integer age;
    
    @QueryProjection
    public UserProjectionDto(Long id, String name, String email, Integer age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }
}

// Repository에서 타입 안전하게 사용
public List<UserProjectionDto> findUsersWithQueryProjection() {
    return queryFactory
        .select(new QUserProjectionDto(
            user.id,
            user.name,
            user.email,
            user.age
        ))
        .from(user)
        .fetch();
}
```

## 성능 최적화

### 1. 배치 크기 설정

```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 100
        order_inserts: true
        order_updates: true
        batch_versioned_data: true
```

### 2. Fetch Join 최적화

```java
@Repository
@RequiredArgsConstructor
public class OptimizedQueryRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    private final QPost post = QPost.post;
    private final QComment comment = QComment.comment;
    
    // N+1 문제 해결 - Fetch Join
    public List<Post> findPostsWithAuthor() {
        return queryFactory
            .selectFrom(post)
            .join(post.author, user).fetchJoin()
            .fetch();
    }
    
    // 컬렉션 Fetch Join 최적화 (중복 제거)
    public List<Post> findPostsWithCommentsOptimized() {
        List<Post> posts = queryFactory
            .selectFrom(post)
            .join(post.author, user).fetchJoin()
            .fetch();
            
        // 컬렉션은 별도로 한 번에 로딩
        List<Long> postIds = posts.stream()
            .map(Post::getId)
            .collect(Collectors.toList());
            
        Map<Long, List<Comment>> commentMap = queryFactory
            .selectFrom(comment)
            .join(comment.author, user).fetchJoin()
            .where(comment.post.id.in(postIds))
            .fetch()
            .stream()
            .collect(Collectors.groupingBy(c -> c.getPost().getId()));
            
        // 메모리에서 연관관계 설정
        posts.forEach(post -> {
            List<Comment> comments = commentMap.getOrDefault(post.getId(), new ArrayList<>());
            post.setComments(comments);
        });
        
        return posts;
    }
    
    // 페이징과 Fetch Join
    public Page<Post> findPostsWithAuthorPaging(Pageable pageable) {
        // Count 쿼리 (성능을 위해 별도 실행)
        long total = queryFactory
            .selectFrom(post)
            .fetchCount();
            
        // 메인 쿼리
        List<Post> content = queryFactory
            .selectFrom(post)
            .join(post.author, user).fetchJoin()
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .orderBy(post.createdAt.desc())
            .fetch();
            
        return new PageImpl<>(content, pageable, total);
    }
}
```

### 3. 인덱스 힌트와 최적화

```java
public class OptimizedRepository {
    
    private final JPAQueryFactory queryFactory;
    private final QUser user = QUser.user;
    
    // 커버링 인덱스 활용
    public List<Long> findUserIdsByCondition(UserSearchCondition condition) {
        return queryFactory
            .select(user.id)  // ID만 조회로 커버링 인덱스 활용
            .from(user)
            .where(
                nameContains(condition.getName()),
                statusEq(condition.getStatus())
            )
            .fetch();
    }
    
    // 실제 데이터는 ID로 다시 조회
    public List<User> findUsersByIds(List<Long> ids) {
        return queryFactory
            .selectFrom(user)
            .where(user.id.in(ids))
            .fetch();
    }
    
    // 조건부 인덱스 힌트 (Native Query 필요시)
    @Query(value = "SELECT * FROM users USE INDEX(idx_name_status) WHERE name LIKE ?1 AND status = ?2", 
           nativeQuery = true)
    List<User> findWithIndexHint(String name, String status);
}
```

## QueryDSL 도입 전략: 실무 적용 가이드

QueryDSL은 강력한 도구이지만 무작정 도입하기보다는 체계적인 접근이 필요하다. 실무에서 성공적으로 QueryDSL을 도입하기 위한 전략을 살펴보자.

### 단계별 도입 전략

**1단계: 작은 기능부터 시작 (1-2주)**
- 간단한 동적 검색 기능에 QueryDSL 적용
- 팀원들의 학습 곡선 고려
- 기존 JPQL과 병행 사용

**2단계: 복잡한 쿼리 마이그레이션 (3-4주)**
- 기존의 복잡한 JPQL을 QueryDSL로 전환
- 성능 비교와 검증
- 코드 리뷰를 통한 베스트 프랙티스 공유

**3단계: 전면 도입과 최적화 (1-2개월)**
- 새로운 기능은 QueryDSL 우선 사용
- 성능 모니터링과 튜닝
- 팀 전체의 역량 향상

### 실무에서 자주 겪는 문제와 해결책

**1. Q클래스 생성 문제**
*문제*: 빌드 시 Q클래스가 생성되지 않거나 IDE에서 인식하지 못함
*해결*: 
```gradle
// build.gradle 설정 점검
clean.doLast {
    file("$buildDir/generated/querydsl").deleteDir()
}

// IDE 설정에서 generated 폴더를 소스 폴더로 인식하도록 설정
```

**2. 복잡한 조건 처리**
*문제*: 너무 많은 조건이 중첩되어 가독성 저하
*해결*: 조건별로 메서드 분리하여 가독성 향상
```java
public List<Product> searchProducts(ProductSearchDto dto) {
    return queryFactory
        .selectFrom(product)
        .where(
            categoryEq(dto.getCategory()),
            priceRange(dto.getMinPrice(), dto.getMaxPrice()),
            brandIn(dto.getBrands()),
            hasStock(dto.getOnlyInStock())
        )
        .fetch();
}

private BooleanExpression categoryEq(String category) {
    return category != null ? product.category.eq(category) : null;
}

private BooleanExpression priceRange(Integer minPrice, Integer maxPrice) {
    if (minPrice == null && maxPrice == null) return null;
    if (minPrice != null && maxPrice != null) {
        return product.price.between(minPrice, maxPrice);
    }
    if (minPrice != null) return product.price.goe(minPrice);
    return product.price.loe(maxPrice);
}
```

**3. 성능 최적화 전략**

**쿼리 실행 계획 분석**
```java
@Component
@Slf4j
public class QueryPerformanceMonitor {
    
    @EventListener
    public void handleQueryExecuted(QueryExecutedEvent event) {
        if (event.getExecutionTime() > 1000) { // 1초 이상 소요된 쿼리
            log.warn("Slow query detected: {} ms - {}", 
                    event.getExecutionTime(), event.getQuery());
        }
    }
}
```

**캐시 전략 적용**
```java
@Service
@RequiredArgsConstructor
public class ProductSearchService {
    
    private final ProductQueryRepository productQueryRepository;
    
    @Cacheable(value = "productSearch", key = "#searchDto.cacheKey()")
    public List<ProductDto> searchProducts(ProductSearchDto searchDto) {
        return productQueryRepository.searchProducts(searchDto);
    }
    
    @CacheEvict(value = "productSearch", allEntries = true)
    public void clearProductSearchCache() {
        // 상품 정보 변경 시 캐시 무효화
    }
}
```

### 팀 교육과 코딩 컨벤션

**QueryDSL 코딩 컨벤션 예시**

```java
/**
 * QueryDSL Repository 작성 가이드라인
 */
@Repository
@RequiredArgsConstructor
public class UserQueryRepository {
    
    private final JPAQueryFactory queryFactory;
    
    // 1. Q클래스는 static final로 선언
    private static final QUser user = QUser.user;
    private static final QPost post = QPost.post;
    
    // 2. 메서드명은 용도를 명확히 표현
    public List<User> findActiveUsersByAgeRange(int minAge, int maxAge) {
        return queryFactory
            .selectFrom(user)
            .where(
                user.status.eq(UserStatus.ACTIVE),
                user.age.between(minAge, maxAge)
            )
            .orderBy(user.createdAt.desc())
            .fetch();
    }
    
    // 3. 복잡한 조건은 별도 메서드로 분리
    private BooleanExpression isActiveUser() {
        return user.status.eq(UserStatus.ACTIVE)
                   .and(user.deletedAt.isNull());
    }
    
    // 4. 페이징은 별도 메서드로 구성
    public Page<User> findUsersWithPaging(UserSearchDto searchDto, Pageable pageable) {
        List<User> content = getUsers(searchDto, pageable);
        long total = getUserCount(searchDto);
        
        return new PageImpl<>(content, pageable, total);
    }
    
    private List<User> getUsers(UserSearchDto searchDto, Pageable pageable) {
        return queryFactory
            .selectFrom(user)
            .where(buildSearchConditions(searchDto))
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .orderBy(getOrderSpecifier(pageable))
            .fetch();
    }
}
```

### 성능 벤치마킹과 모니터링

**QueryDSL vs JPQL 성능 비교**
```java
@Component
@Slf4j
public class QueryPerformanceTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserQueryRepository userQueryRepository;
    
    @EventListener(ApplicationReadyEvent.class)
    public void performanceTest() {
        // JPQL 성능 측정
        long jpqlStartTime = System.currentTimeMillis();
        userRepository.findActiveUsersByCustomQuery();
        long jpqlTime = System.currentTimeMillis() - jpqlStartTime;
        
        // QueryDSL 성능 측정
        long querydslStartTime = System.currentTimeMillis();
        userQueryRepository.findActiveUsers();
        long querydslTime = System.currentTimeMillis() - querydslStartTime;
        
        log.info("JPQL: {}ms, QueryDSL: {}ms", jpqlTime, querydslTime);
    }
}
```

### 마이그레이션 체크리스트

**기존 JPQL에서 QueryDSL로 전환 시 확인사항**

- [ ] 기존 쿼리의 성능 기준점 설정
- [ ] QueryDSL 버전과 스프링 부트 호환성 확인
- [ ] Q클래스 생성 자동화 설정
- [ ] 팀원 교육 계획 수립
- [ ] 점진적 마이그레이션 계획
- [ ] 코드 리뷰 체크리스트 작성
- [ ] 성능 모니터링 시스템 구축
- [ ] 롤백 계획 수립

### QueryDSL 활용 분야별 가이드

**1. 전자상거래 플랫폼**
- 복잡한 상품 검색 (다중 필터, 정렬)
- 주문 내역 조회 (기간별, 상태별)
- 재고 관리 쿼리

**2. 관리자 대시보드**
- 통계 쿼리 (일별, 월별 집계)
- 사용자 행동 분석
- 리포트 생성

**3. 소셜 미디어 서비스**
- 타임라인 조회 (팔로우 기반)
- 실시간 알림 쿼리
- 컨텐츠 추천 알고리즘

## 마무리

QueryDSL은 단순한 쿼리 도구가 아니라 애플리케이션의 데이터 접근 계층을 혁신하는 기술이다. 타입 안전성과 가독성을 모두 확보하면서도 복잡한 비즈니스 로직을 효율적으로 구현할 수 있다.

### 성공적인 QueryDSL 도입을 위한 핵심 원칙

**1. 점진적 도입**: 한 번에 모든 것을 바꾸려 하지 말고 작은 기능부터 시작
**2. 팀 역량 강화**: 개인이 아닌 팀 전체의 QueryDSL 이해도 향상
**3. 성능 의식**: 편리함에만 의존하지 말고 항상 성능을 고려
**4. 지속적 개선**: 모니터링을 통한 지속적인 쿼리 최적화
**5. 문서화**: 복잡한 쿼리는 주석과 문서로 의도를 명확히 전달

QueryDSL을 도입한다는 것은 단순히 새로운 기술을 사용하는 것이 아니라, 더 나은 코드 품질과 개발 생산성을 추구하는 것이다. 이 가이드가 여러분의 프로젝트에서 QueryDSL을 성공적으로 활용하는 데 도움이 되기를 바란다.

### 추가 학습 자료

**필수 도서**
- 『실전! QueryDSL』 - 김영한
- 『Java Persistence with Spring Data and Hibernate』

**온라인 강의**
- 인프런 QueryDSL 강의 시리즈
- 백엔드 개발자를 위한 QueryDSL 실무 가이드

**공식 문서**
- [QueryDSL Reference Guide](http://www.querydsl.com/static/querydsl/latest/reference/html/)
- [Spring Data JPA with QueryDSL](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#core.extensions.querydsl)

**커뮤니티**
- [QueryDSL GitHub Repository](https://github.com/querydsl/querydsl)
- Stack Overflow QueryDSL 태그 