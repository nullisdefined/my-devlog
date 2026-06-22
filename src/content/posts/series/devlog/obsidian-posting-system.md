---
title: "옵시디언을 활용한 포스팅 시스템 구축하기"
slug: "obsidian-posting-system"
date: 2024-11-06
tags: ["NextJS", "Obsidian", "TypeScript", "Devlog"]
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4b0d4c2a638da87b152486f37bc04cf3.png"
draft: false
views: 0
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/4b0d4c2a638da87b152486f37bc04cf3.png)

처음에는 마크다운 파일을 복사해서 Next.js 프로젝트 폴더에 붙여넣는 방식으로 블로그를 관리했다. 하지만 글이 많아질수록 폴더 정리와 수정 사항 관리가 번거로워졌다. 삭제된 글이 남아있거나 수정할 때 파일을 일일이 찾아 이동하는 과정도 비효율적이었다.

이런 과정을 자동화하고 싶었고, 옵시디언(Obsidian)과 Next.js 프로젝트를 연결하기로 했다.

## 왜 옵시디언을 선택했나
처음에는 노션을 사용했지만, 내용이 많아질수록 속도가 느려졌다. 반면 옵시디언은 빠르고, 마크다운 기반이라 관리하기 편리했다.

그러나 옵시디언과 Next.js 프로젝트는 서로 다른 경로에 있어 파일을 일일이 복사하고 정리해야 했다. 이런 수작업을 **자동화**하면서 실수를 줄이고 효율성을 높이기로 했다.

## 자동화 주요 기능

### 1. `` 태그 필터링 및 파일 감지
모든 마크다운 파일을 처리하지 않고, `` 태그가 포함된 파일만 감지하도록 했다.

```ts
const content = fs.readFileSync(filePath, "utf-8");

if (!content.includes("")) return;

let updatedContent = content.replace(//g, "").trim();
```
- ``태그를 사용해 게시할 파일만 추려냄
- 태그는 최종 콘텐츠에 포함되지 않도록 처리

### 2. 카테고리 자동 분류
글의 `category` 필드를 기반으로 폴더 구조를 자동으로 생성했다.  

예를 들어,
```
Series/
  devlog/
    Devlog 시작.md
```

```ts
let categoryPath: string;

if (category.includes("/")) {
  const [parentCategory, childCategory] = category.split("/");
  categoryPath = path.join(
    "posts",
    parentCategory.toLowerCase(),
    childCategory.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-")
  );
} else {
  categoryPath = path.join(
    "posts",
    category.toLowerCase().replace(/\s+/g, "-")
  );
}
```
- 하위 카테고리가 있을 경우 폴더 구조에 반영됨
- 카테고리명에 공백이나 특수문자가 있으면 URL이 될 수 있도록 형태 변환

### 3. 슬러그 생성 및 파일 이름 통일
글 제목을 슬러그 형태로 변환해 일관된 파일 네이밍 규칙을 유지했다.

```ts
private createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^가-힣a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
```
- 변환 예: `[NestJS] HTTP 요청 처리` → `nestjs-http-요청-처리.md`

### 4. 이미지 처리 및 썸네일 설정
옵시디언의 `![image](image)` 형식과 표준 마크다운 이미지 링크를 모두 처리하고, 첫 번째 이미지를 썸네일로 설정한다.
```ts
const imagePattern = /!\[\[([^\]]+)\]\]|!\[([^\]]*)\]\(([^)]+)\)/g;

for (const match of matches) {
  const [fullMatch, wikiLink, altText, standardLink] = match;
  const imagePath = wikiLink || standardLink;
  if (!imagePath) continue;

  if (imagePath.startsWith("https://")) {
    if (!firstImageUrl) firstImageUrl = imagePath;
  }
}
```

> 💡옵시디언의 S3 Image Uploader 플러그인을 사용해 이미지를 자동으로 S3에 업로드할 수 있다.

- 옵시디언에서 이미지를 삽입하면 S3 Image Uploader 플러그인을 통해 자동으로 S3에 업로드되고, 마크다운 문서에는 외부 URL 링크(`https://`)만 남음
- 이미지 링크가 외부 URL(`https://`)일 경우, 첫 번째 이미지를 썸네일로 지정

### 5. 불필요한 파일 정리
옵시디언에 더 이상 존재하지 않는 파일은 블로그 콘텐츠 폴더에서 삭제한다.

```ts
this.existingNextPosts.forEach((filePath) => {
  if (!this.processedFiles.has(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Removed orphaned post: ${filePath}`);
  }
});
```
- 필요 없는 파일이 남아있지 않게 정리

## 최종 워크플로우
1. 옵시디언에서 글 작성
	- Templater 플러그인으로 메타데이터를 쉽게 추가한다.

```md
title: <% tp.file.title %>
date: <% tp.date.now("YYYY-MM-DD") %>
**tags**:
**category**:
**thumbnail**:
draft: true
```

>💡옵시디언의 Templater 플러그인을 사용해 마크다운 템플릿을 지정할 수 있다.

2. 자동 동기화 스크립트 실행
	**- `npm run sync` 실행하면**:
		- `` 태그가 있는 파일만 필터링
		- 카테고리 경로 생성
		- 제목을 슬러그로 변환해 파일 저장
		- 이미지 처리 및 썸네일 설정
		- 불필요한 파일 삭제
1. 정리된 글을 블로그에서 확인
	- 모든 작업이 자동으로 처리된 후, 정리된 글은 블로그에 바로 반영됨

## 자동 동기화 스크립트 전체 코드
```ts
require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const matter = require("gray-matter");

interface BlogSyncConfig {
  obsidianDir: string;
  nextContentDir: string;
}

interface FrontMatter {
  title?: string;
  category?: string;
  tags?: string[] | string;
  [key: string]: any;
}

class BlogSync {
  private obsidianDir: string;
  private nextContentDir: string;
  private processedFiles: Set<string>;
  private existingNextPosts: Map<string, string>; // slug -> full path mapping

  constructor(config: BlogSyncConfig) {
    this.obsidianDir = config.obsidianDir;
    this.nextContentDir = config.nextContentDir;
    this.processedFiles = new Set();
    this.existingNextPosts = new Map();

    this.initSync();
  }

  private async initSync(): Promise<void> {
    await this.scanNextContentDir();

    const watcher = chokidar.watch(this.obsidianDir, {
      persistent: true,
      ignoreInitial: false,
      ignored: [
        /(^|[\/\\])\../,
        "**/Templates/**",
        "**/.trash/**",
        "**/template/**",
        "**/_templates/**",
      ],
    });

    watcher
      .on("add", (filePath: string) => this.handleFile(filePath))
      .on("change", (filePath: string) => this.handleFile(filePath))
      .on("ready", () => {
        this.cleanupOrphanedPosts();
        process.exit(0);
      });
  }

  private async scanNextContentDir(): Promise<void> {
    const scanDir = async (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const { data } = matter(content);
          const slug = this.createSlug(data.title);
          this.existingNextPosts.set(slug, fullPath);
        }
      }
    };

    await scanDir(this.nextContentDir);
  }

  private cleanupOrphanedPosts(): void {
    console.log("Cleaning up orphaned posts...");
    this.existingNextPosts.forEach((filePath, slug) => {
      if (fs.existsSync(filePath)) {
        console.log(`Removing orphaned post: ${filePath}`);
        fs.unlinkSync(filePath);

        let dir = path.dirname(filePath);
        while (dir !== this.nextContentDir) {
          if (fs.readdirSync(dir).length === 0) {
            fs.rmdirSync(dir);
            dir = path.dirname(dir);
          } else {
            break;
          }
        }
      }
    });
  }

  private formatDate(date: string | Date | undefined): string {
    if (!date) {
      return new Date().toISOString().split("T")[0];
    }

    try {
      if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }

      const d = new Date(date);

      if (isNaN(d.getTime())) {
        throw new Error("Invalid date");
      }

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      return new Date().toISOString().split("T")[0];
    }
  }

  private async handleFile(filePath: string): Promise<void> {
    try {
      if (!filePath.endsWith(".md")) return;
      if (filePath.toLowerCase().includes("template")) return;

      const content = fs.readFileSync(filePath, "utf-8");

      if (!content.includes("")) return;

      let updatedContent = content.replace(//g, "").trim();

      const { data, content: mdContent } = matter(updatedContent);

      const frontMatter = data as FrontMatter;
      if (!frontMatter.title || !frontMatter.category) return;

      let category = frontMatter.category || "Uncategorized";
      let categoryPath: string;

      if (category.includes("/")) {
        const [parentCategory, childCategory] = category.split("/");
        categoryPath = path.join(
          "posts",
          parentCategory.toLowerCase(),
          childCategory.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-")
        );
      } else {
        categoryPath = path.join(
          "posts",
          category.toLowerCase().replace(/\s+/g, "-")
        );
      }

      const stats = fs.statSync(filePath);
      const fileDate = this.formatDate(frontMatter.date || stats.birthtime);

      const tags = this.processTags(frontMatter.tags);
      const [processedContent, firstImageUrl] = this.processImages(mdContent);
      const thumbnail = frontMatter.thumbnail || firstImageUrl || "";

      const yamlContent = [
        "---",
        `title: "${frontMatter.title || path.basename(filePath, ".md")}"`,
        `date: ${fileDate}`,
        `tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]`,
        `category: "${category}"`,
        `thumbnail: "${thumbnail}"`,
        `draft: ${frontMatter.draft || false}`,
        "---",
        "",
        processedContent,
      ].join("\n");

      const postsDir = path.join(this.nextContentDir, categoryPath);

      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
      }

      const slug = this.createSlug(
        frontMatter.title || path.basename(filePath, ".md")
      );

      const destPath = path.join(postsDir, `${slug}.md`);

      // Remove the old file if it exists at a different location
      const oldPath = this.existingNextPosts.get(slug);
      if (oldPath && oldPath !== destPath) {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log(`Removed old post at: ${oldPath}`);
        }
        this.existingNextPosts.delete(slug);
      }

      // Write the new file
      fs.writeFileSync(destPath, yamlContent);
      console.log(`Processed: ${destPath}`);

      // Remove from existingNextPosts as this post is still valid
      this.existingNextPosts.delete(slug);
      this.processedFiles.add(filePath);
    } catch (error: any) {
      console.error("Error processing file:", filePath);
      console.error("Error:", error.message);
    }
  }

  private processImages(content: string): [string, string] {
    const imagePattern = /!\[\[([^\]]+)\]\]|!\[([^\]]*)\]\(([^)]+)\)/g;
    let updatedContent = content;
    let firstImageUrl: string = "";

    const matches = Array.from(content.matchAll(imagePattern));

    for (const match of matches) {
      const [fullMatch, wikiLink, altText, standardLink] = match;
      const imagePath = wikiLink || standardLink;
      if (!imagePath) continue;

      if (imagePath.startsWith("https://")) {
        if (!firstImageUrl) firstImageUrl = imagePath;
        if (wikiLink) {
          updatedContent = updatedContent.replace(
            fullMatch,
            `![${wikiLink}](${imagePath})`
          );
        }
        continue;
      }
    }

    return [updatedContent, firstImageUrl];
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^가-힣a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  private processTags(tags: string | string[] | undefined): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;

    return tags
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
}

try {
  if (!process.env.OBSIDIAN_DIR) throw new Error("OBSIDIAN_DIR is not set");
  if (!process.env.NEXT_CONTENT_DIR)
    throw new Error("NEXT_CONTENT_DIR is not set");

  const config: BlogSyncConfig = {
    obsidianDir: process.env.OBSIDIAN_DIR,
    nextContentDir: process.env.NEXT_CONTENT_DIR,
  };

  new BlogSync(config);
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
```

## 마치며
불편함에서 시작된 고민이 자동화로 이어졌다. 옵시디언에서 글을 작성하고 명령어 하나만 실행하면, 파일 정리, 카테고리 분류, 이미지 처리까지 모두 자동으로 해결된다.

글 작성에만 집중할 수 있는 환경이 갖춰졌고, 블로그 관리의 번거로움이 사라졌다. 작은 고민에서 시작한 이 작업이 효율성을 크게 높여줬다.


> [!NOTE] 이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/mydevlog)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.