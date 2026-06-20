import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PulsationStep } from '@/types/lesson';
import { MusicSymbol } from '@/components/music-symbols';
import { cn } from '@/lib/utils';

interface Props {
  data: PulsationStep;
  isCompleted: boolean;
  onSuccess: () => void;
  onFail: () => void;
}

type GameState = 'idle' | 'prep' | 'playing' | 'finished';
type BeatResult = 'perfect' | 'early' | 'late' | 'missed' | null;

const scheduleClick = (ctx: AudioContext, freq: number, time: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  // Timbre percussivo (Woodblock/Tom) usando onda triângulo e pitch-drop
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, time);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.2, time + 0.05);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(1, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  
  osc.start(time);
  osc.stop(time + 0.05);
};

export function PulsationView({ data, isCompleted, onSuccess, onFail }: Props) {
  const { bpm = 65, beatsToComplete = 8, toleranceMs = 200 } = data;
  const beatMs = (60 / bpm) * 1000;

  const [status, setStatus] = useState<GameState>('idle');
  const [results, setResults] = useState<BeatResult[]>(Array(beatsToComplete).fill(null));
  const [visualBeat, setVisualBeat] = useState(-4);
  const [score, setScore] = useState<number | null>(null);
  const [ghostMsg, setGhostMsg] = useState<{ text: string, id: number, type: BeatResult } | null>(null);
  const [heartScale, setHeartScale] = useState(1);
  const LATENCY_OFFSET_MS = 0.3; // Latência quase zerada, pois o laptop quase não tem atraso (sem fone bluetooth)

  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioStartTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const resultsRef = useRef<BeatResult[]>(Array(beatsToComplete).fill(null));
  const failTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getCurrentTimeMs = () => {
    if (audioCtxRef.current) return audioCtxRef.current.currentTime * 1000;
    return performance.now();
  };

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (visualBeat >= -4 && status !== 'idle' && status !== 'finished') {
      setHeartScale(1.3);
      const timer = setTimeout(() => setHeartScale(1), 100);
      return () => clearTimeout(timer);
    }
  }, [visualBeat, status]);

  const showGhostMsg = (type: BeatResult) => {
    let msg = "Perfeito!";
    if (type === 'early') msg = "Você adiantou!";
    if (type === 'late') msg = "Você atrasou!";
    if (type === 'missed') msg = "Perdeu a batida!";
    setGhostMsg({ text: msg, id: Date.now(), type });
  };

  const finishGame = () => {
    setStatus('finished');
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const finalResults = resultsRef.current;
    const hits = finalResults.filter(r => r === 'perfect' || r === 'early' || r === 'late').length;
    const percent = Math.round((hits / beatsToComplete) * 100);
    setScore(percent);

    if (percent >= 70) {
      setGhostMsg({ text: "Desafio Concluído!", id: Date.now(), type: 'perfect' });
      setHeartScale(1.5);
      if (!isCompleted) {
        onSuccess();
      }
    } else {
      setGhostMsg({ text: "Tente novamente!", id: Date.now(), type: 'missed' });
      if (!isCompleted) {
        onFail();
      }
      failTimeoutRef.current = setTimeout(() => {
        setStatus('idle');
        setScore(null);
        setGhostMsg(null);
      }, 3000);
    }
  };

  const tick = () => {

    // Usamos o tempo da máquina de áudio (se disponível) para ser o "mestre" do tempo do jogo.
    // Isso evita qualquer drift entre o requestAnimationFrame e o processador de som.
    const elapsed = getCurrentTimeMs() - startTimeRef.current - LATENCY_OFFSET_MS;

    if (elapsed < 0) {
      // Prep phase
      const prepBeat = 4 - Math.ceil(Math.abs(elapsed) / beatMs);
      setVisualBeat(prev => prev !== (prepBeat - 4) ? (prepBeat - 4) : prev);
    } else {
      // Playing phase
      setStatus(prev => prev !== 'playing' ? 'playing' : prev);
      const currentBeat = Math.floor(elapsed / beatMs);
      setVisualBeat(prev => prev !== currentBeat ? currentBeat : prev);

      // Auto-miss beats that have passed
      let changed = false;
      const nextResults = [...resultsRef.current];
      
      for (let i = 0; i <= currentBeat; i++) {
        if (i < beatsToComplete) {
          const beatExpectedTime = i * beatMs;
          if (elapsed > beatExpectedTime + toleranceMs && nextResults[i] === null) {
            nextResults[i] = 'missed';
            changed = true;
            // Only show ghost for missed beat if it's the current one we just missed
            if (i === currentBeat || i === currentBeat - 1) {
                showGhostMsg('missed');
            }
          }
        }
      }

      if (changed) {
        setResults(nextResults);
      }

      // Check for game end
      if (currentBeat >= beatsToComplete && elapsed > (beatsToComplete - 1) * beatMs + toleranceMs) {
        finishGame();
        return;
      }
    }

    animationRef.current = requestAnimationFrame(tick);
  };

  const startPrep = () => {
    if (failTimeoutRef.current) {
      clearTimeout(failTimeoutRef.current);
      failTimeoutRef.current = null;
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current && AudioContext) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === 'suspended') ctx.resume();

    setStatus('prep');
    const freshResults = Array(beatsToComplete).fill(null);
    setResults(freshResults);
    resultsRef.current = freshResults;
    setScore(null);
    setGhostMsg(null);

    const nowTimeMs = getCurrentTimeMs();
    const beatSec = 60 / bpm;

    if (ctx) {
      // Metrônomo contínuo: Toca nos 4 tempos de prep E em todos os tempos do jogo
      for (let i = 0; i < 4 + beatsToComplete; i++) {
        const freq = (i === 0) ? 1200 : 800;
        scheduleClick(ctx, freq, (nowTimeMs / 1000) + 0.1 + i * beatSec);
      }
    }

    // playing state starts EXACTLY at beat 0
    startTimeRef.current = nowTimeMs + 100 + (4 * beatMs);

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(tick);
  };

  const handleTap = () => {
    // Restaurado o som do TAP com timbre percussivo mais grave (400Hz) para diferenciar do metrônomo
    if (audioCtxRef.current) {
      scheduleClick(audioCtxRef.current, 400, audioCtxRef.current.currentTime);
    } else {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
        scheduleClick(audioCtxRef.current, 400, audioCtxRef.current.currentTime);
      }
    }

    if (status === 'finished' || status === 'idle') {
      return;
    }

    const elapsed = getCurrentTimeMs() - startTimeRef.current - LATENCY_OFFSET_MS;

    // Ignora taps na fase de preparação se forem muito adiantados
    if (status === 'prep' && elapsed < -toleranceMs) return;

    const closestBeat = Math.round(elapsed / beatMs);

    if (closestBeat >= 0 && closestBeat < beatsToComplete) {
      setResults(prev => {
        const next = [...prev];
        if (next[closestBeat] !== null) return prev; // Already hit or missed this beat

        const delta = elapsed - (closestBeat * beatMs);
        let type: BeatResult = 'perfect';

        if (Math.abs(delta) <= toleranceMs) {
          if (delta < -toleranceMs / 3) type = 'early';
          else if (delta > toleranceMs / 3) type = 'late';
          else type = 'perfect';
        } else {
          type = 'missed';
        }

        next[closestBeat] = type;
        showGhostMsg(type);
        return next;
      });
    }
  };

  const handleTapRef = useRef(handleTap);
  useEffect(() => {
    handleTapRef.current = handleTap;
  }, [handleTap]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleTapRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const generateEKGPath = () => {
    let path = "M 0 50 ";
    const segmentWidth = 100 / beatsToComplete;
    for (let i = 0; i < beatsToComplete; i++) {
      const xOffset = (i + 1) * segmentWidth;
      const res = results[i];
      if (res === 'perfect' || res === 'early' || res === 'late') {
        path += `L ${xOffset - segmentWidth / 2 - 2} 50 L ${xOffset - segmentWidth / 2} 20 L ${xOffset - segmentWidth / 2 + 2} 80 L ${xOffset - segmentWidth / 2 + 4} 50 L ${xOffset} 50 `;
      } else {
        path += `L ${xOffset} 50 `;
      }
    }
    return path;
  };

  const isHeartDead = score !== null && score < 70;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-8 font-body select-none">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-headline font-bold text-brand-black dark:text-brand-white mb-2">
          Teste de Pulsação
        </h2>
        <p className="text-brand-gray">
          Mantenha o ritmo da Semínima ({bpm} BPM) por {beatsToComplete} tempos.
        </p>
      </div>

      <div className="relative w-full h-48 bg-brand-graphite/5 rounded-3xl flex items-center justify-center overflow-hidden mb-12 border border-brand-graphite/10">
        <div className="absolute inset-0 w-full h-full opacity-30">
          <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="w-full h-full text-system-success">
            <path d={generateEKGPath()} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <motion.div
          animate={{ scale: heartScale }}
          transition={{ type: "tween", duration: 0.1 }}
          className="z-10 relative"
        >
          <Heart
            size={80}
            className={cn(
              "transition-colors duration-300",
              isHeartDead ? "fill-brand-gray text-brand-gray" : "fill-red-500 text-red-500",
              status === 'finished' && score !== null && score >= 70 && "fill-system-success text-system-success"
            )}
          />
          {status === 'prep' && visualBeat < 0 && (
            <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-2xl">
              {visualBeat + 5}
            </div>
          )}
          {status === 'finished' && score !== null && (
            <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-xl">
              {score}%
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {ghostMsg && (
            <motion.div
              key={ghostMsg.id}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: ghostMsg.text === 'Desafio Concluído!' ? -70 : -40, scale: 1 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 font-bold drop-shadow-md z-30 whitespace-nowrap",
                ghostMsg.text === 'Desafio Concluído!' ? "text-brand-gold text-2xl" :
                ghostMsg.type === 'perfect' ? "text-system-success text-xl" :
                  ghostMsg.type === 'early' ? "text-yellow-500 text-xl" :
                    ghostMsg.type === 'late' ? "text-orange-500 text-xl" :
                      "text-red-500 text-xl"
              )}
            >
              {ghostMsg.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress visualizer */}
      <div className="flex gap-1 mb-6">
        {results.map((res, i) => (
          <div 
            key={i} 
            className={cn(
              "h-2 w-8 rounded-full transition-all duration-300",
              visualBeat === i ? "scale-y-150 ring-2 ring-brand-gold ring-offset-1" : "",
              res === 'perfect' ? "bg-system-success" :
              res === 'early' ? "bg-yellow-500" :
              res === 'late' ? "bg-orange-500" :
              res === 'missed' ? "bg-red-500" :
              "bg-brand-gray/30"
            )}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs relative">
        {status === 'idle' || status === 'finished' ? (
          <Button
            onClick={startPrep}
            className={cn(
              "w-full rounded-2xl py-6 text-xl font-bold shadow-lg", 
              status === 'idle' || (score !== null && score >= 70) 
                ? "bg-system-success hover:bg-green-600 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            {status === 'idle' ? <><Play className="mr-2" /> Começar</> 
            : score !== null && score < 70 && !isCompleted ? <><RefreshCw className="mr-2" /> Tentar Novamente</>
            : <><RefreshCw className="mr-2" /> Jogar Novamente</>}
          </Button>
        ) : (
          <div className="h-[76px] w-full" />
        )}

        <div className="flex flex-col items-center gap-4 mt-2">
          <Button
            onPointerDown={(e) => { e.preventDefault(); handleTap(); }}
            className={cn(
              "w-28 h-28 rounded-full flex items-center justify-center transition-transform active:scale-90 p-0 overflow-hidden",
              status === 'playing' || status === 'prep' ? "bg-brand-gold hover:bg-yellow-400 text-brand-black shadow-lg shadow-brand-gold/30" : "bg-brand-graphite/20 text-brand-gray hover:bg-brand-graphite/30 cursor-pointer"
            )}
          >
            <div className="w-full h-full p-2 flex items-center justify-center">
              <img 
                src="/assets/svg/seminima.svg" 
                alt="Semínima" 
                className="w-full h-full object-contain" 
              />
            </div>
          </Button>
          <span className="font-bold text-brand-gray text-lg">
            TAP <span className="hidden sm:inline">(Espaço)</span>
          </span>
        </div>
      </div>
    </div>
  );
}
