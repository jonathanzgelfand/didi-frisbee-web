import { Team, GameEvent, TeamStats } from '../types';

export function computeStats(team: Team, log: GameEvent[]): TeamStats {
  const events = log.filter(e => e.team === team);
  const completions = events.filter(e => e.action === 'complete').length;
  const scores = events.filter(e => e.action === 'score').length;
  const turnovers = events.filter(e => e.action === 'turnover').length;
  const totalThrows = completions + scores + turnovers;
  const completionPct = totalThrows > 0 ? ((completions + scores) / totalThrows) * 100 : 0;

  // possessions: count how many times this team got the disc
  // a possession starts at beginning if they start, or after opponent turnover
  let possessions = 0;
  let inPossession = false;
  for (const event of log) {
    if (event.team === team && !inPossession) {
      possessions++;
      inPossession = true;
    }
    if (event.action === 'turnover') {
      inPossession = event.team !== team;
    }
    if (event.action === 'score') {
      inPossession = false;
    }
  }

  const totalHoldTime = events.reduce((sum, e) => sum + e.holdTime, 0);
  const avgHoldTime = events.length > 0 ? totalHoldTime / events.length : 0;
  const pointsPerPossession = possessions > 0 ? scores / possessions : 0;

  return {
    completions,
    scores,
    turnovers,
    possessions,
    avgHoldTime,
    totalHoldTime,
    totalThrows,
    completionPct,
    pointsPerPossession,
  };
}
