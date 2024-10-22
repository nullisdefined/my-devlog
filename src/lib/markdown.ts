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

const createCopyButton = (): Element => ({
  type: "element",
  tagName: "button",
  properties: {
    className: [
      "absolute",
      "top-2",
      "right-2",
      "p-2",
      "rounded-lg",
      "bg-primary/10",
      "hover:bg-primary/20",
      "opacity-0",
      "group-hover:opacity-100",
      "transition-all",
      "duration-200",
      "copy-button",
    ],
    "data-code": "",
  },
  children: [
    {
      type: "element",
      tagName: "svg",
      properties: {
        className: ["h-4", "w-4"],
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
      children: [
        {
          type: "element",
          tagName: "path",
          properties: {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
          },
          children: [],
        },
        {
          type: "element",
          tagName: "rect",
          properties: {
            x: "8",
            y: "2",
            width: "8",
            height: "4",
            rx: "1",
            ry: "1",
          },
          children: [],
        },
      ],
    },
  ],
});

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
          (node.properties.className as string[]).push(
            "overflow-x-auto",
            "[&::-webkit-scrollbar]:h-2",
            "[&::-webkit-scrollbar-track]:bg-muted",
            "[&::-webkit-scrollbar-thumb]:bg-primary/20",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:border-2",
            "[&::-webkit-scrollbar-thumb]:border-transparent",
            "[&::-webkit-scrollbar-thumb]:bg-clip-padding",
            "hover:[&::-webkit-scrollbar-thumb]:bg-primary/40",
            "motion-safe:scroll-smooth",
            "relative"
          );

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
      plugins: ["line-numbers", "show-language"],
      theme: "dracula",
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
