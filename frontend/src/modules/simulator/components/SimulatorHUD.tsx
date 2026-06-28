import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Zap, ArrowLeft, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { GameState } from '../types';

interface SimulatorHUDProps {
  status: GameState;
  pauseGame: () => void;
  resumeGame: () => void;
  level: number;
  lives: number;
  bpm: number;
  retries: number;
  setShowStore: (show: boolean) => void;
}

const INITIAL_LIVES = 3;
const INITIAL_RETRIES = 3;

export function SimulatorHUD({ status, pauseGame, resumeGame, level, lives, bpm, retries, setShowStore }: SimulatorHUDProps) {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="w-full flex flex-wrap justify-between items-center gap-4 z-50 mb-6">
      <div className="flex gap-2 items-center">
        <Button 
          variant="ghost" 
          className="text-brand-gray hover:text-white hidden md:flex"
          onClick={() => {
            if (status === 'playing' || status === 'prep') pauseGame();
            else router.push('/ritmo-insano');
          }}
        >
          Menu Principal
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-brand-gray hover:text-white md:hidden"
          onClick={() => {
            if (status === 'playing' || status === 'prep') pauseGame();
            else router.push('/ritmo-insano');
          }}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex flex-col items-start gap-1">
          <span className="text-cyan-400 text-[10px] md:text-sm uppercase font-bold tracking-widest leading-none drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">Mundo {Math.ceil(level / 10)}</span>
          <div className="flex items-center gap-4">
            <div id="hud-hearts" className="flex gap-1">
              {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
                <Heart 
                  key={i} 
                  className={cn(
                    "w-4 h-4 md:w-6 md:h-6 transition-all", 
                    i < lives ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "fill-slate-800 text-slate-800 opacity-50"
                  )} 
                />
              ))}
            </div>
            
            <div id="hud-retries" className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Chances:</span>
              <div className="flex gap-1">
                {Array.from({ length: INITIAL_RETRIES }).map((_, i) => (
                  <div key={i} className={cn("w-2 h-2 rounded-full", i < retries ? "bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.8)]" : "bg-slate-700")} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-1 bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-300 font-bold border border-cyan-400/50 cursor-pointer hover:bg-cyan-500/30 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]" onClick={() => setShowStore(true)}>
          <Zap className="w-4 h-4 fill-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
          <span>{user.stats.cache}</span>
        </div>
      )}

      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        <div id="hud-bpm" className="flex flex-col items-end px-2">
          <span className="text-pink-400 text-[10px] md:text-sm uppercase font-bold tracking-widest flex items-center drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]"><Zap className="w-3 h-3 mr-1"/> BPM</span>
          <span className="text-white font-headline text-xl md:text-3xl font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{bpm}</span>
        </div>
        <Button 
          id="hud-pause-button"
          variant="outline"
          size="icon"
          className="border-slate-600 text-white bg-slate-900/50 backdrop-blur-sm hover:bg-cyan-500/20 hover:border-cyan-400 w-10 h-10 md:w-12 md:h-12 shrink-0 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          onClick={status === 'paused' ? resumeGame : pauseGame}
          disabled={status !== 'playing' && status !== 'prep' && status !== 'paused'}
        >
          {status === 'paused' ? <Play className="w-4 h-4 fill-current" /> : (
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-white" />
              <div className="w-1 h-3 bg-white" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
