/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Mail,
  FileText,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  X,
  Trophy,
} from "lucide-react";
import {
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiC,
  SiJavascript,
  SiTypescript,
  SiDocker,
  SiAmazon,
  SiGit,
  SiGithub,
  SiMysql,
  SiPostgresql,
  SiMariadb,
  SiReact,
  SiTailwindcss,
  SiNextdotjs,
  SiCplusplus,
  SiVisualstudiocode,
  SiSlack,
  SiTrello,
  SiSwagger,
  SiNotion,
  SiOracle,
  SiSpringboot,
  SiConfluence,
  SiJira,
  SiJenkins,
  SiGithubactions,
  SiTypeorm,
  SiSpring,
  SiGithubpages,
  SiVite,
  SiGooglecloud,
  SiSwift,
  SiAwslambda,
  SiNginx,
  SiJsonwebtokens,
  SiStyledcomponents,
  SiSocketdotio,
  SiAmazonec2,
  SiAmazons3,
  SiAmazonsqs,
} from "react-icons/si";
import Image from "next/image";

import { FaJava } from "react-icons/fa";

import ThemeToggle from "@/components/theme-toggle";
import Footer from "@/components/footer";
import { useEffect, useState, useRef } from "react";

// 이미지 모달 컴포넌트
const ImageModal = ({
  isOpen,
  onClose,
  src,
  alt,
}: {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* 모달 배경 클릭시 닫기 */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {/* 이미지 컨테이너 */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
        <div className="relative flex items-center justify-center max-w-[60vw] max-h-[55vh]">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
            sizes="90vw"
          />
        </div>
      </div>
    </div>
  );
};

// ProjectCard 컴포넌트
const ProjectCard = ({
  project,
  onImageClick,
}: {
  project: any;
  onImageClick: (src: string, alt: string) => void;
}) => {
  const handleImageClick = () => {
    onImageClick(project.image, project.title);
  };

  const roleColorMap: { [key: string]: string } = {
    Backend: "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
    FullStack:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  };
  const roleColor =
    roleColorMap[project.role as keyof typeof roleColorMap] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  return (
    <div className="bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {project.image && (
        <div className="relative w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-t-lg">
          <div
            className="relative w-full cursor-pointer"
            onClick={handleImageClick}
          >
            <Image
              src={project.image}
              alt={project.title}
              width={800}
              height={600}
              className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* 확대 힌트 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
            <div className="bg-white/90 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        {/* 프로젝트 제목 및 설명 */}
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base lg:text-lg">
                {project.title}
              </h3>
              {project.role && (
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-md ${roleColor}`}
                >
                  {project.role}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {project.period}
            </p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* 주요 기능 */}
        {/*<div className="space-y-2 mt-4">
          <h4 className="font-semibold text-sm">주요 기능:</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm leading-relaxed">
            {project.features.map((feature: string, idx: number) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>*/}

        {/* 기술 스택 */}
        <div className="space-y-2 mt-3">
          <h4 className="font-semibold text-sm">기술 스택:</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((tech: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors bg-muted/50 px-2 py-1 rounded text-xs"
              >
                <span className="text-xs">{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 레포지토리 버튼 */}
        <div className="mt-auto pt-4 space-y-2">
          {project.pdf && (
            <Button variant="secondary" className="w-full text-sm" asChild>
              <Link
                href={project.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                Presentation
              </Link>
            </Button>
          )}
          <Button variant="outline" className="w-full text-sm" asChild>
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <SiGithub className="mr-2 h-4 w-4" />
              Repository
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [modalImage, setModalImage] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
  }>({
    isOpen: false,
    src: "",
    alt: "",
  });

  const heroRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 이미지 모달 열기
  const openImageModal = (src: string, alt: string) => {
    setModalImage({ isOpen: true, src, alt });
  };

  // 이미지 모달 닫기
  const closeImageModal = () => {
    setModalImage({ isOpen: false, src: "", alt: "" });
  };

  const skills = [
    {
      category: "Languages",
      techs: [
        { name: "C", icon: <SiC className="h-4 w-4" /> },
        { name: "C++", icon: <SiCplusplus className="h-4 w-4" /> },
        { name: "Java", icon: <FaJava className="h-4 w-4" /> },
        { name: "JavaScript", icon: <SiJavascript className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
      ],
    },
    {
      category: "Frontend",
      techs: [
        { name: "React", icon: <SiReact className="h-4 w-4" /> },
        { name: "Next.js", icon: <SiNextdotjs className="h-4 w-4" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="h-4 w-4" /> },
        {
          name: "Emotion CSS",
          icon: (
            <Image
              src="https://raw.githubusercontent.com/emotion-js/emotion/main/emotion.png"
              alt="Emotion CSS"
              width={16}
              height={16}
              className="h-4 w-4 filter grayscale"
            />
          ),
        },
        {
          name: "Zustand",
          icon: (
            <Image
              src="https://zustand-demo.pmnd.rs/logo512.png"
              alt="Zustand"
              width={16}
              height={16}
              className="h-4 w-4 filter grayscale"
            />
          ),
        },
      ],
    },
    {
      category: "Backend",
      techs: [
        { name: "Node.js", icon: <SiNodedotjs className="h-4 w-4" /> },
        { name: "Express", icon: <SiExpress className="h-4 w-4" /> },
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "TypeORM", icon: <SiTypeorm className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
      ],
    },
    {
      category: "Tools",
      techs: [
        { name: "VSCode", icon: <SiVisualstudiocode className="h-4 w-4" /> },
        { name: "Git", icon: <SiGit className="h-4 w-4" /> },
        { name: "GitHub", icon: <SiGithub className="h-4 w-4" /> },
        { name: "Notion", icon: <SiNotion className="h-4 w-4" /> },
        { name: "Slack", icon: <SiSlack className="h-4 w-4" /> },
        { name: "Swagger", icon: <SiSwagger className="h-4 w-4" /> },
        { name: "Confluence", icon: <SiConfluence className="h-4 w-4" /> },
      ],
    },
  ];

  const projects = [
    {
      title: "나날모아",
      period: "24.08 ~ 25.02",
      role: "Backend",
      description:
        "시니어와 가족 사용자를 대상으로 하는 AI 기반 자동 일정 관리 서비스입니다. 음성 인식, OCR, NLP를 활용하여 편리한 일정 등록을 지원합니다.",
      features: [
        "Hot reload, 전역 파이프, 로거, Swagger 등을 포함한 NestJS + TypeORM 백엔드 부트스트랩",
        "일정·회원·공유 모듈 CRUD와 JWT 기반 권한 체계를 설계해 일정 공유 흐름 일원화",
        "QueryRunner → `typeorm-transactional` 래퍼로 트랜잭션을 공통화하여 멀티 모듈 ACID 보장",
        "RDS 기반 스키마 설계 및 TypeORM 마이그레이션으로 일정/공유/권한 관계 정규화",
        "EC2 + Docker Compose + GitHub Actions 배포 파이프라인으로 서버/Swagger 페이지 자동 배포",
      ],
      tech: [
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "TypeORM", icon: <SiTypeorm className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
        { name: "EC2", icon: <SiAmazonec2 className="h-4 w-4" /> },
        { name: "Nginx", icon: <SiNginx className="h-4 w-4" /> },
        { name: "JWT", icon: <SiJsonwebtokens className="h-4 w-4" /> },
        {
          name: "OAuth2",
          icon: (
            <div className="h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
              OA
            </div>
          ),
        },
      ],
      link: "https://github.com/nanalmoa/nanalmoa",
      image:
        "https://storage.googleapis.com/hotsix-bucket/%EB%82%98%EB%82%A0%EB%AA%A8%EC%95%84.png",
      pdf: "/nanalmoa.pdf",
    },
    {
      title: "할 사람?",
      period: "25.06 ~ 25.08",
      role: "FullStack",
      description:
        "지역 기반 번개모임 커뮤니티 서비스입니다. AI가 생성한 미션을 수행하며 포인트를 획득하고, 같은 지역 사람들과 오프라인 모임을 가질 수 있습니다.",
      features: [
        "Passport-kakao/naver/google 전략과 HTTP-Only 쿠키로 카카오·네이버·구글 소셜 로그인 UX 통합",
        "DynamoDB 미션/인증 데이터를 Aurora PostgreSQL로 마이그레이션하며 4개 핵심 테이블 정규화",
        "NestJS Scheduler와 cron 잡으로 모집→활동→정산까지 모임 상태 전환과 패널티 자동화",
        "Socket.IO 게이트웨이로 채팅방/메시지/읽음 이벤트를 설계하고 React 채팅 뷰와 연동",
        "Service Worker + VAPID 키로 웹 푸시 구독/전송 파이프라인을 구축, 오프라인 사용자만 타겟팅",
        "React에서 S3 Presigned URL 업로드·미션 상세 API·주간 뷰 UI를 연결해 풀스택 플로우 완성",
      ],
      tech: [
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "TypeORM", icon: <SiTypeorm className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
        { name: "JWT", icon: <SiJsonwebtokens className="h-4 w-4" /> },
        {
          name: "OAuth2",
          icon: (
            <div className="h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
              OA
            </div>
          ),
        },
        { name: "React", icon: <SiReact className="h-4 w-4" /> },
        {
          name: "Styled Components",
          icon: <SiStyledcomponents className="h-4 w-4" />,
        },
        {
          name: "Zustand",
          icon: (
            <Image
              src="https://zustand-demo.pmnd.rs/logo512.png"
              alt="Zustand"
              width={16}
              height={16}
              className="h-4 w-4"
            />
          ),
        },
        {
          name: "JSQR",
          icon: (
            <div className="h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
              QR
            </div>
          ),
        },
        { name: "Socket.IO", icon: <SiSocketdotio className="h-4 w-4" /> },
      ],
      link: "https://github.com/NIPA-AWS-Developer-2nd",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/24275eb6388f806c391d867e58a79cb5.png",
      pdf: "/halsaram.pdf",
    },
    {
      title: "한땀한땀",
      period: "25.03 ~ 25.09",
      role: "Backend",
      description:
        "개인의 다양한 목표 달성과 꾸준한 습관 형성을 돕는 AI 기반 소셜 챌린지 플랫폼입니다. HealthKit을 연동한 AppleWatch 자동 인증과 AI 이미지 분석을 통해 신뢰도 높은 챌린지 환경을 제공합니다.",
      features: [
        "Terraform 모듈로 VPC·ALB·ECR·ECS on EC2·RDS·CloudFront까지 IaC로 관리",
        "VPC Endpoint만 활용하는 프라이빗 네트워크와 ACM/Route53 기반 HTTPS 경로 구축",
        "SQS → Lambda 워커로 사진 인증 비동기 처리 후 관리자 모더레이션 큐에 적재",
        "Socket.IO 채팅 API 명세와 인증 플로우를 설계해 앱-서버 간 계약을 명확히 문서화",
        "CloudWatch 사용자/정책 발급 및 Agent 구성으로 로그·메트릭 수집 체계를 마련",
        "챗봇 알림·운영 메시지 시나리오를 정의해 인증 경험을 실시간화",
      ],
      tech: [
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "TypeORM", icon: <SiTypeorm className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
        { name: "Socket.IO", icon: <SiSocketdotio className="h-4 w-4" /> },
        { name: "JWT", icon: <SiJsonwebtokens className="h-4 w-4" /> },
        {
          name: "OAuth2",
          icon: (
            <div className="h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
              OA
            </div>
          ),
        },
        { name: "Docker", icon: <SiDocker className="h-4 w-4" /> },
        {
          name: "ECR",
          icon: (
            <div className="h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
              ECR
            </div>
          ),
        },
        {
          name: "ECS",
          icon: (
            <div className="h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
              ECS
            </div>
          ),
        },
        { name: "S3", icon: <SiAmazons3 className="h-4 w-4" /> },
        {
          name: "CloudFront",
          icon: (
            <div className="h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
              CF
            </div>
          ),
        },
        { name: "Lambda", icon: <SiAwslambda className="h-4 w-4" /> },
        { name: "SQS", icon: <SiAmazonsqs className="h-4 w-4" /> },
        {
          name: "Bedrock",
          icon: (
            <div className="h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
              BR
            </div>
          ),
        },
      ],
      link: "https://github.com/SOAPFT/soapft_backend",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bf10d5f4f6dd3bc64cedf9b0dff5fd73.png",
      pdf: "/soapft.pdf",
    },
    {
      title: "한모아",
      period: "25.09 ~ 25.12",
      role: "Backend",
      description:
        "영어 화자의 음색과 운율을 보존한 자연스러운 한국어 더빙 음성을 생성하는 AI 더빙 서비스입니다. STT-TTS 및 S2ST 융합형 교차 언어 음성 합성 기술을 활용하여, 화자 분리, 음성 인식, 번역, TTS, 자막 생성까지 전 과정을 자동화합니다.",
      features: [
        "Project–VideoAsset–DubJob–Segment로 이어지는 TypeORM ERD 및 관계 옵션 구성",
        "Presigned URL 발급부터 업로드 완료 체크·DubJob 자동 생성까지의 영상 처리 자동화",
        "NestJS Devtools로 모듈 의존성과 라우팅 구조 시각화·디버깅",
      ],
      tech: [
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
        { name: "JWT", icon: <SiJsonwebtokens className="h-4 w-4" /> },
        {
          name: "OAuth2",
          icon: (
            <div className="h-4 w-4 flex items-center justify-center text-[10px] font-semibold">
              OA
            </div>
          ),
        },
        { name: "SQS", icon: <SiAmazonsqs className="h-4 w-4" /> },
        { name: "S3", icon: <SiAmazons3 className="h-4 w-4" /> },
      ],
      link: "https://github.com/ssu-capstone-team-4/hanmoa-backend",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/6d07cf3fdd5e2da20d4745ab23eb8ada.png",
    },
  ];

  // 마운트되지 않은 경우 빈 화면 반환 (테마 깜빡임 방지)
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* 이미지 모달 */}
      <ImageModal
        isOpen={modalImage.isOpen}
        onClose={closeImageModal}
        src={modalImage.src}
        alt={modalImage.alt}
      />

      {/* 테마 토글 버튼 */}
      <div
        className={`fixed top-6 right-6 z-50 ${
          modalImage.isOpen ? "z-40" : "z-50"
        }`}
      >
        <div className="backdrop-blur-sm bg-black/40 dark:bg-white/40 rounded-full p-1.5 border border-white/20 dark:border-black/20 [&_button]:bg-transparent [&_button_svg]:text-white dark:[&_button_svg]:text-black [&_button:hover]:bg-white/10 dark:[&_button:hover]:bg-black/10 [&_button]:border-none [&_button:focus]:ring-0 [&_button:focus]:outline-none [&_button]:shadow-none">
          <ThemeToggle />
        </div>
      </div>

      <main className="min-h-screen bg-background">
        {/* 히어로 섹션 */}
        <section
          ref={heroRef}
          className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50
dark:bg-black dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-black text-black dark:text-white flex items-center justify-center relative overflow-hidden"
        >
          {/* 배경 그라디언트 */}
          <div className="absolute inset-0 pointer-events-none"></div>

          {/* 하단 블러 효과 */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none z-20 backdrop-blur-md"></div>

          <div className="relative z-10 text-center max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-none mb-6 sm:mb-8 lg:mb-12">
              <span className="block text-black dark:text-white drop-shadow-md">
                WEB
              </span>
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-extrabold drop-shadow-lg">
                DEVELOPER
              </span>
            </h1>

            <div className="mb-4 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto rounded-full overflow-hidden ring-2 ring-gray-300 dark:ring-gray-700">
                <Image
                  src="https://storage.googleapis.com/hotsix-bucket/KakaoTalk_20241022_185833320.jpg"
                  alt="Profile"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mb-2 sm:mb-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 dark:text-gray-300 mb-1">
                Jaewoo Kim
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400">
                Full Stack Developer
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-2">
              사용자 삶의 질 향상에 있어 변화의 물결을 주도하고, 그 물결의 크기
              자체를 키우며 다양한 분야에 영향력을 행사하는 웹 개발의 무한한
              가능성에 동력을 보태고 싶습니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-10 sm:mb-12 px-3">
              <Link
                href="/devlog"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-black font-semibold rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
              >
                <FileText className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                DEVLOG
              </Link>
              <Link
                href="https://github.com/nullisdefined"
                target="_blank"
                rel="noopener noreferrer"
                className="
inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3
bg-gray-800 text-white font-semibold rounded-full
hover:bg-gray-900 hover:scale-105 hover:shadow-lg
transition-all duration-300 transform text-xs sm:text-sm

dark:bg-gray-800 dark:text-gray-100
dark:hover:bg-gray-700 dark:hover:scale-105 dark:hover:shadow-lg
"
              >
                <SiGithub className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
                GITHUB
              </Link>
            </div>
          </div>

          {/* 스크롤 인디케이터 */}
          <div className="absolute bottom-10 sm:bottom-10 lg:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
            <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </section>

        {/* 프로젝트 섹션 - 그리드 형태 */}
        <section
          ref={projectsRef}
          id="projects"
          className="py-20 bg-gradient-to-b from-background to-muted/50"
        >
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none">
                  <span
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent
                                 drop-shadow-lg relative
                                 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 dark:opacity-80 px-1"
                  >
                    PROJECTS
                  </span>
                </h2>
                {/* 배경 텍스트 효과 */}
                <div className="absolute inset-0 -z-10">
                  <span
                    className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none
                                 text-gray-100 dark:text-gray-700 opacity-50 blur-sm"
                  >
                    PROJECTS
                  </span>
                </div>
                {/* 언더라인 효과 */}
                <div
                  className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 lg:w-36 h-0.5
                                bg-gradient-to-r from-blue-600 to-purple-600 rounded-full
                                dark:from-blue-400 dark:to-purple-400 dark:opacity-70"
                ></div>
              </div>
            </div>

            {/* 프로젝트 카드 그리드 */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  onImageClick={openImageModal}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Experience 섹션 */}
        <section
          id="experience"
          className="py-20 bg-[#f5f5f5] dark:bg-[#262626]"
        >
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none">
                  <span
                    className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent
                               drop-shadow-lg relative
                               dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 dark:opacity-80"
                  >
                    EXPERIENCE
                  </span>
                </h2>
                {/* 배경 텍스트 효과 */}
                <div className="absolute inset-0 -z-10">
                  <span
                    className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none
                               text-gray-100 dark:text-gray-700 opacity-50 blur-sm"
                  >
                    EXPERIENCE
                  </span>
                </div>
                {/* 언더라인 효과 */}
                <div
                  className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 lg:w-44 h-0.5
                              bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full
                              dark:from-emerald-400 dark:to-cyan-400 dark:opacity-70"
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Experience 카드 */}
              <div className="bg-card rounded-lg shadow-md p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Experience
                </h3>
                <ul className="space-y-3 pl-3 pb-3">
                  <li>
                    <div className="font-semibold text-sm">
                      소프트웨어학부 재학
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      숭실대학교
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2022.03 ~ 2027.03
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">
                      타입스크립트로 함께하는 웹 풀 사이클 개발(React, Node.js)
                      3기 수료
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      그렙(프로그래머스)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2024.04 ~ 2024.10
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">
                      [NIPA-AWS] Developer 부트캠프 2기 수료
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      한국소프트웨어산업협회
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2025.06 ~ 2025.08
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">
                      2025 SW 인재 페스티벌 숭실대학교 부스 운영
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      소프트웨어중심대학협의회
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2025.11.28 ~ 11.29
                    </div>
                  </li>
                </ul>
              </div>

              {/* Certifications 카드 */}
              <div className="bg-card rounded-lg shadow-md p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Certifications
                </h3>
                <ul className="space-y-3 pl-3 pb-3">
                  <li>
                    <div className="font-semibold text-sm">정보처리기능사</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      한국산업인력공단
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">
                      네트워크관리사 2급
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      한국정보통신자격협회
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">SQLD</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      한국데이터산업진흥원
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">ADsP</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      한국데이터산업진흥원
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">
                      AWS Certified Solutions Architect - Associate (SAA-C03)
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Amazon Web Services
                    </div>
                  </li>
                </ul>
              </div>

              {/* Awards 카드 */}
              <div className="bg-card rounded-lg shadow-md p-3 sm:p-4 lg:col-span-2">
                <h3 className="text-base sm:text-lg font-bold mb-3 flex items-center">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" />
                  Awards
                </h3>
                <ul className="space-y-3 pl-3 pb-3">
                  <li>
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>숭실대학교 소프트웨어 공모전 총장상</span>
                      <Link
                        href="/award-ssu-sw-contest-2025.pdf"
                        target="_blank"
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex-shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      숭실대학교 소프트웨어학부
                    </div>
                    <div className="text-xs text-muted-foreground">2025.08</div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>
                        NIPA-AWS Developer 부트캠프 2기 최종 프로젝트 대상
                      </span>
                      <Link
                        href="/award-nipa-aws-bootcamp-2025.pdf"
                        target="_blank"
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex-shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      한국소프트웨어산업협회
                    </div>
                    <div className="text-xs text-muted-foreground">2025.08</div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">
                      숭실대학교 IT 프로젝트 공모전 프로리그 우수상
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      숭실대학교 미디어경영학과
                    </div>
                    <div className="text-xs text-muted-foreground">2025.11</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Skills 섹션 */}
        <section className="py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center mb-16 flex justify-center">
              <div className="relative inline-block px-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none">
                  <span
                    className="bg-gradient-to-r from-gray-900 via-slate-700 to-zinc-900 bg-clip-text text-transparent
                                 drop-shadow-lg relative
                                 dark:from-gray-300 dark:via-slate-400 dark:to-gray-300 px-1"
                  >
                    SKILLS
                  </span>
                </h2>
                {/* 배경 텍스트 효과 */}
                <div className="absolute inset-0 -z-10">
                  <span
                    className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none
                                 text-gray-200 dark:text-gray-700 opacity-50 blur-sm"
                  >
                    SKILLS
                  </span>
                </div>
                {/* 언더라인 효과 */}
                <div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 lg:w-32 h-1
                                bg-gradient-to-r from-slate-800 via-gray-700 to-zinc-800 rounded-full
                                dark:from-gray-500 dark:via-slate-400 dark:to-gray-500"
                ></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full justify-items-center">
                {skills.map((skill) => (
                  <div
                    key={skill.category}
                    className="p-4 sm:p-5 bg-card rounded-lg shadow-lg h-full w-full max-w-sm"
                  >
                    <h3 className="font-bold mb-3 text-base sm:text-lg">
                      {skill.category}
                    </h3>
                    <ul className="space-y-2.5 pl-4">
                      {skill.techs.map((tech) => (
                        <li
                          key={tech.name}
                          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
                        >
                          {tech.icon}
                          <span>{tech.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
