import { useState, useRef, useEffect, useCallback } from 'react';
import { Track, PlayerState } from '../types/music';

export const useAudioPlayer = (initialTracks: Track[]) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    volume: 0.7,
    isShuffled: false,
    repeatMode: 'none',
    playlist: initialTracks,
    currentIndex: -1,
  });

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const updateCurrentTime = useCallback(() => {
    if (audioRef.current) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audioRef.current!.currentTime
      }));
    }
  }, []);

  const playTrack = useCallback((track?: Track, index?: number) => {
    if (track && audioRef.current) {
      audioRef.current.src = track.audioUrl;
      setPlayerState(prev => ({
        ...prev,
        currentTrack: track,
        currentIndex: index !== undefined ? index : prev.currentIndex,
        isPlaying: true
      }));
      audioRef.current.play().catch(console.error);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current && playerState.currentTrack) {
      if (playerState.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setPlayerState(prev => ({
        ...prev,
        isPlaying: !prev.isPlaying
      }));
    }
  }, [playerState.isPlaying, playerState.currentTrack]);

  const nextTrack = useCallback(() => {
    if (playerState.playlist.length === 0) return;
    
    const nextIndex = playerState.isShuffled 
      ? Math.floor(Math.random() * playerState.playlist.length)
      : (playerState.currentIndex + 1) % playerState.playlist.length;
    
    const nextTrack = playerState.playlist[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack, nextIndex);
    }
  }, [playerState.currentIndex, playerState.playlist, playerState.isShuffled, playTrack]);

  const previousTrack = useCallback(() => {
    if (playerState.playlist.length === 0) return;
    
    const prevIndex = playerState.currentIndex <= 0 
      ? playerState.playlist.length - 1 
      : playerState.currentIndex - 1;
    
    const prevTrack = playerState.playlist[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack, prevIndex);
    }
  }, [playerState.currentIndex, playerState.playlist, playTrack]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setPlayerState(prev => ({ ...prev, volume }));
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlayerState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isShuffled: !prev.isShuffled }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      repeatMode: prev.repeatMode === 'none' ? 'all' : prev.repeatMode === 'all' ? 'one' : 'none'
    }));
  }, []);

  // Update playlist when initialTracks changes
  useEffect(() => {
    setPlayerState(prev => ({ ...prev, playlist: initialTracks }));
  }, [initialTracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => updateCurrentTime();
    const handleEnded = () => {
      if (playerState.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else if (playerState.repeatMode === 'all' || playerState.currentIndex < playerState.playlist.length - 1) {
        nextTrack();
      } else {
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
      }
    };

    const handleLoadStart = () => {
      setPlayerState(prev => ({ ...prev, currentTime: 0 }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.volume = playerState.volume;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [updateCurrentTime, nextTrack, playerState.repeatMode, playerState.currentIndex, playerState.playlist.length, playerState.volume]);

  return {
    audioRef,
    playerState,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    formatTime
  };
};