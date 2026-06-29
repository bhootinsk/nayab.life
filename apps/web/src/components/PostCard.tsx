import Link from 'next/link';

export function PostCard({
  post,
  type,
}: {
  post: { title: string; slug: string; excerpt?: string; featuredImage?: string; publishedAt?: string };
  type: string;
}) {
  return (
    <article className="post-card">
      {post.featuredImage && (
        <Link href={`/${type}/${post.slug}`} className="post-card-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.featuredImage} alt="" loading="lazy" />
        </Link>
      )}
      <div className="post-card-body">
        <h3>
          <Link href={`/${type}/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString()}</time>
        )}
      </div>
    </article>
  );
}
