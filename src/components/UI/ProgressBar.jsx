import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';

const ProgressBar = ({ 
  value = 0, 
  maxValue = 100, 
  showPercentage = true, 
  height = 'h-2.5', 
  colorClass = 'bg-blue-600',
  label,
  animate = true,
  showAchievement = false
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const [showAnimation, setShowAnimation] = useState(false);

  // Calculate percentage
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  // Detect achievement (when value increases significantly)
  useEffect(() => {
    if (value > prevValue + (maxValue * 0.1) && showAchievement) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
    setPrevValue(value);
  }, [value, prevValue, maxValue, showAchievement]);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height} dark:bg-gray-700 relative`}>
        <motion.div
          className={`${colorClass} ${height} rounded-full`}
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {showAnimation && (
            <div className="absolute -right-4 -top-16">
              <Player
                autoplay
                src="/assets/animations/achievement-animation.json"
                className="w-20 h-20"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;