'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { validatePlayerName, validateRoomCode } from '@/lib/utils';
import { GameSettings } from '@/types/game';

export default function HomePage() {
  const router = useRouter();
  const { createRoom, joinRoom, isLoading, error } = useGameStore();
  
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roundLimit, setRoundLimit] = useState('');
  const [playerNameError, setPlayerNameError] = useState('');
  const [roomCodeError, setRoomCodeError] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [activeModal, setActiveModal] = useState<'how-to-play' | 'scoring' | 'winning' | null>(null);

  const handleCreateRoom = async () => {
    if (!validatePlayerName(playerName)) {
      setPlayerNameError('Name must be 2-20 characters long');
      return;
    }
    
    if (!roundLimit) {
      return;
    }
    
    setPlayerNameError('');
    
    const settings: GameSettings = {
      maxPlayers: 8,
      clueTimeLimit: 60,
      votingTimeLimit: 30,
      totalRounds: roundLimit === 'unlimited' ? null : parseInt(roundLimit)
    };
    
    await createRoom(playerName, settings);
    router.push('/room/lobby');
  };

  const handleJoinRoom = async () => {
    if (!validatePlayerName(playerName)) {
      setPlayerNameError('Name must be 2-20 characters long');
      return;
    }
    
    if (!validateRoomCode(roomCode)) {
      setRoomCodeError('Please enter a valid 6-digit room code');
      return;
    }
    
    setPlayerNameError('');
    setRoomCodeError('');
    await joinRoom(roomCode, playerName);
    router.push(`/room/${roomCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            SUS
          </motion.h1>
          <p className="text-xl text-gray-600 mb-2">
            The Ultimate Deception Party Game
          </p>
          <p className="text-sm text-gray-500">
            Can you spot the imposter? Or will you be the one fooling everyone?
          </p>
        </motion.div>

        {/* Game Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* How to Play Card */}
          <motion.div
            className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105"
            whileHover={{ y: -5 }}
            onClick={() => setActiveModal('how-to-play')}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-semibold text-gray-800 mb-2">How to Play</h3>
              <p className="text-xs text-gray-600">Click to learn more</p>
            </div>
          </motion.div>

          {/* Scoring Card */}
          <motion.div
            className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105"
            whileHover={{ y: -5 }}
            onClick={() => setActiveModal('scoring')}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="font-semibold text-gray-800 mb-2">Scoring</h3>
              <p className="text-xs text-gray-600">Click to learn more</p>
            </div>
          </motion.div>

          {/* Winning Card */}
          <motion.div
            className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105"
            whileHover={{ y: -5 }}
            onClick={() => setActiveModal('winning')}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🏁</div>
              <h3 className="font-semibold text-gray-800 mb-2">Winning</h3>
              <p className="text-xs text-gray-600">Click to learn more</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Create Room
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'join'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Join Room
            </button>
          </div>

          <div className="p-6">
            {/* Player Name Input */}
            <Input
              label="Your Name"
              value={playerName}
              onChange={setPlayerName}
              placeholder="Enter your name"
              error={playerNameError}
              fullWidth
              required
              maxLength={20}
              className="mb-4"
            />

            {/* Create Room Tab */}
            {activeTab === 'create' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Rounds
                    <span className="text-red-500 ml-1 font-medium" style={{color: '#ef4444'}}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={roundLimit}
                      onChange={(e) => setRoundLimit(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 focus:border-blue-500 appearance-none"
                      required
                    >
                      <option value="">Select rounds...</option>
                      <option value="4">4 Rounds</option>
                      <option value="8">8 Rounds</option>
                      <option value="12">12 Rounds</option>
                      <option value="unlimited">UNLIMITED</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleCreateRoom}
                  disabled={!playerName.trim() || !roundLimit || isLoading}
                  fullWidth
                  size="lg"
                >
                  {isLoading ? 'Creating Room...' : 'Create Room'}
                </Button>
              </motion.div>
            )}

            {/* Join Room Tab */}
            {activeTab === 'join' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  label="Room Code"
                  value={roomCode}
                  onChange={setRoomCode}
                  placeholder="Enter 6-digit code"
                  error={roomCodeError}
                  fullWidth
                  required
                  maxLength={6}
                  className="mb-4"
                />
                <Button
                  onClick={handleJoinRoom}
                  disabled={!playerName.trim() || !roomCode.trim() || isLoading}
                  fullWidth
                  size="lg"
                >
                  {isLoading ? 'Joining Room...' : 'Join Room'}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* Modals */}
        {activeModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              {activeModal === 'how-to-play' && (
                <div>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🎮</div>
                    <h2 className="text-2xl font-bold text-gray-800">How to Play</h2>
                  </div>
                  <div className="space-y-3 text-gray-600">
                    <p>• 4–8 players hop into a game</p>
                    <p>• Each round, one person gets picked as the SUS player (they&apos;re left in the dark)</p>
                    <p>• A secret word or phrase shows up for everyone else</p>
                    <p>• Each player types a clue — just enough to hint, not enough to give it away 🤫</p>
                    <p>• The SUS player? Yeah, they gotta fake a clue without any hints 😅</p>
                    <p>• Once all clues are in, everyone votes on who&apos;s acting sus</p>
                  </div>
                </div>
              )}

              {activeModal === 'scoring' && (
                <div>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🧠</div>
                    <h2 className="text-2xl font-bold text-gray-800">Scoring</h2>
                  </div>
                  <div className="space-y-3 text-gray-600">
                    <p>• Guess the SUS correctly? <span className="font-semibold text-green-600">+1 point</span></p>
                    <p>• Wrong guess? <span className="font-semibold text-gray-600">0 points</span></p>
                    <p>• If the SUS escapes suspicion (receives less than half the votes): <span className="font-semibold text-green-600">+2 points</span></p>
                    <p>• If the SUS is caught (receives half or more votes): <span className="font-semibold text-gray-600">0 points</span></p>
                  </div>
                </div>
              )}

              {activeModal === 'winning' && (
                <div>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🏁</div>
                    <h2 className="text-2xl font-bold text-gray-800">Winning</h2>
                  </div>
                  <div className="space-y-3 text-gray-600">
                    <p>• Play for a set number of rounds</p>
                    <p>• The player with the most points at the end wins!</p>
                    <p className="text-sm text-gray-500 mt-4">
                      Choose from 4, 8, 12 rounds, or play unlimited until someone reaches 10 points!
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
