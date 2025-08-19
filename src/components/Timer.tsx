import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ClientOnly from './ClientOnly';

interface TimerProps {
  duration: number; // in milliseconds
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  onComplete,
  size = 'md',
  showProgress = true,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting and hydration
  useEffect(() => {
    setIsMounted(true);
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (!isRunning || !isMounted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, onComplete, isMounted]);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((duration - timeLeft) / duration) * 100;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16 text-lg';
      case 'lg':
        return 'w-32 h-32 text-3xl';
      default:
        return 'w-24 h-24 text-2xl';
    }
  };

  const getProgressSize = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16';
      case 'lg':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  const getStrokeWidth = () => {
    switch (size) {
      case 'sm':
        return 3;
      case 'lg':
        return 8;
      default:
        return 4;
    }
  };

  const radius = size === 'sm' ? 26.5 : size === 'lg' ? 56 : 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (getProgressPercentage() / 100) * circumference;

  return (
    <ClientOnly 
      key={`timer-${duration}-${size}`}
      fallback={
        <div className={`relative ${getSizeClasses()} ${className}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-bold text-center">
              {formatTime(duration)}
            </div>
          </div>
        </div>
      }
    >
      <div className={`relative ${getSizeClasses()} ${className}`}>
        {/* Circular progress bar */}
        {showProgress && (
          <svg className={`absolute inset-0 ${getProgressSize()} transform -rotate-90`}>
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth={getStrokeWidth()}
              fill="transparent"
              className="text-gray-200"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth={getStrokeWidth()}
              fill="transparent"
              className="text-blue-500"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </svg>
        )}
        
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="font-bold text-center"
            initial={{ scale: 1 }}
            animate={{ scale: timeLeft < 5000 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: timeLeft < 5000 ? Infinity : 0 }}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>
        
        {/* Warning indicator for low time */}
        {timeLeft < 5000 && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </ClientOnly>
  );
};

export default Timer; 