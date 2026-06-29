'use client';

import { useState } from 'react';

export function AssetImg({
  src,
  fallback,
  alt,
  className = '',
  loading,
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}) {
  const [err, setErr] = useState(false);
  const finalSrc = err && fallback ? fallback : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => fallback && setErr(true)}
    />
  );
}
