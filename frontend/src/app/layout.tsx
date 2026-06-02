import type { Metadata } from 'next';
import { Nunito, Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const fontHeading = Nunito({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-nunito',
});

const fontBody = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Nota Dentro | Teoria Musical Gamificada',
  description: 'Aprenda teoria musical do zero ao avançado. Plataforma interativa e gamificada focada em preparatório militar e THE de música. Metodologia baseada em Esther Scliar, Bohumil Med e Maria Luiza de Mattos Priolli.',
  keywords: [
    'teoria musical', 'aprender música online', 'percepção musical', 
    'Esther Scliar', 'Bohumil Med', 'Maria Luiza de Mattos Priolli',
    'preparatório militar música', 'preparatório THE música',
    'Teste de Habilidade Específica', 'exercícios de teoria musical', 
    'solfejo', 'harmonia', 'gamificação em música', 'ESA música', 'sgt músico', 
    'sargento músico', 'the música', 'the música 2026', 'ESA música 2026',
    'aulas de música online', 'EAGS música', 'aeronáutica música', 
    'Banda dos Fuzileiros Navais', 'musico militar', 'concurso', 
    'música militar', 'EB', 'EXÉRCITO BRASILEIRO', 
    'Aeronáutica', 'Marinha do Brasil', 'Forças Armadas', 
    'música', 'harmonia', 'história da música',
  ].join(', '),
  authors: [{ name: 'Nota Dentro' }],
  openGraph: {
    title: 'Nota Dentro | Teoria Musical Gamificada',
    description: 'Transforme o estudo maçante da teoria musical em um jogo viciante. Focado em preparatório militar e THE.',
    url: 'https://notadentro.com/',
    siteName: 'Nota Dentro',
    images: [
      {
        url: 'https://notadentro.com/banner-compartilhamento.jpg',
        width: 1200,
        height: 630,
        alt: 'Nota Dentro Banner',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nota Dentro | O Duolingo da Teoria Musical',
    description: 'Transforme o estudo maçante da teoria musical em um jogo viciante. Focado em preparatório militar e THE.',
    images: ['https://notadentro.com/banner-compartilhamento.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${fontBody.variable} ${fontHeading.variable} font-body antialiased bg-brand-black text-brand-white`}>
        <UserProvider>
          {children}
        </UserProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
