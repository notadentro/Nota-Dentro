'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw, Heart, Zap, Info, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeSignature, RhythmCell, RhythmCellBase, GAME_LEVELS, LevelDefinition } from '../constants/levels';

type GameState = 'idle' | 'instruction' | 'prep' | 'playing' | 'level_complete' | 'level_failed' | 'game_over';
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

export function PerformanceSimulator() {
  const INITIAL_LIVES = 5;
  const INITIAL_RETRIES = 5;
  const INITIAL_BPM = 60;
  const TOLERANCE_MS = 150; 

  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [retries, setRetries] = useState(INITIAL_RETRIES);
  const [bpm, setBpm] = useState(INITIAL_BPM);
  const [selectedDifficulty, setSelectedDifficulty] = useState<60 | 70 | 90>(60);
  const [leftPadActive, setLeftPadActive] = useState(false);
  const [rightPadActive, setRightPadActive] = useState(false);
  const [levelDef, setLevelDef] = useState<LevelDefinition>(GAME_LEVELS[0]);
  const [events, setEvents] = useState<TapEvent[]>([]);
  const [levelTotalBeats, setLevelTotalBeats] = useState<number>(100);
  
  const [status, setStatus] = useState<GameState>('idle');
  const [elapsedTime, setElapsedTime] = useState(-4 * (60 / INITIAL_BPM * 1000));
  const [ghostMsg, setGhostMsg] = useState<{ text: string, id: number, type: BeatResult } | null>(null);
  
  const LATENCY_OFFSET_MS = 0.3; 

  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const eventsRef = useRef<TapEvent[]>([]);
  const livesRef = useRef<number>(INITIAL_LIVES);
  const scheduledOscillatorsRef = useRef<OscillatorNode[]>([]);

  const getCurrentTimeMs = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      return audioCtxRef.current.currentTime * 1000;
    }
    return performance.now();
  };

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (status === 'level_failed' || status === 'game_over') {
      scheduledOscillatorsRef.current.forEach(osc => {
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

  const loseLife = () => {
    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setStatus('level_failed');
      }
      return next;
    });
  };

  const tickRef = useRef<() => void>(() => {});
  useEffect(() => {
    tickRef.current = tick;
  });

  const tick = () => {
    if (status === 'game_over' || status === 'level_complete' || status === 'level_failed') return;

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
              loseLife();
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
         }
       }
    });

    if (changed) {
       setEvents(updatedEvents);
    }

    const allProcessed = updatedEvents.every(ev => {
      if (ev.type === 'rest') return ev.result !== null;
      if (ev.result === 'tied') return true;
      if (ev.duration > 1.0) return ev.result !== null && (ev.releaseResult !== null || ev.result === 'missed');
      return ev.result !== null;
    });

    if (allProcessed && status === 'playing') {
       if (livesRef.current <= 0) {
         setStatus('level_failed');
         return;
       } else if ((elapsed / beatMs) >= levelTotalBeats) {
         setStatus('level_complete');
         return;
       }
    }

    animationRef.current = requestAnimationFrame(() => {
      if (tickRef.current) tickRef.current();
    });
  };

  const startLevel = (currentLevel: number, currentBpm: number, keepSequence: boolean = false) => {
    scheduledOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    scheduledOscillatorsRef.current = [];

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
    let showInstruction = false;
    let prepBts = GAME_LEVELS[0].timeSignature[0];

    if (!keepSequence) {
      const index = Math.min(currentLevel - 1, GAME_LEVELS.length - 1);
      const pInfo = GAME_LEVELS[index];
      setLevelDef(pInfo);
      prepBts = pInfo.timeSignature[0];
      
      if (pInfo.instruction) showInstruction = true;

      const upperEvents = flattenSequence(pInfo.upperVoice, 'upper');
      const lowerEvents = flattenSequence(pInfo.lowerVoice, 'lower');
      const allEvents = [...upperEvents, ...lowerEvents].sort((a, b) => a.beatAbsolute - b.beatAbsolute);
      setEvents(allEvents);
      totalBeats = Math.ceil(calculateTotalBeats(allEvents, pInfo.timeSignature[0]));
      setLevelTotalBeats(totalBeats);
    } else {
      prepBts = levelDef.timeSignature[0];
      const resetEvents = eventsRef.current.map(e => ({ ...e, result: (e.result === 'tied' ? 'tied' : null) as BeatResult, releaseResult: (e.releaseResult === 'tied' ? 'tied' : null) as BeatResult, isHeld: false }));
      setEvents(resetEvents);
      setLives(INITIAL_LIVES);
      totalBeats = Math.ceil(calculateTotalBeats(resetEvents as TapEvent[], levelDef.timeSignature[0]));
      setLevelTotalBeats(totalBeats);
    }
    
    if (showInstruction) {
       setStatus('instruction');
       if (animationRef.current) cancelAnimationFrame(animationRef.current);
    } else {
       beginPrep(currentBpm, totalBeats, ctx, prepBts);
    }
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
    beginPrep(bpm, levelTotalBeats, audioCtxRef.current, levelDef.timeSignature[0]);
  };

  const repeatLevel = () => {
    if (retries > 0) {
      setRetries(r => r - 1);
      startLevel(level, bpm, true);
    } else {
      setStatus('game_over');
    }
  };

  const startGame = () => {
    setLevel(1);
    setLives(INITIAL_LIVES);
    setRetries(INITIAL_RETRIES);
    setBpm(selectedDifficulty);
    startLevel(1, selectedDifficulty);
  };

  const nextLevel = () => {
    const nextLvl = level + 1;
    setLevel(nextLvl);
    startLevel(nextLvl, bpm);
  };

  const handleTap = (track: 'upper' | 'lower') => {
    if (audioCtxRef.current) {
      scheduleClick(audioCtxRef.current, track === 'upper' ? 600 : 400, audioCtxRef.current.currentTime);
    } else {
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
             loseLife();
          } else {
             let type: BeatResult = 'perfect';
             if (delta < -TOLERANCE_MS / 3) type = 'early';
             else if (delta > TOLERANCE_MS / 3) type = 'late';
             else type = 'perfect';

             next[closestEventIndex] = { ...ev, result: type, isHeld: ev.duration > 1.0 };
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
       
       const earlyTolerance = TOLERANCE_MS + (ev.duration * beatMs * 0.15);

       setEvents(prev => {
          const next = [...prev];
          
          if (delta < -earlyTolerance) {
             next[heldEventIndex] = { ...ev, isHeld: false, releaseResult: 'early' };
             showGhostMsg('early');
             loseLife();
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
      const isSingleTrack = levelDef.lowerVoice.length === 0;
      if (e.key.toLowerCase() === 'f') {
        if (status === 'level_complete') { repeatLevel(); return; }
        if (status === 'level_failed') { repeatLevel(); return; }
        if (status === 'instruction') { acceptInstruction(); return; }
        if (!e.repeat) { setLeftPadActive(true); handleTap(isSingleTrack ? 'upper' : 'lower'); }
      }
      if (e.key.toLowerCase() === 'j') {
        if (status === 'level_complete') { nextLevel(); return; }
        if (status === 'level_failed') { nextLevel(); return; }
        if (status === 'instruction') { acceptInstruction(); return; }
        if (!e.repeat) { setRightPadActive(true); handleTap('upper'); }
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

  const validEvents = events.filter(e => e.result !== 'tied' && e.type === 'note');
  const perfects = validEvents.filter(e => e.result === 'perfect').length;
  const accuracy = validEvents.length > 0 ? Math.round((perfects / validEvents.length) * 100) : 0;
  
  const buildVisualCells = (sequence: RhythmCell[]) => {
    const visuals: { cellRaw: RhythmCell, absoluteBeat: number }[] = [];
    let currentBeat = 0;
    sequence.forEach(cellRaw => {
      visuals.push({ cellRaw, absoluteBeat: currentBeat });
      currentBeat += getCellDuration(cellRaw);
    });
    return visuals;
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

        {visualCells.map((vis, cellIndex) => {
          const cellRaw = vis.cellRaw;
          const isLigada = cellRaw.endsWith('_ligada');
          const cellStr = cellRaw.replace('_ligada', '') as RhythmCellBase;
          const isPontuada = cellStr.endsWith('_pontuada');
          const baseName = cellStr.replace('_pontuada', '');

          const beatIndex = vis.absoluteBeat;
          const cellEvents = events.filter(e => e.track === trackId && e.cellIndex === cellIndex);
          
          const isNoteActive = (ev: TapEvent | undefined) => {
            if (!ev) return false;
            if (ev.result === 'tied') return true; 
            return visualBeatFloat >= ev.beatAbsolute && visualBeatFloat < ev.beatAbsolute + 0.2;
          };

          return (
            <div 
              key={`${trackId}-${cellIndex}`} 
              className="absolute flex flex-row items-center justify-center h-full gap-1"
              style={{ left: `${(beatIndex + prepBeats) * 80}px`, width: `${getCellDuration(cellRaw) * 80}px` }}
            >
              {baseName === 'semibreve' && (
                <div className="flex flex-col items-center w-full relative">
                  <div 
                    className={cn("w-20 h-14 transition-all flex items-center justify-center relative", isNoteActive(cellEvents[0]) && !cellEvents[0]?.isHeld ? "-translate-y-2 scale-110 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}
                    style={cellEvents[0]?.isHeld ? { animation: 'wiggle 0.2s ease-in-out infinite', filter: 'drop-shadow(0 0 15px rgba(242,211,73,0.8))' } : {}}
                  >
                    <div className={cn("absolute inset-0 transition-colors", cellEvents[0]?.isHeld || cellEvents[0]?.result === 'perfect' || cellEvents[0]?.result === 'tied' || isNoteActive(cellEvents[0]) ? "bg-brand-gold" : "bg-black")} style={{ WebkitMaskImage: 'url(/assets/svg/semibreve.svg)', maskImage: 'url(/assets/svg/semibreve.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className="absolute -right-3 top-6 w-2 h-2 rounded-full bg-brand-gold" />}
                  {isLigada && <svg className="absolute -right-4 top-1/2 w-10 h-6 overflow-visible z-10"><path d="M 0 0 Q 20 15 40 0" fill="transparent" stroke="#F2D349" strokeWidth="4" strokeLinecap="round" opacity="0.6" /></svg>}
                  {renderProgressBar("w-16", cellEvents[0])}
                </div>
              )}
              {baseName === 'minima' && (
                <div className="flex flex-col items-center w-full relative">
                  <div 
                    className={cn("w-14 h-14 transition-all flex items-center justify-center relative", isNoteActive(cellEvents[0]) && !cellEvents[0]?.isHeld ? "-translate-y-2 scale-110 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}
                    style={cellEvents[0]?.isHeld ? { animation: 'wiggle 0.2s ease-in-out infinite', filter: 'drop-shadow(0 0 15px rgba(242,211,73,0.8))' } : {}}
                  >
                    <div className={cn("absolute inset-0 transition-colors", cellEvents[0]?.isHeld || cellEvents[0]?.result === 'perfect' || cellEvents[0]?.result === 'tied' || isNoteActive(cellEvents[0]) ? "bg-brand-gold" : "bg-black")} style={{ WebkitMaskImage: 'url(/assets/svg/minima.svg)', maskImage: 'url(/assets/svg/minima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className="absolute -right-3 top-6 w-2 h-2 rounded-full bg-brand-gold" />}
                  {isLigada && <svg className="absolute -right-4 top-1/2 w-10 h-6 overflow-visible z-10"><path d="M 0 0 Q 20 15 40 0" fill="transparent" stroke="#F2D349" strokeWidth="4" strokeLinecap="round" opacity="0.6" /></svg>}
                  {renderProgressBar("w-12", cellEvents[0])}
                </div>
              )}
              {baseName === 'seminima' && (
                <div className="flex flex-col items-center w-full relative">
                  <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", isNoteActive(cellEvents[0]) || cellEvents[0]?.result === 'perfect' || cellEvents[0]?.result === 'tied' ? "bg-brand-gold" : "bg-black")} style={{ WebkitMaskImage: 'url(/assets/svg/seminima.svg)', maskImage: 'url(/assets/svg/seminima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className="absolute -right-3 top-6 w-2 h-2 rounded-full bg-brand-gold" />}
                  {isLigada && <svg className="absolute -right-4 top-1/2 w-10 h-6 overflow-visible z-10"><path d="M 0 0 Q 20 15 40 0" fill="transparent" stroke="#F2D349" strokeWidth="4" strokeLinecap="round" opacity="0.6" /></svg>}
                  {renderProgressBar("w-8", cellEvents[0])}
                </div>
              )}
              {baseName === 'pausa' && (
                <div className="flex flex-col items-center w-full">
                  <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", isNoteActive(cellEvents[0]) || cellEvents[0]?.result === 'perfect' ? "bg-brand-gold" : "bg-black")} style={{ WebkitMaskImage: 'url(/assets/svg/pausa-seminima.svg)', maskImage: 'url(/assets/svg/pausa-seminima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {renderProgressBar("w-8", cellEvents[0])}
                </div>
              )}
              {baseName === 'pausa_minima' && (
                <div className="flex flex-col items-center w-full">
                  <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", isNoteActive(cellEvents[0]) || cellEvents[0]?.result === 'perfect' ? "bg-brand-gold" : "bg-black")} style={{ WebkitMaskImage: 'url(/assets/svg/pausa-minima.svg)', maskImage: 'url(/assets/svg/pausa-minima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {renderProgressBar("w-12", cellEvents[0])}
                </div>
              )}
              {baseName === 'colcheia' && (
                <div className="flex flex-col items-center w-full relative">
                  <div className={cn("w-6 h-10 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-1 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", isNoteActive(cellEvents[0]) || cellEvents[0]?.result === 'perfect' || cellEvents[0]?.result === 'tied' ? "bg-brand-gold" : "bg-black")} style={{ WebkitMaskImage: 'url(/assets/svg/colcheia.svg)', maskImage: 'url(/assets/svg/colcheia.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className="absolute -right-3 top-6 w-2 h-2 rounded-full bg-brand-gold" />}
                  {isLigada && <svg className="absolute -right-4 top-1/2 w-10 h-6 overflow-visible z-10"><path d="M 0 0 Q 20 15 40 0" fill="transparent" stroke="#F2D349" strokeWidth="4" strokeLinecap="round" opacity="0.6" /></svg>}
                  {renderProgressBar("w-4", cellEvents[0])}
                </div>
              )}
              {baseName === 'duas_colcheias' && (
                <div className="flex flex-row w-full justify-evenly relative">
                  <div className="absolute top-1/4 bottom-1/4 left-1/2 w-[1px] border-l-2 border-dashed border-brand-gray/30 -translate-x-1/2 z-0" />
                  {[0, 1].map((subIndex) => {
                    const ev = cellEvents[subIndex];
                    const active = isNoteActive(ev);
                    return (
                      <div key={subIndex} className="flex flex-col items-center">
                        <div className={cn("w-6 h-10 transition-all flex items-center justify-center", active ? "-translate-y-1 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                          <div className={cn("w-full h-full transition-colors", active || ev?.result === 'perfect' || ev?.result === 'tied' ? "bg-brand-gold" : "bg-black")} style={{ WebkitMaskImage: 'url(/assets/svg/colcheia.svg)', maskImage: 'url(/assets/svg/colcheia.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                        </div>
                        {renderProgressBar("w-4", ev)}
                      </div>
                    );
                  })}
                  {isLigada && <svg className="absolute -right-4 top-1/2 w-10 h-6 overflow-visible z-10"><path d="M 0 0 Q 20 15 40 0" fill="transparent" stroke="#F2D349" strokeWidth="4" strokeLinecap="round" opacity="0.6" /></svg>}
                </div>
              )}
              {baseName === 'quatro_semicolcheias' && (
                <div className="flex flex-row w-full justify-between px-1 relative">
                  {[0, 1, 2, 3].map((subIndex) => {
                    const ev = cellEvents[subIndex];
                    const active = isNoteActive(ev);
                    return (
                      <div key={subIndex} className="flex flex-col items-center">
                        <div className={cn("w-4 h-8 transition-all flex items-center justify-center", active ? "-translate-y-1 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                          <div className={cn("w-full h-full transition-colors", active || ev?.result === 'perfect' || ev?.result === 'tied' ? "bg-brand-gold" : "bg-black")} style={{ WebkitMaskImage: 'url(/assets/svg/semicolcheia.svg)', maskImage: 'url(/assets/svg/semicolcheia.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                        </div>
                        {renderProgressBar("w-2", ev)}
                      </div>
                    );
                  })}
                  {isLigada && <svg className="absolute -right-4 top-1/2 w-10 h-6 overflow-visible z-10"><path d="M 0 0 Q 20 15 40 0" fill="transparent" stroke="#F2D349" strokeWidth="4" strokeLinecap="round" opacity="0.6" /></svg>}
                </div>
              )}
            </div>
          );
        })}
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
      
      {/* HEADER */}
      <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-10 z-50">
         <div className="flex gap-2">
            {[...Array(INITIAL_LIVES)].map((_, i) => (
               <Heart 
                 key={i} 
                 className={cn("w-8 h-8 transition-all duration-300", i < lives ? "text-red-500 fill-red-500" : "text-brand-graphite fill-brand-graphite")}
               />
            ))}
         </div>
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-brand-gray text-sm uppercase font-bold tracking-widest">Nível {level} - {levelDef.name}</span>
               <span className="text-brand-gold font-headline text-2xl font-black">Compasso {levelDef.timeSignature[0]}/{levelDef.timeSignature[1]}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-brand-gray text-sm uppercase font-bold tracking-widest flex items-center"><Zap className="w-3 h-3 mr-1"/> BPM</span>
               <span className="text-white font-headline text-3xl font-black">{bpm}</span>
            </div>
         </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-5xl relative mt-20">
        
        {/* Ghost Message */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 h-10 flex items-center justify-center pointer-events-none z-50">
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
        
        {/* OVERLAYS */}
        {status === 'instruction' && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md px-4">
            <div className="max-w-xl text-center flex flex-col items-center">
              <Info className="w-16 h-16 text-brand-gold mb-6" />
              <h2 className="text-4xl font-headline font-black text-white mb-6 uppercase tracking-tight">{levelDef.instruction?.title || "Nova Mecânica"}</h2>
              <p className="text-brand-gray text-xl mb-12 leading-relaxed">{levelDef.instruction?.text}</p>
              <Button onClick={acceptInstruction} className="px-10 py-8 rounded-full bg-brand-gold hover:bg-yellow-400 text-brand-black text-2xl font-bold shadow-lg shadow-brand-gold/20">
                Entendi, Começar!
              </Button>
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
              <div className="flex gap-4">
                <Button onClick={repeatLevel} className="px-8 py-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-2xl font-bold shadow-lg shadow-orange-500/20">
                  <RefreshCw className="mr-3 w-6 h-6" /> Tentar Novamente
                </Button>
                <Button onClick={nextLevel} className="px-8 py-8 rounded-full bg-brand-graphite hover:bg-brand-gray/20 text-brand-gray text-xl font-bold border-2 border-brand-gray/30">
                  Pular Fase
                </Button>
              </div>
            </div>
          </div>
        )}

        {status === 'game_over' && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md">
            <h2 className="text-5xl font-headline font-black text-red-500 mb-2 uppercase tracking-tight">Game Over Total</h2>
            <p className="text-brand-gray text-xl mb-8">Você esgotou todas as tentativas para esta fase.</p>
            <Button onClick={startGame} className="px-10 py-8 rounded-full bg-red-600 hover:bg-red-500 text-white text-2xl font-bold shadow-lg shadow-red-500/20">
              Voltar para o Nível 1
            </Button>
          </div>
        )}

        {status === 'level_complete' && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-[100] bg-brand-black/95 backdrop-blur-md">
            <h2 className="text-5xl font-headline font-black text-brand-gold mb-2 uppercase tracking-tight">Fase Concluída!</h2>
            <div className="flex gap-8 mb-8 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-brand-gray text-sm uppercase tracking-widest">Precisão</span>
                <span className={cn("text-5xl font-bold font-headline", accuracy >= 80 ? "text-green-400" : "text-yellow-400")}>{accuracy}%</span>
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <Button onClick={() => { setRetries(r => r > 0 ? r - 1 : 0); startLevel(level, bpm, true); }} className="flex flex-col items-center justify-center w-40 h-32 rounded-3xl bg-brand-graphite hover:bg-brand-gray/20 text-brand-gray border-2 border-brand-gray/30 transition-all group">
                <span className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">Repetir</span>
                <span className="text-brand-gray/50 font-bold bg-brand-black px-4 py-2 rounded-lg text-lg">F</span>
              </Button>
              
              <Button onClick={nextLevel} className="flex flex-col items-center justify-center w-40 h-32 rounded-3xl bg-brand-gold hover:bg-yellow-400 text-brand-black border-2 border-yellow-300 shadow-[0_0_30px_rgba(242,211,73,0.3)] transition-all group">
                <span className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">Avançar</span>
                <span className="text-brand-gold font-bold bg-brand-black px-4 py-2 rounded-lg text-lg">J</span>
              </Button>
            </div>
          </div>
        )}

        {/* Pauta Polirrítmica */}
        <div className="w-full h-72 relative bg-white rounded-2xl mb-16 flex flex-col overflow-hidden border-2 border-brand-gray/30 shadow-inner">
          
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
                <div className="absolute left-2 top-2 bg-brand-graphite text-white font-bold px-2 py-1 rounded text-xs z-10">Mão Dir (J)</div>
                {renderTrack('upper', levelDef.upperVoice)}
              </div>
              <div className="flex-1 relative overflow-visible">
                <div className="absolute left-2 bottom-2 bg-brand-graphite text-white font-bold px-2 py-1 rounded text-xs z-10">Mão Esq (F)</div>
                {renderTrack('lower', levelDef.lowerVoice)}
              </div>
            </>
          )}

        </div>

        {/* Controles e Botões PAD */}
        <div className="flex flex-col items-center gap-6 w-full max-w-lg relative">
          {status === 'idle' ? (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex gap-2 w-full">
                <Button onClick={() => setSelectedDifficulty(60)} className={cn("flex-1 font-bold", selectedDifficulty === 60 ? "bg-brand-gold text-brand-black" : "bg-brand-graphite text-brand-gray")}>Fácil (60)</Button>
                <Button onClick={() => setSelectedDifficulty(70)} className={cn("flex-1 font-bold", selectedDifficulty === 70 ? "bg-brand-gold text-brand-black" : "bg-brand-graphite text-brand-gray")}>Médio (70)</Button>
                <Button onClick={() => setSelectedDifficulty(90)} className={cn("flex-1 font-bold", selectedDifficulty === 90 ? "bg-brand-gold text-brand-black" : "bg-brand-graphite text-brand-gray")}>Difícil (90)</Button>
              </div>
              <Button 
                onClick={startGame}
                className="w-full rounded-2xl py-8 bg-brand-gold hover:bg-yellow-400 text-brand-black text-2xl font-black shadow-lg shadow-brand-gold/30 uppercase tracking-widest"
              >
                Iniciar
              </Button>
            </div>
          ) : (
            <div className="h-[136px] w-full" />
          )}

          <div className="flex justify-center gap-12 mt-2 w-full">
            {/* PAD F */}
            <div className="flex flex-col items-center gap-4">
              <Button
                onPointerDown={(e) => { e.preventDefault(); setLeftPadActive(true); handleTap('upper'); }}
                onPointerUp={() => { setLeftPadActive(false); handleRelease('upper'); }}
                onPointerLeave={() => { setLeftPadActive(false); handleRelease('upper'); }}
                className={cn(
                  "w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center transition-all p-0 overflow-hidden border-4",
                  (status === 'playing' || status === 'prep') 
                    ? leftPadActive ? "bg-brand-gold border-yellow-300 shadow-[0_0_40px_rgba(242,211,73,0.6)] scale-95" : "bg-brand-graphite border-brand-gold shadow-[0_0_15px_rgba(242,211,73,0.2)]" 
                    : "bg-brand-graphite border-brand-gray/30 cursor-default opacity-50"
                )}
              >
                <div className={cn("w-12 h-12 rounded-full transition-colors", leftPadActive ? "bg-yellow-200" : "bg-brand-gray/20")} />
              </Button>
              <span className="font-bold text-brand-gray/50 text-xl tracking-widest mt-2">Mão Esquerda (F)</span>
            </div>

            {/* PAD J */}
            <div className="flex flex-col items-center gap-4">
              <Button
                onPointerDown={(e) => { e.preventDefault(); setRightPadActive(true); handleTap('lower'); }}
                onPointerUp={() => { setRightPadActive(false); handleRelease('lower'); }}
                onPointerLeave={() => { setRightPadActive(false); handleRelease('lower'); }}
                className={cn(
                  "w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center transition-all p-0 overflow-hidden border-4",
                  (status === 'playing' || status === 'prep') 
                    ? rightPadActive ? "bg-brand-gold border-yellow-300 shadow-[0_0_40px_rgba(242,211,73,0.6)] scale-95" : "bg-brand-graphite border-brand-gold shadow-[0_0_15px_rgba(242,211,73,0.2)]" 
                    : "bg-brand-graphite border-brand-gray/30 cursor-default opacity-50"
                )}
              >
                <div className={cn("w-12 h-12 rounded-full transition-colors", rightPadActive ? "bg-yellow-200" : "bg-brand-gray/20")} />
              </Button>
              <span className="font-bold text-brand-gray/50 text-xl tracking-widest mt-2">Mão Direita (J)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
