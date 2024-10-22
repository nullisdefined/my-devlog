interface TagConfig {
  light: string;
  dark: string;
}

// 기본 태그 설정
export const defaultTagConfigs: Record<string, TagConfig> = {
  // Backend 관련
  NodeJS: {
    light: "bg-mint-100 text-mint-700",
    dark: "dark:bg-mint-900/30 dark:text-mint-100",
  },
  NestJS: {
    light: "bg-coral-100 text-coral-700",
    dark: "dark:bg-coral-900/30 dark:text-coral-100",
  },
  Express: {
    light: "bg-sage-100 text-sage-700",
    dark: "dark:bg-sage-900/30 dark:text-sage-100",
  },
  TypeScript: {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  JavaScript: {
    light: "bg-lemon-100 text-lemon-700",
    dark: "dark:bg-lemon-900/30 dark:text-lemon-100",
  },
  Python: {
    light: "bg-lavender-100 text-lavender-700",
    dark: "dark:bg-lavender-900/30 dark:text-lavender-100",
  },
  Django: {
    light: "bg-peach-100 text-peach-700",
    dark: "dark:bg-peach-900/30 dark:text-peach-100",
  },
  Flask: {
    light: "bg-lilac-100 text-lilac-700",
    dark: "dark:bg-lilac-900/30 dark:text-lilac-100",
  },
  Java: {
    light: "bg-apricot-100 text-apricot-700",
    dark: "dark:bg-apricot-900/30 dark:text-apricot-100",
  },
  Spring: {
    light: "bg-mint-100 text-mint-700",
    dark: "dark:bg-mint-900/30 dark:text-mint-100",
  },
  "Spring Boot": {
    light: "bg-peach-100 text-peach-700",
    dark: "dark:bg-peach-900/30 dark:text-peach-100",
  },
  "Spring Security": {
    light: "bg-lavender-100 text-lavender-700",
    dark: "dark:bg-lavender-900/30 dark:text-lavender-100",
  },
  "Spring Data JPA": {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  Go: {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  Rust: {
    light: "bg-coral-100 text-coral-700",
    dark: "dark:bg-coral-900/30 dark:text-coral-100",
  },

  // Database 관련
  MySQL: {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  PostgreSQL: {
    light: "bg-lavender-100 text-lavender-700",
    dark: "dark:bg-lavender-900/30 dark:text-lavender-100",
  },
  MongoDB: {
    light: "bg-mint-100 text-mint-700",
    dark: "dark:bg-mint-900/30 dark:text-mint-100",
  },
  Redis: {
    light: "bg-coral-100 text-coral-700",
    dark: "dark:bg-coral-900/30 dark:text-coral-100",
  },
  Elasticsearch: {
    light: "bg-lemon-100 text-lemon-700",
    dark: "dark:bg-lemon-900/30 dark:text-lemon-100",
  },
  Cassandra: {
    light: "bg-peach-100 text-peach-700",
    dark: "dark:bg-peach-900/30 dark:text-peach-100",
  },
  DynamoDB: {
    light: "bg-sage-100 text-sage-700",
    dark: "dark:bg-sage-900/30 dark:text-sage-100",
  },
  Neo4j: {
    light: "bg-lilac-100 text-lilac-700",
    dark: "dark:bg-lilac-900/30 dark:text-lilac-100",
  },

  // Architecture 관련
  MSA: {
    light: "bg-lilac-100 text-lilac-700",
    dark: "dark:bg-lilac-900/30 dark:text-lilac-100",
  },
  DDD: {
    light: "bg-peach-100 text-peach-700",
    dark: "dark:bg-peach-900/30 dark:text-peach-100",
  },
  "Clean Architecture": {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  "Hexagonal Architecture": {
    light: "bg-mint-100 text-mint-700",
    dark: "dark:bg-mint-900/30 dark:text-mint-100",
  },
  "Event-Driven": {
    light: "bg-coral-100 text-coral-700",
    dark: "dark:bg-coral-900/30 dark:text-coral-100",
  },
  CQRS: {
    light: "bg-lavender-100 text-lavender-700",
    dark: "dark:bg-lavender-900/30 dark:text-lavender-100",
  },
  Serverless: {
    light: "bg-lemon-100 text-lemon-700",
    dark: "dark:bg-lemon-900/30 dark:text-lemon-100",
  },

  // DevOps 관련
  Docker: {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  Kubernetes: {
    light: "bg-lavender-100 text-lavender-700",
    dark: "dark:bg-lavender-900/30 dark:text-lavender-100",
  },
  AWS: {
    light: "bg-apricot-100 text-apricot-700",
    dark: "dark:bg-apricot-900/30 dark:text-apricot-100",
  },
  "CI/CD": {
    light: "bg-mint-100 text-mint-700",
    dark: "dark:bg-mint-900/30 dark:text-mint-100",
  },
  Jenkins: {
    light: "bg-coral-100 text-coral-700",
    dark: "dark:bg-coral-900/30 dark:text-coral-100",
  },
  "GitLab CI": {
    light: "bg-peach-100 text-peach-700",
    dark: "dark:bg-peach-900/30 dark:text-peach-100",
  },
  Terraform: {
    light: "bg-lilac-100 text-lilac-700",
    dark: "dark:bg-lilac-900/30 dark:text-lilac-100",
  },
  Ansible: {
    light: "bg-sage-100 text-sage-700",
    dark: "dark:bg-sage-900/30 dark:text-sage-100",
  },
  Prometheus: {
    light: "bg-lemon-100 text-lemon-700",
    dark: "dark:bg-lemon-900/30 dark:text-lemon-100",
  },
  Grafana: {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },

  // 알고리즘 관련
  알고리즘: {
    light: "bg-lavender-100 text-lavender-700",
    dark: "dark:bg-lavender-900/30 dark:text-lavender-100",
  },
  자료구조: {
    light: "bg-mint-100 text-mint-700",
    dark: "dark:bg-mint-900/30 dark:text-mint-100",
  },
  "동적 프로그래밍": {
    light: "bg-peach-100 text-peach-700",
    dark: "dark:bg-peach-900/30 dark:text-peach-100",
  },
  "그래프 이론": {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  BOJ: {
    light: "bg-lemon-100 text-lemon-700",
    dark: "dark:bg-lemon-900/30 dark:text-lemon-100",
  },
  프로그래머스: {
    light: "bg-coral-100 text-coral-700",
    dark: "dark:bg-coral-900/30 dark:text-coral-100",
  },
  LeetCode: {
    light: "bg-lilac-100 text-lilac-700",
    dark: "dark:bg-lilac-900/30 dark:text-lilac-100",
  },

  // Node.js 관련
  "Express.js": {
    light: "bg-sage-100 text-sage-700",
    dark: "dark:bg-sage-900/30 dark:text-sage-100",
  },
  "Koa.js": {
    light: "bg-apricot-100 text-apricot-700",
    dark: "dark:bg-apricot-900/30 dark:text-apricot-100",
  },
  Sequelize: {
    light: "bg-lavender-100 text-lavender-700",
    dark: "dark:bg-lavender-900/30 dark:text-lavender-100",
  },
  Mongoose: {
    light: "bg-mint-100 text-mint-700",
    dark: "dark:bg-mint-900/30 dark:text-mint-100",
  },

  // 컴퓨터 구조 관련
  CPU: {
    light: "bg-peach-100 text-peach-700",
    dark: "dark:bg-peach-900/30 dark:text-peach-100",
  },
  메모리: {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  캐시: {
    light: "bg-lemon-100 text-lemon-700",
    dark: "dark:bg-lemon-900/30 dark:text-lemon-100",
  },
  운영체제: {
    light: "bg-coral-100 text-coral-700",
    dark: "dark:bg-coral-900/30 dark:text-coral-100",
  },

  // 네트워크 관련
  "TCP/IP": {
    light: "bg-lilac-100 text-lilac-700",
    dark: "dark:bg-lilac-900/30 dark:text-lilac-100",
  },
  HTTP: {
    light: "bg-sage-100 text-sage-700",
    dark: "dark:bg-sage-900/30 dark:text-sage-100",
  },
  "REST API": {
    light: "bg-apricot-100 text-apricot-700",
    dark: "dark:bg-apricot-900/30 dark:text-apricot-100",
  },
  WebSocket: {
    light: "bg-lavender-100 text-lavender-700",
    dark: "dark:bg-lavender-900/30 dark:text-lavender-100",
  },

  // React 관련
  React: {
    light: "bg-mint-100 text-mint-700",
    dark: "dark:bg-mint-900/30 dark:text-mint-100",
  },
  Redux: {
    light: "bg-peach-100 text-peach-700",
    dark: "dark:bg-peach-900/30 dark:text-peach-100",
  },
  "React Hooks": {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  "Next.js": {
    light: "bg-lemon-100 text-lemon-700",
    dark: "dark:bg-lemon-900/30 dark:text-lemon-100",
  },

  // React Native 관련
  "React Native": {
    light: "bg-coral-100 text-coral-700",
    dark: "dark:bg-coral-900/30 dark:text-coral-100",
  },
  Expo: {
    light: "bg-lilac-100 text-lilac-700",
    dark: "dark:bg-lilac-900/30 dark:text-lilac-100",
  },
  "React Navigation": {
    light: "bg-sage-100 text-sage-700",
    dark: "dark:bg-sage-900/30 dark:text-sage-100",
  },
};

// 새로운 태그를 위한 색상 세트
const colorSets: TagConfig[] = [
  {
    light: "bg-lavender-100 text-lavender-700",
    dark: "dark:bg-lavender-900/30 dark:text-lavender-100",
  },
  {
    light: "bg-mint-100 text-mint-700",
    dark: "dark:bg-mint-900/30 dark:text-mint-100",
  },
  {
    light: "bg-peach-100 text-peach-700",
    dark: "dark:bg-peach-900/30 dark:text-peach-100",
  },
  {
    light: "bg-sky-100 text-sky-700",
    dark: "dark:bg-sky-900/30 dark:text-sky-100",
  },
  {
    light: "bg-lemon-100 text-lemon-700",
    dark: "dark:bg-lemon-900/30 dark:text-lemon-100",
  },
  {
    light: "bg-coral-100 text-coral-700",
    dark: "dark:bg-coral-900/30 dark:text-coral-100",
  },
  {
    light: "bg-lilac-100 text-lilac-700",
    dark: "dark:bg-lilac-900/30 dark:text-lilac-100",
  },
  {
    light: "bg-sage-100 text-sage-700",
    dark: "dark:bg-sage-900/30 dark:text-sage-100",
  },
  {
    light: "bg-apricot-100 text-apricot-700",
    dark: "dark:bg-apricot-900/30 dark:text-apricot-100",
  },
];

// 동적 태그 설정을 위한 Map (런타임에서만 사용)
const dynamicTagConfigs = new Map<string, TagConfig>();

export function getTagConfig(tag: string): TagConfig {
  // 1. 기본 설정에서 확인
  if (defaultTagConfigs[tag]) {
    return defaultTagConfigs[tag];
  }

  // 2. 동적 설정에서 확인
  if (dynamicTagConfigs.has(tag)) {
    return dynamicTagConfigs.get(tag)!;
  }

  // 3. 새로운 태그의 경우 해시 기반으로 일관된 색상 할당
  const colorIndex = getHashIndex(tag, colorSets.length);
  const newConfig = colorSets[colorIndex];
  dynamicTagConfigs.set(tag, newConfig);

  return newConfig;
}

// 태그 문자열로부터 일관된 인덱스 생성
function getHashIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) % max;
}
