/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, ArrowDown, X, Trophy } from "lucide-react";
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
  SiSwagger,
  SiNotion,
  SiConfluence,
  SiTypeorm,
  SiAwslambda,
  SiNginx,
  SiJsonwebtokens,
  SiStyledcomponents,
  SiSocketdotio,
  SiAmazonec2,
  SiAmazons3,
  SiAmazonsqs,
  SiUpstash,
  SiVercel,
  SiPusher,
  SiMarkdown,
  SiCss3,
  SiTerraform,
  SiAmazonrds,
  SiAmazonecs,
} from "react-icons/si";
import Image from "next/image";

import { FaJava } from "react-icons/fa";

import ThemeToggle from "@/components/theme-toggle";
import Footer from "@/components/footer";
import { useEffect, useState, useRef } from "react";

// 툴팁 컴포넌트
const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const hasContent = content && content.trim() !== "";

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => hasContent && setIsVisible(true)}
        onMouseLeave={() => hasContent && setIsVisible(false)}
      >
        {children}
      </div>
      {hasContent && isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg whitespace-normal w-64 pointer-events-none">
          <div className="text-center leading-relaxed">{content}</div>
          {/* 툴팁 화살표 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  );
};

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

// 프로젝트 상세 모달 컴포넌트
const ProjectDetailModal = ({
  isOpen,
  onClose,
  project,
  latestPost,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  latestPost: { title: string; url: string } | null;
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const contentRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때마다 개요 탭으로 초기화
  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
    }
  }, [isOpen]);

  // 탭 변경 시 스크롤 위치를 최상단으로 이동
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // 기간 계산 함수
  const calculateDuration = (period: string, title: string) => {
    if (title === "개발새발") return 0;

    const match = period.match(
      /(\d{2,4})\.(\d{2})\s*~\s*(\d{2,4})?\.?(\d{2})?/,
    );
    if (!match) return 0;

    const startYear =
      match[1].length === 2 ? parseInt("20" + match[1]) : parseInt(match[1]);
    const startMonth = parseInt(match[2]);

    let endYear, endMonth;
    if (match[3]) {
      endYear =
        match[3].length === 2 ? parseInt("20" + match[3]) : parseInt(match[3]);
      endMonth = parseInt(match[4]);
    } else {
      const now = new Date();
      endYear = now.getFullYear();
      endMonth = now.getMonth() + 1;
    }

    const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    return months;
  };

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

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* 모달 배경 클릭시 닫기 */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-card rounded-lg shadow-2xl overflow-hidden m-4 z-10">
        {/* 헤더 */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="sticky top-[65px] bg-card border-b border-border px-6 flex gap-4 z-10">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            개요
          </button>
          {project.responsibilities && project.responsibilities.length > 0 && (
            <button
              onClick={() => setActiveTab("responsibilities")}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "responsibilities"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              담당 업무
            </button>
          )}
          {project.troubleshooting && project.troubleshooting.length > 0 && (
            <button
              onClick={() => setActiveTab("troubleshooting")}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "troubleshooting"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              트러블슈팅
            </button>
          )}
        </div>

        {/* 컨텐츠 */}
        <div
          ref={contentRef}
          className="overflow-y-auto max-h-[calc(85vh-130px)] px-6 py-6"
        >
          {activeTab === "overview" && (
            <div className="space-y-6">
              {project.image && (
                <div className="relative w-full rounded-lg overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
              <div>
                <h3 className="text-m font-semibold text-muted-foreground mb-2">
                  프로젝트 기간
                </h3>
                <p className="text-sm">
                  {project.period}
                  {calculateDuration(project.period, project.title) > 0 &&
                    ` (${calculateDuration(project.period, project.title)}개월)`}
                </p>
              </div>
              {project.role && (
                <div>
                  <h3 className="text-m font-semibold text-muted-foreground mb-2">
                    역할
                  </h3>
                  <span
                    className={`inline-block text-sm font-semibold px-3 py-1.5 rounded-md ${
                      project.role === "Backend"
                        ? "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300"
                        : project.role === "FullStack"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {project.role}
                  </span>
                </div>
              )}
              {project.teamSize && (
                <div>
                  <h3 className="text-m font-semibold text-muted-foreground mb-2">
                    팀 인원
                  </h3>
                  <p className="text-sm">
                    {project.teamSize === 1 ? "개인" : `${project.teamSize}명`}
                  </p>
                </div>
              )}
              <div>
                <h3 className="text-m font-semibold text-muted-foreground mb-2">
                  프로젝트 설명
                </h3>
                <div className="text-sm leading-relaxed">
                  <p>{project.description}</p>
                  {project.title === "개발새발" && latestPost && (
                    <p className="mt-2">
                      <Link
                        href={latestPost.url}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        최근 글: {latestPost.title}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
              {project.features && project.features.length > 0 && (
                <div>
                  <h3 className="text-m font-semibold text-muted-foreground mb-3">
                    주요 기능
                  </h3>
                  <ul className="space-y-2">
                    {project.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                          •
                        </span>
                        <span className="text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="text-m font-semibold text-muted-foreground mb-3">
                  기술 스택
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-1.5 text-muted-foreground hover:text-foreground transition-colors bg-muted/50 px-3 py-2 rounded-md text-sm"
                    >
                      <span className="text-base">{tech.icon}</span>
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                {project.pdf && (
                  <Button variant="secondary" className="flex-1" asChild>
                    <Link
                      href={project.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Document
                    </Link>
                  </Button>
                )}
                <Button variant="outline" className="flex-1" asChild>
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
          )}

          {activeTab === "responsibilities" && project.responsibilities && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">담당 업무</h3>
                <div className="space-y-6">
                  {project.responsibilities.map(
                    (responsibility: any, idx: number) => (
                      <div key={idx} className="space-y-3">
                        <div className="border-l-2 border-blue-600 dark:border-blue-400 pl-4">
                          <h4 className="text-base font-semibold mb-2">
                            {responsibility.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {responsibility.description}
                          </p>
                        </div>
                        {responsibility.details &&
                          responsibility.details.length > 0 && (
                            <ul className="space-y-2 pl-4">
                              {responsibility.details.map(
                                (detail: string, detailIdx: number) => (
                                  <li
                                    key={detailIdx}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                                      •
                                    </span>
                                    <span className="text-sm leading-relaxed">
                                      {detail}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "troubleshooting" && project.troubleshooting && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">트러블슈팅</h3>
                <div className="space-y-6">
                  {project.troubleshooting.map((issue: any, idx: number) => (
                    <div key={idx} className="bg-muted/30 rounded-lg p-4">
                      <h4 className="text-base font-semibold mb-2 flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400">
                          ⚠
                        </span>
                        {issue.problem}
                      </h4>
                      <div className="space-y-3 ml-6">
                        {issue.cause && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              원인
                            </p>
                            <p className="text-sm leading-relaxed">
                              {issue.cause}
                            </p>
                          </div>
                        )}
                        {issue.solution && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              해결
                            </p>
                            <p className="text-sm leading-relaxed">
                              {issue.solution}
                            </p>
                          </div>
                        )}
                        {issue.result && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              결과
                            </p>
                            <p className="text-sm leading-relaxed text-green-600 dark:text-green-400">
                              {issue.result}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ProjectCard 컴포넌트
const ProjectCard = ({
  project,
  onCardClick,
}: {
  project: any;
  onCardClick: (project: any) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const roleColorMap: { [key: string]: string } = {
    Backend: "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
    FullStack:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  };
  const roleColor =
    roleColorMap[project.role as keyof typeof roleColorMap] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  // 기간 계산 함수
  const calculateDuration = (period: string, title: string) => {
    if (title === "개발새발") return 0;

    const match = period.match(
      /(\d{2,4})\.(\d{2})\s*~\s*(\d{2,4})?\.?(\d{2})?/,
    );
    if (!match) return 0;

    const startYear =
      match[1].length === 2 ? parseInt("20" + match[1]) : parseInt(match[1]);
    const startMonth = parseInt(match[2]);

    let endYear, endMonth;
    if (match[3]) {
      endYear =
        match[3].length === 2 ? parseInt("20" + match[3]) : parseInt(match[3]);
      endMonth = parseInt(match[4]);
    } else {
      // 진행중인 프로젝트
      const now = new Date();
      endYear = now.getFullYear();
      endMonth = now.getMonth() + 1;
    }

    const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    return months;
  };

  return (
    <div
      className="bg-card rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full cursor-pointer relative group"
      onClick={() => onCardClick(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {project.image && (
        <div className="relative w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-t-lg">
          <div className="relative w-full">
            <Image
              src={project.image}
              alt={project.title}
              width={800}
              height={600}
              className={`w-full h-auto object-contain transition-all duration-300 ${isHovered ? "blur-[2px]" : ""}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* 호버 시 돋보기 아이콘 */}
            <div
              className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-16 w-16 text-white transition-all duration-300 ${isHovered ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col relative">
        {/* 클릭 가능 힌트 텍스트 */}
        <div
          className={`absolute top-2 right-2 text-xs text-muted-foreground transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          상세보기 →
        </div>

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
                Document
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
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [latestPost, setLatestPost] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 최신 글 가져오기
  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const response = await fetch("/api/posts/latest");
        const data = await response.json();

        if (data.post) {
          setLatestPost({
            title: data.post.title,
            url: data.post.url,
          });
        }
      } catch (error) {
        console.error("Failed to fetch latest post:", error);
      }
    };

    if (mounted) {
      fetchLatestPost();
    }
  }, [mounted]);

  // 이미지 모달 열기
  const openImageModal = (src: string, alt: string) => {
    setModalImage({ isOpen: true, src, alt });
  };

  // 이미지 모달 닫기
  const closeImageModal = () => {
    setModalImage({ isOpen: false, src: "", alt: "" });
  };

  // 프로젝트 상세 모달 열기
  const openProjectDetail = (project: any) => {
    setSelectedProject(project);
    setIsProjectDetailOpen(true);
  };

  // 프로젝트 상세 모달 닫기
  const closeProjectDetail = () => {
    setIsProjectDetailOpen(false);
    setSelectedProject(null);
  };

  const skills = [
    {
      category: "Languages",
      techs: [
        {
          name: "C",
          icon: <SiC className="h-4 w-4" />,
          description:
            "xv6 기반 운영체제에서 COW(copy-on-write) 기능 구현, 페이지 테이블 관리 경험이 있습니다.",
        },
        {
          name: "C++",
          icon: <SiCplusplus className="h-4 w-4" />,
          description:
            "교내 알고리즘 대회에 참가하여 STL을 활용하여 문제 해결 경험이 있습니다.",
        },
        {
          name: "CSS3",
          icon: <SiCss3 className="h-4 w-4" />,
          description:
            "반응형 디자인, Flexbox, Grid 레이아웃을 구현할 수 있습니다.",
        },
        {
          name: "JavaScript",
          icon: <SiJavascript className="h-4 w-4" />,
          description:
            "npm 패키지(starving-orange)를 개발하여 배포, 버전 관리·문서화·배포 프로세스를 직접 운영해 본 경험이 있습니다.",
        },
        {
          name: "TypeScript",
          icon: <SiTypescript className="h-4 w-4" />,
          description:
            "NestJS 프로젝트에서 타입 시스템을 활용한 DTO/Entity 자동 변환 구조 설계 경험이 있습니다.",
        },
      ],
    },
    {
      category: "Frontend",
      techs: [
        {
          name: "React",
          icon: <SiReact className="h-4 w-4" />,
          description: "현재 개발 블로그의 메인 프레임워크로 사용 중 입니다.",
        },
        {
          name: "Next.js",
          icon: <SiNextdotjs className="h-4 w-4" />,
          description:
            "블로그 개발에 사용 중이며, SSG/SSR 렌더링 방식을 활용할 수 있습니다.",
        },
        {
          name: "Tailwind CSS",
          icon: <SiTailwindcss className="h-4 w-4" />,
          description:
            "Tailwind CSS를 활용하여 다크 모드를 구현해 본 경험이 있습니다.",
        },
        {
          name: "Styled Components",
          icon: <SiStyledcomponents className="h-4 w-4" />,
          description:
            "프론트엔드 프로젝트에서 동적 스타일링 및 테마 관리 구현이 가능합니다.",
        },
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
          description:
            "카카오맵 API을 연동하고 WiFi/GPS에 기반한 위치 인증 모달 UI를 구현해 본 경험이 있습니다.",
        },
      ],
    },
    {
      category: "Backend",
      techs: [
        {
          name: "Express",
          icon: <SiExpress className="h-4 w-4" />,
          description:
            "라우트 구조를 설계하고, REST CRUD API를 구현할 수 있습니다.",
        },
        {
          name: "NestJS",
          icon: <SiNestjs className="h-4 w-4" />,
          description:
            "WebSocket Gateway 기반 실시간 처리 기능을 구현할 수 있습니다.",
        },
        {
          name: "TypeORM",
          icon: <SiTypeorm className="h-4 w-4" />,
          description:
            "복잡한 관계 매핑 이슈에서 cascade/orphan 문제 해결 경험이 있습니다.",
        },
        {
          name: "PostgreSQL",
          icon: <SiPostgresql className="h-4 w-4" />,
          description: "인덱스 구조 조정 후 성능 개선 경험이 있습니다.",
        },
        {
          name: "Docker",
          icon: <SiDocker className="h-4 w-4" />,
          description: "컨테이너 기반 ECR 배포 경험이 있습니다.",
        },
      ],
    },
    {
      category: "Cloud",
      techs: [
        {
          name: "Vercel",
          icon: <SiVercel className="h-4 w-4" />,
          description:
            "Next.js 기반 서비스를 배포, 도메인 연결, 환경 변수 보안 관리 경험이 있습니다.",
        },
        {
          name: "Upstash",
          icon: <SiUpstash className="h-4 w-4" />,
          description:
            "Redis 기반으로 페이지 조회수·캐싱 기능을 구현한 경험이 있습니다.",
        },
        {
          name: "Terraform",
          icon: <SiTerraform className="h-4 w-4" />,
          description:
            "IaC로 AWS 인프라를 모듈화하고, 재사용 가능한 구성으로 환경별 자동 배포 구조를 설계한 경험이 있습니다.",
        },
        {
          name: "EC2 / RDS / S3",
          icon: <SiAmazon className="h-4 w-4" />,
          description:
            "EC2, RDS, S3 기반 3-Tier 아키텍처를 설계 및 구축할 수 있습니다.",
        },
        {
          name: "ECR / ECS / Fargate",
          icon: <SiAmazon className="h-4 w-4" />,
          description:
            "Docker 이미지를 ECR을 통해 ECS Fargate로 배포하는 CI/CD 파이프라인 구축 경험이 있습니다.",
        },
        {
          name: "Lambda / CloudFront",
          icon: <SiAmazon className="h-4 w-4" />,
          description:
            "S3 Presigned URL 기반 대용량 비디오 업로드 최적화 경험이 있습니다.",
        },
        {
          name: "SQS / Bedrock / Cognito",
          icon: <SiAmazon className="h-4 w-4" />,
          description:
            "SQS 기반 비동기 영상 처리 파이프라인을 구축해 본 경험이 있습니다.",
        },
      ],
    },
    {
      category: "Tools",
      techs: [
        {
          name: "VSCode",
          icon: <SiVisualstudiocode className="h-4 w-4" />,
          description: "",
        },
        {
          name: "Git",
          icon: <SiGit className="h-4 w-4" />,
          description: "",
        },
        {
          name: "GitHub",
          icon: <SiGithub className="h-4 w-4" />,
          description: "",
        },
        {
          name: "Notion",
          icon: <SiNotion className="h-4 w-4" />,
          description: "",
        },
        {
          name: "Slack",
          icon: <SiSlack className="h-4 w-4" />,
          description: "",
        },
        {
          name: "Swagger",
          icon: <SiSwagger className="h-4 w-4" />,
          description: "",
        },
        {
          name: "Confluence",
          icon: <SiConfluence className="h-4 w-4" />,
          description: "",
        },
      ],
    },
  ];

  const sideProjects = [
    {
      title: "Thumbs Up",
      period: "2024.11",
      description:
        "타이포그래피 기반 블로그 썸네일 제작 웹 도구입니다. 현재 개발 블로그의 썸네일 제작에 사용하고 있습니다.",
      tech: [
        { name: "React", icon: <SiReact className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="h-4 w-4" /> },
      ],
      link: "https://github.com/nullisdefined/thumbs-up",
      demo: "https://nullisdefined.github.io/thumbs-up/",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/34a63d3606df3cec87efd6d38b65a01f.png",
    },
    {
      title: "Guestboots",
      period: "2025.06",
      description:
        "AWS 서버리스 아키텍처로 구현한 포스트잇 방명록 애플리케이션입니다.",
      tech: [
        { name: "JavaScript", icon: <SiJavascript className="h-4 w-4" /> },
        { name: "AWS Lambda", icon: <SiAwslambda className="h-4 w-4" /> },
        { name: "Amazon S3", icon: <SiAmazons3 className="h-4 w-4" /> },
      ],
      link: "https://github.com/nullisdefined/guestboots",
      demo: "https://nullisdefined.github.io/guestboots/",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/770266670faeaf62f5b14f0576c35928.png",
    },
    {
      title: "Worlds Subscription",
      period: "2025.06",
      description:
        "카카오톡 구독으로 선택한 언어와 난이도에 맞는 단어, 뜻, 발음, 예문을 정해진 시간에 받아볼 수 있는 단어 학습 서비스입니다.",
      tech: [
        { name: "JavaScript", icon: <SiJavascript className="h-4 w-4" /> },
        { name: "AWS Lambda", icon: <SiAwslambda className="h-4 w-4" /> },
        { name: "Amazon S3", icon: <SiAmazons3 className="h-4 w-4" /> },
      ],
      link: "https://github.com/nullisdefined/worlds-subscription",
      demo: "https://nullisdefined.github.io/worlds-subscription/",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4eff5c6d09f09e11a801a135d527c58a.png",
    },
    {
      title: "starving-orange",
      period: "2025.06",
      description:
        "과일/채소에 형용사를 조합하여 랜덤한 한글 닉네임을 생성하는 JavaScript 라이브러리입니다.",
      tech: [
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "Rollup", icon: <SiNodedotjs className="h-4 w-4" /> },
      ],
      link: "https://github.com/nullisdefined/starving-orange",
      demo: "https://www.npmjs.com/package/starving-orange",
      image:
        "https://github.com/user-attachments/assets/f02d97b3-fb3d-400c-bcdf-6911a0581229",
    },
  ];

  const projects = [
    {
      title: "나날모아",
      period: "24.08 ~ 25.02",
      role: "Backend",
      teamSize: 5,
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
      responsibilities: [
        {
          title: "백엔드 아키텍처 설계 및 NestJS 기반 서버 구축",
          description: "NestJS와 TypeORM을 활용한 백엔드 시스템 전반 설계",
          details: [
            "NestJS 프로젝트 부트스트랩 및 모듈 구조 설계",
            "전역 파이프, 로거, Swagger 자동 문서화 및 문서 배포, Hot reload 등 개발 환경 표준화",
            "환경 변수 관리 체계 구축 및 ConfigModule 분리",
            "@GetUserUuid 커스텀 데코레이터로 인증 사용자 정보 자동 추출",
            "typeorm-transactional 라이브러리 기반 트랜잭션 관리 도입(@Transactional)",
          ],
        },
        {
          title: "인증 시스템 구현",
          description: "OAuth 및 일반 로그인 통합 인증 시스템",
          details: [
            "카카오/네이버 OAuth 2.0 전략 구현",
            "전화번호 기반 회원가입 및 로그인 구현",
            "CoolSMS 연동한 인증번호 발송/검증 로직 구축",
            "JWT 액세스 토큰(15분)-리프레시 토큰(7일) 구조 설계 및 재발급 로직 구현",
            "User-Auth 엔티티 관계 설계 및 개인정보 수정/조회/탈퇴 기능 개발",
            "만료 토큰 401 대응 및 리프레시 엔드포인트 보안/사용성 개선",
          ],
        },
        {
          title: "반복 일정 시스템 개발",
          description: "매일/매주/매월/매년 반복 패턴을 지원하는 일정 관리",
          details: [
            "반복 일정 모델 재설계로 ScheduleInstance 제거 → 엔티티 통합",
            "동적 인스턴스 생성 방식 도입으로 메모리 사용량 50% 절감",
            "날짜 기반 조회 API 성능 개선 및 isRecurring 검증 로직 개선",
            "특정 날짜/범위별 일정 조회 기능 구현",
            "calculateDateRange 유틸 함수로 반복 일정 전개 성능 최적화",
          ],
        },
        {
          title: "AI 서비스 분리 및 리팩토링",
          description: "GPT 로직을 AiService로 분리하여 관심사 분리",
          details: [
            "기존 SchedulesService에 포함된 GPT 로직을 AiService로 분리하여 관심사 분리",
            "processWithGpt, processWithGptOCR 메서드로 AI 처리 경로 일원화",
            "GPT 응답을 CreateScheduleDto로 변환하는 파싱 로직 개발",
            "단일 객체/배열 응답 모두 처리할 수 있는 타입 검증 로직 구현",
            "OCRTranscriptionService, SchedulesService에 의존성 주입 구조 정립",
          ],
        },
        {
          title: "일정 서비스 리팩토링 및 최적화",
          description: "코드 가독성 및 유지보수성 향상",
          details: [
            "Swagger 문서 모듈 분리 및 스키마 관리 구조화",
            "그룹 일정 로직 모듈화 및 공통 코드 정리",
            "유틸 함수에 JSDoc 적용하여 문서화 체계 구축",
            "types/ 폴더 기반 타입 정의 정리",
            "서비스 반환 타입을 DTO로 명시하여 타입 안정성 확보",
          ],
        },
        {
          title: "데이터베이스 설계 및 시더 구현",
          description:
            "PostgreSQL 기반 데이터베이스 스키마 설계 및 자동화된 시딩 시스템 구축",
          details: [
            "User, Auth, Schedule, Category 등 핵심 엔티티 스키마 설계",
            "User 엔티티에 phoneNumber, address 필드 추가",
            "외래 키 제약조건 및 Cascade 전략 설정",
            "Faker 기반 테스트 데이터 생성 스크립트 작성",
            "db:refresh 명령어 구현으로 초기화–스키마 재생성 자동화",
            "Schedule 테이블 인덱스 추가로 날짜 조회 성능 43% 개선",
            "기본 카테고리/마스터 데이터 자동 시딩 로직 구축",
          ],
        },
        {
          title: "개발 환경 및 코드 품질 관리",
          description: "린트, 워크플로우, 문서화",
          details: [
            "ESLint 규칙 조정 및 워닝 제거로 코드 일관성 확보",
            "GitHub Actions 기반 CI/CD 워크플로우 구성",
            "Swagger 문서 자동 업데이트 파이프라인 구성(deploy-swagger-docs.yml)",
            "CORS 설정 및 패키지 전체 정리",
            "테스트 코드 정리 및 불필요 파일 제거로 프로젝트 구조 정돈",
          ],
        },
      ],
      troubleshooting: [
        {
          problem: "멀티 모듈 환경에서 트랜잭션 관리 어려움",
          cause:
            "회원 탈퇴 기능에서 User, Auth, Schedule 등 여러 모듈의 데이터를 동시에 삭제해야 했으나, 각 서비스에 QueryRunner를 전달하는 방식으로 트랜잭션을 처리하면서 코드 복잡도와 결합도가 크게 증가했습니다.",
          solution:
            "typeorm-transactional 라이브러리를 도입하고 @Transactional() 데코레이터 기반으로 트랜잭션 범위를 선언적으로 관리하도록 변경했습니다. main.ts에서 initializeTransactionalContext()를 초기화하고, DataSource에 addTransactionalDataSource()를 적용하여 트랜잭션 컨텍스트를 통합 관리했습니다. 각 서비스는 트랜잭션 전파를 자동으로 처리하도록 구조를 개선했습니다.",
          result:
            "트랜잭션 처리 코드가 서비스 로직과 분리되면서 가독성이 크게 향상되었고, 트랜잭션 누락/중복 발생 가능성을 줄였습니다. 멀티 모듈 환경에서도 트랜잭션 전파가 일관되게 적용되어 데이터 일관성을 안정적으로 보장하게 되었습니다.",
        },
        {
          problem: "GPT JSON 파싱 오류",
          cause:
            "GPT-4 응답이 간헐적으로 유효하지 않은 JSON 형식이거나, 배열 대신 단일 객체를 반환하는 경우가 발생해 일정 생성 파이프라인에서 파싱 오류가 잦았습니다.",
          solution:
            "convertGptResponseToCreateScheduleDto 내에 응답 타입 검증 로직을 추가하여, 단일 객체 응답일 경우 자동으로 배열 형태로 래핑해 일관된 구조로 처리하도록 수정했습니다. JSON 파싱 실패 시에는 예외를 캐치하고, 명확한 에러 응답과 함께 사용자에게 재시도를 안내하는 fallback 로직을 구현했습니다.",
          result:
            "GPT 응답 파싱 성공률이 크게 향상되어, 정상 응답 기준 약 95% 이상에서 일정 자동 생성이 문제없이 처리되었습니다. 파싱 실패 시에도 사용자에게 명확한 안내를 제공해, 장애 상황에서의 UX를 개선했습니다.",
        },
        {
          problem: "반복 일정 조회 시 성능 저하",
          cause:
            "반복 일정의 각 인스턴스를 ScheduleInstance 엔티티로 모두 DB에 저장하는 구조를 사용하면서, 장기간(수개월~1년) 범위 조회 시 수많은 인스턴스를 로드해야 했고, 그 결과 응답 시간이 2초 이상 소요되었습니다.",
          solution:
            "반복 일정 모델을 재설계하여 ScheduleInstance 엔티티를 제거하고, 반복 속성을 Schedule 엔티티에 통합했습니다. calculateDateRange 유틸리티 함수로 조회 기간을 계산한 뒤, 필요한 인스턴스만 런타임에 동적으로 생성하는 방식으로 변경했습니다. 또한 쿼리에 날짜 범위 조건을 명시적으로 추가해 불필요한 데이터 로드를 줄였습니다.",
          result:
            "평균 응답 시간이 약 70% 단축(2초 → 약 600ms)되었고, 1년 범위 조회 역시 1초 이내로 처리 가능해졌습니다. 반복 인스턴스를 사전 저장하지 않게 되면서 메모리 사용량도 약 50% 감소했습니다.",
        },
        {
          problem: "만료된 액세스 토큰의 401 에러로 인한 리프레시 실패",
          cause:
            "리프레시 엔드포인트에서 만료된 액세스 토큰을 request body로 전달하는 구조였는데, Guard가 먼저 Authorization 헤더를 검증하면서 401 에러를 반환해, 실제 리프레시 로직이 실행되지 않는 문제가 있었습니다.",
          solution:
            "리프레시 엔드포인트 설계를 수정하여, Authorization 헤더의 액세스 토큰을 직접 파싱하고 Guard를 우회해 만료된 토큰도 리프레시 대상로 처리할 수 있도록 변경했습니다. 동시에, 리프레시 토큰의 검증 로직을 강화해 보안상 문제가 없도록 방어 로직을 보완했습니다.",
          result:
            "만료된 액세스 토큰에 대해서도 안정적으로 리프레시 토큰을 활용해 새 토큰을 발급할 수 있게 되었고, 불필요한 재로그인 빈도가 감소했습니다. 사용자 입장에서 토큰 만료로 인한 갑작스러운 로그아웃 경험이 사라져 UX가 개선되었습니다.",
        },
        {
          problem: "SMS 인증 코드 유효기간 및 상태 관리 부족",
          cause:
            "인증 코드를 서버 메모리의 Map에 저장하는 구조로 구현해 서버 재시작 시 데이터가 모두 유실되었고, 만료된 코드가 자동으로 정리되지 않아 관리가 어려웠습니다. 또한 인증 완료 여부를 별도로 추적하지 않아 로직이 불명확했습니다.",
          solution:
            "인증 코드 Map에 만료 시각과 isVerified 플래그를 함께 저장해 코드의 상태를 명확히 관리했습니다. 회원가입 시에는 전화번호 형식 검증과 인증 코드 검증을 모두 통과해야만 가입이 가능하도록 로직을 강화했습니다. (실 서비스 전환 시에는 Redis와 같은 외부 스토리지를 사용할 수 있도록 구조를 분리해 두었습니다.)",
          result:
            "미인증 사용자의 회원가입 시도가 로직 상 차단되도록 정돈되었고, 인증 코드 사용 흐름이 명확해져 유지보수성이 향상되었습니다. 추후 외부 스토리지로 이전하기 쉬운 구조를 마련했습니다.",
        },
        {
          problem: "날짜 범위 조회 시 Full Table Scan으로 인한 성능 저하",
          cause:
            "개발 단계에서 스키마 변경이 빈번해 마이그레이션 대신 synchronize 옵션을 사용했는데, 이로 인해 인덱스가 자동 생성되지 않았습니다. 일정 데이터가 증가함에 따라 날짜 범위 조회 쿼리가 Full Table Scan으로 동작하며 응답 시간이 점점 증가했습니다.",
          solution:
            "Schedule 테이블의 startDate, endDate 컬럼에 복합 인덱스를 추가했습니다. Faker를 활용해 대량의 테스트 데이터를 생성한 뒤, 인덱스 유무에 따른 조회 성능을 비교 측정했습니다. 이후 db:refresh 명령어에 인덱스 생성 로직을 포함시켜, 스키마 초기화 시에도 인덱스가 자동 반영되도록 개선했습니다.",
          result:
            "날짜 범위 조회 쿼리가 Full Table Scan에서 Index Scan으로 전환되면서 응답 시간이 크게 단축되었습니다. 개발 단계에서 synchronize를 유지하더라도, 성능에 중요한 인덱스는 안정적으로 적용되는 환경을 구축할 수 있었습니다.",
        },
      ],
      tech: [
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "TypeORM", icon: <SiTypeorm className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
        { name: "Amazon EC2", icon: <SiAmazonec2 className="h-4 w-4" /> },
        { name: "Nginx", icon: <SiNginx className="h-4 w-4" /> },
        { name: "JWT", icon: <SiJsonwebtokens className="h-4 w-4" /> },
        {
          name: "OAuth2",
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          ),
        },
      ],
      link: "https://github.com/nanalmoa/nanalmoa",
      image:
        "https://storage.googleapis.com/hotsix-bucket/%EB%82%98%EB%82%A0%EB%AA%A8%EC%95%84.png",
      pdf: "/project_nanalmoa.pdf",
    },
    {
      title: "개발새발",
      period: "2024.10 ~",
      role: "FullStack",
      teamSize: 1,
      description:
        "Next.js 기반의 개인 개발 블로그입니다. 기술 학습 내용과 프로젝트 경험을 기록하고 공유하는 플랫폼으로, 마크다운 기반의 정적 사이트 생성과 동적 기능을 결합하여 운영 중입니다.",
      features: [
        "MDX 기반 마크다운 콘텐츠 관리 및 렌더링",
        "카테고리, 태그, 시리즈별 포스트 분류 및 전체 글 검색",
        "Upstash Redis 기반 실시간 조회수 추적",
        "게스트와 관리자 간 실시간 1:1 채팅 (Pusher 연동)",
        "Giscus 댓글 시스템 (GitHub Discussions 연동)",
        "관련 포스트 자동 추천 및 렌더링",
        "썸네일 색상 분석 기반 동적 그라디언트 배너",
        "다크 모드 지원 및 반응형 디자인",
        "RSS 피드 및 Sitemap 자동 생성",
        "SEO 최적화 (동적 메타태그, Open Graph, JSON-LD)",
      ],
      responsibilities: [
        {
          title: "Next.js 블로그 시스템 구축",
          description: "SSG와 ISR을 활용한 고성능·저비용 블로그 플랫폼 개발",
          details: [
            "App Router 기반 페이지 라우팅 및 레이아웃 설계",
            "MDX를 활용한 마크다운 콘텐츠 렌더링 시스템 구축",
            "Rehype 및 Remark 플러그인으로 코드 하이라이팅 및 목차 자동 생성",
            "정적 사이트 생성(SSG)으로 빌드 타임에 블로그 포스트 프리렌더링",
          ],
        },
        {
          title: "실시간 조회수 시스템 구현",
          description: "Upstash Redis와 Pusher를 활용한 실시간 데이터 동기화",
          details: [
            "Upstash Redis를 활용한 게시글 조회수 추적",
            "Pusher를 통한 실시간 조회수 업데이트 브로드캐스팅",
            "클라이언트 측 Pusher 구독 및 UI 자동 갱신",
            "Redis 캐싱 전략으로 데이터베이스 부하 최소화",
          ],
        },
        {
          title: "실시간 채팅 시스템 개발",
          description: "Pusher와 NextAuth를 활용한 관리자-사용자 채팅 기능",
          details: [
            "GitHub OAuth 인증 사용자를 대상으로 실시간 1:1 채팅 구현",
            "Pusher Channels를 활용한 양방향 실시간 메시지 전송",
            "관리자 페이지에서 채팅방 목록 및 메시지 모니터링 기능 구현",
            "웹 푸시 알림 연동으로 새 메시지 알림 기능 추가",
          ],
        },
        {
          title: "댓글 시스템 통합",
          description: "Giscus를 활용한 GitHub Discussions 댓글 연동",
          details: [
            "GitHub Discussions 기반 Giscus 댓글 시스템 설정",
            "다크 모드 자동 전환 및 테마 연동",
            "댓글 컴포넌트 지연 로딩으로 초기 렌더링 최적화",
            "OAuth 인증을 통한 사용자 댓글 작성 플로우 구축",
          ],
        },
        {
          title: "인증 시스템 구현",
          description: "NextAuth.js를 활용한 OAuth 인증 및 세션 관리",
          details: [
            "GitHub OAuth 2.0 인증 전략 구현",
            "세션 기반 사용자 상태 관리 및 보호된 페이지 접근 제어",
            "보호된 API 라우트 및 미들웨어 설정",
            "사용자 프로필 정보 동기화 처리",
          ],
        },
        {
          title: "UI/UX 개발 및 최적화",
          description: "Tailwind CSS 기반 반응형 디자인",
          details: [
            "Tailwind CSS를 활용한 모던한 UI 컴포넌트 개발",
            "다크 모드 지원 및 테마 전환 기능 구현",
            "Zustand를 활용한 전역 UI 상태 관리",
            "모바일·태블릿·데스크톱 반응형 레이아웃 구성",
            "썸네일 이미지 색상 분석 기반 동적 그라디언트 배너 생성",
          ],
        },
        {
          title: "SEO 최적화 및 배포 자동화",
          description: "Vercel을 통한 자동 배포 및 검색 엔진 최적화",
          details: [
            "Vercel 플랫폼 자동 배포 및 CI/CD 파이프라인 구성",
            "이미지 최적화 및 lazy loading 적용",
            "동적 메타 태그 생성 및 Open Graph 메타 설정",
            "구조화된 데이터(JSON-LD) 및 sitemap 설정",
            "Lighthouse 성능 지표 90점 이상 유지",
          ],
        },
      ],
      troubleshooting: [
        {
          problem: "MDX 빌드 시 메모리 부족 에러",
          cause:
            "대량의 마크다운 파일을 한 번에 파싱하면서 Node.js 힙 메모리가 부족해 빌드가 중단되었습니다.",
          solution:
            "next.config.js에서 webpack 설정을 조정해 메모리 제한을 상향하고, MDX 플러그인 중 불필요한 부분을 제거했습니다. 또한 처리 흐름을 최적화해 과도한 파싱이 발생하지 않도록 조정했습니다.",
          result:
            "빌드 과정에서 메모리 에러가 발생하지 않도록 안정화했으며, 빌드 시간이 약 40% 단축되어 100개 이상의 게시글도 안정적으로 빌드 가능해졌습니다.",
        },
        {
          problem: "Pusher 실시간 조회수 업데이트 지연",
          cause:
            "모든 조회수 변경을 즉시 브로드캐스팅하면서 Pusher API 호출이 과도하게 발생해 지연과 비용 문제가 생겼습니다.",
          solution:
            "조회수를 Redis에 우선 반영하고, 10초 단위 배치로 Pusher에 업데이트를 전달하는 구조로 변경했습니다.",
          result:
            "Pusher API 호출 수를 약 90% 줄이면서도 사용자 입장에서의 실시간성은 유지했습니다.",
        },
        {
          problem: "다크 모드 전환 시 화면 깜빡임",
          cause:
            "테마 정보가 클라이언트 측에서만 적용되어 초기 SSR 렌더링 시 기본 테마가 잠시 노출되었습니다.",
          solution:
            "next-themes 라이브러리를 도입하고, 쿠키 기반으로 테마 상태를 저장했습니다. 또한 HTML head에 인라인 스크립트를 삽입해 렌더링 전에 테마를 먼저 적용하도록 했습니다.",
          result:
            "다크 모드 전환 시 깜빡임 현상이 제거되어, 초기 렌더링 경험이 자연스러워졌습니다.",
        },
        {
          problem: "코드 블록 하이라이팅 스타일 충돌",
          cause:
            "rehype-highlight와 Tailwind CSS의 스타일이 충돌해 코드 블록 레이아웃이 깨지고 색상이 의도와 다르게 표시되었습니다.",
          solution:
            "하이라이팅 라이브러리를 Prism.js로 변경하고, Tailwind의 prose 클래스를 커스터마이징해 코드 블록 스타일을 분리·격리했습니다.",
          result:
            "코드 블록이 일관된 스타일로 표시되고, 다양한 언어에 대한 syntax highlighting을 안정적으로 지원하게 되었습니다.",
        },
      ],
      tech: [
        { name: "Next.js", icon: <SiNextdotjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "React", icon: <SiReact className="h-4 w-4" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="h-4 w-4" /> },
        { name: "MDX", icon: <SiMarkdown className="h-4 w-4" /> },
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
          name: "Rehype",
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          ),
        },
        {
          name: "Remark",
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          ),
        },
        {
          name: "Giscus",
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
          ),
        },
        { name: "Upstash Redis", icon: <SiUpstash className="h-4 w-4" /> },
        { name: "Pusher", icon: <SiPusher className="h-4 w-4" /> },
        { name: "NextAuth", icon: <SiJsonwebtokens className="h-4 w-4" /> },
        {
          name: "OAuth2",
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          ),
        },
        { name: "Vercel", icon: <SiVercel className="h-4 w-4" /> },
      ],
      link: "https://github.com/nullisdefined/my-devlog",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/2256b96dc790d6bf2d8b4c444852f5c9.png",
      pdf: "https://www.nullisdefined.my/devlog/series/devlog",
    },
    {
      title: "한땀한땀",
      period: "25.03 ~ 25.09",
      role: "Backend",
      teamSize: 4,
      description:
        "개인의 다양한 목표 달성과 꾸준한 습관 형성을 지원하는 AI 기반 소셜 챌린지 플랫폼입니다. HealthKit과 연동된 Apple Watch 자동 인증, 그리고 실시간 AI 이미지 분석을 통해 신뢰성과 공정성을 갖춘 챌린지 환경을 제공합니다.",
      features: [
        "AI 기반 이미지 인증 및 자동 검증",
        "Apple Watch·HealthKit 연동 실시간 자동 인증",
        "개인·그룹 단위 소셜 챌린 기능 ",
        "실시간 채팅 및 활동 알림",
        "관리자 모더레이션 및 신고처리 시스템",
        "개인 목표 관리 및 습관 트래킹",
      ],
      responsibilities: [
        {
          title: "백엔드 API 개발",
          description: "NestJS 기반 RESTful API 설계 및 구현",
          details: [
            "챌린지, 미션, 인증, 사용자 등 핵심 도메인 CRUD API 개발",
            "TypeORM을 활용한 엔티티 설계 및 관계 매핑",
            "통일된 에러 코드 체계 및 GlobalExceptionFilter 구축",
            "CustomException과 BusinessException을 활용한 도메인별 예외 처리",
            "DTO 유효성 검사 및 공통 응답 형식 표준화",
            "JWT 기반 인증/인가 시스템 구현",
            "Swagger를 활용한 API 문서 자동화",
          ],
        },
        {
          title: "인프라 아키텍처 설계 및 IaC 구축",
          description: "Terraform을 활용한 AWS 인프라 자동화",
          details: [
            "VPC, Public/Private Subnet, Security Group 등 네트워크 인프라 설계",
            "ALB, ECS on Fargate, RDS PostgreSQL, CloudFront CDN 구성",
            "Route 53 기반 DNS 라우팅 및 Internet Gateway 설정",
            "VPC Endpoint(S3 Gateway, CloudWatch Logs, Secrets Manager, ECR) 구성",
            "Terraform 모듈화를 통한 재사용 가능한 인프라 코드 작성",
          ],
        },
        {
          title: "비동기 이미지 처리 시스템 구현",
          description: "SQS와 Lambda를 활용한 AI 기반 이미지 인증 파이프라인",
          details: [
            "Anthropic Claude 3.5 Sonnet v2(AWS Bedrock) 모델을 활용한 이미지 관련성 분석",
            "이미지 업로드 시 AI 검증 후 approve/reject/review 상태 반환",
            "S3 이벤트 트리거 기반 SQS 메시지 큐 설계",
            "Lambda 워커 함수 구현 및 Bedrock AI 연동",
            "ImageVerification 엔티티 설계 및 분석 결과 저장",
            "인증 결과를 관리자 모더레이션 큐에 적재하는 워크플로우 구성",
            "Dead Letter Queue(DLQ) 설정으로 실패한 메시지 처리",
          ],
        },
        {
          title: "실시간 채팅 시스템 개발",
          description: "Socket.IO 기반 실시간 채팅 및 알림 기능",
          details: [
            "Socket.IO 서버 구축 및 이벤트 기반 통신 설계",
            "채팅방 생성, 메시지 전송, 읽음 처리 등 핵심 기능 구현",
            "챌린지 생성/참여/나가기 시 채팅방 자동 동기화 로직 구현",
            "JWT 기반 Socket 인증 미들웨어 개발",
            "APNs(Apple Push Notification Service) 연동 및 푸시 알림 시스템 구축",
            "챗봇 알림 및 운영 메시지 자동화",
          ],
        },
        {
          title: "테스트 및 품질 관리",
          description: "Jest 기반 단위/통합 테스트 환경 구축",
          details: [
            "Controller 및 Service 레이어 단위 테스트 작성",
            "SQLite 인메모리 DB를 활용한 통합 테스트 환경 구축",
            "E2E 테스트 configuration 완료",
            "테스트 커버리지 리포트 자동화",
          ],
        },
        {
          title: "모니터링 및 보안 체계 구축",
          description:
            "CloudWatch, CloudTrail, Secrets Manager를 활용한 관찰성 및 보안 강화",
          details: [
            "CloudWatch Logs를 통한 ECS Fargate 컨테이너 로그 수집",
            "커스텀 메트릭 생성 및 대시보드 구성",
            "CloudTrail을 활용한 API 호출 및 리소스 변경 추적",
            "Secrets Manager를 통한 민감 정보 안전한 관리",
            "GitHub Secrets를 활용한 APNs 인증서 보안 관리 및 배포 자동화",
            "알람 설정을 통한 장애 감지 자동화 및 IAM 최소 권한 원칙 적용",
          ],
        },
      ],
      troubleshooting: [
        {
          problem: "Bedrock AI 이미지 검증 시 동시 호출 부하 발생",
          cause:
            "다수 사용자가 이미지 업로드 시 Bedrock API를 동기적으로 호출하여 타임아웃 및 응답 지연이 발생했습니다.",
          solution:
            "S3 업로드 → SQS 메시지 발행 → Lambda 워커 → Bedrock 분석 → DB 저장 구조로 전면 개편해 비동기 처리 파이프라인을 구축했습니다.",
          result:
            "동시 처리 성능이 크게 향상되고, 사용자는 업로드 직후 즉시 다음 작업이 가능해 UX가 개선되었습니다.",
        },
        {
          problem: "CloudWatch Logs 가독성 저하",
          cause:
            "Winston 로그가 CloudWatch 환경에서 포맷이 깨지며 JSON 구조가 평탄화되지 않아 분석이 어려웠습니다.",
          solution:
            "Console Transport 포맷을 재구성하여 타임스탬프·레벨·스택 트레이스 등을 구조화된 JSON 형태로 출력하도록 개선했습니다.",
          result:
            "로그 검색·분석 효율성이 크게 향상되어 장애 대응 시간을 단축했습니다.",
        },
        {
          problem: "ECS EC2 클러스터 운영 복잡성과 비용 증가",
          cause:
            "EC2 인스턴스의 클러스터 연결 불안정 및 NAT Gateway 비용 증가로 운영 부담이 커졌습니다.",
          solution:
            "ECS EC2 → ECS Fargate로 전환하고 NAT Gateway 제거, Bastion Host + VPC Endpoint 기반 아키텍처로 변경했습니다.",
          result:
            "인프라 관리 부담이 거의 제거되고 월 비용을 약 30% 절감했습니다.",
        },
        {
          problem: "NestJS 모듈 간 순환 의존성",
          cause:
            "PostsModule과 LikesModule이 서로 import하면서 Nest DI 해석 오류가 발생했습니다.",
          solution:
            "forwardRef()를 적용해 순환 의존성을 지연 해석하도록 구조를 조정했습니다.",
          result:
            "모듈 초기화가 정상적으로 수행되고 의존성 구조가 명확해졌습니다.",
        },
        {
          problem: "ECS 배포 시 다운타임 발생",
          cause:
            "블루-그린 또는 롤링 전략 없이 태스크를 교체하여 헬스 체크 실패 시 서비스 중단이 발생했습니다.",
          solution:
            "ALB 헬스 체크 설정을 최적화하고 ECS 서비스의 롤링 업데이트 정책을 적용했습니다.",
          result:
            "무중단 배포가 가능해졌으며 서비스 가용성이 99.9% 이상으로 유지되었습니다.",
        },
        {
          problem: "Socket.IO 연결 유지 불안정",
          cause:
            "ALB Idle Timeout(60초)이 Socket.IO 연결 유지 시간보다 짧아 주기적으로 연결이 끊겼습니다.",
          solution:
            "ALB Idle Timeout을 300초로 조정하고, 클라이언트 pingInterval/pingTimeout을 재설정했습니다.",
          result:
            "Socket 연결 안정성이 대폭 개선되었고 재연결 빈도가 약 90% 감소했습니다.",
        },
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
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          ),
        },

        { name: "Docker", icon: <SiDocker className="h-4 w-4" /> },
        { name: "Amazon ECR", icon: <SiAmazon className="h-4 w-4" /> },
        { name: "Amazon ECS", icon: <SiAmazon className="h-4 w-4" /> },
        { name: "Amazon S3", icon: <SiAmazons3 className="h-4 w-4" /> },
        { name: "Amazon CloudFront", icon: <SiAmazon className="h-4 w-4" /> },
        { name: "AWS Lambda", icon: <SiAwslambda className="h-4 w-4" /> },
        { name: "Amazon SQS", icon: <SiAmazonsqs className="h-4 w-4" /> },
        { name: "Amazon Bedrock", icon: <SiAmazon className="h-4 w-4" /> },
      ],
      link: "https://github.com/SOAPFT/soapft_backend",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bf10d5f4f6dd3bc64cedf9b0dff5fd73.png",
      pdf: "/project_soapft.pdf",
    },
    {
      title: "할 사람?",
      period: "25.06 ~ 25.08",
      role: "FullStack",
      teamSize: 4,
      description:
        "AI 기반 미션을 통해 즉시 참여 가능한 지역 번개모임을 만들고 참여할 수 있는 오프라인 커뮤니티 서비스입니다. 사용자는 미션 수행으로 포인트와 신뢰도를 쌓으며, AI 검증·위치·시간 기반 인증을 통해 안전한 모임 환경을 제공합니다.",
      features: [
        "AI 기반 지역 특화 미션 생성 및 3중 인증 시스템(사진·위치·시간)",
        "사용자 위치 기반 번개모임 매칭",
        "소셜 로그인 통합(Kakao / Naver / Google)",
        "실시간 그룹 채팅 및 푸시 알림",
        "포인트·레벨·패널티 자동화 시스템",
        "QR 체크인 기반 모임 출석 인증 및 자동 정산",
      ],
      responsibilities: [
        {
          title: "온보딩 및 인증 시스템 구현",
          description:
            "Passport.js 기반 멀티 OAuth 인증 및 안전한 온보딩 플로우 구축",
          details: [
            "카카오·네이버·구글 OAuth 2.0 전략 구현 및 소셜 계정 통합",
            "전화번호 → 프로필 → 관심사/해시태그 → 지역 순의 온보딩 단계 설계",
            "HTTP-Only 쿠키 기반 세션 관리로 XSS 공격 방어",
            "리프레시 토큰 기반 자동 재인증 구현",
            "마스터 데이터(레벨 · 관심사 · 해시태그 · 미션 카테고리) API 제공",
          ],
        },
        {
          title: "모임 및 미션 기능 개발",
          description: "모임 생성부터 출석·정산까지 전체 라이프사이클 API 개발",
          details: [
            "모임 생성·참가·출석 체크·위치 인증 등 핵심 기능 API 구현",
            "미션 조회 필터링 및 상세 정보 제공 API 개발",
            "AI 미션 인증: AWS Bedrock 기반 이미지 분석 및 검증",
            "포인트 트랜잭션 및 사용자 활동 로그 추적 시스템 구축",
            "Scheduler 기반 상태 자동 전환 및 정산 프로세스 자동화",
          ],
        },
        {
          title: "데이터베이스 마이그레이션",
          description: "DynamoDB → PostgreSQL 스키마 재설계 및 데이터 이전",
          details: [
            "NoSQL 데이터를 관계형 스키마로 재설계",
            "미션, 인증, 사용자, 모임 등 핵심 테이블 정규화",
            "마이그레이션 스크립트 작성 및 데이터 무결성 검증",
            "인덱스 최적화로 쿼리 성능 개선",
          ],
        },
        {
          title: "실시간 채팅 및 웹 푸시 구현",
          description: "Socket.IO + Service Worker 기반 실시간 커뮤니케이션",
          details: [
            "그룹 채팅 서버 구축 및 WebSocket 기반 메시지 동기화",
            "메시지/읽음 상태 관리 엔티티 설계 및 이벤트 처리",
            "VAPID 기반 웹 푸시 알림 시스템 구축",
            "알림 템플릿 및 푸시 구독 관리 API 구현",
          ],
        },
        {
          title: "프론트엔드 개발 및 UI/UX 구현",
          description: "React 기반 사용자 인터페이스 및 PWA 기능 구현",
          details: [
            "Feature-based 아키텍처(app/features/shared)로 프론트 구조 설계",
            "온보딩 UI(4단계 구성), 프로필 수정, 관심사 선택 플로우 구현",
            "미션 목록·상세·필터링 UI 및 QR 체크인 컴포넌트 개발",
            "React 채팅 UI + Socket.IO 실시간 연동",
            "Service Worker 기반 웹 푸시(PWA) 알림 구축",
            "다크 모드, 테마 토글, 반응형 디자인 적용",
            "S3 Presigned URL 기반 이미지 업로드 기능 구현",
            "Zustand를 활용한 user·location·notification 전역 상태 관리",
          ],
        },
      ],
      troubleshooting: [
        {
          problem: "DynamoDB → PostgreSQL 마이그레이션 중 성능 저하",
          cause:
            "중첩된 NoSQL 구조를 관계형 DB로 평탄화하면서 JOIN이 증가하고 N+1 문제가 발생했습니다.",
          solution:
            "핵심 관계 필드에 인덱스를 추가하고, QueryBuilder 기반으로 조인을 최적화했으며, eager loading 사용을 최소화했습니다.",
          result:
            "평균 응답 시간이 약 60% 단축되었고, 복잡한 조회 쿼리도 200ms 이내로 안정적으로 처리할 수 있게 되었습니다.",
        },
        {
          problem: "웹 푸시 구독 실패율 증가",
          cause:
            "Service Worker 등록 타이밍이 부정확하고 권한 거부 상태에 대한 예외 처리가 부족해 구독 실패율이 높게 나타났습니다.",
          solution:
            "Service Worker 초기화 시점을 앱 시작 단계로 이동하고, 권한 거부 시 재시도·안내 UI를 구현해 사용자의 의사에 따라 다시 구독을 시도할 수 있도록 개선했습니다.",
          result:
            "웹 푸시 구독 성공률이 85%에서 95% 수준으로 향상되었고, 사용자 재방문 시 자동 재구독도 정상적으로 동작하게 되었습니다.",
        },
        {
          problem: "Cron 정산 작업에서 트랜잭션 타임아웃/데드락",
          cause:
            "대량 포인트 업데이트를 단일 트랜잭션으로 처리하면서 일부 레코드에서 데드락과 트랜잭션 타임아웃이 발생했습니다.",
          solution:
            "정산 대상을 청크 단위로 분할 처리하고, FOR UPDATE SKIP LOCKED와 재시도 로직을 적용해 경쟁 상황을 완화했습니다.",
          result:
            "정산 작업이 안정적으로 전체 처리 완료되며, 실행 시간이 약 30% 단축되었습니다.",
        },
        {
          problem: "채팅방 입장 시 메시지 로딩 지연",
          cause:
            "채팅방 입장 시 전체 메시지를 한 번에 불러오는 구조로 인해 초기 렌더링이 과도하게 느려지는 문제가 있었습니다.",
          solution:
            "커서 기반 페이지네이션과 무한 스크롤을 적용하고, React Query를 통해 캐싱 및 백그라운드 리페칭을 구성했습니다.",
          result:
            "초기 메시지 로딩 시간이 약 70% 감소했고, 스크롤 기반으로 자연스럽게 과거 메시지를 불러올 수 있는 경험을 제공하게 되었습니다.",
        },
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
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
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

        { name: "Socket.IO", icon: <SiSocketdotio className="h-4 w-4" /> },
      ],
      link: "https://github.com/NIPA-AWS-Developer-2nd",
      image:
        "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/24275eb6388f806c391d867e58a79cb5.png",
      pdf: "/project_halsaram.pdf",
    },
    {
      title: "한모아",
      period: "25.09 ~ 25.12",
      role: "Backend",
      teamSize: 4,
      description:
        "영어 화자의 음색과 운율을 보존한 자연스러운 한국어 더빙 음성을 생성하는 AI 더빙 서비스입니다. STT-TTS 및 S2ST 융합형 교차 언어 음성 합성 기술을 활용하여, 화자 분리, 음성 인식, 번역, TTS, 자막 생성까지 전 과정을 자동화합니다.",
      features: [
        "AI 기반 자동 더빙 음성 생성",
        "화자 분리 및 음성 인식",
        "실시간 번역 및 TTS 변환",
        "자막 자동 생성 및 동기화",
        "영상 업로드 및 처리 자동화",
        "프로젝트 및 더빙 작업 관리 시스템",
      ],
      responsibilities: [
        {
          title: "데이터베이스 설계 및 ERD 구성",
          description: "TypeORM 기반 더빙 워크플로우 엔티티 설계",
          details: [
            "9개 핵심 엔티티 설계: User, Project, VideoAsset, DubJob, JobStep, Speaker, Segment, OutputAsset, Subtitle",
            "더빙 파이프라인 단계별 엔티티 관계 매핑 (업로드 → STT → 화자 분리 → 번역 → TTS → 렌더링)",
            "One-to-Many 관계 및 Cascade 옵션 설정",
            "UNIQUE INDEX 및 외래 키 제약조건 최적화",
            "BaseEntity 추상 클래스를 활용한 공통 필드 관리",
          ],
        },
        {
          title: "DubJob 시스템 및 Worker API 구현",
          description: "AI 파이프라인 통신 인터페이스 및 작업 관리",
          details: [
            "DubJobsModule: VideoAsset 기반 DubJob 자동 생성 및 상태 관리",
            "WorkerModule: AI Worker와의 통신을 위한 API 엔드포인트 제공",
            "작업 클레임 및 상태 업데이트 API (대기 → 처리중 → 완료/실패)",
            "세그먼트 메타데이터 저장 및 진행률 추적",
            "SQS 메시지 발송을 통한 AI Worker 트리거",
          ],
        },
        {
          title: "비디오 업로드 및 처리 자동화",
          description: "S3 Presigned URL 기반 파일 업로드 시스템",
          details: [
            "S3 Presigned URL 발급 API 구현",
            "직접 업로드 엔드포인트 추가 (multipart/form-data)",
            "파일 메타데이터 추출 (fileSize, mimeType)",
            "업로드 완료 시 DubJob 자동 생성 및 SQS 알림 발송",
            "S3 이벤트 기반 비동기 처리 파이프라인 구성",
          ],
        },
        {
          title: "프로젝트 도메인 모듈 구현",
          description: "프로젝트 CRUD 및 더빙 작업 관리",
          details: [
            "프로젝트 생성, 조회, 수정, 삭제 API 구현",
            "프로젝트별 VideoAsset 및 DubJob 목록 조회",
            "페이지네이션 및 필터링 기능 추가",
            "DTO 유효성 검사 및 Swagger 문서화",
          ],
        },
        {
          title: "인증 시스템 및 배포",
          description: "OAuth 인증 및 AWS 인프라 구축",
          details: [
            "GitHub, Google OAuth 2.0 전략 구현",
            "Passport.js 기반 인증 Guard 설정",
            "AWS Route53 + EC2 + Nginx 배포 환경 구축",
            "Let's Encrypt SSL/TLS 인증서 적용",
            "GitHub Secrets를 활용한 환경 변수 관리",
          ],
        },
        {
          title: "개발 도구 및 테스트",
          description: "NestJS Devtools 및 단위 테스트 구축",
          details: [
            "NestJS Devtools 설정 및 모듈 의존성 시각화",
            "단위 테스트 환경 구성 및 테스트 코드 작성",
            "개발 환경 Hot Reload 설정",
            "로깅 시스템 구축 및 디버그 정보 수집",
          ],
        },
      ],
      troubleshooting: [
        {
          problem: "대용량 비디오 업로드 타임아웃",
          cause:
            "서버를 경유해 S3로 업로드하면서 전송 시간이 길어지고 요청 타임아웃이 잦았습니다.",
          solution:
            "S3 Presigned URL을 도입해 클라이언트 → S3 직접 업로드 방식으로 변경하고, 업로드 완료는 S3 이벤트로 감지하도록 재구성했습니다.",
          result:
            "타임아웃 문제가 완전히 해소되었고 서버 부하가 약 90% 감소했으며, 업로드 속도도 약 3배 향상되었습니다.",
        },
        {
          problem: "Cascade 옵션 오사용으로 인한 데이터 삭제",
          cause:
            "Project 삭제 시 연관된 VideoAsset과 DubJob이 예상보다 넓은 범위로 삭제되었습니다.",
          solution:
            "Cascade 옵션을 단계별로 명확히 분리하고, onDelete: 'SET NULL' 또는 'RESTRICT'를 상황에 따라 적용했습니다. 또한 삭제 전 사전 검증 로직을 추가했습니다.",
          result:
            "데이터 무결성을 안정적으로 보장하게 되었고, 프로젝트 삭제 과정에서의 의도치 않은 손실을 방지할 수 있게 되었습니다.",
        },
        {
          problem: "DubJob 상태 업데이트 동시성 문제",
          cause:
            "여러 Segment가 동시에 완료되면서 DubJob의 상태 및 완료 카운트가 서로 덮어써지는 race condition이 발생했습니다.",
          solution:
            "트랜잭션과 FOR UPDATE 행 잠금을 활용하여 동시성을 제어하고, Segment 완료 시 카운트 증가와 상태 변경을 원자적으로 처리하도록 수정했습니다.",
          result:
            "DubJob 진행률과 상태가 정확하게 유지되도록 개선되었고, race condition이 제거되었습니다.",
        },
        {
          problem: "NestJS Devtools WebSocket 끊김",
          cause:
            "Devtools의 WebSocket 연결이 개발 환경에서 간헐적으로 끊어져 디버깅이 어려웠습니다.",
          solution:
            "WebSocket 자동 재연결 로직을 추가하고, Devtools 모듈을 개발 환경에서만 조건부 로딩하도록 변경했습니다.",
          result:
            "개발 중 안정적으로 Devtools를 사용할 수 있게 되었고, 디버깅 효율이 크게 향상되었습니다.",
        },
        {
          problem: "SQS 메시지 무한 재시도 및 큐 적체",
          cause:
            "AI 파이프라인에서 처리 실패한 메시지가 삭제되지 않고 VisibilityTimeout(5분) 후 계속 재시도되어 큐에 메시지가 계속 남아있었습니다. Dead Letter Queue(DLQ)가 설정되지 않아 실패한 메시지가 무한 반복되었습니다.",
          solution:
            "Dead Letter Queue를 생성하고 메인 큐에 RedrivePolicy를 설정했습니다. maxReceiveCount를 3으로 설정하여 3번 재시도 후 실패 시 자동으로 DLQ로 이동하도록 구성했습니다. AI 파이프라인이 작업 완료 시 delete_message()를 호출하여 메시지를 명시적으로 삭제하도록 설계했습니다.",
          result:
            "실패한 메시지가 DLQ로 분리되어 메인 큐가 막히지 않게 되었고, 처리 완료된 메시지는 자동 삭제되어 큐 관리가 안정화되었습니다. DLQ에서 실패 원인을 분석할 수 있게 되었습니다.",
        },
        {
          problem: "프로젝트 목록에서 실제 작업 상태가 표시되지 않음",
          cause:
            "프로젝트 목록 조회 API에서 videoAsset만 포함하고 dubJobs를 포함하지 않아, 프론트엔드가 videoAsset.status(항상 'ready')만 확인할 수 있었습니다. 실제 작업 상태는 dubJob.status에 있었지만 relation에 포함되지 않았습니다.",
          solution:
            "프로젝트 목록 조회 시 relations에 'videoAsset.dubJobs'를 추가하고, QueryBuilder로 변경하여 dubJobs를 최신순으로 정렬했습니다. 이를 통해 프론트엔드가 최신 DubJob의 status를 확인할 수 있게 되었습니다.",
          result:
            "프론트엔드에서 실시간으로 작업 상태(pending, processing, completed, failed)를 정확하게 표시할 수 있게 되었고, 사용자가 더빙 작업 진행 상황을 명확하게 파악할 수 있게 되었습니다.",
        },
      ],
      tech: [
        { name: "NestJS", icon: <SiNestjs className="h-4 w-4" /> },
        { name: "TypeScript", icon: <SiTypescript className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <SiPostgresql className="h-4 w-4" /> },
        { name: "JWT", icon: <SiJsonwebtokens className="h-4 w-4" /> },
        {
          name: "OAuth2",
          icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          ),
        },

        { name: "Amazon SQS", icon: <SiAmazonsqs className="h-4 w-4" /> },
        { name: "Amazon S3", icon: <SiAmazons3 className="h-4 w-4" /> },
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

      {/* 프로젝트 상세 모달 */}
      <ProjectDetailModal
        isOpen={isProjectDetailOpen}
        onClose={closeProjectDetail}
        project={selectedProject}
        latestPost={latestPost}
      />

      {/* 테마 토글 버튼 */}
      <div
        className={`fixed top-6 right-6 z-50 ${
          modalImage.isOpen || isProjectDetailOpen ? "z-40" : "z-50"
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
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto rounded-full overflow-hidden ring-2 ring-gray-300 dark:ring-gray-700">
                <Image
                  src="https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/fc3d75e331fec6298c3db51101665511.jpeg"
                  alt="Profile"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover object-[center_20%] select-none pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
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
                  onCardClick={openProjectDetail}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Toy Projects 섹션 */}
        <section
          id="toy-projects"
          className="py-20 bg-gradient-to-b from-muted/50 to-background"
        >
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none">
                  <span
                    className="bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent
                                 drop-shadow-lg relative
                                 dark:from-sky-400 dark:via-cyan-400 dark:to-teal-400 dark:opacity-80 px-1"
                  >
                    TOY PROJECTS
                  </span>
                </h2>
                {/* 배경 텍스트 효과 */}
                <div className="absolute inset-0 -z-10">
                  <span
                    className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-none
                                 text-gray-100 dark:text-gray-700 opacity-50 blur-sm"
                  >
                    TOY PROJECTS
                  </span>
                </div>
                {/* 언더라인 효과 */}
                <div
                  className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-32 sm:w-40 lg:w-52 h-0.5
                                bg-gradient-to-r from-sky-600 to-teal-600 rounded-full
                                dark:from-sky-400 dark:to-teal-400 dark:opacity-70"
                ></div>
              </div>
            </div>

            {/* 토이 프로젝트 카드 그리드 - 작은 크기 */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sideProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  {project.image && (
                    <div className="relative w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-t-lg">
                      <div className="relative w-full h-48">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="space-y-2 flex-1">
                      <div className="space-y-1">
                        <h3 className="font-bold text-base">{project.title}</h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          {project.period}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* 기술 스택 */}
                    <div className="space-y-2 mt-3">
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

                    {/* 버튼 */}
                    <div className="mt-auto pt-4 space-y-2">
                      {project.demo && (
                        <Button
                          variant="default"
                          className="w-full text-xs"
                          asChild
                        >
                          <Link
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            Demo
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full text-xs"
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
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent
                               drop-shadow-lg relative
                               dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400 dark:opacity-80"
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
                              bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full
                              dark:from-indigo-400 dark:to-violet-400 dark:opacity-70"
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Experience 카드 */}
              <div className="bg-card rounded-lg shadow-md p-3 sm:p-4 flex flex-col">
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
                <ul className="space-y-4 pl-3 pb-3">
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
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>프로그래머스 데브코스 웹 풀스택 3기 수료</span>
                      <Link
                        href="/experience_devcourse.pdf"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      그렙
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2024.04 ~ 2024.10
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>NIPA AWS Developer 부트캠프 2기 수료</span>
                      <Link
                        href="/experience_nipa.pdf"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">
                      한국소프트웨어산업협회
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2025.06 ~ 2025.08
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>2025 SW 인재 페스티벌 숭실대학교 부스 운영</span>
                      <Link
                        href="/experience-sw-contest-2025.pdf"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
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
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>정보처리기능사</span>
                      <Link
                        href="/certificate_craftsman.pdf"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      한국산업인력공단
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2019.07.18
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
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>SQLD</span>
                      <Link
                        href="/certificate_sqld.pdf"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      한국데이터산업진흥원
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2024.09.20
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>ADsP</span>
                      <Link
                        href="/certificate_adsp.pdf"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      한국데이터산업진흥원
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2025.06.13
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>
                        AWS Certified Solutions Architect - Associate (SAA-C03)
                      </span>
                      <Link
                        href="https://www.credly.com/badges/4cc479e1-3212-476b-af16-3e1af0c14633/public_url"
                        target="_blank"
                        rel="noopener noreferrer"
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Amazon Web Services
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2025.10.30
                    </div>
                  </li>
                  <li>
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>TOPCIT 제24회 580점</span>
                      <Link
                        href="/certificate_topcit.pdf"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      정보통신기획평가원
                    </div>
                    <div className="text-xs text-muted-foreground">
                      2025.11.01
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
                <ul className="space-y-4 pl-3 pb-3">
                  <li>
                    <div className="font-semibold text-sm flex items-center justify-between">
                      <span>숭실대학교 창의적공학설계 전시회 최우수상</span>
                      <Link
                        href="/award-creative-engineering-design-2022.pdf"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      숭실대학교 소프트웨어학부
                    </div>
                    <div className="text-xs text-muted-foreground">2022.12</div>
                  </li>
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                    className="bg-gradient-to-r from-slate-700 via-gray-600 to-zinc-700 bg-clip-text text-transparent
                                 drop-shadow-lg relative
                                 dark:from-slate-400 dark:via-gray-400 dark:to-zinc-400 px-1"
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
                                bg-gradient-to-r from-slate-700 to-zinc-700 rounded-full
                                dark:from-slate-400 dark:to-zinc-400"
                ></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl w-full justify-items-center">
                {skills.map((skill) => (
                  <div
                    key={skill.category}
                    className="p-4 sm:p-5 bg-card rounded-lg shadow-lg h-full w-full max-w-sm flex flex-col"
                  >
                    <h3 className="font-bold mb-3 text-base sm:text-lg">
                      {skill.category}
                    </h3>
                    <ul className="space-y-2.5 pl-4">
                      {skill.techs.map((tech) => (
                        <li key={tech.name}>
                          <Tooltip content={tech.description}>
                            <div className="flex items-start space-x-2 text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm">
                              <span className="flex-shrink-0 w-4 h-4 mt-0.5">
                                {tech.icon}
                              </span>
                              <span>{tech.name}</span>
                            </div>
                          </Tooltip>
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
