'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArrowLeft, Gamepad2, Settings2, Play, Crown, Sparkles, Zap, Flame, Trophy, Waves, Target, ChevronRight, Map, UserCircle, Settings, Heart } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { HowToPlay } from './HowToPlay';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();
  
  const [bpm, setBpm] = useState<60 | 70 | 90>(60);
  const [mainTab, setMainTab] = useState<'play' | 'settings' | 'ranking' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ritmo_bpm');
    if (saved) setBpm(Number(saved) as 60 | 70 | 90);
  }, []);

  const handleBpmChange = (newBpm: 60 | 70 | 90) => {
    setBpm(newBpm);
    localStorage.setItem('ritmo_bpm', newBpm.toString());
  };

  const simUnlocked = user?.progress?.[`simulator_${bpm}_unlocked`] || ['1'];
  const highestUnlocked = Math.max(...simUnlocked.map(Number));

  const onContinue = () => {
    router.push(`/ritmo-insano/play?level=${highestUnlocked}&bpm=${bpm}`);
  };

  const onPlayFirstTime = () => {
    const completed = user?.progress?.[`simulator_${bpm}_completed`] || [];
    if (completed.length === 0) {
      router.push(`/ritmo-insano/play?level=0&bpm=${bpm}`);
    } else {
      router.push(`/ritmo-insano/play?level=1&bpm=${bpm}`);
    }
  };

  const onPlayTutorial = () => {
    router.push(`/ritmo-insano/play?level=0&bpm=${bpm}`);
  };

  const onLevels = () => {
    router.push('/ritmo-insano/niveis');
  };

  const [selectedMode, setSelectedMode] = useState<'story' | 'practice' | 'challenge'>('story');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
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

  const modes = [
    {
      id: 'story',
      name: 'Modo Arcade',
      description: 'Siga a trilha e domine o ritmo fase a fase',
      icon: Map,
      color: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/50'
    },
    {
      id: 'practice',
      name: 'Treino Livre',
      description: 'Pratique qualquer nível desbloqueado',
      icon: Target,
      color: 'from-slate-600 to-slate-800',
      glow: 'shadow-slate-500/50'
    },
    {
      id: 'challenge',
      name: 'Desafio Diário',
      description: 'Em breve: Compita pelo ranking',
      icon: Trophy,
      color: 'from-pink-600 to-rose-800',
      glow: 'shadow-pink-500/50'
    }
  ];

  const stats = [
    { label: 'Vidas', value: user?.stats.lives ?? 5, icon: Heart, color: 'text-red-500' },
    { label: 'XP Total', value: user?.stats.xp ?? 0, icon: Zap, color: 'text-blue-400' },
    { label: 'Cachê', value: user?.stats.cache ?? 0, icon: Crown, color: 'text-brand-gold' },
    { label: 'Fases Concluídas', value: user?.progress?.completedLessons?.length || 0, icon: Trophy, color: 'text-brand-gold' }
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Animated Arcade Grid Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          animation: 'gridMove 20s linear infinite'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      </div>

      {/* Floating Neon Particles */}
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

      {/* Main Content */}
      
      {/* Top Navbar */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-50">
        <Button 
          variant="ghost" 
          className="text-brand-gray hover:text-white hover:bg-white/10"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Plataforma
        </Button>
        
        {user ? (
          <div className="flex items-center gap-3 bg-brand-graphite/60 backdrop-blur-md border border-brand-gray/20 rounded-full pr-4 pl-1 py-1">
            <Image src={user.photoURL || '/assets/images/avatar_placeholder.png'} alt="User avatar" width={32} height={32} className="rounded-full" />
            <span className="text-white text-sm font-bold">{user.displayName || user.name}</span>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black rounded-full px-6"
            onClick={() => router.push('/auth/login?redirect=/ritmo-insano/niveis')}
          >
            Login
          </Button>
        )}
      </header>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-4">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center mb-2 relative">
            {/* Aura de Gato Malvado */}
            <div className="absolute w-40 h-40 bg-red-600/30 rounded-full blur-[40px] animate-pulse z-0"></div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-32 h-32 z-20 group"
            >
              <Image src="/assets/images/dom_cat.png" alt="Dom the Cat" fill className="object-contain drop-shadow-[0_10px_25px_rgba(239,68,68,0.7)] contrast-125 saturate-150" />
              {/* Olhos vermelhos brilhantes falsos */}
              <div className="absolute top-[35%] left-[30%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_4px_rgba(239,68,68,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-[35%] right-[30%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_4px_rgba(239,68,68,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ffeaa7] via-brand-gold to-[#e1b12c] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] uppercase tracking-tighter">
            Ritmo Insano
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-brand-gray font-medium tracking-wide max-w-xl mx-auto px-4">
            O jogo definitivo de leitura rítmica. Sincronize. Evolua. Conquiste.
          </p>

          {/* Pulse Wave Visual */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={cn("w-1.5 rounded-full shadow-[0_0_8px_currentColor]", i % 2 === 0 ? "bg-brand-gold text-brand-gold" : "bg-yellow-400 text-yellow-400")}
                animate={{
                  height: [15, 50, 15]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* JOGAR CENTER BUTTON */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center mb-8"
        >
          {highestUnlocked > 1 ? (
            <div className="flex flex-col sm:flex-row gap-4 w-full px-4 sm:px-0 justify-center">
              <Button
                onClick={onContinue}
                className="group relative px-4 py-6 sm:px-8 sm:py-6 text-sm sm:text-xl font-headline font-black uppercase tracking-widest rounded-xl bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-300 text-brand-black shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] backdrop-blur-md transition-all hover:scale-105 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  CONTINUAR (FASE {highestUnlocked})
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                />
              </Button>
              <Button
                onClick={onLevels}
                className="group relative px-6 py-6 sm:px-8 sm:py-6 text-sm sm:text-xl font-headline font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 overflow-hidden border-2 bg-brand-graphite/50 text-white border-brand-gray/30 hover:bg-brand-gray/20 hover:border-brand-gold/80 backdrop-blur-md hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  <Map className="w-5 h-5 sm:w-6 sm:h-6" />
                  FASES
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <Button
                onClick={onPlayFirstTime}
                className="group relative px-8 py-6 sm:px-10 sm:py-8 text-lg sm:text-2xl font-headline font-black uppercase tracking-widest rounded-xl bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-300 text-brand-black shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:shadow-[0_0_50px_rgba(255,215,0,0.7)] backdrop-blur-md transition-all hover:scale-110 overflow-hidden w-full sm:w-auto mx-4 sm:mx-0"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                  JOGAR AGORA
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                />
              </Button>
            </div>
          )}
        </motion.div>

        {/* TABS */}
        <div className="w-full max-w-4xl mb-6 px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setMainTab(mainTab === 'play' ? null : 'play')}
              className={cn("text-base sm:text-lg font-headline font-black uppercase tracking-widest transition-all w-full sm:w-auto flex-1 sm:flex-none", mainTab === 'play' ? "text-brand-gold border-b-2 sm:border-b-4 border-brand-gold bg-brand-gold/10 shadow-[0_4px_15px_-3px_rgba(255,215,0,0.3)]" : "text-brand-gray hover:text-white")}
            >
              Modos de Jogo
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/ritmo-insano/ranking')}
              className="text-base sm:text-lg font-headline font-black uppercase tracking-widest transition-all w-full sm:w-auto flex-1 sm:flex-none text-brand-gray hover:text-white"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-brand-gold" />
              Ranking
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setMainTab(mainTab === 'settings' ? null : 'settings')}
              className={cn("text-base sm:text-lg font-headline font-black uppercase tracking-widest transition-all w-full sm:w-auto flex-1 sm:flex-none", mainTab === 'settings' ? "text-brand-gold border-b-2 sm:border-b-4 border-brand-gold bg-brand-gold/10 shadow-[0_4px_15px_-3px_rgba(255,215,0,0.3)]" : "text-brand-gray hover:text-white")}
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Configurações
            </Button>
          </div>

          {mainTab === 'play' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-3 gap-3"
            >
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => setSelectedMode(mode.id as any)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 transition-all duration-300 group overflow-hidden text-left backdrop-blur-sm",
                    selectedMode === mode.id
                      ? `border-brand-gold bg-gradient-to-br from-brand-gold/20 to-yellow-600/20 shadow-[0_0_20px_rgba(255,215,0,0.3)] scale-105`
                      : "border-brand-gray/20 bg-brand-graphite/50 hover:border-brand-gold/50 hover:bg-brand-gold/10 hover:scale-[1.02]"
                  )}
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity bg-gradient-to-br",
                    mode.color,
                    selectedMode === mode.id && "opacity-40"
                  )} style={{ mixBlendMode: 'overlay' }} />
                  
                  <div className="relative z-10">
                    <mode.icon className={cn(
                      "w-8 h-8 mb-2 transition-all drop-shadow-md",
                      selectedMode === mode.id ? "text-brand-black" : "text-brand-gray group-hover:text-white"
                    )} />
                    
                    <h3 className={cn(
                      "text-lg font-black mb-1 transition-colors font-headline uppercase",
                      selectedMode === mode.id ? "text-brand-gold drop-shadow-md" : "text-slate-200"
                    )}>
                      {mode.name}
                    </h3>
                    
                    <p className={cn(
                      "text-sm transition-colors font-medium",
                      selectedMode === mode.id ? "text-white/90" : "text-brand-gray"
                    )}>
                      {mode.description}
                    </p>
                  </div>

                  {selectedMode === mode.id && (
                    <div
                      className="absolute inset-0 border-4 border-white/20 rounded-xl pointer-events-none animate-in fade-in duration-300"
                    />
                  )}
                </button>
              ))}
            </motion.div>
          )}

          {mainTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-graphite/60 backdrop-blur-md p-6 rounded-2xl border border-brand-gray/20 shadow-xl w-full max-w-2xl mx-auto flex flex-col items-center"
            >
              <h3 className="text-lg sm:text-xl font-headline font-black text-white mb-6 uppercase tracking-widest text-brand-gray/80 text-center">Dificuldade</h3>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button onClick={() => handleBpmChange(60)} className={cn("flex-1 h-14 sm:h-16 rounded-[16px] font-black text-sm sm:text-lg uppercase tracking-widest transition-all", bpm === 60 ? "bg-green-500 text-white shadow-lg shadow-green-500/30 hover:scale-[1.02]" : "bg-brand-black text-brand-gray border border-brand-gray/20 hover:text-white hover:border-brand-gray/50 hover:scale-[1.02]")}>Fácil (60)</Button>
                  <Button onClick={() => handleBpmChange(70)} className={cn("flex-1 h-14 sm:h-16 rounded-[16px] font-black text-sm sm:text-lg uppercase tracking-widest transition-all", bpm === 70 ? "bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-black shadow-lg shadow-brand-gold/30 hover:scale-[1.02]" : "bg-brand-black text-brand-gray border border-brand-gray/20 hover:text-white hover:border-brand-gray/50 hover:scale-[1.02]")}>Médio (70)</Button>
                  <Button onClick={() => handleBpmChange(90)} className={cn("flex-1 h-14 sm:h-16 rounded-[16px] font-black text-sm sm:text-lg uppercase tracking-widest transition-all", bpm === 90 ? "bg-red-500 text-white shadow-lg shadow-red-500/30 hover:scale-[1.02]" : "bg-brand-black text-brand-gray border border-brand-gray/20 hover:text-white hover:border-brand-gray/50 hover:scale-[1.02]")}>Insano (90)</Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                <Button
                  variant="outline"
                  className="flex-1 px-6 py-6 text-sm font-bold rounded-xl border-2 border-brand-gray/30 bg-brand-black text-white hover:bg-brand-gray/20 hover:border-brand-gray/50 backdrop-blur-sm transition-all"
                  onClick={() => setShowHowToPlay(true)}
                >
                  <Waves className="w-4 h-4 mr-2 text-brand-gold" />
                  Como Jogar
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 w-full max-w-4xl"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-brand-graphite/60 backdrop-blur-md border border-brand-gold/20 rounded-xl p-3 text-center hover:border-brand-gold transition-all shadow-[0_0_15px_rgba(255,215,0,0.1)] hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]"
            >
              <stat.icon className={cn("w-6 h-6 mx-auto mb-1 drop-shadow-[0_0_8px_currentColor]", stat.color)} />
              <div className="text-2xl font-black text-white mb-0.5 font-headline">{stat.value}</div>
              <div className="text-[10px] text-brand-gold/80 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Custom Animations */}
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

      {/* How to Play Modal */}
      {showHowToPlay && (
        <HowToPlay onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}
