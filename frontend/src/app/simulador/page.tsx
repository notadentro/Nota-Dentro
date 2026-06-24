import { PerformanceSimulator } from '@/modules/simulator/components/PerformanceSimulator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simulador de Alta Performance | Nota Dentro',
  description: 'Simulador tático de leitura rítmica para Teste de Habilidade Específica',
};

export default function SimuladorPage() {
  return (
    <main className="min-h-screen bg-brand-black">
      <PerformanceSimulator />
    </main>
  );
}
