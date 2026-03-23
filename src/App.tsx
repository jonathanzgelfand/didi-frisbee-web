import { useState } from 'react';
import { SavedGame, Team } from './types';
import { useGameViewModel } from './hooks/useGameViewModel';
import { HomeScreen } from './screens/HomeScreen';
import { StartGameScreen } from './screens/StartGameScreen';
import { GameScreen } from './screens/GameScreen';
import { SavedGameScreen } from './screens/SavedGameScreen';

type Screen = 'home' | 'start' | 'game' | 'savedGame';

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [viewingGame, setViewingGame] = useState<SavedGame | null>(null);
  const vm = useGameViewModel();

  const handleStartGame = (name: string, possession: Team) => {
    vm.startGame(name, possession);
    setScreen('game');
  };

  const handleEndGame = (saved: SavedGame) => {
    setViewingGame(saved);
    setScreen('savedGame');
  };

  const handleDiscard = () => {
    setScreen('home');
  };

  const handleViewGame = (game: SavedGame) => {
    setViewingGame(game);
    setScreen('savedGame');
  };

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen
          onNewGame={() => setScreen('start')}
          onViewGame={handleViewGame}
        />
      )}
      {screen === 'start' && (
        <StartGameScreen
          onStart={handleStartGame}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          vm={vm}
          onEndGame={handleEndGame}
          onDiscard={handleDiscard}
        />
      )}
      {screen === 'savedGame' && viewingGame && (
        <SavedGameScreen
          game={viewingGame}
          onBack={() => setScreen('home')}
        />
      )}
    </div>
  );
}
