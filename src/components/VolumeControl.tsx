import React, { useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const getVolumeIcon = () => {
    if (volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = clickX / rect.width;
    onVolumeChange(Math.max(0, Math.min(1, newVolume)));
  };

  return (
    <div className="flex items-center space-x-3">
      <button 
        onClick={() => setShowVolumeSlider(!showVolumeSlider)}
        className="p-2 lg:p-3 text-gray-400 hover:text-white transition-colors duration-200 touch-manipulation"
      >
        <VolumeIcon size={20} />
      </button>
      
      {/* Mobile/Touch-friendly horizontal slider */}
      <div className="flex items-center">
        <div 
          className="w-20 lg:w-24 h-2 bg-gray-600 dark:bg-gray-500 rounded-full cursor-pointer relative touch-manipulation"
          onClick={handleVolumeClick}
        >
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-150"
            style={{ width: `${volume * 100}%` }}
          />
          <div 
            className="absolute w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1 border-2 border-purple-500 transition-all duration-150 touch-manipulation"
            style={{ left: `${volume * 100}%`, marginLeft: '-8px' }}
          />
        </div>
      </div>
    </div>
  );
};