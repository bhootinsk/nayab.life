import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ContentService } from '../content/content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post as PostModel, PostType, SiteSettings } from '@nayab/shared';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private content: ContentService) {}

  @Get('stats')
  stats() {
    return this.content.dashboardStats();
  }

  @Get('site')
  getSite() {
    return { site: this.content.getSite(), assets: this.content.getAssets() };
  }

  @Put('site')
  saveSite(@Body() site: SiteSettings) {
    return this.content.saveSite(site);
  }

  @Get('posts/:type')
  listPosts(@Param('type') type: PostType) {
    return this.content.listPosts(type, false);
  }

  @Get('posts/:type/:slug')
  getPost(@Param('type') type: PostType, @Param('slug') slug: string) {
    return this.content.getPost(type, slug);
  }

  @Post('posts/:type')
  createPost(@Param('type') type: PostType, @Body() post: PostModel) {
    return this.content.savePost(type, post);
  }

  @Put('posts/:type/:slug')
  updatePost(@Param('type') type: PostType, @Param('slug') slug: string, @Body() post: PostModel) {
    post.slug = slug;
    return this.content.savePost(type, post);
  }

  @Post('posts/:type/:slug/publish')
  publishPost(@Param('type') type: PostType, @Param('slug') slug: string) {
    const post = this.content.getPost(type, slug);
    if (!post) return null;
    post.status = 'published';
    if (!post.publishedAt) post.publishedAt = new Date().toISOString();
    return this.content.savePost(type, post);
  }

  @Delete('posts/:type/:slug')
  deletePost(@Param('type') type: PostType, @Param('slug') slug: string) {
    this.content.deletePost(type, slug);
    return { ok: true };
  }

  @Get('pages')
  listPages() {
    return this.content.listPages();
  }

  @Put('pages/:slug')
  savePage(@Param('slug') slug: string, @Body() page: PostModel) {
    page.slug = slug;
    return this.content.savePage(page);
  }

  @Get('media')
  listMedia() {
    return this.content.listMedia();
  }

  @Post('media')
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const root = path.resolve(process.env.CONTENT_ROOT || path.join(process.cwd(), '../..'));
          cb(null, path.join(root, 'uploads'));
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname);
          const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '-');
          cb(null, `${base}-${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  uploadMedia(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((f) => this.content.saveMediaFile(f.filename));
  }

  @Delete('media/:filename')
  deleteMedia(@Param('filename') filename: string) {
    this.content.deleteMedia(filename);
    return { ok: true };
  }
}
