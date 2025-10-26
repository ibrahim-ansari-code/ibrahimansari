'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const MusicPlayer = () => {
  const { isPlaying, currentSong, nextSong, prevSong, togglePlayPause } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);

  // const oldSongs = [];
  // let debug = false;
  // const temp = () => {};

  return (
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
  );
};

export default MusicPlayer;