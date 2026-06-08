'use client';

import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SpallaBanner() {
  const { user, isUserLoading, upgradeToSpalla } = useUser();

  if (isUserLoading || !user || user.isSpalla) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg mb-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-full">
          <Sparkles className="w-6 h-6 text-yellow-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Seja um aluno Spalla!</h3>
          <p className="text-indigo-100 mt-1 text-sm md:text-base">
            Vidas infinitas, sem anúncios e acesso exclusivo à Clínica de Erros!
          </p>
        </div>
      </div>
      <Button 
        onClick={upgradeToSpalla}
        className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-bold whitespace-nowrap"
      >
        Assinar Plano Spalla
      </Button>
    </div>
  );
}
