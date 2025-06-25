import React from 'react';
import { Power, RotateCcw, Settings } from 'lucide-react';

interface EqualizerProps {
  equalizer: any;
}

export const Equalizer: React.FC<EqualizerProps> = ({ equalizer }) => {
  const { equalizerState, updateBand, toggleEqualizer, setPreset, setBass, setTreble, resetEqualizer } = equalizer;

  const presets = [
    'Flat',
    'Rock',
    'Pop',
    'Jazz',
    'Classical',
    'Electronic',
    'Hip Hop',
    'Vocal'
  ];

  const handlePresetClick = (preset: string) => {
    try {
      // Prevent default touch behavior
      setPreset(preset);
    } catch (error) {
      console.error('Error setting preset:', error);
    }
  };

  const handleBandChange = (index: number, value: string) => {
    try {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        updateBand(index, numValue);
      }
    } catch (error) {
      console.error('Error updating band:', error);
    }
  };

  const handleBassChange = (value: string) => {
    try {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setBass(numValue);
      }
    } catch (error) {
      console.error('Error setting bass:', error);
    }
  };

  const handleTrebleChange = (value: string) => {
    try {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        setTreble(numValue);
      }
    } catch (error) {
      console.error('Error setting treble:', error);
    }
  };

  return (
    <div className="p-4 lg:p-6 h-full pb-20 lg:pb-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Audio Equalizer</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                Fine-tune your audio experience
              </p>
            </div>
            <div className="flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={resetEqualizer}
                className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-600 rounded-lg transition-colors text-sm lg:text-base touch-manipulation min-h-[44px]"
                type="button"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <button
                onClick={toggleEqualizer}
                className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base touch-manipulation min-h-[44px] ${
                  equalizerState.isEnabled
                    ? 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-600'
                }`}
                type="button"
              >
                <Power size={16} />
                <span>{equalizerState.isEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Presets */}
          <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-base lg:text-lg font-semibold mb-4 flex items-center space-x-2">
              <Settings size={18} />
              <span>Presets</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 lg:px-4 py-3 rounded-lg text-sm font-medium transition-colors touch-manipulation min-h-[44px] ${
                    equalizerState.preset === preset
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-600'
                  }`}
                  type="button"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Bass & Treble */}
          <div className="bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-base lg:text-lg font-semibold mb-4">Bass & Treble</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Bass</label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {equalizerState.bass > 0 ? '+' : ''}{equalizerState.bass}dB
                  </span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={equalizerState.bass}
                  onChange={(e) => handleBassChange(e.target.value)}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
                  style={{ minHeight: '44px' }}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Treble</label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {equalizerState.treble > 0 ? '+' : ''}{equalizerState.treble}dB
                  </span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={equalizerState.treble}
                  onChange={(e) => handleTrebleChange(e.target.value)}
                  className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
                  style={{ minHeight: '44px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Frequency Bands */}
        <div className="mt-6 lg:mt-8 bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base lg:text-lg font-semibold mb-4">Frequency Bands</h3>
          <div className="flex justify-between items-end space-x-1 lg:space-x-2 h-32 lg:h-48">
            {equalizerState.bands.map((band, index) => (
              <div key={band.frequency} className="flex flex-col items-center space-y-2 flex-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {band.gain > 0 ? '+' : ''}{band.gain}
                </span>
                <div className="flex flex-col items-center h-20 lg:h-32">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={band.gain}
                    onChange={(e) => handleBandChange(index, e.target.value)}
                    className="h-16 lg:h-28 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider vertical touch-manipulation"
                    style={{
                      writingMode: 'bt-lr',
                      WebkitAppearance: 'slider-vertical',
                      width: '20px',
                      minWidth: '20px'
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center leading-tight">
                  {band.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 lg:mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Equalizer is {equalizerState.isEnabled ? 'enabled' : 'disabled'} • 
            Current preset: {equalizerState.preset}
          </p>
        </div>
      </div>
    </div>
  );
};