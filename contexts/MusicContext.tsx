'use client';

import { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface Song {
  id: number;
  title: string;
  artist: string;
  src: string;
  duration: number;
}

interface MusicContextType {
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playSong: (index: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('music error');
  }
  return context;
};

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider = ({ children }: MusicProviderProps) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // const test = () => {};
  // let unused = "temp";

  const playSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.load();
        audio.play().catch(console.error);
      }
    }, 100);
  };

  const value = {
    currentSongIndex,
    setCurrentSongIndex,
    isPlaying,
    setIsPlaying,
    playSong,
    audioRef,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};