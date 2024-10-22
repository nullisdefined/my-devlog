export interface Post {
  title: string;
  description: string;
  date: string;
  category: string;
  slug: string;
  tags: string[];
  thumbnail?: string;
  content?: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}
