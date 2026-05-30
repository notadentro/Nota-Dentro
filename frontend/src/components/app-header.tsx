'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { Flame, Heart, Star } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { motion } from 'framer-motion';

export function AppHeader() {
  const { lives, xp, streak, isHydrated } = useGamification();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="flex md:hidden" />
      <div className="flex w-full items-center justify-between md:justify-end gap-4">
        
        {isHydrated && (
          <div className="flex items-center gap-4 md:mr-auto md:ml-4">
            {/* Vidas */}
            <div className={`flex items-center gap-1 font-bold ${lives > 0 ? 'text-red-500' : 'text-gray-400'}`}>
              <Heart size={20} className={lives > 0 ? "fill-red-500" : "fill-transparent"} />
              <motion.span key={lives} initial={{ scale: 1.5 }} animate={{ scale: 1 }}>
                {lives}
              </motion.span>
            </div>

            {/* Ofensiva */}
            <div className={`flex items-center gap-1 font-bold ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
              <Flame size={20} className={streak > 0 ? "fill-orange-500" : "fill-transparent"} />
              <span>{streak}</span>
            </div>
            
            {/* XP */}
            <div className="flex items-center gap-1 text-[#2D8A5C] font-bold">
              <Star size={20} className="fill-[#2D8A5C]" />
              <motion.span key={xp} initial={{ scale: 1.5, color: '#FFD700' }} animate={{ scale: 1, color: '#2D8A5C' }}>
                {xp}
              </motion.span>
            </div>
          </div>
        )}

        <UserNav />
      </div>
    </header>
  );
}
