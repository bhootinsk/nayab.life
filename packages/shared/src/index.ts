export type PostType = 'blog' | 'articles' | 'news';

export const POST_TYPES: PostType[] = ['blog', 'articles', 'news'];

export interface SiteSettings {
  siteName: string;
  tagline: string;
  domain: string;
  company: string;
  companyUrl: string;
  owner: string;
  email: string;
  phone: string;
  janeApp: string;
  psychologyToday: string;
  linkedin: string;
  youtube: string;
  social?: Record<string, string>;
}

export interface Post {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  bodyFormat?: 'markdown' | 'html';
  status: 'draft' | 'published';
  author?: string;
  tags?: string[];
  featuredImage?: string;
  metaDescription?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  html?: string;
}

export interface Page extends Post {}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  username: string;
}

export interface DashboardStats {
  blog: number;
  articles: number;
  news: number;
  draft: number;
  published: number;
}

export interface MediaFile {
  filename: string;
  url: string;
  size: number;
  mtime: string;
}
