import React, { useState, useCallback } from 'react';
import { Track } from '../types/music';

export const useFileScanner = () => {
  const [scannedFiles, setScannedFiles] = useState<Track[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const createTrackFromFile = (file: File): Promise<Track> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        // Try to extract metadata using the file name
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        const parts = fileName.split(' - ');
        
        let title = fileName;
        let artist = 'Unknown Artist';
        let album = 'Unknown Album';
        
        if (parts.length >= 2) {
          artist = parts[0].trim();
          title = parts[1].trim();
        } else if (parts.length === 1) {
          title = parts[0].trim();
        }

        const track: Track = {
          id: `file-${Date.now()}-${Math.random()}`,
          title,
          artist,
          album,
          duration: audio.duration || 0,
          coverUrl: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300',
          audioUrl: url,
          fileSize: file.size,
          format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
          filePath: file.name
        };

        resolve(track);
      });

      audio.addEventListener('error', () => {
        // If audio fails to load, still create a track entry
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const track: Track = {
          id: `file-${Date.now()}-${Math.random()}`,
          title: fileName,
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          duration: 0,
          coverUrl: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300',
          audioUrl: url,
          fileSize: file.size,
          format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
          filePath: file.name
        };
        resolve(track);
      });

      audio.src = url;
    });
  };

  const scanFiles = useCallback(async () => {
    setIsScanning(true);
    
    try {
      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac';
      
      const files = await new Promise<FileList | null>((resolve) => {
        input.onchange = (e) => {
          const target = e.target as HTMLInputElement;
          resolve(target.files);
        };
        input.oncancel = () => resolve(null);
        input.click();
      });

      if (files && files.length > 0) {
        const tracks: Track[] = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith('audio/')) {
            try {
              const track = await createTrackFromFile(file);
              tracks.push(track);
            } catch (error) {
              console.warn(`Failed to process file: ${file.name}`, error);
            }
          }
        }
        
        setScannedFiles(prevTracks => [...prevTracks, ...tracks]);
      }
    } catch (error) {
      console.error('Error scanning files:', error);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const addSampleTracks = useCallback(() => {
    const sampleTracks: Track[] = [
      {
        id: 'sample-1',
        title: 'Sample Track 1',
        artist: 'Demo Artist',
        album: 'Demo Album',
        duration: 180,
        coverUrl: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300',
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        format: 'WAV'
      },
      {
        id: 'sample-2',
        title: 'Sample Track 2',
        artist: 'Demo Artist',
        album: 'Demo Album',
        duration: 210,
        coverUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        format: 'WAV'
      }
    ];
    
    setScannedFiles(prevTracks => [...prevTracks, ...sampleTracks]);
  }, []);

  const clearLibrary = useCallback(() => {
    // Clean up object URLs to prevent memory leaks
    scannedFiles.forEach(track => {
      if (track.audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(track.audioUrl);
      }
    });
    setScannedFiles([]);
  }, [scannedFiles]);

  return {
    scannedFiles,
    isScanning,
    scanFiles,
    addSampleTracks,
    clearLibrary
  };
};