'use client';

import React, { useState, useEffect } from 'react';
import { MemoryGameStep } from '@/types/lesson';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star, X } from 'lucide-react';
import { MusicSymbol, MusicSymbolName } from '@/components/music-symbols';

interface Props {
  data: MemoryGameStep;
  isCompleted: boolean;
  onSuccess: () => void;
  onFail: () => void;
}

interface Card {
  id: string;
  text: string;
  pairId: number;
}

function getSymbolName(text: string): MusicSymbolName | null {
  const t = text.toLowerCase();
  if (t.includes('pausa')) {
    if (t.includes('semibreve')) return 'rest-semibreve';
    if (t.includes('semínima') || t.includes('seminima')) return 'rest-seminima';
    if (t.includes('mínima') || t.includes('minima')) return 'rest-minima';
    if (t.includes('semicolcheia')) return 'rest-semicolcheia';
    if (t.includes('colcheia')) return 'rest-colcheia';
    if (t.includes('semifusa')) return 'rest-semifusa';
    if (t.includes('fusa')) return 'rest-fusa';
  } else {
    if (t.includes('semibreve')) return 'note-semibreve';
    if (t.includes('semínima') || t.includes('seminima')) return 'note-seminima';
    if (t.includes('mínima') || t.includes('minima')) return 'note-minima';
    if (t.includes('semicolcheia')) return 'note-semicolcheia';
    if (t.includes('colcheia')) return 'note-colcheia';
    if (t.includes('semifusa')) return 'note-semifusa';
    if (t.includes('fusa')) return 'note-fusa';
  }
  return null;
}

export function MemoryGameView({ data, isCompleted, onSuccess, onFail }: Props) {
  console.log("MEMORY GAME DATA:", data);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Inicializar o jogo apenas uma vez para não embaralhar a cada re-render
    const allCards: Card[] = [];
    data.pairs.forEach((pair, index) => {
      allCards.push({ id: `a-${index}`, text: pair.item1, pairId: index });
      allCards.push({ id: `b-${index}`, text: pair.item2, pairId: index });
    });
    
    // Embaralhar
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }
    
    setCards(allCards);
    setFlippedIndexes([]);
    setMatchedPairIds([]);
    setIsLocked(false);
  }, [data]);

  const handleCardClick = (index: number) => {
    if (isLocked || isCompleted) return;
    if (flippedIndexes.includes(index)) return;
    if (matchedPairIds.includes(cards[index].pairId)) return;

    const newFlipped = [...flippedIndexes, index];
    setFlippedIndexes(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const card1 = cards[newFlipped[0]];
      const card2 = cards[newFlipped[1]];

      if (card1.pairId === card2.pairId) {
        // Acertou o par
        const newMatched = [...matchedPairIds, card1.pairId];
        setMatchedPairIds(newMatched);
        setFlippedIndexes([]);
        setIsLocked(false);
        
        // Se ganhou
        if (newMatched.length === data.pairs.length) {
          onSuccess();
        }
      } else {
        // Errou o par
        onFail();
        setTimeout(() => {
          setFlippedIndexes([]);
          setIsLocked(false);
        }, 1000); // 1 segundo conforme aprovado pelo usuário
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <p className="text-xl md:text-2xl font-medium text-center mb-4">
        {data?.question}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 perspective-1000">
        {cards.map((card, index) => {
          const isFlipped = flippedIndexes.includes(index) || matchedPairIds.includes(card.pairId) || isCompleted;
          const isMatched = matchedPairIds.includes(card.pairId) || isCompleted;

          return (
            <motion.div
              key={card.id}
              className={cn(
                "relative h-32 md:h-40 w-full cursor-pointer group rounded-2xl",
                isMatched ? "opacity-80" : ""
              )}
              onClick={() => handleCardClick(index)}
              whileHover={!isFlipped && !isLocked ? { scale: 1.05 } : {}}
              whileTap={!isFlipped && !isLocked ? { scale: 0.95 } : {}}
            >
              <motion.div
                className="w-full h-full transition-all duration-500 rounded-2xl"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Costas da Carta */}
                <div 
                  className={cn(
                    "absolute w-full h-full backface-hidden rounded-2xl border-4 shadow-lg flex items-center justify-center text-4xl text-brand-gold/50",
                    "bg-brand-graphite/10 border-brand-graphite/20 dark:bg-brand-graphite/40 dark:border-brand-graphite"
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="font-serif">?</span>
                </div>

                {/* Frente da Carta */}
                <div 
                  className={cn(
                    "absolute w-full h-full backface-hidden rounded-2xl border-4 shadow-xl flex flex-col items-center justify-center p-2 md:p-4 text-center",
                    isMatched 
                      ? "bg-[#2D8A5C]/10 border-[#2D8A5C] text-[#2D8A5C]" 
                      : "bg-white border-brand-gold text-brand-black dark:bg-brand-black dark:text-brand-white"
                  )}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {getSymbolName(card.text) && (
                    <div className="w-12 h-12 md:w-16 md:h-16 mb-2">
                      <MusicSymbol name={getSymbolName(card.text)!} />
                    </div>
                  )}
                  <span className="font-bold text-sm md:text-base lg:text-lg break-words leading-tight">
                    {card.text}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-8 p-6 bg-[#2D8A5C]/10 border border-[#2D8A5C] rounded-3xl flex flex-col items-center text-center"
          >
            <Star className="text-[#2D8A5C] fill-[#2D8A5C] w-12 h-12 mb-4" />
            <p className="text-xl text-[#2D8A5C] font-bold mb-2">Desafio Concluído!</p>
            <p className="opacity-90 font-medium" style={{ color: '#1A1A1A' }}>{data.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
