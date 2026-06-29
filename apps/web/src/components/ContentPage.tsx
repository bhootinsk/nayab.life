import { getPage } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function renderContentPage(slug: string) {
  try {
    const page = await getPage(slug);
    return (
      <article className="section page-content">
        <div className="container">
          <header className="page-header">
            <h1>{page.title}</h1>
            {page.excerpt && <p className="lead">{page.excerpt}</p>}
          </header>
          <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
