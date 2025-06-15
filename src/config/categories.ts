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
  GitBranch,
  Wrench,
  Wifi,
  Cpu,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiNestjs,
  SiSpring,
  SiAmazon,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiDocker,
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
    name: "All Posts",
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
      {
        name: "Database",
        path: "/devlog/categories/cs/database",
        icon: DatabaseIcon,
      },
      {
        name: "Network Programming",
        path: "/devlog/categories/cs/network-programming",
        icon: Wifi,
      },
      {
        name: "System Programming",
        path: "/devlog/categories/cs/system-programming",
        icon: Cpu,
      },
    ],
  },
  {
    name: "Languages",
    path: "/devlog/categories/languages",
    icon: Code2,
    subcategories: [
      {
        name: "JavaScript",
        path: "/devlog/categories/languages/javascript",
        icon: SiJavascript,
      },
      {
        name: "TypeScript",
        path: "/devlog/categories/languages/typescript",
        icon: SiTypescript,
      },
    ],
  },
  {
    name: "Frameworks",
    path: "/devlog/categories/frameworks",
    icon: Server,
    subcategories: [
      {
        name: "Node.js",
        path: "/devlog/categories/frameworks/nodejs",
        icon: SiNodedotjs,
      },
      {
        name: "NestJS",
        path: "/devlog/categories/frameworks/nestjs",
        icon: SiNestjs,
      },
      {
        name: "SpringBoot",
        path: "/devlog/categories/frameworks/spring-boot",
        icon: SiSpring,
      },
    ],
  },
  {
    name: "Tools",
    path: "/devlog/categories/tools",
    icon: Wrench,
    subcategories: [
      {
        name: "Git",
        path: "/devlog/categories/tools/git",
        icon: GitBranch,
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
        name: "Devlog",
        path: "/devlog/series/devlog",
        icon: Layout,
        description:
          "Next.js와 다양한 기술을 활용해 블로그를 구축하고 발전시켜 나가는 과정을 기록합니다.",
      },
      {
        name: "Thumbs Up",
        path: "/devlog/series/thumbs-up",
        icon: Layout,
        description:
          "썸네일 제작 도구 Thumbs Up을 개발하면서 경험한 기능 구현과 개선 과정을 공유합니다.",
      },
      {
        name: "Git Clone",
        path: "/devlog/series/git-clone",
        icon: Layout,
        description:
          "버전 관리 도구 git의 핵심 기능들을 Node.js로 구현하는 과정을 기록합니다.",
      },
    ],
  },
] as const;

export type Category =
  | "All"
  | "CS"
  | "Data Structure"
  | "Database"
  | "Network Programming"
  | "System Programming"
  | "Languages"
  | "JavaScript"
  | "TypeScript"
  | "Frameworks"
  | "Node.js"
  | "NestJS"
  | "SpringBoot"
  | "Tools"
  | "Git"
  | "Series";
