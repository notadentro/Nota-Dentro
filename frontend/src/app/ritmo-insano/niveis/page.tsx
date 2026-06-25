'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { GAME_LEVELS } from '@/modules/simulator/constants/levels';
import { Button } from '@/components/ui/button';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Zap, Heart, Lock, Star, Settings, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function RitmoInsanoGameMenu() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedDifficulty, setSelectedDifficulty] = useState<60 | 70 | 90>(60);

  const unlockedLessons = user?.progress?.[`simulator_${selectedDifficulty}_unlocked`] || ['1'];
  const highestUnlocked = Math.max(...unlockedLessons.map((l: string) => parseInt(l)));

  const handlePlay = (levelId: number) => {
    router.push(`/ritmo-insano/play?level=${levelId}&bpm=${selectedDifficulty}`);
  };

  const getWorldName = (levelId: number) => {
    if (levelId <= 10) return "Mundo 1: O Domínio do Pulso";
    if (levelId <= 20) return "Mundo 2: O Despertar das Colcheias";
    if (levelId <= 30) return "Mundo 3: O Domínio do Silêncio";
    if (levelId <= 40) return "Mundo 4: O Balanço Brasileiro";
    return "Mundo 5: O Mestre Gramani";
  };

  const [particles, setParticles] = useState<Array<{id: number, left: number, top: number, delay: number, duration: number}>>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(
      [...Array(20)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4
      }))
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-brand-black via-[#1f1a10] to-brand-black overflow-hidden flex flex-col font-sans selection:bg-brand-gold selection:text-black">
      
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(242, 211, 73, 0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle absolute w-2 h-2 bg-gradient-to-r from-brand-gold to-yellow-600 rounded-full opacity-30"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* Header Bar */}
      <div className="w-full bg-brand-graphite/60 backdrop-blur-md border-b border-brand-gray/20 p-4 sticky top-0 z-50 flex justify-between items-center shadow-xl">
         <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/ritmo-insano')}>
            <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-xl flex items-center justify-center font-black text-black shadow-lg">R</div>
            <span className="font-headline font-black text-white text-xl tracking-wider uppercase drop-shadow-md">Insano</span>
         </div>
         
         {user ? (
          <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-black/40 border border-brand-gray/20 px-3 py-1.5 rounded-2xl shadow-inner">
               <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
               <span className="font-black text-white">{user.stats.lives}</span>
             </div>
             <div className="flex items-center gap-2 bg-black/40 border border-brand-gray/20 px-3 py-1.5 rounded-2xl shadow-inner">
               <Zap className="w-5 h-5 text-brand-gold fill-brand-gold drop-shadow-[0_0_8px_rgba(242,211,73,0.5)]" />
               <span className="font-black text-brand-gold">{user.stats.cache}</span>
             </div>
          </div>
         ) : (
           <Button onClick={() => router.push('/auth/login')} className="bg-brand-gold text-black font-black hover:bg-yellow-400">LOGIN</Button>
         )}
      </div>

      <div className="flex-1 overflow-y-auto pb-32 pt-10 flex flex-col items-center custom-scrollbar relative z-10">
        
        {/* Difficulty Selector */}
        <div className="w-full max-w-[320px] mb-14 relative z-20">
          <div className="bg-brand-graphite/60 backdrop-blur-md p-2 rounded-[24px] flex gap-2 border border-brand-gray/20 shadow-xl">
            <Button onClick={() => setSelectedDifficulty(60)} className={cn("flex-1 h-12 rounded-[16px] font-black text-[13px] uppercase tracking-widest transition-all", selectedDifficulty === 60 ? "bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105" : "bg-transparent text-brand-gray hover:text-white hover:bg-white/10")}>Fácil</Button>
            <Button onClick={() => setSelectedDifficulty(70)} className={cn("flex-1 h-12 rounded-[16px] font-black text-[13px] uppercase tracking-widest transition-all", selectedDifficulty === 70 ? "bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-black shadow-lg shadow-brand-gold/30 scale-105" : "bg-transparent text-brand-gray hover:text-white hover:bg-white/10")}>Médio</Button>
            <Button onClick={() => setSelectedDifficulty(90)} className={cn("flex-1 h-12 rounded-[16px] font-black text-[13px] uppercase tracking-widest transition-all", selectedDifficulty === 90 ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105" : "bg-transparent text-brand-gray hover:text-white hover:bg-white/10")}>Insano</Button>
          </div>
        </div>

        {/* Path Layout (Trilha de Fases) */}
        <div className="flex flex-col items-center gap-14 w-full max-w-md px-4 pb-32 relative">
           {GAME_LEVELS.map((lvl, idx) => {
             const isUnlocked = unlockedLessons.includes(lvl.id.toString()) || lvl.id === 1 || !user;
             const isCurrent = lvl.id === highestUnlocked;
             const isCompleted = lvl.id < highestUnlocked;
             const isFirstOfWorld = lvl.id % 10 === 1;
             
             // Create a zig-zag offset pattern
             const offsetClass = [
                'translate-x-0', 
                'translate-x-12', 
                'translate-x-20', 
                'translate-x-12', 
                'translate-x-0', 
                '-translate-x-12', 
                '-translate-x-20', 
                '-translate-x-12'
             ][idx % 8];

             return (
               <div key={lvl.id} className="w-full flex flex-col items-center">
                 {isFirstOfWorld && (
                   <div className="w-full flex justify-center mb-10 mt-6 relative">
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
                     </div>
                     <div className="relative bg-brand-black border-2 border-brand-gold/30 px-6 py-3 rounded-full shadow-[0_0_15px_rgba(242,211,73,0.2)]">
                       <h2 className="text-brand-gold font-headline font-black uppercase tracking-widest text-sm md:text-base text-center">
                         {getWorldName(lvl.id)}
                       </h2>
                     </div>
                   </div>
                 )}

                 <div className={cn("relative flex flex-col items-center transition-transform duration-500", offsetClass)}>
                    {/* Dom Mascot floating near current level */}
                    {isCurrent && (
                      <div className={cn("absolute -top-8 w-24 h-24 md:w-28 md:h-28 animate-bounce z-20 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]", offsetClass.startsWith('-') ? "left-full ml-4" : "right-full mr-4")}>
                        <Image src="/assets/images/dom_cat.png" alt="Dom, the Cat" fill className="object-contain" />
                        <div className={cn("absolute -top-6 bg-white border-b-4 border-gray-300 text-black text-[10px] md:text-[11px] font-black px-4 py-2 rounded-2xl shadow-xl transform rotate-3 whitespace-nowrap", offsetClass.startsWith('-') ? "right-6 rounded-br-none" : "left-6 rounded-bl-none")}>
                          Miau! Vamos!
                        </div>
                      </div>
                    )}

                  <button
                    onClick={() => isUnlocked && handlePlay(lvl.id)}
                    disabled={!isUnlocked}
                    className={cn(
                      "w-20 h-20 rounded-full flex flex-col items-center justify-center font-black text-3xl transition-all relative group overflow-hidden border-4",
                      isCurrent 
                        ? "bg-gradient-to-br from-brand-gold to-yellow-500 text-brand-black border-yellow-200 shadow-[0_0_20px_rgba(242,211,73,0.5)] hover:scale-110 active:scale-95 scale-105 z-10 ring-[8px] ring-brand-gold/30"
                        : isCompleted
                          ? "bg-gradient-to-br from-green-400 to-green-600 text-white border-green-200 shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95"
                          : "bg-brand-graphite/50 text-brand-gray border-brand-gray/20 shadow-inner cursor-not-allowed backdrop-blur-sm"
                    )}
                  >
                    {/* Add a highlight reflection inside the button */}
                    <div className="absolute top-1 left-2 right-2 h-4 bg-white/20 rounded-full" />

                    {isCompleted ? <Star className="w-8 h-8 fill-white drop-shadow-md" /> : isUnlocked ? lvl.id : <Lock className="w-7 h-7 drop-shadow-md" />}
                  </button>
                  <div className="mt-4 bg-black/40 backdrop-blur-sm border border-brand-gray/20 text-[10px] md:text-xs font-black text-brand-gray px-4 py-2 rounded-xl uppercase tracking-widest text-center shadow-md max-w-[140px] leading-tight">
                    {lvl.name}
                  </div>
                 </div>
               </div>
             )
           })}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-80px) translateX(40px) rotate(180deg);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
