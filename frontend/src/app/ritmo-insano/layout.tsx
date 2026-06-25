import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ritmo Insano | Nota Dentro',
  description: 'O Jogo Definitivo de Leitura Rítmica',
};

export default function RitmoInsanoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
