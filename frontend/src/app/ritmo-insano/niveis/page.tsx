'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { GAME_LEVELS } from '@/modules/simulator/constants/levels';
import { Button } from '@/components/ui/button';
import { Zap, Heart, Lock, Star, Settings, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function RitmoInsanoGameMenu() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedDifficulty, setSelectedDifficulty] = useState<60 | 70 | 90>(60);

  const unlockedLessons = user?.progress?.unlockedLessons || ['1'];
  const highestUnlocked = Math.max(...unlockedLessons.map((l: string) => parseInt(l)));

  const handlePlay = (levelId: number) => {
    router.push(`/ritmo-insano/play?level=${levelId}&bpm=${selectedDifficulty}`);
  };

  return (
    <div className="min-h-screen bg-[#111] overflow-hidden flex flex-col font-body selection:bg-brand-gold selection:text-black relative">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
         <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #F2D349 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} />
      </div>

      {/* Header Bar */}
      <div className="w-full bg-brand-black border-b-4 border-black/50 p-4 sticky top-0 z-50 flex justify-between items-center shadow-xl">
         <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
           <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center font-black text-black rotate-[-5deg] shadow-[0_4px_0_#A16207]">R</div>
           <span className="font-headline font-black text-white text-xl tracking-wider uppercase">Insano</span>
         </div>
         
         {user ? (
          <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-[#222] border-b-4 border-[#111] px-3 py-1.5 rounded-2xl">
               <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
               <span className="font-black text-white">{user.stats.lives}</span>
             </div>
             <div className="flex items-center gap-2 bg-[#222] border-b-4 border-[#111] px-3 py-1.5 rounded-2xl">
               <Zap className="w-5 h-5 text-brand-gold fill-brand-gold" />
               <span className="font-black text-brand-gold">{user.stats.cache}</span>
             </div>
          </div>
         ) : (
           <Button onClick={() => router.push('/')} className="bg-brand-gold text-black font-black border-b-4 border-yellow-700 active:translate-y-1 active:border-b-0">LOGIN</Button>
         )}
      </div>

      <div className="flex-1 overflow-y-auto pb-32 pt-10 flex flex-col items-center custom-scrollbar relative z-10">
        
        {/* Difficulty Selector */}
        <div className="w-full max-w-[320px] mb-14 relative z-20">
          <div className="bg-[#222] p-2 rounded-[24px] flex gap-2 border-b-4 border-[#111] shadow-2xl">
            <Button onClick={() => setSelectedDifficulty(60)} className={cn("flex-1 h-12 rounded-[16px] font-black text-[13px] uppercase tracking-widest", selectedDifficulty === 60 ? "bg-green-500 text-white shadow-[0_4px_0_#166534] active:translate-y-1 active:shadow-none hover:bg-green-400" : "bg-transparent text-gray-500 hover:text-white hover:bg-white/5")}>Fácil</Button>
            <Button onClick={() => setSelectedDifficulty(70)} className={cn("flex-1 h-12 rounded-[16px] font-black text-[13px] uppercase tracking-widest", selectedDifficulty === 70 ? "bg-brand-gold text-brand-black shadow-[0_4px_0_#A16207] active:translate-y-1 active:shadow-none hover:bg-yellow-400" : "bg-transparent text-gray-500 hover:text-white hover:bg-white/5")}>Médio</Button>
            <Button onClick={() => setSelectedDifficulty(90)} className={cn("flex-1 h-12 rounded-[16px] font-black text-[13px] uppercase tracking-widest", selectedDifficulty === 90 ? "bg-red-500 text-white shadow-[0_4px_0_#991b1b] active:translate-y-1 active:shadow-none hover:bg-red-400" : "bg-transparent text-gray-500 hover:text-white hover:bg-white/5")}>Insano</Button>
          </div>
        </div>

        {/* Path Layout (Trilha de Fases) */}
        <div className="flex flex-col items-center gap-10 w-full max-w-sm px-4 pb-20 relative">
           {GAME_LEVELS.slice(0, 30).map((lvl, idx) => {
             const isUnlocked = unlockedLessons.includes(lvl.id.toString()) || lvl.id === 1 || !user;
             const isCurrent = lvl.id === highestUnlocked;
             const isCompleted = lvl.id < highestUnlocked;
             
             // Create a zig-zag offset pattern
             const offsetClass = [
                'translate-x-0', 
                'translate-x-12', 
                'translate-x-16', 
                'translate-x-12', 
                'translate-x-0', 
                '-translate-x-12', 
                '-translate-x-16', 
                '-translate-x-12'
             ][idx % 8];

             return (
               <div key={lvl.id} className={cn("relative flex flex-col items-center transition-transform duration-500", offsetClass)}>
                  {/* Dom Mascot floating near current level */}
                  {isCurrent && (
                    <div className="absolute -left-[110px] -top-8 w-28 h-28 animate-bounce z-20 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                      <Image src="/assets/images/dom_cat.png" alt="Dom, the Cat" fill className="object-contain" />
                      <div className="absolute -top-6 left-6 bg-white border-b-4 border-gray-300 text-black text-[11px] font-black px-4 py-2 rounded-2xl rounded-bl-none shadow-xl transform rotate-3">
                        Miau! Vamos!
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => isUnlocked && handlePlay(lvl.id)}
                    disabled={!isUnlocked}
                    className={cn(
                      "w-20 h-20 rounded-full flex flex-col items-center justify-center font-black text-3xl transition-all relative group overflow-hidden",
                      isCurrent 
                        ? "bg-brand-gold text-brand-black border-4 border-yellow-200 shadow-[0_10px_0_#A16207] hover:-translate-y-1 hover:shadow-[0_14px_0_#A16207] active:translate-y-2 active:shadow-[0_0px_0_#A16207] scale-110 z-10 ring-[12px] ring-brand-gold/20"
                        : isCompleted
                          ? "bg-green-400 text-white border-4 border-green-200 shadow-[0_8px_0_#16a34a] hover:-translate-y-1 hover:shadow-[0_10px_0_#16a34a] active:translate-y-2 active:shadow-[0_0px_0_#16a34a]"
                          : "bg-[#333] text-[#666] border-4 border-[#222] shadow-[0_6px_0_#111] cursor-not-allowed"
                    )}
                  >
                    {/* Add a highlight reflection inside the button */}
                    <div className="absolute top-1 left-2 right-2 h-4 bg-white/20 rounded-full" />

                    {isCompleted ? <Star className="w-8 h-8 fill-white" /> : isUnlocked ? lvl.id : <Lock className="w-7 h-7" />}
                  </button>
                  <div className="mt-4 bg-[#222] border border-[#333] text-[10px] font-black text-brand-gray px-3 py-1.5 rounded-xl uppercase tracking-widest whitespace-nowrap shadow-md">{lvl.name.split(' ')[0]}</div>
               </div>
             )
           })}
        </div>
      </div>

      {/* Bottom Nav / FABs */}
      <div className="fixed bottom-8 left-0 w-full flex justify-center px-4 z-50 pointer-events-none">
        <div className="w-full max-w-[360px] flex justify-between pointer-events-auto">
           <button className="w-14 h-14 bg-[#222] rounded-full border-b-4 border-[#111] flex items-center justify-center text-brand-gray hover:text-white transition-all active:translate-y-1 active:border-b-0 shadow-xl">
              <Settings className="w-6 h-6" />
           </button>
           <button className="w-14 h-14 bg-blue-500 rounded-full border-b-4 border-blue-700 flex items-center justify-center text-white hover:bg-blue-400 transition-all active:translate-y-1 active:border-b-0 shadow-[0_10px_20px_rgba(59,130,246,0.3)]">
              <ShoppingCart className="w-6 h-6" />
           </button>
        </div>
      </div>
    </div>
  );
}
