import React, { useState, useMemo } from 'react';
import { Search, Play, Pause, Music, Clock, User, Disc, Grid, List } from 'lucide-react';
import { Track } from '../types/music';

interface MusicLibraryProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export const MusicLibrary: React.FC<MusicLibraryProps> = ({
  tracks,
  onTrackSelect,
  currentTrack,
  isPlaying
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'album' | 'duration'>('title');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredAndSortedTracks = useMemo(() => {
    let filtered = tracks.filter(track =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'album':
          return a.album.localeCompare(b.album);
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });
  }, [tracks, searchQuery, sortBy]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col pb-20 lg:pb-0">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Music Library</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          {tracks.length} tracks available
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-4 lg:mb-6 space-y-3 lg:space-y-0 lg:flex lg:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tracks, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm lg:text-base"
          />
        </div>
        
        <div className="flex gap-2 lg:gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="flex-1 lg:flex-none px-3 lg:px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm lg:text-base"
          >
            <option value="title">Sort by Title</option>
            <option value="artist">Sort by Artist</option>
            <option value="album">Sort by Album</option>
            <option value="duration">Sort by Duration</option>
          </select>

          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-600 shadow-sm' 
                  : 'hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-600 shadow-sm' 
                  : 'hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-auto">
        {filteredAndSortedTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Music size={48} className="mb-4" />
            <p className="text-lg font-medium">No tracks found</p>
            <p className="text-sm text-center">Try adjusting your search or scan for music files</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-2">
            {filteredAndSortedTracks.map((track, index) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              
              return (
                <div
                  key={track.id}
                  onClick={() => onTrackSelect(track)}
                  className={`flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    isCurrentTrack
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
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
                    <div className="flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <User size={10} />
                        <span className="truncate">{track.artist}</span>
                      </span>
                      <span className="hidden sm:flex items-center space-x-1">
                        <Disc size={10} />
                        <span className="truncate">{track.album}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={10} />
                    <span>{formatTime(track.duration)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
            {filteredAndSortedTracks.map((track) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              
              return (
                <div
                  key={track.id}
                  onClick={() => onTrackSelect(track)}
                  className={`group cursor-pointer transition-all duration-200 ${
                    isCurrentTrack ? 'scale-105' : 'hover:scale-105'
                  }`}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2 lg:mb-3">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isCurrentTrack && isPlaying ? (
                          <Pause size={20} className="text-white" />
                        ) : (
                          <Play size={20} className="text-white" />
                        )}
                      </div>
                    </div>
                    {isCurrentTrack && (
                      <div className="absolute top-2 right-2 w-2 h-2 lg:w-3 lg:h-3 bg-purple-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <h4 className="font-medium truncate text-xs lg:text-sm">{track.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 truncate text-xs">{track.artist}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};