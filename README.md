# SUS - The Ultimate Deception Party Game

A multiplayer party game built with Next.js, TypeScript, and Tailwind CSS where players take turns giving clues about a secret word while one player (the "SUS") tries to blend in without knowing the word.

## 🎮 How to Play

1. **Create or Join a Room**: Players can create a new room or join an existing one using a 6-digit code
2. **Word Reveal**: All players except the SUS see the secret word
3. **Clue Phase**: Each player submits a clue about the word
4. **Voting Phase**: Players vote on who they think is the SUS
5. **Reveal**: The SUS is revealed and gets one chance to guess the word
6. **Scoring**: Points are awarded based on performance

## 🚀 Features

- **Real-time Multiplayer**: Built with Socket.IO for live game updates
- **Responsive Design**: Works on desktop and mobile devices
- **Beautiful Animations**: Smooth transitions powered by Framer Motion
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Room Management**: Unique 6-digit room codes for easy sharing
- **Game Phases**: Structured game flow with clear progression

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Real-time**: Socket.IO
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx          # Home page (create/join room)
│   ├── room/             # Room-related pages
│   │   ├── [roomId]/     # Dynamic room page
│   │   └── layout.tsx    # Room layout
│   ├── results/          # Game results page
│   └── api/              # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   ├── PlayerCard.tsx    # Player display component
│   └── Timer.tsx         # Countdown timer
├── store/                 # State management
│   └── gameStore.ts      # Zustand game store
├── types/                 # TypeScript type definitions
│   └── game.ts           # Game-related types
├── lib/                   # Utility functions
│   ├── utils.ts          # Game utilities
│   └── socket.ts         # Socket.IO client
└── data/                  # Static data
    └── words.json        # Word list for the game
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sus
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## 🎯 Game Rules

### Scoring System

- **SUS Player**:
  - +2 points for not being caught
  - +3 bonus points for guessing the word correctly

- **Regular Players**:
  - +2 points for correctly identifying the SUS
  - +1 bonus point for not being voted for

### Game Flow

1. **Lobby**: Players join and wait for the host to start
2. **Word Reveal**: Secret word is shown to all except SUS
3. **Clue Phase**: 30-second timer for clue submission
4. **Voting Phase**: 30-second timer for voting
5. **Reveal**: SUS identity and word revealed
6. **Score Update**: Points calculated and displayed
7. **Next Round**: Repeat or end game

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **Game Phases**: Add new phases to `GamePhase` enum in `types/game.ts`
2. **Components**: Create new components in `components/` directory
3. **State**: Extend the game store in `store/gameStore.ts`
4. **Types**: Add new interfaces in `types/game.ts`

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 🔮 Future Enhancements

- [ ] Custom word categories
- [ ] Player avatars and customization
- [ ] Sound effects and music
- [ ] Chat system
- [ ] Spectator mode
- [ ] Tournament mode
- [ ] Mobile app
- [ ] Social features (friends, leaderboards)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Socket.IO for real-time communication

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Happy Gaming! 🎉**
