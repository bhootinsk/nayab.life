import { getPosts } from '@/lib/api';
import { PostCard } from '@/components/PostCard';

export async function PostList({ type, title }: { type: string; title: string }) {
  const posts = await getPosts(type);
  return (
    <section className="section">
      <div className="container">
        <header className="page-header">
          <h1>{title}</h1>
        </header>
        {posts.length === 0 ? (
          <p>No posts published yet.</p>
        ) : (
          <div className="card-grid three">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} type={type} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
