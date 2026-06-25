export type GameState = 'idle' | 'instruction' | 'prep' | 'playing' | 'level_complete' | 'level_failed' | 'game_over' | 'paused';
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
