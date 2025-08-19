'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ResultsPage() {
  const router = useRouter();

  // Placeholder data - in real app this would come from the game store
  const finalScores = [
    { name: 'Alice', score: 15, rank: 1 },
    { name: 'Bob', score: 12, rank: 2 },
    { name: 'Charlie', score: 10, rank: 3 },
    { name: 'Diana', score: 8, rank: 4 },
  ];

  const handlePlayAgain = () => {
    router.push('/');
  };

  const handleNewGame = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Game Over!</h1>
          <p className="text-xl text-gray-600">Final Results</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-lg p-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Final Standings</h2>
          
          <div className="space-y-4">
            {finalScores.map((player, index) => (
              <motion.div
                key={player.name}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  index === 0 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : index === 1 
                    ? 'border-gray-300 bg-gray-50'
                    : index === 2
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-200 bg-white'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-500' : 
                    index === 2 ? 'bg-amber-600' : 'bg-gray-400'
                  }`}>
                    {player.rank}
                  </div>
                  <span className="font-semibold text-gray-800">{player.name}</span>
                </div>
                <span className="text-2xl font-bold text-gray-700">{player.score}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={handlePlayAgain}
            variant="primary"
            size="lg"
            fullWidth
            className="sm:flex-1"
          >
            Play Again
          </Button>
          <Button
            onClick={handleNewGame}
            variant="secondary"
            size="lg"
            fullWidth
            className="sm:flex-1"
          >
            New Game
          </Button>
        </motion.div>

        {/* Game Statistics */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Game Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-sm text-gray-600">Rounds Played</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-sm text-gray-600">SUS Caught</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">2</p>
              <p className="text-sm text-gray-600">SUS Escaped</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">15</p>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 