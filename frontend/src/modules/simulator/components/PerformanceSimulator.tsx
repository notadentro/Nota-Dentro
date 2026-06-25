'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SimulatorHUD } from './SimulatorHUD';
import { SimulatorTrack } from './SimulatorTrack';
import { SimulatorControls } from './SimulatorControls';
import { SimulatorModals } from './SimulatorModals';
import { useSimulatorEngine } from '../hooks/useSimulatorEngine';

interface PerformanceSimulatorProps {
  initialLevel?: number;
  initialDifficulty?: number;
}

export function PerformanceSimulator({ initialLevel, initialDifficulty }: PerformanceSimulatorProps) {
  const [showStore, setShowStore] = useState(false);

  const engine = useSimulatorEngine({
    initialLevel,
    initialDifficulty,
    setShowStore
  });

  const {
    level, lives, retries, bpm, leftPadActive, rightPadActive, levelDef, events, levelTotalBeats, status, elapsedTime, ghostMsg, accuracy,
    setLeftPadActive, setRightPadActive,
    startGame, repeatLevel, nextLevel, pauseGame, resumeGame, acceptInstruction, handleTap, handleRelease
  } = engine;

  const beatMs = (60 / bpm) * 1000;
  const prepBeats = levelDef.timeSignature[0];
  const visualBeatFloat = elapsedTime / beatMs;
  const isSingleTrack = levelDef.lowerVoice.length === 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-black font-body relative overflow-hidden select-none px-4">
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(-8px) rotate(-3deg) scale(1.1); }
          50% { transform: translateY(-8px) rotate(3deg) scale(1.1); }
        }
      `}</style>
      
      <SimulatorHUD 
        status={status}
        pauseGame={pauseGame}
        resumeGame={resumeGame}
        level={level}
        lives={lives}
        bpm={bpm}
        setShowStore={setShowStore}
      />

      <div className="flex flex-col items-center w-full max-w-5xl relative mt-1">
        <SimulatorModals 
          status={status}
          showStore={showStore}
          setShowStore={setShowStore}
          level={level}
          levelDef={levelDef}
          bpm={bpm}
          retries={retries}
          accuracy={accuracy}
          resumeGame={resumeGame}
          repeatLevel={repeatLevel}
          acceptInstruction={acceptInstruction}
          nextLevel={nextLevel}
          startLevel={startGame}
          INITIAL_RETRIES={3}
        />

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
                 <div className="w-3 h-full bg-brand-graphite/60" />
               </div>
            </div>

            {isSingleTrack ? (
              <div className="flex-1 relative overflow-visible flex items-center">
                <div className="absolute left-2 top-2 bg-brand-graphite text-white font-bold px-2 py-1 rounded text-xs z-10">
                  Voz Única <span className="hidden md:inline">(J ou F)</span>
                </div>
                <SimulatorTrack 
                  trackId="upper"
                  sequence={levelDef.upperVoice}
                  events={events}
                  levelDef={levelDef}
                  visualBeatFloat={visualBeatFloat}
                  prepBeats={prepBeats}
                  beatMs={beatMs}
                />
              </div>
            ) : (
              <>
                <div className="flex-1 relative border-b-2 border-brand-gray/20 overflow-visible">
                  <div className="absolute left-2 top-2 bg-brand-graphite text-white font-bold px-2 py-1 rounded text-xs z-10">
                    Voz 1 <span className="hidden md:inline">(J)</span>
                  </div>
                  <SimulatorTrack 
                    trackId="upper"
                    sequence={levelDef.upperVoice}
                    events={events}
                    levelDef={levelDef}
                    visualBeatFloat={visualBeatFloat}
                    prepBeats={prepBeats}
                    beatMs={beatMs}
                  />
                </div>
                <div className="flex-1 relative overflow-visible">
                  <div className="absolute left-2 bottom-2 bg-brand-graphite text-white font-bold px-2 py-1 rounded text-xs z-10">
                    Voz 2 <span className="hidden md:inline">(F)</span>
                  </div>
                  <SimulatorTrack 
                    trackId="lower"
                    sequence={levelDef.lowerVoice}
                    events={events}
                    levelDef={levelDef}
                    visualBeatFloat={visualBeatFloat}
                    prepBeats={prepBeats}
                    beatMs={beatMs}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Controles e Botões PAD */}
        <SimulatorControls 
          status={status}
          leftPadActive={leftPadActive}
          rightPadActive={rightPadActive}
          setLeftPadActive={setLeftPadActive}
          setRightPadActive={setRightPadActive}
          handleTap={handleTap}
          handleRelease={handleRelease}
          isSingleTrack={isSingleTrack}
        />

      </div>
    </div>
  );
}
