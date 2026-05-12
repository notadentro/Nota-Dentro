import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // Para Firebase Storage
        port: '',
        pathname: '/**',
      },
      // Eu removi a entrada duplicada de 'storage.googleapis.com'
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Para fotos de perfil do Google Auth
        pathname: '/**',
      },
    ],
  },

  // CORREÇÃO: 'allowedDevOrigins' vai aqui, no nível principal
  allowedDevOrigins: [
    'https://5174-firebase-studio-1761601561361.cluster-l2bgochoazbomqgfmlhuvdvgiy.cloudworkstations.dev', 'https://studio.firebase.google.com/studio-2351776517'
  ],

}; // <-- O objeto nextConfig termina aqui

// CORREÇÃO: O 'export' vai aqui, no final do arquivo
export default nextConfig;