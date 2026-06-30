'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SimulatorHUD } from './SimulatorHUD';
import { SimulatorTrack } from './SimulatorTrack';
import { SimulatorControls } from './SimulatorControls';
import { SimulatorModals } from './SimulatorModals';
import { TutorialOverlay } from './TutorialOverlay';
import { GameplayTutorialOverlay } from './GameplayTutorialOverlay';
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
    tutorialStep, isTutorialPaused, hitFlashUpper, hitFlashLower,
    setLeftPadActive, setRightPadActive,
    startGame, repeatLevel, nextLevel, pauseGame, resumeGame, acceptInstruction, handleTap, handleRelease
  } = engine;

  const beatMs = (60 / bpm) * 1000;
  const prepBeats = levelDef.timeSignature[0];
  const visualBeatFloat = elapsedTime / beatMs;
  const isSingleTrack = levelDef.lowerVoice.length === 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 font-body relative overflow-hidden select-none px-4">
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          animation: 'gridMove 20s linear infinite'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      </div>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(-8px) rotate(-3deg) scale(1.1); }
          50% { transform: translateY(-8px) rotate(3deg) scale(1.1); }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
      `}</style>
      
      <SimulatorHUD 
        status={status}
        pauseGame={pauseGame}
        resumeGame={resumeGame}
        level={level}
        lives={lives}
        bpm={bpm}
        retries={retries}
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
        <div id="level-title" className="flex flex-col items-center mb-12 w-full text-center px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-700/50">
           <span className="text-brand-gold text-[10px] md:text-sm uppercase font-bold tracking-widest drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">Nível {level} - {levelDef.name}</span>
           <span className="text-white font-headline text-lg md:text-2xl font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Compasso {levelDef.timeSignature[0]}/{levelDef.timeSignature[1]}</span>
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
          <div id="track-container" className="w-full h-72 relative bg-slate-100 rounded-2xl mb-2 flex flex-col overflow-hidden border-2 border-brand-gold/50 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
            
            {/* ZONA DE ACERTO VISUAL FIXA EM 25% */}
            <div className="absolute top-0 bottom-0 left-[25%] w-24 -ml-12 flex flex-col pointer-events-none z-10">
              {/* Laser Line */}
              <div className="absolute top-0 bottom-0 left-1/2 -ml-[2px] w-[4px] bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_20px_rgba(255,255,255,0.9)] z-0" />
              
              {isSingleTrack ? (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                  <div className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all duration-100 flex items-center justify-center backdrop-blur-md",
                    hitFlashUpper === 'perfect' || hitFlashLower === 'perfect' ? "border-green-400 shadow-[0_0_15px_#4ade80] bg-green-500/30" :
                    hitFlashUpper === 'early' || hitFlashLower === 'early' || hitFlashUpper === 'late' || hitFlashLower === 'late' ? "border-yellow-400 shadow-[0_0_15px_#facc15] bg-yellow-500/30" :
                    hitFlashUpper === 'penalty' || hitFlashLower === 'penalty' || hitFlashUpper === 'missed' || hitFlashLower === 'missed' ? "border-red-500 shadow-[0_0_15px_#ef4444] bg-red-500/30" :
                    "border-brand-gold/50 bg-black/40"
                  )}>
                    <span className="text-white/80 text-[10px] font-bold">J/F</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                    <div className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all duration-100 flex items-center justify-center backdrop-blur-md",
                      hitFlashUpper === 'perfect' ? "border-green-400 shadow-[0_0_15px_#4ade80] bg-green-500/30" :
                      hitFlashUpper === 'early' || hitFlashUpper === 'late' ? "border-yellow-400 shadow-[0_0_15px_#facc15] bg-yellow-500/30" :
                      hitFlashUpper === 'penalty' || hitFlashUpper === 'missed' ? "border-red-500 shadow-[0_0_15px_#ef4444] bg-red-500/30" :
                      "border-brand-gold/50 bg-black/40"
                    )}>
                      <span className="text-white/80 text-[10px] font-bold">J</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                    <div className={cn(
                      "w-10 h-10 rounded-full border-2 transition-all duration-100 flex items-center justify-center backdrop-blur-md",
                      hitFlashLower === 'perfect' ? "border-green-400 shadow-[0_0_15px_#4ade80] bg-green-500/30" :
                      hitFlashLower === 'early' || hitFlashLower === 'late' ? "border-yellow-400 shadow-[0_0_15px_#facc15] bg-yellow-500/30" :
                      hitFlashLower === 'penalty' || hitFlashLower === 'missed' ? "border-red-500 shadow-[0_0_15px_#ef4444] bg-red-500/30" :
                      "border-system-info/50 bg-black/40"
                    )}>
                      <span className="text-white/80 text-[10px] font-bold">F</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Fundo do Grid com Barras de Compasso */}
            <div 
              className="absolute inset-0 flex"
              style={{
                 left: '25%', 
                 transform: `translateX(-${(visualBeatFloat + prepBeats) * 80 + 40}px)`, 
                 transition: 'transform 0.05s linear'
              }}
            >
               {/* Batidas preparatórias */}
               {Array.from({ length: prepBeats }).map((_, i) => {
                 const prepBeat = -prepBeats + i;
                 const isCurrentPrep = Math.floor(visualBeatFloat) === prepBeat;
                 return (
                   <div 
                     key={`prep-${prepBeat}`}
                     className={cn(
                       "absolute flex flex-col items-center h-full justify-center transition-colors duration-75",
                       isCurrentPrep ? "bg-gradient-to-b from-transparent via-brand-gold/10 to-transparent" : ""
                     )}
                     style={{ left: `${(prepBeat + prepBeats) * 80}px`, width: '80px' }}
                   >
                     <div className={cn(
                       "w-3 h-3 rounded-full bg-brand-gold/30 transition-transform",
                       Math.abs(visualBeatFloat - prepBeat) < 0.2 ? "scale-150 bg-brand-gold shadow-[0_0_10px_rgba(255,215,0,0.8)]" : ""
                     )} />
                   </div>
                 );
               })}

               {/* Linhas de grade e compasso */}
               {Array.from({ length: levelTotalBeats }).map((_, beatIndex) => {
                  const isCurrentBeat = Math.floor(visualBeatFloat) === beatIndex;
                  return (
                    <div 
                      key={`grid-${beatIndex}`}
                      className={cn(
                        "absolute h-full border-r border-brand-gold/20 transition-colors duration-75", 
                        beatIndex % levelDef.timeSignature[0] === 0 ? "border-l-4 border-l-system-info/60 shadow-[0_0_10px_rgba(91,155,213,0.3)]" : "",
                        isCurrentBeat ? "bg-gradient-to-b from-transparent via-brand-gold/15 to-transparent" : ""
                      )}
                      style={{ left: `${(beatIndex + prepBeats) * 80}px`, width: '80px' }}
                    />
                  );
               })}

               {/* Barra Final Dupla */}
               <div 
                 className="absolute h-full flex z-0"
                 style={{ left: `${(levelTotalBeats + prepBeats) * 80}px` }}
               >
                 <div className="w-1 h-full bg-brand-gold/80 mr-1 shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                 <div className="w-3 h-full bg-brand-gold/80 shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
               </div>
            </div>

            {isSingleTrack ? (
              <div className="flex-1 relative overflow-visible flex items-center">
                <div className="absolute left-2 top-2 bg-slate-900/80 backdrop-blur-sm text-brand-gold font-bold px-2 py-1 rounded text-xs z-10 border border-brand-gold/30 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
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
                <div className="flex-1 relative border-b-2 border-brand-gold/20 overflow-visible">
                  <div className="absolute left-2 top-2 bg-slate-900/80 backdrop-blur-sm text-brand-gold font-bold px-2 py-1 rounded text-xs z-10 border border-brand-gold/30 shadow-[0_0_10px_rgba(255,215,0,0.2)]">
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
                  <div className="absolute left-2 bottom-2 bg-slate-900/80 backdrop-blur-sm text-system-info font-bold px-2 py-1 rounded text-xs z-10 border border-system-info/30 shadow-[0_0_10px_rgba(91,155,213,0.2)]">
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


      {status === 'tutorial' && level !== 0 && (
        <TutorialOverlay onFinish={engine.finishTutorial} />
      )}

      {isTutorialPaused && (level === 0 || level === 3) && (
        <GameplayTutorialOverlay step={tutorialStep} level={level} />
      )}
    </div>
  );
}
