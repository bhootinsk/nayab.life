import { PostDetail } from '@/components/PostDetail';

export default function NewsPostPage({ params }: { params: { slug: string } }) {
  return <PostDetail type="news" slug={params.slug} label="News" />;
}
