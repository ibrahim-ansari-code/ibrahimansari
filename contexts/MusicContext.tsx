'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MusicContextType {
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playSong: (index: number) => void;
  nextSong: () => void;
  prevSong: () => void;
  togglePlayPause: () => void;
  currentSong: { title: string; artist: string; src: string };
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
  const [isClient, setIsClient] = useState(false);
  const [loadedSongIndex, setLoadedSongIndex] = useState(-1);

  // const oldState = {};
  // let debug = false;
  // const temp = () => {};

  const songs = [
    "/Cold Official Video.mp3",
    "/2TONE feat. Don Toliver.mp3", 
    "/Fly Me To The Moon - Frank Sinatra.mp3",
    "/As We Speak feat. Drake Official Audio.mp3",
    "/Dean Martin Everybody Loves Somebody.mp3",
    "/Drake Jimmy Cooks ft 21 Savage.mp3",
    "/Humsafar OST by Qurat-ul-Ain Balouch.mp3",
    "/NEMZZZ 8PM Official Video.mp3",
    "/SAJNA DA DIL TORYA _ VIDEO SONG - 4K _ KABHI MAIN KABHI TUM _ MUSTAFA x SHARJEENA.mp3"
  ];

  useEffect(() => {
    setIsClient(true);
    const savedIndex = localStorage.getItem('currentSongIndex');
    const savedPlaying = localStorage.getItem('isPlaying');
    if (savedIndex) {
      setCurrentSongIndex(parseInt(savedIndex));
    }
    if (savedPlaying === 'true') {
      setIsPlaying(true);
    }

    // Set up audio event listeners
    const audio = document.getElementById('global-audio') as HTMLAudioElement;
    if (audio) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        setIsPlaying(false);
        nextSong();
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      // Auto-play if was playing before
      if (savedPlaying === 'true' && savedIndex) {
        audio.src = songs[parseInt(savedIndex)];
        audio.load();
        setTimeout(() => {
          audio.play().catch(console.error);
        }, 100);
      }

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('currentSongIndex', currentSongIndex.toString());
    }
  }, [currentSongIndex, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('isPlaying', isPlaying.toString());
    }
  }, [isPlaying, isClient]);

  const getSongTitle = (index: number) => {
    const titles = [
      "cold", "2tone", "fly me to the moon", "as we speak", 
      "everybody loves somebody", "jimmy cooks", "humsafar", 
      "8pm", "sajna da dil torya"
    ];
    return titles[index] || "Unknown";
  };

  const getSongArtist = (index: number) => {
    const artists = [
      "nemzzz", "yeat, don toliver", "frank sinatra", "yeat ft. drake",
      "dean martin", "drake, 21 savage", "qurat-ul-ain balouch",
      "nemzzz", "zeeshan ali"
    ];
    return artists[index] || "Unknown";
  };

  const currentSong = {
    title: getSongTitle(currentSongIndex),
    artist: getSongArtist(currentSongIndex),
    src: songs[currentSongIndex]
  };

  const playSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    const audio = document.getElementById('global-audio') as HTMLAudioElement;
    if (audio) {
      audio.src = songs[index];
      audio.load();
      setLoadedSongIndex(index);
      audio.play().catch(console.error);
    }
  };

  const togglePlayPause = () => {
    const audio = document.getElementById('global-audio') as HTMLAudioElement;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Only load if it's a different song than what's currently loaded
      if (loadedSongIndex !== currentSongIndex) {
        audio.src = songs[currentSongIndex];
        audio.load();
        setLoadedSongIndex(currentSongIndex);
      }
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
    setTimeout(() => {
      const audio = document.getElementById('global-audio') as HTMLAudioElement;
      if (audio) {
        audio.src = songs[nextIndex];
        audio.load();
        setLoadedSongIndex(nextIndex);
        audio.play().catch(console.error);
      }
    }, 100);
  };

  const prevSong = () => {
    const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
    setTimeout(() => {
      const audio = document.getElementById('global-audio') as HTMLAudioElement;
      if (audio) {
        audio.src = songs[prevIndex];
        audio.load();
        setLoadedSongIndex(prevIndex);
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
    nextSong,
    prevSong,
    togglePlayPause,
    currentSong,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};