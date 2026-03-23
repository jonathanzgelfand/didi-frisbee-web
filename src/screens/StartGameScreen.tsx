import { useState } from 'react';
import { Team } from '../types';

interface Props {
  onStart: (name: string, possession: Team) => void;
  onBack: () => void;
}

export function StartGameScreen({ onStart, onBack }: Props) {
  const [name, setName] = useState('');
  const [possession, setPossession] = useState<Team | null>(null);

  const canStart = possession !== null;

  return (
    <div className="screen start-screen">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="start-title">New Game</div>

      <div className="form-group">
        <label className="form-label">Game Name</label>
        <input
          className="text-input"
          type="text"
          placeholder="Untitled Game"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={50}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Who starts with the disc?</label>
        <div className="possession-picker">
          <button
            className={`btn possession-btn ${possession === 'us' ? 'selected' : ''}`}
            onClick={() => setPossession('us')}
          >
            Us
          </button>
          <button
            className={`btn possession-btn ${possession === 'them' ? 'selected' : ''}`}
            onClick={() => setPossession('them')}
          >
            Them
          </button>
        </div>
      </div>

      <button
        className="btn btn-primary btn-large"
        disabled={!canStart}
        onClick={() => possession && onStart(name.trim() || 'Untitled Game', possession)}
      >
        Start Game
      </button>
    </div>
  );
}
