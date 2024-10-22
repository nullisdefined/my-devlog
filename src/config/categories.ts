export const categories = [
  {
    name: "All",
    path: "/devlog",
    description: "모든 게시글",
  },
  {
    name: "Backend",
    path: "/devlog/backend",
    description: "백엔드 개발 관련 게시글",
  },
  {
    name: "Architecture",
    path: "/devlog/architecture",
    description: "소프트웨어 아키텍처 관련 게시글",
  },
  {
    name: "Database",
    path: "/devlog/database",
    description: "데이터베이스 관련 게시글",
  },
  {
    name: "DevOps",
    path: "/devlog/devops",
    description: "DevOps 관련 게시글",
  },
] as const;

export type Category = (typeof categories)[number]["name"];
