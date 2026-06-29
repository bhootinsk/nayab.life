import { PostDetail } from '@/components/PostDetail';

export default function ArticlePostPage({ params }: { params: { slug: string } }) {
  return <PostDetail type="articles" slug={params.slug} label="Articles" />;
}
