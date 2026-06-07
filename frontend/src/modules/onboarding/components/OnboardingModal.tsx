'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Target, BookOpen, Trophy, Compass, Star, GraduationCap, Zap, Music } from 'lucide-react';

type OnboardingStep = 'goal' | 'level' | 'success';

const GOALS = [
  { id: 'esa', label: 'ESA', icon: Trophy, description: 'Sargento do Exército' },
  { id: 'eags', label: 'EAGS', icon: Target, description: 'Sargento da Aeronáutica' },
  { id: 'fuzileiros', label: 'Fuzileiros Navais', icon: Compass, description: 'Sargento da Marinha' },
  { id: 'the', label: 'THE Universitário', icon: GraduationCap, description: 'Vestibular de Música' },
  { id: 'livre', label: 'Estudo Livre', icon: BookOpen, description: 'Aprender sem pressão' },
];

const LEVELS = [
  { id: 'iniciante', label: 'Iniciante', icon: Star, description: 'Estou começando do zero' },
  { id: 'intermediario', label: 'Intermediário', icon: Music, description: 'Já sei ler partituras' },
  { id: 'avancado', label: 'Avançado', icon: Zap, description: 'Domino teoria musical' },
];

export function OnboardingModal() {
  const { completeOnboarding, user } = useUser();
  const [step, setStep] = useState<OnboardingStep>('goal');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleNext = () => {
    if (step === 'goal' && selectedGoal) {
      setStep('level');
    } else if (step === 'level' && selectedLevel) {
      setStep('success');
    }
  };

  const handleComplete = () => {
    completeOnboarding(selectedGoal, selectedLevel);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-brand-black/95 backdrop-blur-md flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 min-h-screen">
        <div className="w-full max-w-2xl relative pb-8">
          <AnimatePresence mode="wait">
          {step === 'goal' && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-white">
                  Bem-vindo(a), {user?.name?.split(' ')[0]}! 👋
                </h2>
                <p className="text-lg text-brand-white/70">
                  Qual é o seu principal objetivo na plataforma?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal === goal.id;
                  
                  return (
                    <Card
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`p-4 cursor-pointer border-2 transition-all hover:-translate-y-1 ${
                        isSelected 
                          ? 'border-brand-gold bg-brand-gold/10' 
                          : 'border-white/10 bg-white/5 hover:border-brand-gold/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${isSelected ? 'bg-brand-gold text-brand-black' : 'bg-white/10 text-brand-gold'}`}>
                          <Icon size={24} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-heading font-bold text-brand-white">{goal.label}</h3>
                          <p className="text-sm text-brand-white/60">{goal.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="pt-8 w-full flex justify-center">
                <Button 
                  onClick={handleNext} 
                  disabled={!selectedGoal}
                  className="w-full md:w-1/2 py-6 text-lg font-bold bg-brand-gold text-brand-black hover:bg-brand-gold/90"
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'level' && (
            <motion.div
              key="level"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-white">
                  Qual o seu nível atual? 🎯
                </h2>
                <p className="text-lg text-brand-white/70">
                  Isso nos ajuda a personalizar sua jornada.
                </p>
              </div>

              <div className="flex flex-col space-y-4 max-w-md mx-auto">
                {LEVELS.map((lvl) => {
                  const Icon = lvl.icon;
                  const isSelected = selectedLevel === lvl.id;
                  
                  return (
                    <Card
                      key={lvl.id}
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`p-4 cursor-pointer border-2 transition-all hover:-translate-y-1 ${
                        isSelected 
                          ? 'border-brand-gold bg-brand-gold/10' 
                          : 'border-white/10 bg-white/5 hover:border-brand-gold/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${isSelected ? 'bg-brand-gold text-brand-black' : 'bg-white/10 text-brand-gold'}`}>
                          <Icon size={24} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-heading font-bold text-brand-white">{lvl.label}</h3>
                          <p className="text-sm text-brand-white/60">{lvl.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="pt-8 flex space-x-4 max-w-md mx-auto w-full">
                <Button 
                  onClick={() => setStep('goal')} 
                  variant="outline"
                  className="w-1/3 py-6 text-lg border-white/20 hover:bg-white/10"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!selectedLevel}
                  className="w-2/3 py-6 text-lg font-bold bg-brand-gold text-brand-black hover:bg-brand-gold/90"
                >
                  Continuar
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-gold/20 text-brand-gold mb-4">
                <Target size={48} />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-white">
                  Tudo Pronto! 🚀
                </h2>
                <p className="text-xl text-brand-white/70 max-w-lg mx-auto">
                  Anotamos suas preferências. Prepare-se para transformar a teoria musical em um jogo viciante.
                </p>
              </div>

              <Button 
                onClick={handleComplete} 
                className="w-full md:w-1/2 py-6 text-xl font-bold bg-brand-gold text-brand-black hover:bg-brand-gold/90 animate-pulse"
              >
                Começar a Jogar
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
