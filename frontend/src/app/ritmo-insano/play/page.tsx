'use client';

import { PerformanceSimulator } from '@/modules/simulator/components/PerformanceSimulator';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PlayGame() {
  const searchParams = useSearchParams();
  const level = parseInt(searchParams.get('level') || '1', 10);
  const bpm = parseInt(searchParams.get('bpm') || '60', 10);

  return <PerformanceSimulator initialLevel={level} initialDifficulty={bpm} />;
}

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-brand-black">
      <Suspense fallback={<div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-gold">Carregando Jogo...</div>}>
        <PlayGame />
      </Suspense>
    </main>
  );
}
