import { SavedGame } from '../types';
import { computeStats } from './stats';

export function buildCSV(game: SavedGame): string {
  const usStats = computeStats('us', game.gameLog);
  const themStats = computeStats('them', game.gameLog);
  const exportDate = new Date().toLocaleString();

  const lines: string[] = [
    `Game Name,${game.name}`,
    `Export Date,${exportDate}`,
    '',
    'Final Score',
    `Us,${game.usScore}`,
    `Them,${game.themScore}`,
    '',
    'Team Stats',
    'Stat,Us,Them',
    `Completions,${usStats.completions},${themStats.completions}`,
    `Scores,${usStats.scores},${themStats.scores}`,
    `Turnovers,${usStats.turnovers},${themStats.turnovers}`,
    `Total Throws,${usStats.totalThrows},${themStats.totalThrows}`,
    `Completion %,${usStats.completionPct.toFixed(1)},${themStats.completionPct.toFixed(1)}`,
    `Possessions,${usStats.possessions},${themStats.possessions}`,
    `Points per Possession,${usStats.pointsPerPossession.toFixed(2)},${themStats.pointsPerPossession.toFixed(2)}`,
    `Avg Hold Time (s),${usStats.avgHoldTime.toFixed(1)},${themStats.avgHoldTime.toFixed(1)}`,
    `Total Hold Time (s),${usStats.totalHoldTime.toFixed(1)},${themStats.totalHoldTime.toFixed(1)}`,
    '',
    'Play-by-Play',
    'Timestamp,Team,Action,Hold Time (s)',
    ...game.gameLog.map(e =>
      `${new Date(e.timestamp).toLocaleTimeString()},${e.team === 'us' ? 'Us' : 'Them'},${e.action},${e.holdTime.toFixed(1)}`
    ),
  ];

  return lines.join('\n');
}

export function downloadCSV(game: SavedGame): void {
  const csv = buildCSV(game);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${game.name.replace(/\s+/g, '_')}_stats.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
