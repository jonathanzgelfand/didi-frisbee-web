export type Team = 'us' | 'them';
export type ActionType = 'complete' | 'turnover' | 'score';

export interface GameEvent {
  id: string;
  timestamp: string; // ISO string
  action: ActionType;
  team: Team;
  holdTime: number; // seconds
}

export interface SavedGame {
  id: string;
  name: string;
  date: string; // ISO string
  usScore: number;
  themScore: number;
  gameLog: GameEvent[];
}

export interface TeamStats {
  completions: number;
  scores: number;
  turnovers: number;
  possessions: number;
  avgHoldTime: number;
  totalHoldTime: number;
  totalThrows: number;
  completionPct: number;
  pointsPerPossession: number;
}
