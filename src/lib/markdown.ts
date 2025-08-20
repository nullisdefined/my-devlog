import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Element } from "hast";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { TableOfContentsItem } from "@/types/index";
import { languageConfigs, normalizeLanguage } from "./code-languages";

// 하이라이터 인스턴스를 캐시하기 위한 전역 변수
const highlighter: any = null;

// 형광펜(Highlight) 커스텀 플러그인
function remarkHighlight() {
  return (tree: any) => {
    visit(tree, "text", (node, index, parent) => {
      if (!node.value || typeof node.value !== "string") return;

      // 코드 블록 내부인지 확인 (부모가 code나 pre인 경우 제외)
      let currentParent = parent;
      while (currentParent) {
        if (
          currentParent.type === "code" ||
          currentParent.type === "inlineCode"
        ) {
          return; // 코드 블록 내부에서는 형광펜 처리하지 않음
        }
        currentParent = currentParent.parent;
      }

      // == 문법을 찾아서 처리
      const regex = /==(.*?)==/g;
      const matches = [...node.value.matchAll(regex)];

      if (matches.length === 0) return;

      // 새로운 children 배열 생성
      const newChildren = [];
      let lastIndex = 0;

      matches.forEach((match) => {
        const matchStart = match.index!;
        const matchEnd = matchStart + match[0].length;

        // 매치 이전의 텍스트
        if (matchStart > lastIndex) {
          newChildren.push({
            type: "text",
            value: node.value.slice(lastIndex, matchStart),
          });
        }

        // 하이라이트 요소 생성
        newChildren.push({
          type: "strong",
          children: [
            {
              type: "text",
              value: match[1],
            },
          ],
          data: {
            hName: "mark",
            hProperties: {
              className: ["highlight-mark"],
            },
          },
        });

        lastIndex = matchEnd;
      });

      // 마지막 텍스트
      if (lastIndex < node.value.length) {
        newChildren.push({
          type: "text",
          value: node.value.slice(lastIndex),
        });
      }

      // 부모 노드의 children 교체
      if (parent && typeof index === "number") {
        parent.children.splice(index, 1, ...newChildren);
      }
    });
  };
}

function createCopyButton(): Element {
  return {
    type: "element",
    tagName: "button",
    properties: {
      className: [
        "copy-button",
        "absolute",
        "right-2",
        "top-2",
        "p-2",
        "rounded-lg",
        "opacity-0",
        "group-hover:opacity-100",
        "bg-black/30",
        "hover:bg-black/50",
        "transition-all",
        "duration-200",
      ],
      "aria-label": "코드 복사",
      style: "width: 40px; height: 40px;",
    },
    children: [
      {
        type: "element",
        tagName: "svg",
        properties: {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: ["w-4", "h-4", "mx-auto"],
          "data-copy-icon": "true",
        },
        children: [
          {
            type: "element",
            tagName: "path",
            properties: {
              d: "M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.912 4.895 3 6 3h8c1.105 0 2 .912 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.088 19.105 22 18 22h-8c-1.105 0-2-.912-2-2.036V9.107c0-1.124.895-2.036 2-2.036z",
            },
            children: [],
          },
        ],
      },
    ],
  };
}

function createToggleDiagramButton(): Element {
  return {
    type: "element",
    tagName: "button",
    properties: {
      className: [
        "toggle-diagram-button",
        "absolute",
        "right-14",
        "top-2",
        "p-2",
        "rounded-lg",
        "opacity-0",
        "group-hover:opacity-100",
        "bg-blue-500/30",
        "hover:bg-blue-500/50",
        "transition-all",
        "duration-200",
      ],
      "aria-label": "다이어그램으로 보기",
      "data-view": "diagram",
      style: "width: 40px; height: 40px;",
    },
    children: [
      {
        type: "element",
        tagName: "svg",
        properties: {
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: ["w-4", "h-4", "mx-auto"],
        },
        children: [
          {
            type: "element",
            tagName: "path",
            properties: {
              d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
            },
            children: [],
          },
          {
            type: "element",
            tagName: "polyline",
            properties: {
              points: "7.5,8 12,5 16.5,8",
            },
            children: [],
          },
          {
            type: "element",
            tagName: "polyline",
            properties: {
              points: "7.5,16 12,19 16.5,16",
            },
            children: [],
          },
          {
            type: "element",
            tagName: "polyline",
            properties: {
              points: "12,12 12,5",
            },
            children: [],
          },
        ],
      },
    ],
  };
}

export async function markdownToHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHighlight)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypePrettyCode, {
      theme: {
        dark: "github-dark",
        light: "github-light",
      },
      keepBackground: false,
      defaultLang: "javascript",
      grid: false,
      transformers: [
        {
          name: "line-numbers",
          line(node, line) {
            node.properties["data-line"] = line;
          },
        },
      ],
      onVisitLine(node) {
        if (node.children.length === 0) {
          node.children = [{ type: "text", value: " " }];
        }
      },
      onVisitHighlightedLine(node) {
        if (!node.properties) {
          node.properties = {};
        }
        const className = node.properties.className || [];
        if (Array.isArray(className)) {
          className.push("highlighted");
          node.properties.className = className;
        }
      },
    })
    .use(rehypeSlug)
    .use(() => (tree) => {
      visit(tree, "element", (node: Element) => {
        if (node.tagName === "pre") {
          const codeEl = node.children[0] as Element;
          if (codeEl?.tagName === "code") {
            let language = "javascript";

            if (codeEl.properties?.["data-language"]) {
              language = codeEl.properties["data-language"] as string;
            }

            const className = codeEl.properties?.className;
            if (Array.isArray(className)) {
              const languageClass = className.find((cls): cls is string => {
                return typeof cls === "string" && cls.startsWith("language-");
              });
              if (languageClass) {
                language = languageClass.substring(9);
              }
            }

            const normalizedLang = normalizeLanguage(language);
            
            // Mermaid 다이어그램인 경우 특별 처리
            if (normalizedLang === "mermaid") {
              // 복사 버튼과 토글 버튼 추가
              const copyButton = createCopyButton();
              const toggleButton = createToggleDiagramButton();
              
              node.children.push(copyButton);
              node.children.push(toggleButton);
              
              // mermaid 클래스 추가
              if (!node.properties) {
                node.properties = {};
              }
              
              const existingClasses = Array.isArray(node.properties.className) 
                ? node.properties.className 
                : [];
              
              node.properties = {
                ...node.properties,
                "data-language": "mermaid",
                className: [
                  ...existingClasses,
                  "relative",
                  "group",
                  "rounded-lg",
                  "overflow-hidden",
                  "border-l-4",
                  "border-l-blue-500",
                  "my-6",
                  "mermaid-diagram"
                ],
              };
              
              // 코드 요소에도 mermaid 클래스 추가
              if (!codeEl.properties) {
                codeEl.properties = {};
              }
              const existingCodeClasses = Array.isArray(codeEl.properties.className) 
                ? codeEl.properties.className 
                : [];
              
              codeEl.properties.className = [
                ...existingCodeClasses,
                "language-mermaid"
              ];
              
              return; // mermaid는 일반 코드 블록 처리를 건너뛰기
            }

            const config = languageConfigs[normalizedLang];
            const copyButton = createCopyButton();

            node.children.push(copyButton);

            if (!node.properties) {
              node.properties = {};
            }

            node.properties = {
              ...node.properties,
              "data-language": normalizedLang,
              "data-language-icon": config.icon,
              style: `--language-color: ${config.color}`,
              className: [
                "relative",
                "group",
                "rounded-lg",
                "overflow-hidden",
                config.borderColor,
                "border-l-4",
                "my-6",
              ],
            };
          }
        }
      });
    })
    .use(rehypeStringify, {
      allowDangerousHtml: true,
    })
    .process(content);

  return result.toString();
}

// HTML 엔티티를 디코딩하는 함수
function decodeHtmlEntities(text: string): string {
  // 서버 사이드에서도 작동하도록 수동 디코딩
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
    '&nbsp;': ' ',
  };
  
  // 먼저 숫자형 HTML 엔티티 처리 (&#x26;, &#38; 등)
  let decoded = text.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    try {
      const code = parseInt(hex, 16);
      return String.fromCharCode(code);
    } catch {
      return match; // 변환 실패시 원본 반환
    }
  });
  
  decoded = decoded.replace(/&#(\d+);/g, (match, decimal) => {
    try {
      const code = parseInt(decimal, 10);
      return String.fromCharCode(code);
    } catch {
      return match; // 변환 실패시 원본 반환
    }
  });
  
  // 명명된 엔티티 처리
  Object.entries(entities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), char);
  });
  
  return decoded;
}

export function extractTableOfContents(html: string): TableOfContentsItem[] {
  const headings =
    html.match(/<h([2-4])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h[2-4]>/g) || [];

  return headings.map((heading) => {
    const levelMatch = heading.match(/<h([2-4])/);
    const idMatch = heading.match(/id="([^"]+)"/);
    const titleMatch = heading.match(/>(.+?)<\/h[2-4]>/);

    const level = levelMatch ? parseInt(levelMatch[1]) : 2;
    const id = idMatch ? idMatch[1] : "";
    const rawTitle = titleMatch
      ? titleMatch[1].replace(/<[^>]*>/g, "").trim()
      : "";
    
    // HTML 엔티티 디코딩
    const title = decodeHtmlEntities(rawTitle);

    return { level, id, title };
  });
}
