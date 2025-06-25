import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, duration, onSeek }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    onSeek(newTime);
  };

  return (
    <div 
      className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group relative overflow-hidden"
      onClick={handleClick}
    >
      <div 
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-150 relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-2 border-purple-500" />
      </div>
    </div>
  );
};