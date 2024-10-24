export const categories = [
  {
    name: "All",
    path: "/devlog",
  },
  {
    name: "Backend",
    path: "/devlog/backend",
    subcategories: [
      {
        name: "NestJS",
        path: "/devlog/backend/nestjs",
      },
      {
        name: "SpringBoot",
        path: "/devlog/backend/spring-boot",
      },
      {
        name: "Express",
        path: "/devlog/backend/express",
      },
      {
        name: "Django",
        path: "/devlog/backend/django",
      },
    ],
  },
  {
    name: "Architecture",
    path: "/devlog/architecture",
    subcategories: [
      {
        name: "MSA",
        path: "/devlog/architecture/msa",
      },
      {
        name: "DDD",
        path: "/devlog/architecture/ddd",
      },
      {
        name: "Clean Architecture",
        path: "/devlog/architecture/clean-architecture",
      },
    ],
  },
  {
    name: "Database",
    path: "/devlog/database",
    subcategories: [
      {
        name: "MySQL",
        path: "/devlog/database/mysql",
      },
      {
        name: "PostgreSQL",
        path: "/devlog/database/postgresql",
      },
      {
        name: "MongoDB",
        path: "/devlog/database/mongodb",
      },
      {
        name: "Redis",
        path: "/devlog/database/redis",
      },
    ],
  },
  {
    name: "DevOps",
    path: "/devlog/devops",
    subcategories: [
      {
        name: "Docker",
        path: "/devlog/devops/docker",
      },
      {
        name: "Kubernetes",
        path: "/devlog/devops/kubernetes",
      },
      {
        name: "CI/CD",
        path: "/devlog/devops/cicd",
      },
      {
        name: "AWS",
        path: "/devlog/devops/aws",
      },
    ],
  },
] as const;

type ExtractCategoryNames<T> = T extends {
  name: infer N;
  subcategories?: infer S;
}
  ? N | ExtractCategoryNames<S extends readonly any[] ? S[number] : never>
  : never;

export type Category = ExtractCategoryNames<(typeof categories)[number]>;
