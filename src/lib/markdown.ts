import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { Element } from "hast";
import { TableOfContentsItem } from "@/types/post";

const rehypeCodeCopy: Plugin = () => {
  return (tree) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "pre") {
        const codeNode = node.children.find(
          (child): child is Element =>
            child.type === "element" && child.tagName === "code"
        );

        if (
          codeNode &&
          codeNode.children[0] &&
          "value" in codeNode.children[0]
        ) {
          const code = codeNode.children[0].value as string;
          node.properties = {
            ...node.properties,
            "data-code": code,
          };
        }
      }
    });
  };
};

export async function markdownToHtml(content: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeCodeTitles)
    .use(rehypeHighlight, {
      detect: true,
      ignoreMissing: true,
    })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeCodeCopy)
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
