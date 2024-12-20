export function removeMarkdown(markdown: string | undefined): string {
  if (!markdown) return "";

  // 줄바꿈 문자열('\n')을 실제 줄바꿈으로 변환
  let text = markdown.replace(/\\n/g, "\n");

  // 이미지 태그 제거
  text = text.replace(/!\[([^\]]+)\]\([^)]+\)/g, "");

  // 헤더 제거 (## 같은 마크다운 헤더)
  text = text.replace(/^#+\s+/gm, "");

  // 다른 마크다운 문법 제거
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1"); // 볼드
  text = text.replace(/_([^_]+)_/g, "$1"); // 이탤릭
  text = text.replace(/`[^`]+`/g, "$1"); // 인라인 코드
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // 링크

  // 빈 줄 제거하고 공백 정리
  text = text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

export function getFirstParagraph(
  markdown: string | undefined,
  maxLength: number = 100
): string {
  if (!markdown) return "";

  // 전체 텍스트 정제
  const cleanText = removeMarkdown(markdown);

  // 최대 길이로 자르기
  if (cleanText.length > maxLength) {
    return cleanText.slice(0, maxLength) + "...";
  }

  return cleanText;
}
