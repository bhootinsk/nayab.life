'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/api';

type Stats = { blog: number; articles: number; news: number; draft: number; published: number };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('nayab_admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    adminFetch<Stats>('/stats', token)
      .then(setStats)
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  if (!stats) return <p className="container">Loading…</p>;

  return (
    <section className="section">
      <div className="container">
        <h1>Content dashboard</h1>
        <p>Manage site content via the NestJS API. JSON files in <code>content/</code> and <code>data/</code> remain the source of truth.</p>
        <div className="admin-stats">
          <div className="stat-card"><strong>{stats.blog}</strong><span>Blog posts</span></div>
          <div className="stat-card"><strong>{stats.articles}</strong><span>Articles</span></div>
          <div className="stat-card"><strong>{stats.news}</strong><span>News</span></div>
          <div className="stat-card"><strong>{stats.published}</strong><span>Published</span></div>
          <div className="stat-card"><strong>{stats.draft}</strong><span>Drafts</span></div>
        </div>
        <h2>Quick links</h2>
        <ul>
          <li><Link href="/">Public homepage</Link></li>
          <li><Link href="/blog">Blog listing</Link></li>
          <li>Edit pages: <code>content/pages/*.json</code></li>
          <li>Edit settings: <code>data/site.json</code>, <code>data/assets.json</code></li>
          <li>API docs: <code>GET /api/site</code>, <code>POST /api/auth/login</code>, <code>GET /api/admin/*</code></li>
        </ul>
      </div>
    </section>
  );
}
