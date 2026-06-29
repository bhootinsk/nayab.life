import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { PostType } from '@nayab/shared';

@Controller()
export class PublicController {
  constructor(private content: ContentService) {}

  @Get('site')
  getSite() {
    return { site: this.content.getSite(), assets: this.content.getAssets() };
  }

  @Get('pages')
  listPages() {
    return this.content.listPages();
  }

  @Get('pages/:slug')
  getPage(@Param('slug') slug: string) {
    const page = this.content.getPage(slug);
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  @Get('posts/:type')
  listPosts(@Param('type') type: PostType) {
    return this.content.listPosts(type, true);
  }

  @Get('posts/:type/:slug')
  getPost(@Param('type') type: PostType, @Param('slug') slug: string) {
    const post = this.content.getPost(type, slug);
    if (!post || post.status !== 'published') throw new NotFoundException('Post not found');
    return post;
  }
}
