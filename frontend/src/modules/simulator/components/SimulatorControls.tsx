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
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-slate-950/95 backdrop-blur-md px-4">
           <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,215,0,0.5)]"></div>
        </div>
      )}

      <div className="flex justify-center gap-12 w-full">
        {/* PAD F */}
        <div className="flex flex-col items-center gap-4">
          <Button
            id="pad-left"
            onPointerDown={(e) => { e.preventDefault(); setLeftPadActive(true); handleTap(isSingleTrack ? 'upper' : 'lower'); }}
            onPointerUp={() => { setLeftPadActive(false); handleRelease(isSingleTrack ? 'upper' : 'lower'); }}
            onPointerLeave={() => { setLeftPadActive(false); handleRelease(isSingleTrack ? 'upper' : 'lower'); }}
            className={cn(
              "w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center transition-all p-0 overflow-hidden border-4 backdrop-blur-md",
              (status === 'playing' || status === 'prep') 
                ? leftPadActive ? "bg-system-info/40 border-system-info shadow-[0_0_40px_rgba(91,155,213,0.8)] scale-95" : "bg-slate-900/50 border-system-info/50 shadow-[0_0_15px_rgba(91,155,213,0.3)] hover:bg-system-info/10 hover:shadow-[0_0_20px_rgba(91,155,213,0.5)]" 
                : "bg-slate-900/50 border-slate-700/50 cursor-default opacity-50"
            )}
          >
            <div className={cn("w-12 h-12 rounded-full transition-colors", leftPadActive ? "bg-[#8ac1ef] shadow-[0_0_20px_rgba(138,193,239,1)]" : "bg-system-info/20")} />
          </Button>
          <span className="font-bold text-system-info/50 text-xl tracking-widest mt-2 drop-shadow-[0_0_5px_rgba(91,155,213,0.5)]">
            Voz 2 <span className="hidden md:inline">(F)</span>
          </span>
        </div>

        {/* PAD J */}
        <div className="flex flex-col items-center gap-4">
          <Button
            id="pad-right"
            onPointerDown={(e) => { e.preventDefault(); setRightPadActive(true); handleTap('upper'); }}
            onPointerUp={() => { setRightPadActive(false); handleRelease('upper'); }}
            onPointerLeave={() => { setRightPadActive(false); handleRelease('upper'); }}
            className={cn(
              "w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center transition-all p-0 overflow-hidden border-4 backdrop-blur-md",
              (status === 'playing' || status === 'prep') 
                ? rightPadActive ? "bg-brand-gold/40 border-brand-gold shadow-[0_0_40px_rgba(255,215,0,0.8)] scale-95" : "bg-slate-900/50 border-brand-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:bg-brand-gold/10 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]" 
                : "bg-slate-900/50 border-slate-700/50 cursor-default opacity-50"
            )}
          >
            <div className={cn("w-12 h-12 rounded-full transition-colors", rightPadActive ? "bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,1)]" : "bg-brand-gold/20")} />
          </Button>
          <span className="font-bold text-brand-gold/50 text-xl tracking-widest mt-2 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
            Voz 1 <span className="hidden md:inline">(J)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
