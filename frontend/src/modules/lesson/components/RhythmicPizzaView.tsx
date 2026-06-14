import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropPizzaStep } from '@/types/lesson';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export function RhythmicPizzaView({ 
  data, 
  isCompleted, 
  onSuccess, 
  onFail 
}: { 
  data: DragDropPizzaStep, 
  isCompleted: boolean, 
  onSuccess: () => void, 
  onFail: () => void 
}) {
  const [filledSlices, setFilledSlices] = useState(isCompleted ? data.expectedTarget.length : 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const totalSlices = data.expectedTarget.length || 4;
  
  // Track which items have been dropped
  const [droppedItems, setDroppedItems] = useState<number[]>([]);

  useEffect(() => {
    if (isCompleted) {
      setFilledSlices(totalSlices);
    }
  }, [isCompleted, totalSlices]);

  const handleDragEnd = (event: any, info: any, id: number) => {
    if (isCompleted || droppedItems.includes(id)) return;

    if (!targetRef.current) return;
    const targetRect = targetRef.current.getBoundingClientRect();
    
    // Check intersection
    const dropX = info.point.x;
    const dropY = info.point.y;

    // A lenient bounding box check
    const padding = 20;
    if (
      dropX >= targetRect.left - padding &&
      dropX <= targetRect.right + padding &&
      dropY >= targetRect.top - padding &&
      dropY <= targetRect.bottom + padding
    ) {
      const newFilled = filledSlices + 1;
      setFilledSlices(newFilled);
      setDroppedItems([...droppedItems, id]);
      
      if (newFilled === totalSlices) {
        setTimeout(() => onSuccess(), 500);
      }
    }
  };

  const getSliceStyles = (index: number) => {
    const isFilled = index < filledSlices;
    const base = "absolute w-1/2 h-1/2 border border-brand-graphite/20 transition-colors duration-500";
    const bg = isFilled ? "bg-[#2D8A5C]" : "bg-transparent";
    
    switch (index) {
      case 0: return cn(base, bg, "top-0 right-0 rounded-tr-full");
      case 1: return cn(base, bg, "bottom-0 right-0 rounded-br-full");
      case 2: return cn(base, bg, "bottom-0 left-0 rounded-bl-full");
      case 3: return cn(base, bg, "top-0 left-0 rounded-tl-full");
      default: return "";
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto items-center" ref={containerRef}>
      <p className="text-xl md:text-2xl font-medium text-center text-brand-black dark:text-brand-white">
        {data.question}
      </p>

      {/* PIZZA TARGET */}
      <div className="relative w-64 h-64 mt-8 mb-12">
        {/* Label */}
        <div className="absolute -top-12 left-0 right-0 text-center font-bold text-brand-gray text-lg">
          1 Semibreve (Inteiro)
        </div>
        
        <div 
          ref={targetRef}
          className="w-full h-full rounded-full border-4 border-brand-graphite shadow-xl overflow-hidden relative bg-brand-white dark:bg-brand-black"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={getSliceStyles(i)} />
          ))}
          
          {/* Inner circle to make it look like a donut/semibreve slightly */}
          <div className="absolute inset-6 rounded-full border-2 border-brand-graphite/10 pointer-events-none" />
        </div>
      </div>

      {/* DRAGGABLE ITEMS (Semínimas) */}
      <div className="flex flex-wrap justify-center gap-8 min-h-[120px]">
        {data.expectedTarget.map((item, index) => {
          const isDropped = droppedItems.includes(index) || isCompleted;
          
          return (
            <AnimatePresence key={index}>
              {!isDropped && (
                <motion.div
                  drag
                  dragConstraints={containerRef}
                  dragSnapToOrigin={true}
                  onDragEnd={(e, info) => handleDragEnd(e, info, index)}
                  whileHover={{ scale: 1.1 }}
                  whileDrag={{ scale: 1.2, zIndex: 50 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-16 h-24 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  {/* Visual da Semínima */}
                  <div className="w-1 h-16 bg-brand-black dark:bg-brand-white ml-5 rounded-t-sm" />
                  <div className="w-7 h-5 bg-brand-black dark:bg-brand-white rounded-full -rotate-[20deg] -mt-1 shadow-md" />
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* SUCCESS MESSAGE */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-6 bg-[#2D8A5C]/10 border-2 border-[#2D8A5C] rounded-2xl flex flex-col items-center text-center gap-3 w-full max-w-lg"
          >
            <CheckCircle2 className="text-[#2D8A5C]" size={40} />
            <p className="font-bold text-lg text-[#2D8A5C]">
              {data.successMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
