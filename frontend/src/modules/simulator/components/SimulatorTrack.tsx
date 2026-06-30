import React from 'react';
import { cn } from '@/lib/utils';
import { RhythmCell, RhythmCellBase, LevelDefinition } from '../constants/levels';
import { TapEvent, BeatResult } from '../types';
import { getCellDuration } from '../utils/engineUtils';
import { 
  buildVisualCells, 
  isNoteActiveGlobal, 
  getColorCodeGlobal, 
  getBgClassGlobal, 
  renderLigaduraDynamicGlobal 
} from '../utils/renderUtils';

interface SimulatorTrackProps {
  trackId: 'upper' | 'lower';
  sequence: RhythmCell[];
  events: TapEvent[];
  levelDef: LevelDefinition;
  visualBeatFloat: number;
  prepBeats: number;
  beatMs: number;
}

export function SimulatorTrack({
  trackId, sequence, events, levelDef, visualBeatFloat, prepBeats, beatMs
}: SimulatorTrackProps) {
  const visualCells = buildVisualCells(sequence);

  const getResultColor = (r: BeatResult | undefined) => {
    if (r === 'tied') return 'text-cyan-400 border-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]';
    switch (r) {
      case 'perfect': return 'text-green-400 border-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]';
      case 'early': return 'text-yellow-400 border-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]';
      case 'late': return 'text-orange-400 border-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]';
      case 'missed': return 'text-red-500 border-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]';
      case 'penalty': return 'text-pink-500 border-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]'; 
      default: return 'text-slate-300/40 border-slate-300/40 bg-slate-300/10';
    }
  };

  const getResultBg = (r: BeatResult | undefined) => {
    if (r === 'tied') return 'bg-cyan-400/40';
    switch (r) {
      case 'perfect': return 'bg-green-400/40';
      case 'early': return 'bg-yellow-400/40';
      case 'late': return 'bg-orange-400/40';
      case 'missed': return 'bg-red-500/40';
      case 'penalty': return 'bg-pink-500/40';
      default: return 'bg-transparent';
    }
  };

  const renderProgressBar = (ev: TapEvent | undefined, cellBeatIndex: number) => {
    if (!ev || ev.type === 'rest') return null;
    // Só renderiza a barra de duração se a nota for longa (> 1 beat) ou se for ligada
    if (ev.duration <= 1.0 && ev.result !== 'tied' && !ev.isHeld) return null;

    const startBeatOffset = ev.beatAbsolute - cellBeatIndex;
    const startX = startBeatOffset * 80;
    const width = ev.duration * 80;

    return (
      <div 
        key={`prog-${ev.id}`}
        className={cn("absolute h-3 rounded-r-full border-y-2 border-r-2 overflow-hidden transition-colors shadow-inner z-0", getResultColor(ev.result), getResultBg(ev.result))}
        style={{ 
          left: `${startX}px`, 
          width: `${width}px`,
          top: '65%',
          borderLeft: 'none'
        }}
      >
        <div 
          className={cn("absolute left-0 top-0 bottom-0 shadow-[0_0_10px_currentColor]", ev.result === 'tied' ? 'bg-cyan-400' : 'bg-green-400')} 
          style={{ 
            width: (ev.isHeld || ev.result === 'tied' || ev.releaseResult === 'perfect' || ev.releaseResult === 'early') ? '100%' : '0%', 
            transition: ev.isHeld ? `width ${ev.duration * beatMs}ms linear` : 'none' 
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
         transform: `translateX(-${(visualBeatFloat + prepBeats) * 80 + 40}px)`, 
         transition: 'transform 0.05s linear'
      }}
    >
      {/* Fórmula de Compasso */}
      <div 
        className="absolute flex flex-col items-center justify-center h-full text-slate-800/80 font-headline font-black text-5xl select-none z-0"
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

          const isNoteActive = (ev: TapEvent | undefined) => isNoteActiveGlobal(ev, visualBeatFloat);
          const getColorCode = (ev: TapEvent | undefined, isActive: boolean) => getColorCodeGlobal(ev, isActive, trackId);
          const getBgClass = (ev: TapEvent | undefined, isActive: boolean) => getBgClassGlobal(ev, isActive, trackId);
          const renderLigaduraDynamic = () => renderLigaduraDynamicGlobal(cellRaw, trackId);

          return (
            <div 
              key={`${trackId}-${cellIndex}`} 
              className="absolute h-full"
              style={{ left: `${(beatIndex + prepBeats) * 80}px`, width: `${getCellDuration(cellRaw) * 80}px` }}
            >
              {/* Progress Bars (trilhas visuais de duração) */}
              {cellEvents.map(ev => renderProgressBar(ev, beatIndex))}

              {/* Graphics Container */}
              <div className="absolute inset-0 top-0 bottom-0">
              
              {baseName === 'semibreve' && (
                <div className="absolute flex flex-col items-center" style={{ left: '40px', transform: 'translateX(-50%)', top: '50%', marginTop: '-28px' }}>
                  <div 
                    className={cn("w-20 h-14 transition-all flex items-center justify-center relative", isNoteActive(cellEvents[0]) && !cellEvents[0]?.isHeld ? "-translate-y-2 scale-110 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}
                    style={shouldWiggle ? { animation: 'wiggle 0.2s ease-in-out infinite', filter: 'drop-shadow(0 0 15px rgba(242,211,73,0.8))' } : {}}
                  >
                    <div className={cn("absolute inset-0 transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/semibreve.svg)', maskImage: 'url(/assets/svg/semibreve.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className={cn("absolute -right-3 top-6 w-2 h-2 rounded-full", trackId === 'lower' ? "bg-system-info" : "bg-brand-gold")} />}
                  {isLigada && renderLigaduraDynamic()}
                </div>
              )}
              {baseName === 'minima' && (
                <div className="absolute flex flex-col items-center" style={{ left: '40px', transform: 'translateX(-50%)', top: '50%', marginTop: '-28px' }}>
                  <div 
                    className={cn("w-14 h-14 transition-all flex items-center justify-center relative", isNoteActive(cellEvents[0]) && !cellEvents[0]?.isHeld ? "-translate-y-2 scale-110 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}
                    style={shouldWiggle ? { animation: 'wiggle 0.2s ease-in-out infinite', filter: 'drop-shadow(0 0 15px rgba(242,211,73,0.8))' } : {}}
                  >
                    <div className={cn("absolute inset-0 transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/minima.svg)', maskImage: 'url(/assets/svg/minima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className={cn("absolute -right-3 top-6 w-2 h-2 rounded-full", trackId === 'lower' ? "bg-system-info" : "bg-brand-gold")} />}
                  {isLigada && renderLigaduraDynamic()}
                </div>
              )}
              {baseName === 'seminima' && (
                <div className="absolute flex flex-col items-center" style={{ left: '40px', transform: 'translateX(-50%)', top: '50%', marginTop: '-28px' }}>
                  <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/seminima.svg)', maskImage: 'url(/assets/svg/seminima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className={cn("absolute -right-3 top-6 w-2 h-2 rounded-full", trackId === 'lower' ? "bg-system-info" : "bg-brand-gold")} />}
                  {isLigada && renderLigaduraDynamic()}
                </div>
              )}
              {baseName === 'pausa' && (
                <div className="absolute flex flex-col items-center" style={{ left: '40px', transform: 'translateX(-50%)', top: '50%', marginTop: '-28px' }}>
                  <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/pausa-seminima.svg)', maskImage: 'url(/assets/svg/pausa-seminima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                </div>
              )}
              {baseName === 'pausa_minima' && (
                <div className="absolute flex flex-col items-center" style={{ left: '40px', transform: 'translateX(-50%)', top: '50%', marginTop: '-28px' }}>
                  <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/pausa-minima.svg)', maskImage: 'url(/assets/svg/pausa-minima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                </div>
              )}
              {baseName === 'colcheia' && (
                <div className="absolute flex flex-col items-center" style={{ left: '40px', transform: 'translateX(-50%)', top: '50%', marginTop: '-20px' }}>
                  <div className={cn("w-6 h-10 transition-all flex items-center justify-center", isNoteActive(cellEvents[0]) ? "-translate-y-1 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                    <div className={cn("w-full h-full transition-colors", getBgClass(cellEvents[0], isNoteActive(cellEvents[0])))} style={{ WebkitMaskImage: 'url(/assets/svg/colcheia.svg)', maskImage: 'url(/assets/svg/colcheia.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                  </div>
                  {isPontuada && <div className={cn("absolute -right-3 top-6 w-2 h-2 rounded-full", trackId === 'lower' ? "bg-system-info" : "bg-brand-gold")} />}
                  {isLigada && renderLigaduraDynamic()}
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
                  else if (color0 === "#5B9BD5") bgClass = "bg-system-info";
                  else if (color0 === "#ef4444") bgClass = "bg-red-500";
                  else bgClass = "bg-[#1A1A1A]";
                } else {
                  style = { background: `linear-gradient(to right, ${color0} 50%, ${color1} 50%)` };
                }
                
                const anyActive = active0 || active1;
                
                return (
                  <div className="absolute flex flex-col items-center" style={{ left: '40px', transform: 'translateX(-8px)', top: '50%', marginTop: '-24px' }}>
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
                  else if (c0 === "#5B9BD5") bgClass = "bg-system-info";
                  else if (c0 === "#ef4444") bgClass = "bg-red-500";
                  else bgClass = "bg-[#1A1A1A]";
                } else {
                  style = { background: `linear-gradient(to right, ${c0} 25%, ${c1} 25% 50%, ${c2} 50% 75%, ${c3} 75%)` };
                }

                return (
                  <div className="absolute flex flex-col items-center" style={{ left: '40px', transform: 'translateX(-10px)', top: '50%', marginTop: '-24px' }}>
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
                    {isLigada && renderLigaduraDynamic()}
                  </div>
                );
              })()}
              {baseName === 'colcheia_seminima_colcheia' && (() => {
                const ev0 = cellEvents[0];
                const ev1 = cellEvents[1];
                const ev2 = cellEvents[2];
                return (
                  <>
                    <div className="absolute flex flex-col items-center" style={{ left: '40px', transform: 'translateX(-50%)', top: '50%', marginTop: '-20px' }}>
                      <div className={cn("w-6 h-10 transition-all flex items-center justify-center", isNoteActive(ev0) ? "-translate-y-1 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                        <div className={cn("w-full h-full transition-colors", getBgClass(ev0, isNoteActive(ev0)))} style={{ WebkitMaskImage: 'url(/assets/svg/colcheia.svg)', maskImage: 'url(/assets/svg/colcheia.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                      </div>
                    </div>
                    <div className="absolute flex flex-col items-center" style={{ left: '80px', transform: 'translateX(-50%)', top: '50%', marginTop: '-28px' }}>
                      <div className={cn("w-10 h-14 transition-all flex items-center justify-center", isNoteActive(ev1) ? "-translate-y-2 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                        <div className={cn("w-full h-full transition-colors", getBgClass(ev1, isNoteActive(ev1)))} style={{ WebkitMaskImage: 'url(/assets/svg/seminima.svg)', maskImage: 'url(/assets/svg/seminima.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                      </div>
                    </div>
                    <div className="absolute flex flex-col items-center" style={{ left: '160px', transform: 'translateX(-50%)', top: '50%', marginTop: '-20px' }}>
                      <div className={cn("w-6 h-10 transition-all flex items-center justify-center", isNoteActive(ev2) ? "-translate-y-1 scale-125 drop-shadow-[0_0_15px_rgba(242,211,73,0.6)]" : "")}>
                        <div className={cn("w-full h-full transition-colors", getBgClass(ev2, isNoteActive(ev2)))} style={{ WebkitMaskImage: 'url(/assets/svg/colcheia.svg)', maskImage: 'url(/assets/svg/colcheia.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                      </div>
                    </div>
                    {isLigada && <div className="absolute" style={{left: '40px'}}>{renderLigaduraDynamic()}</div>}
                  </>
                );
              })()}
              
              </div>
            </div>
          );
        });
      })()}
    </div>
  );
}
