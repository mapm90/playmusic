import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { Track } from '../types/music';

interface PlaylistProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onTrackSelect: (track: Track, index: number) => void;
  formatTime: (seconds: number) => string;
}

export const Playlist: React.FC<PlaylistProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
  formatTime
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-bold flex items-center space-x-2">
          <Music size={18} />
          <span>Queue</span>
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {tracks.length} tracks
        </span>
      </div>
      
      <div className="space-y-2 flex-1 overflow-y-auto">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          
          return (
            <div
              key={track.id}
              onClick={() => onTrackSelect(track, index)}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 touch-manipulation ${
                isCurrentTrack
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 shadow-lg'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600'
              }`}
            >
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                {isCurrentTrack && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    {isPlaying ? (
                      <Pause size={14} className="text-white" />
                    ) : (
                      <Play size={14} className="text-white" />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate text-sm lg:text-base ${
                  isCurrentTrack ? 'text-purple-400' : ''
                }`}>
                  {track.title}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm truncate">
                  {track.artist}
                </p>
              </div>
              
              <span className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm flex-shrink-0">
                {formatTime(track.duration)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};