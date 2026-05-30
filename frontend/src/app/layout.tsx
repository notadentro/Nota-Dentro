import type { Metadata } from 'next';
import { Nunito, Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
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
  title: 'Nota Dentro',
  description: 'Aprenda música de forma divertida e gamificada.',
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
      </body>
    </html>
  );
}
