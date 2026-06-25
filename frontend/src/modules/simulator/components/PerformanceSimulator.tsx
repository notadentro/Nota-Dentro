'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Play, RefreshCw, Heart, Zap, Info, ShieldAlert, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RhythmCell, RhythmCellBase, GAME_LEVELS, LevelDefinition } from '../constants/levels';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

type GameState = 'idle' | 'instruction' | 'prep' | 'playing' | 'level_complete' | 'level_failed' | 'game_over' | 'paused';
type BeatResult = 'perfect' | 'early' | 'late' | 'missed' | 'penalty' | 'tied' | null;

interface TapEvent {
  id: string;
  track: 'upper' | 'lower';
  cellIndex: number;
  beatAbsolute: number;
  duration: number;
  type: 'note' | 'rest';
  result: BeatResult;
  releaseResult: BeatResult;
  isHeld: boolean;
}

const getCellDuration = (cellRaw: RhythmCell): number => {
  const cell = cellRaw.replace('_ligada', '') as RhythmCellBase;
  switch (cell) {
    case 'semibreve': return 4.0;
    case 'minima_pontuada': return 3.0;
    case 'minima': 
    case 'pausa_minima':
    case 'colcheia_seminima_colcheia':
      return 2.0;
    case 'seminima_pontuada': return 1.5;
    case 'colcheia_pausa_colcheia':
      return 1.5;
    case 'colcheia_pontuada': return 0.75;
    case 'colcheia':
      return 0.5;
    default: return 1.0;
  }
};

const flattenSequence = (sequence: RhythmCell[], trackId: 'upper' | 'lower'): TapEvent[] => {
  const events: TapEvent[] = [];
  let currentBeat = 0;
  let pendingTieTapEvent: TapEvent | null = null;

  sequence.forEach((cellRaw, cellIndex) => {
    const isLigada = cellRaw.endsWith('_ligada');
    const cell = cellRaw.replace('_ligada', '') as RhythmCellBase;
    
    const cellEvents: TapEvent[] = [];
    
    const addEvent = (duration: number, type: 'note' | 'rest') => {
       const ev: TapEvent = {
          id: `${trackId}-${cellIndex}-${cellEvents.length}`,
          track: trackId,
          cellIndex,
          beatAbsolute: currentBeat,
          duration,
          type,
          result: null,
          releaseResult: null,
          isHeld: false
       };
       cellEvents.push(ev);
       currentBeat += duration;
    };

    switch(cell) {
      case 'semibreve': addEvent(4.0, 'note'); break;
      case 'minima_pontuada': addEvent(3.0, 'note'); break;
      case 'minima': addEvent(2.0, 'note'); break;
      case 'seminima_pontuada': addEvent(1.5, 'note'); break;
      case 'seminima': addEvent(1.0, 'note'); break;
      case 'pausa_minima': addEvent(2.0, 'rest'); break;
      case 'pausa': addEvent(1.0, 'rest'); break;
      case 'colcheia_pontuada': addEvent(0.75, 'note'); break;
      case 'colcheia': addEvent(0.5, 'note'); break;
      case 'duas_colcheias': 
        addEvent(0.5, 'note'); 
        addEvent(0.5, 'note'); 
        break;
      case 'quatro_semicolcheias':
        addEvent(0.25, 'note'); addEvent(0.25, 'note'); addEvent(0.25, 'note'); addEvent(0.25, 'note');
        break;
      case 'pausa_colcheia_colcheia':
        addEvent(0.5, 'rest'); addEvent(0.5, 'note');
        break;
      case 'colcheia_seminima_colcheia':
        addEvent(0.5, 'note'); addEvent(1.0, 'note'); addEvent(0.5, 'note');
        break;
      case 'colcheia_pausa_colcheia':
        addEvent(0.5, 'note'); addEvent(0.5, 'rest'); addEvent(0.5, 'note');
        break;
    }

    if (cellEvents.length > 0) {
       if (pendingTieTapEvent) {
          const firstNote = cellEvents.find(e => e.type === 'note');
          if (firstNote) {
             pendingTieTapEvent.duration += firstNote.duration;
             firstNote.result = 'tied';
             firstNote.releaseResult = 'tied';
             
             if (isLigada && cellEvents.filter(e => e.type === 'note').length === 1) {
                // tieSource remains
             } else {
                pendingTieTapEvent = null;
             }
          }
       }
       
       if (isLigada && !pendingTieTapEvent) {
          const lastNote = [...cellEvents].reverse().find(e => e.type === 'note');
          if (lastNote) {
             pendingTieTapEvent = lastNote;
          }
       }
    }
    
    events.push(...cellEvents);
  });
  
  return events;
};

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
  return osc;
};

const calculateAccuracy = (events: TapEvent[]): number => {
  const notes = events.filter(e => e.type === 'note' && e.result !== 'tied');
  if (notes.length === 0) return 0;
  
  let totalPoints = 0;
  let maxPoints = 0;

  notes.forEach(note => {
    maxPoints += 1.0;
    if (note.result === 'perfect') totalPoints += 1.0;
    else if (note.result === 'early' || note.result === 'late') totalPoints += 0.5;
    
    if (note.duration >= 1.0) {
      maxPoints += 1.0;
      if (note.releaseResult === 'perfect') totalPoints += 1.0;
      else if (note.releaseResult === 'early' || note.releaseResult === 'late') totalPoints += 0.5;
    }
  });

  return Math.round((totalPoints / maxPoints) * 100);
};

export function PerformanceSimulator({ initialLevel, initialDifficulty }: { initialLevel?: number, initialDifficulty?: number }) {
  const { user, addXP, updateProgress, deductLife, buyLives, addCache } = useUser();
  const router = useRouter();
  const [showStore, setShowStore] = useState(false);
  const INITIAL_LIVES = 3;
  const INITIAL_RETRIES = 3;
  const INITIAL_BPM = 60;
  const TOLERANCE_MS = 150; 

  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [retries, setRetries] = useState(INITIAL_RETRIES);
  const [bpm, setBpm] = useState(INITIAL_BPM);
  const [leftPadActive, setLeftPadActive] = useState(false);
  const [rightPadActive, setRightPadActive] = useState(false);
  const [levelDef, setLevelDef] = useState<LevelDefinition>(GAME_LEVELS[0]);
  const [events, setEvents] = useState<TapEvent[]>([]);
  const [levelTotalBeats, setLevelTotalBeats] = useState<number>(100);
  
  const [status, setStatus] = useState<GameState>('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [ghostMsg, setGhostMsg] = useState<{ text: string, id: number, type: BeatResult } | null>(null);

  const accuracy = calculateAccuracy(events);

  // Salvar progresso no Firebase quando a fase for concluída
  useEffect(() => {
    if (status === 'level_complete' && user) {
      const completed = [...(user.progress?.completedLessons || [])];
      const unlocked = [...(user.progress?.unlockedLessons || ['1'])];
      const currentLvlStr = level.toString();
      const nextLvlStr = (level + 1).toString();

      let changed = false;
      if (!completed.includes(currentLvlStr)) {
        completed.push(currentLvlStr);
        changed = true;
      }
      if (!unlocked.includes(nextLvlStr)) {
        unlocked.push(nextLvlStr);
        changed = true;
      }

      if (changed) {
        updateProgress(completed, unlocked);
      }

      if (accuracy >= 80) {
        addXP(Math.round(accuracy * 10));
      }
      if (accuracy >= 98) {
        addCache(1);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  
  const LATENCY_OFFSET_MS = 0.3; 

  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const eventsRef = useRef<TapEvent[]>([]);
  const livesRef = useRef<number>(user ? user.stats.lives : INITIAL_LIVES);
  const scheduledOscillatorsRef = useRef<OscillatorNode[]>([]);

  const getCurrentTimeMs = () => {
    if (audioCtxRef.current) {
      return audioCtxRef.current.currentTime * 1000;
    }
    return performance.now();
  };

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    if (user?.stats?.lives !== undefined) {
      setLives(user.stats.lives);
    }
  }, [user?.stats?.lives]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    tickRef.current = tick;
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialLevel && initialDifficulty && status === 'idle') {
      setLevel(initialLevel);
      setBpm(initialDifficulty);
      startGame(initialLevel, initialDifficulty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLevel, initialDifficulty]);

  useEffect(() => {
    if (status === 'level_failed' || status === 'game_over') {
      scheduledOscillatorsRef.current.forEach(osc => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      scheduledOscillatorsRef.current = [];
      
      if (status === 'level_failed' && audioCtxRef.current) {
        // Efeito Sonoro Nativo: Trombone Triste (Fail)
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        const gain = ctx.createGain();
        
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(196, now); // G3
        osc.frequency.setValueAtTime(196, now + 0.3);
        osc.frequency.linearRampToValueAtTime(185, now + 0.4); // Gb3
        osc.frequency.setValueAtTime(185, now + 0.7);
        osc.frequency.linearRampToValueAtTime(174, now + 0.8); // F3
        osc.frequency.setValueAtTime(174, now + 1.1);
        osc.frequency.linearRampToValueAtTime(164, now + 1.2); // E3
        
        // Tremulação (vibrato) na última nota
        for(let i=0; i<15; i++) {
           osc.frequency.linearRampToValueAtTime(164 + (i%2===0?6:-6), now + 1.2 + i*0.08);
        }

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.setValueAtTime(0.3, now + 2.0);
        gain.gain.linearRampToValueAtTime(0.01, now + 2.5);

        // Filtro para não ficar tão estridente
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.5);
      }
    } else if (status === 'level_complete' && audioCtxRef.current) {
      // Efeito Sonoro Nativo: Acorde de Vitória (Arpejo Maior)
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const now = ctx.currentTime;
      
      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine'; // Som suave
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      // Arpejo de C Maior (Dó, Mi, Sol, Dó)
      playNote(523.25, now, 0.4);        // C5
      playNote(659.25, now + 0.1, 0.4);  // E5
      playNote(783.99, now + 0.2, 0.4);  // G5
      playNote(1046.50, now + 0.3, 0.8); // C6
    }
  }, [status]);

  const penalizedBeatsRef = useRef<Set<string>>(new Set());

  const showGhostMsg = (type: BeatResult, deltaMs?: number) => {
    if (type === 'tied') return;
    
    let msg = "Perfeito!";
    if (type === 'early') msg = "Adiantado";
    if (type === 'late') msg = "Atrasado";
    if (type === 'missed') msg = "Passou!";
    if (type === 'penalty') msg = "Penalidade!";
    
    if (deltaMs !== undefined) {
       const sign = deltaMs > 0 ? '+' : '';
       msg += ` (${sign}${Math.round(deltaMs)}ms)`;
    }

    setGhostMsg({ text: msg, id: Date.now(), type });
  };

  const loseLife = (eventId?: string) => {
    if (eventId !== undefined) {
      if (penalizedBeatsRef.current.has(eventId)) return;
      penalizedBeatsRef.current.add(eventId);
    }

    if (user) {
      deductLife();
      livesRef.current -= 1;
    } else {
      setLives(prev => prev - 1);
    }
  };

  const tickRef = useRef<() => void>(() => {});
  useEffect(() => {
    tickRef.current = tick;
  });

  const tick = () => {
    if (status === 'game_over' || status === 'level_complete' || status === 'level_failed' || status === 'paused') return;

    const beatMs = (60 / bpm) * 1000;
    const elapsed = getCurrentTimeMs() - startTimeRef.current;
    setElapsedTime(elapsed);

    if (elapsed < 0) {
      animationRef.current = requestAnimationFrame(() => {
        if (tickRef.current) tickRef.current();
      });
      return;
    }

    if (status === 'prep') {
      setStatus('playing');
    }

    let changed = false;
    const updatedEvents = [...eventsRef.current];

    updatedEvents.forEach((ev, i) => {
       const expectedTimeMs = ev.beatAbsolute * beatMs;
       const expectedEndTimeMs = (ev.beatAbsolute + ev.duration) * beatMs;

       if (ev.result === null) {
         const timeSinceExpected = elapsed - expectedTimeMs;

         if (timeSinceExpected > TOLERANCE_MS) {
           if (ev.type === 'note') {
              updatedEvents[i] = { ...ev, result: 'missed' };
              changed = true;
              showGhostMsg('missed');
              loseLife(ev.id);
           } else if (ev.type === 'rest') {
              updatedEvents[i] = { ...ev, result: 'perfect' };
              changed = true;
           }
         }
       } else if (ev.isHeld && ev.result !== 'tied') {
         const timeSinceExpectedEnd = elapsed - expectedEndTimeMs;
         if (timeSinceExpectedEnd > TOLERANCE_MS) {
             updatedEvents[i] = { ...ev, isHeld: false, releaseResult: 'late' };
             changed = true;
             loseLife(`${ev.id}-held`);
         }
       }
    });

    if (changed) {
       setEvents(updatedEvents);
    }

    const allProcessed = updatedEvents.every(ev => {
      if (ev.type === 'rest') return ev.result !== null;
      if (ev.result === 'tied') return true;
      if (ev.duration >= 1.0) return ev.result !== null && (ev.releaseResult !== null || ev.result === 'missed');
      return ev.result !== null;
    });

    if (allProcessed && status === 'playing') {
       if ((elapsed / beatMs) >= levelTotalBeats) {
         const finalAccuracy = calculateAccuracy(updatedEvents);
         
         if (finalAccuracy >= 80) {
           setStatus('level_complete');
         } else {
           setStatus('level_failed');
         }
         return;
       }
    }

    animationRef.current = requestAnimationFrame(() => {
      if (tickRef.current) tickRef.current();
    });
  };

  const startLevel = (currentLevel: number, currentBpm: number, keepSequence: boolean = false) => {
    scheduledOscillatorsRef.current.forEach(osc => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    scheduledOscillatorsRef.current = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current && AudioContext) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === 'suspended') ctx.resume();

    const calculateTotalBeats = (evts: TapEvent[], tsNum: number): number => {
      const maxB = evts.reduce((max, ev) => Math.max(max, ev.beatAbsolute + ev.duration), 0);
      return Math.ceil(maxB / tsNum) * tsNum;
    };

    let totalBeats = 0;
    let prepBts = GAME_LEVELS[0].timeSignature[0];

    if (!keepSequence) {
      const index = Math.min(currentLevel - 1, GAME_LEVELS.length - 1);
      const pInfo = GAME_LEVELS[index];
      setLevelDef(pInfo);
      prepBts = pInfo.timeSignature[0];

      const upperEvents = flattenSequence(pInfo.upperVoice, 'upper');
      const lowerEvents = flattenSequence(pInfo.lowerVoice, 'lower');
      const allEvents = [...upperEvents, ...lowerEvents].sort((a, b) => a.beatAbsolute - b.beatAbsolute);
      setEvents(allEvents);
      totalBeats = Math.ceil(calculateTotalBeats(allEvents, pInfo.timeSignature[0]));
      setLevelTotalBeats(totalBeats);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      prepBts = levelDef.timeSignature[0];
      const resetEvents = eventsRef.current.map(e => ({ ...e, result: (e.result === 'tied' ? 'tied' : null) as BeatResult, releaseResult: (e.releaseResult === 'tied' ? 'tied' : null) as BeatResult, isHeld: false }));
      setEvents(resetEvents);
      setLives(INITIAL_LIVES);
      totalBeats = Math.ceil(calculateTotalBeats(resetEvents as TapEvent[], levelDef.timeSignature[0]));
      setLevelTotalBeats(totalBeats);
    }
    
    setStatus('instruction');
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    penalizedBeatsRef.current.clear();
  };

  const beginPrep = (currentBpm: number, totalBeats: number, ctx: AudioContext | null, prepBts: number) => {
    setStatus('prep');
    setGhostMsg(null);

    const nowTimeMs = getCurrentTimeMs();
    const beatSec = 60 / currentBpm;
    const beatMs = beatSec * 1000;

    if (ctx) {
      for (let i = 0; i <= prepBts + totalBeats; i++) {
        const freq = (i % prepBts === 0) ? 1200 : 800;
        const osc = scheduleClick(ctx, freq, (nowTimeMs / 1000) + 0.1 + i * beatSec);
        scheduledOscillatorsRef.current.push(osc);
      }
    }

    startTimeRef.current = nowTimeMs + 100 + (prepBts * beatMs);

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => {
      if (tickRef.current) tickRef.current();
    });
  };

  const acceptInstruction = () => {
    if (!audioCtxRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
        audioCtxRef.current.resume();
      }
    }
    beginPrep(bpm, levelTotalBeats, audioCtxRef.current, levelDef.timeSignature[0]);
  };

  const pauseGame = () => {
    if (status !== 'playing' && status !== 'prep') return;
    setStatus('paused');
    if (audioCtxRef.current) audioCtxRef.current.suspend();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const resumeGame = () => {
    setStatus(elapsedTime < 0 ? 'prep' : 'playing');
    if (audioCtxRef.current) audioCtxRef.current.resume();
    animationRef.current = requestAnimationFrame(() => {
      if (tickRef.current) tickRef.current();
    });
  };

  const repeatLevel = () => {
    if (retries > 0) {
      setRetries(r => r - 1);
      startLevel(level, bpm, true);
    } else {
      setStatus('game_over');
    }
  };

  const startGame = (overrideLevel?: number, overrideBpm?: number) => {
    const l = overrideLevel ?? level;
    const b = overrideBpm ?? INITIAL_BPM;

    const currentLives = user ? user.stats.lives : lives;
    if (currentLives <= 0) {
      setShowStore(true);
      return;
    }

    setLevel(l);
    setLives(currentLives);
    setRetries(INITIAL_RETRIES);
    setBpm(b);
    startLevel(l, b);
  };

  const nextLevel = () => {
    const nextLvl = level + 1;
    setLevel(nextLvl);
    setRetries(INITIAL_RETRIES);
    startLevel(nextLvl, bpm);
  };

  const handleTap = (track: 'upper' | 'lower') => {
    if (audioCtxRef.current) {
      scheduleClick(audioCtxRef.current, track === 'upper' ? 600 : 400, audioCtxRef.current.currentTime);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
        scheduleClick(audioCtxRef.current, 400, audioCtxRef.current.currentTime);
      }
    }

    if (status === 'game_over' || status === 'level_complete' || status === 'level_failed' || status === 'idle' || status === 'instruction') return;

    const beatMs = (60 / bpm) * 1000;
    const elapsed = getCurrentTimeMs() - startTimeRef.current - LATENCY_OFFSET_MS;
    
    let closestEventIndex = -1;
    let minDelta = Infinity;

    eventsRef.current.forEach((ev, idx) => {
       if (ev.track === track && ev.result === null) {
          const expectedTimeMs = ev.beatAbsolute * beatMs;
          const delta = Math.abs(elapsed - expectedTimeMs);
          if (delta < minDelta) {
             minDelta = delta;
             closestEventIndex = idx;
          }
       }
    });

    if (closestEventIndex !== -1 && minDelta <= TOLERANCE_MS) {
       const ev = eventsRef.current[closestEventIndex];
       const expectedTimeMs = ev.beatAbsolute * beatMs;
       const delta = elapsed - expectedTimeMs;

       setEvents(prev => {
          const next = [...prev];
          
          if (ev.type === 'rest') {
             next[closestEventIndex] = { ...ev, result: 'penalty' };
             showGhostMsg('penalty');
             loseLife(ev.id);
          } else {
             let type: BeatResult = 'perfect';
             if (delta < -TOLERANCE_MS / 3) type = 'early';
             else if (delta > TOLERANCE_MS / 3) type = 'late';
             else type = 'perfect';

             next[closestEventIndex] = { ...ev, result: type, isHeld: ev.duration >= 1.0 };
             showGhostMsg(type, delta);
          }
          return next;
       });
    }
  };

  const handleRelease = (track: 'upper' | 'lower') => {
    if (status === 'game_over' || status === 'level_complete' || status === 'level_failed' || status === 'idle' || status === 'instruction') return;

    const beatMs = (60 / bpm) * 1000;
    const elapsed = getCurrentTimeMs() - startTimeRef.current - LATENCY_OFFSET_MS;

    let heldEventIndex = eventsRef.current.findIndex(ev => ev.track === track && ev.isHeld);

    if (heldEventIndex !== -1) {
       const ev = eventsRef.current[heldEventIndex];
       const expectedEndTimeMs = (ev.beatAbsolute + ev.duration) * beatMs;
       const delta = elapsed - expectedEndTimeMs;
       
       const earlyTolerance = TOLERANCE_MS + (ev.duration * beatMs * 0.20);

       setEvents(prev => {
          const next = [...prev];
          
          if (delta < -earlyTolerance) {
             next[heldEventIndex] = { ...ev, isHeld: false, releaseResult: 'early' };
             showGhostMsg('early');
             loseLife(`${ev.id}-release`);
          } else {
             next[heldEventIndex] = { ...ev, isHeld: false, releaseResult: 'perfect' };
             showGhostMsg('perfect');
          }
          return next;
       });
    }
  };

  const handleKeyDownRef = useRef<(e: KeyboardEvent) => void>(() => {});
  const handleKeyUpRef = useRef<(e: KeyboardEvent) => void>(() => {});

  useEffect(() => {
    handleKeyDownRef.current = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const isSingleTrack = levelDef.lowerVoice.length === 0;
      if (e.key.toLowerCase() === 'f') {
        if (status === 'level_complete') { repeatLevel(); return; }
        if (status === 'level_failed') { repeatLevel(); return; }
        if (status === 'instruction') { acceptInstruction(); return; }
        if (status === 'paused') { resumeGame(); return; }
        setLeftPadActive(true); handleTap(isSingleTrack ? 'upper' : 'lower');
      }
      if (e.key.toLowerCase() === 'j') {
        if (status === 'level_complete') { nextLevel(); return; }
        if (status === 'level_failed') { nextLevel(); return; }
        if (status === 'instruction') { acceptInstruction(); return; }
        if (status === 'paused') { resumeGame(); return; }
        setRightPadActive(true); handleTap('upper');
      }
      if (e.key === 'Escape') {
        if (status === 'playing' || status === 'prep') { pauseGame(); return; }
        if (status === 'paused') { resumeGame(); return; }
      }
    };

    handleKeyUpRef.current = (e: KeyboardEvent) => {
      const isSingleTrack = levelDef.lowerVoice.length === 0;
      if (e.key.toLowerCase() === 'f') { setLeftPadActive(false); handleRelease(isSingleTrack ? 'upper' : 'lower'); }
      if (e.key.toLowerCase() === 'j') { setRightPadActive(false); handleRelease('upper'); }
    };
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyDownRef.current(e);
    const handleKeyUp = (e: KeyboardEvent) => handleKeyUpRef.current(e);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getResultColor = (r: BeatResult | undefined) => {
    if (r === 'tied') return 'text-brand-gold border-brand-gold';
    switch (r) {
      case 'perfect': return 'text-green-500 border-green-500';
      case 'early': return 'text-yellow-500 border-yellow-500';
      case 'late': return 'text-orange-500 border-orange-500';
      case 'missed': return 'text-red-500 border-red-500';
      case 'penalty': return 'text-purple-500 border-purple-500'; 
      default: return 'text-brand-gray/30 border-transparent bg-brand-gray/10';
    }
  };

  const getResultBg = (r: BeatResult | undefined) => {
    if (r === 'tied') return 'bg-brand-gold/30';
    switch (r) {
      case 'perfect': return 'bg-green-500/20';
      case 'early': return 'bg-yellow-500/20';
      case 'late': return 'bg-orange-500/20';
      case 'missed': return 'bg-red-500/20';
      case 'penalty': return 'bg-purple-500/20';
      default: return 'bg-transparent';
    }
  };

  const beatMs = (60 / bpm) * 1000;
  const visualBeatFloat = elapsedTime / beatMs;
  const prepBeats = levelDef.timeSignature[0];

  const buildVisualCells = (sequence: RhythmCell[]) => {
    const visuals: { cellRaw: RhythmCell, absoluteBeat: number }[] = [];
    let currentBeat = 0;
    sequence.forEach(cellRaw => {
      visuals.push({ cellRaw, absoluteBeat: currentBeat });
      currentBeat += getCellDuration(cellRaw);
    });
    return visuals;
  };

  const isNoteActiveGlobal = (ev: TapEvent | undefined) => {
    if (!ev) return false;
    return visualBeatFloat >= ev.beatAbsolute && visualBeatFloat < ev.beatAbsolute + 0.2;
  };

  const getColorCodeGlobal = (ev: TapEvent | undefined, isActive: boolean) => {
    if (!ev) return isActive ? "#F2D349" : "#1A1A1A";
    if (ev.result === 'missed' || ev.result === 'penalty' || ev.releaseResult === 'early') return "#ef4444";
    if (ev.isHeld || ev.result === 'perfect' || ev.result === 'early' || ev.result === 'late' || ev.result === 'tied' || isActive) return "#F2D349";
    return "#1A1A1A";
  };

  const getBgClassGlobal = (ev: TapEvent | undefined, isActive: boolean) => {
    if (!ev) return isActive ? "bg-brand-gold" : "bg-[#1A1A1A]";
    if (ev.result === 'missed' || ev.result === 'penalty' || ev.releaseResult === 'early') return "bg-red-500";
    if (ev.isHeld || ev.result === 'perfect' || ev.result === 'early' || ev.result === 'late' || ev.result === 'tied' || isActive) return "bg-brand-gold";
    return "bg-[#1A1A1A]";
  };

  const renderLigaduraDynamicGlobal = (cellRawStr: RhythmCell) => {
    const tieWidth = Math.max(10, getCellDuration(cellRawStr) * 80 - 30);
    return (
      <svg 
        className="absolute top-[60%] z-10 pointer-events-none overflow-visible" 
        style={{ left: '50%', transform: 'translateX(15px)', width: `${tieWidth}px`, height: '24px' }}
        viewBox={`0 0 ${tieWidth} 24`}
      >
        <path 
          d={`M 0 0 Q ${tieWidth / 2} 24 ${tieWidth} 0`} 
          fill="transparent" 
          stroke="#F2D349" 
          strokeWidth="3" 
          strokeLinecap="round" 
          opacity="0.6" 
        />
      </svg>
    );
  };

  const renderTrack = (trackId: 'upper' | 'lower', sequence: RhythmCell[]) => {
    const visualCells = buildVisualCells(sequence);

    const renderProgressBar = (widthClass: string, ev: TapEvent | undefined) => {
      return (
        <div className={cn(`${widthClass} h-2 mt-2 rounded-full border-2 overflow-hidden relative transition-colors`, getResultColor(ev?.result), getResultBg(ev?.result))}>
          <div 
            className={cn("absolute left-0 top-0 bottom-0", ev?.result === 'tied' ? 'bg-brand-gold' : 'bg-green-500')} 
            style={{ 
              width: (ev?.isHeld || ev?.result === 'tied' || ev?.releaseResult === 'perfect' || ev?.releaseResult === 'early') ? '100%' : '0%', 
              transition: ev?.isHeld ? `width ${ev.duration * beatMs}ms linear` : 'none' 
            }} 
          />
        </div>
      );
    };

    return (
      <div 
        className="absolute h-full flex items-center top-0 bottom-0"
        style={{
           left: '25%', 
           transform: `translateX(-${(visualBeatFloat + prepBeats) * 80}px)`, 
           transition: 'transform 0.05s linear'
        }}
      >
        {/* Fórmula de Compasso */}
        <div 
          className="absolute flex flex-col items-center justify-center h-full text-brand-graphite font-headline font-black text-5xl select-none z-0"
          style={{ left: `${(-0.8 + prepBeats) * 80}px` }}
        >
          <span className="leading-none">{levelDef.timeSignature[0]}</span>
          <span className="leading-none">{levelDef.timeSignature[1]}</span>
        </div>

        {(() => {
          const isTrackHolding = events.some(e => e.track === trackId && e.isHeld);
          return visualCells.map((vis, cellIndex) => {
          const cellRaw = vis.cellRaw;
          const isLigada = cellRaw.endsWith('_ligada');
          const cellStr = cellRaw.replace('_ligada', '') as RhythmCellBase;
          const isPontuada = cellStr.endsWith('_pontuada');
          const baseName = cellStr.replace('_pontuada', '');

          const beatIndex = vis.absoluteBeat;
          const cellEvents = events.filter(e => e.track === trackId && e.cellIndex === cellIndex);
          const cellDuration = getCellDuration(cellRaw);
          const isCellPlaying = visualBeatFloat >= beatIndex && visualBeatFloat < beatIndex + cellDuration;
          const shouldWiggle = isTrackHolding && isCellPlaying && (cellEvents[0]?.isHeld || cellEvents[0]?.result === 'tied');

          // Logic to center whole-measure notes if they don't need to align with subdivisions
          const isFullMeasure = cellDuration === levelDef.timeSignature[0];
          const otherEventsInMeasure = events.filter(e => e.track !== trackId && e.beatAbsolute >= beatIndex && e.beatAbsolute < beatIndex + cellDuration);
          const isOtherTrackSimple = otherEventsInMeasure.length <= 1;
          const shouldCenter = isFullMeasure && isOtherTrackSimple;

          const isNoteActive = (ev: TapEvent | undefined) => isNoteActiveGlobal(ev);
          const getColorCode = (ev: TapEvent | undefined, isActive: boolean) => getColorCodeGlobal(ev, isActive);
          const getBgClass = (ev: TapEvent | undefined, isActive: boolean) => getBgClassGlobal(ev, isActive);
          const renderLigaduraDynamic = () => renderLigaduraDynamicGlobal(cellRaw);

          return (
            <div 
              key={`${trackId}-${cellIndex}`} 
              className={cn("absolute flex flex-row items-center h-full gap-1", shouldCenter ? "justify-center" : "justify-start pl-6")}
              style={{ left: `${(beatIndex + prepBeats) * 80}px`, width: `${getCellDuration(cellRaw) * 80}px` }}
            >
              {baseName === 'semibreve' && (
                <div className="flex flex-col items-center relative">
                  <div 
                    className={cn("w-20 h-14 transition-all flex items-center justify-center relative", isNoteActive(cellEvents[0]) && !cellEvents[0]?.isHeld ? "-translate-y-2 scale-110 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}
                    style={shouldWiggle ? { animation: 'wiggle 0.2s ease-in-out infinite', filter: 'drop-shadow(0 0 15px rgba(242,211,73,0.8))' } : {}}
                  >
                    <div className={cn("absolute inset-0 transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/semibreve.svg)', maskImage: 'url(/assets/svg/semibreve.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className="absolute -right-3 top-6 w-2 h-2 rounded-full bg-brand-gold" />}
                  {isLigada && renderLigaduraDynamic()}
                  {renderProgressBar("w-16", cellEvents[0])}
                </div>
              )}
              {baseName === 'minima' && (
                <div className="flex flex-col items-center relative">
                  <div 
                    className={cn("w-14 h-14 transition-all flex items-center justify-center relative", isNoteActive(cellEvents[0]) && !cellEvents[0]?.isHeld ? "-translate-y-2 scale-110 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}
                    style={shouldWiggle ? { animation: 'wiggle 0.2s ease-in-out infinite', filter: 'drop-shadow(0 0 15px rgba(242,211,73,0.8))' } : {}}
                  >
                    <div className={cn("absolute inset-0 transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/minima.svg)', maskImage: 'url(/assets/svg/minima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className="absolute -right-3 top-6 w-2 h-2 rounded-full bg-brand-gold" />}
                  {isLigada && renderLigaduraDynamic()}
                  {renderProgressBar("w-12", cellEvents[0])}
                </div>
              )}
              {baseName === 'seminima' && (
                <div className="flex flex-col items-center relative">
                  <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/seminima.svg)', maskImage: 'url(/assets/svg/seminima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className="absolute -right-3 top-6 w-2 h-2 rounded-full bg-brand-gold" />}
                  {isLigada && renderLigaduraDynamic()}
                  {renderProgressBar("w-8", cellEvents[0])}
                </div>
              )}
              {baseName === 'pausa' && (
                <div className="flex flex-col items-center">
                  <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/pausa-seminima.svg)', maskImage: 'url(/assets/svg/pausa-seminima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {renderProgressBar("w-8", cellEvents[0])}
                </div>
              )}
              {baseName === 'pausa_minima' && (
                <div className="flex flex-col items-center">
                  <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/pausa-minima.svg)', maskImage: 'url(/assets/svg/pausa-minima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {renderProgressBar("w-12", cellEvents[0])}
                </div>
              )}
              {baseName === 'colcheia' && (
                <div className="flex flex-col items-center relative">
                  <div className={cn("w-6 h-10 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-1 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/colcheia.svg)', maskImage: 'url(/assets/svg/colcheia.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className="absolute -right-3 top-6 w-2 h-2 rounded-full bg-brand-gold" />}
                  {isLigada && renderLigaduraDynamic()}
                  {renderProgressBar("w-4", cellEvents[0])}
                </div>
              )}
              {baseName === 'duas_colcheias' && (() => {
                const ev0 = cellEvents[0];
                const ev1 = cellEvents[1];
                const active0 = isNoteActive(ev0);
                const active1 = isNoteActive(ev1);
                
                const color0 = getColorCode(ev0, active0);
                const color1 = getColorCode(ev1, active1);
                
                let bgClass = "bg-black";
                let style: React.CSSProperties = {};
                
                if (color0 === color1) {
                  if (color0 === "#F2D349") bgClass = "bg-brand-gold";
                  else if (color0 === "#ef4444") bgClass = "bg-red-500";
                  else bgClass = "bg-[#1A1A1A]";
                } else {
                  style = { background: `linear-gradient(to right, ${color0} 50%, ${color1} 50%)` };
                }
                
                const anyActive = active0 || active1;
                
                return (
                  <div className="flex flex-col items-center relative">
                    <div className={cn("w-14 h-12 transition-all flex items-center justify-center", anyActive ? "-translate-y-1 scale-110 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                      <div 
                        className={cn("w-full h-full transition-colors", bgClass)} 
                        style={{ 
                          ...style,
                          WebkitMaskImage: 'url(/assets/svg/duas_colcheias.svg)', 
                          maskImage: 'url(/assets/svg/duas_colcheias.svg)', 
                          WebkitMaskSize: 'contain', 
                          WebkitMaskRepeat: 'no-repeat', 
                          WebkitMaskPosition: 'center' 
                        }} 
                      />
                    </div>
                    <div className="flex flex-row w-full justify-evenly mt-1">
                      {renderProgressBar("w-4", ev0)}
                      {renderProgressBar("w-4", ev1)}
                    </div>
                    {isLigada && renderLigaduraDynamic()}
                  </div>
                );
              })()}
              {baseName === 'quatro_semicolcheias' && (() => {
                const ev0 = cellEvents[0];
                const ev1 = cellEvents[1];
                const ev2 = cellEvents[2];
                const ev3 = cellEvents[3];
                const active0 = isNoteActive(ev0);
                const active1 = isNoteActive(ev1);
                const active2 = isNoteActive(ev2);
                const active3 = isNoteActive(ev3);
                const anyActive = active0 || active1 || active2 || active3;

                const c0 = getColorCode(ev0, active0);
                const c1 = getColorCode(ev1, active1);
                const c2 = getColorCode(ev2, active2);
                const c3 = getColorCode(ev3, active3);

                let bgClass = "bg-black";
                let style: React.CSSProperties = {};

                if (c0 === c1 && c1 === c2 && c2 === c3) {
                  if (c0 === "#F2D349") bgClass = "bg-brand-gold";
                  else if (c0 === "#ef4444") bgClass = "bg-red-500";
                  else bgClass = "bg-black";
                } else {
                  style = { background: `linear-gradient(to right, ${c0} 25%, ${c1} 25% 50%, ${c2} 50% 75%, ${c3} 75%)` };
                }

                return (
                  <div className="flex flex-col items-center relative w-full">
                    <div className={cn("w-20 h-12 transition-all flex items-center justify-center", anyActive ? "-translate-y-1 scale-110 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                      <div 
                        className={cn("w-full h-full transition-colors", bgClass)} 
                        style={{ 
                          ...style,
                          WebkitMaskImage: 'url(/assets/svg/quatro_semicolcheias.svg)', 
                          maskImage: 'url(/assets/svg/quatro_semicolcheias.svg)', 
                          WebkitMaskSize: 'contain', 
                          WebkitMaskRepeat: 'no-repeat', 
                          WebkitMaskPosition: 'center' 
                        }} 
                      />
                    </div>
                    <div className="flex flex-row w-full justify-evenly mt-1 px-1">
                      {renderProgressBar("w-3", ev0)}
                      {renderProgressBar("w-3", ev1)}
                      {renderProgressBar("w-3", ev2)}
                      {renderProgressBar("w-3", ev3)}
                    </div>
                    {isLigada && renderLigaduraDynamic()}
                  </div>
                );
              })()}
              {baseName === 'colcheia_seminima_colcheia' && (() => {
                const ev0 = cellEvents[0];
                const ev1 = cellEvents[1];
                const ev2 = cellEvents[2];
                return (
                  <div className="flex flex-row items-end gap-2 relative">
                    <div className="flex flex-col items-center">
                      <div className={cn("w-6 h-10 transition-all flex items-center justify-center", isNoteActive(ev0) ? "-translate-y-1 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                        <div className={cn("w-full h-full transition-colors", getBgClass(ev0, isNoteActive(ev0)))} style={{ WebkitMaskImage: 'url(/assets/svg/colcheia.svg)', maskImage: 'url(/assets/svg/colcheia.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                      </div>
                      {renderProgressBar("w-4", ev0)}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(ev1) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                        <div className={cn("w-full h-full transition-colors", getBgClass(ev1, isNoteActive(ev1)))} style={{ WebkitMaskImage: 'url(/assets/svg/seminima.svg)', maskImage: 'url(/assets/svg/seminima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                      </div>
                      {renderProgressBar("w-8", ev1)}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={cn("w-6 h-10 transition-all flex items-center justify-center", isNoteActive(ev2) ? "-translate-y-1 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                        <div className={cn("w-full h-full transition-colors", getBgClass(ev2, isNoteActive(ev2)))} style={{ WebkitMaskImage: 'url(/assets/svg/colcheia.svg)', maskImage: 'url(/assets/svg/colcheia.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                      </div>
                      {renderProgressBar("w-4", ev2)}
                    </div>
                    {isLigada && renderLigaduraDynamic()}
                  </div>
                );
              })()}
            </div>
          );
        });
        })()}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-black font-body relative overflow-hidden select-none px-4">
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(-8px) rotate(-3deg) scale(1.1); }
          50% { transform: translateY(-8px) rotate(3deg) scale(1.1); }
        }
      `}</style>
      
      {/* Header with Back, Lives, Cache, BPM and Pause */}
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

         {/* Cachê UI */}
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

      <div className="flex flex-col items-center w-full max-w-5xl relative mt-1">
        {/* OVERLAYS */}
        {status === 'paused' && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md px-4">
            <div className="max-w-xl text-center flex flex-col items-center">
              <h2 className="text-5xl font-headline font-black text-brand-gold mb-8 uppercase tracking-tight drop-shadow-[0_0_15px_rgba(242,211,73,0.5)]">
                Pausado
              </h2>
              <div className="flex flex-col gap-4 w-64">
                <Button onClick={resumeGame} className="w-full py-6 text-xl font-bold rounded-full bg-white text-brand-black hover:bg-gray-200 shadow-lg">
                  Continuar
                </Button>
                <Button onClick={repeatLevel} variant="outline" className="w-full py-6 text-xl font-bold rounded-full border-2 border-brand-gray text-white hover:bg-brand-gray/20">
                  Recomeçar Fase
                </Button>
                <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="w-full py-6 text-xl font-bold rounded-full text-red-400 hover:text-red-300 hover:bg-red-400/10">
                  Sair para o Menu
                </Button>
              </div>
            </div>
          </div>
        )}

        {status === 'instruction' && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md px-4">
            <div className="max-w-xl text-center flex flex-col items-center">
              <Info className="w-16 h-16 text-brand-gold mb-6" />
              <h2 className="text-4xl font-headline font-black text-white mb-6 uppercase tracking-tight">{levelDef.instruction?.title || "Nível " + level}</h2>
              <p className="text-brand-gray text-xl mb-12 leading-relaxed">{levelDef.instruction?.text || "Prepare-se para tocar a partitura!"}</p>
              <div className="flex flex-col gap-4 w-full">
                <Button onClick={acceptInstruction} className="px-10 py-8 rounded-full bg-brand-gold hover:bg-yellow-400 text-brand-black text-2xl font-bold shadow-lg shadow-brand-gold/20">
                  Toque para Iniciar
                </Button>
                <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="px-10 py-6 rounded-full text-brand-gray hover:text-white hover:bg-white/10 text-xl font-bold">
                  Sair para o Menu
                </Button>
              </div>
            </div>
          </div>
        )}

        {status === 'level_failed' && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md px-4">
            <div className="max-w-xl text-center flex flex-col items-center">
              <ShieldAlert className="w-16 h-16 text-orange-500 mb-6" />
              <h2 className="text-4xl font-headline font-black text-orange-500 mb-2 uppercase tracking-tight">Você Errou!</h2>
              <p className="text-brand-gray text-xl mb-8">O ritmo saiu de controle e a música parou.</p>
              <div className="mb-8">
                <span className="text-white text-lg block mb-2">Tentativas Restantes da Fase</span>
                <div className="flex gap-2 justify-center">
                  {[...Array(INITIAL_RETRIES)].map((_, i) => (
                    <div key={i} className={cn("w-4 h-4 rounded-full", i < retries ? "bg-orange-500" : "bg-brand-graphite")} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Button onClick={repeatLevel} className="px-8 py-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-2xl font-bold shadow-lg shadow-orange-500/20">
                  <RefreshCw className="mr-3 w-6 h-6" /> Tentar Novamente
                </Button>
                <Button onClick={nextLevel} className="px-8 py-8 rounded-full bg-brand-graphite hover:bg-brand-gray/20 text-brand-gray text-xl font-bold border-2 border-brand-gray/30">
                  Pular Fase
                </Button>
              </div>
              <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="text-brand-gray hover:text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-bold">
                Sair para o Menu
              </Button>
            </div>
          </div>
        )}

        {status === 'game_over' && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md">
            <h2 className="text-5xl font-headline font-black text-red-500 mb-2 uppercase tracking-tight">Game Over Total</h2>
            <p className="text-brand-gray text-xl mb-8">Você esgotou todas as tentativas para esta fase.</p>
            <Button onClick={() => router.push('/ritmo-insano')} className="px-10 py-8 rounded-full bg-red-600 hover:bg-red-500 text-white text-2xl font-bold shadow-lg shadow-red-500/20">
              Voltar para o Menu
            </Button>
          </div>
        )}

        {status === 'level_complete' && (
          <div className="absolute inset-0 bg-brand-black/90 z-20 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm animate-in fade-in duration-500">
            <h2 className="text-4xl font-black text-brand-gold mb-2 uppercase tracking-widest drop-shadow-lg">Concluído!</h2>
            <div className="text-white text-xl mb-4 font-bold flex items-center justify-center gap-2">
              Precisão: <span className={accuracy >= 80 ? 'text-green-400 text-2xl' : accuracy >= 50 ? 'text-yellow-400 text-2xl' : 'text-red-400 text-2xl'}>{accuracy}%</span>
            </div>
            {accuracy >= 98 && (
              <div className="mb-6 bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce">
                <Zap className="w-5 h-5 fill-brand-gold" />
                +1 Cachê Bônus! (&ge; 98%)
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button onClick={() => startLevel(level, bpm, true)} className="px-8 py-4 bg-brand-graphite text-white font-bold rounded-xl">Repetir</Button>
              <Button onClick={nextLevel} className="px-8 py-4 bg-brand-gold text-brand-black font-bold rounded-xl">Avançar</Button>
            </div>
            <Button onClick={() => router.push('/ritmo-insano')} variant="ghost" className="mt-4 text-brand-gray hover:text-white hover:bg-white/10 px-8 py-2 rounded-full font-bold">
              Sair para o Menu
            </Button>
          </div>
        )}
        
        {/* MODAL DA LOJA */}
        {showStore && (
          <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-2xl relative">
              <button onClick={() => setShowStore(false)} className="absolute top-4 right-4 text-brand-gray hover:text-brand-black">✕</button>
              <div className="w-16 h-16 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 fill-brand-gold" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-brand-black">Suas vidas acabaram!</h3>
              <p className="text-brand-gray mb-6">Você precisa de mais Vidas para continuar treinando o ritmo. Use seu Cachê ou adquira mais!</p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex justify-between items-center">
                <span className="font-bold text-slate-600">Seu Saldo:</span>
                <span className="font-black text-brand-gold text-xl flex items-center gap-1">
                  <Zap className="w-5 h-5 fill-brand-gold" />
                  {user?.stats?.cache ?? 0}
                </span>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={async () => {
                    if (!user) return;
                    const success = await buyLives(50, 3);
                    if (success) {
                      setShowStore(false);
                    } else {
                      alert('Cachê insuficiente!');
                    }
                  }}
                  className="w-full bg-brand-black hover:bg-brand-gray text-white font-bold py-6 text-lg rounded-xl flex justify-between items-center px-6"
                >
                  <span>Recuperar 5 Vidas</span>
                  <span className="flex items-center text-brand-gold gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                    50 <Zap className="w-4 h-4 fill-brand-gold" />
                  </span>
                </Button>
                
                <Button 
                  onClick={() => alert('Integração com Stripe em breve!')}
                  className="w-full border-brand-gold/30 border-2 text-brand-gold font-bold py-6 text-lg rounded-xl hover:bg-brand-gold hover:text-white transition-colors"
                >
                  Comprar 100 Cachês por R$ 4,90
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Level Title */}
        <div className="flex flex-col items-center mb-12 w-full text-center">
           <span className="text-brand-gray text-[10px] md:text-sm uppercase font-bold tracking-widest">Nível {level} - {levelDef.name}</span>
           <span className="text-brand-gold font-headline text-lg md:text-2xl font-black">Compasso {levelDef.timeSignature[0]}/{levelDef.timeSignature[1]}</span>
        </div>

        {/* Wrapper da Pauta e Ghost Message */}
        <div className="w-full relative">
          
          {/* Ghost Message */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-10 flex items-center justify-center pointer-events-none z-50">
            {ghostMsg && (
              <div 
                key={ghostMsg.id} 
                className={cn(
                  "font-headline text-2xl md:text-3xl font-black animate-ping-short drop-shadow-md whitespace-nowrap",
                  ghostMsg.type === 'perfect' ? 'text-green-400' :
                  ghostMsg.type === 'penalty' ? 'text-purple-400' :
                  ghostMsg.type === 'missed' ? 'text-red-400' : 'text-yellow-400'
                )}
              >
                {ghostMsg.text}
              </div>
            )}
          </div>

          {/* Pauta Polirrítmica */}
          <div className="w-full h-72 relative bg-white rounded-2xl mb-2 flex flex-col overflow-hidden border-2 border-brand-gray/30 shadow-inner">
          
          {/* Fundo do Grid com Barras de Compasso */}
          <div 
            className="absolute inset-0 flex"
            style={{
               left: '25%', 
               transform: `translateX(-${(visualBeatFloat + prepBeats) * 80}px)`, 
               transition: 'transform 0.05s linear'
            }}
          >
             {/* Batidas preparatórias */}
             {Array.from({ length: prepBeats }).map((_, i) => {
               const prepBeat = -prepBeats + i;
               return (
                 <div 
                   key={`prep-${prepBeat}`}
                   className="absolute flex flex-col items-center h-full justify-center"
                   style={{ left: `${(prepBeat + prepBeats) * 80}px`, width: '80px' }}
                 >
                   <div className={cn(
                     "w-3 h-3 rounded-full bg-brand-gray/30 transition-transform",
                     Math.abs(visualBeatFloat - prepBeat) < 0.2 ? "scale-150 bg-brand-gold/80" : ""
                   )} />
                 </div>
               );
             })}

             {/* Linhas de grade e compasso */}
             {Array.from({ length: levelTotalBeats }).map((_, beatIndex) => (
                <div 
                  key={`grid-${beatIndex}`}
                  className={cn(
                    "absolute h-full border-r border-brand-gray/20", 
                    beatIndex % levelDef.timeSignature[0] === 0 ? "border-l-4 border-l-brand-graphite/60" : ""
                  )}
                  style={{ left: `${(beatIndex + prepBeats) * 80}px`, width: '80px' }}
                />
             ))}

             {/* Barra Final Dupla */}
             <div 
               className="absolute h-full flex z-0"
               style={{ left: `${(levelTotalBeats + prepBeats) * 80}px` }}
             >
               <div className="w-1 h-full bg-brand-graphite/60 mr-1" />
               <div className="w-4 h-full bg-brand-graphite/60" />
             </div>
          </div>

          {levelDef.lowerVoice.length === 0 ? (
            <div className="flex-1 relative overflow-visible flex flex-col justify-center">
              {renderTrack('upper', levelDef.upperVoice)}
            </div>
          ) : (
            <>
              <div className="flex-1 relative border-b-2 border-brand-gray/20 overflow-visible">
                <div className="absolute left-2 top-2 bg-brand-graphite text-white font-bold px-2 py-1 rounded text-xs z-10">
                  Voz 1 <span className="hidden md:inline">(J)</span>
                </div>
                {renderTrack('upper', levelDef.upperVoice)}
              </div>
              <div className="flex-1 relative overflow-visible">
                <div className="absolute left-2 bottom-2 bg-brand-graphite text-white font-bold px-2 py-1 rounded text-xs z-10">
                  Voz 2 <span className="hidden md:inline">(F)</span>
                </div>
                {renderTrack('lower', levelDef.lowerVoice)}
              </div>
            </>
          )}
        </div>
        </div>

        {/* Controles e Botões PAD */}
        <div className="flex flex-col items-center w-full max-w-lg relative">
          {status === 'idle' && (
            <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md px-4">
               <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="flex justify-center gap-12 w-full">
            {/* PAD F */}
            <div className="flex flex-col items-center gap-4">
              <Button
                onPointerDown={(e) => { e.preventDefault(); setLeftPadActive(true); handleTap(levelDef.lowerVoice.length === 0 ? 'upper' : 'lower'); }}
                onPointerUp={() => { setLeftPadActive(false); handleRelease(levelDef.lowerVoice.length === 0 ? 'upper' : 'lower'); }}
                onPointerLeave={() => { setLeftPadActive(false); handleRelease(levelDef.lowerVoice.length === 0 ? 'upper' : 'lower'); }}
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

      </div>
    </div>
  );
}
