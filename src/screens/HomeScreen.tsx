import { useState, useEffect } from 'react';
import { SavedGame } from '../types';
import { loadGames, deleteGame } from '../utils/storage';

interface Props {
  onNewGame: () => void;
  onViewGame: (game: SavedGame) => void;
}

export function HomeScreen({ onNewGame, onViewGame }: Props) {
  const [games, setGames] = useState<SavedGame[]>([]);

  useEffect(() => {
    setGames(loadGames());
  }, []);

  const handleDelete = (id: string) => {
    deleteGame(id);
    setGames(loadGames());
  };

  return (
    <div className="screen home-screen">
      <div className="home-header">
        <div className="app-title">🥏 Didi Frisbee</div>
      </div>

      <button className="btn btn-primary btn-large" onClick={onNewGame}>
        New Game
      </button>

      {games.length > 0 && (
        <div className="saved-games">
          <div className="section-title">Saved Games</div>
          <div className="game-list">
            {games.map(game => (
              <div key={game.id} className="game-card" onClick={() => onViewGame(game)}>
                <div className="game-card-main">
                  <div className="game-card-name">{game.name}</div>
                  <div className="game-card-meta">
                    {new Date(game.date).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: 'numeric', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="game-card-right">
                  <div className="game-card-score">{game.usScore} – {game.themScore}</div>
                  <button
                    className="delete-btn"
                    onClick={e => { e.stopPropagation(); handleDelete(game.id); }}
                    aria-label="Delete game"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {games.length === 0 && (
        <div className="empty-state">No saved games yet</div>
      )}
    </div>
  );
}
