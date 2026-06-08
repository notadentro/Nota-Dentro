'use client';

import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Heart, Coins, Infinity } from 'lucide-react';

export function EconomyHeader() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading || !user) return null;

  return (
    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
      <div className="flex items-center gap-1.5 text-rose-500 font-bold" title="Vidas">
        <Heart className="w-5 h-5 fill-current" />
        <span className="flex items-center">
          {user.isSpalla ? <Infinity className="w-5 h-5" /> : (user.economy?.lives || 0)}
        </span>
      </div>
      <div className="w-px h-6 bg-slate-200"></div>
      <div className="flex items-center gap-1.5 text-amber-500 font-bold" title="Cachês (Moedas)">
        <Coins className="w-5 h-5 fill-current" />
        <span>{user.economy?.cache || 0}</span>
      </div>
    </div>
  );
}
