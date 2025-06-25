import React, { useState } from 'react';
import { 
  Music, 
  HardDrive,
  Upload,
  Plus,
  Trash2
} from 'lucide-react';
import { Track } from '../types/music';

interface FileExplorerProps {
  onTrackSelect: (track: Track) => void;
  scannedFiles: Track[];
  onScanFiles: () => void;
  onAddSampleTracks: () => void;
  onClearLibrary: () => void;
  isScanning: boolean;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  onTrackSelect,
  scannedFiles,
  onScanFiles,
  onAddSampleTracks,
  onClearLibrary,
  isScanning
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const audioFiles = files.filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length > 0) {
      onScanFiles();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col pb-20 lg:pb-0">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">File Explorer</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          Browse and select audio files from your device
        </p>
      </div>

      {/* Controls */}
      <div className="mb-4 lg:mb-6 flex flex-col sm:flex-row gap-3 lg:gap-4">
        <button
          onClick={onScanFiles}
          disabled={isScanning}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg transition-colors text-sm lg:text-base font-medium"
        >
          <Upload size={18} />
          <span>{isScanning ? 'Loading...' : 'Select Audio Files'}</span>
        </button>
        
        <div className="flex gap-2 lg:gap-3">
          <button
            onClick={onAddSampleTracks}
            className="flex items-center justify-center space-x-2 px-3 lg:px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm lg:text-base flex-1 sm:flex-none"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Sample</span>
            <span className="sm:hidden">Sample</span>
          </button>

          {scannedFiles.length > 0 && (
            <button
              onClick={onClearLibrary}
              className="flex items-center justify-center space-x-2 px-3 lg:px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm lg:text-base flex-1 sm:flex-none"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear</span>
              <span className="sm:hidden">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-4 lg:mb-6 border-2 border-dashed rounded-lg p-6 lg:p-8 text-center transition-colors ${
          dragOver
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <Music size={40} className="mx-auto mb-3 lg:mb-4 text-gray-400" />
        <p className="text-base lg:text-lg font-medium mb-2">Drop audio files here</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Or tap "Select Audio Files" to browse your device
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          Supported: MP3, WAV, OGG, M4A, AAC, FLAC
        </p>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto">
        {scannedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <HardDrive size={48} className="mb-4" />
            <p className="text-lg font-medium">No audio files loaded</p>
            <p className="text-sm text-center">Select files to start building your library</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-sm lg:text-base">Loaded Files ({scannedFiles.length})</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {scannedFiles.map((track) => (
                <div
                  key={track.id}
                  onClick={() => onTrackSelect(track)}
                  className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors active:bg-gray-100 dark:active:bg-gray-600"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate text-sm lg:text-base">{track.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm truncate">
                      {track.artist} • {track.album}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs truncate lg:hidden">
                      {track.filePath}
                    </p>
                  </div>
                  
                  <div className="text-right text-xs lg:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                    <div className="font-medium">{formatDuration(track.duration)}</div>
                    <div className="text-xs hidden lg:block">
                      {track.format} • {track.fileSize ? formatFileSize(track.fileSize) : 'Unknown'}
                    </div>
                  </div>
                  
                  <Music size={16} className="text-purple-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};