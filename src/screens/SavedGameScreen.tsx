import { SavedGame } from '../types';
import { StatsTable } from '../components/StatsTable';
import { EventLog } from '../components/EventLog';
import { downloadCSV } from '../utils/csv';

interface Props {
  game: SavedGame;
  onBack: () => void;
}

export function SavedGameScreen({ game, onBack }: Props) {
  return (
    <div className="saved-game-screen">
      <div className="game-navbar">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <span className="game-name-nav">{game.name}</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="saved-game-content">
        <div className="score-banner">
          <div className="score-banner-date">
            {new Date(game.date).toLocaleDateString(undefined, {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </div>
          <div className="score-banner-score">{game.usScore} – {game.themScore}</div>
          <div className="score-banner-labels">
            <span>Us</span>
            <span>Them</span>
          </div>
        </div>

        <div className="section-title">Stats</div>
        <StatsTable game={game} />

        <div className="section-title" style={{ marginTop: 8 }}>Play-by-Play</div>
        <EventLog events={game.gameLog} />

        <button className="btn btn-secondary btn-large" onClick={() => downloadCSV(game)}>
          Export to Spreadsheet
        </button>
      </div>
    </div>
  );
}
