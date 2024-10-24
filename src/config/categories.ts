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
  subcategories?: readonly CategoryItem[];
}

export const categories: readonly CategoryItem[] = [
  {
    name: "All",
    path: "/devlog",
    icon: LayoutGrid,
  },
  {
    name: "Algorithm",
    path: "/devlog/algorithm",
    icon: Code2,
    subcategories: [
      {
        name: "BOJ",
        path: "/devlog/algorithm/boj",
        icon: BrainCircuit,
      },
      {
        name: "Programmers",
        path: "/devlog/algorithm/programmers",
        icon: Binary,
      },
    ],
  },
  {
    name: "Data Structure",
    path: "/devlog/data-structure",
    icon: Network,
  },
  {
    name: "Frontend",
    path: "/devlog/frontend",
    icon: MonitorSmartphone,
    subcategories: [
      {
        name: "React",
        path: "/devlog/frontend/react",
        icon: SiReact,
      },
      {
        name: "Next.js",
        path: "/devlog/frontend/nextjs",
        icon: SiNextdotjs,
      },
    ],
  },
  {
    name: "Backend",
    path: "/devlog/backend",
    icon: Server,
    subcategories: [
      {
        name: "NestJS",
        path: "/devlog/backend/nestjs",
        icon: SiNestjs,
      },
      {
        name: "SpringBoot",
        path: "/devlog/backend/spring-boot",
        icon: SiSpring,
      },
    ],
  },
  {
    name: "Architecture",
    path: "/devlog/architecture",
    icon: CircuitBoard,
    subcategories: [
      {
        name: "MSA",
        path: "/devlog/architecture/msa",
        icon: Network,
      },
    ],
  },
  {
    name: "Database",
    path: "/devlog/database",
    icon: DatabaseIcon,
    subcategories: [
      {
        name: "MySQL",
        path: "/devlog/database/mysql",
        icon: SiMysql,
      },
      {
        name: "Redis",
        path: "/devlog/database/redis",
        icon: SiRedis,
      },
      {
        name: "MongoDB",
        path: "/devlog/database/mongodb",
        icon: SiMongodb,
      },
    ],
  },
  {
    name: "DevOps",
    path: "/devlog/devops",
    icon: Cloud,
    subcategories: [
      {
        name: "AWS",
        path: "/devlog/devops/aws",
        icon: SiAmazon,
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
  | "AWS";
