import React, { useState } from 'react';
import { MusicLibrary } from './components/MusicLibrary';
import { FileExplorer } from './components/FileExplorer';
import { MusicPlayer } from './components/MusicPlayer';
import { Equalizer } from './components/Equalizer';
import { MiniPlayer } from './components/MiniPlayer';
import { Sidebar } from './components/Sidebar';
import { MobileNavigation } from './components/MobileNavigation';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useFileScanner } from './hooks/useFileScanner';
import { useEqualizer } from './hooks/useEqualizer';
import { Track } from './types/music';

type ViewType = 'library' | 'explorer' | 'player' | 'equalizer';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('explorer');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const { scannedFiles, isScanning, scanFiles, addSampleTracks, clearLibrary } = useFileScanner();
  const audioPlayer = useAudioPlayer(scannedFiles);
  const equalizer = useEqualizer(audioPlayer.audioRef);

  const handleTrackSelect = (track: Track) => {
    const index = scannedFiles.findIndex(t => t.id === track.id);
    audioPlayer.playTrack(track, index);
    setCurrentView('player');
    setIsMobileSidebarOpen(false);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            currentView={currentView}
            onViewChange={handleViewChange}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            isScanning={isScanning}
            onScanFiles={scanFiles}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative w-64 bg-white dark:bg-gray-800">
              <Sidebar
                currentView={currentView}
                onViewChange={handleViewChange}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                isScanning={isScanning}
                onScanFiles={scanFiles}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <MobileNavigation
              currentView={currentView}
              onViewChange={handleViewChange}
              onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            />
          </div>

          <div className="flex-1 overflow-auto">
            {currentView === 'library' && (
              <MusicLibrary
                tracks={scannedFiles}
                onTrackSelect={handleTrackSelect}
                currentTrack={audioPlayer.playerState.currentTrack}
                isPlaying={audioPlayer.playerState.isPlaying}
              />
            )}
            
            {currentView === 'explorer' && (
              <FileExplorer
                onTrackSelect={handleTrackSelect}
                scannedFiles={scannedFiles}
                onScanFiles={scanFiles}
                onAddSampleTracks={addSampleTracks}
                onClearLibrary={clearLibrary}
                isScanning={isScanning}
              />
            )}
            
            {currentView === 'player' && (
              <MusicPlayer
                audioPlayer={audioPlayer}
                equalizer={equalizer}
              />
            )}
            
            {currentView === 'equalizer' && (
              <Equalizer equalizer={equalizer} />
            )}
          </div>

          {/* Mini Player */}
          {audioPlayer.playerState.currentTrack && currentView !== 'player' && (
            <MiniPlayer
              audioPlayer={audioPlayer}
              onOpenPlayer={() => setCurrentView('player')}
            />
          )}
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioPlayer.audioRef} />
    </div>
  );
}

export default App;