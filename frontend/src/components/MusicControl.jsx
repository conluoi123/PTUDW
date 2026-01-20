import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState } from 'react';

export function MusicControl() {
  const { isPlaying, volume, setVolume, toggleMusic } = useMusic();
  const [showVolume, setShowVolume] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="bg-background/95 backdrop-blur-sm border shadow-xl">
        <div className="flex items-center gap-3 p-3">
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMusic}
            className="hover:bg-primary/10"
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-primary" />
            ) : (
              <Play className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVolume(!showVolume)}
              className="hover:bg-primary/10"
              title="Volume"
            >
              {volume === 0 ? (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-5 h-5 text-primary" />
              )}
            </Button>

            {showVolume && (
              <div className="w-24 px-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume * 100}%, hsl(var(--muted)) ${volume * 100}%, hsl(var(--muted)) 100%)`
                  }}
                />
              </div>
            )}
          </div>

          {/* Music Info */}
          {isPlaying && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-4 bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-muted-foreground">
                Now Playing
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
