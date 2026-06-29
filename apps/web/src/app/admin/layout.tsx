import Link from 'next/link';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/">View site</Link>
      </nav>
      {children}
    </div>
  );
}
