import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Crown, Lock, Play, Star } from 'lucide-react';
import { LessonStatus } from '@/types/lesson';

interface TrailNodeProps {
  status: LessonStatus;
  title: string;
  onClick?: () => void;
  isFirst?: boolean;
  titlePosition?: 'left' | 'right' | 'bottom' | 'top';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TrailNode({ status, title, onClick, isFirst, titlePosition = 'bottom' }: TrailNodeProps) {
  const isAvailable = status === 'available';
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  return (
    <div className="relative group flex flex-col items-center">
      {/* 3D Button Node */}
      <motion.button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        whileTap={!isLocked ? { scale: 0.95, y: 4, boxShadow: "0 0px 0 0 transparent" } : {}}
        initial={isAvailable ? { scale: 0.9 } : {}}
        animate={isAvailable ? { 
          scale: [0.95, 1.05, 0.95],
        } : {}}
        transition={isAvailable ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full border-[3px] transition-colors duration-300",
          isAvailable ? "w-10 h-10 md:w-12 md:h-12 shadow-[0_4px_0_0_#A88A0D]" : "w-8 h-8 md:w-10 md:h-10",
          isCompleted && "bg-[#2D8A5C] border-[#2D8A5C] shadow-[0_3px_0_0_#1e5f3f] text-white",
          isAvailable && "bg-brand-gold border-brand-white dark:border-brand-black text-brand-black",
          isLocked && "bg-brand-sand dark:bg-brand-graphite border-brand-sand dark:border-brand-graphite shadow-[0_2px_0_0_#D1CFC7] dark:shadow-[0_2px_0_0_#2A2A2A] text-brand-gray cursor-not-allowed opacity-80"
        )}
      >
        {isCompleted && <Crown size={14} className="fill-white md:w-4 md:h-4" />}
        {isAvailable && <Star size={20} className="fill-brand-black md:w-6 md:h-6" />}
        {isLocked && <Lock size={12} className="md:w-3 md:h-3" />}
        
        {/* Glow effect for available node */}
        {isAvailable && (
          <div className="absolute -inset-4 bg-brand-gold/30 rounded-full blur-xl -z-10 animate-pulse" />
        )}
      </motion.button>
      
      {/* Permanent Title Beside or Below Node */}
      <div className={cn(
        "absolute w-max max-w-[120px] text-center text-xs md:text-sm font-bold bg-background/90 px-3 py-1.5 rounded-xl border border-brand-graphite/30 shadow-md leading-tight",
        isLocked ? "text-brand-gray" : "text-brand-white",
        titlePosition === 'bottom' && "top-[120%] mt-2",
        titlePosition === 'top' && "bottom-[120%] mb-2",
        titlePosition === 'left' && "right-[120%] top-1/2 -translate-y-1/2",
        titlePosition === 'right' && "left-[120%] top-1/2 -translate-y-1/2"
      )}>
        {title}
        
        {/* Bubble pointer */}
        {(titlePosition === 'left' || titlePosition === 'right') && (
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-background border-brand-graphite/30",
            titlePosition === 'left' ? "-right-1 border-r border-t" : "-left-1 border-l border-b"
          )} />
        )}
      </div>
    </div>
  );
}
