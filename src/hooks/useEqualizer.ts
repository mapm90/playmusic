import { useState, useCallback, useRef, useEffect } from 'react';
import { EqualizerState, EqualizerBand } from '../types/music';

export const useEqualizer = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isInitializedRef = useRef(false);

  const [equalizerState, setEqualizerState] = useState<EqualizerState>({
    isEnabled: false,
    preset: 'Flat',
    bands: [
      { frequency: 60, gain: 0, label: '60Hz' },
      { frequency: 170, gain: 0, label: '170Hz' },
      { frequency: 310, gain: 0, label: '310Hz' },
      { frequency: 600, gain: 0, label: '600Hz' },
      { frequency: 1000, gain: 0, label: '1kHz' },
      { frequency: 3000, gain: 0, label: '3kHz' },
      { frequency: 6000, gain: 0, label: '6kHz' },
      { frequency: 12000, gain: 0, label: '12kHz' },
      { frequency: 14000, gain: 0, label: '14kHz' },
      { frequency: 16000, gain: 0, label: '16kHz' }
    ],
    bass: 0,
    treble: 0
  });

  const initializeAudioContext = useCallback(() => {
    if (!audioRef.current || isInitializedRef.current) return;

    try {
      // Create audio context with proper error handling
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported');
        return;
      }

      audioContextRef.current = new AudioContextClass();
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      gainNodeRef.current = audioContextRef.current.createGain();

      // Create filters for each band with error handling
      filtersRef.current = equalizerState.bands.map((band, index) => {
        const filter = audioContextRef.current!.createBiquadFilter();
        filter.type = index === 0 ? 'lowshelf' : index === equalizerState.bands.length - 1 ? 'highshelf' : 'peaking';
        filter.frequency.value = band.frequency;
        filter.Q.value = 1;
        filter.gain.value = band.gain;
        return filter;
      });

      // Connect the audio graph with error handling
      let currentNode: AudioNode = sourceRef.current;
      filtersRef.current.forEach(filter => {
        currentNode.connect(filter);
        currentNode = filter;
      });
      currentNode.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);

      isInitializedRef.current = true;
    } catch (error) {
      console.warn('Failed to initialize audio context:', error);
      isInitializedRef.current = false;
    }
  }, [audioRef, equalizerState.bands]);

  const updateBand = useCallback((index: number, gain: number) => {
    try {
      // Validate input
      if (typeof index !== 'number' || typeof gain !== 'number') {
        console.warn('Invalid parameters for updateBand');
        return;
      }

      if (index < 0 || index >= equalizerState.bands.length) {
        console.warn('Band index out of range');
        return;
      }

      setEqualizerState(prev => ({
        ...prev,
        bands: prev.bands.map((band, i) => 
          i === index ? { ...band, gain } : band
        ),
        preset: 'Custom'
      }));

      // Apply to audio filter with error handling
      if (filtersRef.current[index]) {
        try {
          filtersRef.current[index].gain.value = gain;
        } catch (error) {
          console.warn('Failed to update audio filter:', error);
        }
      }
    } catch (error) {
      console.error('Error in updateBand:', error);
    }
  }, [equalizerState.bands.length]);

  const setBass = useCallback((bass: number) => {
    try {
      if (typeof bass !== 'number') {
        console.warn('Invalid bass value');
        return;
      }

      setEqualizerState(prev => ({ ...prev, bass, preset: 'Custom' }));
      
      if (filtersRef.current[0]) {
        try {
          filtersRef.current[0].gain.value = bass;
        } catch (error) {
          console.warn('Failed to update bass filter:', error);
        }
      }
    } catch (error) {
      console.error('Error in setBass:', error);
    }
  }, []);

  const setTreble = useCallback((treble: number) => {
    try {
      if (typeof treble !== 'number') {
        console.warn('Invalid treble value');
        return;
      }

      setEqualizerState(prev => ({ ...prev, treble, preset: 'Custom' }));
      
      const lastIndex = filtersRef.current.length - 1;
      if (filtersRef.current[lastIndex]) {
        try {
          filtersRef.current[lastIndex].gain.value = treble;
        } catch (error) {
          console.warn('Failed to update treble filter:', error);
        }
      }
    } catch (error) {
      console.error('Error in setTreble:', error);
    }
  }, []);

  const setPreset = useCallback((preset: string) => {
    try {
      if (typeof preset !== 'string') {
        console.warn('Invalid preset value');
        return;
      }

      const presets: Record<string, number[]> = {
        'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        'Rock': [5, 4, -1, -1, 0, 1, 3, 4, 4, 4],
        'Pop': [2, 1, 0, -1, -1, 0, 1, 2, 2, 2],
        'Jazz': [4, 3, 1, 1, -1, -1, 0, 1, 2, 3],
        'Classical': [5, 4, 3, 2, -1, -1, 0, 2, 3, 4],
        'Electronic': [4, 3, 1, 0, -1, 1, 0, 1, 4, 5],
        'Hip Hop': [5, 4, 1, 3, -1, -1, 1, -1, 2, 3],
        'Vocal': [2, 1, -1, -2, -1, 1, 3, 3, 2, 1]
      };

      const gains = presets[preset] || presets['Flat'];
      
      setEqualizerState(prev => ({
        ...prev,
        preset,
        bands: prev.bands.map((band, i) => ({ ...band, gain: gains[i] || 0 })),
        bass: gains[0] || 0,
        treble: gains[gains.length - 1] || 0
      }));

      // Apply to audio filters with error handling
      filtersRef.current.forEach((filter, i) => {
        if (filter && gains[i] !== undefined) {
          try {
            filter.gain.value = gains[i];
          } catch (error) {
            console.warn(`Failed to update filter ${i}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('Error in setPreset:', error);
    }
  }, []);

  const toggleEqualizer = useCallback(() => {
    try {
      setEqualizerState(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
      
      if (gainNodeRef.current) {
        try {
          gainNodeRef.current.gain.value = equalizerState.isEnabled ? 0.5 : 1;
        } catch (error) {
          console.warn('Failed to toggle equalizer gain:', error);
        }
      }
    } catch (error) {
      console.error('Error in toggleEqualizer:', error);
    }
  }, [equalizerState.isEnabled]);

  const resetEqualizer = useCallback(() => {
    try {
      setPreset('Flat');
    } catch (error) {
      console.error('Error in resetEqualizer:', error);
    }
  }, [setPreset]);

  useEffect(() => {
    if (audioRef.current && !isInitializedRef.current) {
      const handleCanPlay = () => {
        try {
          initializeAudioContext();
        } catch (error) {
          console.warn('Failed to initialize on canplay:', error);
        }
      };

      const handleLoadedData = () => {
        try {
          initializeAudioContext();
        } catch (error) {
          console.warn('Failed to initialize on loadeddata:', error);
        }
      };

      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('loadeddata', handleLoadedData);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplay', handleCanPlay);
          audioRef.current.removeEventListener('loadeddata', handleLoadedData);
        }
      };
    }
  }, [audioRef, initializeAudioContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      } catch (error) {
        console.warn('Error closing audio context:', error);
      }
    };
  }, []);

  return {
    equalizerState,
    updateBand,
    setBass,
    setTreble,
    setPreset,
    toggleEqualizer,
    resetEqualizer
  };
};