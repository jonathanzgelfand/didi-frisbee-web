import { useState, useRef, useCallback } from 'react';
import { Team, ActionType, GameEvent, SavedGame } from '../types';
import { saveGame } from '../utils/storage';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface GameViewModel {
  gameName: string;
  usScore: number;
  themScore: number;
  possession: Team;
  holdTime: number;
  gameLog: GameEvent[];
  isTimeout: boolean;
  clockStarted: boolean;
  showingPossessionPicker: boolean;
  startGame: (name: string, possession: Team) => void;
  startClock: () => void;
  completedPass: () => void;
  turnover: () => void;
  score: () => void;
  setPossession: (team: Team) => void;
  toggleTimeout: () => void;
  endAndSave: () => SavedGame;
}

export function useGameViewModel(): GameViewModel {
  const [gameName, setGameName] = useState('Untitled Game');
  const [usScore, setUsScore] = useState(0);
  const [themScore, setThemScore] = useState(0);
  const [possession, setPossessionState] = useState<Team>('us');
  const [holdTime, setHoldTime] = useState(0);
  const [gameLog, setGameLog] = useState<GameEvent[]>([]);
  const [isTimeout, setIsTimeout] = useState(false);
  const [clockStarted, setClockStarted] = useState(false);
  const [showingPossessionPicker, setShowingPossessionPicker] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(Date.now());
  const elapsedAtPauseRef = useRef<number>(0);
  const possessionRef = useRef<Team>('us');
  const usScoreRef = useRef(0);
  const themScoreRef = useRef(0);
  const gameLogRef = useRef<GameEvent[]>([]);
  const gameNameRef = useRef('Untitled Game');

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startHoldTimer = useCallback(() => {
    stopInterval();
    holdStartRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - holdStartRef.current) / 1000;
      setHoldTime(elapsedAtPauseRef.current + elapsed);
    }, 100);
  }, [stopInterval]);

  const resetHoldTimer = useCallback(() => {
    elapsedAtPauseRef.current = 0;
    setHoldTime(0);
    holdStartRef.current = Date.now();
  }, []);

  const logEvent = useCallback((action: ActionType, team: Team, ht: number) => {
    const event: GameEvent = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      action,
      team,
      holdTime: ht,
    };
    const updated = [...gameLogRef.current, event];
    gameLogRef.current = updated;
    setGameLog(updated);
  }, []);

  const startGame = useCallback((name: string, poss: Team) => {
    stopInterval();
    setGameName(name);
    gameNameRef.current = name;
    setUsScore(0);
    usScoreRef.current = 0;
    setThemScore(0);
    themScoreRef.current = 0;
    setPossessionState(poss);
    possessionRef.current = poss;
    setHoldTime(0);
    elapsedAtPauseRef.current = 0;
    setGameLog([]);
    gameLogRef.current = [];
    setIsTimeout(false);
    setClockStarted(false);
    setShowingPossessionPicker(false);
  }, [stopInterval]);

  const startClock = useCallback(() => {
    setClockStarted(true);
    startHoldTimer();
  }, [startHoldTimer]);

  const completedPass = useCallback(() => {
    const ht = elapsedAtPauseRef.current + (Date.now() - holdStartRef.current) / 1000;
    logEvent('complete', possessionRef.current, ht);
    resetHoldTimer();
    startHoldTimer();
  }, [logEvent, resetHoldTimer, startHoldTimer]);

  const turnover = useCallback(() => {
    const ht = elapsedAtPauseRef.current + (Date.now() - holdStartRef.current) / 1000;
    logEvent('turnover', possessionRef.current, ht);
    const newPoss: Team = possessionRef.current === 'us' ? 'them' : 'us';
    possessionRef.current = newPoss;
    setPossessionState(newPoss);
    resetHoldTimer();
    startHoldTimer();
  }, [logEvent, resetHoldTimer, startHoldTimer]);

  const score = useCallback(() => {
    const ht = elapsedAtPauseRef.current + (Date.now() - holdStartRef.current) / 1000;
    logEvent('score', possessionRef.current, ht);
    if (possessionRef.current === 'us') {
      usScoreRef.current += 1;
      setUsScore(usScoreRef.current);
    } else {
      themScoreRef.current += 1;
      setThemScore(themScoreRef.current);
    }
    stopInterval();
    resetHoldTimer();
    elapsedAtPauseRef.current = 0;
    setHoldTime(0);
    setShowingPossessionPicker(true);
  }, [logEvent, stopInterval, resetHoldTimer]);

  const setPossession = useCallback((team: Team) => {
    possessionRef.current = team;
    setPossessionState(team);
    setShowingPossessionPicker(false);
    startHoldTimer();
  }, [startHoldTimer]);

  const toggleTimeout = useCallback(() => {
    if (isTimeout) {
      // resume
      setIsTimeout(false);
      startHoldTimer();
    } else {
      // pause
      const elapsed = (Date.now() - holdStartRef.current) / 1000;
      elapsedAtPauseRef.current += elapsed;
      stopInterval();
      setIsTimeout(true);
    }
  }, [isTimeout, startHoldTimer, stopInterval]);

  const endAndSave = useCallback((): SavedGame => {
    stopInterval();
    const saved: SavedGame = {
      id: generateId(),
      name: gameNameRef.current,
      date: new Date().toISOString(),
      usScore: usScoreRef.current,
      themScore: themScoreRef.current,
      gameLog: gameLogRef.current,
    };
    saveGame(saved);
    return saved;
  }, [stopInterval]);

  return {
    gameName,
    usScore,
    themScore,
    possession,
    holdTime,
    gameLog,
    isTimeout,
    clockStarted,
    showingPossessionPicker,
    startGame,
    startClock,
    completedPass,
    turnover,
    score,
    setPossession,
    toggleTimeout,
    endAndSave,
  };
}
