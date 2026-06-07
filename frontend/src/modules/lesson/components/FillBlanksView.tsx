'use client';

import React, { useState, useEffect } from 'react';
import { FillBlanksStep } from '@/types/lesson';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star, CheckCircle2, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  data: FillBlanksStep;
  isCompleted: boolean;
  onSuccess: () => void;
  onFail: () => void;
}

interface WordOption {
  id: string;
  word: string;
  usedInBlankIndex: number | null;
}

export function FillBlanksView({ data, isCompleted, onSuccess, onFail }: Props) {
  const [wordBank, setWordBank] = useState<WordOption[]>([]);
  const [blanksState, setBlanksState] = useState<(string | null)[]>([]);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);

  useEffect(() => {
    // Inicializar word bank e blanks state
    const allWords: WordOption[] = [];
    data.blanks.forEach((word, i) => allWords.push({ id: `b-${i}`, word, usedInBlankIndex: null }));
    data.options?.forEach((word, i) => allWords.push({ id: `o-${i}`, word, usedInBlankIndex: null }));

    // Shuffle
    for (let i = allWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
    }

    setWordBank(allWords);
    setBlanksState(new Array(data.blanks.length).fill(null));
    setSelectedWordId(null);
    setErrorIndexes([]);
  }, [data]);

  const handleWordBankClick = (id: string) => {
    if (isCompleted) return;
    
    // Se a palavra já está usada em uma lacuna, remove-a da lacuna
    const wordIndex = wordBank.findIndex(w => w.id === id);
    if (wordIndex === -1) return;
    
    if (wordBank[wordIndex].usedInBlankIndex !== null) {
      const blankIdx = wordBank[wordIndex].usedInBlankIndex!;
      
      const newBlanks = [...blanksState];
      newBlanks[blankIdx] = null;
      setBlanksState(newBlanks);
      
      const newBank = [...wordBank];
      newBank[wordIndex].usedInBlankIndex = null;
      setWordBank(newBank);
      
      // Limpar erro se houver
      setErrorIndexes(prev => prev.filter(i => i !== blankIdx));
      setSelectedWordId(null);
      return;
    }

    // Se não está usada, seleciona ou deseleciona
    if (selectedWordId === id) {
      setSelectedWordId(null);
    } else {
      setSelectedWordId(id);
    }
  };

  const handleBlankClick = (blankIndex: number) => {
    if (isCompleted) return;

    // Se clicou na lacuna e ela já tem uma palavra, devolve a palavra pro banco
    if (blanksState[blankIndex] !== null) {
      const usedWordId = blanksState[blankIndex];
      
      const newBlanks = [...blanksState];
      newBlanks[blankIndex] = null;
      setBlanksState(newBlanks);
      
      const newBank = [...wordBank];
      const wIdx = newBank.findIndex(w => w.id === usedWordId);
      if (wIdx !== -1) newBank[wIdx].usedInBlankIndex = null;
      setWordBank(newBank);
      
      setErrorIndexes(prev => prev.filter(i => i !== blankIndex));
      return;
    }

    // Se há uma palavra selecionada no banco, coloca na lacuna
    if (selectedWordId) {
      const newBlanks = [...blanksState];
      newBlanks[blankIndex] = selectedWordId;
      setBlanksState(newBlanks);

      const newBank = [...wordBank];
      const wIdx = newBank.findIndex(w => w.id === selectedWordId);
      if (wIdx !== -1) newBank[wIdx].usedInBlankIndex = blankIndex;
      setWordBank(newBank);

      setSelectedWordId(null);
      setErrorIndexes(prev => prev.filter(i => i !== blankIndex));
    }
  };

  const verifyAnswers = () => {
    let allCorrect = true;
    const errors: number[] = [];

    blanksState.forEach((wordId, index) => {
      const wordObj = wordBank.find(w => w.id === wordId);
      // Aqui validamos comparando o texto ou a id? Comparamos o texto para evitar problemas se houver palavras repetidas idênticas
      if (!wordObj || wordObj.word.toLowerCase() !== data.blanks[index].toLowerCase()) {
        allCorrect = false;
        errors.push(index);
      }
    });

    if (allCorrect) {
      onSuccess();
    } else {
      onFail();
      setErrorIndexes(errors);
    }
  };

  const isAllFilled = blanksState.every(b => b !== null);

  // Parser do texto base para injetar as lacunas interativas
  const renderTextWithBlanks = () => {
    const parts = data.text.split(/(\{\d+\})/g);
    
    return parts.map((part, index) => {
      const match = part.match(/\{(\d+)\}/);
      if (match) {
        const blankIndex = parseInt(match[1]);
        const wordId = blanksState[blankIndex];
        const wordObj = wordId ? wordBank.find(w => w.id === wordId) : null;
        const isError = errorIndexes.includes(blankIndex);
        
        return (
          <span key={index} className="inline-block mx-1 align-middle">
            <motion.button
              whileTap={!isCompleted ? { scale: 0.95 } : {}}
              animate={isError ? { x: [-3, 3, -3, 3, 0] } : {}}
              onClick={() => handleBlankClick(blankIndex)}
              className={cn(
                "h-10 min-w-[100px] px-4 rounded-xl border-b-4 border-2 font-bold transition-all text-sm md:text-base inline-flex items-center justify-center",
                wordObj 
                  ? isCompleted 
                    ? "bg-[#2D8A5C] border-[#2D8A5C] text-white" 
                    : isError 
                      ? "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-brand-gold/20 border-brand-gold text-brand-black dark:text-brand-gold dark:bg-brand-gold/10"
                  : "bg-muted border-dashed border-muted-foreground/50 text-muted-foreground/50"
              )}
              disabled={isCompleted}
            >
              {wordObj ? wordObj.word : "___"}
            </motion.button>
          </span>
        );
      }
      // Return normal text
      return <span key={index} className="text-lg md:text-xl font-body leading-relaxed">{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <p className="text-xl md:text-2xl font-medium text-center text-brand-black dark:text-brand-white">
        {data.question}
      </p>

      {/* Caixa de Texto com Lacunas */}
      <div className="bg-card border-2 border-border p-6 md:p-10 rounded-3xl shadow-sm text-center leading-[3]">
        {renderTextWithBlanks()}
      </div>

      {/* Banco de Palavras */}
      {!isCompleted && (
        <div className="bg-muted/30 p-6 rounded-3xl border border-border">
          <p className="text-sm font-bold text-muted-foreground mb-4 text-center">Banco de Palavras</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {wordBank.map((item) => {
              const isUsed = item.usedInBlankIndex !== null;
              const isSelected = selectedWordId === item.id;

              return (
                <motion.button
                  key={item.id}
                  whileHover={!isUsed && !isCompleted ? { y: -2 } : {}}
                  whileTap={!isCompleted ? { scale: 0.95 } : {}}
                  onClick={() => handleWordBankClick(item.id)}
                  className={cn(
                    "px-4 py-2 rounded-xl border-2 font-bold transition-all text-sm md:text-base",
                    isUsed ? "opacity-30 border-dashed border-muted-foreground bg-transparent text-muted-foreground"
                    : isSelected ? "border-brand-gold bg-brand-gold text-brand-black shadow-lg"
                    : "border-border bg-card text-foreground hover:border-brand-gold hover:text-brand-gold shadow-sm"
                  )}
                  disabled={isCompleted}
                >
                  {item.word}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Botão de Verificar */}
      {!isCompleted && isAllFilled && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
          <Button 
            onClick={verifyAnswers}
            className="bg-[#2D8A5C] hover:bg-green-600 text-white rounded-2xl py-6 px-12 font-bold text-lg shadow-[0_4px_0_0_#1e5f3f] active:shadow-none active:translate-y-1 transition-all"
          >
            Verificar Respostas
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-2 p-6 bg-[#2D8A5C]/10 border border-[#2D8A5C] rounded-3xl flex flex-col items-center text-center"
          >
            <CheckCircle2 className="text-[#2D8A5C] w-12 h-12 mb-4" />
            <p className="text-xl text-[#2D8A5C] font-bold mb-2">Frase Completa!</p>
            <p className="text-brand-black dark:text-white/90">{data.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
