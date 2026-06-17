import React, { useEffect, useRef, useState } from 'react';
import { FullPyramidStep } from '@/types/lesson';
import { MusicSymbol, MusicSymbolName } from '@/components/music-symbols';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

const HIERARCHY = [
  { id: 'semibreve', name: 'Semibreve', icon: 'note-semibreve' },
  { id: 'minima', name: 'Mínima', icon: 'note-minima' },
  { id: 'seminima', name: 'Semínima', icon: 'note-seminima' },
  { id: 'colcheia', name: 'Colcheia', icon: 'note-colcheia' },
  { id: 'semicolcheia', name: 'Semicolcheia', icon: 'note-semicolcheia' },
  { id: 'fusa', name: 'Fusa', icon: 'note-fusa' },
  { id: 'semifusa', name: 'Semifusa', icon: 'note-semifusa' },
];

const TreeNode = ({ levelIndex }: { levelIndex: number }) => {
  const levelData = HIERARCHY[levelIndex];
  if (!levelData) return null;

  const isLeaf = levelIndex === HIERARCHY.length - 1;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Node Icon */}
      <motion.div 
        className="group relative cursor-pointer flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.5, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: levelIndex * 1.5, duration: 0.6, type: "spring", stiffness: 200 }}
        style={{ zIndex: 10 - levelIndex }}
      >
        <div className="w-10 h-16 flex items-center justify-center text-brand-black dark:text-brand-white transition-transform group-hover:scale-150 group-active:scale-150 hover:text-[#2D8A5C]">
          <MusicSymbol name={levelData.icon as MusicSymbolName} />
        </div>
        {/* Tooltip Hover */}
        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-[#2D8A5C] text-white text-[16px] font-bold px-3 py-1 rounded whitespace-nowrap pointer-events-none shadow-lg">
          {levelData.name}
        </div>
      </motion.div>

      {/* Children & Connection */}
      {!isLeaf && (
        <div className="flex flex-col items-center w-full">
           {/* Central Stem dropping from parent */}
           <motion.div
             className="w-0.5 bg-[#F2B705] drop-shadow-[0_0_5px_rgba(242,183,5,0.8)]"
             style={{ height: '16px' }} // Adjusted height to connect smoothly
             initial={{ opacity: 0, scaleY: 0, originY: 0 }}
             animate={{ opacity: 1, scaleY: 1 }}
             transition={{ delay: levelIndex * 1.5 + 0.6, duration: 0.3 }}
           />
           {/* Horizontal Bracket that spans 50% of the container */}
           <motion.div 
             className="w-1/2 border-t-2 border-l-2 border-r-2 border-[#F2B705] rounded-t-sm drop-shadow-[0_0_5px_rgba(242,183,5,0.8)]"
             style={{ height: '16px' }} // Height of the vertical drops
             initial={{ opacity: 0, scaleX: 0 }}
             animate={{ opacity: 1, scaleX: 1 }}
             transition={{ delay: levelIndex * 1.5 + 0.8, duration: 0.4 }}
           />
           
           {/* Two Children in a flex row */}
           <div className="flex flex-row w-full justify-between -mt-[2px]">
             <div className="w-1/2 flex justify-center">
               <TreeNode levelIndex={levelIndex + 1} />
             </div>
             <div className="w-1/2 flex justify-center">
               <TreeNode levelIndex={levelIndex + 1} />
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export function FullPyramidView({
  data,
  isCompleted,
  onComplete
}: {
  data: FullPyramidStep;
  avatar?: string;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  // Auto-scale to fit horizontally on screen WITHOUT minimum scale restriction
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        
        // Base leaf nodes: 64 semifusas. Minimum comfortable visual width per node wrapper = 48px
        // 64 * 48 = 3072px
        const pyramidIntrinsicWidth = 3072; 
        
        if (parentWidth < pyramidIntrinsicWidth) {
          // No Math.max(). Let it shrink to microscopic if needed to fit without scroll!
          setScale((parentWidth - 10) / pyramidIntrinsicWidth);
        } else {
          setScale(1);
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    // Initial delay to ensure the container is fully rendered before calculating width
    setTimeout(handleResize, 50); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col w-full items-center overflow-hidden" ref={containerRef}>
      <p className="text-base md:text-lg font-medium text-center text-brand-gray px-4 mb-2 z-10 relative">
        {data.content}
      </p>

      {/* Rotate Screen Banner */}
      <div className="flex md:hidden items-center justify-center gap-2 bg-[#2D8A5C]/10 text-[#2D8A5C] px-4 py-2 rounded-full mb-2 border border-[#2D8A5C]/20 animate-pulse z-10">
         <Smartphone className="w-4 h-4 rotate-90" />
         <span className="text-xs font-bold uppercase tracking-wider">Gire a tela para ver maior</span>
      </div>

      {/* Pyramid Wrapper */}
      <div 
        className="relative flex justify-center origin-top mt-2 w-full"
        style={{ height: `${800 * scale}px` }}
      >
        <div 
          className="absolute top-0 origin-top flex flex-col items-center"
          style={{ 
            transform: `scale(${scale})`, 
            width: '3072px'
          }}
        >
          <TreeNode levelIndex={0} />
        </div>
      </div>
    </div>
  );
}
