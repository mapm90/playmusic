import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Maximize2 } from 'lucide-react';

interface MiniPlayerProps {
  audioPlayer: any;
  onOpenPlayer: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ audioPlayer, onOpenPlayer }) => {
  const { playerState, togglePlayPause, nextTrack, previousTrack } = audioPlayer;
  const { currentTrack, isPlaying } = playerState;

  if (!currentTrack) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 lg:p-4 mb-16 lg:mb-0">
      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium truncate text-sm lg:text-base">{currentTrack.title}</h4>
            <p className="text-gray-500 dark:text-gray-400 truncate text-xs lg:text-sm">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={previousTrack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 rounded-lg transition-colors touch-manipulation"
          >
            <SkipBack size={16} />
          </button>
          
          <button
            onClick={togglePlayPause}
            className="p-2 bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white rounded-lg transition-colors touch-manipulation"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <button
            onClick={nextTrack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 rounded-lg transition-colors touch-manipulation"
          >
            <SkipForward size={16} />
          </button>
          
          <button
            onClick={onOpenPlayer}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 rounded-lg transition-colors ml-1 lg:ml-2 touch-manipulation"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};