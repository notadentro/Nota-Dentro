'use client';

import React from 'react';
import { useGamification } from '@/context/GamificationContext';
import { Flame, Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function TopBar() {
  const { lives, xp, streak, isHydrated } = useGamification();

  // Return empty/loading shell before hydration to prevent mismatch
  if (!isHydrated) {
    return <div className="w-full h-16 border-b border-brand-graphite/20" />;
  }

  return (
    <div className="w-full h-16 bg-background flex items-center justify-between px-6 md:px-12 border-b border-brand-graphite/20 sticky top-0 z-50">
      
      {/* Esquerda: Logo / Título */}
      <div className="font-serif font-bold text-xl text-brand-gold">
        Nota Dentro
      </div>

      {/* Direita: Status (Ofensiva, XP, Vidas) */}
      <div className="flex items-center gap-6 font-bold text-sm">
        
        {/* Streak / Ofensiva */}
        <div className={cn("flex items-center gap-2", streak > 0 ? "text-orange-500" : "text-brand-gray")}>
          <Flame size={20} className={streak > 0 ? "fill-orange-500" : "fill-transparent"} />
          <span>{streak}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-2 text-[#2D8A5C]">
          <Star size={20} className="fill-[#2D8A5C]" />
          <motion.span
            key={xp}
            initial={{ scale: 1.5, color: '#FFD700' }}
            animate={{ scale: 1, color: '#2D8A5C' }}
            transition={{ duration: 0.5 }}
          >
            {xp}
          </motion.span>
        </div>

        {/* Lives / Vidas */}
        <div className={cn("flex items-center gap-2", lives > 0 ? "text-red-500" : "text-brand-gray")}>
          <Heart size={20} className={lives > 0 ? "fill-red-500" : "fill-transparent"} />
          <motion.span
            key={lives}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
          >
            {lives}
          </motion.span>
        </div>

      </div>
    </div>
  );
}
