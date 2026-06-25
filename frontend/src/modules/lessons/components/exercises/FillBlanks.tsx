'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FillBlanksStep } from '@/types/lesson';

interface FillBlanksProps {
  data: FillBlanksStep;
  onComplete: (isCorrect: boolean) => void;
}

export function FillBlanks({ data, onComplete }: FillBlanksProps) {
  const [filledBlanks, setFilledBlanks] = useState<(string | null)[]>(() => new Array(data.blanks.length).fill(null));
  const [availableOptions, setAvailableOptions] = useState<string[]>(() => [...data.options].sort(() => Math.random() - 0.5));
  const [isError, setIsError] = useState(false);

  const handleOptionClick = (option: string) => {
    const firstEmptyIndex = filledBlanks.indexOf(null);
    if (firstEmptyIndex === -1) return; // all full

    const newFilled = [...filledBlanks];
    newFilled[firstEmptyIndex] = option;
    setFilledBlanks(newFilled);
    
    // Remove from available
    setAvailableOptions(prev => {
      const idx = prev.indexOf(option);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  const handleBlankClick = (index: number) => {
    const option = filledBlanks[index];
    if (!option) return;

    // Return to available
    setAvailableOptions(prev => [...prev, option]);
    
    // Remove from filled
    const newFilled = [...filledBlanks];
    newFilled[index] = null;
    setFilledBlanks(newFilled);
    setIsError(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!filledBlanks.includes(null)) {
      // All filled, let's check!
      const isCorrect = filledBlanks.every((val, idx) => val === data.blanks[idx]);
      
      if (isCorrect) {
        timeoutId = setTimeout(() => onComplete(true), 500);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsError(true);
        // Return wrong ones after a delay
        timeoutId = setTimeout(() => {
          setFilledBlanks(prev => {
            const newFilled = [...prev];
            const returnedOptions: string[] = [];
            
            newFilled.forEach((val, idx) => {
              if (val !== data.blanks[idx]) {
                if (val) returnedOptions.push(val);
                newFilled[idx] = null;
              }
            });
            
            setAvailableOptions(opts => [...opts, ...returnedOptions]);
            return newFilled;
          });
          setIsError(false);
        }, 1200);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [filledBlanks, data.blanks, onComplete]);

  // Parse text into segments
  // "O som possui quatro qualidades: {0}, {1}, intensidade e timbre."
  const segments = data.text.split(/(\{\d+\})/g);

  return (
    <div className="flex flex-col gap-6 md:gap-12 w-full h-full justify-center">
      <p className="text-xl md:text-2xl font-bold text-brand-black dark:text-brand-white leading-snug text-center">
        {data.question}
      </p>
      
      {/* TEXT AREA */}
      <div className="text-2xl md:text-3xl leading-loose font-medium text-brand-black dark:text-brand-white text-center flex flex-wrap justify-center items-center gap-y-4 gap-x-2">
        {segments.map((seg, i) => {
          const match = seg.match(/\{(\d+)\}/);
          if (match) {
            const blankIndex = parseInt(match[1], 10);
            const filledWord = filledBlanks[blankIndex];
            
            return (
              <motion.div
                key={`blank-${blankIndex}`}
                onClick={() => handleBlankClick(blankIndex)}
                className={cn(
                  "inline-flex items-center justify-center min-w-[120px] h-12 px-4 border-b-4 mx-1 rounded-xl cursor-pointer transition-all",
                  filledWord ? "bg-brand-gold text-brand-black border-brand-gold shadow-md font-bold" : "bg-brand-sand/30 border-brand-sand border-dashed",
                  isError && filledWord !== data.blanks[blankIndex] ? "bg-system-error text-white border-system-error animate-pulse" : ""
                )}
                whileHover={filledWord && !isError ? { y: -2 } : {}}
              >
                {filledWord || ""}
              </motion.div>
            );
          }
          return <span key={i}>{seg}</span>;
        })}
      </div>

      {/* WORD BANK */}
      <div className="mt-8">
        <div className="flex flex-wrap justify-center gap-3 min-h-[100px] p-6 rounded-3xl bg-brand-sand/20 border-2 border-brand-sand/50">
          <AnimatePresence>
            {availableOptions.map((opt, i) => (
              <motion.button
                key={`${opt}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ y: -4 }}
                whileTap={{ y: 2 }}
                onClick={() => handleOptionClick(opt)}
                className="px-6 py-3 rounded-2xl border-2 border-brand-sand bg-brand-white dark:bg-brand-black dark:border-brand-graphite font-bold text-lg shadow-[0_4px_0_0_#E8E6DF] dark:shadow-[0_4px_0_0_#3A3A3A]"
              >
                {opt}
              </motion.button>
            ))}
          </AnimatePresence>
          
          {availableOptions.length === 0 && !isError && (
            <p className="text-brand-gray font-medium text-lg my-auto">
              Todas as palavras foram usadas!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
