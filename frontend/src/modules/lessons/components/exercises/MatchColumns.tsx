'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MatchColumnsStep } from '@/types/lesson';

interface MatchColumnsProps {
  data: MatchColumnsStep;
  onComplete: (isCorrect: boolean) => void;
}

export function MatchColumns({ data, onComplete }: MatchColumnsProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [leftItems, setLeftItems] = useState<{ id: string; text: string }[]>(() => 
    data.pairs.map((p, i) => ({ id: `pair-${i}`, text: p.left })).sort(() => Math.random() - 0.5)
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rightItems, setRightItems] = useState<{ id: string; text: string }[]>(() => 
    data.pairs.map((p, i) => ({ id: `pair-${i}`, text: p.right })).sort(() => Math.random() - 0.5)
  );
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [errorPair, setErrorPair] = useState<{ left: string; right: string } | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (selectedLeft && selectedRight) {
      // Check if they match
      if (selectedLeft === selectedRight) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMatchedPairs(prev => {
          const newMatched = new Set(prev);
          newMatched.add(selectedLeft);
          if (newMatched.size === data.pairs.length) {
            timeoutId = setTimeout(() => onComplete(true), 500);
          }
          return newMatched;
        });
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        // Mismatch
        setErrorPair({ left: selectedLeft, right: selectedRight });
        timeoutId = setTimeout(() => {
          setErrorPair(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800); // flash red for 800ms
      }
    }
    
    return () => clearTimeout(timeoutId);
  }, [selectedLeft, selectedRight, data.pairs.length, onComplete]);

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      <p className="text-xl md:text-2xl font-bold text-brand-black dark:text-brand-white leading-snug">
        {data.question}
      </p>
      
      <div className="flex justify-between gap-4">
        {/* Left Column */}
        <div className="flex flex-col gap-3 w-1/2">
          {leftItems.map((item) => {
            const isMatched = matchedPairs.has(item.id);
            const isSelected = selectedLeft === item.id;
            const isError = errorPair?.left === item.id;
            
            return (
              <motion.button
                key={`left-${item.id}`}
                disabled={isMatched || selectedLeft !== null}
                onClick={() => setSelectedLeft(item.id)}
                whileHover={!isMatched && !isSelected ? { y: -2 } : {}}
                whileTap={!isMatched ? { y: 2 } : {}}
                className={cn(
                  "p-4 rounded-2xl border-2 font-bold text-base md:text-lg transition-all duration-200 text-center",
                  isMatched ? "border-brand-sand bg-brand-sand/30 text-brand-gray shadow-none opacity-50" :
                  isError ? "border-system-error bg-system-error/10 text-system-error shadow-[0_4px_0_0_#C0392B] animate-pulse" :
                  isSelected ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_4px_0_0_#C9A811]" :
                  "border-brand-sand dark:border-brand-graphite bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white shadow-[0_4px_0_0_#E8E6DF] dark:shadow-[0_4px_0_0_#3A3A3A]"
                )}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3 w-1/2">
          {rightItems.map((item) => {
            const isMatched = matchedPairs.has(item.id);
            const isSelected = selectedRight === item.id;
            const isError = errorPair?.right === item.id;
            
            return (
              <motion.button
                key={`right-${item.id}`}
                disabled={isMatched || selectedRight !== null}
                onClick={() => setSelectedRight(item.id)}
                whileHover={!isMatched && !isSelected ? { y: -2 } : {}}
                whileTap={!isMatched ? { y: 2 } : {}}
                className={cn(
                  "p-4 rounded-2xl border-2 font-bold text-base md:text-lg transition-all duration-200 text-center",
                  isMatched ? "border-brand-sand bg-brand-sand/30 text-brand-gray shadow-none opacity-50" :
                  isError ? "border-system-error bg-system-error/10 text-system-error shadow-[0_4px_0_0_#C0392B] animate-pulse" :
                  isSelected ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_4px_0_0_#C9A811]" :
                  "border-brand-sand dark:border-brand-graphite bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white shadow-[0_4px_0_0_#E8E6DF] dark:shadow-[0_4px_0_0_#3A3A3A]"
                )}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
