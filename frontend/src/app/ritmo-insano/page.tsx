'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Trophy, Zap, Heart, Waves, Target, Crown, ChevronRight, Map } from 'lucide-react';
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

  useEffect(() => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle) => {
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 4;
      (particle as HTMLElement).style.animationDelay = `${delay}s`;
      (particle as HTMLElement).style.animationDuration = `${duration}s`;
    });
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
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-gradient-to-r from-brand-gold to-yellow-600 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: 'float 4s ease-in-out infinite'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4 relative">
            <motion.div
              animate={{ 
                y: [0, -15, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-48 h-48 z-20"
            >
              <Image src="/assets/images/dom_cat.png" alt="Dom the Cat" fill className="object-contain drop-shadow-[0_10px_20px_rgba(242,211,73,0.3)]" />
            </motion.div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-headline font-black mb-4 bg-gradient-to-r from-[#ffeaa7] via-brand-gold to-[#e1b12c] bg-clip-text text-transparent drop-shadow-2xl uppercase tracking-tighter">
            Ritmo Insano
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-gray font-medium tracking-wide max-w-2xl mx-auto">
            O jogo definitivo de leitura rítmica. Sincronize. Evolua. Conquiste.
          </p>

          {/* Pulse Wave Visual */}
          <div className="mt-8 flex items-center justify-center gap-2">
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 w-full max-w-4xl"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-brand-graphite/60 backdrop-blur-md border border-brand-gray/20 rounded-2xl p-4 text-center hover:border-brand-gold/50 transition-all shadow-xl"
            >
              <stat.icon className={cn("w-8 h-8 mx-auto mb-2 drop-shadow-lg", stat.color)} />
              <div className="text-3xl font-black text-white mb-1 font-headline">{stat.value}</div>
              <div className="text-xs text-brand-gray font-bold uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Game Modes */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full max-w-4xl mb-12"
        >
          <h2 className="text-2xl font-headline font-black text-white mb-6 text-center uppercase tracking-widest text-brand-gray/80">
            Escolha o Modo
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {modes.map((mode, i) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                onClick={() => setSelectedMode(mode.id as any)}
                className={cn(
                  "relative p-6 rounded-2xl border-2 transition-all duration-300 group overflow-hidden text-left",
                  selectedMode === mode.id
                    ? `border-brand-gold bg-gradient-to-br ${mode.color} shadow-2xl ${mode.glow} scale-105`
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
                    "w-12 h-12 mb-4 transition-all drop-shadow-md",
                    selectedMode === mode.id ? "text-brand-black" : "text-brand-gray group-hover:text-white"
                  )} />
                  
                  <h3 className={cn(
                    "text-xl font-black mb-2 transition-colors font-headline uppercase",
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
            className="group relative px-12 py-8 text-2xl font-headline font-black uppercase tracking-widest rounded-2xl bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-300 text-brand-black shadow-2xl shadow-brand-gold/40 hover:shadow-brand-gold/60 transition-all hover:scale-105 overflow-hidden border-2 border-transparent"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Play className="w-8 h-8 fill-current" />
              JOGAR AGORA
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
            className="px-8 py-8 text-lg font-bold rounded-2xl border-2 border-brand-gray/30 bg-brand-graphite/50 text-white hover:bg-brand-gray/20 hover:border-brand-gray/50 backdrop-blur-sm transition-all"
            onClick={() => setShowHowToPlay(true)}
          >
            <Waves className="w-5 h-5 mr-2 text-brand-gold" />
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
