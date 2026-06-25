'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RhythmicReadingStep } from '@/types/lesson';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MusicSymbol } from '@/components/music-symbols';

interface Props {
  data: RhythmicReadingStep;
  isCompleted: boolean;
  onSuccess: () => void;
  onFail: () => void;
}

type GameState = 'idle' | 'prep' | 'playing' | 'finished';
type BeatResult = 'perfect' | 'early' | 'late' | 'missed' | 'penalty' | null;

const scheduleClick = (ctx: AudioContext, freq: number, time: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, time);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.2, time + 0.05);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(1, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  
  osc.start(time);
  osc.stop(time + 0.05);
};

export function RhythmicReadingView({ data, isCompleted, onSuccess, onFail }: Props) {
  const { bpm = 65, sequence = [], toleranceMs = 200 } = data;
  const beatsToComplete = sequence.length;
  const beatMs = (60 / bpm) * 1000;

  const [status, setStatus] = useState<GameState>('idle');
  const [results, setResults] = useState<BeatResult[]>(Array(beatsToComplete).fill(null));
  const [elapsedTime, setElapsedTime] = useState(-4 * beatMs);
  const [score, setScore] = useState<number | null>(null);
  const [ghostMsg, setGhostMsg] = useState<{ text: string, id: number, type: BeatResult } | null>(null);
  const LATENCY_OFFSET_MS = 0.3; 

  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const resultsRef = useRef<BeatResult[]>(Array(beatsToComplete).fill(null));
  const failTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getCurrentTimeMs = () => performance.now();

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const showGhostMsg = (type: BeatResult) => {
    let msg = "Perfeito!";
    if (type === 'early') msg = "Adiantado";
    if (type === 'late') msg = "Atrasado";
    if (type === 'missed') msg = "Passou!";
    if (type === 'penalty') msg = "Aí é silêncio!";
    setGhostMsg({ text: msg, id: Date.now(), type });
  };

  const tick = () => {
    const elapsed = getCurrentTimeMs() - startTimeRef.current;
    setElapsedTime(elapsed);

    if (elapsed < 0) {
      animationRef.current = requestAnimationFrame(tick);
      return;
    }

    if (status === 'prep') {
      setStatus('playing');
    }

    const currentBeatIndex = Math.floor(elapsed / beatMs);
    const timeSinceBeat = elapsed - (currentBeatIndex * beatMs);

    if (currentBeatIndex >= 0 && currentBeatIndex < beatsToComplete) {
      if (timeSinceBeat > (beatMs * 0.4) && resultsRef.current[currentBeatIndex] === null) {
        if (sequence[currentBeatIndex] === 'note') {
          // It was a note and we missed it
          setResults(prev => {
            const next = [...prev];
            next[currentBeatIndex] = 'missed';
            return next;
          });
          showGhostMsg('missed');
        } else if (sequence[currentBeatIndex] === 'rest' && currentBeatIndex < beatsToComplete) {
          // Passed a rest successfully without tapping!
          setResults(prev => {
            const next = [...prev];
            next[currentBeatIndex] = 'perfect';
            return next;
          });
          showGhostMsg('perfect');
        }
      }
    }

    if (currentBeatIndex >= beatsToComplete) {
      let finalHits = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let finalMisses = 0;
      let finalPenalties = 0;
      resultsRef.current.forEach((r, idx) => {
        if (sequence[idx] === 'rest' && r === 'penalty') finalPenalties++;
        else if (sequence[idx] === 'note') {
          if (r === 'perfect' || r === 'early' || r === 'late') finalHits++;
          if (r === 'missed') finalMisses++;
        }
      });

      const totalNotes = sequence.filter(s => s === 'note').length;
      let finalScore = totalNotes > 0 ? Math.round((finalHits / totalNotes) * 100) : 100;
      // Penalize for hitting rests
      finalScore -= finalPenalties * 15; 
      if (finalScore < 0) finalScore = 0;
      
      setScore(finalScore);
      setStatus('finished');

      if (finalScore >= 70) {
        setGhostMsg({ text: "Desafio Concluído!", id: Date.now(), type: 'perfect' });
        if (!isCompleted) onSuccess();
      } else {
        setGhostMsg({ text: "Tente novamente!", id: Date.now(), type: 'missed' });
        if (!isCompleted) onFail();
      }
      return;
    }

    animationRef.current = requestAnimationFrame(tick);
  };

  const startPrep = () => {
    if (failTimeoutRef.current) clearTimeout(failTimeoutRef.current);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      const audioNow = ctx.currentTime;
      for (let i = 0; i < 4 + beatsToComplete; i++) {
        const freq = (i === 0) ? 1200 : 800;
        scheduleClick(ctx, freq, audioNow + 0.1 + i * beatSec);
      }
    }

    startTimeRef.current = nowTimeMs + 100 + (4 * beatMs);

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(tick);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTap = () => {
    if (audioCtxRef.current) {
      scheduleClick(audioCtxRef.current, 400, audioCtxRef.current.currentTime);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
        scheduleClick(audioCtxRef.current, 400, audioCtxRef.current.currentTime);
      }
    }

    if (status === 'finished' || status === 'idle') return;

    const elapsed = getCurrentTimeMs() - startTimeRef.current - LATENCY_OFFSET_MS;
    if (status === 'prep' && elapsed < -toleranceMs) return;

    const closestBeat = Math.round(elapsed / beatMs);

    if (closestBeat >= 0 && closestBeat < beatsToComplete) {
      setResults(prev => {
        const next = [...prev];
        if (next[closestBeat] !== null) return prev; // Already registered

        const delta = elapsed - (closestBeat * beatMs);
        
        if (sequence[closestBeat] === 'rest') {
           // Tapped on a rest! Bad!
           if (Math.abs(delta) <= toleranceMs) {
             next[closestBeat] = 'penalty';
             showGhostMsg('penalty');
             return next;
           }
        } else {
          // Tapped on a note
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
        }
        return prev;
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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getResultColor = (r: BeatResult) => {
    switch (r) {
      case 'perfect': return 'text-green-500 border-green-500';
      case 'early': return 'text-yellow-500 border-yellow-500';
      case 'late': return 'text-orange-500 border-orange-500';
      case 'missed': return 'text-red-500 border-red-500';
      case 'penalty': return 'text-purple-500 border-purple-500'; // Touched a rest!
      default: return 'text-brand-gray/30 border-transparent';
    }
  };

  const getResultBg = (r: BeatResult) => {
    switch (r) {
      case 'perfect': return 'bg-green-500/20';
      case 'early': return 'bg-yellow-500/20';
      case 'late': return 'bg-orange-500/20';
      case 'missed': return 'bg-red-500/20';
      case 'penalty': return 'bg-purple-500/20';
      default: return 'bg-transparent';
    }
  };

  const visualBeatFloat = elapsedTime / beatMs;
  const totalDivisions = beatsToComplete + 4; // 4 prep beats + sequence

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-brand-black min-h-[400px] font-body relative overflow-hidden select-none">
      
      {/* Ghost Message (Feedback de precisão) */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 h-10 flex items-center justify-center pointer-events-none z-50">
        {ghostMsg && (
          <div 
            key={ghostMsg.id} 
            className={cn(
              "font-headline text-3xl font-bold animate-ping-short drop-shadow-md",
              ghostMsg.type === 'perfect' ? 'text-green-400' :
              ghostMsg.type === 'penalty' ? 'text-purple-400' :
              ghostMsg.type === 'missed' ? 'text-red-400' : 'text-yellow-400'
            )}
          >
            {ghostMsg.text}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center w-full max-w-4xl relative mt-10">
        
        {status === 'finished' && score !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-brand-black/90 backdrop-blur-sm rounded-xl">
            <h2 className="text-4xl font-headline font-bold text-brand-white mb-2">
              Precisão: <span className={score >= 70 ? 'text-green-400' : 'text-red-400'}>{score}%</span>
            </h2>
            {score >= 70 ? (
              <p className="text-green-300 font-bold mb-6">Leitura Rítmica Concluída!</p>
            ) : (
              <p className="text-red-300 font-bold mb-6">Não foi dessa vez...</p>
            )}
            
            <Button 
              onClick={startPrep}
              className={cn(
                "px-8 py-6 rounded-full text-brand-black text-xl font-bold shadow-lg mt-4",
                score >= 70 ? "bg-system-success hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              <RefreshCw className="mr-2" /> {score >= 70 ? "Jogar Novamente" : "Tentar Novamente"}
            </Button>
          </div>
        )}

        {/* Pauta Horizontal */}
        <div className="w-full h-32 relative bg-brand-graphite/20 rounded-xl mb-12 flex items-center">
          
          {/* Cursor móvel */}
          {(status === 'prep' || status === 'playing') && (
            <div 
              className="absolute top-0 bottom-0 w-2 bg-brand-gold z-20 shadow-[0_0_15px_rgba(242,211,73,0.8)]"
              style={{
                left: `${((visualBeatFloat + 4) / totalDivisions) * 100}%`,
                transform: 'translateX(-50%)',
                transition: 'left 0.05s linear' // Suaviza a animação entre frames
              }}
            />
          )}

          {/* Renderiza as batidas preparatórias (-4 a -1) */}
          {[-4, -3, -2, -1].map((prepBeat) => {
             const leftPercent = ((prepBeat + 4) / totalDivisions) * 100;
             const isHovered = Math.abs(visualBeatFloat - prepBeat) < 0.2;
             return (
               <div 
                 key={`prep-${prepBeat}`}
                 className="absolute flex flex-col items-center"
                 style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
               >
                 <div className={cn(
                   "w-4 h-4 rounded-full bg-brand-gray/40 transition-transform",
                   isHovered ? "scale-[1.8] bg-brand-gold" : ""
                 )} />
               </div>
             );
          })}

          {/* Renderiza a sequência da lição */}
          {sequence.map((item, idx) => {
            const leftPercent = ((idx + 4) / totalDivisions) * 100;
            const r = results[idx];
            const isHovered = Math.abs(visualBeatFloat - idx) < 0.2;

            return (
              <div 
                key={idx} 
                className="absolute flex flex-col items-center justify-center transition-all h-full"
                style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
              >
                {/* Visual da figura musical */}
                <div className={cn(
                  "w-12 h-16 transition-all duration-100 flex items-center justify-center",
                  isHovered ? "-translate-y-2 scale-125" : ""
                )}>
                  {item === 'note' ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/svg/seminima.svg" alt="Semínima" className="w-full h-full object-contain" />
                    </>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/svg/pausa-seminima.svg" alt="Pausa de Semínima" className="w-full h-full object-contain" />
                    </>
                  )}
                </div>
                
                {/* Base colorida após acerto/erro */}
                <div className={cn(
                  "w-12 h-2 mt-4 rounded-full border-2 transition-colors",
                  getResultBg(r),
                  getResultColor(r)
                )} />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-xs relative mt-4">
          {status === 'idle' ? (
            <Button 
              onClick={startPrep}
              className="w-full rounded-2xl py-6 bg-brand-gold hover:bg-yellow-400 text-brand-black text-xl font-bold shadow-lg shadow-brand-gold/30"
            >
              <Play className="mr-2" /> Começar
            </Button>
          ) : (
            <div className="h-[76px] w-full" />
          )}

          <div className="flex flex-col items-center gap-4 mt-2">
            <Button
              onPointerDown={(e) => { e.preventDefault(); handleTap(); }}
              className={cn(
                "w-28 h-28 rounded-full flex items-center justify-center transition-transform active:scale-90 p-0 overflow-hidden",
                status === 'playing' || status === 'prep' ? "bg-brand-gold hover:bg-yellow-400 shadow-lg shadow-brand-gold/30" : "bg-brand-graphite/20 text-brand-gray cursor-default"
              )}
            >
              <div className="w-full h-full p-2 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/assets/svg/seminima.svg" 
                  alt="Tap" 
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
    </div>
  );
}
