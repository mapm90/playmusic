export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  fileSize?: number;
  format?: string;
  bitrate?: number;
  sampleRate?: number;
  genre?: string;
  year?: number;
  filePath?: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  playlist: Track[];
  currentIndex: number;
}

export interface EqualizerBand {
  frequency: number;
  gain: number;
  label: string;
}

export interface EqualizerState {
  isEnabled: boolean;
  preset: string;
  bands: EqualizerBand[];
  bass: number;
  treble: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  coverUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}