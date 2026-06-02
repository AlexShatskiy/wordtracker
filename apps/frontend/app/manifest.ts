import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WordTracker',
    short_name: 'WordTracker',
    description: 'Bilingual EN ↔ RU ↔ PL dictionary',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f0e8',
    theme_color: '#b87333',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
