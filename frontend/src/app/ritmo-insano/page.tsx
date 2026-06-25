'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Play, Trophy, Zap, Heart, Waves, Target, Crown, ChevronRight, Map, ArrowLeft, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { HowToPlay } from './HowToPlay';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();
  
  const onStartGame = () => {
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
      name: 'O Caminho',
      description: 'Siga a trilha e domine o ritmo fase a fase',
      icon: Map,
      color: 'from-brand-gold to-yellow-600',
      glow: 'shadow-brand-gold/50'
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
      color: 'from-purple-600 to-purple-800',
      glow: 'shadow-purple-500/50'
    }
  ];

  const stats = [
    { label: 'Vidas', value: user?.stats.lives ?? 5, icon: Heart, color: 'text-red-500' },
    { label: 'XP Total', value: user?.stats.xp ?? 0, icon: Zap, color: 'text-blue-400' },
    { label: 'Cachê', value: user?.stats.cache ?? 0, icon: Crown, color: 'text-brand-gold' },
    { label: 'Fases Concluídas', value: user?.progress?.completedLessons?.length || 0, icon: Trophy, color: 'text-brand-gold' }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-brand-black via-[#1f1a10] to-brand-black overflow-hidden font-sans">
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
            onClick={() => router.push('/auth/login')}
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
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-32 h-32 z-20"
            >
              <Image src="/assets/images/dom_cat.png" alt="Dom the Cat" fill className="object-contain drop-shadow-[0_10px_20px_rgba(242,211,73,0.3)]" />
            </motion.div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headline font-black mb-2 bg-gradient-to-r from-[#ffeaa7] via-brand-gold to-[#e1b12c] bg-clip-text text-transparent drop-shadow-xl uppercase tracking-tighter">
            Ritmo Insano
          </h1>
          
          <p className="text-lg md:text-xl text-brand-gray font-medium tracking-wide max-w-xl mx-auto">
            O jogo definitivo de leitura rítmica. Sincronize. Evolua. Conquiste.
          </p>

          {/* Pulse Wave Visual */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-gradient-to-t from-brand-gold to-yellow-600 rounded-full"
                animate={{
                  height: [20, 60, 20]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 w-full max-w-4xl"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-brand-graphite/60 backdrop-blur-md border border-brand-gray/20 rounded-xl p-3 text-center hover:border-brand-gold/50 transition-all shadow-xl"
            >
              <stat.icon className={cn("w-6 h-6 mx-auto mb-1 drop-shadow-lg", stat.color)} />
              <div className="text-2xl font-black text-white mb-0.5 font-headline">{stat.value}</div>
              <div className="text-[10px] text-brand-gray font-bold uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Game Modes */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full max-w-4xl mb-8"
        >
          <h2 className="text-xl font-headline font-black text-white mb-4 text-center uppercase tracking-widest text-brand-gray/80">
            Escolha o Modo
          </h2>
          
          <div className="grid md:grid-cols-3 gap-3">
            {modes.map((mode, i) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setSelectedMode(mode.id as any)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-300 group overflow-hidden text-left",
                  selectedMode === mode.id
                    ? `border-brand-gold bg-gradient-to-br ${mode.color} shadow-lg ${mode.glow} scale-105`
                    : "border-brand-gray/20 bg-brand-graphite/50 hover:border-brand-gray/50 hover:scale-[1.02]"
                )}
              >
                {/* Background gradient overlay */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br",
                  mode.color,
                  selectedMode === mode.id && "opacity-100"
                )} style={{ mixBlendMode: 'overlay' }} />
                
                <div className="relative z-10">
                  <mode.icon className={cn(
                    "w-8 h-8 mb-2 transition-all drop-shadow-md",
                    selectedMode === mode.id ? "text-brand-black" : "text-brand-gray group-hover:text-white"
                  )} />
                  
                  <h3 className={cn(
                    "text-lg font-black mb-1 transition-colors font-headline uppercase",
                    selectedMode === mode.id ? "text-brand-black" : "text-white"
                  )}>
                    {mode.name}
                  </h3>
                  
                  <p className={cn(
                    "text-sm transition-colors font-medium",
                    selectedMode === mode.id ? "text-brand-black/80" : "text-brand-gray"
                  )}>
                    {mode.description}
                  </p>
                </div>

                {selectedMode === mode.id && (
                  <motion.div
                    layoutId="selectedIndicator"
                    className="absolute inset-0 border-4 border-white/20 rounded-2xl pointer-events-none"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Button
            onClick={onStartGame}
            className="group relative px-8 py-6 text-xl font-headline font-black uppercase tracking-widest rounded-xl bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-300 text-brand-black shadow-xl shadow-brand-gold/40 hover:shadow-brand-gold/60 transition-all hover:scale-105 overflow-hidden border-2 border-transparent"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Play className="w-6 h-6 fill-current" />
              JOGAR AGORA
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: "easeInOut"
              }}
            />
          </Button>

          <Button
            variant="outline"
            className="px-6 py-6 text-base font-bold rounded-xl border-2 border-brand-gray/30 bg-brand-graphite/50 text-white hover:bg-brand-gray/20 hover:border-brand-gray/50 backdrop-blur-sm transition-all"
            onClick={() => setShowHowToPlay(true)}
          >
            <Waves className="w-4 h-4 mr-2 text-brand-gold" />
            Como Jogar
          </Button>
        </motion.div>
      </div>

      {/* Custom Animations */}
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

      {/* How to Play Modal */}
      {showHowToPlay && (
        <HowToPlay onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}
