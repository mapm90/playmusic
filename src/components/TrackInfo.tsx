import React from 'react';
import { Track } from '../types/music';

interface TrackInfoProps {
  track: Track | null;
  centered?: boolean;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ track, centered = false }) => {
  if (!track) return null;

  return (
    <div className={`${centered ? 'text-center' : 'flex items-center space-x-4'}`}>
      {!centered && (
        <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={`${centered ? '' : 'flex-1 min-w-0'}`}>
        <h3 className={`font-semibold ${centered ? 'text-2xl mb-2' : 'text-lg'} truncate`}>
          {track.title}
        </h3>
        <p className={`text-gray-500 dark:text-gray-400 ${centered ? 'text-lg' : 'text-sm'} truncate`}>
          {track.artist}
        </p>
        {centered && (
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            {track.album} {track.year && `• ${track.year}`}
          </p>
        )}
      </div>
    </div>
  );
};