'use client';

import { cn } from "@/lib/utils";
import Image from "next/image";

interface MascotDomProps {
  className?: string;
}

export function MascotDom({ className }: MascotDomProps) {
  return (
    <div className={cn("relative w-24 h-24 sm:w-28 sm:h-28 animate-bounce pointer-events-none drop-shadow-[0_10px_20px_rgba(239,68,68,0.7)] shrink-0", className)}>
      <div className="absolute w-4/5 h-4/5 top-[10%] left-[10%] bg-red-600/40 rounded-full blur-[20px] z-0"></div>
      <Image 
        src="/assets/images/dom_cat.png" 
        alt="Dom, the Cat" 
        fill 
        sizes="(max-width: 640px) 96px, 112px"
        className="object-contain contrast-125 saturate-150 z-10" 
      />
      {/* Eyes glowing */}
      <div className="absolute top-[35%] left-[30%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_4px_rgba(239,68,68,0.8)] z-20"></div>
      <div className="absolute top-[35%] right-[30%] w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_4px_rgba(239,68,68,0.8)] z-20"></div>
    </div>
  );
}
