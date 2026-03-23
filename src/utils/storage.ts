import { SavedGame } from '../types';

const STORAGE_KEY = 'didi_frisbee_games';

export function loadGames(): SavedGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedGame[];
  } catch {
    return [];
  }
}

export function saveGame(game: SavedGame): void {
  const games = loadGames();
  const updated = [game, ...games];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteGame(id: string): void {
  const games = loadGames().filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}
