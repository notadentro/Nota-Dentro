'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lesson, QuizStep, TheoryStep, TrueFalseStep, MatchColumnsStep, MemoryGameStep, FillBlanksStep } from '@/types/lesson';
import { Progress } from '@/components/ui/progress';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { X, Check, AlertCircle, Volume2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { MatchColumns } from './exercises/MatchColumns';
import { MemoryGame } from './exercises/MemoryGame';
import { FillBlanks } from './exercises/FillBlanks';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useUser } from '@/contexts/UserContext';
import { useRef } from 'react';

interface LessonEngineProps {
  lesson: Lesson;
}

export function LessonEngine({ lesson }: LessonEngineProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { addXP } = useUser();
  const hasAwardedXP = useRef(false);

  const steps = lesson.steps;
  const isFinished = currentIndex >= steps.length;
  const progress = isFinished ? 100 : (currentIndex / steps.length) * 100;

  useEffect(() => {
    if (isFinished) {
      if (!hasAwardedXP.current) {
        addXP(50); // Provide 50 XP per lesson completion
        hasAwardedXP.current = true;
      }
      // Golden fireworks!
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 45, spread: 360, ticks: 60, zIndex: 100, colors: ['#C9A811', '#EDD033', '#A88A0D', '#F8F6F0', '#E8E6DF'] };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);
        // Fireworks from the sides
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      // Huge burst from bottom center
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.9 },
        colors: ['#C9A811', '#EDD033', '#A88A0D', '#F8F6F0'],
        startVelocity: 80, // shoot up high!
        zIndex: 100,
      });

      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <h2 className="text-2xl font-headline mb-4">Lição em Construção</h2>
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-brand-gold text-brand-black font-bold rounded-xl shadow-[0_4px_0_0_#A88A0D] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#A88A0D] active:translate-y-[4px] active:shadow-none transition-all"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center bg-brand-white dark:bg-brand-black overflow-hidden relative">
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
          className="w-32 h-32 bg-system-success/20 rounded-full flex items-center justify-center mb-6 text-system-success"
        >
          <Check size={80} strokeWidth={3} />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-headline font-extrabold text-brand-gold mb-4"
        >
          Lição Concluída!
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-brand-gray mb-12 font-medium"
        >
          Você mandou super bem e ganhou <span className="text-brand-gold font-bold">+10 XP</span>!
        </motion.p>
        
        <motion.button 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: 'spring' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full max-w-sm bg-brand-gold text-brand-black font-extrabold text-xl py-4 rounded-2xl shadow-[0_6px_0_0_#A88A0D] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#A88A0D] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-wide"
          onClick={() => router.push('/dashboard')}
        >
          Continuar
        </motion.button>
      </div>
    );
  }

  const currentStep = steps[currentIndex];
  const isMultipleChoice = currentStep.type === 'quiz';
  const isTrueFalse = currentStep.type === 'true_false';
  const isMatchColumns = currentStep.type === 'match_columns';
  const isMemoryGame = currentStep.type === 'memory_game';
  const isFillBlanks = currentStep.type === 'fill_blanks';
  
  const isInteractive = isMultipleChoice || isTrueFalse; // Require explicit "Verify" click
  const isAdvancedGame = isMatchColumns || isMemoryGame || isFillBlanks; // Self-verifying
  
  const quizData = isMultipleChoice ? (currentStep.data as QuizStep) : null;
  const trueFalseData = isTrueFalse ? (currentStep.data as TrueFalseStep) : null;
  const matchColumnsData = isMatchColumns ? (currentStep.data as MatchColumnsStep) : null;
  const memoryGameData = isMemoryGame ? (currentStep.data as MemoryGameStep) : null;
  const fillBlanksData = isFillBlanks ? (currentStep.data as FillBlanksStep) : null;
  const theoryData = currentStep.type === 'theory' ? (currentStep.data as TheoryStep) : null;

  const handleNext = () => {
    if (isInteractive && !isChecking) {
      if (!selectedOption) return;
      
      let correct = false;
      if (isMultipleChoice) {
        correct = selectedOption === quizData?.correctAnswer;
      } else if (isTrueFalse) {
        correct = selectedOption === (trueFalseData?.isTrue ? 'true' : 'false');
      }
      
      setIsCorrect(correct);
      setIsChecking(true);
      return;
    }

    // Next step
    setSelectedOption(null);
    setIsChecking(false);
    setIsCorrect(null);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleAdvancedGameComplete = (correct: boolean) => {
    if (correct) {
      setIsCorrect(true);
      setIsChecking(true);
    }
  };

  // 3D Button style helper
  const getOptionStyle = (option: string) => {
    const isSelected = selectedOption === option;
    
    let isCorrectOption = false;
    if (isMultipleChoice) isCorrectOption = isChecking && option === quizData?.correctAnswer;
    if (isTrueFalse) isCorrectOption = isChecking && option === (trueFalseData?.isTrue ? 'true' : 'false');
    
    const isWrongSelected = isChecking && isSelected && !isCorrect;

    if (isCorrectOption) {
      return "border-system-success bg-system-success/10 text-system-success shadow-[0_4px_0_0_#2D8A5C] translate-y-[-2px]";
    }
    if (isWrongSelected) {
      return "border-system-error bg-system-error/10 text-system-error shadow-[0_4px_0_0_#C0392B] translate-y-[-2px] opacity-70";
    }
    if (isSelected && !isChecking) {
      return "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_4px_0_0_#C9A811] translate-y-[-2px]";
    }
    
    // Default
    return "border-brand-sand dark:border-brand-graphite bg-transparent text-brand-black dark:text-brand-white shadow-[0_4px_0_0_#E8E6DF] dark:shadow-[0_4px_0_0_#3A3A3A] hover:bg-brand-sand/30 dark:hover:bg-brand-graphite/30 translate-y-[-2px]";
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-brand-white dark:bg-brand-black font-body selection:bg-brand-gold/30 pb-48">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-brand-white dark:bg-brand-black flex items-center gap-3 md:gap-4 p-4 md:p-6 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => router.push('/dashboard')} 
          className="text-brand-gray hover:text-brand-black dark:hover:text-brand-white transition-colors"
        >
          <X size={28} className="md:w-[32px] md:h-[32px]" strokeWidth={2.5} />
        </button>
        <div className="flex-1 relative h-4 overflow-hidden rounded-full">
          <Progress value={progress} className="h-full bg-brand-sand dark:bg-brand-graphite [&>div]:bg-system-success shadow-inner" />
          
          {/* Wrapper to clip the shine exactly to the current progress */}
          <div 
            className="absolute top-0 left-0 bottom-0 overflow-hidden rounded-full pointer-events-none transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            {/* Animated Sweep (Shine) Effect - Gold */}
            <div 
              className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-brand-gold/80 to-transparent skew-x-[-20deg] animate-sweep"
            />
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 md:px-6 py-4 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex-1 flex flex-col justify-center min-h-[50vh]"
          >
            
            <h2 className="text-2xl md:text-4xl font-headline font-extrabold mb-6 md:mb-8 text-brand-black dark:text-brand-white leading-tight">
              {currentStep.title}
            </h2>

            {/* THEORY STEP */}
            {theoryData && (
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="p-5 md:p-8 bg-brand-sand/30 dark:bg-brand-graphite/30 rounded-2xl md:rounded-3xl border-2 border-brand-sand dark:border-brand-graphite relative overflow-hidden">
                  
                  {/* Decorative Icon */}
                  <div className="absolute -top-4 -right-4 text-brand-gold/10 pointer-events-none">
                    <MusicIcon size={100} className="md:w-[120px] md:h-[120px]" />
                  </div>

                  <p className="text-lg md:text-2xl leading-relaxed text-brand-black dark:text-brand-white relative z-10">
                    {theoryData.content.split('**').map((text, i) => 
                      i % 2 === 1 ? <span key={i} className="text-brand-gold font-bold">{text}</span> : text
                    )}
                  </p>
                </div>

                {/* Optional Audio/Image feature ready for the future */}
                <div className="flex justify-center mt-2">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-lg cursor-not-allowed opacity-50"
                    title="Em breve!"
                  >
                    <Volume2 size={24} /> Ouvir Exemplo
                  </motion.button>
                </div>
              </div>
            )}

            {/* QUIZ STEP */}
            {quizData && (
              <div className="flex flex-col gap-6 md:gap-8 w-full">
                <p className="text-2xl md:text-3xl font-bold text-brand-black dark:text-brand-white leading-snug">
                  {quizData.question}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                  {quizData.options.map((option, idx) => {
                    const isActive = selectedOption === option;
                    
                    return (
                      <motion.button
                        key={option}
                        disabled={isChecking}
                        onClick={() => setSelectedOption(option)}
                        whileHover={!isChecking && !isActive ? { y: -4 } : {}}
                        whileTap={!isChecking ? { y: 2, boxShadow: "0 0px 0 0 transparent" } : {}}
                        className={cn(
                          "relative p-5 rounded-2xl border-2 text-left font-bold text-lg md:text-xl transition-colors duration-200",
                          getOptionStyle(option)
                        )}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TRUE / FALSE STEP */}
            {trueFalseData && (
              <div className="flex flex-col gap-6 md:gap-8 w-full">
                <p className="text-2xl md:text-3xl font-bold text-brand-black dark:text-brand-white leading-snug">
                  {trueFalseData.statement}
                </p>
                
                <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4">
                  <motion.button
                    disabled={isChecking}
                    onClick={() => setSelectedOption('true')}
                    whileHover={!isChecking && selectedOption !== 'true' ? { y: -4 } : {}}
                    whileTap={!isChecking ? { y: 2, boxShadow: "0 0px 0 0 transparent" } : {}}
                    className={cn(
                      "flex flex-col items-center justify-center gap-4 py-8 md:py-12 rounded-3xl border-2 font-bold text-xl md:text-2xl transition-colors duration-200",
                      getOptionStyle('true')
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-full border-2",
                      selectedOption === 'true' && !isChecking ? "border-brand-gold bg-brand-gold/20" : 
                      isChecking && trueFalseData.isTrue ? "border-system-success bg-system-success/20" : 
                      isChecking && !trueFalseData.isTrue && selectedOption === 'true' ? "border-system-error bg-system-error/20" :
                      "border-brand-sand dark:border-brand-graphite bg-brand-sand/10 dark:bg-brand-graphite/10"
                    )}>
                      <ThumbsUp size={48} strokeWidth={2.5} />
                    </div>
                    Verdadeiro
                  </motion.button>

                  <motion.button
                    disabled={isChecking}
                    onClick={() => setSelectedOption('false')}
                    whileHover={!isChecking && selectedOption !== 'false' ? { y: -4 } : {}}
                    whileTap={!isChecking ? { y: 2, boxShadow: "0 0px 0 0 transparent" } : {}}
                    className={cn(
                      "flex flex-col items-center justify-center gap-4 py-8 md:py-12 rounded-3xl border-2 font-bold text-xl md:text-2xl transition-colors duration-200",
                      getOptionStyle('false')
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-full border-2",
                      selectedOption === 'false' && !isChecking ? "border-brand-gold bg-brand-gold/20" : 
                      isChecking && !trueFalseData.isTrue ? "border-system-success bg-system-success/20" : 
                      isChecking && trueFalseData.isTrue && selectedOption === 'false' ? "border-system-error bg-system-error/20" :
                      "border-brand-sand dark:border-brand-graphite bg-brand-sand/10 dark:bg-brand-graphite/10"
                    )}>
                      <ThumbsDown size={48} strokeWidth={2.5} />
                    </div>
                    Falso
                  </motion.button>
                </div>
              </div>
            )}

            {/* ADVANCED EXERCISES */}
            {isMatchColumns && matchColumnsData && (
              <MatchColumns data={matchColumnsData} onComplete={handleAdvancedGameComplete} />
            )}
            
            {isMemoryGame && memoryGameData && (
              <MemoryGame data={memoryGameData} onComplete={handleAdvancedGameComplete} />
            )}
            
            {isFillBlanks && fillBlanksData && (
              <FillBlanks data={fillBlanksData} onComplete={handleAdvancedGameComplete} />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* BOTTOM FOOTER (Action & Feedback) */}
      <motion.footer 
        layout
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 border-t-2 px-6 py-4 md:py-6 transition-colors duration-300",
          !isChecking ? "bg-brand-white dark:bg-brand-black border-brand-sand dark:border-brand-graphite" : 
          isCorrect ? "bg-[#F0FAF5] dark:bg-system-success/15 border-system-success" : "bg-[#FDF4F4] dark:bg-system-error/15 border-system-error"
        )}
      >
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-4 md:gap-6">
          
          {/* Feedback Content (Only rendered when checking) */}
          <AnimatePresence>
            {isChecking && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-start gap-4 overflow-hidden"
              >
                <motion.div 
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
                  className={cn(
                    "p-3 rounded-full flex-shrink-0 mt-1",
                    isCorrect ? "bg-system-success text-white" : "bg-system-error text-white"
                  )}
                >
                  {isCorrect ? <Check size={32} strokeWidth={3} /> : <X size={32} strokeWidth={3} />}
                </motion.div>

                <div className="flex flex-col gap-1">
                  <h3 className={cn(
                    "font-headline font-extrabold text-2xl md:text-3xl",
                    isCorrect ? "text-system-success" : "text-system-error"
                  )}>
                    {isCorrect ? 'Você acertou!' : 'Quase lá!'}
                  </h3>
                  <p className={cn(
                    "text-base md:text-lg font-medium",
                    isCorrect ? "text-system-success/80" : "text-system-error/80"
                  )}>
                    {isMultipleChoice ? quizData?.explanation : 
                     isTrueFalse ? trueFalseData?.explanation : 
                     isMatchColumns ? matchColumnsData?.explanation : 
                     isMemoryGame ? memoryGameData?.explanation : 
                     isFillBlanks ? fillBlanksData?.explanation : ''}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <div className="flex w-full justify-end">
            <button 
              disabled={(isInteractive && !selectedOption && !isChecking) || (isAdvancedGame && !isChecking)}
              onClick={handleNext}
              className={cn(
                "w-full md:w-auto min-w-[200px] font-extrabold text-xl py-4 px-8 rounded-2xl uppercase tracking-wider transition-all",
                (!isInteractive || selectedOption) && !isChecking && !isAdvancedGame ? "bg-brand-gold text-brand-black shadow-[0_6px_0_0_#A88A0D] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#A88A0D] active:translate-y-[6px] active:shadow-none" : "",
                (isInteractive && !selectedOption && !isChecking) || (isAdvancedGame && !isChecking) ? "bg-brand-sand dark:bg-brand-graphite text-brand-gray cursor-not-allowed shadow-[0_6px_0_0_#D1CFC7] dark:shadow-[0_6px_0_0_#2A2A2A]" : "",
                isChecking && isCorrect ? "bg-system-success text-white shadow-[0_6px_0_0_#1E6240] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#1E6240] active:translate-y-[6px] active:shadow-none" : "",
                isChecking && !isCorrect ? "bg-system-error text-white shadow-[0_6px_0_0_#962D22] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#962D22] active:translate-y-[6px] active:shadow-none" : ""
              )}
            >
              {isChecking ? 'Continuar' : 'Verificar'}
            </button>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

// Simple decorative icon component for the theory card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MusicIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
