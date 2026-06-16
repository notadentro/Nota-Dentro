import React from 'react';
import Image from 'next/image';

interface TeacherBubbleProps {
  avatar: 'odette' | 'scliar' | 'priolli' | 'med' | 'mascarenhas' | 'annie';
  children: React.ReactNode;
}

import { PROFESSORS } from '@/constants/professors';

const avatarConfig = {
  odette: {
    name: PROFESSORS.odette.displayName,
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-900",
    nameColor: "text-purple-700",
    image: "/avatares/odette.png"
  },
  scliar: {
    name: PROFESSORS.scliar.displayName,
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-900",
    nameColor: "text-blue-700",
    image: "/avatares/scliar.png"
  },
  priolli: {
    name: PROFESSORS.priolli.displayName,
    color: "bg-amber-50 border-amber-200",
    textColor: "text-amber-900",
    nameColor: "text-amber-700",
    image: "/avatares/priolli.png"
  },
  med: {
    name: PROFESSORS.med.displayName,
    color: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-900",
    nameColor: "text-emerald-700",
    image: "/avatares/med.png"
  },
  mascarenhas: {
    name: PROFESSORS.mascarenhas.displayName,
    color: "bg-orange-50 border-orange-200",
    textColor: "text-orange-900",
    nameColor: "text-orange-700",
    image: "/avatares/mascarenhas.png"
  },
  annie: {
    name: PROFESSORS.annie.displayName,
    color: "bg-rose-50 border-rose-200",
    textColor: "text-rose-900",
    nameColor: "text-rose-700",
    image: "/avatares/annie.png"
  }
};

export function TeacherBubble({ avatar, children }: TeacherBubbleProps) {
  const config = avatarConfig[avatar];

  return (
    <div className="flex flex-row gap-3 md:gap-4 mb-4 md:mb-6 items-start">
      {/* Avatar Container */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-14 h-14 md:w-24 md:h-24 rounded-full overflow-hidden border-2 md:border-4 bg-white shadow-md mb-1 md:mb-2 relative shrink-0" style={{ borderColor: 'var(--brand-gold)' }}>
          <Image 
            src={config.image} 
            alt={config.name} 
            fill
            className="object-cover"
          />
        </div>
        <span className={`text-[10px] md:text-xs font-bold font-headline uppercase tracking-wider ${config.nameColor} text-center max-w-[60px] md:max-w-none leading-tight`}>
          {config.name}
        </span>
      </div>

      {/* Bubble Container */}
      <div className={`flex-1 rounded-2xl rounded-tl-none border-2 p-4 md:p-5 shadow-sm relative ${config.color} ${config.textColor}`}>
        {/* Seta do balão (Sempre esquerda, se ajustando no mobile e desktop) */}
        <div className={`absolute w-3 h-3 md:w-4 md:h-4 transform rotate-45 border-l-2 border-b-2 md:border-b-2 ${config.color.split(' ')[1]} ${config.color.split(' ')[0]} 
          top-4 md:top-8 -left-1.5 md:-left-2.5`} 
        />
        
        <div className="relative z-10 text-base md:text-lg leading-relaxed font-body">
          {children}
        </div>
      </div>
    </div>
  );
}
