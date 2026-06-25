'use client';

import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MemoryGameStep } from '@/types/lesson';

interface MemoryGameProps {
  data: MemoryGameStep;
  onComplete: (isCorrect: boolean) => void;
}

interface Card {
  id: string; // unique
  matchId: string; // pairs share the same matchId
  text: string;
}

export function MemoryGame({ data, onComplete }: MemoryGameProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cards, setCards] = useState<Card[]>(() => {
    const newCards: Card[] = [];
    data.pairs.forEach((p, i) => {
      newCards.push({ id: `c-${i}-1`, matchId: `m-${i}`, text: p.item1 });
      newCards.push({ id: `c-${i}-2`, matchId: `m-${i}`, text: p.item2 });
    });
    newCards.sort(() => Math.random() - 0.5);
    return newCards;
  });
  
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedMatchIds, setMatchedMatchIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let timeoutId1: NodeJS.Timeout;
    let timeoutId2: NodeJS.Timeout;
    
    if (flippedIds.length === 2) {
      const card1 = cards.find(c => c.id === flippedIds[0]);
      const card2 = cards.find(c => c.id === flippedIds[1]);

      if (card1 && card2 && card1.matchId === card2.matchId) {
        // Match!
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMatchedMatchIds(prev => {
          const newMatched = new Set(prev);
          newMatched.add(card1.matchId);
          if (newMatched.size === data.pairs.length) {
            timeoutId1 = setTimeout(() => onComplete(true), 600);
          }
          return newMatched;
        });
        setFlippedIds([]);
      } else {
        // Mismatch - wait then flip back
        timeoutId2 = setTimeout(() => {
          setFlippedIds([]);
        }, 1000);
      }
    }
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, [flippedIds, cards, data.pairs.length, onComplete]);

  const handleCardClick = (id: string) => {
    if (flippedIds.length === 2) return;
    if (flippedIds.includes(id)) return;
    
    const card = cards.find(c => c.id === id);
    if (card && matchedMatchIds.has(card.matchId)) return;

    setFlippedIds([...flippedIds, id]);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      <p className="text-xl md:text-2xl font-bold text-brand-black dark:text-brand-white leading-snug">
        {data?.question}
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id) || matchedMatchIds.has(card.matchId);
          const isMatched = matchedMatchIds.has(card.matchId);
          
          return (
            <div key={card.id} className="relative w-full aspect-square" style={{ perspective: 1000 }}>
              <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {/* BACK OF CARD (Hidden when flipped) */}
                <div 
                  className="absolute w-full h-full backface-hidden rounded-2xl border-2 border-brand-sand bg-brand-sand/30 cursor-pointer shadow-[0_4px_0_0_#E8E6DF] active:translate-y-[4px] active:shadow-none transition-all"
                  onClick={() => handleCardClick(card.id)}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-full h-full flex items-center justify-center text-brand-gold/50 font-headline font-bold text-3xl">
                    ?
                  </div>
                </div>

                {/* FRONT OF CARD (Visible when flipped) */}
                <div 
                  className={cn(
                    "absolute w-full h-full rounded-2xl border-2 flex items-center justify-center p-4 text-center font-bold text-lg leading-tight",
                    isMatched ? "border-system-success bg-system-success/10 text-system-success shadow-[0_4px_0_0_#2D8A5C]" : "border-brand-gold bg-brand-white text-brand-black shadow-[0_4px_0_0_#C9A811]"
                  )}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {card.text}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
