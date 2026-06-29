import Link from 'next/link';
import { getPost } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function PostDetail({ type, slug, label }: { type: string; slug: string; label: string }) {
  let post;
  try {
    post = await getPost(type, slug);
  } catch {
    notFound();
  }

  return (
    <article className="section page-content">
      <div className="container">
        <p className="eyebrow">
          <Link href={`/${type}`}>{label}</Link>
        </p>
        <header className="page-header">
          <h1>{post.title}</h1>
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString()}</time>
          )}
        </header>
        {post.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.featuredImage} alt="" className="post-featured" />
        )}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </article>
  );
}
