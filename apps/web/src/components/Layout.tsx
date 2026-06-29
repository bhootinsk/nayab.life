import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/approach', label: 'Approach' },
  { href: '/blog', label: 'Blog' },
  { href: '/articles', label: 'Articles' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Connect', cta: true },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <strong>Nayab Tahir</strong>
          <small>Psychotherapy &amp; Insight</small>
        </Link>
        <nav className="main-nav">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={l.cta ? 'nav-cta' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer({ site }: { site: Record<string, string> }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>{site.siteName}</strong>
          <p>Registered Psychotherapist · Ontario</p>
          <p>
            <a href={site.companyUrl} target="_blank" rel="noopener noreferrer">
              {site.company}
            </a>
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {site.owner}. · <a href="https://nayab.life">nayab.life</a>
        </p>
      </div>
    </footer>
  );
}
