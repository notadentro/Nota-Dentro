import React from 'react';
import { RhythmCell } from '../constants/levels';
import { TapEvent } from '../types';
import { getCellDuration } from './engineUtils';

export const isNoteActiveGlobal = (ev: TapEvent | undefined, visualBeatFloat: number) => {
  if (!ev) return false;
  return visualBeatFloat >= ev.beatAbsolute && visualBeatFloat < ev.beatAbsolute + 0.2;
};

export const buildVisualCells = (sequence: RhythmCell[]) => {
  const visuals: { cellRaw: RhythmCell, absoluteBeat: number }[] = [];
  let currentBeat = 0;
  sequence.forEach(cellRaw => {
    visuals.push({ cellRaw, absoluteBeat: currentBeat });
    currentBeat += getCellDuration(cellRaw);
  });
  return visuals;
};

export const getColorCodeGlobal = (ev: TapEvent | undefined, isActive: boolean, trackId?: 'upper' | 'lower') => {
  const activeColor = trackId === 'lower' ? "#5B9BD5" : "#F2D349";
  if (!ev) return isActive ? activeColor : "#1A1A1A";
  if (ev.result === 'missed' || ev.result === 'penalty' || ev.releaseResult === 'early') return "#ef4444";
  if (ev.isHeld || ev.result === 'perfect' || ev.result === 'early' || ev.result === 'late' || ev.result === 'tied' || isActive) return activeColor;
  return "#1A1A1A";
};

export const getBgClassGlobal = (ev: TapEvent | undefined, isActive: boolean, trackId?: 'upper' | 'lower') => {
  const activeClass = trackId === 'lower' ? "bg-system-info" : "bg-brand-gold";
  if (!ev) return isActive ? activeClass : "bg-[#1A1A1A]";
  if (ev.result === 'missed' || ev.result === 'penalty' || ev.releaseResult === 'early') return "bg-red-500";
  if (ev.isHeld || ev.result === 'perfect' || ev.result === 'early' || ev.result === 'late' || ev.result === 'tied' || isActive) return activeClass;
  return "bg-[#1A1A1A]";
};

export const renderLigaduraDynamicGlobal = (cellRawStr: RhythmCell, trackId?: 'upper' | 'lower') => {
  const tieWidth = Math.max(10, getCellDuration(cellRawStr) * 80 - 30);
  const color = trackId === 'lower' ? "#5B9BD5" : "#F2D349";
  return (
    <svg 
      className="absolute top-[60%] z-10 pointer-events-none overflow-visible" 
      style={{ left: '50%', transform: 'translateX(15px)', width: `${tieWidth}px`, height: '24px' }}
      viewBox={`0 0 ${tieWidth} 24`}
    >
      <path 
        d={`M 0 0 Q ${tieWidth / 2} 24 ${tieWidth} 0`} 
        fill="transparent" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        opacity="0.6" 
      />
    </svg>
  );
};
