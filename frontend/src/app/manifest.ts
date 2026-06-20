import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nota Dentro - Teoria Musical',
    short_name: 'Nota Dentro',
    description: 'Aprenda teoria musical do zero ao avançado. Plataforma gamificada focada em preparatório militar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A1A1A',
    theme_color: '#1A1A1A',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      }
    ],
  };
}
