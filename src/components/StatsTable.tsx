import { SavedGame } from '../types';
import { computeStats } from '../utils/stats';

interface Props {
  game: SavedGame;
}

export function StatsTable({ game }: Props) {
  const us = computeStats('us', game.gameLog);
  const them = computeStats('them', game.gameLog);

  const rows = [
    { label: 'Completions', us: us.completions, them: them.completions, highlight: false },
    { label: 'Scores', us: us.scores, them: them.scores, highlight: false },
    { label: 'Turnovers', us: us.turnovers, them: them.turnovers, highlight: false },
    { label: 'Total Throws', us: us.totalThrows, them: them.totalThrows, highlight: false },
    { label: 'Completion %', us: `${us.completionPct.toFixed(1)}%`, them: `${them.completionPct.toFixed(1)}%`, highlight: true },
    { label: 'Possessions', us: us.possessions, them: them.possessions, highlight: false },
    { label: 'Pts / Possession', us: us.pointsPerPossession.toFixed(2), them: them.pointsPerPossession.toFixed(2), highlight: false },
    { label: 'Avg Hold (s)', us: us.avgHoldTime.toFixed(1), them: them.avgHoldTime.toFixed(1), highlight: false },
    { label: 'Total Hold (s)', us: us.totalHoldTime.toFixed(1), them: them.totalHoldTime.toFixed(1), highlight: false },
  ];

  return (
    <div className="stats-table">
      <div className="stats-header-row">
        <div className="stats-cell stat-label"></div>
        <div className="stats-cell stat-team-header">US</div>
        <div className="stats-cell stat-team-header">THEM</div>
      </div>
      {rows.map(row => (
        <div key={row.label} className={`stats-row ${row.highlight ? 'highlight-row' : ''}`}>
          <div className="stats-cell stat-label">{row.label}</div>
          <div className={`stats-cell stat-value ${row.highlight ? 'highlight-us' : ''}`}>{row.us}</div>
          <div className="stats-cell stat-value">{row.them}</div>
        </div>
      ))}
    </div>
  );
}
