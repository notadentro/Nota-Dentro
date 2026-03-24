import type { Metadata } from 'next';
import { Poppins, PT_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import './globals.css';

const fontBody = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const fontHeading = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${fontBody.variable} ${fontHeading.variable} font-body antialiased`}>
        <UserProvider>
          {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
