import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GameState } from '../types';

interface SimulatorControlsProps {
  status: GameState;
  leftPadActive: boolean;
  rightPadActive: boolean;
  setLeftPadActive: (active: boolean) => void;
  setRightPadActive: (active: boolean) => void;
  handleTap: (track: 'upper' | 'lower') => void;
  handleRelease: (track: 'upper' | 'lower') => void;
  isSingleTrack: boolean;
}

export function SimulatorControls({
  status, leftPadActive, rightPadActive, setLeftPadActive, setRightPadActive, handleTap, handleRelease, isSingleTrack
}: SimulatorControlsProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-lg relative mt-8 md:mt-12 mb-8">
      {status === 'idle' && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md px-4">
           <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-center gap-12 w-full">
        {/* PAD F */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onPointerDown={(e) => { e.preventDefault(); setLeftPadActive(true); handleTap(isSingleTrack ? 'upper' : 'lower'); }}
            onPointerUp={() => { setLeftPadActive(false); handleRelease(isSingleTrack ? 'upper' : 'lower'); }}
            onPointerLeave={() => { setLeftPadActive(false); handleRelease(isSingleTrack ? 'upper' : 'lower'); }}
            className={cn(
              "w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center transition-all p-0 overflow-hidden border-4",
              (status === 'playing' || status === 'prep') 
                ? leftPadActive ? "bg-brand-gold border-yellow-300 shadow-[0_0_40px_rgba(242,211,73,0.6)] scale-95" : "bg-brand-graphite border-brand-gold shadow-[0_0_15px_rgba(242,211,73,0.2)]" 
                : "bg-brand-graphite border-brand-gray/30 cursor-default opacity-50"
            )}
          >
            <div className={cn("w-12 h-12 rounded-full transition-colors", leftPadActive ? "bg-yellow-200" : "bg-brand-gray/20")} />
          </Button>
          <span className="font-bold text-brand-gray/50 text-xl tracking-widest mt-2">
            Voz 2 <span className="hidden md:inline">(F)</span>
          </span>
        </div>

        {/* PAD J */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onPointerDown={(e) => { e.preventDefault(); setRightPadActive(true); handleTap('upper'); }}
            onPointerUp={() => { setRightPadActive(false); handleRelease('upper'); }}
            onPointerLeave={() => { setRightPadActive(false); handleRelease('upper'); }}
            className={cn(
              "w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center transition-all p-0 overflow-hidden border-4",
              (status === 'playing' || status === 'prep') 
                ? rightPadActive ? "bg-brand-gold border-yellow-300 shadow-[0_0_40px_rgba(242,211,73,0.6)] scale-95" : "bg-brand-graphite border-brand-gold shadow-[0_0_15px_rgba(242,211,73,0.2)]" 
                : "bg-brand-graphite border-brand-gray/30 cursor-default opacity-50"
            )}
          >
            <div className={cn("w-12 h-12 rounded-full transition-colors", rightPadActive ? "bg-yellow-200" : "bg-brand-gray/20")} />
          </Button>
          <span className="font-bold text-brand-gray/50 text-xl tracking-widest mt-2">
            Voz 1 <span className="hidden md:inline">(J)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
