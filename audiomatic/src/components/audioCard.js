import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';

// Import the audio files directly
import nycTheme from '../audio/nyc-theme.mp3';
import lakeLouiseTheme from '../audio/lake-louise-theme.mp3';
import abstractTheme from '../audio/abstract-theme.mp3';
import battleCatTheme from '../audio/battle-cat-theme.mp3';

function MediaControlCard({ title, artist, audioSrc }) {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', mb: 2, minWidth: 300 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}>
        <CardContent>
          <Typography component="div" variant="h5">
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: 'text.secondary' }}
          >
            {artist}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause" onClick={handlePlayPause}>
            {isPlaying ? (
              <PauseIcon sx={{ height: 38, width: 38 }} />
            ) : (
              <PlayArrowIcon sx={{ height: 38, width: 38 }} />
            )}
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box>
      </Box>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
    </Card>
  );
}

export default function AudioPlayer() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <MediaControlCard
        title="New York City Theme"
        audioSrc={nycTheme}
      />
      <MediaControlCard
        title="Lake Louise Theme"
        audioSrc={lakeLouiseTheme}
      />
      <MediaControlCard
        title="Abstract Theme"
        audioSrc={abstractTheme}
      />
      <MediaControlCard
        title="Battle Cat Theme"
        audioSrc={battleCatTheme}
      />
    </Box>
  );
}