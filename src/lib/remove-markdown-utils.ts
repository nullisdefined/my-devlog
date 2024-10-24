export function removeMarkdown(markdown: string | undefined): string {
  if (!markdown) return "";

  let text = markdown;

  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`[^`]*`/g, "");
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text = text.replace(/!\[([^\]]+)\]\([^)]+\)/g, "");
  text = text.replace(/^\s*>\s+/gm, "");
  text = text.replace(/^(?:[-*_]){3,}\s*$/gm, "");
  text = text.replace(/^[\s-*+]+/gm, "");
  text = text.replace(/<[^>]*>/g, "");
  text = text.replace(/\n{2,}/g, "\n");
  text = text.replace(/^\s+|\s+$/g, "");

  return text;
}

export function getFirstParagraph(
  markdown: string | undefined,
  maxLength?: number
): string {
  if (!markdown) return "";

  const paragraphs = markdown.split(/\n\s*\n/);
  let firstParagraph = "";

  for (const paragraph of paragraphs) {
    const cleaned = removeMarkdown(paragraph).trim();
    if (cleaned.length > 0) {
      firstParagraph = cleaned;
      break;
    }
  }

  if (maxLength && firstParagraph.length > maxLength) {
    return firstParagraph.slice(0, maxLength) + "...";
  }

  return firstParagraph;
}
