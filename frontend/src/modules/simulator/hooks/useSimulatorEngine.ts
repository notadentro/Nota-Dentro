import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { GAME_LEVELS, LevelDefinition } from '../constants/levels';
import { TapEvent, GameState, BeatResult } from '../types';
import { flattenSequence, calculateAccuracy } from '../utils/engineUtils';
import { scheduleClick } from '../utils/audioUtils';

interface UseSimulatorEngineProps {
  initialLevel?: number;
  initialDifficulty?: number;
  setShowStore: (show: boolean) => void;
}

const INITIAL_LIVES = 3;
const INITIAL_RETRIES = 3;
const INITIAL_BPM = 60;
const TOLERANCE_MS = 150;
const LATENCY_OFFSET_MS = 0.3;

export function useSimulatorEngine({ initialLevel, initialDifficulty, setShowStore }: UseSimulatorEngineProps) {
  const { user, isUserLoading, addXP, updateSimulatorProgress, deductLife, addCache } = useUser();

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

  // Persistence effect
  useEffect(() => {
    if (status === 'level_complete' && user) {
      const completed = [...(user.progress?.[`simulator_${bpm}_completed`] || [])];
      const unlocked = [...(user.progress?.[`simulator_${bpm}_unlocked`] || ['1'])];
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
        updateSimulatorProgress(bpm, completed, unlocked);
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

  const audioCtxRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const eventsRef = useRef<TapEvent[]>([]);
  const livesRef = useRef<number>(user ? user.stats.lives : INITIAL_LIVES);
  const scheduledOscillatorsRef = useRef<OscillatorNode[]>([]);
  const penalizedBeatsRef = useRef<Set<string>>(new Set());

  const getCurrentTimeMs = () => {
    if (audioCtxRef.current) return audioCtxRef.current.currentTime * 1000;
    return performance.now();
  };

  useEffect(() => { eventsRef.current = events; }, [events]);
  useEffect(() => { if (user?.stats?.lives !== undefined) setLives(user.stats.lives); }, [user?.stats?.lives]);
  useEffect(() => { livesRef.current = lives; }, [lives]);

  const tickRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!isUserLoading && initialLevel && initialDifficulty && status === 'idle') {
      const simUnlocked = user?.progress?.[`simulator_${initialDifficulty}_unlocked`] || ['1'];
      const highestUnlocked = Math.max(...simUnlocked.map(Number));
      const cappedLevel = Math.min(initialLevel, highestUnlocked);

      setLevel(cappedLevel);
      setBpm(initialDifficulty);
      startGame(cappedLevel, initialDifficulty);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLevel, initialDifficulty, isUserLoading, user]);

  useEffect(() => {
    if (status === 'level_failed' || status === 'game_over') {
      scheduledOscillatorsRef.current.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      scheduledOscillatorsRef.current = [];
      
      if (status === 'level_failed' && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        const gain = ctx.createGain();
        
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(196, now);
        osc.frequency.setValueAtTime(196, now + 0.3);
        osc.frequency.linearRampToValueAtTime(185, now + 0.4);
        osc.frequency.setValueAtTime(185, now + 0.7);
        osc.frequency.linearRampToValueAtTime(174, now + 0.8);
        osc.frequency.setValueAtTime(174, now + 1.1);
        osc.frequency.linearRampToValueAtTime(164, now + 1.2);
        
        for(let i=0; i<15; i++) {
           osc.frequency.linearRampToValueAtTime(164 + (i%2===0?6:-6), now + 1.2 + i*0.08);
        }

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.setValueAtTime(0.3, now + 2.0);
        gain.gain.linearRampToValueAtTime(0.01, now + 2.5);

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
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      
      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      playNote(523.25, now, 0.4);
      playNote(659.25, now + 0.1, 0.4);
      playNote(783.99, now + 0.2, 0.4);
      playNote(1046.50, now + 0.3, 0.8);
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

  const loseLife = (eventId?: string) => {
    if (eventId !== undefined) {
      if (penalizedBeatsRef.current.has(eventId)) return;
      penalizedBeatsRef.current.add(eventId);
    }

    // Se a fase já foi concluída, o erro não cobra vida (Modo Treino)
    const isAlreadyCompleted = user?.progress?.[`simulator_${bpm}_completed`]?.includes(level.toString());
    if (isAlreadyCompleted) {
      return;
    }

    if (user) {
      deductLife();
      livesRef.current -= 1;
    } else {
      setLives(prev => prev - 1);
    }
  };

  useEffect(() => { tickRef.current = tick; });

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

    if (status === 'prep') setStatus('playing');

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

    if (changed) setEvents(updatedEvents);

    const allProcessed = updatedEvents.every(ev => {
      if (ev.type === 'rest') return ev.result !== null;
      if (ev.result === 'tied') return true;
      if (ev.duration >= 1.0) return ev.result !== null && (ev.releaseResult !== null || ev.result === 'missed');
      return ev.result !== null;
    });

    if (allProcessed && status === 'playing') {
       if ((elapsed / beatMs) >= levelTotalBeats) {
         const finalAccuracy = calculateAccuracy(updatedEvents);
         if (finalAccuracy >= 80) setStatus('level_complete');
         else if (retries > 0) setStatus('level_failed');
         else setStatus('game_over');
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

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current && AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === 'suspended') ctx.resume();

    const calculateTotalBeats = (evts: TapEvent[], tsNum: number): number => {
      const maxB = evts.reduce((max, ev) => Math.max(max, ev.beatAbsolute + ev.duration), 0);
      return Math.ceil(maxB / tsNum) * tsNum;
    };

    let totalBeats = 0;

    if (!keepSequence) {
      const index = Math.min(currentLevel - 1, GAME_LEVELS.length - 1);
      const pInfo = GAME_LEVELS[index];
      setLevelDef(pInfo);

      const upperEvents = flattenSequence(pInfo.upperVoice, 'upper');
      const lowerEvents = flattenSequence(pInfo.lowerVoice, 'lower');
      const allEvents = [...upperEvents, ...lowerEvents].sort((a, b) => a.beatAbsolute - b.beatAbsolute);
      setEvents(allEvents);
      totalBeats = Math.ceil(calculateTotalBeats(allEvents, pInfo.timeSignature[0]));
      setLevelTotalBeats(totalBeats);
    } else {
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
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
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

    const isAlreadyCompleted = user?.progress?.[`simulator_${b}_completed`]?.includes(l.toString());
    const currentLives = user ? user.stats.lives : lives;
    
    if (currentLives <= 0 && !isAlreadyCompleted) {
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
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
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
        if (status === 'level_complete' || status === 'level_failed') { repeatLevel(); return; }
        if (status === 'instruction') { acceptInstruction(); return; }
        if (status === 'paused') { resumeGame(); return; }
        setLeftPadActive(true); handleTap(isSingleTrack ? 'upper' : 'lower');
      }
      if (e.key.toLowerCase() === 'j') {
        if (status === 'level_complete' || status === 'level_failed') { nextLevel(); return; }
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

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return {
    level, lives, retries, bpm, leftPadActive, rightPadActive, levelDef, events, levelTotalBeats, status, elapsedTime, ghostMsg, accuracy,
    setLeftPadActive, setRightPadActive,
    startGame, repeatLevel, nextLevel, pauseGame, resumeGame, acceptInstruction, handleTap, handleRelease
  };
}
