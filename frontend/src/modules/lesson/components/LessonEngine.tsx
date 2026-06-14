'use client';

import React, { useState } from 'react';
import { Lesson, TheoryStep, QuizStep, TrueFalseStep, MemoryGameStep, MatchColumnsStep, FillBlanksStep, SandboxAudioStep, DragDropPautaStep } from '@/types/lesson';
import { X, Heart, Star } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

import { MemoryGameView } from './MemoryGameView';
import { MatchColumnsView } from './MatchColumnsView';
import { FillBlanksView } from './FillBlanksView';
import { SandboxAudioView } from './SandboxAudioView';
import { TeacherBubble } from './TeacherBubble';
import { StaffDragDropView } from './StaffDragDropView';
import { RhythmicPizzaView } from './RhythmicPizzaView';
import { GraphicShowcaseView } from './GraphicShowcaseView';

interface LessonEngineProps {
  lesson: Lesson;
  nextLessonId?: string;
  onClose: () => void;
}

export function LessonEngine({ lesson, nextLessonId, onClose }: LessonEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [showVictory, setShowVictory] = useState(false);
  const { lives, loseLife, completeLesson, restoreLives } = useGamification();

  const currentStep = lesson.steps[currentIndex];
  // Calculate progress safely (avoid dividing by 0)
  const totalSteps = lesson.steps.length;
  const progress = totalSteps > 0 ? (currentIndex / totalSteps) * 100 : 100;

  const handleNext = () => {
    if (currentIndex < totalSteps - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finalize the lesson
      completeLesson(lesson.id, nextLessonId, 50);
      setShowVictory(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const markStepComplete = () => {
    setCompletedSteps(prev => ({ ...prev, [currentIndex]: true }));
  };

  // If there are no steps, just show victory immediately (useful for empty mock lessons)
  React.useEffect(() => {
    if (!currentStep && !showVictory) {
        handleNext();
    }
  }, [currentStep, showVictory]);

  // Trigger fireworks when victory is achieved!
  React.useEffect(() => {
    if (showVictory) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A88A0D', '#F2D349', '#2D8A5C', '#ffffff']
      });
    }
  }, [showVictory]);

  if (!currentStep && !showVictory) return null;

  // Check if current step can be bypassed
  const isTheory = currentStep?.type === 'theory' || currentStep?.type === 'graphic_showcase';
  const isCompleted = isTheory || completedSteps[currentIndex] || !currentStep;

  if (showVictory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-brand-black text-brand-white h-screen">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
          <Star size={80} className="fill-yellow-500 text-yellow-500 mb-6" />
          <h1 className="text-4xl font-bold font-headline mb-4">Lição Concluída!</h1>
          <p className="text-xl mb-8 font-body">+50 XP ganhos!</p>
          <Button onClick={onClose} className="w-full bg-brand-gold text-brand-black hover:bg-yellow-500 text-lg py-6 rounded-2xl font-bold">
            Voltar ao Mapa
          </Button>
        </motion.div>
      </div>
    );
  }

  // Se o aluno ficar sem vidas, mostramos tela de Game Over
  if (lives === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-red-50 text-red-900 h-screen font-body">
        <Heart size={80} className="fill-red-500 text-red-500 mb-6 opacity-50" />
        <h1 className="text-3xl font-bold font-headline mb-4 text-center">Suas vidas acabaram!</h1>
        <p className="mb-8 text-center max-w-md">Os estudos teóricos precisam de energia. Descanse um pouco e volte mais tarde para continuar.</p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button onClick={restoreLives} className="bg-red-500 hover:bg-red-600 text-white rounded-2xl py-6 text-lg font-bold shadow-lg shadow-red-500/30">
            Recuperar Vidas (Testes)
          </Button>
          <Button onClick={onClose} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl py-6 text-lg font-bold">
            Sair da Lição
          </Button>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep.type) {
      case 'theory':
        return <TheoryView data={currentStep.data as TheoryStep} />;
      case 'quiz':
        return <QuizView data={currentStep.data as QuizStep} isCompleted={completedSteps[currentIndex]} onSuccess={markStepComplete} onFail={loseLife} />;
      case 'true_false':
        return <TrueFalseView data={currentStep.data as TrueFalseStep} isCompleted={completedSteps[currentIndex]} onSuccess={markStepComplete} onFail={loseLife} />;
      case 'memory_game':
        return <MemoryGameView data={currentStep.data as MemoryGameStep} isCompleted={completedSteps[currentIndex]} onSuccess={markStepComplete} onFail={loseLife} />;
      case 'match_columns':
        return <MatchColumnsView data={currentStep.data as MatchColumnsStep} isCompleted={completedSteps[currentIndex]} onSuccess={markStepComplete} onFail={loseLife} />;
      case 'fill_blanks':
        return <FillBlanksView data={currentStep.data as FillBlanksStep} isCompleted={completedSteps[currentIndex]} onSuccess={markStepComplete} onFail={loseLife} />;
      case 'sandbox_audio':
        return <SandboxAudioView data={currentStep.data as SandboxAudioStep} isCompleted={completedSteps[currentIndex]} onSuccess={markStepComplete} />;
      case 'drag_drop_pauta':
        return <StaffDragDropView step={currentStep.data as DragDropPautaStep} isCompleted={completedSteps[currentIndex]} onSuccess={markStepComplete} />;
      case 'graphic_showcase':
        return <GraphicShowcaseView data={currentStep.data as any} avatar={currentStep.avatar} onComplete={markStepComplete} isCompleted={completedSteps[currentIndex]} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 px-4 md:px-8 flex items-center gap-4 z-50 relative bg-background/90 backdrop-blur">
        <button onClick={onClose} className="p-2 hover:bg-brand-graphite/10 rounded-full transition-colors text-brand-gray">
          <X size={24} />
        </button>
        
        <div className="flex-1 h-4 bg-brand-graphite/10 dark:bg-brand-graphite/30 rounded-full relative">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-[#2D8A5C] rounded-full shadow-[0_0_15px_#2D8A5C]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center gap-2 font-bold text-red-500 text-lg">
          <Heart size={24} className="fill-red-500" />
          <span>{lives}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center px-4 py-2 md:p-12 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl flex flex-col flex-1"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4 md:mb-8 text-center text-brand-black dark:text-brand-white">
                {currentStep.title}
            </h2>
            
            <div className="flex-1 flex flex-col justify-center">
              {currentStep.avatar && currentStep.type !== 'drag_drop_pizza' && currentStep.type !== 'graphic_showcase' ? (
                <TeacherBubble avatar={currentStep.avatar}>
                  {renderStepContent()}
                </TeacherBubble>
              ) : (
                <div className="text-brand-black dark:text-brand-white w-full">
                  {renderStepContent()}
                </div>
              )}
                {currentStep.type === 'drag_drop_pizza' && (
                <RhythmicPizzaView 
                    data={currentStep.data as any} 
                    isCompleted={completedSteps[currentIndex]}
                    onSuccess={markStepComplete}
                    onFail={loseLife}
                />
                )}
            </div>
            
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Bar (Navigation) */}
      <div className="p-3 md:px-8 md:py-6 border-t border-brand-graphite/20 bg-background flex items-center justify-between gap-4 sticky bottom-0 z-50">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="rounded-2xl font-bold py-4 px-6 md:py-6 md:px-8 text-brand-gray border-brand-graphite/30 hover:bg-brand-graphite/10 text-base md:text-lg min-w-[120px] md:min-w-[150px]"
        >
          Voltar
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!isCompleted}
          className={cn(
            "rounded-2xl font-bold py-4 px-6 md:py-6 md:px-8 text-base md:text-lg min-w-[120px] md:min-w-[150px] transition-all",
            isCompleted 
              ? "bg-[#2D8A5C] hover:bg-green-600 text-white shadow-[0_4px_0_0_#1e5f3f] hover:-translate-y-1 hover:shadow-[0_6px_0_0_#1e5f3f] active:translate-y-1 active:shadow-[0_0px_0_0_#1e5f3f]" 
              : "bg-brand-graphite/20 text-brand-gray cursor-not-allowed border-none shadow-none"
          )}
        >
          {currentIndex === totalSteps - 1 ? 'Finalizar' : 'Avançar'}
        </Button>
      </div>
    </div>
  );
}

// ----- VIEWS ----- //

function TheoryView({ data }: { data: TheoryStep }) {
  return (
    <div className="prose prose-base md:prose-lg max-w-none text-center mx-auto text-inherit">
      <p className="text-lg md:text-xl leading-relaxed text-inherit font-body">
        {/* Usando Regex para transformar **texto** em bold simples caso venha do JSON */}
        {data.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-brand-gold">{part.slice(2, -2)}</strong>;
            }
            return part;
        })}
      </p>
    </div>
  );
}

function QuizView({ data, isCompleted, onSuccess, onFail }: { data: QuizStep, isCompleted: boolean, onSuccess: () => void, onFail: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  const handleSelect = (option: string) => {
    if (isCompleted) return;
    
    setSelected(option);
    if (option === data.correctAnswer) {
      setIsWrong(false);
      onSuccess();
    } else {
      setIsWrong(true);
      onFail();
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-4xl mx-auto">
      <p className="text-lg md:text-2xl font-medium text-center mb-4 md:mb-8 text-inherit">{data.question}</p>
      
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.options.map((opt, index) => {
            const isThisSelected = selected === opt;
            const isThisCorrect = isCompleted && opt === data.correctAnswer;
            const isLastOdd = data.options.length % 2 !== 0 && index === data.options.length - 1;
            
            let btnClass = "border-2 border-border bg-card text-card-foreground shadow-[0_2px_0_0_rgba(0,0,0,0.1)] hover:border-primary/70 hover:shadow-[0_0_15px_rgba(201,168,17,0.3)] hover:-translate-y-1 transition-all duration-300";
            
            if (isThisCorrect) {
              btnClass = "border-[#2D8A5C] bg-[#2D8A5C]/10 text-[#2D8A5C] shadow-[0_0_20px_#2D8A5C] animate-pulse border-4";
            } else if (isThisSelected && isWrong) {
              btnClass = "border-red-500 bg-red-500/10 text-red-500 shadow-none";
            }

            return (
              <motion.button
                key={opt}
                whileTap={!isCompleted ? { scale: 0.98, y: 2, boxShadow: "0 0px 0 0 transparent" } : {}}
                animate={isThisSelected && isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                onClick={() => handleSelect(opt)}
                disabled={isCompleted}
                className={cn("p-3 md:p-6 rounded-2xl text-base md:text-lg font-semibold text-center transition-all", btnClass, isLastOdd && "md:col-span-2")}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
        
        <AnimatePresence>
          {(isCompleted || isWrong) && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className={cn("fixed inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-md", isWrong ? "bg-red-900/10 dark:bg-red-900/40" : "bg-brand-black/10 dark:bg-brand-black/40")}
            >
              <motion.div 
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className={cn("w-[90%] md:w-full max-w-3xl p-6 md:p-10 rounded-3xl shadow-2xl text-center flex flex-col items-center border", isWrong ? "bg-red-50 dark:bg-red-950/90 border-red-200 dark:border-red-900" : "bg-white/90 dark:bg-[#2D8A5C]/40 border-white/50 dark:border-white/20")}
              >
                {isCompleted ? (
                  <>
                    <p className="font-bold text-2xl mb-3 flex items-center justify-center gap-2 text-brand-black dark:text-white">
                      <Star className="fill-[#2D8A5C] text-[#2D8A5C] dark:fill-brand-gold dark:text-brand-gold" size={32} /> 
                      Correto!
                    </p>
                    <p className="text-base md:text-lg text-brand-black dark:text-white/90 font-medium">{data.explanation}</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-2xl mb-3 flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                      <X className="text-red-600 dark:text-red-400" size={32} strokeWidth={3} /> 
                      Incorreto
                    </p>
                    <p className="text-base md:text-lg text-red-800 dark:text-red-200 font-medium mb-6">
                      {selected && data.wrongExplanations?.[selected] ? data.wrongExplanations[selected] : "Essa não é a resposta correta."}
                    </p>
                    <Button onClick={() => { setIsWrong(false); setSelected(null); }} className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-6 font-bold text-lg">
                      Tentar Novamente
                    </Button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TrueFalseView({ data, isCompleted, onSuccess, onFail }: { data: TrueFalseStep, isCompleted: boolean, onSuccess: () => void, onFail: () => void }) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  const handleSelect = (choice: boolean) => {
    if (isCompleted) return;
    
    setSelected(choice);
    if (choice === data.isTrue) {
      setIsWrong(false);
      onSuccess();
    } else {
      setIsWrong(true);
      onFail();
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-lg mx-auto">
      <div className="p-6 md:p-12 bg-brand-graphite/5 rounded-3xl border border-brand-graphite/20 mb-2 md:mb-4 shadow-inner">
        <p className="text-2xl font-serif text-center italic text-inherit">"{data.statement}"</p>
      </div>
      
      <div className="relative">
        <div className="grid gap-4 grid-cols-2">
          <motion.button
            whileTap={!isCompleted ? { scale: 0.95, y: 2 } : {}}
            animate={selected === true && isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            onClick={() => handleSelect(true)}
            disabled={isCompleted}
            className={cn(
              "p-4 md:p-6 rounded-2xl text-lg md:text-xl font-bold text-center transition-all border-2 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]",
              isCompleted && data.isTrue ? "border-[#2D8A5C] bg-[#2D8A5C] text-white shadow-[0_0_20px_#2D8A5C] animate-pulse border-4" 
              : selected === true && isWrong ? "border-red-500 bg-red-500 text-white shadow-none"
              : "border-border bg-card text-card-foreground hover:border-primary/70 hover:shadow-[0_0_15px_rgba(201,168,17,0.3)] hover:-translate-y-1"
            )}
          >
            Verdadeiro
          </motion.button>
          <motion.button
            whileTap={!isCompleted ? { scale: 0.95, y: 2 } : {}}
            animate={selected === false && isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            onClick={() => handleSelect(false)}
            disabled={isCompleted}
            className={cn(
              "p-4 md:p-6 rounded-2xl text-lg md:text-xl font-bold text-center transition-all border-2 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]",
              isCompleted && !data.isTrue ? "border-[#2D8A5C] bg-[#2D8A5C] text-white shadow-[0_0_20px_#2D8A5C] animate-pulse border-4" 
              : selected === false && isWrong ? "border-red-500 bg-red-500 text-white shadow-none"
              : "border-border bg-card text-card-foreground hover:border-primary/70 hover:shadow-[0_0_15px_rgba(201,168,17,0.3)] hover:-translate-y-1"
            )}
          >
            Falso
          </motion.button>
        </div>
        
        <AnimatePresence>
          {(isCompleted || isWrong) && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className={cn("fixed inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-md", isWrong ? "bg-red-900/10 dark:bg-red-900/40" : "bg-brand-black/10 dark:bg-brand-black/40")}
            >
              <motion.div 
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className={cn("w-[90%] md:w-full max-w-3xl p-6 md:p-10 rounded-3xl shadow-2xl text-center flex flex-col items-center border", isWrong ? "bg-red-50 dark:bg-red-950/90 border-red-200 dark:border-red-900" : "bg-white/90 dark:bg-[#2D8A5C]/40 border-white/50 dark:border-white/20")}
              >
                {isCompleted ? (
                  <>
                    <p className="font-bold text-2xl mb-3 flex items-center justify-center gap-2 text-brand-black dark:text-white">
                      <Star className="fill-[#2D8A5C] text-[#2D8A5C] dark:fill-brand-gold dark:text-brand-gold" size={32} /> 
                      Correto!
                    </p>
                    <p className="text-base md:text-lg text-brand-black dark:text-white/90 font-medium">{data.explanation}</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-2xl mb-3 flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                      <X className="text-red-600 dark:text-red-400" size={32} strokeWidth={3} /> 
                      Incorreto
                    </p>
                    <p className="text-base md:text-lg text-red-800 dark:text-red-200 font-medium mb-6">
                      {data.wrongExplanation || "Essa afirmação está incorreta."}
                    </p>
                    <Button onClick={() => { setIsWrong(false); setSelected(null); }} className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-6 font-bold text-lg">
                      Tentar Novamente
                    </Button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
