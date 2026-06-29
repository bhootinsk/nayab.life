const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}/api${path}`;
  const res = await fetch(url, { ...init, next: init?.cache ? undefined : { revalidate: 60 } });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getSiteData() {
  return fetchApi<{ site: Record<string, string>; assets: Record<string, string> }>('/site');
}

export async function getPage(slug: string) {
  return fetchApi<{ title: string; slug: string; html: string; excerpt?: string }>(`/pages/${slug}`);
}

export async function getPosts(type: string) {
  return fetchApi<Array<{ title: string; slug: string; excerpt: string; featuredImage?: string; publishedAt?: string }>>(
    `/posts/${type}`,
  );
}

export async function getPost(type: string, slug: string) {
  return fetchApi<{
    title: string;
    slug: string;
    html: string;
    excerpt?: string;
    author?: string;
    publishedAt?: string;
    tags?: string[];
    featuredImage?: string;
  }>(`/posts/${type}/${slug}`);
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json() as Promise<{ accessToken: string; username: string }>;
}

export async function adminFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api/admin${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Admin API failed: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
