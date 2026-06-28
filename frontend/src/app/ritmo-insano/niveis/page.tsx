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

  useEffect(() => {
    const saved = localStorage.getItem('ritmo_bpm');
    if (saved) {
      setSelectedDifficulty(Number(saved) as 60 | 70 | 90);
    }
  }, []);

  const unlockedLessons = user?.progress?.[`simulator_${selectedDifficulty}_unlocked`] || ['1'];
  const highestUnlocked = Math.max(...unlockedLessons.map((l: string) => parseInt(l)));

  const handlePlay = (levelId: number) => {
    router.push(`/ritmo-insano/play?level=${levelId}&bpm=${selectedDifficulty}`);
  };

  const getWorldName = (levelId: number) => {
    if (levelId === 0) return "Treinamento Básico";
    if (levelId <= 10) return "Mundo 1: O Todo e as Metades";
    if (levelId <= 20) return "Mundo 2: O Despertar da Semínima";
    if (levelId <= 30) return "Mundo 3: O Domínio do Silêncio e o Contratempo";
    if (levelId <= 40) return "Mundo 4: O Despertar das Colcheias";
    if (levelId <= 50) return "Mundo 5: O Balanço Brasileiro";
    if (levelId <= 60) return "Mundo 6: Os Divertimentos";
    return "Mundo 7: A Extensão do Som";
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
    <div className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col font-sans selection:bg-cyan-400 selection:text-slate-900">
      
      {/* Animated Arcade Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          animation: 'gridMove 20s linear infinite'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle absolute w-2 h-2 rounded-full opacity-60"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: p.id % 2 === 0 ? '#fbbf24' : '#f59e0b',
              boxShadow: `0 0 10px ${p.id % 2 === 0 ? '#fbbf24' : '#f59e0b'}`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* Header Bar */}
      <div className="w-full bg-slate-900/60 backdrop-blur-md border-b border-brand-gold/20 p-4 sticky top-0 z-50 flex justify-between items-center shadow-[0_4px_20px_rgba(255,215,0,0.15)]">
         <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push('/ritmo-insano')}>
            <div className="w-10 h-10 bg-brand-gold/20 border border-brand-gold rounded-xl flex items-center justify-center font-black text-brand-gold shadow-[0_0_15px_rgba(255,215,0,0.4)] group-hover:bg-brand-gold group-hover:text-slate-900 transition-colors">R</div>
            <span className="font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffeaa7] to-brand-gold text-xl tracking-wider uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">Insano</span>
         </div>
         
         {user ? (
          <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-slate-800/80 border border-red-500/30 px-3 py-1.5 rounded-2xl shadow-inner">
               <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
               <span className="font-black text-white">{user.stats.lives}</span>
             </div>
             <div className="flex items-center gap-2 bg-slate-800/80 border border-brand-gold/30 px-3 py-1.5 rounded-2xl shadow-inner">
               <Zap className="w-5 h-5 text-brand-gold fill-brand-gold drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
               <span className="font-black text-brand-gold">{user.stats.cache}</span>
             </div>
          </div>
         ) : (
           <Button onClick={() => router.push('/auth/login?redirect=/ritmo-insano/niveis')} className="bg-brand-gold text-brand-black font-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.5)]">LOGIN</Button>
         )}
      </div>

      <div className="flex-1 overflow-y-auto pb-32 pt-10 flex flex-col items-center custom-scrollbar relative z-10">

        {/* Path Layout (Trilha de Fases) */}
        <div className="flex flex-col items-center gap-14 w-full max-w-md px-4 pb-32 relative">
           {GAME_LEVELS.map((lvl, idx) => {
             const isUnlocked = unlockedLessons.includes(lvl.id.toString()) || lvl.id === 1 || lvl.id === 0 || !user;
             const isCurrent = lvl.id === highestUnlocked;
             const isCompleted = lvl.id < highestUnlocked || (lvl.id === 0 && unlockedLessons.includes('1'));
             const isFirstOfWorld = lvl.id === 0 || lvl.id === 1 || (lvl.id > 10 && lvl.id % 10 === 1);
             
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
                     <div className="relative bg-slate-900 border-2 border-brand-gold/50 px-6 py-3 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                       <h2 className="text-brand-gold font-headline font-black uppercase tracking-widest text-sm md:text-base text-center">
                         {getWorldName(lvl.id)}
                       </h2>
                     </div>
                   </div>
                 )}                  <div className={cn("relative flex flex-col items-center transition-transform duration-500", offsetClass)}>
                    {/* Linha de energia conectando os níveis - visual fake apenas para dar sentido de rede */}
                    {!isFirstOfWorld && (
                      <div className={cn(
                        "absolute -top-14 w-1 bg-gradient-to-b -z-10",
                        isUnlocked ? "from-brand-gold to-yellow-600 shadow-[0_0_10px_rgba(255,215,0,0.8)]" : "from-slate-700 to-slate-800"
                      )} style={{ height: '56px', transform: idx % 2 === 0 ? 'rotate(15deg)' : 'rotate(-15deg)' }} />
                    )}

                    {/* Dom Mascot floating near current level */}
                    {isCurrent && (
                      <div className={cn("absolute -top-8 w-24 h-24 md:w-28 md:h-28 animate-bounce z-20 pointer-events-none drop-shadow-[0_10px_20px_rgba(239,68,68,0.7)] group", offsetClass.startsWith('-') ? "left-full ml-4" : "right-full mr-4")}>
                        <div className="absolute w-20 h-20 top-4 left-4 bg-red-600/40 rounded-full blur-[20px] z-0"></div>
                        <Image src="/assets/images/dom_cat.png" alt="Dom, the Cat" fill className="object-contain contrast-125 saturate-150 z-10" />
                        <div className="absolute top-[35%] left-[30%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_4px_rgba(239,68,68,0.8)] z-20"></div>
                        <div className="absolute top-[35%] right-[30%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_4px_rgba(239,68,68,0.8)] z-20"></div>

                        <div className={cn("absolute -top-6 bg-slate-900 border-b-4 border-red-500 text-red-400 text-[10px] md:text-[11px] font-black px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(239,68,68,0.5)] transform rotate-3 whitespace-nowrap z-30", offsetClass.startsWith('-') ? "right-6 rounded-br-none" : "left-6 rounded-bl-none")}>
                          Foco, humano!
                        </div>
                      </div>
                    )}

                  <button
                    onClick={() => isUnlocked && handlePlay(lvl.id)}
                    disabled={!isUnlocked}
                    className={cn(
                      "w-20 h-20 rounded-full flex flex-col items-center justify-center font-black text-3xl transition-all relative group overflow-hidden border-4 backdrop-blur-sm",
                      isCurrent 
                        ? "bg-brand-gold/20 text-brand-gold border-brand-gold shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:scale-110 active:scale-95 scale-105 z-10 ring-[8px] ring-brand-gold/30"
                        : isCompleted
                          ? "bg-yellow-600/20 text-yellow-500 border-yellow-600 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 active:scale-95"
                          : "bg-slate-800/50 text-slate-500 border-slate-700/50 shadow-inner cursor-not-allowed"
                    )}
                  >
                    {/* Add a highlight reflection inside the button */}
                    <div className="absolute top-1 left-2 right-2 h-4 bg-white/10 rounded-full" />

                    {isCompleted ? <Star className="w-8 h-8 fill-current drop-shadow-[0_0_8px_currentColor]" /> : isUnlocked ? lvl.id : <Lock className="w-7 h-7 opacity-50" />}
                  </button>
                  <div className="mt-4 bg-slate-900/80 backdrop-blur-sm border border-brand-gold/30 text-[10px] md:text-xs font-black text-brand-gold/90 px-4 py-2 rounded-xl uppercase tracking-widest text-center shadow-[0_4px_10px_rgba(255,215,0,0.2)] max-w-[140px] leading-tight">
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
            opacity: 0.2;
          }
          50% {
            transform: translateY(-50px) translateX(20px) rotate(90deg);
            opacity: 0.8;
          }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
      `}</style>
    </div>
  );
}
