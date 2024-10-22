import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Mail, FileText } from "lucide-react";

export default function Home() {
  const skills = [
    {
      category: "Frontend",
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    { category: "Backend", techs: ["Node.js", "Express", "Python", "Django"] },
    { category: "Database", techs: ["PostgreSQL", "MongoDB", "Redis"] },
    { category: "DevOps", techs: ["Docker", "AWS", "Git"] },
  ];

  const projects = [
    {
      title: "프로젝트 1",
      description: "프로젝트 설명입니다.",
      tech: ["React", "Node.js", "PostgreSQL"],
      link: "https://github.com/username/project1",
    },
    // 더 많은 프로젝트 추가
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">김재우</h1>
          <p className="text-xl text-muted-foreground mb-6">
            풀스택 개발자 | 테크 블로거
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/blog">
                <FileText className="mr-2 h-4 w-4" />
                블로그
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:your.email@example.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">About Me</h2>
          <p className="text-lg text-muted-foreground mb-6">
            안녕하세요! 저는 웹 개발자로서 사용자 경험을 중시하며, 최신 기술
            트렌드를 학습하고 적용하는 것을 좋아합니다.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div key={skill.category} className="p-6 bg-card rounded-lg shadow">
              <h3 className="font-bold mb-4">{skill.category}</h3>
              <ul className="space-y-2">
                {skill.techs.map((tech) => (
                  <li key={tech} className="text-muted-foreground">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow">
                <h3 className="font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View Project
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8">Contact</h2>
        <div className="max-w-lg mx-auto">
          <div className="space-y-4">
            <p className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              <a
                href="mailto:your.email@example.com"
                className="text-primary hover:underline"
              >
                your.email@example.com
              </a>
            </p>
            <p className="flex items-center">
              <Github className="mr-2 h-4 w-4" />
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/username
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
