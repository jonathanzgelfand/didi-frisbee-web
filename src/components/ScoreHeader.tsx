import { Team } from '../types';

interface Props {
  usScore: number;
  themScore: number;
  possession: Team;
}

export function ScoreHeader({ usScore, themScore, possession }: Props) {
  return (
    <div className="score-header">
      <div className={`score-team ${possession === 'us' ? 'has-possession' : ''}`}>
        <span className="score-label">US</span>
        <span className="score-value">{usScore}</span>
      </div>
      <div className="score-divider">—</div>
      <div className={`score-team ${possession === 'them' ? 'has-possession' : ''}`}>
        <span className="score-value">{themScore}</span>
        <span className="score-label">THEM</span>
      </div>
    </div>
  );
}
