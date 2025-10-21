import { marked } from "marked";
import { JSDOM } from "jsdom";
import RSS from "rss";
import { Post } from "@/types";

// 마크다운을 완전한 HTML로 변환
export function markdownToHtml(markdown: string): string {
  // marked 라이브러리로 마크다운 파싱
  const html = marked(markdown, {
    breaks: true,
    gfm: true, // GitHub Flavored Markdown
  }) as string;

  // 이미지 경로를 절대 경로로 변환
  return html.replace(
    /src="(?!https?:\/\/)([^"]*?)"/g,
    'src="https://nullisdefined.my$1"'
  );
}

// HTML에서 텍스트만 추출 (RSS description용)
export function extractTextFromHtml(html: string): string {
  const dom = new JSDOM(html);
  const textContent = dom.window.document.body.textContent || "";

  // 200자로 제한하고 생략 표시 추가
  return textContent.length > 200
    ? textContent.substring(0, 197) + "..."
    : textContent;
}

// 텍스트에서 이미지 추출
export function extractImages(content: string): string[] {
  const imageRegex = /!\[([^\]]*)\]\(([^\)]*)\)/g;
  const images: string[] = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const imageSrc = match[2];
    if (imageSrc.startsWith("http")) {
      images.push(imageSrc);
    } else {
      images.push(`https://nullisdefined.my${imageSrc}`);
    }
  }

  return images;
}

// 기본 RSS 설정
export function createBaseRSSConfig(
  title: string,
  description: string,
  feedUrl: string
): RSS.FeedOptions {
  return {
    title,
    description,
    site_url: "https://nullisdefined.my",
    feed_url: feedUrl,
    language: "ko-KR",
    generator: "Next.js RSS Utils v1.0",
    webMaster: "nullisdefined@gmail.com (nullisdefined)",
    managingEditor: "nullisdefined@gmail.com (nullisdefined)",
    image_url: "https://nullisdefined.my/favicon.ico",
    docs: "https://nullisdefined.my/devlog",
    copyright: `Copyright ${new Date().getFullYear()} nullisdefined`,
    categories: [
      "Technology",
      "Programming",
      "Web Development",
      "JavaScript",
      "TypeScript",
      "Node.js",
    ],
    ttl: 60, // 60분
    custom_namespaces: {
      content: "http://purl.org/rss/1.0/modules/content/",
      dc: "http://purl.org/dc/elements/1.1/",
      atom: "http://www.w3.org/2005/Atom",
      media: "http://search.yahoo.com/mrss/",
      sy: "http://purl.org/rss/1.0/modules/syndication/",
    },
    custom_elements: [
      {
        "atom:link": {
          _attr: { href: feedUrl, rel: "self", type: "application/rss+xml" },
        },
      },
      { "sy:updatePeriod": "hourly" },
      { "sy:updateFrequency": "1" },
      { lastBuildDate: new Date().toUTCString() },
      { pubDate: new Date().toUTCString() },
    ],
  };
}

// 포스트를 RSS 아이템으로 변환
export function postToRSSItem(post: Post): RSS.ItemOptions {
  const postUrl = `https://nullisdefined.my/devlog/posts/${post.urlCategory}/${post.slug}`;
  const htmlContent = markdownToHtml(post.content);
  const description = post.excerpt || extractTextFromHtml(htmlContent);
  const images = extractImages(post.content);

  return {
    title: post.title,
    description,
    url: postUrl,
    guid: postUrl,
    date: new Date(post.date),
    author: "nullisdefined@gmail.com (nullisdefined)",
    categories: [post.category || "Uncategorized", ...(post.tags || [])],
    // 전체 HTML 콘텐츠 포함 (일부 RSS 리더에서 사용)
    custom_elements: [
      { "content:encoded": htmlContent },
      // 썸네일 이미지 추가
      ...(post.thumbnail
        ? [{ "media:thumbnail": { _attr: { url: post.thumbnail } } }]
        : []),
      // 첫 번째 이미지를 enclosure로 추가 (팟캐스트 앱에서 사용)
      ...(images.length > 0
        ? [
            {
              enclosure: {
                _attr: {
                  url: images[0],
                  type: "image/jpeg",
                },
              },
            },
          ]
        : []),
      // 구조화된 데이터 추가
      { "dc:creator": "nullisdefined" },
      { "dc:subject": post.category },
      ...(post.tags || []).map((tag) => ({ "dc:subject": tag })),
      { "content:length": htmlContent.length.toString() },
      {
        "reading:time":
          Math.ceil(htmlContent.split(" ").length / 200).toString() + " min",
      },
    ],
  };
}

// 카테고리별 RSS 피드 생성
export function generateCategoryFeed(category: string, posts: Post[]): RSS {
  const categoryPosts = posts.filter(
    (post) => post.category?.toLowerCase() === category.toLowerCase()
  );

  const rss = new RSS(
    createBaseRSSConfig(
      `개발새발 - ${category} 카테고리`,
      `${category} 관련 글들을 모아놓은 RSS 피드입니다.`,
      `https://nullisdefined.my/feed/${category.toLowerCase()}.xml`
    )
  );

  // 최신 20개 포스트만 추가
  categoryPosts.slice(0, 20).forEach((post) => {
    rss.item(postToRSSItem(post));
  });

  return rss;
}

// 태그별 RSS 피드 생성
export function generateTagFeed(tag: string, posts: Post[]): RSS {
  const tagPosts = posts.filter((post) => post.tags?.includes(tag));

  const rss = new RSS(
    createBaseRSSConfig(
      `개발새발 - ${tag} 태그`,
      `${tag} 태그가 포함된 글들을 모아놓은 RSS 피드입니다.`,
      `https://nullisdefined.my/feed/tags/${encodeURIComponent(tag)}.xml`
    )
  );

  // 최신 20개 포스트만 추가
  tagPosts.slice(0, 20).forEach((post) => {
    rss.item(postToRSSItem(post));
  });

  return rss;
}

// 시리즈별 RSS 피드 생성
export function generateSeriesFeed(series: string, posts: Post[]): RSS {
  const seriesPosts = posts.filter(
    (post) => post.category?.includes(series) || post.tags?.includes(series)
  );

  const rss = new RSS(
    createBaseRSSConfig(
      `개발새발 - ${series} 시리즈`,
      `${series} 시리즈의 글들을 모아놓은 RSS 피드입니다.`,
      `https://nullisdefined.my/feed/series/${encodeURIComponent(series)}.xml`
    )
  );

  seriesPosts.slice(0, 20).forEach((post) => {
    rss.item(postToRSSItem(post));
  });

  return rss;
}

// 전체 RSS 피드 생성 (기존 방식 개선)
export function generateMainFeed(posts: Post[]): RSS {
  const rss = new RSS(
    createBaseRSSConfig(
      "개발새발",
      "소프트웨어 개발에 대한 인사이트와 경험을 공유하는 개인 블로그",
      "https://nullisdefined.my/feed.xml"
    )
  );

  // 최신 20개 포스트만 추가
  posts.slice(0, 20).forEach((post) => {
    rss.item(postToRSSItem(post));
  });

  return rss;
}

// RSS XML 문자열 생성
export function generateRSSXML(rss: RSS): string {
  return rss.xml({ indent: true });
}

// 모든 카테고리의 RSS 피드 생성
export function generateAllCategoryFeeds(posts: Post[]): Map<string, RSS> {
  const categories = new Set<string>();

  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });

  const feeds = new Map<string, RSS>();

  categories.forEach((category) => {
    feeds.set(category, generateCategoryFeed(category, posts));
  });

  return feeds;
}

// 모든 태그의 RSS 피드 생성
export function generateAllTagFeeds(posts: Post[]): Map<string, RSS> {
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tags.add(tag);
    });
  });

  const feeds = new Map<string, RSS>();

  tags.forEach((tag) => {
    feeds.set(tag, generateTagFeed(tag, posts));
  });

  return feeds;
}
