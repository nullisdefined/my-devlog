export interface Post {
  title: string;
  slug: string;
  date: string;
  category?: string;
  tags?: string[];
  thumbnail?: string;
  excerpt?: string;
  content: string;
}

export interface CategoryItem {
  name: string;
  path: string;
  subcategories?: CategoryItem[];
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}
