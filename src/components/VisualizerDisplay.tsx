import React from 'react';

interface VisualizerDisplayProps {
  isPlaying: boolean;
}

export const VisualizerDisplay: React.FC<VisualizerDisplayProps> = ({ isPlaying }) => {
  return (
    <div className="flex justify-center">
      <div className="flex items-end space-x-1 h-16">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-pulse' : ''
            }`}
            style={{
              height: `${Math.random() * 40 + 8}px`,
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};