export function removeMarkdown(markdown: string | undefined): string {
  if (!markdown) return "";

  // 줄바꿈 문자열('\n')을 실제 줄바꿈으로 변환
  let text = markdown.replace(/\\n/g, "\n");

  // 1. 코드 블록을 가장 먼저 제거 (우선순위 최고) - 더 강화된 패턴
  // 백틱 3개로 시작하는 모든 코드 블록 (언어 지정 여부 관계없이)
  text = text.replace(/```[\s\S]*?```/g, " ");
  // 언어 지정이 있는 코드 블록을 더 구체적으로
  text = text.replace(/```\s*[a-zA-Z0-9+#-]*\s*\{[^}]*\}[\s\S]*?```/g, " ");
  text = text.replace(/```\s*[a-zA-Z0-9+#-]+[\s\S]*?```/g, " ");
  // ~~~ 형태의 코드 블록
  text = text.replace(/~~~[\s\S]*?~~~/g, " ");
  // 들여쓰기 코드 블록 (4개 이상의 공백이나 탭으로 시작하는 라인)
  text = text.replace(/^(    |\t)+.*$/gm, "");

  // 2. 헤더 완전 제거 (# 로 시작하는 라인 전체)
  text = text.replace(/^#{1,6}.*$/gm, "");

  // 3. 이미지 태그 제거
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  // 4. 링크 제거 (텍스트만 남김)
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 5. 인용문 제거 (> 로 시작하는 라인 전체)
  text = text.replace(/^>.*$/gm, "");

  // 6. 테이블 제거
  text = text.replace(/\|([^\n]*)\|/g, "");

  // 7. 수평선 제거
  text = text.replace(/^---+$/gm, "");
  text = text.replace(/^\*\*\*+$/gm, "");

  // 8. 리스트 마커만 제거하고 내용은 보존
  text = text.replace(/^[\s]*[-*+]\s+/gm, "");
  text = text.replace(/^[\s]*\d+\.\s+/gm, "");

  // 9. 인라인 코드 제거 - 백틱만 제거하고 내용은 보존
  text = text.replace(/`([^`]*)`/g, "$1");

  // 10. 강조 표시 제거 - 내용은 보존
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1"); // 볼드
  text = text.replace(/\*([^*]+)\*/g, "$1"); // 이탤릭
  text = text.replace(/__([^_]+)__/g, "$1"); // 볼드 (언더스코어)
  text = text.replace(/_([^_]+)_/g, "$1"); // 이탤릭 (언더스코어)
  text = text.replace(/~~([^~]+)~~/g, "$1"); // 취소선

  // 11. HTML 태그 제거
  text = text.replace(/<[^>]*>/g, "");

  // 12. 마크다운 특수 문자 제거 (남은 것들)
  text = text.replace(/[`*_~#>]/g, "");

  // 13. JavaScript/코드 특수 키워드 제거 (평문으로 변환)
  text = text.replace(
    /\b(const|let|var|function|require|import|export|from|class|interface|type|enum)\b/g,
    ""
  );
  text = text.replace(/[{}();=]/g, " ");

  // 14. 빈 줄과 공백 정리
  text = text
    .split("\n")
    .map((line) => line.trim()) // 각 줄의 앞뒤 공백 제거
    .filter((line) => line !== "") // 빈 줄 제거
    .join(" ") // 줄바꿈 없이 한 줄로 연결
    .replace(/\s+/g, " ") // 연속된 공백을 하나로
    .trim();

  return text;
}

export function getFirstParagraph(
  markdown: string | undefined,
  maxLength: number = 250
): string {
  if (!markdown) return "";

  // 전체 텍스트 정제
  const cleanText = removeMarkdown(markdown);

  // 최대 길이로 자르기 (단어 경계에서)
  if (cleanText.length > maxLength) {
    const truncated = cleanText.slice(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    // 단어 중간에서 자르지 않도록 조정
    if (lastSpaceIndex > maxLength * 0.7) {
      return truncated.slice(0, lastSpaceIndex) + "...";
    }
    return truncated.slice(0, maxLength - 3) + "...";
  }

  return cleanText;
}
