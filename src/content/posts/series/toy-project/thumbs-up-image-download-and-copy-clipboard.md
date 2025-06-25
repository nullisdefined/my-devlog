---
title: "[Thumbs Up] 이미지 다운로드 및 클립보드 복사 기능 구현하기"
slug: "thumbs-up-image-download-and-copy-clipboard"
date: 2024-10-31
tags: ["React", "TypeScript", "TailwindCSS", "ToyProject"]
category: "Series/Toy-Project"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e4d9c6192e594bafdd13406bff5c0257.png"
draft: false
views: 0
---
썸네일 제너레이터 도구를 완성하면서 결과물을 즉시 활용할 수 있는 기능이 있으면 좋겠다고 생각했다.
그래서 이미지 다운로드와 클립보드 복사 기능을 추가해 사용자가 손쉽게 썸네일을 저장하거나 붙여넣을 수 있도록 구현했다.

## 이미지 다운로드 기능
`canvas`에서 생성된 이미지를 PNG 파일로 저장할 수 있도록 구현했다.

```tsx
const handleDownload = () => {
  const canvas = canvasRef.current; // 현재 캔버스 참조
  if (!canvas) return;

  // 이미지 다운로드 링크 생성
  const link = document.createElement("a");
  link.download = "thumbnail.png"; // 파일 이름 설정
  link.href = canvas.toDataURL("image/png"); // 캔버스를 데이터 URL로 변환
  link.click(); // 다운로드 실행
};
```

- **`canvas.toDataURL`**
    - 캔버스의 내용을 Base64 형식의 PNG 이미지로 변환한다.
- 다운로드 링크 생성
    - `a` 태그를 생성하고 `download` 속성을 설정해 브라우저가 이미지 파일을 다운로드하게 한다.

## 클립보드 복사 기능
이미지를 클립보드에 복사할 수 있게 구현했다. 이를 통해 사용자는 직접 이미지를 다운로드하지 않아도 다른 곳에 바로 붙여넣을 수 있다.

```tsx
const handleCopyToClipboard = async () => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  try {
    // Blob 형태로 변환
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/png");
    });

    // 클립보드에 이미지 복사
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);

    alert("Image copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy image to clipboard:", err);
    alert("Failed to copy image to clipboard");
  }
};
```

- **`canvas.toBlob`**
    - 캔버스의 내용을 Blob 형태로 변환한다.
- **`Clipboard API`**
    - `navigator.clipboard.write`를 사용해 이미지를 클립보드에 복사한다.
- 실패 시 처리
    - 클립보드 접근 권한이 없거나 브라우저가 지원하지 않는 경우 오류를 처리한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e4d9c6192e594bafdd13406bff5c0257.png)
*다운로드 버튼과 복사 버튼*

---
이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/thumbs-up)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.