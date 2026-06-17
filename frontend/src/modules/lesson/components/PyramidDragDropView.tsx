import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropPyramidStep } from '@/types/lesson';
import { CheckCircle2 } from 'lucide-react';
import { TeacherBubble } from './TeacherBubble';
import { MusicSymbol, MusicSymbolName } from '@/components/music-symbols';

const RHYTHM_HIERARCHY = [
  { id: 'semibreve', name: 'Semibreve', plural: 'Semibreves', icon: 'note-semibreve' },
  { id: 'minima', name: 'Mínima', plural: 'Mínimas', icon: 'note-minima' },
  { id: 'seminima', name: 'Semínima', plural: 'Semínimas', icon: 'note-seminima' },
  { id: 'colcheia', name: 'Colcheia', plural: 'Colcheias', icon: 'note-colcheia' },
  { id: 'semicolcheia', name: 'Semicolcheia', plural: 'Semicolcheias', icon: 'note-semicolcheia' },
  { id: 'fusa', name: 'Fusa', plural: 'Fusas', icon: 'note-fusa' },
  { id: 'semifusa', name: 'Semifusa', plural: 'Semifusas', icon: 'note-semifusa' },
];

const getPyramidLevels = (baseNodeId?: string) => {
  const baseIndex = RHYTHM_HIERARCHY.findIndex(h => h.id === baseNodeId);
  const safeIndex = baseIndex === -1 ? 0 : baseIndex;

  return {
    level1: RHYTHM_HIERARCHY[safeIndex],
    level2: RHYTHM_HIERARCHY[Math.min(safeIndex + 1, RHYTHM_HIERARCHY.length - 1)],
    level3: RHYTHM_HIERARCHY[Math.min(safeIndex + 2, RHYTHM_HIERARCHY.length - 1)],
  };
};

export function PyramidDragDropView({ 
  data, 
  isCompleted, 
  avatar,
  onSuccess, 
  onFail 
}: { 
  data: DragDropPyramidStep, 
  isCompleted: boolean, 
  avatar?: string,
  onSuccess: () => void, 
  onFail: () => void 
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const levels = getPyramidLevels(data.baseNode);

  // Track which items have been dropped in which slots
  const [level2Filled, setLevel2Filled] = useState<number>(isCompleted ? data.expectedTarget.level_2.length : 0);
  const [level3Filled, setLevel3Filled] = useState<number>(isCompleted ? data.expectedTarget.level_3.length : 0);

  const [availableItems, setAvailableItems] = useState<string[]>(
    isCompleted ? [] : [
      ...data.expectedTarget.level_2,
      ...data.expectedTarget.level_3
    ]
  );

  const level2Refs = useRef<(HTMLDivElement | null)[]>([]);
  const level3Refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isCompleted) {
      setLevel2Filled(data.expectedTarget.level_2.length);
      setLevel3Filled(data.expectedTarget.level_3.length);
      setAvailableItems([]);
    }
  }, [isCompleted, data.expectedTarget]);

  const handleDragEnd = (event: any, info: any, itemName: string, itemIndex: number) => {
    if (isCompleted) return;

    let dropped = false;
    const dropX = info.point.x;
    const dropY = info.point.y;
    const padding = 30;

    // Check level 2 if item matches level 2 type
    if (itemName === levels.level2.id && level2Filled < data.expectedTarget.level_2.length) {
      // Find an empty level 2 slot
      const targetSlot = level2Refs.current[level2Filled];
      if (targetSlot) {
        const rect = targetSlot.getBoundingClientRect();
        const targetX = rect.left + window.scrollX;
        const targetY = rect.top + window.scrollY;
        
        if (dropX >= targetX - padding && dropX <= targetX + rect.width + padding &&
            dropY >= targetY - padding && dropY <= targetY + rect.height + padding) {
          
          const newFilled = level2Filled + 1;
          setLevel2Filled(newFilled);
          dropped = true;
          
          if (newFilled === data.expectedTarget.level_2.length && level3Filled === data.expectedTarget.level_3.length) {
            setTimeout(() => onSuccess(), 500);
          }
        }
      }
    }

    // Check level 3 if item matches level 3 type
    if (!dropped && itemName === levels.level3.id && level3Filled < data.expectedTarget.level_3.length) {
      const targetSlot = level3Refs.current[level3Filled];
      if (targetSlot) {
        const rect = targetSlot.getBoundingClientRect();
        const targetX = rect.left + window.scrollX;
        const targetY = rect.top + window.scrollY;
        
        if (dropX >= targetX - padding && dropX <= targetX + rect.width + padding &&
            dropY >= targetY - padding && dropY <= targetY + rect.height + padding) {
          
          const newFilled = level3Filled + 1;
          setLevel3Filled(newFilled);
          dropped = true;
          
          if (level2Filled === data.expectedTarget.level_2.length && newFilled === data.expectedTarget.level_3.length) {
            setTimeout(() => onSuccess(), 500);
          }
        }
      }
    }

    if (dropped) {
      // Remove from available items
      const newItems = [...availableItems];
      newItems.splice(itemIndex, 1);
      setAvailableItems(newItems);
    }
  };

  const renderNoteVisual = (noteId: string) => {
    const node = RHYTHM_HIERARCHY.find(h => h.id === noteId);
    if (node && node.icon) {
      return (
        <div className="w-10 h-10 md:w-14 md:h-14 text-brand-black dark:text-brand-white flex items-center justify-center drop-shadow-sm pointer-events-none">
          <MusicSymbol name={node.icon as MusicSymbolName} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto items-center" ref={containerRef}>
      {avatar ? (
        <TeacherBubble avatar={avatar as any}>
          <p className="text-xl md:text-2xl font-medium text-center text-inherit">
            {data.question}
          </p>
        </TeacherBubble>
      ) : (
        <p className="text-xl md:text-2xl font-medium text-center text-brand-black dark:text-brand-white">
          {data.question}
        </p>
      )}

      {/* PYRAMID */}
      <div className="flex flex-col items-center gap-4 mt-4 w-full">
        {/* Level 1 (Static Base) */}
        <div className="relative w-full flex flex-col items-center">
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-end text-right w-[120px]">
            <span className="text-sm font-bold text-brand-black dark:text-brand-white uppercase tracking-wider">{levels.level1.name}</span>
            <span className="text-xs text-brand-gray font-medium">A figura base (1)</span>
          </div>
          <div className="w-20 h-20 bg-brand-graphite/10 dark:bg-brand-graphite/30 rounded-xl flex items-center justify-center border-2 border-[#2D8A5C] shadow-[0_0_15px_rgba(45,138,92,0.3)]">
            {renderNoteVisual(levels.level1.id)}
          </div>
          <div className="md:hidden mt-2 flex flex-col items-center">
            <span className="text-xs font-bold text-brand-black dark:text-brand-white uppercase tracking-wider">{levels.level1.name} (1)</span>
          </div>
        </div>

        {/* Lines connecting Level 1 to Level 2 */}
        <div className="w-40 md:w-48 h-6 border-t-2 border-l-2 border-r-2 border-brand-graphite/40 -mt-2 md:-mt-2 z-[-1] rounded-t-xl" />

        {/* Level 2 */}
        <div className="relative w-full flex flex-col items-center">
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-end text-right w-[120px]">
            <span className="text-sm font-bold text-brand-black dark:text-brand-white uppercase tracking-wider">{levels.level2.plural}</span>
            <span className="text-xs text-brand-gray font-medium">As metades (1/2)</span>
          </div>
          <div className="flex gap-[80px] md:gap-[112px] justify-center -mt-2">
            {Array.from({ length: data.expectedTarget.level_2.length }).map((_, i) => (
              <div key={`l2-${i}`} className="flex flex-col items-center">
                <div 
                  ref={el => { if (el) level2Refs.current[i] = el; }}
                  className={`w-16 h-20 md:w-20 md:h-24 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${i < level2Filled ? 'bg-[#2D8A5C]/20 border-[#2D8A5C]' : 'bg-brand-graphite/5 border-brand-graphite/30 border-dashed'}`}
                >
                  {i < level2Filled && renderNoteVisual(levels.level2.id)}
                </div>
              </div>
            ))}
          </div>
          <div className="md:hidden mt-2 flex flex-col items-center">
            <span className="text-xs font-bold text-brand-black dark:text-brand-white uppercase tracking-wider">{levels.level2.plural} (1/2)</span>
          </div>
        </div>

        {/* Lines connecting Level 2 to Level 3 */}
        <div className="flex gap-[60px] md:gap-[80px] -mt-2 z-[-1]">
          <div className="w-20 md:w-28 h-6 border-t-2 border-l-2 border-r-2 border-brand-graphite/40 rounded-t-xl" />
          <div className="w-20 md:w-28 h-6 border-t-2 border-l-2 border-r-2 border-brand-graphite/40 rounded-t-xl" />
        </div>

        {/* Level 3 */}
        <div className="relative w-full flex flex-col items-center">
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-end text-right w-[120px]">
            <span className="text-sm font-bold text-brand-black dark:text-brand-white uppercase tracking-wider">{levels.level3.plural}</span>
            <span className="text-xs text-brand-gray font-medium">Os quartos (1/4)</span>
          </div>
          <div className="flex gap-4 md:gap-8 justify-center -mt-2">
            {Array.from({ length: data.expectedTarget.level_3.length }).map((_, i) => (
              <div key={`l3-${i}`} className="flex flex-col items-center">
                <div 
                  ref={el => { if (el) level3Refs.current[i] = el; }}
                  className={`w-14 h-20 md:w-16 md:h-24 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${i < level3Filled ? 'bg-[#2D8A5C]/20 border-[#2D8A5C]' : 'bg-brand-graphite/5 border-brand-graphite/30 border-dashed'}`}
                >
                  {i < level3Filled && renderNoteVisual(levels.level3.id)}
                </div>
              </div>
            ))}
          </div>
          <div className="md:hidden mt-2 flex flex-col items-center">
            <span className="text-xs font-bold text-brand-black dark:text-brand-white uppercase tracking-wider">{levels.level3.plural} (1/4)</span>
          </div>
        </div>
      </div>

      {/* INVENTORY */}
      {!isCompleted && (
        <div className="mt-8 w-full">
          <p className="text-center text-sm text-brand-gray font-bold mb-4 uppercase tracking-wider">Arraste para construir</p>
          <div className="flex flex-wrap justify-center gap-6 min-h-[120px] p-6 bg-brand-graphite/5 rounded-3xl border border-brand-graphite/20">
            <AnimatePresence>
              {availableItems.map((item, index) => (
                <motion.div
                  key={`inv-${item}-${index}`}
                  drag
                  dragConstraints={containerRef}
                  dragSnapToOrigin={true}
                  onDragEnd={(e, info) => handleDragEnd(e, info, item, index)}
                  whileHover={{ scale: 1.1 }}
                  whileDrag={{ scale: 1.2, zIndex: 50 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-16 h-24 flex items-center justify-center cursor-grab active:cursor-grabbing bg-white dark:bg-brand-graphite rounded-xl shadow-md border border-brand-graphite/10"
                >
                  {renderNoteVisual(item)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-[#2D8A5C]/10 border-2 border-[#2D8A5C] rounded-2xl flex flex-col items-center text-center gap-3 w-full max-w-lg"
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
