import {
  LayoutGrid,
  Network,
  Server,
  Database as DatabaseIcon,
  Cloud,
  CircuitBoard,
  Code2,
  MonitorSmartphone,
  BrainCircuit,
  Binary,
  BookOpen,
  Layout,
  FileCode,
  Database,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiNestjs,
  SiSpring,
  SiMysql,
  SiRedis,
  SiMongodb,
  SiAmazon,
} from "react-icons/si";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

export interface CategoryItem {
  name: string;
  path: string;
  icon: LucideIcon | IconType;
  description?: string;
  subcategories?: readonly CategoryItem[];
}

export const categories: readonly CategoryItem[] = [
  {
    name: "All",
    path: "/devlog",
    icon: LayoutGrid,
  },
  {
    name: "CS",
    path: "/devlog/categories/cs",
    icon: BrainCircuit,
    subcategories: [
      {
        name: "Data Structure",
        path: "/devlog/categories/cs/data-structure",
        icon: Network,
      },
    ],
  },
  {
    name: "Problem Solving",
    path: "/devlog/categories/problem-solving",
    icon: Binary,
  },
  {
    name: "Frontend",
    path: "/devlog/categories/frontend",
    icon: MonitorSmartphone,
    subcategories: [
      {
        name: "React",
        path: "/devlog/categories/frontend/react",
        icon: SiReact,
      },
      {
        name: "Next.js",
        path: "/devlog/categories/frontend/nextjs",
        icon: SiNextdotjs,
      },
    ],
  },
  {
    name: "Backend",
    path: "/devlog/categories/backend",
    icon: Server,
    subcategories: [
      {
        name: "NestJS",
        path: "/devlog/categories/backend/nestjs",
        icon: SiNestjs,
      },
      {
        name: "SpringBoot",
        path: "/devlog/categories/backend/spring-boot",
        icon: SiSpring,
      },
    ],
  },
  {
    name: "Architecture",
    path: "/devlog/categories/architecture",
    icon: CircuitBoard,
    subcategories: [
      {
        name: "MSA",
        path: "/devlog/categories/architecture/msa",
        icon: Network,
      },
    ],
  },
  {
    name: "Database",
    path: "/devlog/categories/database",
    icon: DatabaseIcon,
    subcategories: [
      {
        name: "MySQL",
        path: "/devlog/categories/database/mysql",
        icon: SiMysql,
      },
      {
        name: "Redis",
        path: "/devlog/categories/database/redis",
        icon: SiRedis,
      },
      {
        name: "MongoDB",
        path: "/devlog/categories/database/mongodb",
        icon: SiMongodb,
      },
    ],
  },
  {
    name: "DevOps",
    path: "/devlog/categories/devops",
    icon: Cloud,
    subcategories: [
      {
        name: "AWS",
        path: "/devlog/categories/devops/aws",
        icon: SiAmazon,
      },
    ],
  },
] as const;

export const seriesCategories: readonly CategoryItem[] = [
  {
    name: "Series",
    path: "/devlog/series",
    icon: BookOpen,
    subcategories: [
      {
        name: "devlog",
        path: "/devlog/series/devlog",
        icon: Layout,
        description:
          "Next.js와 다양한 기술을 활용해 나만의 devlog를 만드는 과정을 기록합니다.",
      },
      {
        name: "Thumbs Up",
        path: "/devlog/series/thumbs-up",
        icon: Layout,
        description: "썸네일 제작 서비스 Thumbs Up의 개발과정을 담고 있습니다.",
      },
    ],
  },
] as const;

export type Category =
  | "All"
  | "Algorithm"
  | "BOJ"
  | "Programmers"
  | "Data Structure"
  | "Frontend"
  | "React"
  | "Next.js"
  | "Backend"
  | "NestJS"
  | "SpringBoot"
  | "Architecture"
  | "MSA"
  | "Database"
  | "MySQL"
  | "Redis"
  | "MongoDB"
  | "DevOps"
  | "AWS"
  | "Series";
