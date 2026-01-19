import { createContext, useContext, useState, useEffect, useRef } from 'react';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(null);

  useEffect(() => {
    // Gaming background music - Action/Electronic style
    // Option 1: Epic gaming music
    // const musicUrl = 'https://cdn.pixabay.com/audio/2022/03/10/audio_4a468f6d5c.mp3'; // Epic Action
    
    // Option 2: Electronic gaming music (uncomment to use)
    const musicUrl = 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3'; // Electronic Gaming
    
    // Option 3: Upbeat gaming music (uncomment  to use)
    // const musicUrl = 'https://cdn.pixabay.com/audio/2023/02/28/audio_c91e16d35c.mp3'; // Upbeat Gaming
    
    audioRef.current = new Audio(musicUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    // Add error handling
    audioRef.current.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
      console.log('Trying alternative music source...');
      // Fallback to another source
      audioRef.current.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    });

    audioRef.current.addEventListener('canplay', () => {
      console.log('✅ Music loaded successfully!');
    });

    // Load saved preferences
    const savedPlaying = localStorage.getItem('musicPlaying') === 'true';
    const savedVolume = parseFloat(localStorage.getItem('musicVolume') || '0.3');
    
    setIsPlaying(savedPlaying);
    setVolume(savedVolume);

    if (savedPlaying) {
      console.log('🎵 Auto-playing music...');
      audioRef.current.play().catch(err => {
        console.log('⚠️ Autoplay prevented by browser:', err.message);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem('musicVolume', volume.toString());
    }
  }, [volume]);

  const toggleMusic = () => {
    if (!audioRef.current) {
      console.error('❌ Audio not initialized');
      return;
    }

    if (isPlaying) {
      console.log('⏸️ Pausing music');
      audioRef.current.pause();
    } else {
      console.log('▶️ Playing music');
      audioRef.current.play().catch(err => {
        console.error('Play error:', err);
        alert('Cannot play music. Please check your browser settings.');
      });
    }
    
    const newState = !isPlaying;
    setIsPlaying(newState);
    localStorage.setItem('musicPlaying', newState.toString());
  };

  const value = {
    isPlaying,
    volume,
    setVolume,
    toggleMusic
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
}
