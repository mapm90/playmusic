import React from 'react';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { TrackInfo } from './TrackInfo';
import { Playlist } from './Playlist';
import { VisualizerDisplay } from './VisualizerDisplay';

interface MusicPlayerProps {
  audioPlayer: any;
  equalizer: any;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioPlayer, equalizer }) => {
  const { playerState, togglePlayPause, nextTrack, previousTrack, setVolume, seekTo, toggleShuffle, toggleRepeat, formatTime, playTrack } = audioPlayer;

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col pb-20 lg:pb-0">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Now Playing</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
            {playerState.currentTrack ? 'Enjoy your music' : 'Select a track to start playing'}
          </p>
        </div>

        {playerState.currentTrack ? (
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 flex-1">
            {/* Main Player */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              {/* Album Art and Track Info */}
              <div className="mb-6 lg:mb-8">
                <div className="w-48 h-48 lg:w-64 lg:h-64 mx-auto mb-4 lg:mb-6 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={playerState.currentTrack.coverUrl}
                    alt={playerState.currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <TrackInfo track={playerState.currentTrack} centered />
              </div>

              {/* Progress Bar */}
              <div className="mb-4 lg:mb-6">
                <ProgressBar
                  currentTime={playerState.currentTime}
                  duration={playerState.currentTrack.duration}
                  onSeek={seekTo}
                />
                <div className="flex justify-between text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>{formatTime(playerState.currentTime)}</span>
                  <span>{formatTime(playerState.currentTrack.duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col space-y-4 lg:space-y-6">
                <PlayerControls
                  isPlaying={playerState.isPlaying}
                  isShuffled={playerState.isShuffled}
                  repeatMode={playerState.repeatMode}
                  onPlayPause={togglePlayPause}
                  onPrevious={previousTrack}
                  onNext={nextTrack}
                  onShuffle={toggleShuffle}
                  onRepeat={toggleRepeat}
                />

                <div className="flex justify-center">
                  <VolumeControl
                    volume={playerState.volume}
                    onVolumeChange={setVolume}
                  />
                </div>
              </div>

              {/* Visualizer */}
              <div className="mt-4 lg:mt-6">
                <VisualizerDisplay isPlaying={playerState.isPlaying} />
              </div>
            </div>

            {/* Playlist */}
            <div className="lg:flex lg:flex-col">
              <Playlist
                tracks={playerState.playlist}
                currentTrack={playerState.currentTrack}
                isPlaying={playerState.isPlaying}
                onTrackSelect={playTrack}
                formatTime={formatTime}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-4 lg:mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                </div>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-2">No track selected</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base text-center">
                Go to your music library and select a track to start playing
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};