export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isSUS: boolean;
  score: number;
  avatar?: string;
  hasSubmittedClue: boolean;
  clue?: string;
  hasVoted: boolean;
  voteFor?: string;
}

export interface Room {
  id: string;
  code: string;
  players: Player[];
  maxPlayers: number;
  gameState: GameState;
  currentRound: number;
  totalRounds: number;
  secretWord: string;
  roundStartTime?: number;
  clueTimeLimit: number;
  votingTimeLimit: number;
}

export interface GameState {
  phase: GamePhase;
  currentPlayerTurn?: string;
  roundTimer?: number;
  roundResults?: RoundResult;
}

export enum GamePhase {
  LOBBY = 'lobby',
  WORD_REVEAL = 'word_reveal',
  CLUE_PHASE = 'clue_phase',
  VOTING_PHASE = 'voting_phase',
  REVEAL_PHASE = 'reveal_phase',
  SCORE_UPDATE = 'score_update',
  GAME_OVER = 'game_over'
}

export interface RoundResult {
  susPlayerId: string;
  susGuessedCorrectly: boolean;
  susGuess?: string;
  correctWord: string;
  playerVotes: Record<string, string>; // playerId -> votedForId
  roundPoints: Record<string, number>;
}

export interface GameSettings {
  clueTimeLimit: number;
  votingTimeLimit: number;
  totalRounds: number | null; // null means unlimited
  maxPlayers: number;
}

export interface SocketEvents {
  // Room management
  'join-room': { roomCode: string; playerName: string };
  'leave-room': { roomId: string; playerId: string };
  'create-room': { playerName: string; settings: GameSettings };
  
  // Game flow
  'start-game': { roomId: string };
  'submit-clue': { roomId: string; playerId: string; clue: string };
  'submit-vote': { roomId: string; playerId: string; voteForId: string };
  'sus-guess': { roomId: string; playerId: string; guess: string };
  'next-round': { roomId: string };
  
  // Room updates
  'room-update': Room;
  'player-joined': Player;
  'player-left': { playerId: string };
  'game-error': { message: string };
} 