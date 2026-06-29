import Link from 'next/link';
import { getSiteData } from '@/lib/api';
import { AssetImg } from '@/components/AssetImg';

export default async function ContactPage() {
  const { site, assets } = await getSiteData();
  const a = assets as Record<string, string>;

  return (
    <article className="section page-contact">
      <div className="container contact-grid">
        <div>
          <p className="eyebrow">Connect</p>
          <h1>Get in touch</h1>
          <p className="lead">Book a consultation or reach out with questions about therapy and availability.</p>
          <ul className="contact-list">
            <li>
              <strong>Email</strong>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <strong>Phone</strong>
              <a href={`tel:${site.phone.replace(/\D/g, '')}`}>{site.phone}</a>
            </li>
            <li>
              <strong>Book online</strong>
              <a href={site.janeApp} target="_blank" rel="noopener noreferrer">
                Jane App scheduling
              </a>
            </li>
            <li>
              <strong>Psychology Today</strong>
              <a href={site.psychologyToday} target="_blank" rel="noopener noreferrer">
                View profile
              </a>
            </li>
          </ul>
          <div className="contact-actions">
            <a href={site.janeApp} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Book consultation
            </a>
            <a href={site.linkedin} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="contact-visual">
          <AssetImg
            src={a.nayabIntroBanner}
            fallback={a.heroPortraitFallback}
            alt={site.owner}
            className="contact-photo"
          />
        </div>
      </div>
    </article>
  );
}
