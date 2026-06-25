// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, useAnimation, useDragControls } from 'framer-motion';
import { DragDropPautaStep } from '@/types/lesson';
import { CheckCircle2 } from 'lucide-react';

interface StaffDragDropViewProps {
  step: DragDropPautaStep;
  isCompleted: boolean;
  onSuccess: () => void;
}

export function StaffDragDropView({ step, isCompleted, onSuccess }: StaffDragDropViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [yPos, setYPos] = useState(160); // Inicia no segundo espaço para o aluno mover para o terceiro

  const targetMap: Record<string, number> = {
    'line-5': 60,
    'space-4': 80,
    'line-4': 100,
    'space-3': 120,
    'line-3': 140,
    'space-2': 160,
    'line-2': 180,
    'space-1': 200,
    'line-1': 220,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any, info: any) => {
    if (!containerRef.current || isCompleted) return;
    
    // info.offset.y é a distância percorrida no drag ATUAL
    const newY = yPos + info.offset.y; 
    
    let closestTarget = 'line-3';
    let minDiff = Infinity;
    let snapY = 140;
    
    Object.entries(targetMap).forEach(([target, y]) => {
      const diff = Math.abs(newY - y);
      if (diff < minDiff) {
        minDiff = diff;
        closestTarget = target;
        snapY = y;
      }
    });

    setYPos(snapY);

    if (closestTarget === step.expectedTarget) {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6 bg-white p-6 md:p-8 rounded-3xl border-2 border-brand-graphite/10 shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold font-headline text-center text-brand-black">
        {step.question}
      </h2>

      <div 
        ref={containerRef}
        className="relative w-full h-[300px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden cursor-crosshair"
      >
        {/* Linhas da pauta renderizadas em HTML absoluto garantem 100% de precisão de pixels em qualquer tela */}
        {[60, 100, 140, 180, 220].map((y, i) => (
          <div key={`line-${i}`} className="absolute left-0 right-0 h-1 bg-slate-700" style={{ top: y - 2 }} />
        ))}

        <motion.div
          drag={!isCompleted}
          dragConstraints={containerRef}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          animate={{ y: yPos }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={!isCompleted ? { scale: 1.1 } : {}}
          whileDrag={!isCompleted ? { scale: 1.2, cursor: 'grabbing' } : {}}
          className="absolute z-10 w-11 h-8 cursor-grab left-1/2 -translate-x-1/2"
          style={{ top: 0, marginTop: -16 }} // marginTop ajusta perfeitamente o centro do corpo da nota para o yPos
        >
          {/* Haste (Stem) */}
          <div className="absolute right-0 bottom-3 w-1 h-14 bg-brand-black rounded-t-full" />
          
          {/* Corpo da nota (Notehead) */}
          <div className="absolute inset-0 bg-brand-gold rounded-[50%] border-4 border-brand-black shadow-sm -rotate-[20deg]" />
        </motion.div>
      </div>

      {isCompleted && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-100 text-emerald-800 p-4 rounded-xl flex items-start gap-3 w-full"
        >
          <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
          <p className="font-bold">{step.successMessage}</p>
        </motion.div>
      )}
    </div>
  );
}
