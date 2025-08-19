const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Load words from JSON file
function loadWords() {
  try {
    const wordsPath = path.join(__dirname, 'src', 'data', 'words.json');
    const wordsData = fs.readFileSync(wordsPath, 'utf8');
    const parsed = JSON.parse(wordsData);
    return parsed.words || [];
  } catch (error) {
    console.error('Error loading words:', error);
    // Fallback to some basic words if file can't be loaded
    return ['pizza', 'beach', 'game', 'music', 'food'];
  }
}

const gameWords = loadWords();
console.log(`Loaded ${gameWords.length} words for the game`);
console.log('Sample words:', gameWords.slice(0, 10));
console.log('Last few words:', gameWords.slice(-5));

// Store active rooms
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new room
  socket.on('create-room', ({ playerName, settings }) => {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const playerId = Math.random().toString(36).substr(2, 9);
    
    const newPlayer = {
      id: playerId,
      name: playerName,
      isHost: true,
      isSUS: false,
      score: 0,
      hasSubmittedClue: false,
      clueSubmitted: false,
      clue: '',
      hasVoted: false,
      voteFor: ''
    };
    
    const newRoom = {
      id: Math.random().toString(36).substr(2, 9),
      code: roomCode,
      players: [newPlayer],
      maxPlayers: settings?.maxPlayers || 8,
      gameState: { phase: 'lobby' },
      currentRound: 0,
      totalRounds: settings?.totalRounds || 5,
      secretWord: '',
      clueTimeLimit: settings?.clueTimeLimit || 30000,
      votingTimeLimit: settings?.votingTimeLimit || 30000
    };
    
    // Store room
    rooms.set(roomCode, newRoom);
    
    // Join socket to room
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.playerId = playerId;
    
    // Send room info back to creator
    socket.emit('room-created', { room: newRoom, player: newPlayer });
    
    console.log(`Room created: ${roomCode} by ${playerName}`);
  });

  // Join an existing room
  socket.on('join-room', ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('join-error', { message: 'Room not found' });
      return;
    }
    
    if (room.players.length >= room.maxPlayers) {
      socket.emit('join-error', { message: 'Room is full' });
      return;
    }
    
    const playerId = Math.random().toString(36).substr(2, 9);
    const newPlayer = {
      id: playerId,
      name: playerName,
      isHost: false,
      isSUS: false,
      score: 0,
      hasSubmittedClue: false,
      clueSubmitted: false,
      clue: '',
      hasVoted: false,
      voteFor: ''
    };
    
    // Add player to room
    room.players.push(newPlayer);
    
    // Join socket to room
    socket.join(roomCode);
    socket.roomCode = roomCode;
    socket.playerId = playerId;
    
    // Notify all players in the room
    io.to(roomCode).emit('player-joined', { player: newPlayer, room });
    
    console.log(`${playerName} joined room ${roomCode}`);
  });

  // Start the game
  socket.on('start-game', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    // Assign SUS role randomly
    const susIndex = Math.floor(Math.random() * room.players.length);
    room.players.forEach((player, index) => {
      player.isSUS = index === susIndex;
    });
    
    // Select a random word from the loaded word list
    const randomIndex = Math.floor(Math.random() * gameWords.length);
    room.secretWord = gameWords[randomIndex];
    console.log(`[${new Date().toISOString()}] Selected word: "${room.secretWord}" (index: ${randomIndex}) from ${gameWords.length} total words`);
    
    // Update game state
    room.gameState.phase = 'clue_phase';
    
    // Send personalized game start data to each player
    room.players.forEach(player => {
      const gameData = {
        room: {
          ...room,
          // Hide SUS identity from all players
          players: room.players.map(p => ({
            ...p,
            isSUS: false // Hide SUS identity from everyone
          }))
        },
        // Only show word to non-SUS players
        secretWord: player.isSUS ? null : room.secretWord,
        isSUS: player.isSUS
      };
      
      // Send to specific player using their socket
      const playerSocket = Array.from(io.sockets.sockets.values())
        .find(s => s.playerId === player.id);
      
      if (playerSocket) {
        playerSocket.emit('game-started', gameData);
      }
    });
    
    console.log(`Game started in room ${roomCode}, SUS is: ${room.players[susIndex].name}`);
  });

  // Submit a clue
  socket.on('submit-clue', ({ roomCode, playerId, clue }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.hasSubmittedClue = true;
      player.clue = clue;
      player.clueSubmitted = true;
    }
    
    // Notify all players about the clue submission
    io.to(roomCode).emit('clue-submitted', { room });
    
    // Check if all players have submitted clues
    const allCluesSubmitted = room.players.every(p => p.clueSubmitted);
    if (allCluesSubmitted) {
      room.gameState.phase = 'voting_phase';
      io.to(roomCode).emit('all-clues-submitted', { room });
    }
  });

  // Edit a clue (before all clues are submitted)
  socket.on('edit-clue', ({ roomCode, playerId, clue }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    const player = room.players.find(p => p.id === playerId);
    if (player && room.gameState.phase === 'clue_phase') {
      player.clue = clue;
      io.to(roomCode).emit('clue-updated', { room });
    }
  });

  // Submit a vote
  socket.on('submit-vote', ({ roomCode, playerId, voteForId }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.hasVoted = true;
      player.voteFor = voteForId;
    }
    
    // Check if all players have voted
    const allVotesSubmitted = room.players.every(p => p.hasVoted);
    if (allVotesSubmitted) {
      room.gameState.phase = 'score_update';
      
      // Calculate scores
      const susPlayer = room.players.find(p => p.isSUS);
      const totalVotes = room.players.length;
      const votesForSus = room.players.filter(p => p.voteFor === susPlayer.id).length;
      const majorityVote = Math.ceil(totalVotes / 2);
      
      // SUS escaped if they got less than majority votes
      const susEscaped = votesForSus < majorityVote;
      
      // Calculate round points for each player
      const roundPoints = {};
      room.players.forEach(player => {
        if (player.isSUS) {
          // SUS gets 2 points if they escape, 0 if caught
          const points = susEscaped ? 2 : 0;
          player.score += points;
          roundPoints[player.id] = points;
        } else {
          // Non-SUS players get 1 point if they voted correctly
          const votedCorrectly = player.voteFor === susPlayer.id;
          const points = votedCorrectly ? 1 : 0;
          player.score += points;
          roundPoints[player.id] = points;
        }
      });
      
      // Check for winner (first to 10 points) or round limit reached
      const winner = room.players.find(p => p.score >= 10);
      const roundLimitReached = room.totalRounds && room.currentRound >= room.totalRounds;
      
      // Now reveal the SUS identity to everyone
      const roomWithSUS = {
        ...room,
        players: room.players.map(p => ({
          ...p,
          isSUS: p.isSUS // Now show SUS identity
        }))
      };
      
      if (winner || roundLimitReached) {
        // Game over - someone won or round limit reached
        room.gameState.phase = 'game_over';
        
        let gameOverReason = '';
        let finalWinner = null;
        
        if (winner) {
          gameOverReason = 'score';
          finalWinner = winner.name;
        } else if (roundLimitReached) {
          gameOverReason = 'rounds';
          // Find player with highest score
          const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
          finalWinner = sortedPlayers[0].name;
        }
        
        io.to(roomCode).emit('game-over', { 
          room: roomWithSUS, 
          winner: finalWinner,
          gameOverReason,
          susEscaped,
          votesForSus,
          totalVotes,
          roundPoints
        });
      } else {
        // Continue to next round
        io.to(roomCode).emit('round-complete', { 
          room: roomWithSUS,
          susEscaped,
          votesForSus,
          totalVotes,
          roundPoints
        });
      }
    } else {
      io.to(roomCode).emit('vote-submitted', { room });
    }
  });

  // Start new round
  socket.on('start-new-round', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    // Reset round state
    room.currentRound++;
    room.gameState.phase = 'lobby';
    
    // Clear previous round data
    room.players.forEach(player => {
      player.hasSubmittedClue = false;
      player.clueSubmitted = false;
      player.clue = '';
      player.hasVoted = false;
      player.voteFor = '';
      player.isSUS = false;
    });
    
    // Select new random word from the loaded word list
    const randomIndex = Math.floor(Math.random() * gameWords.length);
    room.secretWord = gameWords[randomIndex];
    console.log(`[${new Date().toISOString()}] New round word: "${room.secretWord}" (index: ${randomIndex}) from ${gameWords.length} total words`);
    
    // Notify all players
    io.to(roomCode).emit('new-round-started', { room });
    
    console.log(`New round started in room ${roomCode}, word: ${room.secretWord}`);
  });

  // SUS guess (optional - can be removed if not needed)
  socket.on('sus-guess', ({ roomCode, playerId, guess }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    
    const susPlayer = room.players.find(p => p.id === playerId && p.isSUS);
    if (susPlayer) {
      const correct = guess.toLowerCase() === room.secretWord.toLowerCase();
      // SUS gets bonus points for guessing correctly
      susPlayer.score += correct ? 1 : 0;
      
      io.to(roomCode).emit('sus-guess-result', { room, correct, guess });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.roomCode) {
      const room = rooms.get(socket.roomCode);
      if (room) {
        // Remove player from room
        room.players = room.players.filter(p => p.id !== socket.playerId);
        
        if (room.players.length === 0) {
          // Delete empty room
          rooms.delete(socket.roomCode);
          console.log(`Room ${socket.roomCode} deleted (empty)`);
        } else {
          // Notify remaining players
          io.to(socket.roomCode).emit('player-left', { room });
          console.log(`Player left room ${socket.roomCode}`);
        }
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Active rooms: ${rooms.size}`);
}); 