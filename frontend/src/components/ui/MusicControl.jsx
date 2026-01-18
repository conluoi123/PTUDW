import { IconButton, Slider, Popover, Box, Typography, Tooltip } from '@mui/material';
import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';

export function MusicControl() {
  const { isPlaying, volume, setVolume, toggleMusic } = useMusic();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title={isPlaying ? "Music On" : "Music Off"}>
        <IconButton 
          onClick={handleClick}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box className="p-4 w-64 space-y-3">
          <Typography variant="subtitle2" className="font-semibold">
            Background Music
          </Typography>
          
          <Box className="flex items-center gap-3">
            <IconButton 
              onClick={toggleMusic}
              size="small"
              className="bg-primary/10 hover:bg-primary/20"
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </IconButton>
            
            <Slider
              value={volume}
              onChange={(e, newValue) => setVolume(newValue)}
              min={0}
              max={1}
              step={0.1}
              disabled={!isPlaying}
              className="flex-1"
            />
            
            <Typography variant="caption" className="w-8 text-right">
              {Math.round(volume * 100)}%
            </Typography>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
