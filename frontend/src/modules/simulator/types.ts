export type GameState = 'idle' | 'tutorial' | 'instruction' | 'prep' | 'playing' | 'level_complete' | 'level_failed' | 'gameover' | 'paused';
export type BeatResult = 'perfect' | 'early' | 'late' | 'missed' | 'penalty' | 'tied' | null;

export interface TapEvent {
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
