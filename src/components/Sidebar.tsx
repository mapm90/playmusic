import React from 'react';
import { 
  Music, 
  FolderOpen, 
  Play, 
  Settings, 
  Moon, 
  Sun, 
  Upload,
  Loader2
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'library' | 'explorer' | 'player' | 'equalizer') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isScanning: boolean;
  onScanFiles: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isDarkMode,
  onToggleDarkMode,
  isScanning,
  onScanFiles
}) => {
  const menuItems = [
    { id: 'library', icon: Music, label: 'Music Library' },
    { id: 'explorer', icon: FolderOpen, label: 'File Explorer' },
    { id: 'player', icon: Play, label: 'Now Playing' },
    { id: 'equalizer', icon: Settings, label: 'Equalizer' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Music Player</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Advanced Audio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Controls */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {/* Load Files Button */}
        <button
          onClick={onScanFiles}
          disabled={isScanning}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg transition-colors duration-200"
        >
          {isScanning ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          <span>{isScanning ? 'Loading...' : 'Load Music'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </div>
  );
};