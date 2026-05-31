'use client';

import React, { useState } from 'react';
import { Lesson, TheoryStep, QuizStep, TrueFalseStep } from '@/types/lesson';
import { X, Heart, Star } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  if (!currentStep && !showVictory) return null;

  // Check if current step can be bypassed
  const isTheory = currentStep?.type === 'theory';
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

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Top Bar */}
      <div className="h-16 px-4 md:px-8 flex items-center gap-4 z-50 relative bg-background/90 backdrop-blur">
        <button onClick={onClose} className="p-2 hover:bg-brand-graphite/10 rounded-full transition-colors text-brand-gray">
          <X size={24} />
        </button>
        
        <div className="flex-1 h-4 bg-brand-graphite/10 dark:bg-brand-graphite/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#2D8A5C] rounded-full"
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
      <div className="flex-1 flex flex-col items-center p-6 md:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl flex flex-col flex-1"
          >
            <h2 className="text-3xl font-bold font-headline mb-8 text-center text-brand-black dark:text-brand-white">
                {currentStep.title}
            </h2>
            
            <div className="flex-1 flex flex-col justify-center">
                {currentStep.type === 'theory' && (
                <TheoryView data={currentStep.data as TheoryStep} />
                )}
                
                {currentStep.type === 'quiz' && (
                <QuizView 
                    data={currentStep.data as QuizStep} 
                    isCompleted={completedSteps[currentIndex]}
                    onSuccess={markStepComplete}
                    onFail={loseLife}
                />
                )}
                
                {currentStep.type === 'true_false' && (
                <TrueFalseView 
                    data={currentStep.data as TrueFalseStep} 
                    isCompleted={completedSteps[currentIndex]}
                    onSuccess={markStepComplete}
                    onFail={loseLife}
                />
                )}
                
                {/* Fallback for un-implemented steps */}
                {['match_columns', 'fill_blanks', 'memory_game'].includes(currentStep.type) && (
                <div className="text-center p-8 bg-brand-graphite/10 rounded-2xl border-2 border-dashed border-brand-gray">
                    <p>O desafio do tipo <strong className="uppercase">{currentStep.type}</strong> está em construção.</p>
                    <Button onClick={markStepComplete} variant="outline" className="mt-4 rounded-xl">Pular Desafio (WIP)</Button>
                </div>
                )}
            </div>
            
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Bar (Navigation) */}
      <div className="p-4 md:px-8 md:py-6 border-t border-brand-graphite/20 bg-background flex items-center justify-between gap-4 sticky bottom-0 z-50">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="rounded-2xl font-bold py-6 px-8 text-brand-gray border-brand-graphite/30 hover:bg-brand-graphite/10 text-lg md:min-w-[150px]"
        >
          Voltar
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!isCompleted}
          className={cn(
            "rounded-2xl font-bold py-6 px-8 text-lg min-w-[150px] transition-all",
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
    <div className="prose prose-lg dark:prose-invert max-w-none text-center mx-auto">
      <p className="text-xl leading-relaxed text-brand-black dark:text-brand-white font-body">
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
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <p className="text-xl md:text-2xl font-medium text-center mb-8 text-brand-black dark:text-brand-white">{data.question}</p>
      
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.options.map((opt, index) => {
            const isThisSelected = selected === opt;
            const isThisCorrect = isCompleted && opt === data.correctAnswer;
            const isLastOdd = data.options.length % 2 !== 0 && index === data.options.length - 1;
            
            let btnClass = "border-2 border-brand-graphite/20 bg-background text-brand-black dark:text-brand-white hover:bg-brand-graphite/5 shadow-[0_2px_0_0_rgba(0,0,0,0.1)]";
            
            if (isThisCorrect) {
              btnClass = "border-[#2D8A5C] bg-[#2D8A5C]/10 text-[#2D8A5C] shadow-none";
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
                className={cn("p-4 md:p-6 rounded-2xl text-lg font-semibold text-center transition-all", btnClass, isLastOdd && "md:col-span-2")}
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
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <div className="p-8 md:p-12 bg-brand-graphite/5 rounded-3xl border border-brand-graphite/20 mb-4 shadow-inner">
        <p className="text-2xl font-serif text-center italic text-brand-black dark:text-brand-white">"{data.statement}"</p>
      </div>
      
      <div className="relative">
        <div className="grid gap-4 grid-cols-2">
          <motion.button
            whileTap={!isCompleted ? { scale: 0.95, y: 2 } : {}}
            animate={selected === true && isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            onClick={() => handleSelect(true)}
            disabled={isCompleted}
            className={cn(
              "p-6 rounded-2xl text-xl font-bold text-center transition-all border-2 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]",
              isCompleted && data.isTrue ? "border-[#2D8A5C] bg-[#2D8A5C] text-white shadow-none" 
              : selected === true && isWrong ? "border-red-500 bg-red-500 text-white shadow-none"
              : "border-brand-graphite/20 bg-background hover:bg-brand-graphite/5 text-brand-black dark:text-brand-white"
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
              "p-6 rounded-2xl text-xl font-bold text-center transition-all border-2 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]",
              isCompleted && !data.isTrue ? "border-[#2D8A5C] bg-[#2D8A5C] text-white shadow-none" 
              : selected === false && isWrong ? "border-red-500 bg-red-500 text-white shadow-none"
              : "border-brand-graphite/20 bg-background hover:bg-brand-graphite/5 text-brand-black dark:text-brand-white"
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
