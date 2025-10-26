'use client';

import { useMusic } from '@/contexts/MusicContext';
import { Play, Pause } from 'lucide-react';

interface PlayButtonProps {
  songIndex: number;
}

export const PlayButton = ({ songIndex }: PlayButtonProps) => {
  const { currentSongIndex, isPlaying, playSong, setIsPlaying } = useMusic();
  const isCurrentSong = currentSongIndex === songIndex;
  
  // const temp = "unused";
  // let debug = false;

  const handlePlayPause = () => {
    if (isCurrentSong && isPlaying) {
      setIsPlaying(false);
      const audio = document.getElementById('global-audio') as HTMLAudioElement;
      if (audio) {
        audio.pause();
      }
    } else {
      playSong(songIndex);
    }
  };

  return (
    <button
      onClick={handlePlayPause}
      className="bg-black text-white rounded-full p-2 hover:bg-black/90 transition-colors flex-shrink-0"
    >
      {isCurrentSong && isPlaying ? <Pause size={16} /> : <Play size={16} />}
    </button>
  );
};