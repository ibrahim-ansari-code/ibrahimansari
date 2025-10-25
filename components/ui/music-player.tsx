'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

interface Song {
  id: number;
  title: string;
  artist: string;
  src: string;
  duration: number;
}

const MusicPlayer = () => {
  const { currentSongIndex, setCurrentSongIndex, isPlaying, setIsPlaying, audioRef } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);

  // const oldSongs = [];
  // let debug = false;
  
  const songs: Song[] = [
    {
      id: 0,
      title: "cold",
      artist: "nemzzz",
      src: "/Cold Official Video.mp3",
      duration: 0
    },
    {
      id: 1,
      title: "2tone",
      artist: "yeat, don toliver",
      src: "/2TONE feat. Don Toliver.mp3",
      duration: 0
    },
    {
      id: 2,
      title: "fly me to the moon",
      artist: "frank sinatra",
      src: "/Fly Me To The Moon - Frank Sinatra.mp3",
      duration: 0
    },
    {
      id: 3,
      title: "as we speak",
      artist: "yeat ft. drake",
      src: "/As We Speak feat. Drake Official Audio.mp3",
      duration: 0
    },
    {
      id: 4,
      title: "everybody loves somebody",
      artist: "dean martin",
      src: "/Dean Martin Everybody Loves Somebody.mp3",
      duration: 0
    },
    {
      id: 5,
      title: "jimmy cooks",
      artist: "drake, 21 savage",
      src: "/Drake Jimmy Cooks ft 21 Savage.mp3",
      duration: 0
    },
    {
      id: 6,
      title: "humsafar",
      artist: "qurat-ul-ain balouch",
      src: "/Humsafar OST by Qurat-ul-Ain Balouch.mp3",
      duration: 0
    },
    {
      id: 7,
      title: "8pm",
      artist: "nemzzz",
      src: "/NEMZZZ 8PM Official Video.mp3",
      duration: 0
    },
    {
      id: 8,
      title: "sajna da dil torya",
      artist: "zeeshan ali",
      src: "/SAJNA DA DIL TORYA _ VIDEO SONG - 4K _ KABHI MAIN KABHI TUM _ MUSTAFA x SHARJEENA.mp3",
      duration: 0
    }
  ];

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      nextSong();
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, setIsPlaying]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.load();
        audio.play().catch(console.error);
      }
    }, 100);
  };

  const prevSong = () => {
    const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.load();
        audio.play().catch(console.error);
      }
    }, 100);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.src}
        preload="metadata"
      />

      <div className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-black/20 shadow-lg">
          {isExpanded ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-black font-medium">Now Playing</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-black hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-black font-medium text-sm">{currentSong.title}</div>
                <div className="text-black text-xs opacity-70">{currentSong.artist}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSong}
                  className="bg-black text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                >
                  <SkipBack size={16} />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="bg-black text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                
                <button
                  onClick={nextSong}
                  className="bg-black text-white rounded-full p-2 hover:bg-black/80 transition-colors"
                >
                  <SkipForward size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full h-10 bg-black text-white rounded-lg hover:bg-black/80 transition-colors flex items-center justify-center"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;