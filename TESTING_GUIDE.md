# 🧪 Testing Guide: 4-Player Multiplayer SUS Game

## 🚀 **Quick Test Setup**

### **Step 1: Start Servers**
```bash
npm run dev:full
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### **Step 2: Test with 4 Browser Tabs**

#### **Tab 1: Host (Alice)**
1. Go to http://localhost:3000
2. Enter name: **"Alice"**
3. Click **"Create Room"**
4. **Copy the room code** (6 digits)
5. Wait for other players to join

#### **Tab 2: Player 2 (Bob)**
1. Go to http://localhost:3000
2. Click **"Join Room"** tab
3. Enter name: **"Bob"**
4. Enter room code from Tab 1
5. Click **"Join Room"**

#### **Tab 3: Player 3 (Charlie)**
1. Go to http://localhost:3000
2. Click **"Join Room"** tab
3. Enter name: **"Charlie"**
4. Enter room code from Tab 1
5. Click **"Join Room"**

#### **Tab 4: Player 4 (Diana)**
1. Go to http://localhost:3000
2. Click **"Join Room"** tab
3. Enter name: **"Diana"**
4. Enter room code from Tab 1
5. Click **"Join Room"**

## 🎯 **What You Should See**

### **In Each Tab:**
- ✅ **Room Code**: Same 6-digit code in all tabs
- ✅ **Player Count**: Shows "4 / 8 Players"
- ✅ **Player List**: All 4 players visible
- ✅ **Start Button**: Becomes enabled (no longer grayed out)

### **In Host Tab (Alice):**
- 🎮 **Start Game Button**: Now clickable
- 📋 **Copy Room Code Button**: Easy to share

## 🎮 **Test the Full Game Flow**

### **1. Start Game**
- Host clicks **"Start Game"**
- All tabs should show **"Word Reveal"** phase
- 3 players see the secret word
- 1 player (SUS) sees "You are SUS!"

### **2. Submit Clues**
- Each player enters a clue about the word
- Watch the progress bars fill up
- All players should advance to voting phase together

### **3. Vote for SUS**
- Each player votes on who they think is the SUS
- Watch the voting progress
- All players should advance to reveal phase together

### **4. SUS Reveal & Guess**
- SUS identity is revealed to all players
- SUS gets to guess the word
- Round completes with scoring

## 🔍 **Troubleshooting**

### **Players Not Appearing**
- Check browser console for errors
- Verify backend server is running (`npm run server`)
- Try refreshing the page

### **Game Not Progressing**
- Ensure all players have submitted clues/votes
- Check that Socket.IO events are working
- Look for console errors

### **Room Code Issues**
- Make sure you're copying the exact 6-digit code
- Verify the room wasn't deleted (check backend console)
- Try creating a new room

## 📱 **Alternative Testing Methods**

### **Method A: Multiple Browsers**
- Chrome: 2 tabs
- Firefox: 1 tab
- Safari: 1 tab

### **Method B: Incognito Windows**
- Each incognito window = separate session
- Perfect for testing multiple players

### **Method C: Different Devices**
- Desktop + Mobile + Tablet
- Test cross-device compatibility

## 🎉 **Success Indicators**

✅ **4 players visible in lobby**
✅ **Start Game button enabled**
✅ **All players progress through phases together**
✅ **Real-time updates across all tabs**
✅ **No console errors**
✅ **Backend shows active connections**

---

**Happy Testing! 🎮✨** 