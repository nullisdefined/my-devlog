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
  isActive,
  onImageClick,
}: {
  project: any;
  isActive: boolean;
  onImageClick: (src: string, alt: string) => void;
}) => {
  const handleImageClick = (e: React.MouseEvent) => {
    console.log("Image clicked!", { isActive, image: project.image }); // 디버깅용
    if (isActive) {
      e.stopPropagation();
      e.preventDefault();
      onImageClick(project.image, project.title);
    }
  };

  return (
    <div
      className={`bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-500 h-[700px] lg:h-[740px] w-full max-w-sm lg:max-w-md flex flex-col ${
        isActive ? "shadow-xl" : ""
      }`}
    >
      {project.image && (
        <div className="relative w-full h-32 lg:h-36 bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-t-lg">
          <div
            className={`relative w-full h-full ${
              isActive ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={handleImageClick}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-contain transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 1200px) 100vw, 33vw"
            />
          </div>
          {!isActive && (
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />
          )}

          {/* 확대 힌트 아이콘 - 활성 카드에서만 표시 */}
          {isActive && (
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
          )}
        </div>
      )}
      <div className={`p-3 lg:p-4 flex-1 flex flex-col`}>
        {/* 프로젝트 제목 및 설명 */}
        <div className="space-y-1.5 lg:space-y-2">
          <div className="space-y-0.5">
            <h3
              className={`font-bold ${
                isActive ? "text-base lg:text-lg" : "text-sm lg:text-base"
              }`}
            >
              {project.title}
            </h3>
            <p
              className={`text-xs lg:text-sm text-blue-600 dark:text-blue-400 font-medium`}
            >
              {project.period}
            </p>
          </div>
          <p className={`text-xs text-muted-foreground leading-relaxed`}>
            {project.description}
          </p>
        </div>

        {/* 주요 기능 */}
        <div className="space-y-1.5 lg:space-y-2 mt-3 lg:mt-4">
          <h4
            className={`font-semibold ${
              isActive ? "text-xs lg:text-sm" : "text-xs"
            }`}
          >
            주요 기능:
          </h4>
          <ul
            className={`list-disc list-inside space-y-0.5 text-muted-foreground ${
              isActive ? "text-xs" : "text-xs"
            } leading-relaxed`}
          >
            {project.features.map((feature: string, idx: number) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* 기술 스택 */}
        <div className="space-y-1.5 lg:space-y-2 mt-2 lg:mt-3">
          <h4
            className={`font-semibold ${
              isActive ? "text-xs lg:text-sm" : "text-xs"
            }`}
          >
            기술 스택:
          </h4>
          <div className="flex flex-wrap gap-1 lg:gap-1.5">
            {project.tech.map((tech: any, idx: number) => (
              <div
                key={idx}
                className={`flex items-center space-x-0.5 text-muted-foreground hover:text-foreground transition-colors bg-muted/50 px-1.5 py-0.5 rounded ${
                  isActive ? "text-xs" : "text-xs"
                }`}
              >
                <span className="text-xs">{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 레포지토리 버튼 */}
        <div className="mt-auto pt-3 lg:pt-4">
          <Button
            variant={isActive ? "outline" : "ghost"}
            className={`w-full ${isActive ? "text-xs" : "text-xs"}`}
            asChild
          >
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <SiGithub className="mr-1.5 h-3 w-3" />
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
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
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
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 이미지 모달 열기
  const openImageModal = (src: string, alt: string) => {
    console.log("Opening modal with:", { src, alt }); // 디버깅용
    setModalImage({ isOpen: true, src, alt });
  };

  // 이미지 모달 닫기
  const closeImageModal = () => {
    setModalImage({ isOpen: false, src: "", alt: "" });
  };

  // 현재 섹션이 히어로인지 확인하는 함수
  const isInHeroSection = () => {
    if (!heroRef.current) return false;
    const heroRect = heroRef.current.getBoundingClientRect();
    return heroRect.top <= 100 && heroRect.bottom > 100;
  };

  // 프로젝트 섹션으로 스크롤
  const scrollToProjects = () => {
    if (projectsRef.current && !isScrolling) {
      setIsScrolling(true);
      projectsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  // 히어로 섹션으로 스크롤
  const scrollToHero = () => {
    if (heroRef.current && !isScrolling) {
      setIsScrolling(true);
      heroRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  // 히어로 섹션에서의 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling || modalImage.isOpen) return;

      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const inHero = isInHeroSection();

      // 히어로 섹션에서 아래로 스크롤할 때만 트리거
      if (inHero && e.deltaY > 0) {
        e.preventDefault();

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          scrollToProjects();
        }, 50);
      }
      // 프로젝트 섹션 상단 부근에서 위로 스크롤할 때 히어로로 이동
      else if (!inHero && e.deltaY < 0) {
        // 프로젝트 섹션의 상단 200px 이내에서 위로 스크롤할 때
        const projectsElement = projectsRef.current;
        if (projectsElement) {
          const projectsRect = projectsElement.getBoundingClientRect();
          const isNearProjectsTop =
            projectsRect.top >= -200 && projectsRect.top <= 200;

          if (isNearProjectsTop) {
            e.preventDefault();

            if (scrollTimeoutRef.current) {
              clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
              scrollToHero();
            }, 50);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isScrolling, modalImage.isOpen]);

  // 키보드 네비게이션 (프로젝트 변경용)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (modalImage.isOpen) return;

      if (e.key === "ArrowLeft") {
        prevProject();
      } else if (e.key === "ArrowRight") {
        nextProject();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [modalImage.isOpen]);

  // 터치 이벤트 (히어로 섹션에서만)
  useEffect(() => {
    let startY = 0;
    let endY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling || modalImage.isOpen) return;

      endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;
      const inHero = isInHeroSection();

      if (Math.abs(deltaY) > 50) {
        // 최소 스와이프 거리
        if (inHero && deltaY > 0) {
          // 히어로에서 아래로 스와이프
          scrollToProjects();
        } else if (!inHero && deltaY < 0) {
          // 프로젝트 섹션 상단 부근에서 위로 스와이프
          const projectsElement = projectsRef.current;
          if (projectsElement) {
            const projectsRect = projectsElement.getBoundingClientRect();
            const isNearProjectsTop =
              projectsRect.top >= -200 && projectsRect.top <= 200;

            if (isNearProjectsTop) {
              scrollToHero();
            }
          }
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isScrolling, modalImage.isOpen]);

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
      ],
    },
    {
      category: "Database",
      techs: [
        { name: "MariaDB", icon: <SiMariadb className="h-4 w-4" /> },
        { name: "MySQL", icon: <SiMysql className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
        { name: "Oracle", icon: <SiOracle className="h-4 w-4" /> },
      ],
    },
    {
      category: "DevOps",
      techs: [
        { name: "GitHub", icon: <SiGithub className="h-4 w-4" /> },
        { name: "Docker", icon: <SiDocker className="h-4 w-4" /> },
        { name: "AWS", icon: <SiAmazon className="h-4 w-4" /> },
        {
          name: "GitHub Actions",
          icon: <SiGithubactions className="h-4 w-4" />,
        },
        { name: "Jenkins", icon: <SiJenkins className="h-4 w-4" /> },
      ],
    },
    {
      category: "Tools",
      techs: [
        { name: "VSCode", icon: <SiVisualstudiocode className="h-4 w-4" /> },
        { name: "Git", icon: <SiGit className="h-4 w-4" /> },
        { name: "Notion", icon: <SiNotion className="h-4 w-4" /> },
        { name: "Slack", icon: <SiSlack className="h-4 w-4" /> },
        { name: "Swagger", icon: <SiSwagger className="h-4 w-4" /> },
        { name: "Confluence", icon: <SiConfluence className="h-4 w-4" /> },
      ],
    },
  ];

  const projects = [
    {
      title: "핫식스 팀 블로그",
      period: "24.06 ~ 24.07",
      description:
        "팀 단위의 특별한 협업 공간을 제공하는 웹 서비스입니다. 팀원이 작성한 게시글을 쉽게 공유하고 관리할 수 있습니다.",
      features: [
        "팀 단위의 게시글 관리",
        "사용자 인증 및 권한 관리",
        "풍부한 에디터 기능",
        "댓글 및 좋아요 기능",
        "이메일 인증을 통한 비밀번호 변경",
        "공개/비공개 게시글 설정",
      ],
      tech: [
        { name: "Node.js", icon: <SiNodedotjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "MySQL", icon: <SiMysql className="h-4 w-4" /> },
        { name: "GCP", icon: <SiGooglecloud className="h-4 w-4" /> },
      ],
      link: "https://github.com/nullisdefined/hotsix-teamblog",
      image:
        "https://storage.googleapis.com/hotsix-bucket/%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%80.gif",
    },
    {
      title: "Travel Manager",
      period: "24.08",
      description:
        "여행 일정과 경비를 효율적으로 관리할 수 있는 서비스입니다. 각 여행지별 일정을 등록하고 경비를 실시간으로 관리할 수 있습니다.",
      features: [
        "여행별 일정 관리",
        "실시간 경비 추적",
        "활동별 상세 기록",
        "여행지별 통화 자동 변환",
        "일정 순서 관리",
        "경비 카테고리 관리",
      ],
      tech: [
        { name: "Node.js", icon: <SiNodedotjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "MySQL", icon: <SiMysql className="h-4 w-4" /> },
      ],
      link: "https://github.com/Programmers-3th-Team-Kim/travel-manager",
      image: "https://storage.googleapis.com/hotsix-bucket/travelmanager.png",
    },

    {
      title: "나날모아",
      period: "24.08 ~ 25.02",
      description:
        "시니어와 가족 사용자를 대상으로 하는 AI 기반 자동 일정 관리 서비스입니다. 음성 인식, OCR, NLP를 활용하여 편리한 일정 등록을 지원합니다.",
      features: [
        "음성 인식을 통한 자동 일정 등록",
        "이미지 인식(OCR)을 통한 일정 추출",
        "시니어 케어 공유 서비스",
        "카테고리별 일정 관리",
        "가족/간병인과의 일정 공유",
        "자연어 처리를 통한 일정 분석",
      ],
      tech: [
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "Node.js", icon: <SiNodedotjs className="h-4 w-4" /> },
        { name: "AWS", icon: <SiAmazon className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
      ],
      link: "https://github.com/nanalmoa/nanalmoa",
      image:
        "https://storage.googleapis.com/hotsix-bucket/%EB%82%98%EB%82%A0%EB%AA%A8%EC%95%84.png",
    },
    {
      title: "Thumbs Up",
      period: "25.03",
      description:
        "직관적이고 간편한 썸네일 제작 도구입니다. 다양한 레이아웃과 배경 옵션을 제공하여 누구나 쉽게 썸네일 이미지를 만들 수 있습니다. 실시간 미리보기 기능으로 즉시 결과를 확인하고 수정할 수 있어 효율적인 디자인 작업이 가능합니다.",
      features: [
        "다양한 레이아웃 템플릿 제공",
        "그라데이션, 단색, 이미지 배경 지원",
        "실시간 텍스트 편집 및 미리보기",
        "폰트 선택 및 텍스트 스타일링",
        "색상 팔레트 및 랜덤 셔플 기능",
        "썸네일 클립보드 복사 또는 다운로드",
      ],
      tech: [
        { name: "React", icon: <SiReact className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "Vite", icon: <SiVite className="h-4 w-4" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="h-4 w-4" /> },
        { name: "Github Pages", icon: <SiGithubpages className="h-4 w-4" /> },
      ],
      link: "https://github.com/nullisdefined/thumbs-up",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3047408d471022f63f3ce761cda03b9a.gif",
    },
    {
      title: "오운완 (오늘운동완료)",
      period: "25.04 ~ 25.06",
      description:
        "운동 습관 형성과 커뮤니티 기반 동기부여를 위한 웹 기반 운동 인증 플랫폼입니다. 사용자들이 운동 인증 사진을 실시간으로 촬영하여 공유하고, 그룹 단위의 경쟁과 협업을 통해 자연스럽게 운동 습관을 형성할 수 있도록 지원합니다.",
      features: [
        "실시간 사진 촬영을 통한 운동 인증",
        "그룹 기반 경쟁 및 랭킹 시스템",
        "통계 대시보드",
        "스트릭(연속 출석) 기록 관리",
        "피드 상호작용 (좋아요, 댓글)",
        "인증글 공개 범위 제어 (전체/그룹 공개)",
        "시간대별 운동 패턴 분석",
      ],
      tech: [
        { name: "Node.js", icon: <SiNodedotjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "AWS", icon: <SiAmazon className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
      ],
      link: "https://github.com/SSU-LED",
      image:
        "https://github.com/user-attachments/assets/db1dc04e-f2ae-419d-ad01-7e210f68b904",
    },
  ];

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProjectIndex(
      (prev) => (prev - 1 + projects.length) % projects.length
    );
  };

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

            {/* 스크롤 인디케이터 */}
            <div className="absolute bottom-3 sm:bottom-3 lg:bottom-3 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </section>

        {/* 프로젝트 섹션 */}
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

            {/* 캐러셀 컨테이너 */}
            <div className="relative max-w-6xl mx-auto overflow-hidden">
              {/* 데스크톱용 3카드 캐러셀 (lg 이상) */}
              <div className="hidden lg:flex items-center justify-center gap-4 lg:gap-6">
                {/* 이전 프로젝트 카드 (왼쪽) */}
                <div
                  className="w-72 lg:w-80 flex-shrink-0 transform scale-75 lg:scale-80 opacity-60 hover:opacity-80 transition-all duration-500 cursor-pointer"
                  onClick={prevProject}
                >
                  <ProjectCard
                    project={
                      projects[
                        (currentProjectIndex - 1 + projects.length) %
                          projects.length
                      ]
                    }
                    isActive={false}
                    onImageClick={() => {}} // 빈 함수로 비활성화
                  />
                </div>

                {/* 현재 프로젝트 카드 (중앙) */}
                <div className="w-72 lg:w-[22rem] flex-shrink-0 transform scale-100 z-10 shadow-xl">
                  <ProjectCard
                    project={projects[currentProjectIndex]}
                    isActive={true}
                    onImageClick={openImageModal}
                  />
                </div>

                {/* 다음 프로젝트 카드 (오른쪽) */}
                <div
                  className="w-72 lg:w-80 flex-shrink-0 transform scale-75 lg:scale-80 opacity-60 hover:opacity-80 transition-all duration-500 cursor-pointer"
                  onClick={nextProject}
                >
                  <ProjectCard
                    project={
                      projects[(currentProjectIndex + 1) % projects.length]
                    }
                    isActive={false}
                    onImageClick={() => {}} // 빈 함수로 비활성화
                  />
                </div>
              </div>

              {/* 모바일/태블릿용 단일 카드 + 버튼 네비게이션 (lg 미만) */}
              <div className="lg:hidden relative flex justify-center">
                {/* 현재 프로젝트 카드 */}
                <div className="w-full max-w-md mx-auto px-16">
                  <ProjectCard
                    project={projects[currentProjectIndex]}
                    isActive={true}
                    onImageClick={openImageModal}
                  />
                </div>

                {/* 좌측 네비게이션 버튼 */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 z-20 transition-all duration-200 hover:scale-110"
                  onClick={prevProject}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                </Button>

                {/* 우측 네비게이션 버튼 */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 z-20 transition-all duration-200 hover:scale-110"
                  onClick={nextProject}
                >
                  <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                </Button>
              </div>

              {/* 네비게이션 인디케이터 */}
              <div className="flex justify-center mt-8 space-x-2 mb-1">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProjectIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentProjectIndex
                        ? "bg-blue-500 scale-125 shadow-md"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-110"
                    }`}
                  />
                ))}
              </div>
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
              {/* Education 카드 */}
              <div className="bg-card rounded-lg shadow-md p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  Education
                </h3>
                <ul className="space-y-3 pl-3 pb-3">
                  <li>
                    <div className="font-semibold text-sm">숭실대학교</div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      소프트웨어학부
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2022.03 ~ 2027.03
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">
                      그렙(프로그래머스)
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      타입스크립트로 함께하는 웹 풀 사이클 개발(React, Node.js)
                      3기
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2024.04 ~ 2024.10
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm">
                      한국소프트웨어산업협회
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      [NIPA-AWS] Developer 부트캠프 2기
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2025.06 ~ 2025.08
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
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Skills 섹션 */}
        <section className="py-24 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-8 lg:px-12">
            <div className="text-center mb-16">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-7xl w-full">
                {skills.map((skill) => (
                  <div
                    key={skill.category}
                    className="p-4 sm:p-6 bg-card rounded-lg shadow-lg"
                  >
                    <h3 className="font-bold mb-4 text-base sm:text-lg text-center">
                      {skill.category}
                    </h3>
                    <ul className="space-y-3">
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
