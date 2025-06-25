import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isShuffled,
  repeatMode,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat
}) => {
  const getRepeatIcon = () => {
    if (repeatMode === 'one') return Repeat1;
    return Repeat;
  };

  const RepeatIcon = getRepeatIcon();

  return (
    <div className="flex items-center justify-center space-x-3 lg:space-x-4">
      <button
        onClick={onShuffle}
        className={`p-2 lg:p-3 rounded-full transition-all duration-200 touch-manipulation ${
          isShuffled 
            ? 'text-purple-400 bg-purple-400/20 shadow-lg' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 active:bg-gray-600'
        }`}
      >
        <Shuffle size={18} />
      </button>

      <button
        onClick={onPrevious}
        className="p-2 lg:p-3 text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 active:bg-gray-600 rounded-full transition-all duration-200 touch-manipulation"
      >
        <SkipBack size={22} />
      </button>

      <button
        onClick={onPlayPause}
        className="p-3 lg:p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl hover:shadow-purple-500/25 touch-manipulation"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      <button
        onClick={onNext}
        className="p-2 lg:p-3 text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 active:bg-gray-600 rounded-full transition-all duration-200 touch-manipulation"
      >
        <SkipForward size={22} />
      </button>

      <button
        onClick={onRepeat}
        className={`p-2 lg:p-3 rounded-full transition-all duration-200 touch-manipulation ${
          repeatMode !== 'none'
            ? 'text-purple-400 bg-purple-400/20 shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 active:bg-gray-600'
        }`}
      >
        <RepeatIcon size={18} />
      </button>
    </div>
  );
};