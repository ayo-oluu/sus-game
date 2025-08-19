# Vercel Deployment Guide for SUS Game

## ⚠️ Important Note

**This game requires a separate Socket.IO server for multiplayer functionality.** Vercel's serverless functions don't support long-running WebSocket connections needed for real-time multiplayer games.

## 🚀 Deployment Options

### Option 1: Frontend Only on Vercel (Recommended for Demo)
- Deploy the Next.js frontend to Vercel
- Use a separate hosting service for the Socket.IO backend
- Update the frontend to connect to your external Socket.IO server

### Option 2: Alternative Hosting
- Deploy both frontend and backend to a platform that supports WebSockets
- Options: Railway, Render, DigitalOcean, Heroku, or your own VPS

## 🔧 For Vercel Frontend Deployment

1. **Remove server dependencies** from `package.json`:
   ```json
   {
     "dependencies": {
       "cors": "^2.8.5",
       "express": "^5.1.0",
       "socket.io": "^4.8.1"
     }
   }
   ```

2. **Update environment variables** to point to your external Socket.IO server:
   ```env
   NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

## 🌐 Socket.IO Server Hosting

For the multiplayer backend, consider:
- **Railway**: Easy deployment, supports WebSockets
- **Render**: Free tier available, WebSocket support
- **DigitalOcean App Platform**: Reliable, good performance
- **Heroku**: Classic choice for Node.js apps

## 📱 Demo Version

If you want to deploy just the frontend to Vercel for demonstration purposes, the game will show the UI but won't have multiplayer functionality until connected to a Socket.IO server. 