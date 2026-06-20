'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SandboxAudioStep } from '@/types/lesson';
import { Button } from '@/components/ui/button';
import { Play, Square, Check, Volume2, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SandboxAudioViewProps {
  data: SandboxAudioStep;
  isCompleted: boolean;
  onSuccess: () => void;
}

export function SandboxAudioView({ data, isCompleted, onSuccess }: SandboxAudioViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440); // A4
  const [gain, setGain] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  function stopAudio() {
    if (oscillatorRef.current && gainNodeRef.current && audioCtxRef.current) {
      const ct = audioCtxRef.current.currentTime;
      // Smooth release
      gainNodeRef.current.gain.cancelScheduledValues(ct);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ct);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ct + 0.1);
      
      oscillatorRef.current.stop(ct + 0.1);
      
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
  }

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopAudio();
      if (audioCtxRef.current?.state !== 'closed') {
        audioCtxRef.current?.close();
      }
    };
  }, []);

  useEffect(() => {
    if (oscillatorRef.current) {
      // Usar exponentialRampToValueAtTime previne cliques abruptos e soa mais musical, 
      // mas como o slider muda a todo frame, setValueAtTime ou setTargetAtTime é melhor
      oscillatorRef.current.frequency.setTargetAtTime(frequency, audioCtxRef.current!.currentTime, 0.05);
    }
  }, [frequency]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(gain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [gain]);

  const initAudio = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playAudio = () => {
    initAudio();
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const osc = audioCtxRef.current!.createOscillator();
    const gainNode = audioCtxRef.current!.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtxRef.current!.currentTime);
    
    // Smooth attack
    gainNode.gain.setValueAtTime(0, audioCtxRef.current!.currentTime);
    gainNode.gain.linearRampToValueAtTime(gain, audioCtxRef.current!.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current!.destination);

    osc.start();

    oscillatorRef.current = osc;
    gainNodeRef.current = gainNode;
    
    setIsPlaying(true);
    setHasInteracted(true);
  };

;

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  };

  const handleComplete = () => {
    stopAudio();
    onSuccess();
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto items-center">
      <div className="text-center space-y-4">
        <p className="text-xl md:text-2xl font-medium text-inherit">
          {data.question}
        </p>
      </div>

      <div className="w-full bg-brand-graphite/5 border border-brand-graphite/20 p-8 rounded-3xl flex flex-col items-center gap-8 shadow-inner">
        
        {/* Play/Stop Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAudio}
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors border-4",
            isPlaying 
              ? "bg-red-500 hover:bg-red-600 text-white border-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse" 
              : "bg-brand-gold hover:bg-yellow-500 text-brand-black border-yellow-600 shadow-[0_0_20px_rgba(242,211,73,0.3)]"
          )}
        >
          {isPlaying ? <Square size={36} fill="currentColor" /> : <Play size={40} className="ml-2" fill="currentColor" />}
        </motion.button>

        <div className="w-full space-y-8 mt-4">
          {/* Frequência (Altura) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-inherit">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Activity className="text-brand-gold" />
                <span>Altura (Frequência)</span>
              </div>
              <span className="font-mono bg-brand-black dark:bg-brand-white text-brand-white dark:text-brand-black px-3 py-1 rounded-lg text-sm">{frequency} Hz</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="2000" 
              step="1"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full h-3 bg-brand-graphite/20 rounded-lg appearance-none cursor-pointer accent-brand-gold"
            />
            <div className="flex justify-between text-sm text-brand-gray font-medium">
              <span>Grave</span>
              <span>Agudo</span>
            </div>
          </div>

          {/* Intensidade (Volume) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-inherit">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Volume2 className="text-system-success" />
                <span>Intensidade (Volume)</span>
              </div>
              <span className="font-mono bg-brand-black dark:bg-brand-white text-brand-white dark:text-brand-black px-3 py-1 rounded-lg text-sm">{Math.round(gain * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={gain}
              onChange={(e) => setGain(Number(e.target.value))}
              className="w-full h-3 bg-brand-graphite/20 rounded-lg appearance-none cursor-pointer accent-system-success"
            />
            <div className="flex justify-between text-sm text-brand-gray font-medium">
              <span>Piano (Fraco)</span>
              <span>Forte</span>
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-system-success/10 border border-system-success rounded-2xl w-full text-center"
          >
            <p className="font-bold text-system-success text-xl mb-2 flex items-center justify-center gap-2">
              <Check size={24} strokeWidth={3} /> Invenção Concluída!
            </p>
            <p className="text-inherit text-lg">{data.successMessage}</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: hasInteracted ? 1 : 0 }}
            className="w-full"
          >
            <Button 
              onClick={handleComplete} 
              disabled={!hasInteracted}
              className="w-full py-6 rounded-2xl font-bold text-lg bg-system-success hover:bg-green-600 text-white shadow-[0_4px_0_0_#1e5f3f] active:translate-y-1 active:shadow-none transition-all"
            >
              Concluir Invenção
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
