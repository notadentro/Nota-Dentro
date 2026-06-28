'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trophy, Medal, Star, Shield } from 'lucide-react';
import { getSimulatorRankingServer } from '@/app/actions/gamification';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

type RankingEntry = {
  id: string;
  name: string;
  username: string;
  photoURL: string;
  xp: number;
  level: number;
};

export default function RitmoInsanoRanking() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<60 | 70 | 90>(60);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setIsLoading(true);
      try {
        const data = await getSimulatorRankingServer(activeTab, 50);
        setRanking(data as RankingEntry[]);
      } catch (error) {
        console.error('Failed to fetch ranking:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden flex flex-col relative selection:bg-brand-gold/30">
      {/* Background Animated Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 z-0" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-gold/5 blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-system-info/5 blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="w-full flex items-center justify-between p-4 md:p-6 z-10 border-b border-brand-gold/10 bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/ritmo-insano">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-brand-gold/20 hover:text-brand-gold transition-colors text-slate-300">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-brand-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]" />
            <h1 className="font-headline font-black text-xl md:text-2xl text-white tracking-wide">
              RANKING <span className="text-brand-gold">INSANO</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 z-10 flex flex-col items-center">
        
        <p className="text-slate-400 text-center max-w-xl mb-8">
          Confira os alunos mais dedicados no simulador. O ranking é separado por dificuldade (BPM). Acumule XP para subir nas posições!
        </p>

        {/* Tabs */}
        <div className="flex bg-slate-900/80 backdrop-blur-sm rounded-full p-1 border border-brand-gold/20 mb-8 w-full max-w-md relative shadow-[0_0_20px_rgba(255,215,0,0.1)]">
          {[60, 70, 90].map((bpm) => (
            <button
              key={bpm}
              onClick={() => setActiveTab(bpm as 60 | 70 | 90)}
              className={cn(
                "flex-1 py-3 px-6 rounded-full font-bold text-sm transition-all relative z-10",
                activeTab === bpm ? "text-slate-950" : "text-slate-400 hover:text-brand-gold hover:bg-white/5"
              )}
            >
              {bpm} BPM
            </button>
          ))}
          {/* Slider background for active tab */}
          <div 
            className="absolute top-1 bottom-1 w-[33.33%] bg-brand-gold rounded-full transition-transform duration-300 shadow-[0_0_15px_rgba(255,215,0,0.5)] z-0"
            style={{ 
              transform: `translateX(${activeTab === 60 ? '0%' : activeTab === 70 ? '100%' : '200%'})`
            }}
          />
        </div>

        {/* Leaderboard */}
        <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-3xl border border-brand-gold/20 overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-brand-gold/20 text-xs md:text-sm font-bold text-brand-gold tracking-widest uppercase bg-brand-gold/5">
            <div className="col-span-2 md:col-span-1 text-center">#</div>
            <div className="col-span-6 md:col-span-7">Aluno</div>
            <div className="col-span-2 text-center">Nível</div>
            <div className="col-span-2 text-right pr-4">XP</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col min-h-[400px]">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                <p className="text-brand-gold/80 font-bold animate-pulse">Buscando Lendas...</p>
              </div>
            ) : ranking.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Shield className="w-16 h-16 text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">Ninguém por aqui ainda</h3>
                <p className="text-slate-500">Seja o primeiro a pontuar no modo {activeTab} BPM!</p>
              </div>
            ) : (
              ranking.map((entry, index) => {
                const isCurrentUser = user?.uid === entry.id;
                return (
                  <div 
                    key={entry.id} 
                    className={cn(
                      "grid grid-cols-12 gap-4 p-4 items-center border-b border-white/5 transition-colors",
                      isCurrentUser ? "bg-brand-gold/10" : "hover:bg-white/5"
                    )}
                  >
                    {/* Rank */}
                    <div className="col-span-2 md:col-span-1 flex justify-center">
                      {index === 0 ? <Medal className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" /> :
                       index === 1 ? <Medal className="w-6 h-6 text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]" /> :
                       index === 2 ? <Medal className="w-6 h-6 text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.8)]" /> :
                       <span className="font-black text-slate-500">{index + 1}</span>}
                    </div>

                    {/* Aluno */}
                    <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-gold/30">
                          <Image src={entry.photoURL || `https://picsum.photos/seed/${entry.id}/200`} alt={entry.name} width={40} height={40} className="object-cover" />
                        </div>
                        {isCurrentUser && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-gold rounded-full border border-slate-900 flex items-center justify-center">
                            <Star className="w-2.5 h-2.5 text-slate-900" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={cn("font-bold truncate max-w-[120px] md:max-w-xs", isCurrentUser ? "text-brand-gold" : "text-white")}>
                          {entry.name}
                        </span>
                        <span className="text-xs text-slate-500 truncate">@{entry.username}</span>
                      </div>
                    </div>

                    {/* Nível */}
                    <div className="col-span-2 text-center font-bold text-slate-300">
                      {entry.level}
                    </div>

                    {/* XP */}
                    <div className="col-span-2 text-right pr-4 font-black text-brand-gold font-headline">
                      {entry.xp}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
