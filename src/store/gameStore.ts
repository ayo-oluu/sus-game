import { create } from 'zustand';
import { Room, Player, GamePhase, GameSettings } from '@/types/game';
import { socketManager } from '@/lib/socket';

// Helper to check if we're on the client
const isClient = typeof window !== 'undefined';

interface GameStore {
  // Current room state
  currentRoom: Room | null;
  currentPlayer: Player | null;
  
  // Game state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setRoom: (room: Room) => void;
  setCurrentPlayer: (player: Player) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setGamePhase: (phase: GamePhase) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetGame: () => void;
  
  // Room management
  createRoom: (playerName: string, settings?: GameSettings) => Promise<void>;
  joinRoom: (roomCode: string, playerName: string) => Promise<void>;
  leaveRoom: () => void;
}

const defaultSettings: GameSettings = {
  clueTimeLimit: 30000, // 30 seconds
  votingTimeLimit: 30000, // 30 seconds
  totalRounds: 5,
  maxPlayers: 8
};

export const useGameStore = create<GameStore>((set, get) => ({
  currentRoom: null,
  currentPlayer: null,
  isLoading: false,
  error: null,
  
  // Initialize store only on client to prevent hydration mismatches
  ...(isClient ? {} : {
    currentRoom: null,
    currentPlayer: null,
    isLoading: false,
    error: null,
  }),

  setRoom: (room) => {
    if (isClient) set({ currentRoom: room });
  },
  
  setCurrentPlayer: (player) => {
    if (isClient) set({ currentPlayer: player });
  },
  
  updatePlayer: (playerId, updates) => {
    if (!isClient) return;
    
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const updatedPlayers = currentRoom.players.map(player =>
      player.id === playerId ? { ...player, ...updates } : player
    );
    
    set({
      currentRoom: { ...currentRoom, players: updatedPlayers }
    });
  },
  
  setGamePhase: (phase) => {
    if (!isClient) return;
    
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    set({
      currentRoom: {
        ...currentRoom,
        gameState: { ...currentRoom.gameState, phase }
      }
    });
  },
  
  setLoading: (loading) => {
    if (isClient) set({ isLoading: loading });
  },
  
  setError: (error) => {
    if (isClient) set({ error });
  },
  
  resetGame: () => {
    if (isClient) set({
      currentRoom: null,
      currentPlayer: null,
      error: null
    });
  },

  createRoom: async (playerName, settings = defaultSettings) => {
    set({ isLoading: true, error: null });
    
    try {
      // Only generate random values on the client to avoid hydration mismatches
      if (!isClient) {
        set({ isLoading: false, error: 'Client-side only' });
        return;
      }
      
      // Connect to Socket.IO server
      const socket = socketManager.connect();
      
      // Listen for room creation response
      socket.on('room-created', ({ room, player }) => {
        set({
          currentRoom: room,
          currentPlayer: player,
          isLoading: false
        });
      });
      
      // Emit create-room event
      socket.emit('create-room', { playerName, settings });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create room',
        isLoading: false
      });
    }
  },

  joinRoom: async (roomCode, playerName) => {
    set({ isLoading: true, error: null });
    
    try {
      // Only generate random values on the client to avoid hydration mismatches
      if (!isClient) {
        set({ isLoading: false, error: 'Client-side only' });
        return;
      }
      
      // Connect to Socket.IO server
      const socket = socketManager.connect();
      
      // Listen for join response
      socket.on('player-joined', ({ room, player }) => {
        set({
          currentRoom: room,
          currentPlayer: player,
          isLoading: false
        });
      });
      
      // Listen for join errors
      socket.on('join-error', ({ message }) => {
        set({
          error: message,
          isLoading: false
        });
      });
      
      // Emit join-room event
      socket.emit('join-room', { roomCode, playerName });
      
          } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to join room',
          isLoading: false
        });
      }
    },

  leaveRoom: () => {
    // TODO: Emit leave-room event via Socket.IO
    get().resetGame();
  }
})); 