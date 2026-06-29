import { AssetImg } from './AssetImg';

export function VideoSection({
  assets,
  showCta,
}: {
  assets: Record<string, string>;
  showCta?: boolean;
}) {
  const videos = [
    { src: assets.videoIntro1, poster: assets.videoPoster1, title: assets.videoIntro1Title },
    { src: assets.videoIntro2, poster: assets.videoPoster2, title: assets.videoIntro2Title },
  ].filter((v) => v.src);

  if (!videos.length) return null;

  return (
    <section className="section video-section" id="videos">
      <div className="container">
        <header className="section-header">
          <h2>Video insights</h2>
          <p>Short reflections on mental health, therapy, and everyday resilience.</p>
        </header>
        <div className="video-grid">
          {videos.map((v) => (
            <figure key={v.src} className="video-card">
              <video controls preload="metadata" poster={v.poster} playsInline>
                <source src={v.src} type="video/mp4" />
              </video>
              {v.title && <figcaption>{v.title}</figcaption>}
            </figure>
          ))}
        </div>
        {showCta && (
          <p className="section-cta">
            <a href="#contact" className="btn btn-text">
              Questions? Get in touch →
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
