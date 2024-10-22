import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Element, ElementContent } from "hast";
import { TableOfContentsItem } from "@/types/post";

function createCopyButton(): Element {
  return {
    type: "element",
    tagName: "button",
    properties: {
      className: [
        "absolute",
        "right-2",
        "top-2",
        "p-2",
        "rounded-md",
        "bg-black/20",
        "hover:bg-black/40",
        "transition-all",
        "duration-200",
        "opacity-0",
        "group-hover:opacity-100",
        "copy-code-button",
      ],
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

const codeBlockStyles = [
  "relative",
  "group",
  "rounded-lg",
  "bg-black/90",
  "p-4",
  "overflow-x-auto",
];

export async function markdownToHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(() => (tree) => {
      visit(tree, "element", (node: Element) => {
        if (node.tagName === "pre") {
          if (!node.properties) {
            node.properties = {};
          }
          if (!node.properties.className) {
            node.properties.className = [];
          }
          (node.properties.className as string[]).push(...codeBlockStyles);

          const codeEl = node.children[0] as Element;
          if (codeEl?.tagName === "code") {
            const button = createCopyButton();
            button.properties["data-code"] = toString(codeEl);
            node.children.push(button as ElementContent);
          }
        }
      });
    })
    .use(rehypeCodeTitles)
    .use(rehypePrism, {
      plugins: ["line-numbers"],
      theme: "monokai",
    } as any)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeStringify)
    .process(content);

  return result.toString();
}

export function extractTableOfContents(html: string): TableOfContentsItem[] {
  const headings =
    html.match(/<h([2-4]) id="([^"]+)".*?>(.*?)<\/h[2-4]>/g) || [];
  return headings.map((heading) => {
    const level = parseInt(heading.match(/<h([2-4])/)?.[1] || "2");
    const id = heading.match(/id="([^"]+)"/)?.[1] || "";
    const title = heading.replace(/<[^>]*>/g, "");
    return { level, id, title };
  });
}
