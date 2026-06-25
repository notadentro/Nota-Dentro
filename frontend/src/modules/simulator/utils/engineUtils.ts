import { RhythmCell, RhythmCellBase } from '../constants/levels';
import { TapEvent } from '../types';

export const getCellDuration = (cellRaw: RhythmCell): number => {
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

export const flattenSequence = (sequence: RhythmCell[], trackId: 'upper' | 'lower'): TapEvent[] => {
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

export const calculateAccuracy = (events: TapEvent[]): number => {
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
