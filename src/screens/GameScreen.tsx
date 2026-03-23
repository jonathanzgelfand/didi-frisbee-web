import { useState } from 'react';
import { GameViewModel } from '../hooks/useGameViewModel';
import { ScoreHeader } from '../components/ScoreHeader';
import { EventLog } from '../components/EventLog';
import { StatsTable } from '../components/StatsTable';
import { downloadCSV } from '../utils/csv';
import { SavedGame, Team } from '../types';

interface Props {
  vm: GameViewModel;
  onEndGame: (saved: SavedGame) => void;
  onDiscard: () => void;
}

function formatTime(t: number): string {
  const total = Math.floor(t * 10);
  const tenths = total % 10;
  const secs = Math.floor(total / 10) % 60;
  const mins = Math.floor(total / 600);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
}

export function GameScreen({ vm, onEndGame, onDiscard }: Props) {
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const actionsDisabled = !vm.clockStarted || vm.isTimeout || vm.showingPossessionPicker;

  const handleEnd = (save: boolean) => {
    setShowEndConfirm(false);
    if (save) {
      const saved = vm.endAndSave();
      onEndGame(saved);
    } else {
      onDiscard();
    }
  };

  return (
    <div className="screen game-screen">
      {/* Navbar */}
      <div className="game-navbar">
        <span className="game-name-nav">{vm.gameName}</span>
        <button className="end-btn" onClick={() => setShowEndConfirm(true)}>End Game</button>
      </div>

      <ScoreHeader usScore={vm.usScore} themScore={vm.themScore} possession={vm.possession} />

      {/* Timer section */}
      <div className="timer-section">
        <div className="possession-status">
          <span className={`status-dot ${vm.isTimeout ? 'timeout' : 'active'}`}></span>
          <span className="status-text">
            {vm.isTimeout ? 'TIMEOUT' : `${vm.possession === 'us' ? 'Us' : 'Them'} has disc`}
          </span>
        </div>
        <div className="timer-display">{formatTime(vm.holdTime)}</div>

        {!vm.clockStarted ? (
          <button className="btn btn-start-clock" onClick={vm.startClock}>
            START GAME CLOCK
          </button>
        ) : (
          <button
            className={`btn btn-timeout ${vm.isTimeout ? 'btn-resume' : ''}`}
            onClick={vm.toggleTimeout}
          >
            {vm.isTimeout ? 'RESUME' : 'TIMEOUT'}
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        <button
          className="btn btn-complete action-btn"
          disabled={actionsDisabled}
          onClick={vm.completedPass}
        >
          COMPLETE
        </button>
        <button
          className="btn btn-score action-btn"
          disabled={actionsDisabled}
          onClick={vm.score}
        >
          SCORE
        </button>
        <button
          className="btn btn-turnover action-btn"
          disabled={actionsDisabled}
          onClick={vm.turnover}
        >
          TURNOVER
        </button>
      </div>

      {/* Event log */}
      <div className="event-log-section">
        <EventLog events={vm.gameLog} maxItems={5} />
      </div>

      {/* Export stats link */}
      <button className="text-btn" onClick={() => setShowExport(true)}>
        Export Stats
      </button>

      {/* Possession picker modal */}
      {vm.showingPossessionPicker && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">Who starts with the disc?</div>
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={() => vm.setPossession('us' as Team)}>Us</button>
              <button className="btn btn-secondary" onClick={() => vm.setPossession('them' as Team)}>Them</button>
            </div>
          </div>
        </div>
      )}

      {/* End game confirm modal */}
      {showEndConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">End Game?</div>
            <div className="modal-buttons vertical">
              <button className="btn btn-primary" onClick={() => handleEnd(true)}>Save & Exit</button>
              <button className="btn btn-danger" onClick={() => handleEnd(false)}>Discard & Exit</button>
              <button className="btn btn-secondary" onClick={() => setShowEndConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Export modal */}
      {showExport && (() => {
        const liveGame: SavedGame = {
          id: 'live',
          name: vm.gameName,
          date: new Date().toISOString(),
          usScore: vm.usScore,
          themScore: vm.themScore,
          gameLog: vm.gameLog,
        };
        return (
          <div className="modal-overlay">
            <div className="modal modal-large">
              <div className="modal-header">
                <div className="modal-title">{vm.gameName}</div>
                <button className="close-btn" onClick={() => setShowExport(false)}>✕</button>
              </div>
              <div className="modal-score-banner">
                <span>{vm.usScore} – {vm.themScore}</span>
              </div>
              <div className="modal-scroll">
                <StatsTable game={liveGame} />
                <div style={{ marginTop: 16 }}>
                  <div className="section-title" style={{ marginBottom: 8 }}>Play-by-Play</div>
                  <EventLog events={vm.gameLog} />
                </div>
              </div>
              <button
                className="btn btn-secondary btn-large"
                onClick={() => downloadCSV(liveGame)}
              >
                Export to Spreadsheet
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
