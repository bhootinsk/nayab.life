import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import slugify from 'slugify';
import {
  DashboardStats,
  MediaFile,
  Page,
  Post,
  PostType,
  POST_TYPES,
  SiteSettings,
} from '@nayab/shared';

marked.setOptions({ gfm: true, breaks: true });

@Injectable()
export class ContentService {
  private readonly root: string;
  private readonly content: string;
  private readonly data: string;
  private readonly uploads: string;

  constructor(private config: ConfigService) {
    this.root = path.resolve(this.config.get<string>('CONTENT_ROOT') || path.join(process.cwd(), '../..'));
    this.content = path.join(this.root, 'content');
    this.data = path.join(this.root, 'data');
    this.uploads = path.join(this.root, 'uploads');
  }

  getPostTypes(): PostType[] {
    return POST_TYPES;
  }

  getSite(): SiteSettings {
    return this.readJson(path.join(this.data, 'site.json'), {} as SiteSettings);
  }

  saveSite(site: SiteSettings): SiteSettings {
    this.writeJson(path.join(this.data, 'site.json'), site);
    return site;
  }

  getAssets(): Record<string, unknown> {
    return this.readJson(path.join(this.data, 'assets.json'), {});
  }

  listPosts(type: PostType, publishedOnly = true): Post[] {
    const dir = path.join(this.content, 'posts', type);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => this.readJson<Post | null>(path.join(dir, f), null))
      .filter((p): p is Post => Boolean(p))
      .filter((p) => !publishedOnly || p.status === 'published')
      .sort(
        (a: Post, b: Post) =>
          new Date(b.publishedAt || b.createdAt || 0).getTime() -
          new Date(a.publishedAt || a.createdAt || 0).getTime(),
      )
      .map((p) => this.enrichPost(p));
  }

  getPost(type: PostType, slug: string): Post | null {
    const post = this.readJson<Post | null>(path.join(this.content, 'posts', type, `${slug}.json`), null);
    return post ? this.enrichPost(post) : null;
  }

  savePost(type: PostType, post: Post): Post {
    const slug =
      post.slug ||
      slugify(post.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
    post.slug = slug;
    post.updatedAt = new Date().toISOString();
    if (!post.createdAt) post.createdAt = post.updatedAt;
    if (post.status === 'published' && !post.publishedAt) post.publishedAt = post.updatedAt;
    this.writeJson(path.join(this.content, 'posts', type, `${slug}.json`), post);
    return this.enrichPost(post);
  }

  deletePost(type: PostType, slug: string): void {
    const file = path.join(this.content, 'posts', type, `${slug}.json`);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  listPages(): Page[] {
    const dir = path.join(this.content, 'pages');
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => this.enrichPost(this.readJson<Post>(path.join(dir, f), {} as Post)))
      .filter(Boolean);
  }

  getPage(slug: string): Page | null {
    const page = this.readJson<Page | null>(path.join(this.content, 'pages', `${slug}.json`), null);
    return page ? this.enrichPost(page) : null;
  }

  savePage(page: Page): Page {
    const slug =
      page.slug ||
      slugify(page.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
    page.slug = slug;
    page.updatedAt = new Date().toISOString();
    if (!page.createdAt) page.createdAt = page.updatedAt;
    this.writeJson(path.join(this.content, 'pages', `${slug}.json`), page);
    return this.enrichPost(page);
  }

  listMedia(): MediaFile[] {
    if (!fs.existsSync(this.uploads)) return [];
    return fs
      .readdirSync(this.uploads)
      .filter((f) => f !== '.gitkeep')
      .map((filename) => {
        const stat = fs.statSync(path.join(this.uploads, filename));
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stat.size,
          mtime: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime());
  }

  saveMediaFile(filename: string): MediaFile {
    const stat = fs.statSync(path.join(this.uploads, filename));
    return {
      filename,
      url: `/uploads/${filename}`,
      size: stat.size,
      mtime: stat.mtime.toISOString(),
    };
  }

  deleteMedia(filename: string): void {
    const safe = path.basename(filename);
    const target = path.join(this.uploads, safe);
    if (fs.existsSync(target)) fs.unlinkSync(target);
  }

  get uploadsDir(): string {
    return this.uploads;
  }

  dashboardStats(): DashboardStats {
    const stats: DashboardStats = { blog: 0, articles: 0, news: 0, draft: 0, published: 0 };
    for (const type of POST_TYPES) {
      const dir = path.join(this.content, 'posts', type);
      if (!fs.existsSync(dir)) continue;
      fs.readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .forEach((f) => {
          const p = this.readJson<Post | null>(path.join(dir, f), null);
          if (!p) return;
          stats[type]++;
          if (p.status === 'published') stats.published++;
          else stats.draft++;
        });
    }
    return stats;
  }

  private enrichPost(post: Post): Post {
    const html = post.bodyFormat === 'html' ? post.body : (marked.parse(post.body || '') as string);
    const excerpt =
      post.excerpt ||
      (post.body || '')
        .replace(/[#*_`>\[\]]/g, '')
        .slice(0, 200)
        .trim() + '…';
    return { ...post, html, excerpt };
  }

  private readJson<T>(filePath: string, fallback: T): T {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
    } catch {
      return fallback;
    }
  }

  private writeJson(filePath: string, data: unknown): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
