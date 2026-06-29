import { PostDetail } from '@/components/PostDetail';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <PostDetail type="blog" slug={params.slug} label="Blog" />;
}
