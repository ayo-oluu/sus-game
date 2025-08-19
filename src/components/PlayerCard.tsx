import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@/types/game';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  showVote?: boolean;
  showSUSIndicator?: boolean;
  onVote?: (playerId: string) => void;
  disabled?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentPlayer,
  showVote = false,
  showSUSIndicator = false,
  onVote,
  disabled = false
}) => {
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.div
      className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
        isCurrentPlayer 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${disabled ? 'opacity-60' : ''}`}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Host indicator */}
      {player.isHost && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          HOST
        </div>
      )}
      
      {/* SUS indicator (only shown after reveal phase) */}
      {player.isSUS && showSUSIndicator && (
        <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          SUS
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full ${getAvatarColor(player.name)} flex items-center justify-center text-white font-bold text-lg`}>
          {player.avatar || getInitials(player.name)}
        </div>
        
        {/* Player info */}
        <div className="flex-1">
          <h3 className={`font-semibold ${isCurrentPlayer ? 'text-blue-700' : 'text-gray-800'}`}>
            {player.name}
            {isCurrentPlayer && <span className="ml-2 text-sm text-blue-500">(You)</span>}
          </h3>
          <p className="text-sm text-gray-600">Score: {player.score}</p>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-2 mt-1">
            {player.hasSubmittedClue && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Clue
              </span>
            )}
            {player.hasVoted && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ✓ Voted
              </span>
            )}
          </div>
        </div>
        
        {/* Vote button */}
        {showVote && onVote && !isCurrentPlayer && (
          <motion.button
            onClick={() => onVote(player.id)}
            disabled={disabled}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            Vote
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerCard; 