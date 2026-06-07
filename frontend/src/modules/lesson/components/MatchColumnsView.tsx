'use client';

import React, { useState, useEffect } from 'react';
import { MatchColumnsStep } from '@/types/lesson';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star, Link as LinkIcon, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  data: MatchColumnsStep;
  isCompleted: boolean;
  onSuccess: () => void;
  onFail: () => void;
}

interface ColumnItem {
  id: string;
  text: string;
  pairId: number;
}

export function MatchColumnsView({ data, isCompleted, onSuccess, onFail }: Props) {
  const [leftItems, setLeftItems] = useState<ColumnItem[]>([]);
  const [rightItems, setRightItems] = useState<ColumnItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [errorIds, setErrorIds] = useState<{ left: number, right: number } | null>(null);

  useEffect(() => {
    const left: ColumnItem[] = data.pairs.map((p, i) => ({ id: `L-${i}`, text: p.left, pairId: i }));
    const right: ColumnItem[] = data.pairs.map((p, i) => ({ id: `R-${i}`, text: p.right, pairId: i }));

    // Shuffle left
    for (let i = left.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [left[i], left[j]] = [left[j], left[i]];
    }
    // Shuffle right
    for (let i = right.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [right[i], right[j]] = [right[j], right[i]];
    }

    setLeftItems(left);
    setRightItems(right);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setErrorIds(null);
  }, [data]);

  const handleSelect = (side: 'left' | 'right', pairId: number) => {
    if (isCompleted || matchedPairs.includes(pairId) || errorIds) return;

    if (side === 'left') {
      // Se clicou na mesma esquerda, desmarca
      if (selectedLeft === pairId) setSelectedLeft(null);
      else setSelectedLeft(pairId);
    } else {
      if (selectedRight === pairId) setSelectedRight(null);
      else setSelectedRight(pairId);
    }
  };

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        // Acertou
        const newMatched = [...matchedPairs, selectedLeft];
        setMatchedPairs(newMatched);
        setSelectedLeft(null);
        setSelectedRight(null);
        
        if (newMatched.length === data.pairs.length) {
          onSuccess();
        }
      } else {
        // Errou
        onFail();
        setErrorIds({ left: selectedLeft, right: selectedRight });
        setTimeout(() => {
          setErrorIds(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 1000);
      }
    }
  }, [selectedLeft, selectedRight]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <p className="text-xl md:text-2xl font-medium text-center mb-2 text-brand-black dark:text-brand-white">
        {data.question}
      </p>
      
      <p className="text-sm text-center text-muted-foreground mb-6 flex items-center justify-center gap-2">
        <LinkIcon className="w-4 h-4" /> Selecione um item da esquerda e seu correspondente na direita.
      </p>

      <div className="grid grid-cols-2 gap-4 md:gap-12 relative">
        {/* Coluna Esquerda */}
        <div className="flex flex-col gap-3">
          {leftItems.map((item) => {
            const isMatched = matchedPairs.includes(item.pairId) || isCompleted;
            const isSelected = selectedLeft === item.pairId;
            const isError = errorIds?.left === item.pairId;

            return (
              <motion.button
                key={item.id}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                onClick={() => handleSelect('left', item.pairId)}
                className={cn(
                  "p-4 md:p-6 rounded-2xl text-base md:text-lg font-bold transition-all border-2 text-left shadow-sm",
                  isMatched ? "border-[#2D8A5C] bg-[#2D8A5C]/10 text-[#2D8A5C] opacity-60" 
                  : isError ? "border-red-500 bg-red-500/10 text-red-500"
                  : isSelected ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_0_15px_rgba(242,211,73,0.3)]"
                  : "border-border bg-card text-foreground hover:bg-muted/50 hover:border-brand-gray/50"
                )}
              >
                <div className="flex justify-between items-center">
                  <span>{item.text}</span>
                  {isMatched && <CheckCircle2 className="w-5 h-5 opacity-50" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Coluna Direita */}
        <div className="flex flex-col gap-3">
          {rightItems.map((item) => {
            const isMatched = matchedPairs.includes(item.pairId) || isCompleted;
            const isSelected = selectedRight === item.pairId;
            const isError = errorIds?.right === item.pairId;

            return (
              <motion.button
                key={item.id}
                whileTap={!isMatched ? { scale: 0.98 } : {}}
                animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                onClick={() => handleSelect('right', item.pairId)}
                className={cn(
                  "p-4 md:p-6 rounded-2xl text-base md:text-lg font-bold transition-all border-2 text-right shadow-sm",
                  isMatched ? "border-[#2D8A5C] bg-[#2D8A5C]/10 text-[#2D8A5C] opacity-60" 
                  : isError ? "border-red-500 bg-red-500/10 text-red-500"
                  : isSelected ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-[0_0_15px_rgba(242,211,73,0.3)]"
                  : "border-border bg-card text-foreground hover:bg-muted/50 hover:border-brand-gray/50"
                )}
              >
                <div className="flex justify-between items-center flex-row-reverse">
                  <span>{item.text}</span>
                  {isMatched && <CheckCircle2 className="w-5 h-5 opacity-50" />}
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {/* Connection Line indicator visually if selected Left and waiting for Right */}
        {selectedLeft !== null && selectedRight === null && !isCompleted && !errorIds && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="px-4 py-2 bg-brand-black/80 text-brand-gold rounded-full text-xs font-bold animate-pulse">
              Selecione o correspondente
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-4 p-6 bg-[#2D8A5C]/10 border border-[#2D8A5C] rounded-3xl flex flex-col items-center text-center"
          >
            <Star className="text-[#2D8A5C] fill-[#2D8A5C] w-12 h-12 mb-4" />
            <p className="text-xl text-[#2D8A5C] font-bold mb-2">Conexões Perfeitas!</p>
            <p className="text-brand-black dark:text-white/90">{data.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
