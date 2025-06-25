import React from 'react';
import { 
  Menu,
  Music, 
  FolderOpen, 
  Play, 
  Settings, 
  Moon, 
  Sun
} from 'lucide-react';

type ViewType = 'library' | 'explorer' | 'player' | 'equalizer';

interface MobileNavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onMenuToggle: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentView,
  onViewChange,
  onMenuToggle,
  isDarkMode,
  onToggleDarkMode
}) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'library': return 'Music Library';
      case 'explorer': return 'File Explorer';
      case 'player': return 'Now Playing';
      case 'equalizer': return 'Equalizer';
      default: return 'Music Player';
    }
  };

  const navItems = [
    { id: 'library', icon: Music, label: 'Library' },
    { id: 'explorer', icon: FolderOpen, label: 'Files' },
    { id: 'player', icon: Play, label: 'Player' },
    { id: 'equalizer', icon: Settings, label: 'EQ' },
  ];

  return (
    <>
      {/* Top Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="font-bold text-lg">{getViewTitle()}</h1>
          </div>
          
          <button
            onClick={onToggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-40">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as ViewType)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isActive
                    ? 'text-purple-500 bg-purple-50 dark:bg-purple-900/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};