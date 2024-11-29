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
let highlighter: any = null;

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
          className: ["w-4", "h-4"],
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

export async function markdownToHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypePrettyCode, {
      theme: "one-dark-pro",
      keepBackground: true,
      defaultLang: "plaintext",
      onVisitHighlightedLine(node) {
        if (!node.properties) {
          node.properties = {};
        }
        if (!node.properties.className) {
          node.properties.className = [];
        }
        if (Array.isArray(node.properties.className)) {
          node.properties.className.push("highlighted");
        }
      },
      onVisitLine(node) {
        if (node.children.length === 0) {
          node.children = [{ type: "text", value: " " }];
        }
      },
    })
    .use(rehypeSlug)
    .use(() => (tree) => {
      visit(tree, "element", (node: Element) => {
        if (node.tagName === "pre") {
          const codeEl = node.children[0] as Element;
          if (codeEl?.tagName === "code") {
            let language = codeEl?.properties?.["data-language"] || "plaintext";
            const className = codeEl.properties?.className;

            if (Array.isArray(className)) {
              const languageClass = className.find((cls): cls is string => {
                return typeof cls === "string" && cls.startsWith("language-");
              });

              if (languageClass && typeof languageClass === "string") {
                language = languageClass.substring(9);
              }
            }

            const normalizedLang = normalizeLanguage(language as string);
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

export function extractTableOfContents(html: string): TableOfContentsItem[] {
  const headings =
    html.match(/<h([2-4])[^>]*id="([^"]+)"[^>]*>(.*?)<\/h[2-4]>/g) || [];

  return headings.map((heading) => {
    const levelMatch = heading.match(/<h([2-4])/);
    const idMatch = heading.match(/id="([^"]+)"/);
    const titleMatch = heading.match(/>(.+?)<\/h[2-4]>/);

    const level = levelMatch ? parseInt(levelMatch[1]) : 2;
    const id = idMatch ? idMatch[1] : "";
    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]*>/g, "").trim()
      : "";

    return { level, id, title };
  });
}
