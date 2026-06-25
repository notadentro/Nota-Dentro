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
  setShowStore: (show: boolean) => void;
}

const INITIAL_LIVES = 3;

export function SimulatorHUD({ status, pauseGame, resumeGame, level, lives, bpm, setShowStore }: SimulatorHUDProps) {
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
          <span className="text-brand-gray text-[10px] md:text-sm uppercase font-bold tracking-widest leading-none">Mundo {Math.ceil(level / 10)}</span>
          <div className="flex gap-1">
            {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
              <Heart 
                key={i} 
                className={cn(
                  "w-4 h-4 md:w-6 md:h-6 transition-all", 
                  i < lives ? "fill-red-500 text-red-500" : "fill-brand-graphite text-brand-graphite opacity-50"
                )} 
              />
            ))}
          </div>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-1 bg-brand-gold/20 px-3 py-1 rounded-full text-brand-gold font-bold border border-brand-gold/30 cursor-pointer hover:bg-brand-gold/30 transition-colors" onClick={() => setShowStore(true)}>
          <Zap className="w-4 h-4 fill-brand-gold" />
          <span>{user.stats.cache}</span>
        </div>
      )}

      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        <div className="flex flex-col items-end">
          <span className="text-brand-gray text-[10px] md:text-sm uppercase font-bold tracking-widest flex items-center"><Zap className="w-3 h-3 mr-1"/> BPM</span>
          <span className="text-white font-headline text-xl md:text-3xl font-black">{bpm}</span>
        </div>
        <Button 
          variant="outline"
          size="icon"
          className="border-brand-gray/30 text-white bg-transparent hover:bg-white/10 w-10 h-10 md:w-12 md:h-12 shrink-0"
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
