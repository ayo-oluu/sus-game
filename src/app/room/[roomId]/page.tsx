'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { GamePhase } from '@/types/game';
import Button from '@/components/ui/Button';
import PlayerCard from '@/components/PlayerCard';
import Timer from '@/components/Timer';
import { socketManager } from '@/lib/socket';

// Placeholder components for different game phases
const LobbyPhase = ({ onStartGame, currentRoom }: { onStartGame: () => void; currentRoom: any }) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Waiting for Players</h2>
    
    {/* Player Count */}
    <div className="mb-6">
      <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
        <span className="text-blue-800 font-semibold">
          {currentRoom.players.length} / {currentRoom.maxPlayers} Players
        </span>
      </div>
    </div>
    
    <p className="text-gray-600 mb-4">Share the room code with your friends to start playing!</p>
    
    {/* Minimum Players Notice */}
    {currentRoom.players.length < 4 && (
      <p className="text-orange-600 text-sm mb-6">
        ⚠️ Need at least 4 players to start the game
      </p>
    )}
    
    <Button 
      onClick={onStartGame} 
      size="lg"
      disabled={currentRoom.players.length < 4}
    >
      Start Game {currentRoom.players.length >= 4 ? '' : `(${4 - currentRoom.players.length} more needed)`}
    </Button>
  </motion.div>
);



const CluePhase = ({ 
  onSubmitClue, 
  onEditClue, 
  currentClue, 
  players, 
  currentPlayer,
  secretWord
}: { 
  onSubmitClue: (clue: string) => void;
  onEditClue: (clue: string) => void;
  currentClue: string;
  players: any[];
  currentPlayer: any;
  secretWord: string;
}) => {
  const [clue, setClue] = useState(currentClue);

  
  const hasSubmitted = currentPlayer?.clueSubmitted;
  const canEdit = !hasSubmitted;
  const isSUS = currentPlayer?.isSUS;
  
  const handleSubmit = () => {
    if (clue.trim()) {
      onSubmitClue(clue);
    }
  };
  
  const handleEdit = () => {
    if (clue.trim()) {
      onEditClue(clue);
    }
  };
  
  return (
    <motion.div
      className="text-center max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Word Reveal Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isSUS ? 'You are SUS!' : 'Secret Word'}
        </h2>
        {!isSUS && secretWord ? (
          <motion.div
            className="text-4xl font-bold text-blue-600 bg-white p-8 rounded-lg shadow-lg mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {secretWord}
          </motion.div>
        ) : isSUS ? (
          <motion.div
            className="text-4xl font-bold text-red-600 bg-red-50 p-8 rounded-lg shadow-lg mb-6 border-2 border-red-200"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            ???
          </motion.div>
        ) : null}
        <p className="text-gray-600">
          {isSUS 
            ? "You don't know the word. Try to blend in with your clues!"
            : "Remember this word and give clues that help others guess it."
          }
        </p>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6">Submit Your Clue</h3>
      <p className="text-gray-600 mb-6">Give a clue that helps others guess the word</p>
      
      {/* Clue Input */}
      <div className="mb-6">
        <input
          type="text"
          value={clue}
          onChange={(e) => setClue(e.target.value)}
          placeholder="Enter your clue..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-600 focus:ring-offset-white"
          maxLength={100}
          disabled={!canEdit}
          aria-label="Enter your clue about the secret word"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!hasSubmitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!clue.trim()}
            size="lg"
          >
            Submit Clue
          </Button>
        ) : canEdit ? (
          <Button 
            onClick={handleEdit} 
            disabled={!clue.trim()}
            variant="secondary"
            size="lg"
          >
            Update Clue
          </Button>
        ) : (
          <div className="text-green-600 font-semibold">
            ✓ Clue Submitted
          </div>
        )}
      </div>
      
      {/* Player Progress */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Player Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((player) => (
            <div 
              key={player.id}
              className={`p-3 rounded-lg border-2 ${
                player.clueSubmitted 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{player.name}</span>
                <span className={`text-sm ${
                  player.clueSubmitted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {player.clueSubmitted ? '✓ Submitted' : '⏳ Waiting'}
                </span>
              </div>
              {player.clueSubmitted && player.clue && (
                <p className="text-sm text-gray-600 mt-2 italic">&quot;{player.clue}&quot;</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const VotingPhase = ({ players, onVote, currentPlayer }: { 
  players: any[]; 
  onVote: (playerId: string) => void;
  currentPlayer: any;
}) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Vote for the SUS</h2>
    <p className="text-gray-600 mb-8">Review all clues and vote on who you think is the imposter</p>
    
    {/* Display all clues */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">All Clues</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {players.map((player) => (
          <div 
            key={player.id}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="font-medium text-gray-800 mb-2">{player.name}</div>
            <div className="text-gray-600 italic">&quot;{player.clue || 'No clue submitted'}&quot;</div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Voting Section */}
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Cast Your Vote</h3>
      <p className="text-sm text-gray-600 mb-4">
        {currentPlayer?.hasVoted ? '✓ You have voted' : 'Click on a player to vote'}
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          isCurrentPlayer={player.id === currentPlayer?.id}
          showVote={!currentPlayer?.hasVoted && player.id !== currentPlayer?.id}
          showSUSIndicator={false}
          onVote={onVote}
        />
      ))}
    </div>
  </motion.div>
);



const ScoreUpdatePhase = ({ roundResults, onStartNewRound, currentPlayer }: { 
  roundResults: any; 
  onStartNewRound: () => void;
  currentPlayer: any;
}) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Round Results</h2>
    
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
      {/* Voting Results */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Voting Results</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{roundResults.votesForSus}</p>
            <p className="text-sm text-blue-600">Votes for SUS</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{roundResults.totalVotes}</p>
            <p className="text-sm text-gray-600">Total Votes</p>
          </div>
        </div>
      </div>
      
      {/* SUS Reveal */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">The SUS was...</h3>
        <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-semibold text-lg">
            {roundResults.room?.players.find((p: any) => p.isSUS)?.name} was SUS!
          </p>
        </div>
        
        <div className={`p-4 rounded-lg ${
          roundResults.susEscaped ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`font-bold text-lg ${
            roundResults.susEscaped ? 'text-green-700' : 'text-red-700'
          }`}>
            {roundResults.susEscaped ? '🎉 SUS Escaped!' : '🎯 SUS Caught!'}
          </p>
          <p className="text-sm text-gray-600">
            {roundResults.susEscaped 
              ? 'The SUS player successfully avoided detection'
              : 'Players correctly identified the SUS'
            }
          </p>
        </div>
      </div>
      
      {/* Round Points Awarded */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Round Points</h3>
        <div className="space-y-2 text-sm">
          {roundResults.room?.players.map((player: any) => {
            const roundPoints = roundResults.roundPoints?.[player.id] || 0;
            return (
              <div key={player.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium text-gray-900">{player.name}</span>
                <div className="flex items-center gap-2">
                  {roundPoints > 0 && (
                    <motion.span 
                      className="text-green-600 font-bold"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      +{roundPoints}
                    </motion.span>
                  )}
                  {roundPoints === 0 && (
                    <span className="text-gray-500">+0</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Live Leaderboard */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Live Leaderboard</h3>
        <div className="space-y-2">
          {roundResults.room?.players
            .sort((a: any, b: any) => b.score - a.score)
            .map((player: any, index: number) => (
              <motion.div 
                key={player.id} 
                className="flex justify-between items-center p-3 bg-white border-2 rounded-lg shadow-sm"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                style={{
                  borderColor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#d97706' : '#e5e7eb'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${
                    index === 0 ? 'text-yellow-600' : 
                    index === 1 ? 'text-gray-600' : 
                    index === 2 ? 'text-amber-700' : 'text-gray-500'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <span className="font-medium text-gray-900">{player.name}</span>
                </div>
                <span className="text-xl font-bold text-green-600">{player.score} pts</span>
              </motion.div>
            ))}
        </div>
      </div>
      
      {/* Next Round Button */}
      {currentPlayer?.isHost && (
        <Button
          onClick={onStartNewRound}
          size="lg"
          className="mt-4"
        >
          Start Next Round
        </Button>
      )}
    </div>
  </motion.div>
);

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { currentRoom, currentPlayer, setGamePhase, setRoom, setCurrentPlayer } = useGameStore();
  const [gamePhase, setLocalGamePhase] = useState<GamePhase>(GamePhase.LOBBY);
  const [secretWord, setSecretWord] = useState(''); // Will be set after hydration
  const [roundResults, setRoundResults] = useState<any>(null);
  const [copyMessage, setCopyMessage] = useState('');
  const isClient = typeof window !== 'undefined';



  useEffect(() => {
    if (!currentRoom || !currentPlayer) {
      router.push('/');
      return;
    }
  }, [currentRoom, currentPlayer, router]);

  // Set secret word after hydration to avoid mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSecretWord('pizza'); // Placeholder word
    }
  }, []);

  // Socket.IO event listeners
  useEffect(() => {
    if (!currentRoom || !isClient) return;

    const socket = socketManager.getSocket();
    if (!socket) return;

    // Listen for player joins
    socket.on('player-joined', ({ room }) => {
      setRoom(room);
    });

    // Listen for game start
    socket.on('game-started', ({ room, secretWord, isSUS }) => {
      console.log('Game started:', { secretWord, isSUS, playerName: currentPlayer?.name });
      setRoom(room);
      setSecretWord(secretWord || ''); // Set word only for non-SUS players
      
      // Go directly to clue phase (backend sets this)
      setLocalGamePhase(GamePhase.CLUE_PHASE);
      setGamePhase(GamePhase.CLUE_PHASE);
      
      // Store SUS status for current player
      if (currentPlayer) {
        // Update the current player's SUS status
        setCurrentPlayer({ ...currentPlayer, isSUS });
      }
    });

        // Listen for clue submissions
    socket.on('clue-submitted', ({ room }) => {
      setRoom(room);
    });

    // Listen for clue updates
    socket.on('clue-updated', ({ room }) => {
      setRoom(room);
    });

    // Listen for all clues submitted
    socket.on('all-clues-submitted', ({ room }) => {
      setRoom(room);
      setLocalGamePhase(GamePhase.VOTING_PHASE);
      setGamePhase(GamePhase.VOTING_PHASE);
    });
    
    // Listen for vote submissions
    socket.on('vote-submitted', ({ room }) => {
      setRoom(room);
    });
    
    // Listen for all votes submitted
    socket.on('all-votes-submitted', ({ room }) => {
      setRoom(room);
      setLocalGamePhase(GamePhase.SCORE_UPDATE);
      setGamePhase(GamePhase.SCORE_UPDATE);
      
      // Now we can show SUS identity since voting is complete
      // The room data now includes the true SUS status
    });
    
    // Listen for round completion
    socket.on('round-complete', ({ room, susEscaped, votesForSus, totalVotes, roundPoints }) => {
      setRoom(room);
      setLocalGamePhase(GamePhase.SCORE_UPDATE);
      setGamePhase(GamePhase.SCORE_UPDATE);
      
      // Store round results for display
      setRoundResults({
        susEscaped,
        votesForSus,
        totalVotes,
        roundPoints,
        room
      });
    });

    // Listen for game over
    socket.on('game-over', ({ room, winner, gameOverReason, susEscaped, votesForSus, totalVotes, roundPoints }) => {
      setRoom(room);
      setLocalGamePhase(GamePhase.GAME_OVER);
      setGamePhase(GamePhase.GAME_OVER);
      
      setRoundResults({
        winner,
        gameOverReason,
        susEscaped,
        votesForSus,
        totalVotes,
        roundPoints,
        room
      });
    });

    // Listen for new round start
    socket.on('new-round-started', ({ room }) => {
      setRoom(room);
      setLocalGamePhase(GamePhase.LOBBY);
      setGamePhase(GamePhase.LOBBY);
      setSecretWord('');
      setRoundResults(null);
    });

          return () => {
        socket.off('player-joined');
        socket.off('game-started');
        socket.off('clue-submitted');
        socket.off('clue-updated');
        socket.off('all-clues-submitted');
        socket.off('vote-submitted');
        socket.off('all-votes-submitted');
        socket.off('round-complete');
        socket.off('game-over');
        socket.off('new-round-started');
      };
  }, [currentRoom, setRoom, setGamePhase, isClient]);

  const handleStartGame = () => {
    if (!currentRoom) return;
    
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('start-game', { roomCode: currentRoom.code });
    }
    
    // Don't set the game phase here - let the backend control it
    // The backend will emit 'game-started' which will set the phase
  };

  const handleSubmitClue = (clue: string) => {
    if (!currentRoom || !currentPlayer) return;
    
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('submit-clue', { 
        roomCode: currentRoom.code, 
        playerId: currentPlayer.id, 
        clue 
      });
    }
  };

  const handleEditClue = (clue: string) => {
    if (!currentRoom || !currentPlayer) return;
    
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('edit-clue', { 
        roomCode: currentRoom.code, 
        playerId: currentPlayer.id, 
        clue 
      });
    }
  };

  const handleVote = (playerId: string) => {
    if (!currentRoom || !currentPlayer) return;
    
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('submit-vote', { 
        roomCode: currentRoom.code, 
        playerId: currentPlayer.id, 
        voteForId: playerId 
      });
    }
    
    setLocalGamePhase(GamePhase.REVEAL_PHASE);
    setGamePhase(GamePhase.REVEAL_PHASE);
  };



  const handleStartNewRound = () => {
    if (!currentRoom) return;
    
    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit('start-new-round', { 
        roomCode: currentRoom.code
      });
    }
  };

  if (!currentRoom || !currentPlayer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Room {currentRoom.code}</h1>
              <p className="text-gray-600">
                {currentRoom.players.length} / {currentRoom.maxPlayers} players
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">Round {currentRoom.currentRound + 1}</p>
              <p className="text-sm text-gray-500">Phase: {gamePhase.replace('_', ' ')}</p>
            </div>
          </div>
          
          {/* Copy Room Code Button */}
          <div className="mt-4 flex flex-col items-center justify-center space-y-2">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(currentRoom.code);
                setCopyMessage('Room code copied!');
                setTimeout(() => setCopyMessage(''), 2000);
              }}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              📋 Copy Room Code: {currentRoom.code}
            </Button>
            {copyMessage && (
              <motion.p
                className="text-sm text-green-600 font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {copyMessage}
              </motion.p>
            )}
          </div>
        </div>

        {/* Game Phase Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {gamePhase === GamePhase.LOBBY && 'Lobby'}
                {gamePhase === GamePhase.CLUE_PHASE && 'Clue Phase'}
                {gamePhase === GamePhase.VOTING_PHASE && 'Voting Phase'}
                {gamePhase === GamePhase.SCORE_UPDATE && 'Score Update'}
                {gamePhase === GamePhase.GAME_OVER && 'Game Over'}
              </h2>
              {currentRoom.totalRounds && (
                <p className="text-sm text-gray-600 mt-1">
                  Round {currentRoom.currentRound} of {currentRoom.totalRounds}
                </p>
              )}
              {!currentRoom.totalRounds && currentRoom.currentRound > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Round {currentRoom.currentRound} (Unlimited)
                </p>
              )}
            </div>
            {gamePhase !== GamePhase.LOBBY && gamePhase !== GamePhase.SCORE_UPDATE && gamePhase !== GamePhase.GAME_OVER && (
              <Timer 
                key={`timer-${gamePhase}`}
                duration={gamePhase === GamePhase.CLUE_PHASE ? 60000 : 30000}
                onComplete={() => {}}
              />
            )}
          </div>
        </div>

        {/* Game Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AnimatePresence mode="wait">
            {gamePhase === GamePhase.LOBBY && (
              <LobbyPhase key="lobby" onStartGame={handleStartGame} currentRoom={currentRoom} />
            )}
            
            {gamePhase === GamePhase.CLUE_PHASE && (
              <CluePhase 
                key="clue" 
                onSubmitClue={handleSubmitClue}
                onEditClue={handleEditClue}
                currentClue={currentPlayer?.clue || ''}
                players={currentRoom?.players || []}
                currentPlayer={currentPlayer}
                secretWord={secretWord}
              />
            )}
            
            {gamePhase === GamePhase.VOTING_PHASE && (
              <VotingPhase 
                key="voting" 
                players={currentRoom.players} 
                onVote={handleVote}
                currentPlayer={currentPlayer}
              />
            )}
            
            {gamePhase === GamePhase.SCORE_UPDATE && roundResults && (
              <ScoreUpdatePhase 
                key="score" 
                roundResults={roundResults}
                onStartNewRound={handleStartNewRound}
                currentPlayer={currentPlayer}
              />
            )}

            {gamePhase === GamePhase.GAME_OVER && roundResults && (
              <GameOverPhase 
                key="game-over" 
                roundResults={roundResults}
                onPlayAgain={handleStartNewRound}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Live Leaderboard & Player List */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Live Leaderboard</h2>
          <div className="mb-6">
            {currentRoom.players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <motion.div 
                  key={player.id} 
                  className="flex justify-between items-center p-3 mb-2 bg-gray-50 rounded-lg border-l-4"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  style={{
                    borderLeftColor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#d97706' : '#e5e7eb'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${
                      index === 0 ? 'text-yellow-600' : 
                      index === 1 ? 'text-gray-600' : 
                      index === 2 ? 'text-amber-700' : 'text-gray-500'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className="font-medium text-gray-900">{player.name}</span>
                    {player.id === currentPlayer?.id && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                    )}
                  </div>
                  <span className="text-lg font-bold text-green-600">{player.score} pts</span>
                </motion.div>
              ))}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-700 mb-4">All Players</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRoom.players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isCurrentPlayer={player.id === currentPlayer.id}
                showSUSIndicator={gamePhase === GamePhase.SCORE_UPDATE}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const GameOverPhase = ({ roundResults, onPlayAgain }: {
  roundResults: any;
  onPlayAgain: () => void;
}) => {
  const isRoundLimitReached = roundResults.gameOverReason === 'rounds';
  
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h2 className="text-4xl font-bold text-green-600 mb-6">🎉 Game Over! 🎉</h2>
      <p className="text-xl text-gray-700 mb-8">
        {isRoundLimitReached ? (
          <>
            <span className="font-bold">{roundResults.winner}</span> wins with the highest score after {roundResults.room?.totalRounds} rounds!
          </>
        ) : (
          <>
            <span className="font-bold">{roundResults.winner}</span> wins with 10 points!
          </>
        )}
      </p>
    
    {/* Final Results */}
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto mb-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Final Results</h3>
      <div className="space-y-2">
        {roundResults.room?.players
          .sort((a: any, b: any) => b.score - a.score)
          .map((player: any, index: number) => (
            <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${
                  index === 0 ? 'text-yellow-600' : 
                  index === 1 ? 'text-gray-500' : 
                  index === 2 ? 'text-amber-700' : 'text-gray-500'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                </span>
                <span className="font-medium text-gray-900">{player.name}</span>
              </div>
              <span className="text-xl font-bold text-green-600">{player.score} pts</span>
            </div>
          ))}
      </div>
    </div>
    
    <Button onClick={onPlayAgain} size="lg">
      Play Again
    </Button>
  </motion.div>
  );
};