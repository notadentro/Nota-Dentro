import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameplayTutorialOverlayProps {
  step: number; // 0 para semínima, 1 para mínima, 2 para semibreve
  level: number;
}

export function GameplayTutorialOverlay({ step, level }: GameplayTutorialOverlayProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
      >
        <div className="text-center bg-slate-900/90 p-8 rounded-3xl border-2 border-brand-gold shadow-[0_0_50px_rgba(255,215,0,0.3)] max-w-sm w-full mx-4">
          <h2 className="text-brand-gold text-3xl md:text-4xl font-headline font-black mb-4 animate-pulse">
            {level === 3 ? 'Duas Mãos!' : step === 0 ? 'Aperte AGORA!' : step === 1 ? 'Segure um pouco!' : 'Segure AGORA!'}
          </h2>
          <p className="text-white text-lg md:text-xl font-bold mb-2">
            {level === 3 ? 'Aperte as teclas J e F exatamente ao mesmo tempo e segure!' :
             step === 0 
              ? 'Dê um toque rápido para a Semínima.' 
              : step === 1 
              ? 'Mantenha pressionado por 2 tempos para a Mínima.'
              : 'Mantenha pressionado por 4 tempos inteiros!'}
          </p>
          <p className="text-slate-400 text-sm md:text-base mt-6 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <span className="hidden md:inline">Use a tecla <strong className="text-white">J</strong> no teclado.</span>
            <span className="md:hidden">Aperte o <strong>botão direito</strong> na tela.</span>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
