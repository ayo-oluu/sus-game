# 🎮 Multiplayer SUS Game Setup

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Both Servers (Frontend + Backend)
```bash
npm run dev:full
```

This will start:
- **Frontend**: Next.js app on http://localhost:3000
- **Backend**: Socket.IO server on http://localhost:3001

### 3. Test Multiplayer

1. **Open first browser tab**: http://localhost:3000
2. **Create a room** with your name (e.g., "Alice")
3. **Copy the room code** that appears
4. **Open second browser tab**: http://localhost:3000
5. **Join the room** using the copied room code and a different name (e.g., "Bob")
6. **See both players** in the lobby!

## 🔧 Manual Server Start

If you prefer to run servers separately:

### Terminal 1 - Backend Server
```bash
npm run server
```

### Terminal 2 - Frontend
```bash
npm run dev
```

## 🌐 How It Works

### Backend (Socket.IO Server)
- **Room Management**: Creates and stores active game rooms
- **Player Synchronization**: Handles player joins/leaves
- **Game State**: Manages game phases and progression
- **Real-time Updates**: Broadcasts game events to all players

### Frontend (Next.js)
- **Socket Connection**: Connects to backend via Socket.IO
- **Real-time Updates**: Listens for game events and updates UI
- **State Management**: Uses Zustand for local game state
- **Responsive UI**: Beautiful interface with Framer Motion animations

## 🎯 Game Flow

1. **Lobby**: Players join and wait for host to start
2. **Word Reveal**: Secret word shown to all except SUS
3. **Clue Phase**: Players submit clues about the word
4. **Voting Phase**: Players vote on who is the SUS
5. **Reveal**: SUS identity revealed, gets to guess word
6. **Scoring**: Points calculated and displayed

## 🐛 Troubleshooting

### "Room not found" error
- Make sure the backend server is running (`npm run server`)
- Check that the room code is exactly 6 digits
- Verify the room wasn't deleted (empty rooms auto-delete)

### Players not appearing
- Check browser console for Socket.IO connection errors
- Ensure both frontend and backend are running
- Try refreshing the page

### Game not progressing
- Check that all players have submitted clues/votes
- Verify Socket.IO events are being emitted/received
- Check browser console for errors

## 🔮 Future Enhancements

- [ ] Persistent room storage (database)
- [ ] User authentication
- [ ] Game history and statistics
- [ ] Custom word categories
- [ ] Spectator mode
- [ ] Mobile app

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify both servers are running
3. Check the backend server console for connection logs
4. Ensure no firewall is blocking port 3001

---

**Happy Gaming! 🎉** 